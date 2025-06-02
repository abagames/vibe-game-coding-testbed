import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  SnakeEnemy,
  ThreatLevel,
} from "./types.js";
import { BaseEnemyManager } from "./BaseEnemyManager.js";
import { cglColor, CellAttributes } from "../../../core/coreTypes.js";

export class SnakeEnemyManager extends BaseEnemyManager {
  private readonly SNAKE_CONFIG: {
    displayChar: string;
    bodyChar: string;
    color: cglColor;
    bodyColor: cglColor;
    baseScore: number;
    bodyScore: number;
    moveInterval: number;
    spawnWeight: number;
    maxCount: number;
    threatLevel: ThreatLevel;
    learningObjective: string;
    counterStrategies: string[];
  } = {
    displayChar: "S", // Head
    bodyChar: "s", // Body
    color: "yellow",
    bodyColor: "light_yellow",
    baseScore: 330, // Overall score (judged by head only)
    bodyScore: 0, // Body segment score (not used)
    moveInterval: 12, // Slightly slower than player
    spawnWeight: 8,
    maxCount: 2,
    threatLevel: ThreatLevel.HIGH,
    learningObjective:
      "Understand complex movement patterns and master spatial control",
    counterStrategies: [
      "Aim for the snake enemy's head to defeat it",
      "Make the snake enemy collide with its own tail",
      "Read the snake enemy's movement pattern and anticipate its moves",
      "Avoid the snake enemy's territory and secure a safe area",
    ],
  };

  private readonly SNAKE_BEHAVIOR_CONFIG = {
    initialLength: 3, // Initial length (head + 2 body parts)
    maxLength: 3, // Maximum length (fixed)
    growthInterval: 0, // Does not grow
    territoryRadius: 6, // Territory radius
    pathHistoryLength: 20, // Number of movement history records to keep
    selfCollisionEnabled: true, // Self-collision enabled
    chaseActivationDistance: 8, // Chase activation distance
    territorialReturnDistance: 10, // Territory return distance
    directionChangeChance: 0.2, // Direction change probability
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options?: { isBlinking?: boolean }
  ): SnakeEnemy | null {
    if (type !== EnemyType.SNAKE) {
      return null;
    }

    const config = this.SNAKE_BEHAVIOR_CONFIG;
    const isBlinking = options?.isBlinking || false;
    const blinkDuration = isBlinking ? 120 : 0; // Blink for 2 seconds

    const enemy: SnakeEnemy = {
      id: this.generateEnemyId("snake"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: isBlinking,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.SNAKE,
      baseScore: this.SNAKE_CONFIG.baseScore,
      moveInterval: this.SNAKE_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.SNAKE_CONFIG.threatLevel,
      playerLearningHints: this.SNAKE_CONFIG.counterStrategies,

      // Snake-specific properties
      body: [{ x: position.x, y: position.y }], // Initially, head only
      maxLength: config.maxLength,
      currentLength: 1,
      growthRate: config.growthInterval,
      lastGrowthTime: Date.now(),
      movementPattern: "patrol",
      territoryCenter: { x: position.x, y: position.y },
      territoryRadius: config.territoryRadius,
      pathHistory: [],
      selfCollisionCheck: config.selfCollisionEnabled,
    };

    this.initializeBody(enemy);

    return enemy;
  }

  private initializeBody(enemy: SnakeEnemy): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    // Add body parts up to initial length
    for (let i = 1; i < config.initialLength; i++) {
      const prevSegment = enemy.body[i - 1];
      const newSegment = this.calculateSafeBodyPosition(
        prevSegment,
        enemy.direction
      );
      if (newSegment) {
        enemy.body.push(newSegment);
        enemy.currentLength++;
      }
    }
  }

  private calculateSafeBodyPosition(
    headPos: Position,
    direction: Direction
  ): Position | null {
    // Place body in the opposite direction of the head
    const oppositeDirection = this.getOppositeDirection(direction);
    const bodyPos = { ...headPos };

    switch (oppositeDirection) {
      case Direction.UP:
        bodyPos.y--;
        break;
      case Direction.DOWN:
        bodyPos.y++;
        break;
      case Direction.LEFT:
        bodyPos.x--;
        break;
      case Direction.RIGHT:
        bodyPos.x++;
        break;
    }

    // Boundary check
    if (bodyPos.x < 1 || bodyPos.x >= 39 || bodyPos.y < 2 || bodyPos.y >= 24) {
      return null;
    }

    return bodyPos;
  }

  private getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case Direction.UP:
        return Direction.DOWN;
      case Direction.DOWN:
        return Direction.UP;
      case Direction.LEFT:
        return Direction.RIGHT;
      case Direction.RIGHT:
        return Direction.LEFT;
      default:
        return Direction.DOWN;
    }
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SNAKE) return;

    const snakeEnemy = enemy as SnakeEnemy;

    // Growth processing (disabled)
    this.updateGrowth(snakeEnemy);

    this.updateMovementPattern(snakeEnemy, gameState);

    if (this.checkSelfCollision(snakeEnemy)) {
      snakeEnemy.isDestroyed = true;
      return;
    }

    this.updatePathHistory(snakeEnemy);
  }

  private updateGrowth(enemy: SnakeEnemy): void {
    // Growth system disabled - body fixed at 2 parts
  }

  private growSnake(enemy: SnakeEnemy): void {
    if (enemy.body.length === 0) return;

    const tail = enemy.body[enemy.body.length - 1];
    const newSegment = { ...tail }; // Add new segment at tail position

    enemy.body.push(newSegment);
    enemy.currentLength++;
  }

  private updateMovementPattern(enemy: SnakeEnemy, gameState: GameState): void {
    const playerPos = gameState.playerPosition;
    const distanceToPlayer = this.calculateDistance(
      { x: enemy.x, y: enemy.y },
      playerPos
    );
    const distanceToTerritory = this.calculateDistance(
      { x: enemy.x, y: enemy.y },
      enemy.territoryCenter
    );

    const config = this.SNAKE_BEHAVIOR_CONFIG;

    // Movement pattern determination
    if (distanceToTerritory > config.territorialReturnDistance) {
      enemy.movementPattern = "territorial";
    } else if (distanceToPlayer <= config.chaseActivationDistance) {
      enemy.movementPattern = "chase";
    } else {
      enemy.movementPattern = "patrol";
    }
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  private checkSelfCollision(enemy: SnakeEnemy): boolean {
    if (!enemy.selfCollisionCheck || enemy.body.length <= 1) {
      return false;
    }

    const head = enemy.body[0];

    // Check if head collides with other body parts
    for (let i = 1; i < enemy.body.length; i++) {
      const segment = enemy.body[i];
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }

    return false;
  }

  private updatePathHistory(enemy: SnakeEnemy): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    enemy.pathHistory.push({ x: enemy.x, y: enemy.y });

    if (enemy.pathHistory.length > config.pathHistoryLength) {
      enemy.pathHistory.shift();
    }
  }

  protected updateMovement(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SNAKE) return;

    const snakeEnemy = enemy as SnakeEnemy;

    // Move if not blinking
    if (snakeEnemy.isBlinking) {
      return;
    }

    // Move counter check
    snakeEnemy.moveCounter++;
    if (snakeEnemy.moveCounter < snakeEnemy.moveInterval) {
      return; // Not yet move time
    }

    // Reset move counter
    snakeEnemy.moveCounter = 0;

    this.moveSnakeEnemy(snakeEnemy, gameState);
  }

  private moveSnakeEnemy(snakeEnemy: SnakeEnemy, gameState: GameState): void {
    // Movement direction determination
    this.determineMovementDirection(snakeEnemy, gameState);

    // Calculate new head position
    const newHeadPos = this.calculateNewPosition(snakeEnemy);

    // Movement possibility check (snake-specific)
    if (this.isValidSnakePosition(newHeadPos, snakeEnemy, gameState)) {
      // Move body (from head to tail)
      this.moveSnakeBody(snakeEnemy, newHeadPos);
    } else {
      // If movement fails, try direction change
      this.changeDirection(snakeEnemy);

      // After direction change, try movement again
      const retryHeadPos = this.calculateNewPosition(snakeEnemy);
      if (this.isValidSnakePosition(retryHeadPos, snakeEnemy, gameState)) {
        this.moveSnakeBody(snakeEnemy, retryHeadPos);
      }
    }
  }

  private determineMovementDirection(
    enemy: SnakeEnemy,
    gameState: GameState
  ): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    switch (enemy.movementPattern) {
      case "chase":
        this.setChaseDirection(enemy, gameState.playerPosition);
        break;
      case "territorial":
        this.setTerritorialDirection(enemy);
        break;
      case "patrol":
      default:
        this.setPatrolDirection(enemy);
        break;
    }
  }

  private setChaseDirection(enemy: SnakeEnemy, playerPos: Position): void {
    const dx = playerPos.x - enemy.x;
    const dy = playerPos.y - enemy.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      enemy.direction = dy > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private setTerritorialDirection(enemy: SnakeEnemy): void {
    const dx = enemy.territoryCenter.x - enemy.x;
    const dy = enemy.territoryCenter.y - enemy.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      enemy.direction = dy > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private setPatrolDirection(enemy: SnakeEnemy): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    // Random direction change
    if (Math.random() < config.directionChangeChance) {
      enemy.direction = Math.floor(Math.random() * 4);
    }
  }

  private changeDirection(enemy: SnakeEnemy): void {
    // Find available directions
    const directions = [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ];
    const validDirections = directions.filter((dir) => {
      const testPos = this.calculateNewPositionWithDirection(enemy, dir);
      return this.isValidSnakePosition(testPos, enemy, null);
    });

    if (validDirections.length > 0) {
      enemy.direction =
        validDirections[Math.floor(Math.random() * validDirections.length)];
    }
  }

  protected calculateNewPosition(enemy: SnakeEnemy): Position {
    return this.calculateNewPositionWithDirection(enemy, enemy.direction);
  }

  private calculateNewPositionWithDirection(
    enemy: SnakeEnemy,
    direction: Direction
  ): Position {
    const newPos = { x: enemy.x, y: enemy.y };

    switch (direction) {
      case Direction.UP:
        newPos.y--;
        break;
      case Direction.DOWN:
        newPos.y++;
        break;
      case Direction.LEFT:
        newPos.x--;
        break;
      case Direction.RIGHT:
        newPos.x++;
        break;
    }

    return newPos;
  }

  private isValidSnakePosition(
    pos: Position,
    snakeEnemy: SnakeEnemy,
    gameState: GameState | null
  ): boolean {
    // Boundary check (screen boundary)
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // Self-collision check with own body
    const hasOwnBody = snakeEnemy.body.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasOwnBody) return false;

    if (gameState) {
      // Player's snake collision check
      const hasPlayerSnake = gameState.snakeSegments.some(
        (segment) => segment.x === pos.x && segment.y === pos.y
      );
      if (hasPlayerSnake) return false;

      // Other enemy collision check (only for non-blinking enemies)
      const hasOtherEnemy = this.getAllEnemies().some(
        (enemy) =>
          enemy.id !== snakeEnemy.id &&
          !enemy.isBlinking &&
          enemy.x === pos.x &&
          enemy.y === pos.y
      );
      if (hasOtherEnemy) return false;
    }

    return true;
  }

  private moveSnakeBody(enemy: SnakeEnemy, newHeadPos: Position): void {
    // Add new head position to the front
    enemy.body.unshift(newHeadPos);

    // Update enemy position to head position
    enemy.x = newHeadPos.x;
    enemy.y = newHeadPos.y;

    // Maintain body length (remove tail)
    if (enemy.body.length > enemy.currentLength) {
      enemy.body.pop();
    }
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.SNAKE) {
      return { char: "?", attributes: { color: "white" } };
    }

    const snakeEnemy = enemy as SnakeEnemy;
    const config = this.SNAKE_CONFIG;

    // Blink state processing
    if (enemy.isBlinking) {
      const blinkPhase = Math.floor(enemy.blinkDuration / 10) % 2;
      return {
        char: blinkPhase === 0 ? config.displayChar : "o",
        attributes: {
          color: blinkPhase === 0 ? config.color : "light_red",
        },
      };
    }

    // Normal state (head)
    return {
      char: config.displayChar,
      attributes: {
        color: config.color,
      },
    };
  }

  public getSnakeBodyDisplayInfo(enemy: SnakeEnemy): Array<{
    pos: Position;
    char: string;
    attributes: CellAttributes;
  }> {
    const config = this.SNAKE_CONFIG;
    const bodyDisplay: Array<{
      pos: Position;
      char: string;
      attributes: CellAttributes;
    }> = [];

    // Body segment (excluding head) display
    for (let i = 1; i < enemy.body.length; i++) {
      const segment = enemy.body[i];

      bodyDisplay.push({
        pos: segment,
        char: config.bodyChar,
        attributes: {
          color: enemy.isBlinking ? "light_red" : config.bodyColor,
        },
      });
    }

    return bodyDisplay;
  }

  // Get snake body positions for collision check
  public getSnakeBodyPositions(enemy: SnakeEnemy): Position[] {
    return enemy.body.slice(1); // Body segments excluding head
  }

  // Check if snake head is enclosed
  public isSnakeHeadEnclosed(
    enemy: SnakeEnemy,
    enclosedArea: Position[]
  ): boolean {
    const head = enemy.body[0];
    return enclosedArea.some((pos) => pos.x === head.x && pos.y === head.y);
  }

  // Snake destruction score calculation
  public calculateDestroyScore(enemy: SnakeEnemy): number {
    const config = this.SNAKE_CONFIG;
    const headScore = config.baseScore;
    const bodyScore = (enemy.body.length - 1) * config.bodyScore; // Body excluding head

    return headScore + bodyScore;
  }

  // Snake-specific method
  public spawnSnake(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const snake = this.createEnemy(EnemyType.SNAKE, position, {
      isBlinking,
    });
    if (snake) {
      this.addEnemy(snake);
      return snake.id;
    }
    return null;
  }

  public getSnakeCount(): number {
    return this.getEnemiesByType(EnemyType.SNAKE).length;
  }

  public getAllSnakes(): SnakeEnemy[] {
    return this.getEnemiesByType(EnemyType.SNAKE) as SnakeEnemy[];
  }

  // Get debug information
  public getDebugInfo(): any {
    const snakeEnemies = Array.from(this.enemies.values()) as SnakeEnemy[];
    return {
      totalSnakes: snakeEnemies.length,
      snakes: snakeEnemies.map((snake: SnakeEnemy) => ({
        id: snake.id,
        position: { x: snake.x, y: snake.y },
        bodyLength: snake.body.length,
        currentLength: snake.currentLength,
        maxLength: snake.maxLength,
        movementPattern: snake.movementPattern,
        isBlinking: snake.isBlinking,
      })),
    };
  }
}
