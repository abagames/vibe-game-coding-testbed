import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  WandererEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class WandererEnemyManager extends BaseEnemyManager {
  private readonly WANDERER_CONFIG = {
    displayChar: "X",
    blinkingChar: "o",
    color: "red" as cglColor,
    blinkingColor: "light_red" as cglColor,
    moveInterval: 96,
    directionChangeChance: 0.3,
    blinkDuration: 120,
    baseScore: 100,
    threatLevel: ThreatLevel.LOW,
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): WandererEnemy | null {
    if (type !== EnemyType.WANDERER) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.WANDERER_CONFIG.blinkDuration
      : 0;

    const wanderer: WandererEnemy = {
      id: this.generateEnemyId(),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.WANDERER,
      baseScore: this.WANDERER_CONFIG.baseScore,
      moveInterval: this.WANDERER_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.WANDERER_CONFIG.threatLevel,
      playerLearningHints: [
        "ワンダラー敵を囲んで破壊しよう",
        "点滅中は通過可能",
        "ランダムに移動するので予測は困難",
      ],
      directionChangeChance: this.WANDERER_CONFIG.directionChangeChance,
    };

    return wanderer;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.WANDERER) {
      return;
    }

    const wanderer = enemy as WandererEnemy;

    // ワンダラー固有のロジック
    // 特別な処理は現在なし（基本的なランダム移動のみ）
    // 将来的には群れ行動や学習機能を追加可能
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.WANDERER) {
      return;
    }

    const wanderer = enemy as WandererEnemy;

    // 方向変更の判定
    if (Math.random() < wanderer.directionChangeChance) {
      wanderer.direction = Math.floor(Math.random() * 4);
    }

    // 新しい位置を計算
    const newPos = this.calculateNewPosition(wanderer);

    // 移動可能かチェック
    if (this.isValidPosition(newPos, gameState)) {
      wanderer.x = newPos.x;
      wanderer.y = newPos.y;
    } else {
      // 移動できない場合は方向を変更
      wanderer.direction = Math.floor(Math.random() * 4);
    }
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.WANDERER) {
      return { char: "?", attributes: { color: "white" } };
    }

    const wanderer = enemy as WandererEnemy;

    if (wanderer.isBlinking) {
      // 点滅中の表示（5フレームごとに表示/非表示切り替え）
      const blinkPhase =
        Math.floor((wanderer.maxBlinkDuration - wanderer.blinkDuration) / 5) %
        2;

      if (blinkPhase === 0) {
        return {
          char: this.WANDERER_CONFIG.blinkingChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: this.WANDERER_CONFIG.blinkingColor,
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
      return {
        char: this.WANDERER_CONFIG.displayChar,
        attributes: {
          entityType: "enemy",
          isPassable: false,
          color: this.WANDERER_CONFIG.color,
        },
      };
    }
  }

  // ワンダラー固有のメソッド
  public spawnWanderer(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const wanderer = this.createEnemy(EnemyType.WANDERER, position, {
      isBlinking,
    });
    if (wanderer) {
      this.addEnemy(wanderer);
      return wanderer.id;
    }
    return null;
  }

  public getWandererCount(): number {
    return this.getEnemiesByType(EnemyType.WANDERER).length;
  }

  public getAllWanderers(): WandererEnemy[] {
    return this.getEnemiesByType(EnemyType.WANDERER) as WandererEnemy[];
  }

  // デバッグ用
  public getWandererDebugInfo(): any {
    const wanderers = this.getAllWanderers();
    return {
      count: wanderers.length,
      blinking: wanderers.filter((w) => w.isBlinking).length,
      positions: wanderers.map((w) => ({
        id: w.id,
        x: w.x,
        y: w.y,
        blinking: w.isBlinking,
      })),
    };
  }
}
