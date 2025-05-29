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
import {
  Position,
  GameState,
  Enemy,
  EnemyType,
  SnakeEnemy,
} from "./enemies/types.js";
import { SnakeEnemyManager } from "./enemies/SnakeEnemyManager.js";
import { SimpleLevelManager } from "./LevelManager.js";

const INITIAL_LIVES = 3;
const SNAKE_MOVEMENT_INTERVAL = 8; // Move once every 8 frames
const INITIAL_SNAKE_LENGTH = 10; // 初期の蛇の長さ
const SCORE_GROWTH_THRESHOLD = 1000; // スコア成長の閾値
const LENGTH_FOR_EXTRA_LIFE = 30; // 機数増加の長さ閾値
const MAX_LIVES = 5; // 最大機数

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

interface GameMessage {
  text: string;
  duration: number;
  maxDuration: number;
  color: cglColor;
}

interface BlasnakeGameOptions {
  initialLives?: number;
  movementInterval?: number;
  enemyCount?: number;
  // デバッグ用オプション
  debugMode?: boolean;
  invincible?: boolean;
  timeAcceleration?: number; // 時間進行の倍率（1.0 = 通常、2.0 = 2倍速）
  constrainToBounds?: boolean; // 画面境界での移動制約
}

export class CoreGameLogic extends BaseGame {
  // Enemy system integration
  private enemySystem: EnemySystemManager;
  // Level system integration
  private levelManager: SimpleLevelManager;
  private lastSpawnTimes: Map<EnemyType, number> = new Map();
  private gameFrameCounter: number = 0;

  // Debug options
  private debugMode: boolean;
  private invincible: boolean;
  private timeAcceleration: number;
  private constrainToBounds: boolean;

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

  // Message system
  private gameMessages: GameMessage[];

  // 蛇の長さ制御システム
  private lastScoreGrowthCheck: number; // 最後にスコア成長をチェックしたスコア
  private hasGrownThisEnclosure: boolean; // 今回の囲みで既に成長したかどうか
  private preservedSnakeLength: number; // プレイヤーがやられた時の蛇の長さを保持

  constructor(options: BlasnakeGameOptions = {}) {
    const {
      initialLives = INITIAL_LIVES,
      movementInterval = SNAKE_MOVEMENT_INTERVAL,
      debugMode = false,
      invincible = false,
      timeAcceleration = 1.0,
      constrainToBounds = false,
    } = options;
    super({ initialLives });

    // Initialize debug options
    this.debugMode = debugMode;
    this.invincible = invincible;
    this.timeAcceleration = timeAcceleration;
    this.constrainToBounds = constrainToBounds;

    // Initialize enemy system
    this.enemySystem = new EnemySystemManager();

    // Initialize level system
    this.levelManager = new SimpleLevelManager(this.timeAcceleration);

    // Initialize spawn tracking for each enemy type
    Object.values(EnemyType).forEach((type) => {
      this.lastSpawnTimes.set(type, 0);
    });

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
    this.gameFrameCounter = 0;

    // Initialize message system
    this.gameMessages = [];

    // Initialize snake length control system
    this.lastScoreGrowthCheck = 0;
    this.hasGrownThisEnclosure = false;
    this.preservedSnakeLength = INITIAL_SNAKE_LENGTH;

    this.initializeGame();
  }

  public initializeGame(): void {
    this.resetGame();

    // Reset level manager
    this.levelManager = new SimpleLevelManager(this.timeAcceleration);
    this.gameFrameCounter = 0;

    // Reset spawn tracking
    Object.values(EnemyType).forEach((type) => {
      this.lastSpawnTimes.set(type, 0);
    });

    // スネークの初期位置（画面中央付近）
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      this.snake.push({ x: startX - i, y: startY });
    }

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    // Reset snake length control system
    this.lastScoreGrowthCheck = 0;
    this.hasGrownThisEnclosure = false;
    this.preservedSnakeLength = INITIAL_SNAKE_LENGTH;

    // Reset message system
    this.gameMessages = [];

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
      // スネーク敵の場合は胴体も描画
      if (enemy.type === EnemyType.SNAKE) {
        const snakeEnemy = enemy as SnakeEnemy;
        const snakeManager = (this.enemySystem as any)
          .snakeManager as SnakeEnemyManager;

        // 胴体セグメントを描画
        const bodyDisplayInfo =
          snakeManager.getSnakeBodyDisplayInfo(snakeEnemy);
        for (const bodySegment of bodyDisplayInfo) {
          this.drawText(
            bodySegment.char,
            bodySegment.pos.x,
            bodySegment.pos.y,
            bodySegment.attributes
          );
        }
      }

      // 頭部（または通常の敵）を描画
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

      // スコア表示（基本点数を表示）
      if (effect.baseScore > 0 && progress > 0.1) {
        const scoreText = `${effect.baseScore}`;
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

  private addGameMessage(
    text: string,
    color: cglColor = "white",
    duration: number = 120
  ): void {
    this.gameMessages.push({
      text,
      color,
      duration,
      maxDuration: duration,
    });
  }

  private updateGameMessages(): void {
    for (let i = this.gameMessages.length - 1; i >= 0; i--) {
      this.gameMessages[i].duration--;
      if (this.gameMessages[i].duration <= 0) {
        this.gameMessages.splice(i, 1);
      }
    }
  }

  private drawGameMessages(): void {
    if (this.gameMessages.length === 0) return;

    // Display the most recent message at the bottom center of the screen
    const message = this.gameMessages[this.gameMessages.length - 1];
    const messageY = VIRTUAL_SCREEN_HEIGHT - 1; // Bottom of the screen

    // Add fade effect based on remaining duration
    const progress = message.duration / message.maxDuration;
    let displayColor = message.color;

    // Fade out in the last 25% of duration
    if (progress < 0.25) {
      displayColor = "light_black";
    }

    this.drawCenteredText(message.text, messageY, {
      entityType: "game_message",
      isPassable: true,
      color: displayColor,
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
        x: Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 6)) + 3, // 3 から 36 の範囲（壁から2マス離れる）
        y: Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 7)) + 4, // 4 から 21 の範囲（壁から2マス離れる）
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

    // ガード敵のターゲットを新しい食べ物の位置に更新
    this.enemySystem.updateGuardTargets(foodPosition);
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

    // デバッグモード：境界制約
    if (this.constrainToBounds) {
      head.x = Math.max(1, Math.min(VIRTUAL_SCREEN_WIDTH - 2, head.x));
      head.y = Math.max(2, Math.min(VIRTUAL_SCREEN_HEIGHT - 2, head.y));
    }

    this.snake.unshift(head);

    // 食べ物を食べたかチェック
    if (head.x === this.food.x && head.y === this.food.y) {
      this.addScore(10);
      this.generateFood();
      // 食べ物を食べて伸びた場合、保存された長さも更新
      this.preservedSnakeLength = this.snake.length;

      // 食べ物を食べた時のGROWメッセージを表示
      this.addGameMessage("GROW!", "green", 60);
    } else {
      this.snake.pop();
    }
  }

  private checkCollisions(): void {
    // 無敵モードの場合は衝突判定をスキップ
    if (this.invincible) {
      return;
    }

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

    // スネーク敵の胴体との衝突チェック
    const enemies = this.enemySystem.getAllEnemies();
    for (const enemy of enemies) {
      if (enemy.type === EnemyType.SNAKE && !enemy.isBlinking) {
        const snakeEnemy = enemy as SnakeEnemy;
        const snakeManager = (this.enemySystem as any)
          .snakeManager as SnakeEnemyManager;
        const bodyPositions = snakeManager.getSnakeBodyPositions(snakeEnemy);

        for (const bodyPos of bodyPositions) {
          if (head.x === bodyPos.x && head.y === bodyPos.y) {
            this.explodePlayer();
            return;
          }
        }
      }
    }
  }

  private checkAreaEnclosure(): void {
    if (this.snake.length < 8) return;

    const separateAreas = this.findSeparateAreas();
    console.log(
      `[AreaCheck] Found ${separateAreas.length} separate areas from checkAreaEnclosure.`
    );

    let anyAreaExploded = false;

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
          anyAreaExploded = true;
        } else if (area.size > 0) {
          // Log explosion even if no enemies
          console.log(
            `💥 BLAST! Dry run (no enemies) in area starting at (${area.startPos.x},${area.startPos.y}), size ${area.size}!`
          );
          anyAreaExploded = true;
        }
      }
    }

    // 囲み破壊が発生した場合、次の囲みでのスコア成長を可能にする
    if (anyAreaExploded) {
      this.hasGrownThisEnclosure = false;
      console.log("🔄 Enclosure growth flag reset for next enclosure");
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

    // スネーク敵の胴体チェック
    const enemies = this.enemySystem.getAllEnemies();
    for (const enemy of enemies) {
      if (enemy.type === EnemyType.SNAKE && !enemy.isBlinking) {
        const snakeEnemy = enemy as SnakeEnemy;
        const snakeManager = (this.enemySystem as any)
          .snakeManager as SnakeEnemyManager;
        const bodyPositions = snakeManager.getSnakeBodyPositions(snakeEnemy);

        for (const bodyPos of bodyPositions) {
          if (bodyPos.x === x && bodyPos.y === y) {
            return false;
          }
        }
      }
    }

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

        // 敵チェック（頭部のみ、スネーク敵も頭部のみで判定）
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
      // 倍率計算時はbaseScore > 0の敵のみをカウント
      const scorableEnemies = enemiesInArea.filter(
        (enemy) => enemy.baseScore > 0
      );
      const multiplier = scorableEnemies.length; // baseScore > 0の敵のみで倍率計算
      let totalScoreFromBlast = 0;

      console.log(
        `[ExplodeArea] Total enemies in area: ${enemiesInArea.length}, Scorable enemies: ${scorableEnemies.length}, Multiplier: ${multiplier}`
      );

      for (const enemyToBlast of enemiesInArea) {
        // ★★★ 追加: baseScoreが0の敵は囲み破壊の対象外とする ★★★
        if (enemyToBlast.baseScore === 0) {
          console.log(
            `[ExplodeArea] Skipping destruction of enemy ${enemyToBlast.id} (type: ${enemyToBlast.type}) due to baseScore === 0.`
          );
          continue; // スコア0の敵は破壊しない
        }

        // 敵の実際のbaseScoreを使用
        const enemyScore = enemyToBlast.baseScore * multiplier;
        // Use the new destroyEnemyById from EnemySystemManager
        if (
          this.enemySystem.destroyEnemyById(
            enemyToBlast.id,
            enemyScore,
            multiplier
          )
        ) {
          actualDestroyedCount++;
          totalScoreFromBlast += enemyScore;
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
    this.gameFrameCounter++;
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

    // Update level system
    const levelChanged = this.levelManager.update();
    if (levelChanged) {
      const currentLevel = this.levelManager.getCurrentLevel();
      console.log(`🎯 Level Changed: ${currentLevel.name}`);

      if (this.levelManager.isInEndlessMode()) {
        console.log(
          `🔄 Endless Mode - Multiplier: ${this.levelManager
            .getEndlessMultiplier()
            .toFixed(1)}x`
        );
      }
    }

    const gameState: GameState = {
      gameTime: this.gameFrameCounter,
      score: this.getScore(),
      snakeLength: this.snake.length,
      totalEnemiesDestroyed: 0, // TODO: Track this
      lives: this.getLives(),
      playerPosition: this.snake[0] || { x: 0, y: 0 },
      snakeSegments: [...this.snake], // スネーク全体の位置情報を追加
      enemies: this.enemySystem.getAllEnemies(),
      foodPosition: this.food, // 食べ物の位置を追加
    } as GameState;

    // Update all enemies EVERY tick
    const enemyUpdateResult = this.enemySystem.updateAllEnemies(gameState);
    this.addScore(enemyUpdateResult.scoreToAdd);

    // New level-based spawning system
    this.updateEnemySpawning(gameState);

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
      this.checkCollisions();
    }

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

    // Update and draw messages
    this.updateGameMessages();
    this.drawGameMessages();

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
      // 現在の蛇の長さを保存してから非表示にする
      this.preservedSnakeLength = this.snake.length;
      this.snake = [];
    }
  }

  private restartFromBeginning(): void {
    // 保存された蛇の長さを使用（最低でも初期長さを保証）
    const currentLength = Math.max(
      this.preservedSnakeLength,
      INITIAL_SNAKE_LENGTH
    );

    // スネークの頭を画面中央に戻し、保存された長さを維持
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [];
    for (let i = 0; i < currentLength; i++) {
      this.snake.push({ x: startX - i, y: startY });
    }

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    // 新しい食べ物を生成
    this.generateFood();

    console.log(`🔄 Snake restarted with preserved length: ${currentLength}`);

    // Enemy system will auto-replenish enemies
    // Note: レベルマネージャーはリセットしない（ライフを失ってもレベルは継続）
  }

  public addScore(points: number): void {
    const oldScore = this.getScore();
    super.addScore(points);
    const newScore = this.getScore();

    // ハイスコア更新
    if (newScore > this.highScore) {
      this.highScore = newScore;
    }

    // スコアによる蛇の成長チェック（1000点ごと）
    const oldThresholds = Math.floor(
      this.lastScoreGrowthCheck / SCORE_GROWTH_THRESHOLD
    );
    const newThresholds = Math.floor(newScore / SCORE_GROWTH_THRESHOLD);

    if (newThresholds > oldThresholds && !this.hasGrownThisEnclosure) {
      // 1000点の閾値を超えた場合、蛇を1つ伸ばす
      this.growSnake();
      this.hasGrownThisEnclosure = true; // 今回の囲みでの成長フラグを設定
      console.log(
        `🐍 Snake grew due to score! Length: ${this.snake.length}, Score: ${newScore}`
      );
    }

    this.lastScoreGrowthCheck = newScore;

    // 長さが30以上になった場合の機数増加チェック
    this.checkExtraLifeFromLength();
  }

  // 蛇を1つ伸ばすメソッド
  private growSnake(): void {
    if (this.snake.length > 0) {
      // 最後のセグメントを複製して追加
      const lastSegment = this.snake[this.snake.length - 1];
      this.snake.push({ ...lastSegment });
      // 保存された長さも更新
      this.preservedSnakeLength = this.snake.length;

      // 成長メッセージを表示
      this.addGameMessage("GROW!", "green", 90);
    }
  }

  // Debug method for enemy system
  public getEnemyDebugInfo(): any {
    return this.enemySystem.getDebugInfo();
  }

  // New level-based enemy spawning system
  private updateEnemySpawning(gameState: GameState): void {
    const currentLevel = this.levelManager.getCurrentLevel();
    const totalEnemyCount = this.getTotalEnemyCount();

    // Check each enemy type for spawning
    for (const enemyType of currentLevel.enemyTypes) {
      const currentCount = this.getEnemyCount(enemyType);
      const lastSpawnTime = this.lastSpawnTimes.get(enemyType) || 0;
      const framesSinceLastSpawn = this.gameFrameCounter - lastSpawnTime;

      const spawnDecision = this.levelManager.shouldSpawnEnemy(
        enemyType,
        currentCount,
        totalEnemyCount,
        framesSinceLastSpawn
      );

      if (spawnDecision.shouldSpawn) {
        this.spawnEnemyOfType(enemyType, gameState);
        this.lastSpawnTimes.set(enemyType, this.gameFrameCounter);

        // Debug logging
        if (spawnDecision.isEmergency) {
          console.log(
            `🚨 Emergency spawn: ${enemyType} (total: ${totalEnemyCount}, current: ${currentCount})`
          );
        } else {
          console.log(
            `✨ Normal spawn: ${enemyType} (${spawnDecision.reason}, total: ${totalEnemyCount})`
          );
        }
      }
    }
  }

  private getTotalEnemyCount(): number {
    return this.enemySystem.getTotalEnemyCount();
  }

  private getEnemyCount(enemyType: EnemyType): number {
    return this.enemySystem
      .getAllEnemies()
      .filter((enemy) => enemy.type === enemyType).length;
  }

  private spawnEnemyOfType(enemyType: EnemyType, gameState: GameState): void {
    let position: Position | null = null;

    // Guard の場合は食べ物の近くにスポーン
    if (enemyType === EnemyType.GUARD) {
      const foodPosition = gameState.foodPosition;
      if (foodPosition) {
        position = this.findValidSpawnPositionNearFood(foodPosition, gameState);
      }
    }

    // Guard用の位置が見つからない場合、または他の敵の場合は通常のランダム位置
    if (!position) {
      position = this.findValidSpawnPosition(gameState);
    }

    if (!position) {
      console.log(`❌ No valid spawn position found for ${enemyType}`);
      return;
    }

    let enemyId: string | null = null;

    switch (enemyType) {
      case EnemyType.WANDERER:
        enemyId = (this.enemySystem as any).wandererManager.spawnWanderer(
          position,
          true
        );
        break;
      case EnemyType.GUARD:
        const foodPosition = gameState.foodPosition;
        if (foodPosition) {
          enemyId = (this.enemySystem as any).guardManager.spawnGuard(
            position,
            foodPosition,
            true
          );
        }
        break;
      case EnemyType.CHASER:
        enemyId = (this.enemySystem as any).chaserManager.spawnChaser(
          position,
          true
        );
        break;
      case EnemyType.SPLITTER:
        enemyId = (this.enemySystem as any).splitterManager.spawnSplitter(
          position,
          true
        );
        break;
      case EnemyType.SPEEDSTER:
        enemyId = (this.enemySystem as any).speedsterManager.spawnSpeedster(
          position,
          true
        );
        break;
      case EnemyType.MIMIC:
        enemyId = (this.enemySystem as any).mimicManager.spawnMimic(
          position,
          true
        );
        break;
      case EnemyType.SNAKE:
        enemyId = (this.enemySystem as any).snakeManager.spawnSnake(
          position,
          true
        );
        break;
      case EnemyType.WALL_CREEPER:
        enemyId = (this.enemySystem as any).wallCreeperManager.spawnWallCreeper(
          position,
          true
        );
        break;
      case EnemyType.GHOST:
        enemyId = (this.enemySystem as any).ghostManager.spawnGhost(
          position,
          true
        );
        break;
      case EnemyType.SWARM:
        // Swarmは特別な処理が必要
        const swarmLeader = (
          this.enemySystem as any
        ).swarmManager.spawnSwarmGroup(position);
        enemyId = swarmLeader ? swarmLeader.id : null;
        break;
      default:
        console.log(`❌ Unknown enemy type: ${enemyType}`);
        return;
    }

    if (enemyId) {
      console.log(
        `👹 ${enemyType} spawned at (${position.x}, ${position.y}) - ID: ${enemyId}`
      );
    } else {
      console.log(
        `❌ Failed to spawn ${enemyType} at (${position.x}, ${position.y})`
      );
    }
  }

  private findValidSpawnPositionNearFood(
    foodPosition: Position,
    gameState: GameState
  ): Position | null {
    const attempts = 20;
    const minDistance = 2;
    const maxDistance = 4;

    for (let i = 0; i < attempts; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance =
        minDistance + Math.random() * (maxDistance - minDistance);
      const x = Math.round(foodPosition.x + Math.cos(angle) * distance);
      const y = Math.round(foodPosition.y + Math.sin(angle) * distance);

      const pos = { x, y };
      if (this.isValidSpawnPosition(pos, gameState)) {
        return pos;
      }
    }

    return null;
  }

  private findValidSpawnPosition(gameState: GameState): Position | null {
    const attempts = 50;

    for (let i = 0; i < attempts; i++) {
      const x = 2 + Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 4));
      const y = 3 + Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 5));
      const pos = { x, y };

      if (this.isValidSpawnPosition(pos, gameState)) {
        return pos;
      }
    }

    return null;
  }

  private isValidSpawnPosition(pos: Position, gameState: GameState): boolean {
    // Check bounds
    if (
      pos.x <= 1 ||
      pos.x >= VIRTUAL_SCREEN_WIDTH - 2 ||
      pos.y <= 2 ||
      pos.y >= VIRTUAL_SCREEN_HEIGHT - 2
    ) {
      return false;
    }

    // Check snake collision
    for (const segment of gameState.snakeSegments) {
      if (segment.x === pos.x && segment.y === pos.y) {
        return false;
      }
    }

    // Check food collision
    if (
      gameState.foodPosition &&
      gameState.foodPosition.x === pos.x &&
      gameState.foodPosition.y === pos.y
    ) {
      return false;
    }

    // Check enemy collision
    for (const enemy of gameState.enemies) {
      if (enemy.x === pos.x && enemy.y === pos.y) {
        return false;
      }
    }

    return true;
  }

  // UI表示用のレベル情報取得
  public getCurrentLevelInfo(): string {
    return this.levelManager.getCurrentLevelInfo();
  }

  // デバッグ用：スポーンシステムの状態表示
  public getSpawnDebugInfo(): any {
    const levelManagerDebugInfo = this.levelManager.getDebugInfo();

    if (
      !levelManagerDebugInfo ||
      typeof levelManagerDebugInfo.currentFrame === "undefined" ||
      typeof levelManagerDebugInfo.currentLevelNumber === "undefined"
    ) {
      console.warn(
        "CoreGameLogic.getSpawnDebugInfo: levelManagerDebugInfo is incomplete. Returning default debug info."
      );
      // Ensure this defensive return matches the structure sim.ts expects for currentLevel and gameTimeSeconds
      return {
        currentLevel: this.levelManager.getCurrentLevelNumber(),
        gameTimeSeconds: this.levelManager.getCurrentFrame() / 60,
        levelName: "Unknown (Error)",
        enemyCounts: {},
        spawnPattern: {},
        isEndlessMode: this.levelManager.isInEndlessMode(), // Use direct getter for consistency
        endlessMultiplier: 1.0,
        emergencyInterval: 300, // Fallback
        normalInterval: 300, // Fallback
        // Add other fields that might be expected with default values
        totalEnemies: 0,
        lastSpawnTimes: {},
        gameFrameCounter: this.gameFrameCounter,
        levelEnemyTypes: [],
        levelDifficultyMultiplier: 1.0,
      };
    }

    const enemyCountsByType = Object.values(EnemyType).reduce(
      (counts, type) => {
        counts[type] = this.getEnemyCount(type);
        return counts;
      },
      {} as Record<EnemyType, number>
    );

    return {
      // Explicitly map fields needed by sim.ts from levelManagerDebugInfo
      currentLevel: levelManagerDebugInfo.currentLevelNumber,
      gameTimeSeconds: levelManagerDebugInfo.currentFrame / 60,
      levelName: levelManagerDebugInfo.levelName,

      // Other properties from levelManagerDebugInfo
      isEndlessMode: levelManagerDebugInfo.isEndlessMode,
      endlessMultiplier: levelManagerDebugInfo.endlessMultiplier,
      levelDifficultyMultiplier:
        levelManagerDebugInfo.levelDifficultyMultiplier,
      levelEnemyTypes: levelManagerDebugInfo.levelEnemyTypes,
      spawnPattern: levelManagerDebugInfo.spawnPattern,
      emergencyInterval: levelManagerDebugInfo.emergencyInterval,
      normalInterval: levelManagerDebugInfo.normalInterval,

      // Properties from CoreGameLogic itself
      totalEnemies: this.getTotalEnemyCount(),
      enemyCounts: enemyCountsByType, // This is CoreGameLogic's calculation of counts
      lastSpawnTimes: Object.fromEntries(this.lastSpawnTimes),
      gameFrameCounter: this.gameFrameCounter, // This is CoreGameLogic's own frame counter
    };
  }

  // 長さが30以上になった場合の機数増加チェック
  private checkExtraLifeFromLength(): void {
    if (
      this.snake.length >= LENGTH_FOR_EXTRA_LIFE &&
      this.getLives() < MAX_LIVES
    ) {
      // 機数を1つ増やす
      const currentLives = this.getLives();
      // BaseGameのライフ管理を直接操作（addLifeメソッドがない場合の対応）
      // 一時的にライフを増やすためにloseLifeの逆操作を行う
      // ここではBaseGameの内部実装に依存するため、より良い方法があれば修正が必要
      console.log(
        `🎯 Extra life gained! Snake length: ${
          this.snake.length
        }, Lives: ${currentLives} -> ${currentLives + 1}`
      );

      // 蛇を初期状態に戻す
      this.resetSnakeToInitialLength();

      // ライフを増やす（BaseGameにaddLifeメソッドがない場合の対応）
      // 直接的な方法がないため、一時的な解決策として実装
      this.addLife();
    }
  }

  // 蛇を初期の長さに戻すメソッド
  private resetSnakeToInitialLength(): void {
    if (this.snake.length > INITIAL_SNAKE_LENGTH) {
      // 現在の頭の位置を保持
      const head = this.snake[0];

      // 初期の長さまで縮める
      this.snake = [];
      for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        let segmentX = head.x;
        let segmentY = head.y;

        // 現在の方向の逆方向に配置
        switch (this.direction) {
          case Direction.RIGHT:
            segmentX = head.x - i;
            break;
          case Direction.LEFT:
            segmentX = head.x + i;
            break;
          case Direction.UP:
            segmentY = head.y + i;
            break;
          case Direction.DOWN:
            segmentY = head.y - i;
            break;
        }

        this.snake.push({ x: segmentX, y: segmentY });
      }

      console.log(`🔄 Snake reset to initial length: ${INITIAL_SNAKE_LENGTH}`);
    }

    // 保存された長さも更新
    this.preservedSnakeLength = INITIAL_SNAKE_LENGTH;
  }

  // ライフを増やすメソッド（BaseGameにない場合の実装）
  private addLife(): void {
    if (this.lives < MAX_LIVES) {
      this.lives++;
      console.log(`💖 Life added! Current lives: ${this.lives}`);

      // エクストラライフメッセージを表示
      this.addGameMessage("EXTRA LIFE!", "cyan", 120);
    }
  }
}
