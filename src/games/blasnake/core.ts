import {
  cglColor,
  CellAttributes,
  CellInfo,
  InputState,
  GridData,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
} from "../../core/coreTypes.js";
import { BaseGame } from "../../core/BaseGame.js";
import { EnemySystemManager } from "./enemies/EnemySystemManager.js";
import { Position, GameState, Enemy } from "./enemies/types.js";

const INITIAL_LIVES = 3;
const SNAKE_MOVEMENT_INTERVAL = 8; // Move once every 8 frames

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface ExplosionEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
}

interface GuideLine {
  x: number;
  y: number;
}

interface BlasnakeGameOptions {
  initialLives?: number;
  movementInterval?: number;
  enemyCount?: number;
}

export class CoreGameLogic extends BaseGame {
  // Enemy system integration
  private enemySystem: EnemySystemManager;

  // Existing game state
  private snake: Position[];
  private direction: Direction;
  private nextDirection: Direction;
  private food: Position;
  private explosions: ExplosionEffect[];
  private guideLines: GuideLine[];
  private movementFrameCounter: number;
  private movementInterval: number;
  private isWaitingForRestart: boolean;
  private playerExplosionPosition: Position | null;
  private highScore: number;

  constructor(options: BlasnakeGameOptions = {}) {
    const {
      initialLives = INITIAL_LIVES,
      movementInterval = SNAKE_MOVEMENT_INTERVAL,
    } = options;
    super({ initialLives });

    // Initialize enemy system
    this.enemySystem = new EnemySystemManager();

    // Initialize existing properties
    this.snake = [];
    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.food = { x: 0, y: 0 };
    this.explosions = [];
    this.guideLines = [];
    this.movementFrameCounter = 0;
    this.movementInterval = movementInterval;
    this.isWaitingForRestart = false;
    this.playerExplosionPosition = null;
    this.highScore = 0;
    this.initializeGame();
  }

  public initializeGame(): void {
    this.resetGame();

    // スネークの初期位置（画面中央付近）
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 4, y: startY },
      { x: startX - 5, y: startY },
      { x: startX - 6, y: startY },
      { x: startX - 7, y: startY },
      { x: startX - 8, y: startY },
      { x: startX - 9, y: startY },
    ];

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    this.generateFood();

    // Clear enemy system (auto-replenishment will handle spawning)
    this.enemySystem.clearAllEnemies();
  }

  private drawStaticElements(): void {
    // Draw border walls
    const wallChar = "#";
    const wallAttributes = {
      entityType: "wall",
      isPassable: false,
      color: "light_black",
    } as const;

    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      this.drawText(wallChar, x, 1, wallAttributes);
      this.drawText(wallChar, x, VIRTUAL_SCREEN_HEIGHT - 1, wallAttributes);
    }
    for (let y = 1; y < VIRTUAL_SCREEN_HEIGHT - 1; y++) {
      this.drawText(wallChar, 0, y, wallAttributes);
      this.drawText(wallChar, VIRTUAL_SCREEN_WIDTH - 1, y, wallAttributes);
    }

    // Draw food
    this.drawText("$", this.food.x, this.food.y, {
      entityType: "food",
      isPassable: true,
      color: "yellow",
    });
  }

  private drawSnake(): void {
    // Draw snake head
    if (this.snake.length > 0) {
      const head = this.snake[0];
      this.drawText("@", head.x, head.y, {
        entityType: "snake_head",
        isPassable: false,
        color: "green",
      });
    }

    // Draw snake body
    for (let i = 1; i < this.snake.length; i++) {
      const segment = this.snake[i];
      this.drawText("*", segment.x, segment.y, {
        entityType: "snake_body",
        isPassable: false,
        color: "light_green",
      });
    }
  }

  private drawEnemies(): void {
    const enemies = this.enemySystem.getAllEnemies();

    for (const enemy of enemies) {
      const displayInfo = this.enemySystem.getEnemyDisplayInfo(enemy);
      this.drawText(displayInfo.char, enemy.x, enemy.y, displayInfo.attributes);
    }
  }

  private drawExplosions(): void {
    for (const explosion of this.explosions) {
      const progress = explosion.duration / explosion.maxDuration;
      let char = "X";
      let color: cglColor = "red";

      if (progress > 0.9) {
        char = "#";
        color = "yellow";
      } else if (progress > 0.8) {
        char = "%";
        color = "yellow";
      } else if (progress > 0.6) {
        char = "*";
        color = "red";
      } else if (progress > 0.4) {
        char = "+";
        color = "light_red";
      } else if (progress > 0.2) {
        char = ".";
        color = "light_red";
      } else {
        char = " ";
      }

      this.drawText(char, explosion.x, explosion.y, {
        entityType: "explosion",
        isPassable: true,
        color: color,
      });
    }
  }

  private drawEnemyDestroyEffects(): void {
    const effects = this.enemySystem.getAllDestroyEffects();

    for (const effect of effects) {
      const progress = effect.duration / effect.maxDuration;
      let char = "X";
      let color: cglColor = "red";

      if (progress > 0.9) {
        char = "#";
        color = "yellow";
      } else if (progress > 0.8) {
        char = "%";
        color = "yellow";
      } else if (progress > 0.6) {
        char = "*";
        color = "red";
      } else if (progress > 0.4) {
        char = "+";
        color = "light_red";
      } else if (progress > 0.2) {
        char = ".";
        color = "light_red";
      } else {
        char = " ";
      }

      this.drawText(char, effect.x, effect.y, {
        entityType: "enemy_destroy_effect",
        isPassable: true,
        color: color,
      });
    }
  }

  private drawScoreDisplayEffects(): void {
    const effects = this.enemySystem.getAllScoreDisplayEffects();

    for (const effect of effects) {
      const progress = effect.duration / effect.maxDuration;

      // スコア表示（エフェクトの位置に表示）
      if (effect.score > 0 && progress > 0.1) {
        const scoreText = `${effect.score}`;
        this.drawText(scoreText, effect.x, effect.y, {
          entityType: "score_display",
          isPassable: true,
          color: "white",
        });

        // 倍率表示（2倍以上の場合、スコアの上に表示）
        if (effect.multiplier > 1) {
          const multiplierText = `x${effect.multiplier}`;
          const multiplierY = Math.max(1, effect.y - 1);
          this.drawText(multiplierText, effect.x, multiplierY, {
            entityType: "multiplier_display",
            isPassable: true,
            color: "cyan",
          });
        }
      }
    }
  }

  private updateExplosions(): void {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      this.explosions[i].duration--;
      if (this.explosions[i].duration <= 0) {
        this.explosions.splice(i, 1);

        // プレイヤー爆発エフェクトが終了したらリスタート
        if (
          this.playerExplosionPosition &&
          this.explosions.length === 0 &&
          this.isWaitingForRestart
        ) {
          this.playerExplosionPosition = null;
          this.isWaitingForRestart = false;
          this.restartFromBeginning();
        }
      }
    }
  }

  private addExplosionEffect(x: number, y: number): void {
    this.explosions.push({
      x: x,
      y: y,
      duration: 60, // 1秒間（60fps想定）
      maxDuration: 60,
    });
  }

  private updateGuideLines(): void {
    this.guideLines = [];

    if (this.snake.length === 0) return;

    const head = this.snake[0];
    let currentX = head.x;
    let currentY = head.y;
    let lineLength = 0;
    const maxLineLength = 5; // Max 5 characters for the guide line

    // Extend guide line in current direction
    while (lineLength < maxLineLength) {
      switch (this.direction) {
        case Direction.UP:
          currentY--;
          break;
        case Direction.DOWN:
          currentY++;
          break;
        case Direction.LEFT:
          currentX--;
          break;
        case Direction.RIGHT:
          currentX++;
          break;
      }

      // Stop if wall is hit
      if (
        currentX < 1 ||
        currentX >= VIRTUAL_SCREEN_WIDTH - 1 ||
        currentY < 2 ||
        currentY >= VIRTUAL_SCREEN_HEIGHT - 1
      ) {
        break;
      }

      // Stop if snake body is hit
      const hitSnake = this.snake.some(
        (segment) => segment.x === currentX && segment.y === currentY
      );
      if (hitSnake) {
        break;
      }

      // Stop if enemy is hit
      const hitEnemy =
        this.enemySystem.getEnemyAtPosition({ x: currentX, y: currentY }) !==
        null;
      if (hitEnemy) {
        break;
      }

      // Stop if food is hit
      if (currentX === this.food.x && currentY === this.food.y) {
        break;
      }

      this.guideLines.push({ x: currentX, y: currentY });
      lineLength++;
    }
  }

  private drawGuideLines(): void {
    for (const guide of this.guideLines) {
      this.drawText(".", guide.x, guide.y, {
        // Use '.' for guide lines
        entityType: "guide_line",
        isPassable: true,
        color: "light_blue", // Standard guide line color
      });
    }
  }

  private generateFood(): void {
    let foodPosition: Position;
    let validPosition = false;

    do {
      foodPosition = {
        x: Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1,
        y: Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 3)) + 2,
      };

      const hasSnake = this.snake.some(
        (segment) =>
          segment.x === foodPosition.x && segment.y === foodPosition.y
      );
      const hasEnemy =
        this.enemySystem.getEnemyAtPosition(foodPosition) !== null;

      validPosition = !hasSnake && !hasEnemy;
    } while (!validPosition);

    this.food = foodPosition;
  }

  private moveSnake(): void {
    if (this.snake.length === 0) return;

    this.direction = this.nextDirection;

    const head = { ...this.snake[0] };

    switch (this.direction) {
      case Direction.UP:
        head.y--;
        break;
      case Direction.DOWN:
        head.y++;
        break;
      case Direction.LEFT:
        head.x--;
        break;
      case Direction.RIGHT:
        head.x++;
        break;
    }

    this.snake.unshift(head);

    // 食べ物を食べたかチェック
    if (head.x === this.food.x && head.y === this.food.y) {
      this.addScore(10);
      this.generateFood();
    } else {
      this.snake.pop();
    }
  }

  private checkCollisions(): void {
    if (this.snake.length === 0) return;

    const head = this.snake[0];

    // 壁との衝突
    if (head.x < 1 || head.x >= 39 || head.y < 2 || head.y >= 24) {
      this.explodePlayer();
      return;
    }

    // 自分の体との衝突
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.explodePlayer();
        return;
      }
    }

    // 敵との衝突（新しい敵システムを使用）
    const collidedEnemy = this.enemySystem.checkEnemyCollision(head);
    if (collidedEnemy) {
      this.explodePlayer();
      return;
    }
  }

  private checkAreaEnclosure(): void {
    if (this.snake.length < 8) return;

    const separateAreas = this.findSeparateAreas();
    console.log(
      `[AreaCheck] Found ${separateAreas.length} separate areas from checkAreaEnclosure.`
    );

    for (const area of separateAreas) {
      console.log(
        `[AreaCheckLoop] Area: size=${area.size}, start=(${area.startPos.x},${area.startPos.y}), borderConn=${area.isBorderConnected}`
      );
      if (!area.isBorderConnected && area.size > 0) {
        console.log(
          `[AreaCheckLoop] Potential enclosed area for explosion at (${area.startPos.x},${area.startPos.y}), size ${area.size}`
        );
        const destroyedEnemies = this.explodeAreaFromPosition(area.startPos);
        if (destroyedEnemies > 0) {
          console.log(
            `💥 BLAST! ${destroyedEnemies} enemies destroyed in area starting at (${area.startPos.x},${area.startPos.y})!`
          );
        } else if (area.size > 0) {
          // Log explosion even if no enemies
          console.log(
            `💥 BLAST! Dry run (no enemies) in area starting at (${area.startPos.x},${area.startPos.y}), size ${area.size}!`
          );
        }
      }
    }
  }

  private findSeparateAreas(): Array<{
    size: number;
    startPos: Position;
    isBorderConnected: boolean;
  }> {
    console.log("[FindSeparateAreas] Starting area search...");
    const visited = Array(VIRTUAL_SCREEN_HEIGHT)
      .fill(null)
      .map(() => Array(VIRTUAL_SCREEN_WIDTH).fill(false));

    const areas: Array<{
      size: number;
      startPos: Position;
      isBorderConnected: boolean;
    }> = [];

    for (let y = 2; y < VIRTUAL_SCREEN_HEIGHT - 1; y++) {
      for (let x = 1; x < VIRTUAL_SCREEN_WIDTH - 1; x++) {
        if (!visited[y][x] && this.isTraversableForAreaFinding(x, y)) {
          console.log(
            `[FindSeparateAreas] Potential area start at (${x}, ${y})`
          );
          const area = this.floodFillArea(
            x,
            y,
            visited,
            this.isTraversableForAreaFinding.bind(this)
          );
          if (area.size > 0) {
            console.log(
              `[FindSeparateAreas] Found area: size=${area.size}, start=(${x},${y}), borderConn=${area.isBorderConnected}`
            );
            areas.push({
              size: area.size,
              startPos: { x, y },
              isBorderConnected: area.isBorderConnected,
            });
          }
        }
      }
    }
    console.log(
      `[FindSeparateAreas] Finished area search. Found ${areas.length} areas.`
    );
    return areas;
  }

  private isTraversableForAreaFinding(x: number, y: number): boolean {
    // Log specific points of interest based on guideline intersection area
    // if (x >= 10 && x <= 20 && y >= 10 && y <= 13) {
    //   const isSnake = this.snake.some(seg => seg.x === x && seg.y === y);
    //   const isGuide = this.guideLines.some(guide => guide.x === x && guide.y === y);
    //   console.log(`[isTFAF_Guideline] Checking (${x},${y}). isSnake: ${isSnake}, isGuide: ${isGuide}`);
    // }

    // 壁チェック（画面境界）
    if (
      x <= 0 ||
      x >= VIRTUAL_SCREEN_WIDTH - 1 ||
      y <= 1 ||
      y >= VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      return false;
    }

    const hasSnake = this.snake.some(
      (segment) => segment.x === x && segment.y === y
    );
    if (hasSnake) return false;

    const hasGuideLine = this.guideLines.some(
      (guide) => guide.x === x && guide.y === y
    );
    if (hasGuideLine) return false;

    return true;
  }

  private isEmptySpace(x: number, y: number): boolean {
    // 壁チェック
    if (
      x <= 0 ||
      x >= VIRTUAL_SCREEN_WIDTH - 1 ||
      y <= 1 ||
      y >= VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      return false;
    }

    // スネークチェック
    const hasSnake = this.snake.some(
      (segment) => segment.x === x && segment.y === y
    );
    if (hasSnake) return false;

    // 食べ物チェック
    if (this.food.x === x && this.food.y === y) return false;

    // 敵チェック（新しい敵システムを使用）
    const hasEnemy = this.enemySystem.getEnemyAtPosition({ x, y }) !== null;
    if (hasEnemy) return false;

    // ガイドラインチェック
    const hasGuideLine = this.guideLines.some(
      (guide) => guide.x === x && guide.y === y
    );
    if (hasGuideLine) return false;

    return true;
  }

  private floodFillArea(
    startX: number,
    startY: number,
    visited: boolean[][],
    isPassableFn: (x: number, y: number) => boolean = this.isEmptySpace.bind(
      this
    )
  ): { size: number; isBorderConnected: boolean } {
    // console.log(`[FloodFillArea] Start flood fill at (${startX}, ${startY})`); // Optional detailed log for floodFillArea start
    if (
      startX < 0 ||
      startX >= VIRTUAL_SCREEN_WIDTH ||
      startY < 0 ||
      startY >= VIRTUAL_SCREEN_HEIGHT ||
      visited[startY][startX] ||
      !isPassableFn(startX, startY)
    ) {
      return { size: 0, isBorderConnected: false };
    }

    let size = 0;
    let isBorderConnected = false;
    const stack: Position[] = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;

      if (
        x < 0 ||
        x >= VIRTUAL_SCREEN_WIDTH ||
        y < 0 ||
        y >= VIRTUAL_SCREEN_HEIGHT ||
        visited[y][x]
      ) {
        continue;
      }

      if (!isPassableFn(x, y)) {
        continue;
      }

      // 境界に接している場合
      if (
        x === 1 ||
        x === VIRTUAL_SCREEN_WIDTH - 2 ||
        y === 2 ||
        y === VIRTUAL_SCREEN_HEIGHT - 2
      ) {
        isBorderConnected = true;
      }

      visited[y][x] = true;
      size++;

      stack.push({ x: x + 1, y });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y + 1 });
      stack.push({ x, y: y - 1 });
    }

    return { size, isBorderConnected };
  }

  private explodeAreaFromPosition(startPos: Position): number {
    return this.explodeArea(startPos.x, startPos.y);
  }

  private explodeArea(startX: number, startY: number): number {
    console.log(`[ExplodeArea] Called for start (${startX},${startY})`);

    // First, find the actual enclosed area size to limit explosion
    const visited = Array(VIRTUAL_SCREEN_HEIGHT)
      .fill(null)
      .map(() => Array(VIRTUAL_SCREEN_WIDTH).fill(false));

    const enclosedArea = this.floodFillArea(
      startX,
      startY,
      visited,
      this.isTraversableForAreaFinding.bind(this)
    );
    console.log(
      `[ExplodeArea] Enclosed area for explosion: size=${enclosedArea.size}, borderConnected=${enclosedArea.isBorderConnected}`
    );

    // If the area is border connected, it's not truly enclosed - don't explode
    if (enclosedArea.isBorderConnected && enclosedArea.size > 10) {
      // Allow small border connected areas to not explode, but log if they would have
      console.log(
        `[ExplodeArea] Area is border connected or too small, skipping explosion. Size: ${enclosedArea.size}`
      );
      return 0;
    }

    // Reset visited array for the actual explosion fill
    const explosionVisited = Array(VIRTUAL_SCREEN_HEIGHT)
      .fill(null)
      .map(() => Array(VIRTUAL_SCREEN_WIDTH).fill(false));

    const enemiesInArea: Enemy[] = [];
    const seenEnemyIds = new Set<string>();
    const fillState = { filledCellCount: 0, maxCellsToFill: enclosedArea.size };

    this.floodFillAndDestroy(
      startX,
      startY,
      explosionVisited,
      fillState,
      (x, y) => {
        this.addExplosionEffect(x, y);
        const enemyAtPos = this.enemySystem.getEnemyAtPosition({ x, y });
        if (
          enemyAtPos &&
          !enemyAtPos.isBlinking &&
          !seenEnemyIds.has(enemyAtPos.id)
        ) {
          // console.log(`[ExplodeAreaFill] Found enemy ${enemyAtPos.id} at (${x},${y}) in fill.`);
          enemiesInArea.push(enemyAtPos);
          seenEnemyIds.add(enemyAtPos.id);
        }
      }
    );
    console.log(
      `[ExplodeArea] Flood fill for explosion covered ${fillState.filledCellCount} cells. Found ${enemiesInArea.length} unique enemies.`
    );

    let actualDestroyedCount = 0;
    if (enemiesInArea.length > 0) {
      const baseScorePerEnemy = 100; // Define base score for blast
      const multiplier = enemiesInArea.length; // Multiplier based on number of enemies in blast
      let totalScoreFromBlast = 0;

      for (const enemyToBlast of enemiesInArea) {
        // Use the new destroyEnemyById from EnemySystemManager
        if (
          this.enemySystem.destroyEnemyById(
            enemyToBlast.id,
            baseScorePerEnemy * multiplier,
            multiplier
          )
        ) {
          actualDestroyedCount++;
          totalScoreFromBlast += baseScorePerEnemy * multiplier;
        }
      }
      if (totalScoreFromBlast > 0) {
        this.addScore(totalScoreFromBlast); // Add accumulated score once
      }
    }
    return actualDestroyedCount;
  }

  private floodFillAndDestroy(
    startX: number,
    startY: number,
    visited: boolean[][],
    fillState: { filledCellCount: number; maxCellsToFill: number },
    callback: (x: number, y: number) => void
  ): void {
    // Log entry and current fill state
    // console.log(`[FFAD] Start: (${startX},${startY}), Count: ${fillState.filledCellCount}, Max: ${fillState.maxCellsToFill}`);

    if (
      fillState.filledCellCount >= fillState.maxCellsToFill ||
      startX <= 0 || // Fixed: Match isTraversableForAreaFinding boundary
      startX >= VIRTUAL_SCREEN_WIDTH - 1 ||
      startY <= 1 || // Fixed: Match isTraversableForAreaFinding boundary
      startY >= VIRTUAL_SCREEN_HEIGHT - 1 ||
      visited[startY][startX]
    ) {
      return;
    }

    // Use the same traversability check as area detection to ensure consistency
    if (!this.isTraversableForAreaFinding(startX, startY)) {
      return;
    }

    visited[startY][startX] = true;
    fillState.filledCellCount++;
    callback(startX, startY);

    // Log after processing a cell
    // console.log(`[FFAD] Processed: (${startX},${startY}), NewCount: ${fillState.filledCellCount}`);

    this.floodFillAndDestroy(startX + 1, startY, visited, fillState, callback);
    this.floodFillAndDestroy(startX - 1, startY, visited, fillState, callback);
    this.floodFillAndDestroy(startX, startY + 1, visited, fillState, callback);
    this.floodFillAndDestroy(startX, startY - 1, visited, fillState, callback);
  }

  protected updateGame(inputState: InputState): void {
    this.drawStaticElements();

    if (this.isWaitingForRestart) {
      this.drawExplosions();
      this.updateExplosions();
      // 画面上部の表示
      // 左上: スコア
      this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });

      // 右上: ハイスコア
      const hiScoreText = `HI ${this.highScore}`;
      const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
      this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });

      // 中央: 残機アイコン（現在のライフ数-1個の@マークを表示）
      const remainingLives = this.getLives() - 1; // 現在プレイ中の分を除く
      if (remainingLives > 0) {
        const livesStartX = Math.floor(
          (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
        );
        for (let i = 0; i < remainingLives; i++) {
          this.drawText("@", livesStartX + i * 2, 0, { color: "green" });
        }
      }
      return;
    }

    const gameState: GameState = {
      gameTime: Date.now(),
      score: this.getScore(),
      snakeLength: this.snake.length,
      totalEnemiesDestroyed: 0, // TODO: Track this
      lives: this.getLives(),
      playerPosition: this.snake[0] || { x: 0, y: 0 },
      snakeSegments: [...this.snake], // スネーク全体の位置情報を追加
      enemies: this.enemySystem.getAllEnemies(),
    };

    // Update all enemies EVERY tick
    const enemyUpdateResult = this.enemySystem.updateAllEnemies(gameState);
    this.addScore(enemyUpdateResult.scoreToAdd);

    this.movementFrameCounter++;

    if (inputState.up && this.direction !== Direction.DOWN) {
      this.nextDirection = Direction.UP;
    } else if (inputState.down && this.direction !== Direction.UP) {
      this.nextDirection = Direction.DOWN;
    } else if (inputState.left && this.direction !== Direction.RIGHT) {
      this.nextDirection = Direction.LEFT;
    } else if (inputState.right && this.direction !== Direction.LEFT) {
      this.nextDirection = Direction.RIGHT;
    }

    if (this.movementFrameCounter >= this.movementInterval) {
      this.movementFrameCounter = 0;
      this.moveSnake();
      // enemySystem.updateAllEnemies was here, moved up
      this.checkCollisions();
    }

    this.enemySystem.updateSpawning(gameState);

    this.updateGuideLines();
    this.drawGuideLines();
    this.drawSnake();
    this.drawEnemies();
    this.drawExplosions();
    this.updateExplosions();
    this.drawEnemyDestroyEffects();
    this.enemySystem.updateAllDestroyEffects();
    this.drawScoreDisplayEffects();
    this.checkAreaEnclosure();

    // 画面上部の表示
    // 左上: スコア
    this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });

    // 右上: ハイスコア
    const hiScoreText = `HI ${this.highScore}`;
    const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
    this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });

    // 中央: 残機アイコン（現在のライフ数-1個の@マークを表示）
    const remainingLives = this.getLives() - 1; // 現在プレイ中の分を除く
    if (remainingLives > 0) {
      const livesStartX = Math.floor(
        (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
      );
      for (let i = 0; i < remainingLives; i++) {
        this.drawText("@", livesStartX + i * 2, 0, { color: "green" });
      }
    }
  }

  private explodePlayer(): void {
    const head = this.snake[0];

    // 自機の位置に爆発エフェクトを追加
    this.addExplosionEffect(head.x, head.y);

    // プレイヤー爆発位置を記録
    this.playerExplosionPosition = { x: head.x, y: head.y };

    // 全ての敵を消滅させる（得点は入らない）
    this.enemySystem.clearAllEnemies();

    // ライフを減らす
    this.loseLife();

    // ゲームオーバーでなければリスタート待機状態に
    if (!this.isGameOver()) {
      this.isWaitingForRestart = true;
      // スネークを非表示にする（空の配列にする）
      this.snake = [];
    }
  }

  private restartFromBeginning(): void {
    // スネークを初期状態に戻す
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 4, y: startY },
      { x: startX - 5, y: startY },
      { x: startX - 6, y: startY },
      { x: startX - 7, y: startY },
      { x: startX - 8, y: startY },
      { x: startX - 9, y: startY },
    ];

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    // 新しい食べ物を生成
    this.generateFood();

    // Enemy system will auto-replenish enemies
  }

  public addScore(points: number): void {
    super.addScore(points);
    // ハイスコア更新
    if (this.getScore() > this.highScore) {
      this.highScore = this.getScore();
    }
  }

  // Debug method for enemy system
  public getEnemyDebugInfo(): any {
    return this.enemySystem.getDebugInfo();
  }
}
