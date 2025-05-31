import {
  cglColor,
  CellAttributes,
  CellInfo,
  InputState,
  GridData,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  AudioService,
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
const INITIAL_SNAKE_LENGTH = 12; // 初期の蛇の長さ
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

export interface BlasnakeGameOptions {
  initialLives?: number;
  movementInterval?: number;
  enemyCount?: number;
  // デバッグ用オプション
  debugMode?: boolean;
  invincible?: boolean;
  timeAcceleration?: number; // 時間進行の倍率（1.0 = 通常、2.0 = 2倍速）
  constrainToBounds?: boolean; // 画面境界での移動制約
  startInPlayingState?: boolean; // Option to start the game directly in the playing state
  audioService?: AudioService; // Add audioService for BaseGame, though CoreGameLogic itself doesn't use it directly for its own sounds, it's for the renderer (BaseGame)
}

export class CoreGameLogic {
  private baseGame: BaseGame; // For drawing & core state management

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

  // Message system
  private gameMessages: GameMessage[];

  // Snake length control system
  private lastScoreGrowthCheck: number;
  private hasGrownThisEnclosure: boolean;
  private preservedSnakeLength: number;

  // Cooldown for area explosion sound - RE-ADD THESE
  private lastAreaExplosionSoundTime: number = -Infinity;
  private readonly areaExplosionSoundCooldown: number = 60; // Match explosion effect duration

  constructor(options: BlasnakeGameOptions = {}, renderer: BaseGame) {
    this.baseGame = renderer;
    const {
      movementInterval = SNAKE_MOVEMENT_INTERVAL,
      debugMode = false,
      invincible = false,
      timeAcceleration = 1.0,
      constrainToBounds = false,
    } = options;

    // Initialize internal game state properties
    this.playerExplosionPosition = null;
    this.gameFrameCounter = 0;

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

    // Initialize message system
    this.gameMessages = [];

    // Initialize snake length control system
    this.lastScoreGrowthCheck = 0;
    this.hasGrownThisEnclosure = false;
    this.preservedSnakeLength = INITIAL_SNAKE_LENGTH;
  }

  public initializeGame(): void {
    this.baseGame.playBgm(); // Start BGM

    // Reset level manager
    this.levelManager = new SimpleLevelManager(this.timeAcceleration);
    this.gameFrameCounter = 0;

    // Reset spawn tracking
    Object.values(EnemyType).forEach((type) => {
      this.lastSpawnTimes.set(type, 0);
    });

    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      this.snake.push({ x: startX - i, y: startY });
    }

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    this.lastScoreGrowthCheck = 0;
    this.hasGrownThisEnclosure = false;
    this.preservedSnakeLength = INITIAL_SNAKE_LENGTH;

    this.gameMessages = [];
    this.generateFood();
    this.enemySystem.clearAllEnemies();

    // Explicitly reset explosion-related states
    this.explosions = [];
    this.playerExplosionPosition = null;
    this.isWaitingForRestart = false;
  }

  public getScore(): number {
    return this.baseGame.getScore();
  }

  public getLives(): number {
    return this.baseGame.getLives();
  }

  public isGameOver(): boolean {
    return this.baseGame.isGameOver();
  }

  public getSnakeHeadPosition(): Position | null {
    if (this.snake.length > 0) {
      return { ...this.snake[0] }; // Return a copy
    }
    return null;
  }

  public isCellSafeForMovement(x: number, y: number): boolean {
    // Check bounds against actual game walls
    if (
      x < 1 || // Wall at x = 0
      x >= VIRTUAL_SCREEN_WIDTH - 1 || // Wall at x = VIRTUAL_SCREEN_WIDTH - 1
      y < 2 || // Wall at y = 1 (row 0 is often UI)
      y >= VIRTUAL_SCREEN_HEIGHT - 1 // Wall at y = VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      return false; // Wall collision
    }

    // Check self-collision (excluding the very tip of the tail, as it will move)
    // For demo AI, we are only concerned with walls and self.
    for (let i = 0; i < this.snake.length - 1; i++) {
      if (this.snake[i].x === x && this.snake[i].y === y) {
        return false; // Self-collision
      }
    }
    return true;
  }

  protected loseLife(): void {
    this.baseGame.loseLife();
  }

  private drawText(
    text: string,
    x: number,
    y: number,
    attributes?: CellAttributes
  ): void {
    this.baseGame.drawText(text, x, y, attributes);
  }

  private drawCenteredText(
    text: string,
    y: number,
    attributes?: CellAttributes
  ): void {
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - text.length / 2);
    this.drawText(text, startX, y, attributes);
  }

  private drawStaticElements(): void {
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

    this.drawText("$", this.food.x, this.food.y, {
      entityType: "food",
      isPassable: true,
      color: "yellow",
    });
  }

  private drawSnake(): void {
    if (this.snake.length > 0) {
      const head = this.snake[0];
      this.drawText("@", head.x, head.y, {
        entityType: "snake_head",
        isPassable: false,
        color: "green",
      });
    }

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
      if (enemy.type === EnemyType.SNAKE) {
        const snakeEnemy = enemy as SnakeEnemy;
        const snakeManager = (this.enemySystem as any)
          .snakeManager as SnakeEnemyManager;

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

      if (effect.baseScore > 0 && progress > 0.1) {
        const scoreText = `${effect.baseScore}`;
        this.drawText(scoreText, effect.x, effect.y, {
          entityType: "score_display",
          isPassable: true,
          color: "white",
        });

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
      duration: 60,
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

    const message = this.gameMessages[this.gameMessages.length - 1];
    const messageY = VIRTUAL_SCREEN_HEIGHT - 1;

    const progress = message.duration / message.maxDuration;
    let displayColor = message.color;

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
    const maxLineLength = 5;

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

      if (
        currentX < 1 ||
        currentX >= VIRTUAL_SCREEN_WIDTH - 1 ||
        currentY < 2 ||
        currentY >= VIRTUAL_SCREEN_HEIGHT - 1
      ) {
        break;
      }

      const hitSnake = this.snake.some(
        (segment) => segment.x === currentX && segment.y === currentY
      );
      if (hitSnake) {
        break;
      }

      const hitEnemy =
        this.enemySystem.getEnemyAtPosition({ x: currentX, y: currentY }) !==
        null;
      if (hitEnemy) {
        break;
      }

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
        entityType: "guide_line",
        isPassable: true,
        color: "light_blue",
      });
    }
  }

  private generateFood(): void {
    let foodPosition: Position;
    let validPosition = false;

    do {
      foodPosition = {
        x: Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 6)) + 3,
        y: Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 7)) + 4,
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

    if (this.constrainToBounds) {
      head.x = Math.max(1, Math.min(VIRTUAL_SCREEN_WIDTH - 2, head.x));
      head.y = Math.max(2, Math.min(VIRTUAL_SCREEN_HEIGHT - 2, head.y));
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.baseGame.play("powerUp");
      this.addScore(10);
      this.generateFood();
      this.preservedSnakeLength = this.snake.length;
      this.addGameMessage("GROW!", "green", 60);
    } else {
      this.snake.pop();
    }
  }

  private checkCollisions(): void {
    if (this.invincible) {
      return;
    }

    if (this.snake.length === 0) return;

    const head = this.snake[0];

    if (head.x < 1 || head.x >= 39 || head.y < 2 || head.y >= 24) {
      this.explodePlayer();
      return;
    }

    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.explodePlayer();
        return;
      }
    }

    const collidedEnemy = this.enemySystem.checkEnemyCollision(head);
    if (collidedEnemy) {
      this.explodePlayer();
      return;
    }

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
    let anyAreaExploded = false;

    for (const area of separateAreas) {
      if (!area.isBorderConnected && area.size > 0) {
        const destroyedEnemies = this.explodeAreaFromPosition(area.startPos);
        if (destroyedEnemies > 0) {
          anyAreaExploded = true;
        } else if (area.size > 0) {
          anyAreaExploded = true;
        }
      }
    }

    if (anyAreaExploded) {
      this.hasGrownThisEnclosure = false;
    }
  }

  private findSeparateAreas(): Array<{
    size: number;
    startPos: Position;
    isBorderConnected: boolean;
  }> {
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
          const area = this.floodFillArea(
            x,
            y,
            visited,
            this.isTraversableForAreaFinding.bind(this)
          );
          if (area.size > 0) {
            areas.push({
              size: area.size,
              startPos: { x, y },
              isBorderConnected: area.isBorderConnected,
            });
          }
        }
      }
    }
    return areas;
  }

  private isTraversableForAreaFinding(x: number, y: number): boolean {
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

    if (this.food.x === x && this.food.y === y) return false;

    const hasEnemy = this.enemySystem.getEnemyAtPosition({ x, y }) !== null;
    if (hasEnemy) return false;

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
    const visited = Array(VIRTUAL_SCREEN_HEIGHT)
      .fill(null)
      .map(() => Array(VIRTUAL_SCREEN_WIDTH).fill(false));

    const enclosedArea = this.floodFillArea(
      startX,
      startY,
      visited,
      this.isTraversableForAreaFinding.bind(this)
    );

    if (enclosedArea.isBorderConnected && enclosedArea.size > 10) {
      return 0;
    }

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
          enemiesInArea.push(enemyAtPos);
          seenEnemyIds.add(enemyAtPos.id);
        }
      }
    );

    let actualDestroyedCount = 0;
    if (enemiesInArea.length > 0) {
      const scorableEnemies = enemiesInArea.filter(
        (enemy) => enemy.baseScore > 0
      );
      const multiplier = scorableEnemies.length;
      let totalScoreFromBlast = 0;

      for (const enemyToBlast of enemiesInArea) {
        if (enemyToBlast.baseScore === 0) {
          continue;
        }

        const enemyScore = enemyToBlast.baseScore * multiplier;
        if (
          this.enemySystem.destroyEnemyById(
            enemyToBlast.id,
            enemyScore,
            multiplier
          )
        ) {
          actualDestroyedCount++;
          totalScoreFromBlast += enemyScore;
          const enemyTypeSeed = Object.values(EnemyType).indexOf(
            enemyToBlast.type
          );
          this.baseGame.play(
            "coin",
            enemyTypeSeed >= 0 ? enemyTypeSeed : undefined
          );
        }
      }
      if (totalScoreFromBlast > 0) {
        this.addScore(totalScoreFromBlast);
      }
    }
    if (
      actualDestroyedCount > 0 ||
      (enclosedArea.size > 0 && enemiesInArea.length === 0)
    ) {
      if (
        this.gameFrameCounter >=
        this.lastAreaExplosionSoundTime + this.areaExplosionSoundCooldown
      ) {
        this.baseGame.play("explosion", 100);
        this.lastAreaExplosionSoundTime = this.gameFrameCounter;
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
    if (
      fillState.filledCellCount >= fillState.maxCellsToFill ||
      startX <= 0 ||
      startX >= VIRTUAL_SCREEN_WIDTH - 1 ||
      startY <= 1 ||
      startY >= VIRTUAL_SCREEN_HEIGHT - 1 ||
      visited[startY][startX]
    ) {
      return;
    }

    if (!this.isTraversableForAreaFinding(startX, startY)) {
      return;
    }

    visited[startY][startX] = true;
    fillState.filledCellCount++;
    callback(startX, startY);

    this.floodFillAndDestroy(startX + 1, startY, visited, fillState, callback);
    this.floodFillAndDestroy(startX - 1, startY, visited, fillState, callback);
    this.floodFillAndDestroy(startX, startY + 1, visited, fillState, callback);
    this.floodFillAndDestroy(startX, startY - 1, visited, fillState, callback);
  }

  public update(inputState: InputState): void {
    if (this.isGameOver()) {
      return;
    }

    this.gameFrameCounter++;
    this.drawStaticElements();

    if (this.isWaitingForRestart) {
      this.drawExplosions();
      this.updateExplosions();
      this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });
      const hiScoreText = `HI ${this.baseGame.getHighScore()}`;
      const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
      this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });
      const remainingLives = this.getLives() - 1;
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
      totalEnemiesDestroyed: 0,
      lives: this.getLives(),
      playerPosition: this.snake[0] || { x: 0, y: 0 },
      snakeSegments: [...this.snake],
      enemies: this.enemySystem.getAllEnemies(),
      foodPosition: this.food,
    } as GameState;

    const enemyUpdateResult = this.enemySystem.updateAllEnemies(gameState);
    this.addScore(enemyUpdateResult.scoreToAdd);

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

    this.updateGameMessages();
    this.drawGameMessages();

    this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });
    const hiScoreText = `HI ${this.baseGame.getHighScore()}`;
    const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
    this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });
    const remainingLives = this.getLives() - 1;
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
    if (this.snake.length === 0 && !this.playerExplosionPosition) return;

    const head = this.playerExplosionPosition || this.snake[0];
    if (!head) return;

    this.baseGame.play("explosion", 200);
    this.addExplosionEffect(head.x, head.y);
    this.playerExplosionPosition = { x: head.x, y: head.y };
    this.enemySystem.clearAllEnemies();
    this.loseLife();

    if (!this.isGameOver()) {
      this.isWaitingForRestart = true;
      this.preservedSnakeLength =
        this.snake.length > 0 ? this.snake.length : this.preservedSnakeLength;
      this.snake = [];
    } else {
      this.isWaitingForRestart = true;
      this.snake = [];
    }
  }

  private restartFromBeginning(): void {
    const currentLength = Math.max(
      this.preservedSnakeLength,
      INITIAL_SNAKE_LENGTH
    );

    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [];
    for (let i = 0; i < currentLength; i++) {
      this.snake.push({ x: startX - i, y: startY });
    }

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;
    this.generateFood();
    console.log(`🔄 Snake restarted with preserved length: ${currentLength}`);
  }

  public addScore(points: number): void {
    if (points === 0) return;
    this.baseGame.addScore(points);
    const newScore = this.getScore();

    const oldThresholds = Math.floor(
      this.lastScoreGrowthCheck / SCORE_GROWTH_THRESHOLD
    );
    const newThresholds = Math.floor(newScore / SCORE_GROWTH_THRESHOLD);

    if (newThresholds > oldThresholds && !this.hasGrownThisEnclosure) {
      this.growSnake();
      this.hasGrownThisEnclosure = true;
      console.log(
        `🐍 Snake grew due to score! Length: ${this.snake.length}, Score: ${newScore}`
      );
    }

    this.lastScoreGrowthCheck = newScore;
    this.checkExtraLifeFromLength();
  }

  private growSnake(): void {
    if (this.snake.length > 0) {
      const lastSegment = this.snake[this.snake.length - 1];
      this.snake.push({ ...lastSegment });
      this.preservedSnakeLength = this.snake.length;
      this.addGameMessage("GROW!", "green", 90);
    }
  }

  public getEnemyDebugInfo(): any {
    return this.enemySystem.getDebugInfo();
  }

  private updateEnemySpawning(gameState: GameState): void {
    const currentLevel = this.levelManager.getCurrentLevel();
    const totalEnemyCount = this.getTotalEnemyCount();

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

    if (enemyType === EnemyType.GUARD) {
      const foodPosition = gameState.foodPosition;
      if (foodPosition) {
        position = this.findValidSpawnPositionNearFood(foodPosition, gameState);
      }
    }

    if (!position) {
      position = this.findValidSpawnPosition(gameState);
    }

    if (!position) {
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
        const swarmLeader = (
          this.enemySystem as any
        ).swarmManager.spawnSwarmGroup(position);
        enemyId = swarmLeader ? swarmLeader.id : null;
        break;
      default:
        return;
    }

    if (enemyId) {
      const enemyTypeSeed = Object.values(EnemyType).indexOf(enemyType);
      this.baseGame.play(
        "laser",
        enemyTypeSeed >= 0 ? enemyTypeSeed : undefined
      );
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
    if (
      pos.x <= 1 ||
      pos.x >= VIRTUAL_SCREEN_WIDTH - 2 ||
      pos.y <= 2 ||
      pos.y >= VIRTUAL_SCREEN_HEIGHT - 2
    ) {
      return false;
    }

    for (const segment of gameState.snakeSegments) {
      if (segment.x === pos.x && segment.y === pos.y) {
        return false;
      }
    }

    if (
      gameState.foodPosition &&
      gameState.foodPosition.x === pos.x &&
      gameState.foodPosition.y === pos.y
    ) {
      return false;
    }

    for (const enemy of gameState.enemies) {
      if (enemy.x === pos.x && enemy.y === pos.y) {
        return false;
      }
    }

    return true;
  }

  public getCurrentLevelInfo(): string {
    return this.levelManager.getCurrentLevelInfo();
  }

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
      return {
        currentLevel: this.levelManager.getCurrentLevelNumber(),
        gameTimeSeconds: this.levelManager.getCurrentFrame() / 60,
        levelName: "Unknown (Error)",
        enemyCounts: {},
        spawnPattern: {},
        isEndlessMode: this.levelManager.isInEndlessMode(),
        endlessMultiplier: 1.0,
        emergencyInterval: 300,
        normalInterval: 300,
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
      currentLevel: levelManagerDebugInfo.currentLevelNumber,
      gameTimeSeconds: levelManagerDebugInfo.currentFrame / 60,
      levelName: levelManagerDebugInfo.levelName,
      isEndlessMode: levelManagerDebugInfo.isEndlessMode,
      endlessMultiplier: levelManagerDebugInfo.endlessMultiplier,
      levelDifficultyMultiplier:
        levelManagerDebugInfo.levelDifficultyMultiplier,
      levelEnemyTypes: levelManagerDebugInfo.levelEnemyTypes,
      spawnPattern: levelManagerDebugInfo.spawnPattern,
      emergencyInterval: levelManagerDebugInfo.emergencyInterval,
      normalInterval: levelManagerDebugInfo.normalInterval,
      totalEnemies: this.getTotalEnemyCount(),
      enemyCounts: enemyCountsByType,
      lastSpawnTimes: Object.fromEntries(this.lastSpawnTimes),
      gameFrameCounter: this.gameFrameCounter,
    };
  }

  private checkExtraLifeFromLength(): void {
    if (this.snake.length >= LENGTH_FOR_EXTRA_LIFE) {
      console.log(
        `🎯 Extra life gained! Snake length: ${
          this.snake.length
        }, Lives: ${this.getLives()} -> ${this.getLives() + 1}`
      );

      this.resetSnakeToInitialLength();
      if (this.getLives() < MAX_LIVES) {
        this.addLifeInternal();
      }
    }
  }

  private resetSnakeToInitialLength(): void {
    if (this.snake.length > INITIAL_SNAKE_LENGTH) {
      const head = this.snake[0];
      this.snake = [];
      for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        let segmentX = head.x;
        let segmentY = head.y;

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
    this.preservedSnakeLength = INITIAL_SNAKE_LENGTH;
  }

  private addLifeInternal(): void {
    if (this.getLives() < MAX_LIVES) {
      this.baseGame.gainLife(1);
      this.baseGame.play("powerUp");
      console.log(`💖 Life added! Current lives: ${this.getLives()}`);
      this.addGameMessage("EXTRA LIFE!", "cyan", 120);
    }
  }
}
