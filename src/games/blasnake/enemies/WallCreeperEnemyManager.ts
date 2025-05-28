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
    minTimeInWall: 120, // 壁内を移動する最小フレーム数 (約2秒)
    maxTimeInWall: 300, // 壁内を移動する最大フレーム数 (約5秒)
    crossingSpeedMultiplier: 1.0, // オープンスペース横断時の速度倍率
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): WallCreeperEnemy | null {
    if (type !== EnemyType.WALL_CREEPER) {
      return null;
    }

    // 壁位置に調整（画面端に配置）
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
        "ウォールクリーパーは壁内を移動する",
        "オープンスペース横断時が攻撃チャンス",
        "反対側の壁への進入地点を予測しよう",
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

    // 行動タイマーの更新
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
    // 壁から離脱するタイミングをチェック
    if (wallCreeper.behaviorTimer <= 0) {
      this.initiateWallCrossing(wallCreeper);
    }
  }

  private updateCrossingBehavior(
    wallCreeper: WallCreeperEnemy,
    gameState: GameState
  ): void {
    // 目標位置に到達したかチェック
    if (
      wallCreeper.targetCrossPosition &&
      wallCreeper.x === wallCreeper.targetCrossPosition.x &&
      wallCreeper.y === wallCreeper.targetCrossPosition.y
    ) {
      this.enterWall(wallCreeper);
    }
  }

  private initiateWallCrossing(wallCreeper: WallCreeperEnemy): void {
    // 現在位置から反対側の壁の対応位置を計算
    const targetPosition = this.calculateOppositeWallPosition(wallCreeper);

    if (targetPosition) {
      wallCreeper.currentBehaviorState = "crossing_open_space";
      wallCreeper.targetCrossPosition = targetPosition;

      // 横断方向を設定
      if (targetPosition.x > wallCreeper.x) {
        wallCreeper.direction = Direction.RIGHT;
      } else if (targetPosition.x < wallCreeper.x) {
        wallCreeper.direction = Direction.LEFT;
      } else if (targetPosition.y > wallCreeper.y) {
        wallCreeper.direction = Direction.DOWN;
      } else {
        wallCreeper.direction = Direction.UP;
      }

      // 横断時の移動間隔を調整
      wallCreeper.moveInterval = Math.floor(
        this.WALL_CREEPER_CONFIG.moveInterval /
          this.WALL_CREEPER_CONFIG.crossingSpeedMultiplier
      );
    }
  }

  private enterWall(wallCreeper: WallCreeperEnemy): void {
    wallCreeper.currentBehaviorState = "in_wall";
    wallCreeper.targetCrossPosition = null;

    // 新しい壁での移動方向を設定
    wallCreeper.wallFollowCardinalDirection =
      this.getWallFollowDirection(wallCreeper);
    wallCreeper.direction = wallCreeper.wallFollowCardinalDirection;

    // 新しい壁内滞在時間を設定
    wallCreeper.behaviorTimer = Math.floor(
      Math.random() *
        (this.WALL_CREEPER_CONFIG.maxTimeInWall -
          this.WALL_CREEPER_CONFIG.minTimeInWall) +
        this.WALL_CREEPER_CONFIG.minTimeInWall
    );

    // 移動間隔を元に戻す
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

    // 壁の角に到達したかチェック
    if (this.isWallCorner(newPos)) {
      // 角で方向転換
      wallCreeper.wallFollowCardinalDirection = this.getNextWallDirection(
        wallCreeper.wallFollowCardinalDirection,
        newPos
      );
      wallCreeper.direction = wallCreeper.wallFollowCardinalDirection;

      // 角の位置に移動
      wallCreeper.x = newPos.x;
      wallCreeper.y = newPos.y;
    } else if (this.isWallPosition(newPos)) {
      // 通常の壁沿い移動
      wallCreeper.x = newPos.x;
      wallCreeper.y = newPos.y;
    } else {
      // 壁から外れそうな場合は方向転換
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

    // 移動可能かチェック（オープンスペース横断中は通常の衝突判定）
    if (this.isValidPositionForCrossing(newPos, gameState)) {
      wallCreeper.x = newPos.x;
      wallCreeper.y = newPos.y;
    }
  }

  private adjustToWallPosition(position: Position): Position {
    // 最も近い壁位置に調整
    const wallPos = { ...position };

    if (position.x <= 20) {
      wallPos.x = 0; // 左壁
    } else {
      wallPos.x = 39; // 右壁
    }

    // Y座標は有効範囲内に制限
    wallPos.y = Math.max(2, Math.min(23, position.y));

    return wallPos;
  }

  private getInitialWallDirection(position: Position): Direction {
    // 壁位置に基づいて初期移動方向を決定
    if (position.x === 0) {
      // 左壁 - 上または下
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (position.x === 39) {
      // 右壁 - 上または下
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (position.y === 2) {
      // 上壁 - 左または右
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    } else {
      // 下壁 - 左または右
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    }
  }

  private calculateOppositeWallPosition(
    wallCreeper: WallCreeperEnemy
  ): Position | null {
    const currentPos = { x: wallCreeper.x, y: wallCreeper.y };

    if (currentPos.x === 0) {
      // 左壁から右壁へ
      return { x: 39, y: currentPos.y };
    } else if (currentPos.x === 39) {
      // 右壁から左壁へ
      return { x: 0, y: currentPos.y };
    } else if (currentPos.y === 2) {
      // 上壁から下壁へ
      return { x: currentPos.x, y: 23 };
    } else if (currentPos.y === 23) {
      // 下壁から上壁へ
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
      // 左壁
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (pos.x === 39) {
      // 右壁
      return Math.random() < 0.5 ? Direction.UP : Direction.DOWN;
    } else if (pos.y === 2) {
      // 上壁
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    } else {
      // 下壁
      return Math.random() < 0.5 ? Direction.LEFT : Direction.RIGHT;
    }
  }

  private getNextWallDirection(
    currentDirection: Direction,
    position: Position
  ): Direction {
    // 角での方向転換ロジック
    if (this.isWallCorner(position)) {
      if (position.x === 0 && position.y === 2) {
        // 左上角
        return currentDirection === Direction.UP
          ? Direction.RIGHT
          : Direction.DOWN;
      } else if (position.x === 39 && position.y === 2) {
        // 右上角
        return currentDirection === Direction.UP
          ? Direction.LEFT
          : Direction.DOWN;
      } else if (position.x === 0 && position.y === 23) {
        // 左下角
        return currentDirection === Direction.DOWN
          ? Direction.RIGHT
          : Direction.UP;
      } else if (position.x === 39 && position.y === 23) {
        // 右下角
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
    // オープンスペース横断中の移動可能性チェック
    // 画面境界チェック
    if (pos.x < 0 || pos.x >= 40 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // スネークとの衝突チェック
    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasSnake) return false;

    // 他の敵との衝突チェック（点滅中でない敵のみ）
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
      // 点滅中の表示
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
      // 通常表示
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

  // ウォールクリーパー固有のメソッド
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

  // デバッグ用
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
