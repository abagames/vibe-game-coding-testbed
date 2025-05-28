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
    moveInterval: 10, // 8から10フレーム間隔に変更
    blinkDuration: 120,
    threatLevel: ThreatLevel.MEDIUM,
    stunDuration: 60, // 30から60フレームに変更
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
        "チェイサーは壁や障害物を利用して行き詰まらせよう",
        "他の敵を盾として利用する",
        "長い直線を避け、複雑な経路を選ぶ",
        "チェイサーを囲い込みエリアに誘導する",
      ],
      chaseTarget: { x: 20, y: 12 }, // 初期ターゲットをプレイヤーの初期位置に設定
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

    // スタン状態の処理
    if (chaser.stunDuration > 0) {
      chaser.stunDuration--;
      // スタン中は完全に動かない（移動間隔の設定も不要）
      if (chaser.stunDuration === 0) {
        // スタン終了時に追跡を再開
        this.updateChaseTarget(chaser, gameState);
      }
      return;
    }

    // 移動間隔の設定（スタン中でない場合のみ）
    chaser.moveInterval = this.CHASER_CONFIG.moveInterval;

    // 経路探索クールダウンの更新
    if (chaser.pathfindingCooldown > 0) {
      chaser.pathfindingCooldown--;
    }

    // 追跡対象の更新
    this.updateChaseTarget(chaser, gameState);

    // 追跡強度の減衰
    chaser.chaseIntensity *= this.CHASER_CONFIG.intensityDecayRate;
    if (chaser.chaseIntensity < 0.1) {
      chaser.chaseIntensity = 0.1;
    }

    // 行き詰まり検出
    this.updateStuckCounter(chaser);
  }

  private updateChaseTarget(chaser: ChaserEnemy, gameState: GameState): void {
    // プレイヤーの頭部を追跡対象に設定
    if (gameState.snakeSegments && gameState.snakeSegments.length > 0) {
      const playerHead = gameState.snakeSegments[0];
      const distance = this.calculateDistance(chaser, playerHead);

      // 追跡範囲内の場合のみ追跡
      if (distance <= this.CHASER_CONFIG.chaseRange) {
        chaser.chaseTarget = { x: playerHead.x, y: playerHead.y };
        chaser.chaseIntensity = Math.min(chaser.chaseIntensity + 0.1, 2.0);
      }
    }
  }

  private updateStuckCounter(chaser: ChaserEnemy): void {
    // 前回の位置と比較して移動していない場合はカウンターを増加
    // 実装簡略化のため、ここでは基本的な行き詰まり検出のみ
    if (chaser.stuckCounter > this.CHASER_CONFIG.maxStuckFrames) {
      // 行き詰まり状態をリセット
      chaser.stuckCounter = 0;
      chaser.direction = Math.floor(Math.random() * 4);
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.CHASER) {
      return;
    }

    const chaser = enemy as ChaserEnemy;

    // スタン中は完全に動かない
    if (chaser.stunDuration > 0) {
      return;
    }

    // 追跡移動
    this.performChaseMovement(chaser, gameState);
  }

  private performChaseMovement(
    chaser: ChaserEnemy,
    gameState: GameState
  ): void {
    // 経路探索クールダウン中でない場合、最適な方向を計算
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
      // 壁や障害物にぶつかった場合は必ずスタン状態に
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

    // 距離が0の場合は移動不要
    if (deltaX === 0 && deltaY === 0) {
      return null;
    }

    // 優先順位付きの方向リスト
    const directions: { direction: Direction; priority: number }[] = [];

    // X軸方向の移動
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

    // Y軸方向の移動
    if (deltaY > 0) {
      directions.push({
        direction: Direction.DOWN,
        priority: Math.abs(deltaY),
      });
    } else if (deltaY < 0) {
      directions.push({ direction: Direction.UP, priority: Math.abs(deltaY) });
    }

    // 優先順位でソート
    directions.sort((a, b) => b.priority - a.priority);

    // 移動可能な方向を探す
    for (const { direction } of directions) {
      const testPos = this.calculateNewPositionForDirection(chaser, direction);
      if (this.isValidPosition(testPos, gameState)) {
        return direction;
      }
    }

    // 全ての優先方向が無効な場合、他の方向を試す
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
    // スタン状態を適用
    chaser.stunDuration = this.CHASER_CONFIG.stunDuration;
    chaser.stuckCounter++;

    // ランダムな方向に変更
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
      // 点滅中の表示（5フレームごとに表示/非表示切り替え）
      const blinkPhase =
        Math.floor((chaser.maxBlinkDuration - chaser.blinkDuration) / 5) % 2;

      if (blinkPhase === 0) {
        return {
          char: this.CHASER_CONFIG.displayChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: "blue" as cglColor, // 出現時（点滅時）はblueに変更
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
      // 通常表示
      // スタン中は色を変更
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

  // チェイサー固有のメソッド
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

  // チェイサーの追跡状態を強制リセット
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

  // デバッグ用
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
