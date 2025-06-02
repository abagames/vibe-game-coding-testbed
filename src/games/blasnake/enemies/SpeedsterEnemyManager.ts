import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  SpeedsterEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class SpeedsterEnemyManager extends BaseEnemyManager {
  private readonly SPEEDSTER_CONFIG = {
    displayChar: "F",
    color: "cyan" as cglColor,
    blinkingColor: "light_cyan" as cglColor,
    baseScore: 300,
    moveInterval: 6, // Roughly 3x player speed
    speedMultiplier: 3.0,
    directionChangeInterval: 10, // Default: 10 (0.33 seconds)
    directionChangeChance: 0.3,
    wallReflectionEnabled: true,
    predictabilityThreshold: 5,
    blinkDuration: 120,
    threatLevel: ThreatLevel.MEDIUM,
    spawnWeight: 50, // Significantly increased spawn rate for testing
    maxCount: 4, // Increased max count for testing
    minMovementDistance: 8, // Minimum movement distance
    maxMovementDistance: 12, // Maximum movement distance
    pauseDuration: 60, // Pause duration (1 second)
    learningObjective: "Improve reaction time and dynamic decision-making",
    counterStrategies: [
      "Observe and predict Speedster's rotation pattern",
      "Enclose while paused",
      "Anticipate movement based on rotation direction",
      "Utilize corner turns for enclosure",
    ],
  };

  // Clockwise and counter-clockwise direction order
  private readonly CLOCKWISE_DIRECTIONS = [
    Direction.RIGHT,
    Direction.DOWN,
    Direction.LEFT,
    Direction.UP,
  ];
  private readonly COUNTERCLOCKWISE_DIRECTIONS = [
    Direction.RIGHT,
    Direction.UP,
    Direction.LEFT,
    Direction.DOWN,
  ];

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): SpeedsterEnemy | null {
    if (type !== EnemyType.SPEEDSTER) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.SPEEDSTER_CONFIG.blinkDuration
      : 0;

    // Determine rotation pattern randomly
    const rotationPattern =
      Math.random() < 0.5 ? "clockwise" : "counterclockwise";

    // Determine initial direction randomly
    const directions =
      rotationPattern === "clockwise"
        ? this.CLOCKWISE_DIRECTIONS
        : this.COUNTERCLOCKWISE_DIRECTIONS;
    const randomDirectionIndex = Math.floor(Math.random() * directions.length);
    const initialDirection = directions[randomDirectionIndex];
    const currentDirectionIndex = randomDirectionIndex;

    // Determine movement distance randomly (8-12 cells)
    const movementDistance =
      Math.floor(
        Math.random() *
          (this.SPEEDSTER_CONFIG.maxMovementDistance -
            this.SPEEDSTER_CONFIG.minMovementDistance +
            1)
      ) + this.SPEEDSTER_CONFIG.minMovementDistance;

    const speedster: SpeedsterEnemy = {
      id: this.generateEnemyId("speedster"),
      x: position.x,
      y: position.y,
      direction: initialDirection,
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.SPEEDSTER,
      baseScore: this.SPEEDSTER_CONFIG.baseScore,
      moveInterval: this.SPEEDSTER_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.SPEEDSTER_CONFIG.threatLevel,
      playerLearningHints: this.SPEEDSTER_CONFIG.counterStrategies,
      speedMultiplier: this.SPEEDSTER_CONFIG.speedMultiplier,
      directionChangeTimer: 0,
      lastDirectionChange: 0,
      boostCooldown: 0,
      predictabilityCounter: 0,
      movementState: "moving",
      pauseDuration: 0,
      maxPauseDuration: this.SPEEDSTER_CONFIG.pauseDuration,
      movementDistance: 0,
      maxMovementDistance: movementDistance,
      rotationPattern: rotationPattern,
      currentDirectionIndex: currentDirectionIndex,
    };

    return speedster;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SPEEDSTER) {
      return;
    }

    const speedster = enemy as SpeedsterEnemy;

    // Handle paused state
    if (speedster.movementState === "paused") {
      speedster.pauseDuration--;
      if (speedster.pauseDuration <= 0) {
        // End pause, select new direction and start moving
        this.changeDirection(speedster);
        speedster.movementState = "moving";
        speedster.movementDistance = 0;
        speedster.predictabilityCounter = 0;
      }
      return;
    }

    // Handle moving state
    speedster.directionChangeTimer++;
    speedster.predictabilityCounter++;

    // Update boost cooldown
    if (speedster.boostCooldown > 0) {
      speedster.boostCooldown--;
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SPEEDSTER) {
      return;
    }

    const speedster = enemy as SpeedsterEnemy;

    // Don't move while paused
    if (speedster.movementState === "paused") {
      return;
    }

    // Calculate new position
    const newPos = this.calculateNewPosition(speedster);

    // Check if position is valid
    if (this.isValidPosition(newPos, gameState)) {
      speedster.x = newPos.x;
      speedster.y = newPos.y;
      speedster.movementDistance++;

      // Pause if max movement distance reached
      if (speedster.movementDistance >= speedster.maxMovementDistance) {
        speedster.movementState = "paused";
        speedster.pauseDuration = speedster.maxPauseDuration;
        speedster.movementDistance = 0;
      }
    } else {
      // Pause immediately if something is hit
      speedster.movementState = "paused";
      speedster.pauseDuration = speedster.maxPauseDuration;
      speedster.movementDistance = 0;
      speedster.predictabilityCounter = 0;
    }
  }

  private changeDirection(speedster: SpeedsterEnemy): void {
    // Determine next direction based on rotation pattern
    const directions =
      speedster.rotationPattern === "clockwise"
        ? this.CLOCKWISE_DIRECTIONS
        : this.COUNTERCLOCKWISE_DIRECTIONS;

    // Advance to the next direction index
    speedster.currentDirectionIndex =
      (speedster.currentDirectionIndex + 1) % directions.length;
    speedster.direction = directions[speedster.currentDirectionIndex];

    // Set new random movement distance (8-12 cells)
    speedster.maxMovementDistance =
      Math.floor(
        Math.random() *
          (this.SPEEDSTER_CONFIG.maxMovementDistance -
            this.SPEEDSTER_CONFIG.minMovementDistance +
            1)
      ) + this.SPEEDSTER_CONFIG.minMovementDistance;

    speedster.lastDirectionChange = Date.now();
    speedster.directionChangeTimer = 0;
  }

  private handleWallReflection(
    speedster: SpeedsterEnemy,
    blockedPos: Position
  ): void {
    // Immediately pause and change to next direction if wall is hit
    speedster.movementState = "paused";
    speedster.pauseDuration = speedster.maxPauseDuration;
    speedster.movementDistance = 0;
    speedster.predictabilityCounter = 0;

    // Determine next direction based on rotation pattern (regular rotation, not wall reflection)
    this.changeDirection(speedster);
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.SPEEDSTER) {
      return { char: "?", attributes: { color: "white" } };
    }

    const speedster = enemy as SpeedsterEnemy;

    if (speedster.isBlinking) {
      // Display during blinking (fast blink to represent speed)
      const blinkPhase =
        Math.floor((speedster.maxBlinkDuration - speedster.blinkDuration) / 3) %
        2;

      if (blinkPhase === 0) {
        return {
          char: this.SPEEDSTER_CONFIG.displayChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: this.SPEEDSTER_CONFIG.blinkingColor,
          },
        };
      } else {
        // Hidden phase
        return {
          char: " ",
          attributes: {
            entityType: "empty",
            isPassable: true,
          },
        };
      }
    } else {
      // Normal display (different char when paused)
      const displayChar =
        speedster.movementState === "paused"
          ? "P"
          : this.SPEEDSTER_CONFIG.displayChar;
      const displayColor =
        speedster.movementState === "paused"
          ? ("light_red" as cglColor)
          : this.SPEEDSTER_CONFIG.color;

      return {
        char: displayChar,
        attributes: {
          entityType: "enemy",
          isPassable: false,
          color: displayColor,
        },
      };
    }
  }

  // Speedster-specific methods
  public spawnSpeedster(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const speedster = this.createEnemy(EnemyType.SPEEDSTER, position, {
      isBlinking,
    });
    if (speedster) {
      this.addEnemy(speedster);
      return speedster.id;
    }
    return null;
  }

  public getSpeedsterCount(): number {
    return this.getEnemiesByType(EnemyType.SPEEDSTER).length;
  }

  public getAllSpeedsters(): SpeedsterEnemy[] {
    return this.getEnemiesByType(EnemyType.SPEEDSTER) as SpeedsterEnemy[];
  }

  // Method for dynamic difficulty adjustment
  public adjustSpeedsterDifficulty(difficultyMultiplier: number): void {
    const speedsters = this.getAllSpeedsters();

    for (const speedster of speedsters) {
      // Adjust movement interval (with minimum limit)
      speedster.moveInterval = Math.max(
        Math.floor(this.SPEEDSTER_CONFIG.moveInterval / difficultyMultiplier),
        3 // Minimum 3-frame interval
      );

      // Adjust direction change frequency
      const baseInterval = this.SPEEDSTER_CONFIG.directionChangeInterval;
      speedster.directionChangeTimer = Math.max(
        Math.floor(baseInterval / difficultyMultiplier),
        5 // Minimum 5-frame interval
      );
    }
  }

  // Method for performance analysis
  public getSpeedsterMetrics(): {
    averageSpeed: number;
    directionChangesPerSecond: number;
    wallReflections: number;
    predictabilityScore: number;
  } {
    const speedsters = this.getAllSpeedsters();

    if (speedsters.length === 0) {
      return {
        averageSpeed: 0,
        directionChangesPerSecond: 0,
        wallReflections: 0,
        predictabilityScore: 0,
      };
    }

    const totalSpeed = speedsters.reduce(
      (sum, speedster) => sum + speedster.speedMultiplier,
      0
    );

    const averagePredictability =
      speedsters.reduce(
        (sum, speedster) => sum + speedster.predictabilityCounter,
        0
      ) / speedsters.length;

    return {
      averageSpeed: totalSpeed / speedsters.length,
      directionChangesPerSecond: 0, // Calculate during implementation
      wallReflections: 0, // Calculate during implementation
      predictabilityScore:
        averagePredictability / this.SPEEDSTER_CONFIG.predictabilityThreshold,
    };
  }

  // For debugging
  public getSpeedsterDebugInfo(): any {
    const speedsters = this.getAllSpeedsters();
    return {
      count: speedsters.length,
      config: this.SPEEDSTER_CONFIG,
      speedsters: speedsters.map((speedster) => ({
        id: speedster.id,
        x: speedster.x,
        y: speedster.y,
        direction: speedster.direction,
        speedMultiplier: speedster.speedMultiplier,
        directionChangeTimer: speedster.directionChangeTimer,
        predictabilityCounter: speedster.predictabilityCounter,
        isBlinking: speedster.isBlinking,
        moveInterval: speedster.moveInterval,
        movementState: speedster.movementState,
        movementDistance: speedster.movementDistance,
        maxMovementDistance: speedster.maxMovementDistance,
        pauseDuration: speedster.pauseDuration,
        maxPauseDuration: speedster.maxPauseDuration,
        rotationPattern: speedster.rotationPattern,
        currentDirectionIndex: speedster.currentDirectionIndex,
      })),
      metrics: this.getSpeedsterMetrics(),
    };
  }

  // Method to get config
  public getConfig() {
    return { ...this.SPEEDSTER_CONFIG };
  }
}
