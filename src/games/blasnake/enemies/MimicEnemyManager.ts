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
    learningObjective: "自己の行動パターンを客観視し、戦略的思考を深める",
    counterStrategies: [
      "意図的に複雑な軌跡を描いてミミックを混乱させる",
      "急激な方向転換でミミックとの距離を作る",
      "ミミックの遅延を利用して罠に誘導",
      "直線的な動きを避け、予測困難な動きを心がける",
    ],
  };

  private readonly MIMIC_BEHAVIOR_CONFIG = {
    mimicDelay: 45, // 1.5秒の遅延
    mimicAccuracy: 0.85, // 85%の精度
    maxRecordLength: 120, // 4秒分の軌跡
    accuracyDecayRate: 0.02, // 時間経過による精度低下
  };

  // プレイヤーの軌跡を記録するバッファ
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
      blinkDuration: 120, // 2秒間点滅
      maxBlinkDuration: 120,
      type: EnemyType.MIMIC,
      baseScore: this.MIMIC_CONFIG.baseScore,
      moveInterval: this.MIMIC_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.MIMIC_CONFIG.threatLevel,
      playerLearningHints: this.MIMIC_CONFIG.counterStrategies,

      // ミミック固有のプロパティ
      mimicTarget: [],
      mimicDelay: this.MIMIC_BEHAVIOR_CONFIG.mimicDelay,
      mimicAccuracy: this.MIMIC_BEHAVIOR_CONFIG.mimicAccuracy,
      recordingBuffer: [...this.playerTrajectoryBuffer], // 現在の軌跡をコピー
      maxRecordLength: this.MIMIC_BEHAVIOR_CONFIG.maxRecordLength,
    };

    return enemy;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.MIMIC) return;

    const mimicEnemy = enemy as MimicEnemy;

    // プレイヤーの軌跡を記録
    this.recordPlayerTrajectory(gameState.playerPosition);

    // ミミック敵の行動を更新
    this.updateMimicBehavior(mimicEnemy, gameState);
  }

  private recordPlayerTrajectory(playerPosition: Position): void {
    // プレイヤーの現在位置を記録
    this.playerTrajectoryBuffer.push({ ...playerPosition });

    // バッファサイズを制限
    if (
      this.playerTrajectoryBuffer.length >
      this.MIMIC_BEHAVIOR_CONFIG.maxRecordLength
    ) {
      this.playerTrajectoryBuffer.shift();
    }
  }

  private updateMimicBehavior(enemy: MimicEnemy, gameState: GameState): void {
    // 点滅中は何もしない
    if (enemy.isBlinking) {
      return;
    }

    // 模倣精度の時間経過による低下を無効化（テスト用）
    // enemy.mimicAccuracy = Math.max(
    //   0.3, // 最低30%の精度は保持
    //   enemy.mimicAccuracy - this.MIMIC_BEHAVIOR_CONFIG.accuracyDecayRate
    // );

    // 模倣対象の位置を決定
    const targetPosition = this.getMimicTargetPosition(enemy);

    if (targetPosition) {
      // 模倣対象に向かって移動する方向を計算
      const direction = this.calculateDirectionToTarget(enemy, targetPosition);

      // 常に100%の精度でミミック動作（ランダム移動を無効化）
      enemy.direction = direction;
    }
  }

  private getMimicTargetPosition(enemy: MimicEnemy): Position | null {
    // 遅延分だけ過去のプレイヤー位置を取得
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

    // より大きな差分の方向を優先
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

    // 移動可能かチェック
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

    // 点滅中の表示
    if (enemy.isBlinking) {
      const blinkPhase = Math.floor(enemy.blinkDuration / 10) % 2;
      return {
        char: blinkPhase === 0 ? this.MIMIC_CONFIG.displayChar : "m",
        attributes: {
          color: blinkPhase === 0 ? this.MIMIC_CONFIG.color : "light_black",
        },
      };
    }

    // 通常時の表示
    return {
      char: this.MIMIC_CONFIG.displayChar,
      attributes: {
        color: this.MIMIC_CONFIG.color,
      },
    };
  }

  // スポーンメソッド
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

  // ミミック固有のメソッド
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

  // デバッグ情報
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
