import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  ChaserEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class ChaserEnemyManager extends BaseEnemyManager {
  private readonly CHASER_CONFIG = {
    displayChar: "C",
    color: "light_cyan" as cglColor,
    baseScore: 220,
    moveInterval: 10,
    blinkDuration: 120,
    threatLevel: ThreatLevel.MEDIUM,
    stunDuration: 60,
    pathfindingInterval: 12,
    maxStuckFrames: 36,
    chaseRange: 15,
    intensityDecayRate: 0.95,
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): ChaserEnemy | null {
    if (type !== EnemyType.CHASER) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.CHASER_CONFIG.blinkDuration
      : 0;

    const chaser: ChaserEnemy = {
      id: this.generateEnemyId("chaser"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.CHASER,
      baseScore: this.CHASER_CONFIG.baseScore,
      moveInterval: this.CHASER_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.CHASER_CONFIG.threatLevel,
      playerLearningHints: [
        "Use walls and obstacles to trap the Chaser",
        "Use other enemies as shields",
        "Avoid long straight lines, choose complex paths",
        "Lure the Chaser into enclosed areas",
      ],
      chaseTarget: { x: 20, y: 12 },
      stunDuration: 0,
      lastValidDirection: Direction.UP,
      pathfindingCooldown: 0,
      stuckCounter: 0,
      chaseIntensity: 1.0,
    };

    return chaser;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.CHASER) {
      return;
    }

    const chaser = enemy as ChaserEnemy;

    if (chaser.stunDuration > 0) {
      chaser.stunDuration--;
      if (chaser.stunDuration === 0) {
        this.updateChaseTarget(chaser, gameState);
      }
      return;
    }

    chaser.moveInterval = this.CHASER_CONFIG.moveInterval;

    if (chaser.pathfindingCooldown > 0) {
      chaser.pathfindingCooldown--;
    }

    this.updateChaseTarget(chaser, gameState);

    chaser.chaseIntensity *= this.CHASER_CONFIG.intensityDecayRate;
    if (chaser.chaseIntensity < 0.1) {
      chaser.chaseIntensity = 0.1;
    }

    this.updateStuckCounter(chaser);
  }

  private updateChaseTarget(chaser: ChaserEnemy, gameState: GameState): void {
    if (gameState.snakeSegments && gameState.snakeSegments.length > 0) {
      const playerHead = gameState.snakeSegments[0];
      const distance = this.calculateDistance(chaser, playerHead);

      if (distance <= this.CHASER_CONFIG.chaseRange) {
        chaser.chaseTarget = { x: playerHead.x, y: playerHead.y };
        chaser.chaseIntensity = Math.min(chaser.chaseIntensity + 0.1, 2.0);
      }
    }
  }

  private updateStuckCounter(chaser: ChaserEnemy): void {
    if (chaser.stuckCounter > this.CHASER_CONFIG.maxStuckFrames) {
      chaser.stuckCounter = 0;
      chaser.direction = Math.floor(Math.random() * 4);
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.CHASER) {
      return;
    }

    const chaser = enemy as ChaserEnemy;

    if (chaser.stunDuration > 0) {
      return;
    }

    this.performChaseMovement(chaser, gameState);
  }

  private performChaseMovement(
    chaser: ChaserEnemy,
    gameState: GameState
  ): void {
    if (chaser.pathfindingCooldown === 0) {
      const bestDirection = this.calculateBestDirection(chaser, gameState);
      if (bestDirection !== null) {
        chaser.direction = bestDirection;
        chaser.lastValidDirection = bestDirection;
        chaser.pathfindingCooldown = this.CHASER_CONFIG.pathfindingInterval;
      }
    }

    const newPos = this.calculateNewPosition(chaser);
    if (this.isValidPosition(newPos, gameState)) {
      chaser.x = newPos.x;
      chaser.y = newPos.y;
      chaser.stuckCounter = 0;
    } else {
      this.applyStunToChaser(chaser);
    }
  }

  private calculateBestDirection(
    chaser: ChaserEnemy,
    gameState: GameState
  ): Direction | null {
    const target = chaser.chaseTarget;
    const deltaX = target.x - chaser.x;
    const deltaY = target.y - chaser.y;

    if (deltaX === 0 && deltaY === 0) {
      return null;
    }

    const directions: { direction: Direction; priority: number }[] = [];

    if (deltaX > 0) {
      directions.push({
        direction: Direction.RIGHT,
        priority: Math.abs(deltaX),
      });
    } else if (deltaX < 0) {
      directions.push({
        direction: Direction.LEFT,
        priority: Math.abs(deltaX),
      });
    }

    if (deltaY > 0) {
      directions.push({
        direction: Direction.DOWN,
        priority: Math.abs(deltaY),
      });
    } else if (deltaY < 0) {
      directions.push({ direction: Direction.UP, priority: Math.abs(deltaY) });
    }

    directions.sort((a, b) => b.priority - a.priority);

    for (const { direction } of directions) {
      const testPos = this.calculateNewPositionForDirection(chaser, direction);
      if (this.isValidPosition(testPos, gameState)) {
        return direction;
      }
    }

    const allDirections = [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ];
    for (const direction of allDirections) {
      const testPos = this.calculateNewPositionForDirection(chaser, direction);
      if (this.isValidPosition(testPos, gameState)) {
        return direction;
      }
    }

    return null;
  }

  private calculateNewPositionForDirection(
    chaser: ChaserEnemy,
    direction: Direction
  ): Position {
    const newPos = { x: chaser.x, y: chaser.y };

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
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  private applyStunToChaser(chaser: ChaserEnemy): void {
    chaser.stunDuration = this.CHASER_CONFIG.stunDuration;
    chaser.stuckCounter++;

    chaser.direction = Math.floor(Math.random() * 4);

    console.log(
      `🥴 Chaser ${chaser.id} stunned for ${this.CHASER_CONFIG.stunDuration} frames (completely immobilized)`
    );
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.CHASER) {
      return { char: "?", attributes: { color: "white" } };
    }

    const chaser = enemy as ChaserEnemy;

    if (chaser.isBlinking) {
      const blinkPhase =
        Math.floor((chaser.maxBlinkDuration - chaser.blinkDuration) / 5) % 2;

      if (blinkPhase === 0) {
        return {
          char: this.CHASER_CONFIG.displayChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: "blue" as cglColor,
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
      const color =
        chaser.stunDuration > 0
          ? ("yellow" as cglColor)
          : this.CHASER_CONFIG.color;

      return {
        char: this.CHASER_CONFIG.displayChar,
        attributes: {
          entityType: "enemy",
          isPassable: false,
          color: color,
        },
      };
    }
  }

  public spawnChaser(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const chaser = this.createEnemy(EnemyType.CHASER, position, {
      isBlinking,
    });
    if (chaser) {
      this.addEnemy(chaser);
      return chaser.id;
    }
    return null;
  }

  public getChaserCount(): number {
    return this.getEnemiesByType(EnemyType.CHASER).length;
  }

  public getAllChasers(): ChaserEnemy[] {
    return this.getEnemiesByType(EnemyType.CHASER) as ChaserEnemy[];
  }

  public resetChaserTarget(chaserId: string, newTarget?: Position): void {
    const chaser = this.getEnemy(chaserId) as ChaserEnemy;
    if (chaser && chaser.type === EnemyType.CHASER) {
      if (newTarget) {
        chaser.chaseTarget = newTarget;
      }
      chaser.stunDuration = 0;
      chaser.stuckCounter = 0;
      chaser.chaseIntensity = 1.0;
    }
  }

  public getChaserDebugInfo(): any {
    const chasers = this.getAllChasers();
    return {
      count: chasers.length,
      blinking: chasers.filter((c) => c.isBlinking).length,
      stunned: chasers.filter((c) => c.stunDuration > 0).length,
      positions: chasers.map((c) => ({
        id: c.id,
        x: c.x,
        y: c.y,
        blinking: c.isBlinking,
        stunned: c.stunDuration > 0,
        target: c.chaseTarget,
        intensity: c.chaseIntensity,
      })),
    };
  }
}
