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
    moveInterval: 6, // プレイヤーの約3倍速
    speedMultiplier: 3.0,
    directionChangeInterval: 10, // Default: 10 (0.33秒)
    directionChangeChance: 0.3,
    wallReflectionEnabled: true,
    predictabilityThreshold: 5,
    blinkDuration: 120,
    threatLevel: ThreatLevel.MEDIUM,
    spawnWeight: 50, // テスト用に出現頻度を大幅に上げる
    maxCount: 4, // テスト用に最大数を増やす
    minMovementDistance: 8, // 最小移動距離
    maxMovementDistance: 12, // 最大移動距離
    pauseDuration: 60, // 停止時間（1秒）
    learningObjective: "反応速度と動的判断力を向上させる",
    counterStrategies: [
      "スピードスターの回転パターンを観察して予測",
      "停止中を狙って囲い込み",
      "回転方向を利用して先回り",
      "角での方向転換を利用した囲い込み",
    ],
  };

  // 右回り・左回りの方向順序
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

    // 回転パターンをランダムに決定
    const rotationPattern =
      Math.random() < 0.5 ? "clockwise" : "counterclockwise";

    // 初期方向をランダムに決定
    const directions =
      rotationPattern === "clockwise"
        ? this.CLOCKWISE_DIRECTIONS
        : this.COUNTERCLOCKWISE_DIRECTIONS;
    const randomDirectionIndex = Math.floor(Math.random() * directions.length);
    const initialDirection = directions[randomDirectionIndex];
    const currentDirectionIndex = randomDirectionIndex;

    // 移動距離をランダムに決定（8-12マス）
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

    // 停止状態の処理
    if (speedster.movementState === "paused") {
      speedster.pauseDuration--;
      if (speedster.pauseDuration <= 0) {
        // 停止終了、新しい方向を選択して移動開始
        this.changeDirection(speedster);
        speedster.movementState = "moving";
        speedster.movementDistance = 0;
        speedster.predictabilityCounter = 0;
      }
      return;
    }

    // 移動状態の処理
    speedster.directionChangeTimer++;
    speedster.predictabilityCounter++;

    // ブーストクールダウンの更新
    if (speedster.boostCooldown > 0) {
      speedster.boostCooldown--;
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SPEEDSTER) {
      return;
    }

    const speedster = enemy as SpeedsterEnemy;

    // 停止中は移動しない
    if (speedster.movementState === "paused") {
      return;
    }

    // 新しい位置を計算
    const newPos = this.calculateNewPosition(speedster);

    // 移動可能かチェック
    if (this.isValidPosition(newPos, gameState)) {
      speedster.x = newPos.x;
      speedster.y = newPos.y;
      speedster.movementDistance++;

      // 最大移動距離に達したら停止
      if (speedster.movementDistance >= speedster.maxMovementDistance) {
        speedster.movementState = "paused";
        speedster.pauseDuration = speedster.maxPauseDuration;
        speedster.movementDistance = 0;
      }
    } else {
      // 何かにぶつかったら即座に停止
      speedster.movementState = "paused";
      speedster.pauseDuration = speedster.maxPauseDuration;
      speedster.movementDistance = 0;
      speedster.predictabilityCounter = 0;
    }
  }

  private changeDirection(speedster: SpeedsterEnemy): void {
    // 回転パターンに従って次の方向を決定
    const directions =
      speedster.rotationPattern === "clockwise"
        ? this.CLOCKWISE_DIRECTIONS
        : this.COUNTERCLOCKWISE_DIRECTIONS;

    // 次の方向インデックスに進む
    speedster.currentDirectionIndex =
      (speedster.currentDirectionIndex + 1) % directions.length;
    speedster.direction = directions[speedster.currentDirectionIndex];

    // 新しい移動距離をランダムに設定（8-12マス）
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
    // 壁にぶつかった場合は即座に停止して次の方向に変更
    speedster.movementState = "paused";
    speedster.pauseDuration = speedster.maxPauseDuration;
    speedster.movementDistance = 0;
    speedster.predictabilityCounter = 0;

    // 回転パターンに従って次の方向を決定（壁反射ではなく規則的な回転）
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
      // 点滅中の表示（高速点滅で動きの速さを表現）
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
        // 非表示フェーズ
        return {
          char: " ",
          attributes: {
            entityType: "empty",
            isPassable: true,
          },
        };
      }
    } else {
      // 通常表示（停止中は異なる文字で表示）
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

  // スピードスター固有のメソッド
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

  // 動的難易度調整用メソッド
  public adjustSpeedsterDifficulty(difficultyMultiplier: number): void {
    const speedsters = this.getAllSpeedsters();

    for (const speedster of speedsters) {
      // 移動間隔を調整（最小値制限あり）
      speedster.moveInterval = Math.max(
        Math.floor(this.SPEEDSTER_CONFIG.moveInterval / difficultyMultiplier),
        3 // 最小3フレーム間隔
      );

      // 方向変更頻度を調整
      const baseInterval = this.SPEEDSTER_CONFIG.directionChangeInterval;
      speedster.directionChangeTimer = Math.max(
        Math.floor(baseInterval / difficultyMultiplier),
        5 // 最小5フレーム間隔
      );
    }
  }

  // パフォーマンス分析用メソッド
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
      directionChangesPerSecond: 0, // 実装時に計算
      wallReflections: 0, // 実装時に計算
      predictabilityScore:
        averagePredictability / this.SPEEDSTER_CONFIG.predictabilityThreshold,
    };
  }

  // デバッグ用
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

  // 設定取得メソッド
  public getConfig() {
    return { ...this.SPEEDSTER_CONFIG };
  }
}
