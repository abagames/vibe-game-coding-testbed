import { WandererEnemyManager } from "./WandererEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  GameState,
  EnemyDestroyEffect,
  ScoreDisplayEffect,
} from "./types.js";
import { CellAttributes } from "../../../core/coreTypes.js";
import { EnemyUpdateResult } from "./BaseEnemyManager.js";

export interface SpawnRequest {
  type: EnemyType;
  position: Position;
  options?: any;
}

export class EnemySystemManager {
  private wandererManager: WandererEnemyManager;
  // 将来的に他の敵マネージャーを追加
  // private guardManager: GuardEnemyManager;
  // private chaserManager: ChaserEnemyManager;
  // etc...

  private spawnTimer: number = 0;
  private spawnInterval: number = 600; // 10秒間隔
  private fastSpawnInterval: number = 60; // 1秒間隔
  private minEnemyCount: number = 5;

  constructor() {
    this.wandererManager = new WandererEnemyManager();
  }

  // 敵の更新処理
  public updateAllEnemies(gameState: GameState): EnemyUpdateResult {
    const result: EnemyUpdateResult = {
      enemiesToRemove: [],
      effectsToAdd: [],
      scoreToAdd: 0,
    };

    // 各敵マネージャーの更新
    const wandererResult = this.wandererManager.updateAllEnemies(gameState);
    this.mergeResults(result, wandererResult);

    // エフェクトの更新
    this.wandererManager.updateDestroyEffects();

    return result;
  }

  // スポーン処理
  public updateSpawning(gameState: GameState): void {
    this.spawnTimer++;

    const currentEnemyCount = this.getTotalEnemyCount();
    const needsMoreEnemies = currentEnemyCount < this.minEnemyCount;

    // 敵数が最小値以下の場合は短時間で出現、そうでなければ通常間隔
    const spawnInterval = needsMoreEnemies
      ? this.fastSpawnInterval
      : this.spawnInterval;

    // 最初の敵は即座に出現
    const shouldSpawnImmediately =
      currentEnemyCount === 0 && this.spawnTimer >= 1;

    if (this.spawnTimer >= spawnInterval || shouldSpawnImmediately) {
      this.spawnNewEnemy(gameState);
      this.spawnTimer = 0;
    }
  }

  // 新しい敵をスポーン
  private spawnNewEnemy(gameState: GameState): void {
    const position = this.findValidSpawnPosition(gameState);
    if (!position) {
      console.log("❌ Failed to find valid spawn position");
      return;
    }

    // 現在はワンダラーのみ
    const enemyId = this.wandererManager.spawnWanderer(position, true);
    if (enemyId) {
      console.log(
        `👹 Wanderer spawned at (${position.x}, ${
          position.y
        }) - Total enemies: ${this.getTotalEnemyCount()}`
      );
    }
  }

  // 有効なスポーン位置を探す
  private findValidSpawnPosition(gameState: GameState): Position | null {
    const maxAttempts = 50;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const position: Position = {
        x: Math.floor(Math.random() * 38) + 1, // 1-38
        y: Math.floor(Math.random() * 22) + 2, // 2-23
      };

      if (this.isValidSpawnPosition(position, gameState)) {
        return position;
      }
    }

    return null;
  }

  // スポーン位置の有効性チェック
  private isValidSpawnPosition(pos: Position, gameState: GameState): boolean {
    // プレイヤーとの衝突チェック
    if (
      pos.x === gameState.playerPosition.x &&
      pos.y === gameState.playerPosition.y
    ) {
      return false;
    }

    // 既存の敵との衝突チェック
    const hasEnemy = this.getEnemyAtPosition(pos) !== null;
    if (hasEnemy) return false;

    // 食べ物との衝突チェック（将来的に実装）
    // const hasFood = pos.x === gameState.foodPosition.x && pos.y === gameState.foodPosition.y;
    // if (hasFood) return false;

    return true;
  }

  // 敵の描画情報を取得
  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    switch (enemy.type) {
      case EnemyType.WANDERER:
        return this.wandererManager.getEnemyDisplayInfo(enemy);
      // 将来的に他の敵タイプを追加
      default:
        return { char: "?", attributes: { color: "white" } };
    }
  }

  // 全ての敵を取得
  public getAllEnemies(): Enemy[] {
    const enemies: Enemy[] = [];
    enemies.push(...this.wandererManager.getAllEnemies());
    // 将来的に他の敵マネージャーからも取得
    return enemies;
  }

  // 特定位置の敵を取得
  public getEnemyAtPosition(pos: Position): Enemy | null {
    return this.wandererManager.getEnemyAtPosition(pos);
    // 将来的に他の敵マネージャーもチェック
  }

  // 敵の総数を取得
  public getTotalEnemyCount(): number {
    return this.wandererManager.getAllEnemies().length;
    // 将来的に他の敵マネージャーの数も加算
  }

  // 破壊エフェクトを取得
  public getAllDestroyEffects(): EnemyDestroyEffect[] {
    const effects: EnemyDestroyEffect[] = [];
    effects.push(...this.wandererManager.getDestroyEffects());
    // 将来的に他の敵マネージャーからも取得
    return effects;
  }

  // スコア表示エフェクトを取得
  public getAllScoreDisplayEffects(): ScoreDisplayEffect[] {
    const effects: ScoreDisplayEffect[] = [];
    effects.push(...this.wandererManager.getScoreDisplayEffects());
    // 将来的に他の敵マネージャーからも取得
    return effects;
  }

  // すべての破壊エフェクトを更新
  public updateAllDestroyEffects(): void {
    this.wandererManager.updateDestroyEffects();
    // 将来的に他の敵マネージャーも更新
  }

  // 領域内の敵を破壊
  public destroyEnemiesInArea(
    startPos: Position,
    endPos: Position
  ): { destroyedCount: number; totalScore: number } {
    const enemiesInBoundingBox = this.wandererManager.getEnemiesInArea(
      startPos,
      endPos
    );
    // This method is too broad. We'll replace its usage in core.ts
    // with more specific destruction logic.
    // For now, let's make it clear it's deprecated for area explosion
    console.warn(
      "destroyEnemiesInArea (bounding box) called, prefer specific ID destruction for blasts."
    );
    let destroyedCount = 0;
    let totalScore = 0;
    const baseScore = 100;
    for (const enemy of enemiesInBoundingBox) {
      const score = baseScore * enemiesInBoundingBox.length; // Simple multiplier
      if (
        this.wandererManager.destroyEnemy(
          enemy.id,
          score,
          enemiesInBoundingBox.length
        )
      ) {
        destroyedCount++;
        totalScore += score;
      }
    }
    return { destroyedCount, totalScore };
  }

  public destroyEnemyById(
    id: string,
    score: number,
    multiplier: number
  ): boolean {
    const enemy = this.wandererManager.getEnemy(id);
    if (enemy) {
      // Delegate to the specific manager, as it handles its own enemy types
      if (enemy.type === EnemyType.WANDERER) {
        return this.wandererManager.destroyEnemy(id, score, multiplier);
      }
      // Add cases for other enemy managers here
    }
    return false;
  }

  // 領域内の敵を取得
  public getEnemiesInArea(startPos: Position, endPos: Position): Enemy[] {
    return this.wandererManager.getEnemiesInArea(startPos, endPos);
    // 将来的に他の敵マネージャーからも取得してマージ
  }

  // 敵との衝突チェック
  public checkEnemyCollision(pos: Position): Enemy | null {
    const enemy = this.getEnemyAtPosition(pos);
    if (enemy && !enemy.isBlinking) {
      return enemy;
    }
    return null;
  }

  // 設定の更新
  public updateSpawnSettings(settings: {
    spawnInterval?: number;
    fastSpawnInterval?: number;
    minEnemyCount?: number;
  }): void {
    if (settings.spawnInterval !== undefined) {
      this.spawnInterval = settings.spawnInterval;
    }
    if (settings.fastSpawnInterval !== undefined) {
      this.fastSpawnInterval = settings.fastSpawnInterval;
    }
    if (settings.minEnemyCount !== undefined) {
      this.minEnemyCount = settings.minEnemyCount;
    }
  }

  // デバッグ情報
  public getDebugInfo(): any {
    return {
      totalEnemies: this.getTotalEnemyCount(),
      spawnTimer: this.spawnTimer,
      spawnInterval: this.spawnInterval,
      minEnemyCount: this.minEnemyCount,
      wandererInfo: this.wandererManager.getWandererDebugInfo(),
      // 将来的に他の敵マネージャーの情報も追加
    };
  }

  // 結果のマージ
  private mergeResults(
    target: EnemyUpdateResult,
    source: EnemyUpdateResult
  ): void {
    target.enemiesToRemove.push(...source.enemiesToRemove);
    target.effectsToAdd.push(...source.effectsToAdd);
    target.scoreToAdd += source.scoreToAdd;
  }

  // 全ての敵をクリア（プレイヤー爆発時など）
  public clearAllEnemies(): void {
    this.wandererManager = new WandererEnemyManager(); // Resets wanderers
    this.spawnTimer = 0; // Reset spawn timer as well
    // 将来的に他の敵マネージャーもリセット
  }
}
