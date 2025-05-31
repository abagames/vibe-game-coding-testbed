import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  SnakeEnemy,
  ThreatLevel,
} from "./types.js";
import { BaseEnemyManager } from "./BaseEnemyManager.js";
import { cglColor, CellAttributes } from "../../../core/coreTypes.js";

export class SnakeEnemyManager extends BaseEnemyManager {
  private readonly SNAKE_CONFIG: {
    displayChar: string;
    bodyChar: string;
    color: cglColor;
    bodyColor: cglColor;
    baseScore: number;
    bodyScore: number;
    moveInterval: number;
    spawnWeight: number;
    maxCount: number;
    threatLevel: ThreatLevel;
    learningObjective: string;
    counterStrategies: string[];
  } = {
    displayChar: "S", // 頭部
    bodyChar: "s", // 胴体
    color: "yellow",
    bodyColor: "light_yellow",
    baseScore: 330, // 全体スコア（頭部のみで判定）
    bodyScore: 0, // 胴体セグメントスコア（使用しない）
    moveInterval: 12, // プレイヤーより少し遅い
    spawnWeight: 8,
    maxCount: 2,
    threatLevel: ThreatLevel.HIGH,
    learningObjective: "複雑な移動パターンを理解し、空間制御を習得する",
    counterStrategies: [
      "スネーク敵の頭部を狙って撃破する",
      "スネーク敵を自分の尻尾に衝突させる",
      "スネーク敵の移動パターンを読んで先回りする",
      "スネーク敵の縄張りを避けて安全な領域を確保する",
    ],
  };

  private readonly SNAKE_BEHAVIOR_CONFIG = {
    initialLength: 3, // 初期長さ（頭部 + 胴体2つ）
    maxLength: 3, // 最大長さ（固定）
    growthInterval: 0, // 成長しない
    territoryRadius: 6, // 縄張り半径
    pathHistoryLength: 20, // 移動履歴保持数
    selfCollisionEnabled: true, // 自己衝突有効
    chaseActivationDistance: 8, // 追跡開始距離
    territorialReturnDistance: 10, // 縄張り復帰距離
    directionChangeChance: 0.2, // 方向転換確率
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options?: { isBlinking?: boolean }
  ): SnakeEnemy | null {
    if (type !== EnemyType.SNAKE) {
      return null;
    }

    const config = this.SNAKE_BEHAVIOR_CONFIG;
    const isBlinking = options?.isBlinking || false;
    const blinkDuration = isBlinking ? 120 : 0; // 2秒間点滅

    const enemy: SnakeEnemy = {
      id: this.generateEnemyId("snake"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: isBlinking,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.SNAKE,
      baseScore: this.SNAKE_CONFIG.baseScore,
      moveInterval: this.SNAKE_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.SNAKE_CONFIG.threatLevel,
      playerLearningHints: this.SNAKE_CONFIG.counterStrategies,

      // スネーク固有のプロパティ
      body: [{ x: position.x, y: position.y }], // 初期は頭部のみ
      maxLength: config.maxLength,
      currentLength: 1,
      growthRate: config.growthInterval,
      lastGrowthTime: Date.now(),
      movementPattern: "patrol",
      territoryCenter: { x: position.x, y: position.y },
      territoryRadius: config.territoryRadius,
      pathHistory: [],
      selfCollisionCheck: config.selfCollisionEnabled,
    };

    // 初期胴体セグメントを追加
    this.initializeBody(enemy);

    return enemy;
  }

  private initializeBody(enemy: SnakeEnemy): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    // 初期長さまで胴体を追加
    for (let i = 1; i < config.initialLength; i++) {
      const prevSegment = enemy.body[i - 1];
      const newSegment = this.calculateSafeBodyPosition(
        prevSegment,
        enemy.direction
      );
      if (newSegment) {
        enemy.body.push(newSegment);
        enemy.currentLength++;
      }
    }
  }

  private calculateSafeBodyPosition(
    headPos: Position,
    direction: Direction
  ): Position | null {
    // 頭部の反対方向に胴体を配置
    const oppositeDirection = this.getOppositeDirection(direction);
    const bodyPos = { ...headPos };

    switch (oppositeDirection) {
      case Direction.UP:
        bodyPos.y--;
        break;
      case Direction.DOWN:
        bodyPos.y++;
        break;
      case Direction.LEFT:
        bodyPos.x--;
        break;
      case Direction.RIGHT:
        bodyPos.x++;
        break;
    }

    // 境界チェック
    if (bodyPos.x < 1 || bodyPos.x >= 39 || bodyPos.y < 2 || bodyPos.y >= 24) {
      return null;
    }

    return bodyPos;
  }

  private getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case Direction.UP:
        return Direction.DOWN;
      case Direction.DOWN:
        return Direction.UP;
      case Direction.LEFT:
        return Direction.RIGHT;
      case Direction.RIGHT:
        return Direction.LEFT;
      default:
        return Direction.DOWN;
    }
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SNAKE) return;

    const snakeEnemy = enemy as SnakeEnemy;

    // 成長処理（無効化済み）
    this.updateGrowth(snakeEnemy);

    // 移動パターンの決定
    this.updateMovementPattern(snakeEnemy, gameState);

    // 自己衝突チェック
    if (this.checkSelfCollision(snakeEnemy)) {
      snakeEnemy.isDestroyed = true;
      return;
    }

    // 移動履歴の更新
    this.updatePathHistory(snakeEnemy);
  }

  private updateGrowth(enemy: SnakeEnemy): void {
    // 成長システムを無効化 - 胴体は2つで固定
    // 何もしない
  }

  private growSnake(enemy: SnakeEnemy): void {
    if (enemy.body.length === 0) return;

    const tail = enemy.body[enemy.body.length - 1];
    const newSegment = { ...tail }; // 尻尾の位置に新しいセグメントを追加

    enemy.body.push(newSegment);
    enemy.currentLength++;
  }

  private updateMovementPattern(enemy: SnakeEnemy, gameState: GameState): void {
    const playerPos = gameState.playerPosition;
    const distanceToPlayer = this.calculateDistance(
      { x: enemy.x, y: enemy.y },
      playerPos
    );
    const distanceToTerritory = this.calculateDistance(
      { x: enemy.x, y: enemy.y },
      enemy.territoryCenter
    );

    const config = this.SNAKE_BEHAVIOR_CONFIG;

    // 移動パターンの決定
    if (distanceToTerritory > config.territorialReturnDistance) {
      enemy.movementPattern = "territorial";
    } else if (distanceToPlayer <= config.chaseActivationDistance) {
      enemy.movementPattern = "chase";
    } else {
      enemy.movementPattern = "patrol";
    }
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  private checkSelfCollision(enemy: SnakeEnemy): boolean {
    if (!enemy.selfCollisionCheck || enemy.body.length <= 1) {
      return false;
    }

    const head = enemy.body[0];

    // 頭部が胴体の他の部分と衝突しているかチェック
    for (let i = 1; i < enemy.body.length; i++) {
      const segment = enemy.body[i];
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }

    return false;
  }

  private updatePathHistory(enemy: SnakeEnemy): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    enemy.pathHistory.push({ x: enemy.x, y: enemy.y });

    if (enemy.pathHistory.length > config.pathHistoryLength) {
      enemy.pathHistory.shift();
    }
  }

  protected updateMovement(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SNAKE) return;

    const snakeEnemy = enemy as SnakeEnemy;

    // 点滅中は移動しない
    if (snakeEnemy.isBlinking) {
      return;
    }

    // 移動カウンターをチェック
    snakeEnemy.moveCounter++;
    if (snakeEnemy.moveCounter < snakeEnemy.moveInterval) {
      return; // まだ移動時間ではない
    }

    // 移動カウンターをリセット
    snakeEnemy.moveCounter = 0;

    this.moveSnakeEnemy(snakeEnemy, gameState);
  }

  private moveSnakeEnemy(snakeEnemy: SnakeEnemy, gameState: GameState): void {
    // 移動方向の決定
    this.determineMovementDirection(snakeEnemy, gameState);

    // 新しい頭部位置の計算
    const newHeadPos = this.calculateNewPosition(snakeEnemy);

    // 移動可能性チェック（スネーク専用）
    if (this.isValidSnakePosition(newHeadPos, snakeEnemy, gameState)) {
      // 胴体の移動（頭部から尻尾へ）
      this.moveSnakeBody(snakeEnemy, newHeadPos);
    } else {
      // 移動できない場合は方向転換を試行
      this.changeDirection(snakeEnemy);

      // 方向転換後に再度移動を試行
      const retryHeadPos = this.calculateNewPosition(snakeEnemy);
      if (this.isValidSnakePosition(retryHeadPos, snakeEnemy, gameState)) {
        this.moveSnakeBody(snakeEnemy, retryHeadPos);
      }
    }
  }

  private determineMovementDirection(
    enemy: SnakeEnemy,
    gameState: GameState
  ): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    switch (enemy.movementPattern) {
      case "chase":
        this.setChaseDirection(enemy, gameState.playerPosition);
        break;
      case "territorial":
        this.setTerritorialDirection(enemy);
        break;
      case "patrol":
      default:
        this.setPatrolDirection(enemy);
        break;
    }
  }

  private setChaseDirection(enemy: SnakeEnemy, playerPos: Position): void {
    const dx = playerPos.x - enemy.x;
    const dy = playerPos.y - enemy.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      enemy.direction = dy > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private setTerritorialDirection(enemy: SnakeEnemy): void {
    const dx = enemy.territoryCenter.x - enemy.x;
    const dy = enemy.territoryCenter.y - enemy.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      enemy.direction = dy > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private setPatrolDirection(enemy: SnakeEnemy): void {
    const config = this.SNAKE_BEHAVIOR_CONFIG;

    // ランダムに方向転換
    if (Math.random() < config.directionChangeChance) {
      enemy.direction = Math.floor(Math.random() * 4);
    }
  }

  private changeDirection(enemy: SnakeEnemy): void {
    // 利用可能な方向を探す
    const directions = [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ];
    const validDirections = directions.filter((dir) => {
      const testPos = this.calculateNewPositionWithDirection(enemy, dir);
      return this.isValidSnakePosition(testPos, enemy, null);
    });

    if (validDirections.length > 0) {
      enemy.direction =
        validDirections[Math.floor(Math.random() * validDirections.length)];
    }
  }

  protected calculateNewPosition(enemy: SnakeEnemy): Position {
    return this.calculateNewPositionWithDirection(enemy, enemy.direction);
  }

  private calculateNewPositionWithDirection(
    enemy: SnakeEnemy,
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

  private isValidSnakePosition(
    pos: Position,
    snakeEnemy: SnakeEnemy,
    gameState: GameState | null
  ): boolean {
    // 壁チェック（画面境界）
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // 自分の胴体との衝突チェック
    const hasOwnBody = snakeEnemy.body.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasOwnBody) return false;

    if (gameState) {
      // プレイヤーのスネークとの衝突チェック
      const hasPlayerSnake = gameState.snakeSegments.some(
        (segment) => segment.x === pos.x && segment.y === pos.y
      );
      if (hasPlayerSnake) return false;

      // 他の敵との衝突チェック（点滅中でない敵のみ）
      const hasOtherEnemy = this.getAllEnemies().some(
        (enemy) =>
          enemy.id !== snakeEnemy.id &&
          !enemy.isBlinking &&
          enemy.x === pos.x &&
          enemy.y === pos.y
      );
      if (hasOtherEnemy) return false;
    }

    return true;
  }

  private moveSnakeBody(enemy: SnakeEnemy, newHeadPos: Position): void {
    // 新しい頭部位置を先頭に追加
    enemy.body.unshift(newHeadPos);

    // 敵の位置を頭部位置に更新
    enemy.x = newHeadPos.x;
    enemy.y = newHeadPos.y;

    // 胴体の長さを維持（尻尾を削除）
    if (enemy.body.length > enemy.currentLength) {
      enemy.body.pop();
    }
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.SNAKE) {
      return { char: "?", attributes: { color: "white" } };
    }

    const snakeEnemy = enemy as SnakeEnemy;
    const config = this.SNAKE_CONFIG;

    // 点滅状態の処理
    if (enemy.isBlinking) {
      const blinkPhase = Math.floor(enemy.blinkDuration / 10) % 2;
      return {
        char: blinkPhase === 0 ? config.displayChar : "o",
        attributes: {
          color: blinkPhase === 0 ? config.color : "light_red",
        },
      };
    }

    // 通常状態（頭部）
    return {
      char: config.displayChar,
      attributes: {
        color: config.color,
      },
    };
  }

  public getSnakeBodyDisplayInfo(enemy: SnakeEnemy): Array<{
    pos: Position;
    char: string;
    attributes: CellAttributes;
  }> {
    const config = this.SNAKE_CONFIG;
    const bodyDisplay: Array<{
      pos: Position;
      char: string;
      attributes: CellAttributes;
    }> = [];

    // 胴体セグメント（頭部以外）を表示
    for (let i = 1; i < enemy.body.length; i++) {
      const segment = enemy.body[i];

      bodyDisplay.push({
        pos: segment,
        char: config.bodyChar,
        attributes: {
          color: enemy.isBlinking ? "light_red" : config.bodyColor,
        },
      });
    }

    return bodyDisplay;
  }

  // スネーク敵の胴体位置を取得（衝突判定用）
  public getSnakeBodyPositions(enemy: SnakeEnemy): Position[] {
    return enemy.body.slice(1); // 頭部以外の胴体セグメント
  }

  // スネーク敵の頭部が囲まれているかチェック
  public isSnakeHeadEnclosed(
    enemy: SnakeEnemy,
    enclosedArea: Position[]
  ): boolean {
    const head = enemy.body[0];
    return enclosedArea.some((pos) => pos.x === head.x && pos.y === head.y);
  }

  // スネーク敵の破壊時のスコア計算
  public calculateDestroyScore(enemy: SnakeEnemy): number {
    const config = this.SNAKE_CONFIG;
    const headScore = config.baseScore;
    const bodyScore = (enemy.body.length - 1) * config.bodyScore; // 頭部以外の胴体

    return headScore + bodyScore;
  }

  // スネーク固有のメソッド
  public spawnSnake(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const snake = this.createEnemy(EnemyType.SNAKE, position, {
      isBlinking,
    });
    if (snake) {
      this.addEnemy(snake);
      return snake.id;
    }
    return null;
  }

  public getSnakeCount(): number {
    return this.getEnemiesByType(EnemyType.SNAKE).length;
  }

  public getAllSnakes(): SnakeEnemy[] {
    return this.getEnemiesByType(EnemyType.SNAKE) as SnakeEnemy[];
  }

  // デバッグ情報を取得
  public getDebugInfo(): any {
    const snakeEnemies = Array.from(this.enemies.values()) as SnakeEnemy[];
    return {
      totalSnakes: snakeEnemies.length,
      snakes: snakeEnemies.map((snake: SnakeEnemy) => ({
        id: snake.id,
        position: { x: snake.x, y: snake.y },
        bodyLength: snake.body.length,
        currentLength: snake.currentLength,
        maxLength: snake.maxLength,
        movementPattern: snake.movementPattern,
        isBlinking: snake.isBlinking,
      })),
    };
  }
}
