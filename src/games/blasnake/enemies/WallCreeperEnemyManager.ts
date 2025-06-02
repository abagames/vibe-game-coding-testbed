import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  WallCreeperEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class WallCreeperEnemyManager extends BaseEnemyManager {
  private readonly WALL_CREEPER_CONFIG = {
    displayChar: "W",
    color: "light_black" as cglColor,
    baseScore: 150,
    moveInterval: 12,
    blinkDuration: 120,
    threatLevel: ThreatLevel.MEDIUM,
    minTimeInWall: 120, // Minimum frames to move inside wall (approx. 2 seconds)
    maxTimeInWall: 300, // Maximum frames to move inside wall (approx. 5 seconds)
    crossingSpeedMultiplier: 1.0, // Speed multiplier when crossing open space
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): WallCreeperEnemy | null {
    if (type !== EnemyType.WALL_CREEPER) {
      return null;
    }

    // Adjust to wall position (place on screen edge)
    const wallPosition = this.adjustToWallPosition(position);

    const blinkDuration = options.isBlinking ? 120 : 0;

    const wallCreeper: WallCreeperEnemy = {
      id: this.generateEnemyId("wall_creeper"),
      x: wallPosition.x,
      y: wallPosition.y,
      direction: this.getInitialWallDirection(wallPosition),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.WALL_CREEPER,
      baseScore: this.WALL_CREEPER_CONFIG.baseScore,
      moveInterval: this.WALL_CREEPER_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.WALL_CREEPER_CONFIG.threatLevel,
      playerLearningHints: [
        "WallCreepers move inside walls",
        "Opportunity to attack when crossing open space",
        "Predict their entry point to the opposite wall",
      ],
      currentBehaviorState: "in_wall",
      wallFollowCardinalDirection: this.getInitialWallDirection(wallPosition),
      targetCrossPosition: null,
      behaviorTimer: Math.floor(
        Math.random() *
          (this.WALL_CREEPER_CONFIG.maxTimeInWall -
            this.WALL_CREEPER_CONFIG.minTimeInWall) +
          this.WALL_CREEPER_CONFIG.minTimeInWall
      ),
      exitWallDecisionTimer: 0,
    };

    return wallCreeper;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.WALL_CREEPER) {
      return;
    }

    const wallCreeper = enemy as WallCreeperEnemy;

    // Update behavior timer
    wallCreeper.behaviorTimer--;

    if (wallCreeper.currentBehaviorState === "in_wall") {
      this.updateInWallBehavior(wallCreeper, gameState);
    } else if (wallCreeper.currentBehaviorState === "crossing_open_space") {
      this.updateCrossingBehavior(wallCreeper, gameState);
    }
  }

  private updateInWallBehavior(
    wallCreeper: WallCreeperEnemy,
    gameState: GameState
  ): void {
    // Check timing to exit wall
    if (wallCreeper.behaviorTimer <= 0) {
      this.initiateWallCrossing(wallCreeper);
    }
  }

  private updateCrossingBehavior(
    wallCreeper: WallCreeperEnemy,
    gameState: GameState
  ): void {
    // Check if target position is reached
    if (
      wallCreeper.targetCrossPosition &&
      wallCreeper.x === wallCreeper.targetCrossPosition.x &&
      wallCreeper.y === wallCreeper.targetCrossPosition.y
    ) {
      this.enterWall(wallCreeper);
    }
  }

  private initiateWallCrossing(wallCreeper: WallCreeperEnemy): void {
    // Calculate corresponding position on the opposite wall from current position
    const targetPosition = this.calculateOppositeWallPosition(wallCreeper);

    if (targetPosition) {
      wallCreeper.currentBehaviorState = "crossing_open_space";
      wallCreeper.targetCrossPosition = targetPosition;

      // Set crossing direction
      if (targetPosition.x > wallCreeper.x) {
        wallCreeper.direction = Direction.RIGHT;
      } else if (targetPosition.x < wallCreeper.x) {
        wallCreeper.direction = Direction.LEFT;
      } else if (targetPosition.y > wallCreeper.y) {
        wallCreeper.direction = Direction.DOWN;
      } else {
        wallCreeper.direction = Direction.UP;
      }

      // Adjust movement interval for crossing
      wallCreeper.moveInterval = Math.floor(
        this.WALL_CREEPER_CONFIG.moveInterval /
          this.WALL_CREEPER_CONFIG.crossingSpeedMultiplier
      );
    }
  }

  private enterWall(wallCreeper: WallCreeperEnemy): void {
    wallCreeper.currentBehaviorState = "in_wall";
    wallCreeper.targetCrossPosition = null;

    // Set movement direction in the new wall
    wallCreeper.wallFollowCardinalDirection =
      this.getWallFollowDirection(wallCreeper);
    wallCreeper.direction = wallCreeper.wallFollowCardinalDirection;

    // Set new duration for staying in wall
    wallCreeper.behaviorTimer = Math.floor(
      Math.random() *
        (this.WALL_CREEPER_CONFIG.maxTimeInWall -
          this.WALL_CREEPER_CONFIG.minTimeInWall) +
        this.WALL_CREEPER_CONFIG.minTimeInWall
    );

    // Restore movement interval
    wallCreeper.moveInterval = this.WALL_CREEPER_CONFIG.moveInterval;
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.WALL_CREEPER) {
      return;
    }

    const wallCreeper = enemy as WallCreeperEnemy;

    if (wallCreeper.currentBehaviorState === "in_wall") {
      this.moveAlongWall(wallCreeper);
    } else if (wallCreeper.currentBehaviorState === "crossing_open_space") {
      this.moveCrossingSpace(wallCreeper, gameState);
    }
  }

  private moveAlongWall(wallCreeper: WallCreeperEnemy): void {
    const newPos = this.calculateNewPosition(wallCreeper);

    // Check if wall corner is reached
    if (this.isWallCorner(newPos)) {
      // Change direction at corner
      wallCreeper.wallFollowCardinalDirection = this.getNextWallDirection(
        wallCreeper.wallFollowCardinalDirection,
        newPos
      );
      wallCreeper.direction = wallCreeper.wallFollowCardinalDirection;

      // Move to corner position
      wallCreeper.x = newPos.x;
      wallCreeper.y = newPos.y;
    } else if (this.isWallPosition(newPos)) {
      // Normal movement along wall
      wallCreeper.x = newPos.x;
      wallCreeper.y = newPos.y;
    } else {
      // Change direction if about to move off wall
      wallCreeper.wallFollowCardinalDirection = this.getNextWallDirection(
        wallCreeper.wallFollowCardinalDirection,
        { x: wallCreeper.x, y: wallCreeper.y }
      );
      wallCreeper.direction = wallCreeper.wallFollowCardinalDirection;
    }
  }

  private moveCrossingSpace(
    wallCreeper: WallCreeperEnemy,
    gameState: GameState
  ): void {
    if (!wallCreeper.targetCrossPosition) return;

    const newPos = this.calculateNewPosition(wallCreeper);

    // Check if movement is possible (normal collision detection during open space crossing)
    if (this.isValidPositionForCrossing(newPos, gameState)) {
      wallCreeper.x = newPos.x;
      wallCreeper.y = newPos.y;
    }
  }

  private adjustToWallPosition(position: Position): Position {
    // Adjust to the nearest wall position
    const wallPos = { ...position };

    if (position.x <= 20) {
      wallPos.x = 0; // Left wall
    } else {
      wallPos.x = 39; // Right wall
    }

    // Constrain Y coordinate to valid range
    wallPos.y = Math.max(2, Math.min(23, position.y));

    return wallPos;
  }

  private getInitialWallDirection(position: Position): Direction {
    // Determine initial movement direction based on wall position
    if (position.x === 0) {
      // Left wall - Up or Down
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (position.x === 39) {
      // Right wall - Up or Down
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (position.y === 2) {
      // Top wall - Left or Right
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    } else {
      // Bottom wall - Left or Right
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    }
  }

  private calculateOppositeWallPosition(
    wallCreeper: WallCreeperEnemy
  ): Position | null {
    const currentPos = { x: wallCreeper.x, y: wallCreeper.y };

    if (currentPos.x === 0) {
      // From left wall to right wall
      return { x: 39, y: currentPos.y };
    } else if (currentPos.x === 39) {
      // From right wall to left wall
      return { x: 0, y: currentPos.y };
    } else if (currentPos.y === 2) {
      // From top wall to bottom wall
      return { x: currentPos.x, y: 23 };
    } else if (currentPos.y === 23) {
      // From bottom wall to top wall
      return { x: currentPos.x, y: 2 };
    }

    return null;
  }

  private isWallPosition(pos: Position): boolean {
    return pos.x === 0 || pos.x === 39 || pos.y === 2 || pos.y === 23;
  }

  private isWallCorner(pos: Position): boolean {
    return (pos.x === 0 || pos.x === 39) && (pos.y === 2 || pos.y === 23);
  }

  private getWallFollowDirection(wallCreeper: WallCreeperEnemy): Direction {
    const pos = { x: wallCreeper.x, y: wallCreeper.y };

    if (pos.x === 0) {
      // Left wall
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (pos.x === 39) {
      // Right wall
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (pos.y === 2) {
      // Top wall
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    } else {
      // Bottom wall
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    }
  }

  private getNextWallDirection(
    currentDirection: Direction,
    position: Position
  ): Direction {
    // Corner turning logic
    if (this.isWallCorner(position)) {
      if (position.x === 0 && position.y === 2) {
        // Top-left corner
        return currentDirection === Direction.UP
          ? Direction.RIGHT
          : Direction.DOWN;
      } else if (position.x === 39 && position.y === 2) {
        // Top-right corner
        return currentDirection === Direction.UP
          ? Direction.LEFT
          : Direction.DOWN;
      } else if (position.x === 0 && position.y === 23) {
        // Bottom-left corner
        return currentDirection === Direction.DOWN
          ? Direction.RIGHT
          : Direction.UP;
      } else if (position.x === 39 && position.y === 23) {
        // Bottom-right corner
        return currentDirection === Direction.DOWN
          ? Direction.LEFT
          : Direction.UP;
      }
    }

    return currentDirection;
  }

  private isValidPositionForCrossing(
    pos: Position,
    gameState: GameState
  ): boolean {
    // Movement possibility check during open space crossing
    // Screen boundary check
    if (pos.x < 0 || pos.x >= 40 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // Snake collision check
    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasSnake) return false;

    // Other enemy collision check (only non-blinking enemies)
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) => !enemy.isBlinking && enemy.x === pos.x && enemy.y === pos.y
    );
    if (hasOtherEnemy) return false;

    return true;
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.WALL_CREEPER) {
      return { char: "?", attributes: { color: "white" } };
    }

    const wallCreeper = enemy as WallCreeperEnemy;

    if (wallCreeper.isBlinking) {
      // Display during blinking
      const blinkPhase =
        Math.floor(
          (wallCreeper.maxBlinkDuration - wallCreeper.blinkDuration) / 5
        ) % 2;

      if (blinkPhase === 0) {
        return {
          char: this.WALL_CREEPER_CONFIG.displayChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: "light_red",
          },
        };
      } else {
        return {
          char: " ",
          attributes: {
            entityType: "empty",
            isPassable: true,
          },
        };
      }
    } else {
      // Normal display
      const isPassable =
        wallCreeper.currentBehaviorState === "crossing_open_space";

      return {
        char: this.WALL_CREEPER_CONFIG.displayChar,
        attributes: {
          entityType:
            wallCreeper.currentBehaviorState === "in_wall" ? "wall" : "enemy",
          isPassable: isPassable,
          color: this.WALL_CREEPER_CONFIG.color,
        },
      };
    }
  }

  // WallCreeper-specific methods
  public spawnWallCreeper(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const wallCreeper = this.createEnemy(EnemyType.WALL_CREEPER, position, {
      isBlinking,
    });
    if (wallCreeper) {
      this.addEnemy(wallCreeper);
      return wallCreeper.id;
    }
    return null;
  }

  public getWallCreeperCount(): number {
    return this.getEnemiesByType(EnemyType.WALL_CREEPER).length;
  }

  public getAllWallCreepers(): WallCreeperEnemy[] {
    return this.getEnemiesByType(EnemyType.WALL_CREEPER) as WallCreeperEnemy[];
  }

  // For debugging
  public getWallCreeperDebugInfo(): any {
    const wallCreepers = this.getAllWallCreepers();
    return {
      count: wallCreepers.length,
      states: wallCreepers.map((wc) => ({
        id: wc.id,
        x: wc.x,
        y: wc.y,
        state: wc.currentBehaviorState,
        direction: wc.wallFollowCardinalDirection,
        behaviorTimer: wc.behaviorTimer,
        targetCrossPosition: wc.targetCrossPosition,
      })),
    };
  }
}
