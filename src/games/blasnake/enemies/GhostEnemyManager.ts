import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  GhostEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class GhostEnemyManager extends BaseEnemyManager {
  private readonly GHOST_CONFIG = {
    displayChar: "?",
    color: "light_blue" as cglColor,
    phaseColor: "light_black" as cglColor,
    warningColor: "yellow" as cglColor,
    baseScore: 270,
    moveInterval: 12,
    phaseChance: 0.2, // 20%の確率で無形化
    phaseDuration: 30, // 無形化持続時間（0.5秒）
    phaseCooldown: 60, // 無形化クールダウン（1秒）
    phaseWarningDuration: 15, // 無形化予告時間（0.25秒）
    blinkDuration: 120,
    threatLevel: ThreatLevel.EXTREME,
    spawnWeight: 8,
    maxCount: 2,
    overlapResolutionAttempts: 5, // 重複解決試行回数
    learningObjective: "不確実性に対応し、適応的戦略を身につける",
    counterStrategies: [
      "無形化のタイミングを観察してパターンを見つける",
      "無形化中は他の敵に集中する",
      "ゴーストを最後に残して確実に対処",
      "無形化終了のタイミングを狙って囲い込み",
    ],
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): GhostEnemy | null {
    if (type !== EnemyType.GHOST) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.GHOST_CONFIG.blinkDuration
      : 0;

    const ghost: GhostEnemy = {
      id: this.generateEnemyId("ghost"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.GHOST,
      baseScore: this.GHOST_CONFIG.baseScore,
      moveInterval: this.GHOST_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.GHOST_CONFIG.threatLevel,
      playerLearningHints: this.GHOST_CONFIG.counterStrategies,
      isPhasing: false,
      phaseTimer: 0,
      phaseChance: this.GHOST_CONFIG.phaseChance,
      phaseCooldown: 0,
      phaseWarningTimer: 0,
    };

    return ghost;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.GHOST) {
      return;
    }

    const ghost = enemy as GhostEnemy;

    // 無形化予告タイマーの更新
    if (ghost.phaseWarningTimer > 0) {
      ghost.phaseWarningTimer--;
      if (ghost.phaseWarningTimer === 0) {
        // 予告終了、無形化開始
        this.startPhasing(ghost);
      }
      return;
    }

    // 無形化状態の処理
    if (ghost.isPhasing) {
      ghost.phaseTimer--;
      if (ghost.phaseTimer <= 0) {
        this.endPhasing(ghost, gameState);
      }
      return;
    }

    // 無形化クールダウンの更新
    if (ghost.phaseCooldown > 0) {
      ghost.phaseCooldown--;
    }

    // 無形化判定
    if (
      ghost.phaseCooldown === 0 &&
      Math.random() < ghost.phaseChance &&
      !ghost.isBlinking
    ) {
      this.triggerPhaseWarning(ghost);
    }

    // 通常の移動方向変更判定
    if (Math.random() < 0.3) {
      ghost.direction = Math.floor(Math.random() * 4);
    }
  }

  private triggerPhaseWarning(ghost: GhostEnemy): void {
    ghost.phaseWarningTimer = this.GHOST_CONFIG.phaseWarningDuration;
  }

  private startPhasing(ghost: GhostEnemy): void {
    ghost.isPhasing = true;
    ghost.phaseTimer = this.GHOST_CONFIG.phaseDuration;
    ghost.phaseCooldown = this.GHOST_CONFIG.phaseCooldown;
  }

  private endPhasing(ghost: GhostEnemy, gameState: GameState): void {
    ghost.isPhasing = false;
    ghost.phaseTimer = 0;

    // 無形化終了時に他のオブジェクトと重複している場合の処理
    if (this.isPositionOccupied(ghost, gameState)) {
      this.resolveOverlap(ghost, gameState);
    }
  }

  private isPositionOccupied(ghost: GhostEnemy, gameState: GameState): boolean {
    // スネークとの重複チェック
    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === ghost.x && segment.y === ghost.y
    );
    if (hasSnake) return true;

    // 他の敵との重複チェック（自分以外の非点滅敵）
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) =>
        enemy.id !== ghost.id &&
        !enemy.isBlinking &&
        enemy.x === ghost.x &&
        enemy.y === ghost.y
    );
    if (hasOtherEnemy) return true;

    return false;
  }

  private resolveOverlap(ghost: GhostEnemy, gameState: GameState): void {
    const attempts = this.GHOST_CONFIG.overlapResolutionAttempts;

    for (let i = 0; i < attempts; i++) {
      // 周囲8方向 + 現在位置をチェック
      const offsets = [
        { x: 0, y: 0 }, // 現在位置
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const offset of offsets) {
        const newPos = {
          x: ghost.x + offset.x,
          y: ghost.y + offset.y,
        };

        if (this.isValidPositionForPhaseEnd(newPos, gameState, ghost)) {
          ghost.x = newPos.x;
          ghost.y = newPos.y;
          return;
        }
      }

      // より広い範囲で検索
      const randomPos = this.findRandomValidPosition(gameState, ghost);
      if (randomPos) {
        ghost.x = randomPos.x;
        ghost.y = randomPos.y;
        return;
      }
    }

    // 解決できない場合は強制的に安全な位置に移動
    console.warn(
      `Ghost ${ghost.id} overlap resolution failed, moving to safe position`
    );
    const safePos = this.findSafePosition(gameState);
    if (safePos) {
      ghost.x = safePos.x;
      ghost.y = safePos.y;
    }
  }

  private isValidPositionForPhaseEnd(
    pos: Position,
    gameState: GameState,
    ghost: GhostEnemy
  ): boolean {
    // 壁チェック
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // スネークとの重複チェック
    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasSnake) return false;

    // 他の敵との重複チェック（自分以外）
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) =>
        enemy.id !== ghost.id &&
        !enemy.isBlinking &&
        enemy.x === pos.x &&
        enemy.y === pos.y
    );
    if (hasOtherEnemy) return false;

    return true;
  }

  private findRandomValidPosition(
    gameState: GameState,
    ghost: GhostEnemy
  ): Position | null {
    for (let attempt = 0; attempt < 20; attempt++) {
      const pos = {
        x: Math.floor(Math.random() * 38) + 1,
        y: Math.floor(Math.random() * 22) + 2,
      };

      if (this.isValidPositionForPhaseEnd(pos, gameState, ghost)) {
        return pos;
      }
    }
    return null;
  }

  private findSafePosition(gameState: GameState): Position | null {
    // 画面の四隅から安全な位置を探す
    const corners = [
      { x: 1, y: 2 },
      { x: 38, y: 2 },
      { x: 1, y: 23 },
      { x: 38, y: 23 },
    ];

    for (const corner of corners) {
      if (this.isValidPosition(corner, gameState)) {
        return corner;
      }
    }

    return { x: 20, y: 12 }; // 最後の手段として中央付近
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.GHOST) {
      return;
    }

    const ghost = enemy as GhostEnemy;

    // 無形化予告中は移動しない
    if (ghost.phaseWarningTimer > 0) {
      return;
    }

    // 通常の移動処理
    const newPos = this.calculateNewPosition(ghost);

    if (ghost.isPhasing) {
      // 無形化中は壁以外すり抜け可能
      if (this.isValidPositionForPhasing(newPos)) {
        ghost.x = newPos.x;
        ghost.y = newPos.y;
      } else {
        // 壁にぶつかった場合は方向転換
        ghost.direction = Math.floor(Math.random() * 4);
      }
    } else {
      // 通常状態では通常の衝突判定
      if (this.isValidPosition(newPos, gameState)) {
        ghost.x = newPos.x;
        ghost.y = newPos.y;
      } else {
        ghost.direction = Math.floor(Math.random() * 4);
      }
    }
  }

  private isValidPositionForPhasing(pos: Position): boolean {
    // 無形化中は壁のみチェック
    return pos.x >= 1 && pos.x < 39 && pos.y >= 2 && pos.y < 24;
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.GHOST) {
      return { char: "?", attributes: {} };
    }

    const ghost = enemy as GhostEnemy;
    let char = this.GHOST_CONFIG.displayChar;
    let color = this.GHOST_CONFIG.color;

    // 無形化予告中
    if (ghost.phaseWarningTimer > 0) {
      color = this.GHOST_CONFIG.warningColor;
      // 点滅効果
      if (Math.floor(ghost.phaseWarningTimer / 3) % 2 === 0) {
        char = "!";
      }
    }
    // 無形化中
    else if (ghost.isPhasing) {
      color = this.GHOST_CONFIG.phaseColor;
      char = "?"; // 無形化状態の表示
    }
    // 点滅中（出現時）
    else if (ghost.isBlinking) {
      color = this.GHOST_CONFIG.phaseColor;
      char = "o";
    }

    return {
      char,
      attributes: {
        color,
        isPassable: ghost.isBlinking || ghost.isPhasing,
      },
    };
  }

  // 爆発耐性なし（削除）

  // スポーン関連メソッド
  public spawnGhost(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const ghost = this.createEnemy(EnemyType.GHOST, position, { isBlinking });
    if (ghost) {
      this.addEnemy(ghost);
      return ghost.id;
    }
    return null;
  }

  public getGhostCount(): number {
    return this.getEnemiesByType(EnemyType.GHOST).length;
  }

  public getAllGhosts(): GhostEnemy[] {
    return this.getEnemiesByType(EnemyType.GHOST) as GhostEnemy[];
  }

  // 難易度調整
  public adjustGhostDifficulty(difficultyMultiplier: number): void {
    const ghosts = this.getAllGhosts();
    for (const ghost of ghosts) {
      // 無形化確率の調整
      ghost.phaseChance = Math.min(
        this.GHOST_CONFIG.phaseChance * difficultyMultiplier,
        0.4 // 最大40%
      );

      // 移動速度の調整
      ghost.moveInterval = Math.max(
        Math.floor(this.GHOST_CONFIG.moveInterval / difficultyMultiplier),
        6 // 最小6フレーム間隔
      );

      // 爆発耐性なし（削除）
    }
  }

  // メトリクス取得
  public getGhostMetrics(): {
    averagePhaseFrequency: number;
    phaseSuccessRate: number;
    explosionSurvivalRate: number;
    overlapResolutions: number;
  } {
    const ghosts = this.getAllGhosts();
    if (ghosts.length === 0) {
      return {
        averagePhaseFrequency: 0,
        phaseSuccessRate: 0,
        explosionSurvivalRate: 0,
        overlapResolutions: 0,
      };
    }

    const totalPhaseChance = ghosts.reduce(
      (sum, ghost) => sum + ghost.phaseChance,
      0
    );
    const averagePhaseFrequency = totalPhaseChance / ghosts.length;

    return {
      averagePhaseFrequency,
      phaseSuccessRate: 0.85, // 実装時に実際の値を計算
      explosionSurvivalRate: 0, // 爆発耐性なし
      overlapResolutions: 0, // 実装時に実際の値を計算
    };
  }

  // デバッグ情報
  public getGhostDebugInfo(): any {
    const ghosts = this.getAllGhosts();
    return {
      count: ghosts.length,
      config: this.GHOST_CONFIG,
      ghosts: ghosts.map((ghost) => ({
        id: ghost.id,
        position: { x: ghost.x, y: ghost.y },
        isPhasing: ghost.isPhasing,
        phaseTimer: ghost.phaseTimer,
        phaseCooldown: ghost.phaseCooldown,
        phaseWarningTimer: ghost.phaseWarningTimer,
        phaseChance: ghost.phaseChance,
        isBlinking: ghost.isBlinking,
        blinkDuration: ghost.blinkDuration,
      })),
      metrics: this.getGhostMetrics(),
    };
  }

  public getConfig() {
    return this.GHOST_CONFIG;
  }
}
