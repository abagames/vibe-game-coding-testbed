import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  GuardEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class GuardEnemyManager extends BaseEnemyManager {
  private readonly GUARD_CONFIG: {
    displayChar: string;
    color: cglColor;
    alertColor: cglColor;
    moveInterval: number;
    blinkDuration: number;
    baseScore: number;
    threatLevel: ThreatLevel;
    patrolRadius: number;
    maxDistanceFromFood: number;
    returnTimeout: number;
    searchRadius: number;
    alertRadius: number;
  } = {
    displayChar: "G",
    color: "yellow",
    alertColor: "light_red",
    moveInterval: 144,
    blinkDuration: 120,
    baseScore: 120,
    threatLevel: ThreatLevel.LOW,
    patrolRadius: 2,
    maxDistanceFromFood: 3,
    returnTimeout: 120,
    searchRadius: 8,
    alertRadius: 3, // Alert radius for player (display only)
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: {
      isBlinking?: boolean;
      foodPosition?: Position;
    } = {}
  ): GuardEnemy | null {
    if (type !== EnemyType.GUARD) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.GUARD_CONFIG.blinkDuration
      : 0;

    const guard: GuardEnemy = {
      id: this.generateEnemyId("guard"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.GUARD,
      baseScore: this.GUARD_CONFIG.baseScore,
      moveInterval: this.GUARD_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.GUARD_CONFIG.threatLevel,
      playerLearningHints: [
        "Guard enemies protect food",
        "Aim for when they are away from the food",
        "Defeat the guard then safely take the food",
      ],
      guardTarget: options.foodPosition || null,
      patrolRadius: this.GUARD_CONFIG.patrolRadius,
      patrolAngle: Math.random() * Math.PI * 2, // Random starting angle
      returnToFoodTimer: 0,
      alertLevel: 0,
    };

    return guard;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.GUARD) {
      return;
    }

    const guard = enemy as GuardEnemy;

    // Update food position (obtained from GameState)
    if ((gameState as any).foodPosition) {
      guard.guardTarget = (gameState as any).foodPosition;
    }

    // If food doesn't exist, search for new food
    if (!guard.guardTarget) {
      guard.guardTarget = this.findNearestFood(guard, gameState);
    }

    // Calculate distance to player and set alert level (for display only, does not affect speed)
    const playerDistance = this.calculateDistance(
      guard,
      gameState.playerPosition
    );

    if (playerDistance <= this.GUARD_CONFIG.alertRadius) {
      guard.alertLevel = Math.max(1, guard.alertLevel);
    } else {
      guard.alertLevel = Math.max(0, guard.alertLevel - 1);
    }

    // Check distance from food and adjust movement speed
    if (guard.guardTarget) {
      const foodDistance = this.calculateDistance(guard, guard.guardTarget);

      if (foodDistance > this.GUARD_CONFIG.maxDistanceFromFood) {
        // If too far from food, hurry back (500% speed up + alert display)
        guard.moveInterval = Math.max(
          this.GUARD_CONFIG.moveInterval * 0.167, // 500% speed up (1/6 time interval = 6x speed)
          24
        );
        guard.alertLevel = Math.max(2, guard.alertLevel); // Force alert level 2 when returning to food
        guard.returnToFoodTimer++;
        if (guard.returnToFoodTimer >= this.GUARD_CONFIG.returnTimeout) {
          // Start returning to food behavior
          guard.returnToFoodTimer = 0;
        }
      } else {
        // Normal speed if near food
        guard.moveInterval = this.GUARD_CONFIG.moveInterval;
        guard.returnToFoodTimer = 0;
        // Lower alert level if player is not nearby
        if (playerDistance > this.GUARD_CONFIG.alertRadius) {
          guard.alertLevel = Math.max(0, guard.alertLevel - 1);
        }
      }
    } else {
      // Normal speed if no food
      guard.moveInterval = this.GUARD_CONFIG.moveInterval;
    }

    // Update patrol angle
    guard.patrolAngle += 0.15; // Increased from 0.05 to 0.15 (faster patrol)
    if (guard.patrolAngle > Math.PI * 2) {
      guard.patrolAngle -= Math.PI * 2;
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.GUARD) {
      return;
    }

    const guard = enemy as GuardEnemy;

    if (!guard.guardTarget) {
      // Random movement if no food
      this.moveRandomly(guard, gameState);
      return;
    }

    const foodDistance = this.calculateDistance(guard, guard.guardTarget);

    if (
      foodDistance > this.GUARD_CONFIG.maxDistanceFromFood ||
      guard.returnToFoodTimer > 0
    ) {
      // Return to food
      this.moveTowardsTarget(guard, guard.guardTarget, gameState);
    } else {
      // Patrol around food
      this.patrolAroundFood(guard, gameState);
    }
  }

  private moveRandomly(guard: GuardEnemy, gameState: GameState): void {
    if (Math.random() < 0.3) {
      guard.direction = Math.floor(Math.random() * 4);
    }

    const newPos = this.calculateNewPosition(guard);
    if (this.isValidPosition(newPos, gameState)) {
      guard.x = newPos.x;
      guard.y = newPos.y;
    } else {
      guard.direction = Math.floor(Math.random() * 4);
    }
  }

  private moveTowardsTarget(
    guard: GuardEnemy,
    target: Position,
    gameState: GameState
  ): void {
    const dx = target.x - guard.x;
    const dy = target.y - guard.y;

    let newDirection = guard.direction;

    if (Math.abs(dx) > Math.abs(dy)) {
      newDirection = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      newDirection = dy > 0 ? Direction.DOWN : Direction.UP;
    }

    const newPos = this.calculateNewPositionInDirection(guard, newDirection);

    if (this.isValidPosition(newPos, gameState)) {
      guard.direction = newDirection;
      guard.x = newPos.x;
      guard.y = newPos.y;
    } else {
      // If unable to move straight, try another direction
      const alternativeDirections = [
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT,
      ].filter((dir) => dir !== newDirection);

      for (const dir of alternativeDirections) {
        const altPos = this.calculateNewPositionInDirection(guard, dir);
        if (this.isValidPosition(altPos, gameState)) {
          guard.direction = dir;
          guard.x = altPos.x;
          guard.y = altPos.y;
          break;
        }
      }
    }
  }

  private patrolAroundFood(guard: GuardEnemy, gameState: GameState): void {
    if (!guard.guardTarget) return;

    // Calculate patrol position (guarding more closely with a smaller radius)
    const targetX =
      guard.guardTarget.x + Math.cos(guard.patrolAngle) * guard.patrolRadius;
    const targetY =
      guard.guardTarget.y + Math.sin(guard.patrolAngle) * guard.patrolRadius;

    // Round to integer position
    const patrolTarget: Position = {
      x: Math.round(targetX),
      y: Math.round(targetY),
    };

    // Calculate distance from current position to target
    const currentDistance = this.calculateDistance(guard, guard.guardTarget);

    // If very close to food (distance 1 or less), move towards patrol target
    if (currentDistance <= 1.5) {
      // Move towards patrol target
      this.moveTowardsTarget(guard, patrolTarget, gameState);
    } else {
      // If too far from food, first move towards food
      this.moveTowardsTarget(guard, guard.guardTarget, gameState);
    }
  }

  private calculateNewPositionInDirection(
    enemy: Enemy,
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

  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private findNearestFood(
    guard: GuardEnemy,
    gameState: GameState
  ): Position | null {
    // Current implementation supports only one food
    // Future implementation will select the closest food from multiple foods
    return (gameState as any).foodPosition || null;
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.GUARD) {
      return { char: "?", attributes: { color: "white" } };
    }

    const guard = enemy as GuardEnemy;

    if (guard.isBlinking) {
      // Blinking display (switch every 5 frames)
      const blinkPhase =
        Math.floor((guard.maxBlinkDuration - guard.blinkDuration) / 5) % 2;

      if (blinkPhase === 0) {
        return {
          char: this.GUARD_CONFIG.displayChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: "light_yellow",
          },
        };
      } else {
        // Non-display phase
        return {
          char: " ",
          attributes: {
            entityType: "empty",
            isPassable: true,
          },
        };
      }
    } else {
      // Change color based on alert level
      const color =
        guard.alertLevel > 0 ? "light_red" : this.GUARD_CONFIG.color;

      return {
        char: this.GUARD_CONFIG.displayChar,
        attributes: {
          entityType: "enemy",
          isPassable: false,
          color: color,
        },
      };
    }
  }

  // Guard-specific method
  public spawnGuard(
    position: Position,
    foodPosition: Position,
    isBlinking: boolean = true
  ): string | null {
    const guard = this.createEnemy(EnemyType.GUARD, position, {
      isBlinking,
      foodPosition,
    });
    if (guard) {
      this.addEnemy(guard);
      return guard.id;
    }
    return null;
  }

  // Automatically spawn Guard near food
  public spawnGuardNearFood(
    foodPosition: Position,
    isBlinking: boolean = true
  ): string | null {
    // Find a suitable position around food
    const spawnPosition = this.findGoodGuardPosition(foodPosition);
    if (spawnPosition) {
      return this.spawnGuard(spawnPosition, foodPosition, isBlinking);
    }
    return null;
  }

  // Find a good guard position around food
  private findGoodGuardPosition(foodPosition: Position): Position | null {
    const maxAttempts = 20;
    const preferredDistance = 3; // Prefer positions 3 units away from food

    // First, try 4 directions (up, down, left, right)
    const cardinalDirections = [
      { x: 0, y: -preferredDistance }, // Up
      { x: 0, y: preferredDistance }, // Down
      { x: -preferredDistance, y: 0 }, // Left
      { x: preferredDistance, y: 0 }, // Right
    ];

    for (const offset of cardinalDirections) {
      const position: Position = {
        x: foodPosition.x + offset.x,
        y: foodPosition.y + offset.y,
      };

      if (this.isValidGuardPosition(position)) {
        return position;
      }
    }

    // If 4 directions are bad, search randomly within circular range
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 2 + 2; // Range of 2-4 units

      const position: Position = {
        x: Math.round(foodPosition.x + Math.cos(angle) * distance),
        y: Math.round(foodPosition.y + Math.sin(angle) * distance),
      };

      if (this.isValidGuardPosition(position)) {
        return position;
      }
    }

    return null;
  }

  // Check if a Guard position is valid
  private isValidGuardPosition(position: Position): boolean {
    // Check if within screen boundaries
    if (
      position.x < 1 ||
      position.x > 38 ||
      position.y < 2 ||
      position.y > 23
    ) {
      return false;
    }

    // Check for overlap with other enemies (simplified version)
    const existingGuards = this.getAllGuards();
    for (const guard of existingGuards) {
      if (guard.x === position.x && guard.y === position.y) {
        return false;
      }
    }

    return true;
  }

  public getGuardCount(): number {
    return this.getEnemiesByType(EnemyType.GUARD).length;
  }

  public getAllGuards(): GuardEnemy[] {
    return this.getEnemiesByType(EnemyType.GUARD) as GuardEnemy[];
  }

  public updateGuardTargets(foodPosition: Position): void {
    const guards = this.getAllGuards();
    for (const guard of guards) {
      guard.guardTarget = foodPosition;
      guard.returnToFoodTimer = 0; // Reset
    }
  }

  // Debug
  public getGuardDebugInfo(): any {
    const guards = this.getAllGuards();
    return {
      count: guards.length,
      blinking: guards.filter((g) => g.isBlinking).length,
      alerting: guards.filter((g) => g.alertLevel > 0).length,
      positions: guards.map((g) => {
        const foodDistance = g.guardTarget
          ? this.calculateDistance(g, g.guardTarget)
          : null;
        const isRushing =
          foodDistance && foodDistance > this.GUARD_CONFIG.maxDistanceFromFood;

        return {
          id: g.id,
          x: g.x,
          y: g.y,
          blinking: g.isBlinking,
          alertLevel: g.alertLevel,
          guardTarget: g.guardTarget,
          patrolAngle: g.patrolAngle,
          foodDistance: foodDistance ? foodDistance.toFixed(1) : "N/A",
          isRushing: isRushing, // Is rushing back to food
          currentSpeed: g.moveInterval,
          alertReason: isRushing
            ? "RUSHING_TO_FOOD"
            : g.alertLevel > 0
            ? "PLAYER_NEARBY"
            : "NORMAL", // Alert reason
        };
      }),
    };
  }
}
