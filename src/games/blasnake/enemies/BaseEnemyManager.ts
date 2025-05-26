import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  EnemyDestroyEffect,
  ScoreDisplayEffect,
  WandererEnemy,
} from "./types.js";
import { cglColor, CellAttributes } from "../../../core/coreTypes.js";

export interface EnemyUpdateResult {
  enemiesToRemove: string[];
  effectsToAdd: EnemyDestroyEffect[];
  scoreToAdd: number;
}

export abstract class BaseEnemyManager {
  protected enemies: Map<string, Enemy> = new Map();
  protected destroyEffects: EnemyDestroyEffect[] = [];
  protected scoreDisplayEffects: ScoreDisplayEffect[] = [];
  protected nextEnemyId: number = 1;

  // 抽象メソッド - 各敵タイプで実装
  abstract createEnemy(
    type: EnemyType,
    position: Position,
    options?: any
  ): Enemy | null;
  abstract updateEnemyLogic(enemy: Enemy, gameState: GameState): void;
  abstract getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  };

  // 共通メソッド
  public addEnemy(enemy: Enemy): void {
    this.enemies.set(enemy.id, enemy);
  }

  public removeEnemy(id: string): void {
    this.enemies.delete(id);
  }

  public getEnemy(id: string): Enemy | undefined {
    return this.enemies.get(id);
  }

  public getAllEnemies(): Enemy[] {
    return Array.from(this.enemies.values());
  }

  public getEnemiesByType(type: EnemyType): Enemy[] {
    return this.getAllEnemies().filter((enemy) => enemy.type === type);
  }

  public updateAllEnemies(gameState: GameState): EnemyUpdateResult {
    const result: EnemyUpdateResult = {
      enemiesToRemove: [],
      effectsToAdd: [],
      scoreToAdd: 0,
    };

    for (const enemy of this.enemies.values()) {
      // 点滅状態の更新
      this.updateBlinking(enemy);

      // 破壊フラグチェック
      if (enemy.isDestroyed) {
        result.enemiesToRemove.push(enemy.id);
        continue;
      }

      // 敵固有のロジック更新
      this.updateEnemyLogic(enemy, gameState);

      // 移動処理
      this.updateMovement(enemy, gameState);
    }

    // 破壊された敵を削除
    for (const id of result.enemiesToRemove) {
      this.removeEnemy(id);
    }

    return result;
  }

  protected updateBlinking(enemy: Enemy): void {
    if (enemy.isBlinking) {
      enemy.blinkDuration--;
      if (enemy.blinkDuration <= 0) {
        enemy.isBlinking = false;
      }
    }
  }

  protected updateMovement(enemy: Enemy, gameState: GameState): void {
    if (enemy.isBlinking) {
      // Do not move if blinking (spawn effect)
      // Reset moveCounter to ensure it starts fresh when blinking stops
      enemy.moveCounter = 0;
      return;
    }
    enemy.moveCounter++;
    if (enemy.moveCounter >= enemy.moveInterval) {
      enemy.moveCounter = 0;
      this.moveEnemy(enemy, gameState);
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    // デフォルトのランダム移動（各敵タイプでオーバーライド可能）
    if (Math.random() < 0.3) {
      enemy.direction = Math.floor(Math.random() * 4);
    }

    const newPos = this.calculateNewPosition(enemy);
    if (this.isValidPosition(newPos, gameState)) {
      enemy.x = newPos.x;
      enemy.y = newPos.y;
    } else {
      // 移動できない場合は方向を変更
      enemy.direction = Math.floor(Math.random() * 4);
    }
  }

  protected calculateNewPosition(enemy: Enemy): Position {
    const newPos = { x: enemy.x, y: enemy.y };

    switch (enemy.direction) {
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

  protected isValidPosition(pos: Position, gameState: GameState): boolean {
    // 壁チェック（画面境界）
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // スネーク全体との衝突チェック（頭部と胴体すべて）
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

  protected generateEnemyId(): string {
    return `enemy_${this.nextEnemyId++}`;
  }

  // エフェクト管理
  public addDestroyEffect(effect: EnemyDestroyEffect): void {
    this.destroyEffects.push(effect);
  }

  public updateDestroyEffects(): void {
    // 破壊エフェクトの更新
    for (let i = this.destroyEffects.length - 1; i >= 0; i--) {
      this.destroyEffects[i].duration--;
      if (this.destroyEffects[i].duration <= 0) {
        const finishedEffect = this.destroyEffects[i];

        // 破壊エフェクト終了時にスコア表示エフェクトを作成
        if (finishedEffect.score > 0) {
          this.scoreDisplayEffects.push({
            x: finishedEffect.x,
            y: finishedEffect.y,
            duration: 90, // 1.5秒間表示
            maxDuration: 90,
            score: finishedEffect.score,
            multiplier: finishedEffect.multiplier,
          });
        }

        this.destroyEffects.splice(i, 1);
      }
    }

    // スコア表示エフェクトの更新
    for (let i = this.scoreDisplayEffects.length - 1; i >= 0; i--) {
      this.scoreDisplayEffects[i].duration--;
      if (this.scoreDisplayEffects[i].duration <= 0) {
        this.scoreDisplayEffects.splice(i, 1);
      }
    }
  }

  public getDestroyEffects(): EnemyDestroyEffect[] {
    return this.destroyEffects;
  }

  public getScoreDisplayEffects(): ScoreDisplayEffect[] {
    return this.scoreDisplayEffects;
  }

  // 敵の破壊処理
  public destroyEnemy(
    id: string,
    score: number = 0,
    multiplier: number = 1
  ): boolean {
    const enemy = this.getEnemy(id);
    if (!enemy) return false;

    enemy.isDestroyed = true;

    // 破壊エフェクトを追加（スコア情報は保持するが表示はしない）
    this.addDestroyEffect({
      x: enemy.x,
      y: enemy.y,
      duration: 120,
      maxDuration: 120,
      score: score,
      multiplier: multiplier,
    });

    return true;
  }

  // 領域内の敵を取得
  public getEnemiesInArea(startPos: Position, endPos: Position): Enemy[] {
    const minX = Math.min(startPos.x, endPos.x);
    const maxX = Math.max(startPos.x, endPos.x);
    const minY = Math.min(startPos.y, endPos.y);
    const maxY = Math.max(startPos.y, endPos.y);

    return this.getAllEnemies().filter(
      (enemy) =>
        enemy.x >= minX && enemy.x <= maxX && enemy.y >= minY && enemy.y <= maxY
    );
  }

  // 特定位置の敵を取得
  public getEnemyAtPosition(pos: Position): Enemy | null {
    return (
      this.getAllEnemies().find(
        (enemy) => enemy.x === pos.x && enemy.y === pos.y
      ) || null
    );
  }

  // デバッグ情報
  public getDebugInfo(): any {
    return {
      totalEnemies: this.enemies.size,
      enemiesByType: Object.fromEntries(
        Object.values(EnemyType).map((type) => [
          type,
          this.getEnemiesByType(type).length,
        ])
      ),
      activeEffects: this.destroyEffects.length,
    };
  }
}
