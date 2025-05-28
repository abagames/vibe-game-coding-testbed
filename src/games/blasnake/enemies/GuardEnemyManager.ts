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
    moveInterval: 144, // 通常の2倍遅い (24フレーム間隔 * 6 = 144)
    blinkDuration: 120,
    baseScore: 120,
    threatLevel: ThreatLevel.LOW,
    patrolRadius: 2, // 巡回半径を4から2に縮小（より密接な守護）
    maxDistanceFromFood: 3, // 最大距離を4から3に縮小（より厳格な守護）
    returnTimeout: 120, // 2秒（180から短縮、より早く反応）
    searchRadius: 8, // 食べ物検索範囲
    alertRadius: 3, // プレイヤー警戒範囲（表示用のみ）
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
        "ガード敵は食べ物を守っている",
        "食べ物から離れた隙を狙おう",
        "ガードを囲んで撃破後に食べ物を安全に取る",
      ],
      guardTarget: options.foodPosition || null,
      patrolRadius: this.GUARD_CONFIG.patrolRadius,
      patrolAngle: Math.random() * Math.PI * 2, // ランダムな開始角度
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

    // 食べ物の位置を更新（GameStateから取得）
    if ((gameState as any).foodPosition) {
      guard.guardTarget = (gameState as any).foodPosition;
    }

    // 食べ物が存在しない場合は新しい食べ物を探索
    if (!guard.guardTarget) {
      guard.guardTarget = this.findNearestFood(guard, gameState);
    }

    // プレイヤーとの距離を計算して警戒レベルを設定（表示用のみ、速度には影響しない）
    const playerDistance = this.calculateDistance(
      guard,
      gameState.playerPosition
    );

    if (playerDistance <= this.GUARD_CONFIG.alertRadius) {
      guard.alertLevel = Math.max(1, guard.alertLevel);
    } else {
      guard.alertLevel = Math.max(0, guard.alertLevel - 1);
    }

    // 食べ物からの距離をチェックして移動速度を調整
    if (guard.guardTarget) {
      const foodDistance = this.calculateDistance(guard, guard.guardTarget);

      if (foodDistance > this.GUARD_CONFIG.maxDistanceFromFood) {
        // 食べ物から離れすぎている場合は急いで戻る（500%速度アップ + 警戒表示）
        guard.moveInterval = Math.max(
          this.GUARD_CONFIG.moveInterval * 0.167, // 500%速度アップ（1/6の時間間隔 = 6倍速）
          24
        );
        guard.alertLevel = Math.max(2, guard.alertLevel); // 食べ物に戻る時は強制的に警戒レベル2
        guard.returnToFoodTimer++;
        if (guard.returnToFoodTimer >= this.GUARD_CONFIG.returnTimeout) {
          // 食べ物に戻る行動を開始
          guard.returnToFoodTimer = 0;
        }
      } else {
        // 食べ物の近くにいる場合は通常速度
        guard.moveInterval = this.GUARD_CONFIG.moveInterval;
        guard.returnToFoodTimer = 0;
        // プレイヤーが近くにいない場合は警戒レベルを下げる
        if (playerDistance > this.GUARD_CONFIG.alertRadius) {
          guard.alertLevel = Math.max(0, guard.alertLevel - 1);
        }
      }
    } else {
      // 食べ物がない場合は通常速度
      guard.moveInterval = this.GUARD_CONFIG.moveInterval;
    }

    // 巡回角度を更新
    guard.patrolAngle += 0.15; // 0.05から0.15に増加（より速い巡回）
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
      // 食べ物がない場合はランダム移動
      this.moveRandomly(guard, gameState);
      return;
    }

    const foodDistance = this.calculateDistance(guard, guard.guardTarget);

    if (
      foodDistance > this.GUARD_CONFIG.maxDistanceFromFood ||
      guard.returnToFoodTimer > 0
    ) {
      // 食べ物に戻る
      this.moveTowardsTarget(guard, guard.guardTarget, gameState);
    } else {
      // 食べ物の周りを巡回
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

    // 最も近い方向を選択
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
      // 直進できない場合は別の方向を試す
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

    // 巡回位置を計算（より小さな半径で密接に守護）
    const targetX =
      guard.guardTarget.x + Math.cos(guard.patrolAngle) * guard.patrolRadius;
    const targetY =
      guard.guardTarget.y + Math.sin(guard.patrolAngle) * guard.patrolRadius;

    // 整数位置に丸める
    const patrolTarget: Position = {
      x: Math.round(targetX),
      y: Math.round(targetY),
    };

    // 現在位置と目標位置の距離を計算
    const currentDistance = this.calculateDistance(guard, guard.guardTarget);

    // 食べ物に非常に近い場合（距離1以下）は、より積極的に巡回位置に移動
    if (currentDistance <= 1.5) {
      // 巡回位置に向かって移動
      this.moveTowardsTarget(guard, patrolTarget, gameState);
    } else {
      // 食べ物から離れすぎている場合は、まず食べ物に近づく
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
    // 現在の実装では単一の食べ物のみサポート
    // 将来的には複数の食べ物から最も近いものを選択
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
      // 点滅中の表示（5フレームごとに表示/非表示切り替え）
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
      // 警戒レベルに応じて色を変更
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

  // ガード固有のメソッド
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

  // 食べ物の近くに自動的にGuardをスポーンする
  public spawnGuardNearFood(
    foodPosition: Position,
    isBlinking: boolean = true
  ): string | null {
    // 食べ物の周りの適切な位置を探す
    const spawnPosition = this.findGoodGuardPosition(foodPosition);
    if (spawnPosition) {
      return this.spawnGuard(spawnPosition, foodPosition, isBlinking);
    }
    return null;
  }

  // 食べ物の周りの良い守護位置を見つける
  private findGoodGuardPosition(foodPosition: Position): Position | null {
    const maxAttempts = 20;
    const preferredDistance = 3; // 食べ物から3ユニット離れた位置を優先

    // まず、食べ物の周りの4方向（上下左右）を試す
    const cardinalDirections = [
      { x: 0, y: -preferredDistance }, // 上
      { x: 0, y: preferredDistance }, // 下
      { x: -preferredDistance, y: 0 }, // 左
      { x: preferredDistance, y: 0 }, // 右
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

    // 4方向がダメな場合は、円形範囲内でランダムに探す
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 2 + 2; // 2-4ユニットの範囲

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

  // Guard用の位置が有効かチェック
  private isValidGuardPosition(position: Position): boolean {
    // 画面境界内かチェック
    if (
      position.x < 1 ||
      position.x > 38 ||
      position.y < 2 ||
      position.y > 23
    ) {
      return false;
    }

    // 他の敵との重複チェック（簡易版）
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
      guard.returnToFoodTimer = 0; // リセット
    }
  }

  // デバッグ用
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
          isRushing: isRushing, // 食べ物に急いで戻っているかどうか
          currentSpeed: g.moveInterval,
          alertReason: isRushing
            ? "RUSHING_TO_FOOD"
            : g.alertLevel > 0
            ? "PLAYER_NEARBY"
            : "NORMAL", // 警戒理由
        };
      }),
    };
  }
}
