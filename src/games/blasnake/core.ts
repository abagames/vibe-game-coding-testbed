import {
  cglColor,
  CellAttributes,
  CellInfo,
  InputState,
  GridData,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
} from "../../core/coreTypes.js";
import { BaseGame } from "../../core/BaseGame.js";

const INITIAL_LIVES = 3;
const SNAKE_MOVEMENT_INTERVAL = 8; // Move once every 8 frames

interface Position {
  x: number;
  y: number;
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

interface Enemy {
  x: number;
  y: number;
  direction: Direction;
  moveCounter: number;
  isBlinking: boolean;
  blinkDuration: number;
  maxBlinkDuration: number;
}

interface ExplosionEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
}

interface EnemyDestroyEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
  score: number; // 獲得点数
  multiplier: number; // 倍率（1, 2, 3...）
}

interface GuideLine {
  x: number;
  y: number;
}

interface BlasnakeGameOptions {
  initialLives?: number;
  movementInterval?: number;
  enemyCount?: number;
}

export class CoreGameLogic extends BaseGame {
  private snake: Position[];
  private direction: Direction;
  private nextDirection: Direction;
  private food: Position;
  private enemies: Enemy[];
  private explosions: ExplosionEffect[];
  private enemyDestroyEffects: EnemyDestroyEffect[];
  private guideLines: GuideLine[];
  private movementFrameCounter: number;
  private movementInterval: number;
  private enemyCount: number;
  private enemySpawnTimer: number;
  private enemySpawnInterval: number;
  private fastSpawnInterval: number;
  private minEnemyCount: number;
  private isWaitingForRestart: boolean;
  private playerExplosionPosition: Position | null;
  private highScore: number;

  constructor(options: BlasnakeGameOptions = {}) {
    const {
      initialLives = INITIAL_LIVES,
      movementInterval = SNAKE_MOVEMENT_INTERVAL,
      enemyCount = 5, // 元の設定に戻す
    } = options;
    super({ initialLives });
    this.snake = [];
    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.food = { x: 0, y: 0 };
    this.enemies = [];
    this.explosions = [];
    this.enemyDestroyEffects = [];
    this.guideLines = [];
    this.movementFrameCounter = 0;
    this.movementInterval = movementInterval;
    this.enemyCount = enemyCount;
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 600; // 10秒間隔（元の設定）
    this.fastSpawnInterval = 60; // 1秒間隔（変更後）
    this.minEnemyCount = 5; // 5体まで素早く出現
    this.isWaitingForRestart = false;
    this.playerExplosionPosition = null;
    this.highScore = 0;
    this.initializeGame();
  }

  public initializeGame(): void {
    this.resetGame();

    // スネークの初期位置（画面中央付近）
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 4, y: startY },
      { x: startX - 5, y: startY },
      { x: startX - 6, y: startY },
      { x: startX - 7, y: startY },
      { x: startX - 8, y: startY },
      { x: startX - 9, y: startY },
    ];

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    this.generateFood();
    // 初期状態では敵を生成しない（自動補充システムで補充される）
  }

  private drawStaticElements(): void {
    // Draw border walls
    const wallChar = "#";
    const wallAttributes = {
      entityType: "wall",
      isPassable: false,
      color: "light_black",
    } as const;

    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      this.drawText(wallChar, x, 1, wallAttributes);
      this.drawText(wallChar, x, VIRTUAL_SCREEN_HEIGHT - 1, wallAttributes);
    }
    for (let y = 1; y < VIRTUAL_SCREEN_HEIGHT - 1; y++) {
      this.drawText(wallChar, 0, y, wallAttributes);
      this.drawText(wallChar, VIRTUAL_SCREEN_WIDTH - 1, y, wallAttributes);
    }

    // Draw food
    this.drawText("$", this.food.x, this.food.y, {
      entityType: "food",
      isPassable: true,
      color: "yellow",
    });
  }

  private drawSnake(): void {
    // Draw snake head
    if (this.snake.length > 0) {
      const head = this.snake[0];
      this.drawText("@", head.x, head.y, {
        entityType: "snake_head",
        isPassable: false,
        color: "green",
      });
    }

    // Draw snake body
    for (let i = 1; i < this.snake.length; i++) {
      const segment = this.snake[i];
      this.drawText("*", segment.x, segment.y, {
        entityType: "snake_body",
        isPassable: false,
        color: "light_green",
      });
    }
  }

  private drawEnemies(): void {
    for (const enemy of this.enemies) {
      // 点滅中の敵は一定間隔で表示/非表示を切り替える
      if (enemy.isBlinking) {
        // 5フレームごとに表示状態を切り替える（より高速で点滅）
        const blinkPhase =
          Math.floor((enemy.maxBlinkDuration - enemy.blinkDuration) / 5) % 2;
        if (blinkPhase === 0) {
          // 点滅中は「o」で薄い赤色で表示
          this.drawText("o", enemy.x, enemy.y, {
            entityType: "enemy_blinking",
            isPassable: true, // 点滅中は通過可能
            color: "light_red",
          });
        }
      } else {
        // 通常の敵表示
        this.drawText("X", enemy.x, enemy.y, {
          entityType: "enemy",
          isPassable: false,
          color: "red",
        });
      }
    }
  }

  private drawExplosions(): void {
    for (const explosion of this.explosions) {
      // 爆発エフェクトの進行度に応じて文字と色を変更
      const progress = explosion.duration / explosion.maxDuration;
      let char = "!";
      let color: cglColor = "red";

      if (progress > 0.7) {
        char = "*";
        color = "yellow";
      } else if (progress > 0.4) {
        char = "!";
        color = "light_red";
      } else if (progress > 0.2) {
        char = "+";
        color = "red";
      } else {
        char = ".";
        color = "red";
      }

      this.drawText(char, explosion.x, explosion.y, {
        entityType: "explosion",
        isPassable: true,
        color: color,
      });
    }
  }

  private drawEnemyDestroyEffects(): void {
    for (const effect of this.enemyDestroyEffects) {
      const progress = effect.duration / effect.maxDuration;
      let char = "X";
      let color: cglColor = "red";

      // 敵破壊エフェクト
      if (progress > 0.9) {
        char = "#"; // 敵破壊の瞬間
        color = "yellow";
      } else if (progress > 0.8) {
        char = "%"; // 破壊の拡散
        color = "yellow";
      } else if (progress > 0.6) {
        char = "&"; // 破壊の継続
        color = "light_red";
      } else if (progress > 0.4) {
        char = "~"; // 破壊の減衰
        color = "red";
      } else if (progress > 0.3) {
        char = "-"; // 破壊の終了
        color = "light_red";
      } else {
        // エフェクトの最後30%で点数を横に並べて表示
        console.log(effect.score);
        if (effect.score > 0) {
          const scoreText = `${effect.score}`;

          // 点数テキストを横に並べて表示
          for (let i = 0; i < scoreText.length; i++) {
            const charX = effect.x + i;
            // 画面境界チェック
            if (charX >= 1 && charX < VIRTUAL_SCREEN_WIDTH - 1) {
              this.drawText(scoreText.charAt(i), charX, effect.y, {
                entityType: "score_display",
                isPassable: true,
                color: "white",
              });
            }
          }
          // この場合は通常の描画をスキップ
          continue;
        } else {
          char = "+";
          color = "light_red";
        }
      }

      this.drawText(char, effect.x, effect.y, {
        entityType: "enemy_destroy_effect",
        isPassable: true,
        color: color,
      });
    }
  }

  private updateExplosions(): void {
    // 爆発エフェクトの持続時間を減らし、期限切れのものを削除
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      this.explosions[i].duration--;
      if (this.explosions[i].duration <= 0) {
        const explosion = this.explosions[i];

        // プレイヤー爆発エフェクトが終了した場合のチェック
        if (
          this.isWaitingForRestart &&
          this.playerExplosionPosition &&
          explosion.x === this.playerExplosionPosition.x &&
          explosion.y === this.playerExplosionPosition.y
        ) {
          // プレイヤー爆発エフェクト終了、リスタート実行
          this.isWaitingForRestart = false;
          this.playerExplosionPosition = null;
          this.restartFromBeginning();
        }

        this.explosions.splice(i, 1);
      }
    }
  }

  private updateEnemyDestroyEffects(): void {
    // 敵破壊エフェクトの持続時間を減らし、期限切れのものを削除
    for (let i = this.enemyDestroyEffects.length - 1; i >= 0; i--) {
      this.enemyDestroyEffects[i].duration--;
      if (this.enemyDestroyEffects[i].duration <= 0) {
        this.enemyDestroyEffects.splice(i, 1);
      }
    }
  }

  private addExplosionEffect(x: number, y: number): void {
    this.explosions.push({
      x: x,
      y: y,
      duration: 40, // 40フレーム持続（より長く）
      maxDuration: 40,
    });
  }

  private addEnemyDestroyEffect(
    x: number,
    y: number,
    score: number = 0,
    multiplier: number = 1
  ): void {
    this.enemyDestroyEffects.push({
      x: x,
      y: y,
      duration: 120, // 120フレーム持続（2秒間、より長く表示）
      maxDuration: 120,
      score: score,
      multiplier: multiplier,
    });
  }

  private updateGuideLines(): void {
    this.guideLines = [];
    if (this.snake.length === 0) return;

    const head = this.snake[0];
    let currentX = head.x;
    let currentY = head.y;
    let lineLength = 0;
    const maxLineLength = 5; // 最大5キャラクターに制限

    // 現在の進行方向に沿って補助線を延長
    while (lineLength < maxLineLength) {
      switch (this.direction) {
        case Direction.UP:
          currentY--;
          break;
        case Direction.DOWN:
          currentY++;
          break;
        case Direction.LEFT:
          currentX--;
          break;
        case Direction.RIGHT:
          currentX++;
          break;
      }

      // 壁に当たったら停止
      if (
        currentX < 1 ||
        currentX >= VIRTUAL_SCREEN_WIDTH - 1 ||
        currentY < 2 ||
        currentY >= VIRTUAL_SCREEN_HEIGHT - 1
      ) {
        break;
      }

      // スネークの体に当たったら停止
      const hitSnake = this.snake.some(
        (segment) => segment.x === currentX && segment.y === currentY
      );
      if (hitSnake) {
        break;
      }

      // 敵に当たったら停止
      const hitEnemy = this.enemies.some(
        (enemy) => enemy.x === currentX && enemy.y === currentY
      );
      if (hitEnemy) {
        break;
      }

      // 食べ物に当たったら停止 (補助線では取れない)
      if (currentX === this.food.x && currentY === this.food.y) {
        break;
      }

      this.guideLines.push({ x: currentX, y: currentY });
      lineLength++;
    }
  }

  private drawGuideLines(): void {
    for (const guideLine of this.guideLines) {
      this.drawText(".", guideLine.x, guideLine.y, {
        entityType: "guide",
        isPassable: true,
        color: "light_blue",
      });
    }
  }

  private generateFood(): void {
    let foodPosition: Position;
    let validPosition = false;

    do {
      foodPosition = {
        x: Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1,
        y: Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 3)) + 2,
      };

      // スネークの体と重ならない位置を確保
      validPosition = !this.snake.some(
        (segment) =>
          segment.x === foodPosition.x && segment.y === foodPosition.y
      );
    } while (!validPosition);

    this.food = foodPosition;
  }

  private moveSnake(): void {
    if (this.isGameOver()) return;

    // 方向を更新
    this.direction = this.nextDirection;

    // 頭の新しい位置を計算
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case Direction.UP:
        head.y--;
        break;
      case Direction.DOWN:
        head.y++;
        break;
      case Direction.LEFT:
        head.x--;
        break;
      case Direction.RIGHT:
        head.x++;
        break;
    }

    // 新しい頭を追加
    this.snake.unshift(head);

    // 食べ物を食べたかチェック
    if (head.x === this.food.x && head.y === this.food.y) {
      this.addScore(10);
      this.generateFood();

      // スネークの成長のため、尻尾を削除しない
    } else {
      // 食べ物を食べていない場合、尻尾を削除
      this.snake.pop();
    }
  }

  private moveEnemies(): void {
    for (const enemy of this.enemies) {
      enemy.moveCounter++;
      if (enemy.moveCounter >= 12) {
        enemy.moveCounter = 0;

        if (Math.random() < 0.3) {
          enemy.direction = Math.floor(Math.random() * 4);
        }

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

        if (this.isValidEnemyPosition(newPos)) {
          enemy.x = newPos.x;
          enemy.y = newPos.y;
        } else {
          enemy.direction = Math.floor(Math.random() * 4);
        }
      }
    }
  }

  private isValidEnemyPosition(pos: Position): boolean {
    // 壁チェック
    if (
      pos.x < 1 ||
      pos.x >= VIRTUAL_SCREEN_WIDTH - 1 ||
      pos.y < 2 ||
      pos.y >= VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      return false;
    }

    // スネークとの衝突チェック
    const hasSnake = this.snake.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasSnake) return false;

    // 他の敵との衝突チェック（点滅中でない敵のみ）
    const hasOtherEnemy = this.enemies.some(
      (enemy) => !enemy.isBlinking && enemy.x === pos.x && enemy.y === pos.y
    );
    if (hasOtherEnemy) return false;

    return true;
  }

  private checkCollisions(): void {
    const head = this.snake[0];

    // 壁との衝突
    if (
      head.x < 1 ||
      head.x >= VIRTUAL_SCREEN_WIDTH - 1 ||
      head.y < 2 ||
      head.y >= VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      this.explodePlayer();
      return;
    }

    // 自分の体との衝突
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        this.explodePlayer();
        return;
      }
    }
  }

  private checkAreaEnclosure(): void {
    // スネークが十分に長い場合のみ囲み判定を行う
    if (this.snake.length < 8) return;

    const head = this.snake[0];
    const tailSegments = this.snake.slice(-3);
    const isNearTail = tailSegments.some(
      (segment) =>
        Math.abs(head.x - segment.x) <= 2 && Math.abs(head.y - segment.y) <= 2
    );
    if (!isNearTail) return;

    const allAreas = this.findSeparateAreas();
    const enclosedAreas = allAreas.filter((area) => !area.isBorderConnected);

    if (enclosedAreas.length > 0) {
      let smallestEnclosedArea = enclosedAreas[0];
      for (const area of enclosedAreas) {
        if (area.size < smallestEnclosedArea.size) {
          smallestEnclosedArea = area;
        }
      }

      const totalGameArea =
        (VIRTUAL_SCREEN_WIDTH - 2) * (VIRTUAL_SCREEN_HEIGHT - 3);
      if (smallestEnclosedArea.size <= totalGameArea * 0.3) {
        const enemiesDestroyed = this.explodeAreaFromPosition(
          smallestEnclosedArea.startPos
        );
        if (enemiesDestroyed > 0) {
          // スコアは既にexplodeAreaで加算済み
          const totalScore =
            enemiesDestroyed * 100 +
            (enemiesDestroyed * (enemiesDestroyed - 1) * 100) / 2;
          console.log(
            `💥 BLAST! ${enemiesDestroyed} enemies destroyed! Total Score: +${totalScore}`
          );
        }
      }
    }
  }

  // 分離された領域を見つける
  private findSeparateAreas(): Array<{
    size: number;
    startPos: Position;
    isBorderConnected: boolean;
  }> {
    const visited: boolean[][] = [];
    for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
      visited[y] = new Array(VIRTUAL_SCREEN_WIDTH).fill(false);
    }

    const areas: Array<{
      size: number;
      startPos: Position;
      isBorderConnected: boolean;
    }> = [];

    // 全ての空きスペースをチェック
    for (let y = 2; y < VIRTUAL_SCREEN_HEIGHT - 1; y++) {
      for (let x = 1; x < VIRTUAL_SCREEN_WIDTH - 1; x++) {
        if (!visited[y][x] && this.isEmptySpace(x, y)) {
          const { size, isBorderConnected } = this.floodFillArea(x, y, visited);
          if (size > 0) {
            // Keep all found areas for now
            areas.push({
              size: size,
              startPos: { x, y },
              isBorderConnected: isBorderConnected,
            });
          }
        }
      }
    }
    return areas;
  }

  // 空きスペースかどうかをチェック（補助線も考慮）
  private isEmptySpace(x: number, y: number): boolean {
    // 壁チェック
    if (
      x < 1 ||
      x >= VIRTUAL_SCREEN_WIDTH - 1 ||
      y < 2 ||
      y >= VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      return false;
    }

    // スネークがある場所は空きではない
    const hasSnake = this.snake.some(
      (segment) => segment.x === x && segment.y === y
    );
    if (hasSnake) return false;

    // 補助線がある場所も空きではない
    const hasGuideLine = this.guideLines.some(
      (guide) => guide.x === x && guide.y === y
    );
    if (hasGuideLine) return false;

    return true;
  }

  // 領域のサイズを計算するfloodfill
  private floodFillArea(
    startX: number,
    startY: number,
    visited: boolean[][]
  ): { size: number; isBorderConnected: boolean } {
    let localSize = 0;
    let localIsBorderConnected = false;
    const queue: Position[] = [{ x: startX, y: startY }];
    visited[startY][startX] = true;
    localSize++;

    const directions = [
      { dx: 0, dy: -1 }, // UP
      { dx: 0, dy: 1 }, // DOWN
      { dx: -1, dy: 0 }, // LEFT
      { dx: 1, dy: 0 }, // RIGHT
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;

      for (const dir of directions) {
        const nextX = current.x + dir.dx;
        const nextY = current.y + dir.dy;

        if (
          nextX < 1 ||
          nextX >= VIRTUAL_SCREEN_WIDTH - 1 ||
          nextY < 2 ||
          nextY >= VIRTUAL_SCREEN_HEIGHT - 1
        ) {
          localIsBorderConnected = true; // Touched game border
          continue;
        }

        if (!visited[nextY][nextX] && this.isEmptySpace(nextX, nextY)) {
          visited[nextY][nextX] = true;
          localSize++;
          queue.push({ x: nextX, y: nextY });
        }
      }
    }
    return { size: localSize, isBorderConnected: localIsBorderConnected };
  }

  private explodeAreaFromPosition(startPos: Position): number {
    return this.explodeArea(startPos.x, startPos.y);
  }

  private explodeArea(startX: number, startY: number): number {
    const visited: boolean[][] = [];
    for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
      visited[y] = new Array(VIRTUAL_SCREEN_WIDTH).fill(false);
    }
    const explosionPositions: Position[] = [];
    const enemyPositions: Position[] = [];
    const baseScore = 100; // 基本点数

    // まず敵の位置を収集
    this.floodFillAndDestroy(startX, startY, visited, (x, y) => {
      const enemyIndex = this.enemies.findIndex(
        (enemy) => enemy.x === x && enemy.y === y
      );
      if (enemyIndex !== -1) {
        enemyPositions.push({ x, y });
        explosionPositions.push({ x, y });
      }
      // 爆発エフェクトを領域全体に追加（間引きして見やすく）
      if (Math.random() < 0.8) {
        // Increased probability
        this.addExplosionEffect(x, y);
      }
    });

    // 全ての敵に同じ倍率を適用
    const totalEnemies = enemyPositions.length;
    const multiplier = totalEnemies; // 敵の総数が倍率

    enemyPositions.forEach((pos) => {
      // 敵を削除
      const enemyIndex = this.enemies.findIndex(
        (enemy) => enemy.x === pos.x && enemy.y === pos.y
      );
      if (enemyIndex !== -1) {
        this.enemies.splice(enemyIndex, 1);
      }

      // 全ての敵に同じスコアと倍率を適用
      const score = baseScore * multiplier;

      // 敵破壊エフェクトを追加（点数と倍率付き）
      this.addEnemyDestroyEffect(pos.x, pos.y, score, multiplier);

      // スコアを加算
      this.addScore(score);
    });

    // 敵がいた位置には確実に爆発エフェクトを追加
    explosionPositions.forEach((pos) => {
      this.addExplosionEffect(pos.x, pos.y);
    });

    return totalEnemies;
  }

  private floodFillAndDestroy(
    startX: number,
    startY: number,
    visited: boolean[][],
    callback: (x: number, y: number) => void
  ): void {
    if (
      startX < 1 ||
      startX >= VIRTUAL_SCREEN_WIDTH - 1 ||
      startY < 2 ||
      startY >= VIRTUAL_SCREEN_HEIGHT - 1 ||
      visited[startY][startX]
    ) {
      return;
    }
    const hasSnake = this.snake.some(
      (segment) => segment.x === startX && segment.y === startY
    );
    if (hasSnake) return;

    const hasGuideLine = this.guideLines.some(
      (guide) => guide.x === startX && guide.y === startY
    );
    if (hasGuideLine) return;

    visited[startY][startX] = true;
    callback(startX, startY);
    this.floodFillAndDestroy(startX + 1, startY, visited, callback);
    this.floodFillAndDestroy(startX - 1, startY, visited, callback);
    this.floodFillAndDestroy(startX, startY + 1, visited, callback);
    this.floodFillAndDestroy(startX, startY - 1, visited, callback);
  }

  protected updateGame(inputState: InputState): void {
    this.drawStaticElements();

    // リスタート待機中は爆発エフェクトのみ更新
    if (this.isWaitingForRestart) {
      this.drawExplosions();
      this.updateExplosions();

      // 画面上部の表示
      // 左上: スコア
      this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });

      // 右上: ハイスコア
      const hiScoreText = `HI ${this.highScore}`;
      const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
      this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });

      // 中央: 残機アイコン（現在のライフ数-1個の@マークを表示）
      const remainingLives = this.getLives() - 1; // 現在プレイ中の分を除く
      if (remainingLives > 0) {
        const livesStartX = Math.floor(
          (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
        );
        for (let i = 0; i < remainingLives; i++) {
          this.drawText("@", livesStartX + i * 2, 0, { color: "green" });
        }
      }
      // "Restarting..."メッセージは削除
      return;
    }

    this.movementFrameCounter++;

    if (inputState.up && this.direction !== Direction.DOWN) {
      this.nextDirection = Direction.UP;
    } else if (inputState.down && this.direction !== Direction.UP) {
      this.nextDirection = Direction.DOWN;
    } else if (inputState.left && this.direction !== Direction.RIGHT) {
      this.nextDirection = Direction.LEFT;
    } else if (inputState.right && this.direction !== Direction.LEFT) {
      this.nextDirection = Direction.RIGHT;
    }

    if (this.movementFrameCounter >= this.movementInterval) {
      this.movementFrameCounter = 0;
      this.moveSnake();
      this.moveEnemies();
      this.checkCollisions();
      this.checkEnemyCollisions();
    }

    this.updateEnemySpawning();
    this.updateEnemyBlinking();

    this.updateGuideLines();
    this.drawGuideLines();
    this.drawSnake();
    this.drawEnemies();
    this.drawExplosions();
    this.updateExplosions();
    this.drawEnemyDestroyEffects();
    this.updateEnemyDestroyEffects();
    this.checkAreaEnclosure();

    // 画面上部の表示
    // 左上: スコア
    this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });

    // 右上: ハイスコア
    const hiScoreText = `HI ${this.highScore}`;
    const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
    this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });

    // 中央: 残機アイコン（現在のライフ数-1個の@マークを表示）
    const remainingLives = this.getLives() - 1; // 現在プレイ中の分を除く
    if (remainingLives > 0) {
      const livesStartX = Math.floor(
        (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
      );
      for (let i = 0; i < remainingLives; i++) {
        this.drawText("@", livesStartX + i * 2, 0, { color: "green" });
      }
    }
  }

  private generateEnemies(): void {
    this.enemies = [];
    for (let i = 0; i < this.enemyCount; i++) {
      let enemyPosition: Position;
      let validPosition = false;

      do {
        enemyPosition = {
          x: Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1,
          y: Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 3)) + 2,
        };

        const hasSnake = this.snake.some(
          (segment) =>
            segment.x === enemyPosition.x && segment.y === enemyPosition.y
        );
        const hasFood =
          this.food.x === enemyPosition.x && this.food.y === enemyPosition.y;
        const hasEnemy = this.enemies.some(
          (enemy) => enemy.x === enemyPosition.x && enemy.y === enemyPosition.y
        );

        validPosition = !hasSnake && !hasFood && !hasEnemy;
      } while (!validPosition);

      this.enemies.push({
        x: enemyPosition.x,
        y: enemyPosition.y,
        direction: Math.floor(Math.random() * 4),
        moveCounter: 0,
        isBlinking: false, // 初期敵は点滅しない
        blinkDuration: 0,
        maxBlinkDuration: 0,
      });
    }
  }

  private updateEnemyBlinking(): void {
    for (const enemy of this.enemies) {
      if (enemy.isBlinking) {
        enemy.blinkDuration--;
        if (enemy.blinkDuration <= 0) {
          enemy.isBlinking = false;
        }
      }
    }
  }

  private spawnNewEnemy(): void {
    let enemyPosition: Position;
    let validPosition = false;
    let attempts = 0;
    const maxAttempts = 50; // 無限ループを防ぐ

    do {
      enemyPosition = {
        x: Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1,
        y: Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 3)) + 2,
      };

      const hasSnake = this.snake.some(
        (segment) =>
          segment.x === enemyPosition.x && segment.y === enemyPosition.y
      );
      const hasFood =
        this.food.x === enemyPosition.x && this.food.y === enemyPosition.y;
      const hasEnemy = this.enemies.some(
        (enemy) => enemy.x === enemyPosition.x && enemy.y === enemyPosition.y
      );

      validPosition = !hasSnake && !hasFood && !hasEnemy;
      attempts++;
    } while (!validPosition && attempts < maxAttempts);

    if (validPosition) {
      const blinkDuration = 120; // 2秒間点滅（60fps想定）
      this.enemies.push({
        x: enemyPosition.x,
        y: enemyPosition.y,
        direction: Math.floor(Math.random() * 4),
        moveCounter: 0,
        isBlinking: true,
        blinkDuration: blinkDuration,
        maxBlinkDuration: blinkDuration,
      });
      console.log(
        `👹 Enemy spawned at (${enemyPosition.x}, ${enemyPosition.y}) - Total enemies: ${this.enemies.length}`
      );
    } else {
      console.log(`❌ Failed to spawn enemy after ${maxAttempts} attempts`);
    }
  }

  private updateEnemySpawning(): void {
    this.enemySpawnTimer++;

    const currentEnemyCount = this.enemies.length;
    const needsMoreEnemies = currentEnemyCount < this.minEnemyCount;

    // 敵数が最小値以下の場合は短時間で出現、そうでなければ通常間隔
    const spawnInterval = needsMoreEnemies
      ? this.fastSpawnInterval
      : this.enemySpawnInterval;

    // 最初の敵は即座に出現（敵が0体でタイマーが1以上の場合）
    const shouldSpawnImmediately =
      currentEnemyCount === 0 && this.enemySpawnTimer >= 1;

    if (this.enemySpawnTimer >= spawnInterval || shouldSpawnImmediately) {
      console.log(
        `⏰ Spawn timer reached! Current enemies: ${currentEnemyCount}, Min: ${this.minEnemyCount}, Fast spawn: ${needsMoreEnemies}, Immediate: ${shouldSpawnImmediately}`
      );
      this.spawnNewEnemy();
      this.enemySpawnTimer = 0;
    }
  }

  private checkEnemyCollisions(): void {
    const head = this.snake[0];

    // 点滅中でない敵との衝突チェック
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (!enemy.isBlinking && head.x === enemy.x && head.y === enemy.y) {
        this.explodePlayer();
        return;
      }
    }
  }

  private explodePlayer(): void {
    const head = this.snake[0];

    // 自機の位置に爆発エフェクトを追加
    this.addExplosionEffect(head.x, head.y);

    // プレイヤー爆発位置を記録
    this.playerExplosionPosition = { x: head.x, y: head.y };

    // 全ての敵を消滅させる（得点は入らない）
    this.enemies = [];

    // 敵破壊エフェクトをクリア（プレイヤー爆発エフェクトは残す）
    this.enemyDestroyEffects = [];

    // ライフを減らす
    this.loseLife();

    // ゲームオーバーでなければリスタート待機状態に
    if (!this.isGameOver()) {
      this.isWaitingForRestart = true;
      // スネークを非表示にする（空の配列にする）
      this.snake = [];
    }
  }

  private restartFromBeginning(): void {
    // スネークを初期状態に戻す
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    const startY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 4, y: startY },
      { x: startX - 5, y: startY },
      { x: startX - 6, y: startY },
      { x: startX - 7, y: startY },
      { x: startX - 8, y: startY },
      { x: startX - 9, y: startY },
    ];

    this.direction = Direction.RIGHT;
    this.nextDirection = Direction.RIGHT;
    this.movementFrameCounter = 0;

    // 新しい食べ物を生成
    this.generateFood();

    // リスタート時も敵は自動補充システムで補充される
    // this.generateEnemies(); を削除

    // スポーンタイマーをリセット
    this.enemySpawnTimer = 0;
  }

  public addScore(points: number): void {
    super.addScore(points);
    // ハイスコア更新
    if (this.getScore() > this.highScore) {
      this.highScore = this.getScore();
    }
  }
}
