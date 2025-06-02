import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  MimicEnemy,
  ThreatLevel,
} from "./types.js";
import { BaseEnemyManager } from "./BaseEnemyManager.js";
import { cglColor, CellAttributes } from "../../../core/coreTypes.js";

export class MimicEnemyManager extends BaseEnemyManager {
  private readonly MIMIC_CONFIG = {
    displayChar: "M",
    color: "light_cyan" as cglColor,
    baseScore: 130,
    moveInterval: 8,
    spawnWeight: 12,
    maxCount: 1,
    threatLevel: ThreatLevel.HIGH,
    learningObjective:
      "Objectively view one's own action patterns and deepen strategic thinking",
    counterStrategies: [
      "Confuse the mimic by intentionally drawing complex trajectories",
      "Create distance from the mimic with sharp direction changes",
      "Utilize the mimic's delay to lure it into traps",
      "Avoid linear movements and strive for unpredictable actions",
    ],
  };

  private readonly MIMIC_BEHAVIOR_CONFIG = {
    mimicDelay: 45, // 1.5 second delay
    mimicAccuracy: 0.85, // 85% accuracy
    maxRecordLength: 120, // Trajectory for 4 seconds
    accuracyDecayRate: 0.02, // Accuracy decrease over time
  };

  // Buffer for recording player trajectory
  private playerTrajectoryBuffer: Position[] = [];

  public createEnemy(
    type: EnemyType,
    position: Position,
    options?: any
  ): MimicEnemy | null {
    if (type !== EnemyType.MIMIC) {
      return null;
    }

    const enemy: MimicEnemy = {
      id: this.generateEnemyId("mimic"),
      x: position.x,
      y: position.y,
      direction: Direction.UP,
      moveCounter: 0,
      isBlinking: true,
      blinkDuration: 120, // Blink for 2 seconds
      maxBlinkDuration: 120,
      type: EnemyType.MIMIC,
      baseScore: this.MIMIC_CONFIG.baseScore,
      moveInterval: this.MIMIC_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.MIMIC_CONFIG.threatLevel,
      playerLearningHints: this.MIMIC_CONFIG.counterStrategies,

      // Mimic specific properties
      mimicTarget: [],
      mimicDelay: this.MIMIC_BEHAVIOR_CONFIG.mimicDelay,
      mimicAccuracy: this.MIMIC_BEHAVIOR_CONFIG.mimicAccuracy,
      recordingBuffer: [...this.playerTrajectoryBuffer], // Copy current trajectory
      maxRecordLength: this.MIMIC_BEHAVIOR_CONFIG.maxRecordLength,
    };

    return enemy;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.MIMIC) return;

    const mimicEnemy = enemy as MimicEnemy;

    this.recordPlayerTrajectory(gameState.playerPosition);

    this.updateMimicBehavior(mimicEnemy, gameState);
  }

  private recordPlayerTrajectory(playerPosition: Position): void {
    this.playerTrajectoryBuffer.push({ ...playerPosition });

    if (
      this.playerTrajectoryBuffer.length >
      this.MIMIC_BEHAVIOR_CONFIG.maxRecordLength
    ) {
      this.playerTrajectoryBuffer.shift();
    }
  }

  private updateMimicBehavior(enemy: MimicEnemy, gameState: GameState): void {
    // Do nothing while blinking
    if (enemy.isBlinking) {
      return;
    }

    // Disable accuracy decrease over time for testing
    // enemy.mimicAccuracy = Math.max(
    //   0.3, // Maintain at least 30% accuracy
    //   enemy.mimicAccuracy - this.MIMIC_BEHAVIOR_CONFIG.accuracyDecayRate
    // );

    const targetPosition = this.getMimicTargetPosition(enemy);

    if (targetPosition) {
      const direction = this.calculateDirectionToTarget(enemy, targetPosition);

      // Always mimic with 100% accuracy (disable random movement)
      enemy.direction = direction;
    }
  }

  private getMimicTargetPosition(enemy: MimicEnemy): Position | null {
    // Get player position from the past by the delay amount
    const delayIndex = this.playerTrajectoryBuffer.length - enemy.mimicDelay;

    if (delayIndex >= 0 && delayIndex < this.playerTrajectoryBuffer.length) {
      const targetPos = this.playerTrajectoryBuffer[delayIndex];
      return targetPos;
    }

    return null;
  }

  private calculateDirectionToTarget(
    enemy: MimicEnemy,
    target: Position
  ): Direction {
    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;

    // Prioritize direction with larger difference
    let direction: Direction;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      direction = dy > 0 ? Direction.DOWN : Direction.UP;
    }

    return direction;
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.MIMIC) {
      super.moveEnemy(enemy, gameState);
      return;
    }

    const newPos = this.calculateNewPosition(enemy);

    // Check if the new position is valid
    if (this.isValidPosition(newPos, gameState)) {
      enemy.x = newPos.x;
      enemy.y = newPos.y;
    }
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.MIMIC) {
      return { char: "?", attributes: { color: "white" } };
    }

    const mimicEnemy = enemy as MimicEnemy;

    // Blinking display
    if (enemy.isBlinking) {
      const blinkPhase = Math.floor(enemy.blinkDuration / 10) % 2;
      return {
        char: blinkPhase === 0 ? this.MIMIC_CONFIG.displayChar : "m",
        attributes: {
          color: blinkPhase === 0 ? this.MIMIC_CONFIG.color : "light_black",
        },
      };
    }

    // Normal display
    return {
      char: this.MIMIC_CONFIG.displayChar,
      attributes: {
        color: this.MIMIC_CONFIG.color,
      },
    };
  }

  // Spawn method
  public spawnMimic(
    position: Position,
    shouldBlink: boolean = true
  ): string | null {
    const enemy = this.createEnemy(EnemyType.MIMIC, position);
    if (!enemy) {
      return null;
    }

    if (!shouldBlink) {
      enemy.isBlinking = false;
      enemy.blinkDuration = 0;
    }

    this.addEnemy(enemy);
    return enemy.id;
  }

  // Mimic specific methods
  public getMimicAccuracy(enemyId: string): number {
    const enemy = this.getEnemy(enemyId) as MimicEnemy;
    return enemy ? enemy.mimicAccuracy : 0;
  }

  public getPlayerTrajectoryLength(): number {
    return this.playerTrajectoryBuffer.length;
  }

  public clearPlayerTrajectory(): void {
    this.playerTrajectoryBuffer = [];
  }

  // Debug information
  public getDebugInfo(): any {
    const baseInfo = super.getDebugInfo();
    const mimicEnemies = this.getEnemiesByType(EnemyType.MIMIC) as MimicEnemy[];

    return {
      ...baseInfo,
      mimicSpecific: {
        playerTrajectoryLength: this.playerTrajectoryBuffer.length,
        mimicEnemies: mimicEnemies.map((enemy) => ({
          id: enemy.id,
          position: { x: enemy.x, y: enemy.y },
          mimicAccuracy: enemy.mimicAccuracy,
          mimicDelay: enemy.mimicDelay,
          recordingBufferLength: enemy.recordingBuffer.length,
        })),
      },
    };
  }
}
