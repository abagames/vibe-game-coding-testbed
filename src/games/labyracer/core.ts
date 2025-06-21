import {
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  BaseGameOptions,
} from "../../core/coreTypes.js";
import {
  BaseGameState,
  createBaseGame,
  drawText,
  drawCenteredText,
  addScore,
  loseLife,
  triggerGameOver,
  isGameOver,
  clearVirtualScreen,
  renderStandardUI,
  playSoundEffect,
  playMml,
  getHighScore,
} from "../../core/baseGame.js";

const MOVEMENT_INTERVAL = 8;

// 音響効果のパターン定数
const AUDIO_PATTERNS = {
  // 通常旗回収時の効果音
  FLAG_COLLECT: "@coin@s128 v60 l16 o6 c e",

  // 特殊旗回収時の効果音（より豪華な音）
  SPECIAL_FLAG_COLLECT: [
    "@synth@s456 v80 l16 o6 c e g >c e g >c<",
    "@synth@s789 v50 l8 o5 c g c g",
  ],

  // 特殊旗出現時の効果音
  SPECIAL_FLAG_SPAWN: [
    "@synth@s123 v70 l16 o6 g a b >c d d e e<",
    "@synth@s456 v50 l8 o4 c e g c e g",
    "@hit@d@s789 v40 l16 o4 c r c r c",
  ],

  // 煙幕発動時の効果音
  SMOKE_ACTIVATED: "@hit@s33 v80 l16 o4 c>c<c>c<c>c<",

  // 敵が煙に巻き込まれた時の効果音
  ENEMY_SMOKE_HIT: "@hit@s46 v80 l16 o5 c d e f g f e d c",

  // 敵同士が接触した時の効果音
  ENEMY_COLLISION: "@hit@s55 v70 l16 o5 c c+ d d+ e",

  // 敵出現時の警告音
  ENEMY_SPAWN_WARNING: "@synth@s65 v50 l16 o5 c+ r c+ r c+ r",

  // 敵破壊時のボーナス音（連続破壊の際に使用）
  ENEMY_DESTRUCTION_BONUS: "@laser@s99 v60 l16 o3 a8 r a a",

  // 迷路切り替えアニメーション開始音
  MAZE_TRANSITION_START: [
    "@synth@s111 v60 l16 o4 c g >c< g c",
    "@hit@d@s223 v60 l16 o4 c r c r c r",
  ],

  // 燃料警告音
  FUEL_WARNING: "@synth@s555 v70 l16 o5 c+ r c+ r c+ r c+ r",

  // 燃料切れ警告音
  FUEL_CRITICAL: "@laser@s666 v60 l16 o6 c r",

  // 自車増加時のジングル
  EXTRA_LIFE_JINGLE: [
    "@synth@s775 v80 l16 o5 c e g >c e g >c<",
    "@synth@s886 v70 l8 o4 c g c",
  ],

  // 燃料補給音
  FUEL_REFILL: "@synth@s999 v40 l16 o5 c d e f g a b >c<",
} as const;

type Position = {
  x: number;
  y: number;
};

type Enemy = {
  x: number;
  y: number;
  direction: number; // 0=上, 1=右, 2=下, 3=左
  movementCounter: number;
  id: number;
  previousDirection: number; // 前回の移動方向
  stuckCounter: number; // 行き詰まりカウンター
  isSpawning: boolean; // 出現中かどうか
  spawnTimer: number; // 出現タイマー（フレーム数）
  blinkState: boolean; // 点滅状態
  isStunned: boolean; // スタン状態（煙や敵車接触時）
  stunnedTimer: number; // スタンタイマー（フレーム数）
  stunnedRotationDirection: number; // スタン中の回転方向（0=時計回り、1=反時計回り）
  originalDirection: number; // スタン前の進行方向（復帰時に逆方向に使用）
  isFrozen: boolean; // 迷路切り替え時の一時停止状態
};

// 敵破壊時の得点表示用の型
type ScoreDisplay = {
  x: number;
  y: number;
  score: number;
  timer: number; // 表示残り時間（フレーム数）
};

export type LabyracerOptions = BaseGameOptions & {
  movementInterval?: number;
  enemyCount?: number;
};

export type LabyracerState = BaseGameState & {
  playerX: number;
  playerY: number;
  movementFrameCounter: number;
  movementInterval: number;
  maze: boolean[][]; // true = wall, false = path
  mazeWidth: number;
  mazeHeight: number;
  direction: number; // 0=上, 1=右, 2=下, 3=左
  flags: Position[]; // 回収する旗の位置
  specialFlags: Position[]; // 特殊な旗の位置（複数対応）
  hasCollectedAllLeftFlags: boolean; // 左半分の旗をすべて回収したか
  hasCollectedAllRightFlags: boolean; // 右半分の旗をすべて回収したか
  enemies: Enemy[]; // 敵の車
  nextEnemyId: number; // 次の敵のID
  smokeTrailActive: boolean; // 煙の軌跡が有効かどうか
  smokeTrailRemainingMoves: number; // 残りの煙出現回数
  smokeTrails: Array<{ x: number; y: number; timer: number }>; // 煙の位置とタイマー
  // アニメーション関連
  mazeTransitionActive: boolean; // 迷路切り替えアニメーションが有効かどうか
  transitionLineX: number; // アニメーション中の縦線のX座標
  transitionDirection: "left" | "right"; // アニメーションの方向（左端へ or 右端へ）
  transitionTimer: number; // アニメーションタイマー
  // 入力状態の追跡（just pressed検出用）
  previousInputState: InputState; // 前回の入力状態
  // 敵破壊ボーナスシステム
  destructionBonusCounter: number; // 連続破壊カウンター
  scoreDisplays: ScoreDisplay[]; // 得点表示の配列
  // 難易度システム
  difficulty: number; // 時間経過による難易度（0から開始、1分で1.0）
  enemyAppearanceCount: number; // 敵出現カウンター（旗取得時に蓄積）
  rocks: Position[]; // 岩の位置（迷路座標系）
  // FUELシステム
  fuel: number; // 現在の燃料（0-100）
  maxFuel: number; // 最大燃料
  fuelConsumptionMove: number; // 移動時の燃料消費量
  fuelConsumptionSmoke: number; // 煙使用時の燃料消費量
  fuelRefillAmount: number; // 特殊旗取得時の燃料補給量
  // ミスアニメーション関連
  isMissAnimation: boolean; // ミスアニメーション中かどうか
  missAnimationTimer: number; // ミスアニメーションタイマー（フレーム数）
  missAnimationFrame: number; // 爆発アニメーションのフレーム番号
  explosionX: number; // 爆発の中心X座標
  explosionY: number; // 爆発の中心Y座標
  initialPlayerX: number; // 初期プレイヤー位置X
  initialPlayerY: number; // 初期プレイヤー位置Y
  // 自動方向転換システム
  lastVerticalMovement: number; // 最後の縦方向移動 (0=上, 2=下, -1=なし)
  lastHorizontalMovement: number; // 最後の横方向移動 (1=右, 3=左, -1=なし)
  // 自車増加システム
  nextLifeThreshold: number; // 次の自車増加に必要なスコア
  lifeThresholdIndex: number; // 現在のフィボナッチ数列のインデックス
};

export function createLabyracerState(
  options: LabyracerOptions = {}
): LabyracerState {
  const { movementInterval = MOVEMENT_INTERVAL, ...baseOptions } = options;

  const baseState = createBaseGame({
    ...baseOptions,
    initialLives: 3, // 初期ライフを3に設定（最大5まで増加可能）
  });

  // 迷路のサイズを計算（画面の端を壁として残す）
  const mazeWidth = VIRTUAL_SCREEN_WIDTH - 2;
  const mazeHeight = VIRTUAL_SCREEN_HEIGHT - 4; // UI用に上下を空ける

  const playerX = 1; // 迷路の開始位置
  const playerY = 2;

  return {
    ...baseState,
    playerX,
    playerY,
    movementFrameCounter: 0,
    movementInterval,
    maze: [],
    mazeWidth,
    mazeHeight,
    direction: 0, // Assuming a default direction
    flags: [],
    specialFlags: [],
    hasCollectedAllLeftFlags: false,
    hasCollectedAllRightFlags: false,
    enemies: [],
    nextEnemyId: 0,
    smokeTrailActive: false,
    smokeTrailRemainingMoves: 0,
    smokeTrails: [],
    mazeTransitionActive: false,
    transitionLineX: 0,
    transitionDirection: "left",
    transitionTimer: 0,
    previousInputState: {}, // 初期状態は空のInputState
    destructionBonusCounter: 0, // 連続破壊カウンターの初期化
    scoreDisplays: [], // 得点表示の初期化
    difficulty: 0, // 時間経過による難易度（0から開始、1分で1.0）
    enemyAppearanceCount: 0, // 敵出現カウンター（旗取得時に蓄積）
    rocks: [], // 岩の位置（迷路座標系）
    fuel: 100, // 初期燃料
    maxFuel: 100, // 最大燃料
    fuelConsumptionMove: 0.25, // 移動時の燃料消費量（1/4に減少）
    fuelConsumptionSmoke: 3, // 煙使用時の燃料消費量（3に増加）
    fuelRefillAmount: 50, // 特殊旗取得時の燃料補給量
    // ミスアニメーション関連の初期化
    isMissAnimation: false,
    missAnimationTimer: 0,
    missAnimationFrame: 0,
    explosionX: 0,
    explosionY: 0,
    initialPlayerX: playerX,
    initialPlayerY: playerY,
    // 自動方向転換システムの初期化
    lastVerticalMovement: -1, // 初期状態は移動なし
    lastHorizontalMovement: -1, // 初期状態は移動なし
    // 自車増加システムの初期化
    nextLifeThreshold: 1000, // 最初の自車増加は1000点
    lifeThresholdIndex: 0, // フィボナッチ数列のインデックス（0から開始）
  };
}

// 左右対称の迷路を生成する関数
function generateSymmetricMaze(width: number, height: number): boolean[][] {
  // 迷路を初期化（すべて壁）
  const maze: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(true));

  // 迷路の半分の幅を計算
  const halfWidth = Math.floor(width / 2);

  // 左半分の迷路を生成
  const leftHalf = generateMazeHalf(halfWidth, height);

  // 行き止まりを解消
  const finalLeftHalf = removeDeadEnds(leftHalf);

  // 左半分を迷路にコピー
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < halfWidth; x++) {
      maze[y][x] = finalLeftHalf[y][x];
    }
  }

  // 右半分を左半分の鏡像として生成
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < halfWidth; x++) {
      const mirrorX = width - 1 - x;
      maze[y][mirrorX] = maze[y][x];
    }
  }

  // 中央の列を処理（幅が奇数の場合）
  if (width % 2 === 1) {
    const centerX = Math.floor(width / 2);
    for (let y = 1; y < height - 1; y += 2) {
      maze[y][centerX] = false; // 中央を通路にする
    }
  }
  return maze;
}

// 迷路の半分を生成する関数（再帰的バックトラッキング）
function generateMazeHalf(width: number, height: number): boolean[][] {
  const maze: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(true));

  // ランダムウォークで通路を生成
  const visited: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(false));

  function carve(x: number, y: number) {
    visited[y][x] = true;
    maze[y][x] = false;

    // ランダムな方向の配列を作成
    const directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
        // 間の壁を削除
        maze[y + dy / 2][x + dx / 2] = false;
        carve(nx, ny);
      }
    }
  }

  // 開始位置から迷路を生成
  carve(0, 0);
  return maze;
}

// 行き止まりを検出して解消する関数
function removeDeadEnds(maze: boolean[][]): boolean[][] {
  const height = maze.length;
  const width = maze[0].length;
  const newMaze = maze.map((row) => [...row]); // ディープコピー
  const halfWidth = Math.floor(width / 2);

  // 行き止まりを検出する関数
  function isDeadEnd(x: number, y: number): boolean {
    if (newMaze[y][x]) return false; // 壁の場合は行き止まりではない

    // 隣接する通路の数をカウント
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0], // 上、下、左、右
    ];

    let passageCount = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (!newMaze[ny][nx]) {
          // 通路の場合
          passageCount++;
        }
      }
    }

    // 隣接する通路が1つ以下の場合は行き止まり
    return passageCount <= 1 || (passageCount === 2 && Math.random() < 0.2);
  }

  // 行き止まりを解消する関数
  function resolveDeadEnd(x: number, y: number): void {
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0], // 上、下、左、右
    ];

    const shuffledDirections = directions.sort(() => Math.random());

    for (const [dx, dy] of shuffledDirections) {
      const nx = x + dx;
      const ny = y + dy;
      const nx2 = nx + dx;
      const ny2 = ny + dy;

      // 境界チェック
      if (nx2 >= 0 && nx2 < width && ny2 >= 0 && ny2 < height) {
        if (newMaze[ny][nx] && !newMaze[ny2][nx2]) {
          newMaze[ny][nx] = false; // 通路に変換
          return; // 一つの壁を変換したら終了
        }
      }
    }
  }

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (isDeadEnd(x, y)) {
        resolveDeadEnd(x, y);
      }
    }
  }
  return newMaze;
}

// 左右対称に旗を配置する関数
function generateSymmetricFlags(
  maze: boolean[][],
  width: number,
  height: number
): Position[] {
  // 左半分の旗を生成（迷路座標系）
  const leftFlags = generateHalfFlags(maze, width, height, "left");

  // 右半分に対称的に配置
  const rightFlags: Position[] = [];
  for (const leftFlag of leftFlags) {
    // 迷路座標系で対称位置を計算
    const mirrorX = width - leftFlag.x - 1;
    rightFlags.push({ x: mirrorX, y: leftFlag.y });
  }

  return [...leftFlags, ...rightFlags];
}

// 指定された半分に旗を配置する統一関数
function generateHalfFlags(
  maze: boolean[][],
  width: number,
  height: number,
  side: "left" | "right"
): Position[] {
  const flags: Position[] = [];
  const halfWidth = Math.floor(width / 2);
  const flagCount = 3;

  // 範囲を決定
  const startX = side === "left" ? 0 : halfWidth + 2;
  const endX = side === "left" ? halfWidth - 2 : width;

  // 通路の位置を収集
  const passagePositions: Position[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = startX; x < endX; x += 2) {
      if (!maze[y][x]) {
        passagePositions.push({ x, y });
      }
    }
  }

  // 開始位置付近は避ける（迷路座標系で比較）
  const validPositions = passagePositions.filter(
    (pos) => Math.abs(pos.x - 0) + Math.abs(pos.y - 0) > 3
  );

  // ランダムに旗の位置を選択
  const shuffled = validPositions.sort(() => Math.random() - 0.5);
  const selectedPositions = shuffled.slice(
    0,
    Math.min(flagCount, shuffled.length)
  );

  // 旗を追加（迷路座標系のまま保存）
  for (const pos of selectedPositions) {
    flags.push({ x: pos.x, y: pos.y });
  }

  return flags;
}

// 特殊な旗を指定された半分に生成する統一関数
function generateSpecialFlag(
  maze: boolean[][],
  width: number,
  height: number,
  side: "left" | "right",
  existingFlags: Position[] = []
): Position | null {
  const halfWidth = Math.floor(width / 2);

  // 範囲を決定
  const startX = side === "left" ? 0 : halfWidth + 2;
  const endX = side === "left" ? halfWidth - 2 : width;

  // 通路の位置を収集
  const passagePositions: Position[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = startX; x < endX; x += 2) {
      if (!maze[y][x]) {
        passagePositions.push({ x, y });
      }
    }
  }

  // 既存の旗の位置を避ける
  const availablePositions = passagePositions.filter(
    (pos) => !existingFlags.some((flag) => flag.x === pos.x && flag.y === pos.y)
  );

  // 中央付近に配置するため、中央に近い位置を優先
  const centerY = Math.floor(height / 2);
  const validPositions = availablePositions
    .filter((pos) => Math.abs(pos.y - centerY) < height / 3)
    .sort(() => Math.random() - 0.5);

  if (validPositions.length > 0) {
    const selectedPos = validPositions[0];
    return { x: selectedPos.x, y: selectedPos.y }; // 迷路座標系のまま返す
  }

  return null;
}

// 難易度に基づいて岩を配置する関数
function generateRocks(
  maze: boolean[][],
  width: number,
  height: number,
  difficulty: number
): Position[] {
  const rocks: Position[] = [];
  const rockCount = Math.floor(difficulty);

  if (rockCount <= 0) {
    return rocks;
  }

  // 壁の位置を収集（迷路座標系）
  const wallPositions: Position[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((y % 2 === 0 && x % 2 === 0) || (y % 2 === 1 && x % 2 === 1)) {
        continue;
      }
      // 壁、かつその上下もしくは左右が通路の場合
      if (maze[y][x]) {
        // 境界チェック
        if (
          (y > 0 && y < height - 1 && maze[y - 1][x] && maze[y + 1][x]) ||
          (x > 0 && x < width - 1 && maze[y][x - 1] && maze[y][x + 1])
        ) {
          wallPositions.push({ x, y });
        }
      }
    }
  }

  // ランダムに壁の位置を選択して岩を配置
  const shuffledWalls = wallPositions.sort(() => Math.random() - 0.5);
  const selectedPositions = shuffledWalls.slice(
    0,
    Math.min(rockCount, shuffledWalls.length)
  );

  for (const pos of selectedPositions) {
    rocks.push({ x: pos.x, y: pos.y });
    maze[pos.y][pos.x] = false;
  }

  return rocks;
}

// 旗の位置周辺に敵を出現させる関数（複数対応）
function spawnEnemiesNearFlag(
  state: LabyracerState,
  flagX: number,
  flagY: number,
  count: number
): LabyracerState {
  if (count <= 0) {
    return state;
  }

  // 旗の周辺の通路位置を探す（迷路座標系）
  const spawnRadius = 3;
  const potentialPositions: Position[] = [];

  for (let dy = -spawnRadius; dy <= spawnRadius; dy++) {
    for (let dx = -spawnRadius; dx <= spawnRadius; dx++) {
      const checkX = flagX + dx;
      const checkY = flagY + dy;

      // 迷路の境界内かチェック
      if (
        checkX >= 0 &&
        checkX < state.mazeWidth &&
        checkY >= 0 &&
        checkY < state.mazeHeight
      ) {
        // 通路かどうかチェック
        if (!state.maze[checkY][checkX]) {
          // 岩がないかチェック
          const hasRock = state.rocks.some(
            (rock) => rock.x === checkX && rock.y === checkY
          );

          if (!hasRock) {
            // プレイヤーの現在位置から一定距離離れているかチェック
            const playerMazeX = state.playerX - 1;
            const playerMazeY = state.playerY - 2;
            const distanceFromPlayer =
              Math.abs(checkX - playerMazeX) + Math.abs(checkY - playerMazeY);

            if (distanceFromPlayer >= 2) {
              potentialPositions.push({ x: checkX, y: checkY });
            }
          }
        }
      }
    }
  }

  // 有効な位置がない場合は何もしない
  if (potentialPositions.length === 0) {
    return state;
  }

  let newState = state;
  const newEnemies: Enemy[] = [];

  // 指定された数だけ敵を作成
  for (let i = 0; i < count; i++) {
    // ランダムに位置を選択
    const selectedPos =
      potentialPositions[Math.floor(Math.random() * potentialPositions.length)];

    // 新しい敵を作成
    const initialDirection = Math.floor(Math.random() * 4);
    const newEnemy: Enemy = {
      x: selectedPos.x + 1, // 画面座標系に変換
      y: selectedPos.y + 2, // 画面座標系に変換
      direction: initialDirection,
      movementCounter: 0,
      id: newState.nextEnemyId + i,
      previousDirection: initialDirection,
      stuckCounter: 0,
      isSpawning: true,
      spawnTimer: Math.floor(Math.random() * 30) + i * 15, // 出現タイミングをずらす
      blinkState: true,
      isStunned: false, // スタン状態の初期化
      stunnedTimer: 0, // スタンタイマーの初期化
      stunnedRotationDirection: Math.floor(Math.random() * 2), // ランダムな回転方向
      originalDirection: initialDirection, // 初期方向を保存
      isFrozen: false, // 迷路切り替え時の一時停止状態
    };

    newEnemies.push(newEnemy);
  }

  const finalState = {
    ...newState,
    enemies: [...newState.enemies, ...newEnemies],
    nextEnemyId: newState.nextEnemyId + count,
  };

  // 敵出現時の警告音を再生
  if (count > 0) {
    playMml(finalState, AUDIO_PATTERNS.ENEMY_SPAWN_WARNING);
  }

  return finalState;
}

// 指定された半分の迷路を再生成する統一関数
function regenerateHalf(
  state: LabyracerState,
  side: "left" | "right"
): LabyracerState {
  const maze = state.maze.map((row) => [...row]);
  const halfWidth = Math.floor(state.mazeWidth / 2);

  if (side === "left") {
    // 左半分の新しい迷路を生成
    const newLeftHalf = generateMazeHalf(halfWidth, state.mazeHeight);
    const finalLeftHalfMaze = removeDeadEnds(newLeftHalf);

    // 左半分を新しい迷路で置き換え
    for (let y = 0; y < state.mazeHeight; y++) {
      for (let x = 0; x < halfWidth; x++) {
        maze[y][x] = finalLeftHalfMaze[y][x];
      }
    }

    // 既存の右半分の旗を保持し、左半分に新しい旗を生成（迷路座標系で判定）
    const rightFlags = state.flags.filter((flag) => flag.x >= halfWidth);
    const leftFlags = generateHalfFlags(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      "left"
    );
    const newFlags = [...leftFlags, ...rightFlags];

    // 特殊な旗の部分の壁を削除
    for (const flag of state.specialFlags) {
      maze[flag.y][flag.x] = false;
    }

    // 岩を再生成（現在の難易度に基づく）
    const newRocks = generateRocks(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      state.difficulty
    );

    return {
      ...state,
      maze,
      flags: newFlags,
      specialFlags: state.specialFlags,
      hasCollectedAllLeftFlags: false,
      rocks: newRocks,
    };
  } else {
    // 右半分の新しい迷路を生成（左半分をベースにして鏡像作成）
    const newLeftHalf = generateMazeHalf(halfWidth, state.mazeHeight);
    const finalLeftHalfMaze = removeDeadEnds(newLeftHalf);

    // 右半分を左半分の鏡像で置き換え
    for (let y = 0; y < state.mazeHeight; y++) {
      for (let x = 0; x < halfWidth; x++) {
        const mirrorX = state.mazeWidth - 1 - x;
        maze[y][mirrorX] = finalLeftHalfMaze[y][x];
      }
    }

    // 既存の左半分の旗を保持し、右半分に新しい旗を生成（迷路座標系で判定）
    const leftFlags = state.flags.filter((flag) => flag.x < halfWidth);
    const rightFlags = generateHalfFlags(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      "right"
    );
    const newFlags = [...leftFlags, ...rightFlags];

    // 特殊な旗の部分の壁を削除
    for (const flag of state.specialFlags) {
      maze[flag.y][flag.x] = false;
    }

    // 岩を再生成（現在の難易度に基づく）
    const newRocks = generateRocks(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      state.difficulty
    );

    return {
      ...state,
      maze,
      flags: newFlags,
      specialFlags: state.specialFlags,
      hasCollectedAllRightFlags: false,
      rocks: newRocks,
    };
  }
}

export function initializeLabyracer(state: LabyracerState): LabyracerState {
  const playerX = 1;
  const playerY = 2;

  let newState: LabyracerState = {
    ...state,
    score: 0,
    lives: 3, // 初期ライフを3に設定
    gameOverState: false,
    playerX,
    playerY,
    movementFrameCounter: 0,
    direction: 1, // 初期方向は右向き
    nextEnemyId: 0, // 敵IDをリセット
    smokeTrailActive: false, // 煙の軌跡をリセット
    smokeTrailRemainingMoves: 0,
    smokeTrails: [],
    mazeTransitionActive: false,
    transitionLineX: 0,
    transitionDirection: "left",
    transitionTimer: 0,
    previousInputState: {
      action1: true, // ゲーム開始時のアクションボタンを押された状態として初期化
      action2: true, // ゲーム開始時のアクションボタンを押された状態として初期化
    },
    destructionBonusCounter: 0, // 連続破壊カウンターをリセット
    scoreDisplays: [], // 得点表示をリセット
    difficulty: 0, // 時間経過による難易度（0から開始、1分で1.0）
    enemyAppearanceCount: 1, // 敵出現カウンター（旗取得時に蓄積）
    rocks: [], // 岩の位置をリセット
    fuel: 100, // 初期燃料
    maxFuel: 100, // 最大燃料
    fuelConsumptionMove: 0.2, // 移動時の燃料消費量（1/4に減少）
    fuelConsumptionSmoke: 5, // 煙使用時の燃料消費量（3に増加）
    fuelRefillAmount: 50, // 特殊旗取得時の燃料補給量
    // 自車増加システムの初期化
    nextLifeThreshold: 1000, // 最初の自車増加は1000点
    lifeThresholdIndex: 0, // フィボナッチ数列のインデックス（0から開始）
  };

  // 新しい迷路を生成
  let maze = generateSymmetricMaze(newState.mazeWidth, newState.mazeHeight);

  // 旗を生成
  const flags = generateSymmetricFlags(
    maze,
    newState.mazeWidth,
    newState.mazeHeight
  );

  // 岩を生成（難易度に基づく）
  const rocks = generateRocks(
    maze,
    newState.mazeWidth,
    newState.mazeHeight,
    newState.difficulty
  );

  // 敵は初期状態では出現させない
  const enemies: Enemy[] = [];

  // 🔧 テスト用設定
  const isTestMode_Active = false;
  if (isTestMode_Active) {
  }

  // ゲーム状態を返す（BGMの制御はGameManagerが担当）
  const finalState = {
    ...newState,
    maze,
    flags,
    specialFlags: [],
    hasCollectedAllLeftFlags: false,
    hasCollectedAllRightFlags: false,
    enemies,
    rocks,
  };

  return finalState;
}

function drawMaze(state: LabyracerState): LabyracerState {
  let newState = state;

  // 迷路を描画（オフセット付き）
  const offsetX = 1;
  const offsetY = 2;

  // プレイヤーの周りの11x11範囲のみを描画
  const visibilityRadius = 5; // プレイヤーの周り5セル
  const playerMazeX = state.playerX - offsetX; // プレイヤーの迷路座標系でのX位置
  const playerMazeY = state.playerY - offsetY; // プレイヤーの迷路座標系でのY位置

  for (let y = 0; y < state.mazeHeight; y++) {
    for (let x = 0; x < state.mazeWidth; x++) {
      // プレイヤーからの距離をチェック
      const distanceX = Math.abs(x - playerMazeX);
      const distanceY = Math.abs(y - playerMazeY);

      // 11x11の範囲内（プレイヤーから5セル以内）の場合のみ描画
      if (distanceX <= visibilityRadius && distanceY <= visibilityRadius) {
        const char = state.maze[y][x] ? "O" : " ";
        const color = state.maze[y][x] ? "light_cyan" : "black";

        newState = drawText(newState, char, x + offsetX, y + offsetY, {
          entityType: state.maze[y][x] ? "wall" : "path",
          isPassable: !state.maze[y][x],
          color: color,
        }) as LabyracerState;
      }
    }
  }

  return newState;
}

function drawBorderWalls(state: LabyracerState): LabyracerState {
  let newState = state;

  const wallChar = "#";
  const wallAttributes = {
    entityType: "wall",
    isPassable: false,
    color: "light_green",
  } as const;

  // プレイヤーの周りの11x11範囲のみを描画
  const visibilityRadius = 5; // プレイヤーの周り5セル

  // 上下の境界線を描画（上端を1つ下に、下端を1つ上に移動）
  for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
    // プレイヤーからの距離をチェック
    const distanceX = Math.abs(x - state.playerX);
    const distanceY1 = Math.abs(1 - state.playerY); // 上端
    const distanceY2 = Math.abs(VIRTUAL_SCREEN_HEIGHT - 2 - state.playerY); // 下端

    // 11x11の範囲内の場合のみ描画
    if (distanceX <= visibilityRadius && distanceY1 <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        x,
        1,
        wallAttributes
      ) as LabyracerState;
    }
    if (distanceX <= visibilityRadius && distanceY2 <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        x,
        VIRTUAL_SCREEN_HEIGHT - 2,
        wallAttributes
      ) as LabyracerState;
    }
  }

  // 左右の境界線を描画（上下の壁の位置に合わせて調整）
  for (let y = 2; y < VIRTUAL_SCREEN_HEIGHT - 2; y++) {
    // プレイヤーからの距離をチェック
    const distanceX1 = Math.abs(0 - state.playerX); // 左端
    const distanceX2 = Math.abs(VIRTUAL_SCREEN_WIDTH - 1 - state.playerX); // 右端
    const distanceY = Math.abs(y - state.playerY);

    // 11x11の範囲内の場合のみ描画
    if (distanceX1 <= visibilityRadius && distanceY <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        0,
        y,
        wallAttributes
      ) as LabyracerState;
    }
    if (distanceX2 <= visibilityRadius && distanceY <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        VIRTUAL_SCREEN_WIDTH - 1,
        y,
        wallAttributes
      ) as LabyracerState;
    }
  }

  return newState;
}

function drawFlags(state: LabyracerState): LabyracerState {
  let newState = state;

  // 通常の旗を描画（迷路座標系 → 画面座標系に変換）
  for (const flag of newState.flags) {
    newState = drawText(newState, "F", flag.x + 1, flag.y + 2, {
      color: "yellow",
    }) as LabyracerState;
  }

  return newState;
}

function drawSpecialFlag(state: LabyracerState): LabyracerState {
  let newState = state;

  // 特殊な旗を描画（迷路座標系 → 画面座標系に変換）
  for (const specialFlag of state.specialFlags) {
    newState = drawText(newState, "S", specialFlag.x + 1, specialFlag.y + 2, {
      entityType: "special_flag",
      isPassable: true,
      color: "cyan",
    }) as LabyracerState;
  }

  return newState;
}

function drawRocks(state: LabyracerState): LabyracerState {
  let newState = state;

  // プレイヤーの周りの11x11範囲のみを描画
  const visibilityRadius = 5; // プレイヤーの周り5セル

  // 岩を描画（迷路座標系 → 画面座標系に変換）
  for (const rock of state.rocks) {
    // 画面座標系でのプレイヤーとの距離をチェック
    const rockScreenX = rock.x + 1;
    const rockScreenY = rock.y + 2;
    const distanceX = Math.abs(rockScreenX - state.playerX);
    const distanceY = Math.abs(rockScreenY - state.playerY);

    // 11x11の範囲内の場合のみ描画
    if (distanceX <= visibilityRadius && distanceY <= visibilityRadius) {
      newState = drawText(newState, "*", rockScreenX, rockScreenY, {
        entityType: "rock",
        isPassable: false,
        color: "red",
      }) as LabyracerState;
    }
  }
  return newState;
}

function drawPlayer(state: LabyracerState): LabyracerState {
  // ミスアニメーション中は爆発エフェクトを描画
  if (state.isMissAnimation) {
    return drawExplosionEffect(state);
  }

  // 方向に応じて車の表示文字を変更
  const directionChars = ["^", ">", "v", "<"]; // 上、右、下、左
  const playerChar = directionChars[state.direction];

  return drawText(state, playerChar, state.playerX, state.playerY, {
    entityType: "player",
    isPassable: true,
    color: "cyan",
  }) as LabyracerState;
}

function drawEnemies(state: LabyracerState): LabyracerState {
  let newState = state;

  // 敵の車を描画
  const directionChars = ["^", ">", "v", "<"]; // 上、右、下、左

  for (const enemy of state.enemies) {
    // 凍結中の敵は停止状態を示す表示
    if (enemy.isFrozen) {
      newState = drawText(newState, "X", enemy.x, enemy.y, {
        entityType: "enemy_frozen",
        isPassable: true,
        color: "light_red", // 凍結中は薄い赤色
      }) as LabyracerState;
      continue;
    }

    // 出現中の敵は点滅表示
    if (enemy.isSpawning) {
      // 点滅のタイミング（約8フレームごとに切り替え）
      const shouldShow = Math.floor(enemy.spawnTimer / 8) % 2 === 0;

      if (shouldShow) {
        const enemyChar = directionChars[enemy.direction];
        newState = drawText(newState, enemyChar, enemy.x, enemy.y, {
          entityType: "enemy_spawning",
          isPassable: true,
          color: "red", // 出現中は赤色
        }) as LabyracerState;
      }
    } else if (enemy.isStunned) {
      // スタン中の敵は点滅しながら回転表示
      const shouldShow = Math.floor(enemy.stunnedTimer / 8) % 2 === 0;

      if (shouldShow) {
        const enemyChar = directionChars[enemy.direction];
        newState = drawText(newState, enemyChar, enemy.x, enemy.y, {
          entityType: "enemy_stunned",
          isPassable: true,
          color: "red", // スタン中は赤色
        }) as LabyracerState;
      }
    } else {
      // 通常の敵の描画
      const enemyChar = directionChars[enemy.direction];
      newState = drawText(newState, enemyChar, enemy.x, enemy.y, {
        entityType: "enemy",
        isPassable: true,
        color: "red",
      }) as LabyracerState;
    }
  }

  return newState;
}

function drawSmokeTrails(state: LabyracerState): LabyracerState {
  let newState = state;

  // プレイヤーの周りの11x11範囲の可視性設定
  const visibilityRadius = 5; // プレイヤーの周り5セル

  // 煙の軌跡を描画
  for (const smoke of state.smokeTrails) {
    // プレイヤーからの距離をチェック
    const distanceX = Math.abs(smoke.x - state.playerX);
    const distanceY = Math.abs(smoke.y - state.playerY);

    // 11x11の範囲内（プレイヤーから5セル以内）の場合のみ描画
    if (distanceX <= visibilityRadius && distanceY <= visibilityRadius) {
      // タイマーに応じて煙の見た目を変える（新しいほど濃く、古いほど薄く）
      if (smoke.timer > 40) {
        // 濃い煙（新しい）
        newState = drawText(newState, "*", smoke.x, smoke.y, {
          entityType: "smoke_heavy",
          isPassable: true,
          color: "white",
        }) as LabyracerState;
      } else if (smoke.timer > 20) {
        // 中程度の煙
        newState = drawText(newState, ".", smoke.x, smoke.y, {
          entityType: "smoke_medium",
          isPassable: true,
          color: "white",
        }) as LabyracerState;
      } else {
        // 薄い煙（古い、持続状態）
        newState = drawText(newState, "o", smoke.x, smoke.y, {
          entityType: "smoke_light",
          isPassable: true,
          color: "white",
        }) as LabyracerState;
      }
    }
  }

  return newState;
}

// 迷路切り替えアニメーションの縦線を描画する関数
function drawTransitionLine(state: LabyracerState): LabyracerState {
  if (!state.mazeTransitionActive) {
    return state;
  }

  let newState = state;

  // 縦線を描画（迷路エリア全体に）
  for (let y = 2; y < VIRTUAL_SCREEN_HEIGHT - 2; y++) {
    newState = drawText(newState, "|", state.transitionLineX, y, {
      entityType: "transition_line",
      isPassable: true,
      color: "yellow",
    }) as LabyracerState;
  }

  return newState;
}

// FUELメーターを描画する関数
function drawFuelMeter(state: LabyracerState): LabyracerState {
  let newState = state;

  const meterY = VIRTUAL_SCREEN_HEIGHT - 1; // 画面最下端
  const meterStartX = 2; // メーターの開始位置
  const meterWidth = 20; // メーターの幅
  const labelText = "FUEL:";

  // FUELラベルを描画
  newState = drawText(newState, labelText, 0, meterY, {
    color: "white",
  }) as LabyracerState;

  // メーターの枠を描画
  newState = drawText(newState, "[", meterStartX - 1, meterY, {
    color: "white",
  }) as LabyracerState;
  newState = drawText(newState, "]", meterStartX + meterWidth, meterY, {
    color: "white",
  }) as LabyracerState;

  // 燃料の割合を計算
  const fuelRatio = Math.max(0, state.fuel) / state.maxFuel;
  const filledWidth = Math.floor(fuelRatio * meterWidth);

  // メーターの中身を描画
  for (let x = 0; x < meterWidth; x++) {
    let char = " ";
    let color: "light_black" | "green" | "yellow" | "red" = "light_black";

    if (x < filledWidth) {
      char = "=";
      // 燃料レベルに応じて色を変更
      if (fuelRatio > 0.6) {
        color = "green"; // 燃料十分
      } else if (fuelRatio > 0.3) {
        color = "yellow"; // 燃料中程度
      } else {
        color = "red"; // 燃料少ない
      }
    }

    newState = drawText(newState, char, meterStartX + x, meterY, {
      color: color,
    }) as LabyracerState;
  }

  // 燃料の数値を表示
  const fuelText = `${Math.max(0, Math.floor(state.fuel))}`;
  newState = drawText(
    newState,
    fuelText,
    meterStartX + meterWidth + 2,
    meterY,
    {
      color: "white",
    }
  ) as LabyracerState;

  // 燃料切れ警告
  if (state.fuel <= 0) {
    newState = drawText(
      newState,
      "LOW SPEED!",
      meterStartX + meterWidth + 6,
      meterY,
      {
        color: "red",
      }
    ) as LabyracerState;
  }

  return newState;
}

function isValidMove(state: LabyracerState, x: number, y: number): boolean {
  // 外周の壁による境界チェック（壁の位置に合わせて調整）
  if (
    x <= 0 ||
    x >= VIRTUAL_SCREEN_WIDTH - 1 ||
    y <= 1 ||
    y >= VIRTUAL_SCREEN_HEIGHT - 2
  ) {
    return false;
  }

  // UIエリアのチェック（上部2行はUI用）
  if (y < 2) {
    return false;
  }

  // 迷路境界チェック
  const mazeX = x - 1;
  const mazeY = y - 2;

  if (
    mazeX < 0 ||
    mazeX >= state.mazeWidth ||
    mazeY < 0 ||
    mazeY >= state.mazeHeight
  ) {
    return false;
  }

  // 壁チェック
  if (state.maze[mazeY][mazeX]) {
    return false;
  }

  return true;
}

// 敵専用の移動判定（岩も障害物として扱う）
function isValidMoveForEnemy(
  state: LabyracerState,
  x: number,
  y: number
): boolean {
  // 基本的な移動判定
  if (!isValidMove(state, x, y)) {
    return false;
  }

  // 岩チェック（迷路座標系で比較）
  const mazeX = x - 1;
  const mazeY = y - 2;
  const hasRock = state.rocks.some(
    (rock) => rock.x === mazeX && rock.y === mazeY
  );
  if (hasRock) {
    return false;
  }

  return true;
}

// 方向に基づいて次の位置を計算する関数
function getNextPosition(
  x: number,
  y: number,
  direction: number
): { x: number; y: number } {
  switch (direction) {
    case 0:
      return { x, y: y - 1 }; // 上
    case 1:
      return { x: x + 1, y }; // 右
    case 2:
      return { x, y: y + 1 }; // 下
    case 3:
      return { x: x - 1, y }; // 左
    default:
      return { x, y };
  }
}

// 時計回りに方向を変える関数
function rotateClockwise(direction: number): number {
  return (direction + 1) % 4;
}

// 反時計回りに方向を変える関数
function rotateCounterclockwise(direction: number): number {
  return (direction + 3) % 4; // (direction - 1 + 4) % 4 と同じ
}

// 逆方向に変える関数
function reverseDirection(direction: number): number {
  return (direction + 2) % 4;
}

// 最後の移動方向に基づいて試行する方向の優先順位を決定する関数
function getTryDirectionsBasedOnLastMovement(
  currentDirection: number,
  lastVerticalMovement: number,
  lastHorizontalMovement: number
): number[] {
  const directions: number[] = [];

  // 現在の方向が横方向（右または左）の場合
  if (currentDirection === 1 || currentDirection === 3) {
    // 最後の縦方向移動を優先
    if (lastVerticalMovement === 0) {
      directions.push(0); // 上
    } else if (lastVerticalMovement === 2) {
      directions.push(2); // 下
    }

    // 残りの縦方向を追加
    if (lastVerticalMovement !== 0) directions.push(0); // 上
    if (lastVerticalMovement !== 2) directions.push(2); // 下

    // 最後に逆方向（引き返し）
    directions.push(reverseDirection(currentDirection));
  }
  // 現在の方向が縦方向（上または下）の場合
  else if (currentDirection === 0 || currentDirection === 2) {
    // 最後の横方向移動を優先
    if (lastHorizontalMovement === 1) {
      directions.push(1); // 右
    } else if (lastHorizontalMovement === 3) {
      directions.push(3); // 左
    }

    // 残りの横方向を追加
    if (lastHorizontalMovement !== 1) directions.push(1); // 右
    if (lastHorizontalMovement !== 3) directions.push(3); // 左

    // 最後に逆方向（引き返し）
    directions.push(reverseDirection(currentDirection));
  }

  // 重複を除去して返す
  return [...new Set(directions)];
}

// プレイヤーの入力に基づいて方向を変更する関数
function updateDirectionFromInput(
  currentDirection: number,
  inputState: InputState,
  playerX: number,
  playerY: number,
  gameState: LabyracerState
): number {
  let newDirection = currentDirection;

  // 入力に基づいて方向を決定
  if (inputState.up) {
    newDirection = 0;
  } else if (inputState.down) {
    newDirection = 2;
  } else if (inputState.right) {
    newDirection = 1;
  } else if (inputState.left) {
    newDirection = 3;
  }

  // 入力された方向が現在の方向と異なる場合、その方向への移動が可能かチェック
  if (newDirection !== currentDirection) {
    const nextPos = getNextPosition(playerX, playerY, newDirection);
    if (isValidMove(gameState, nextPos.x, nextPos.y)) {
      return newDirection; // 移動可能な場合のみ方向変更
    } else {
      return currentDirection; // 移動不可能な場合は現在の方向を維持
    }
  }

  return currentDirection; // 入力がない場合は現在の方向を維持
}

// 実際の移動時に移動履歴を更新する関数
function updateMovementHistory(
  state: LabyracerState,
  direction: number
): LabyracerState {
  let newState = { ...state };

  // 移動方向に基づいて履歴を更新
  if (direction === 0 || direction === 2) {
    // 縦方向の移動
    newState.lastVerticalMovement = direction;
  } else if (direction === 1 || direction === 3) {
    // 横方向の移動
    newState.lastHorizontalMovement = direction;
  }

  return newState;
}

// 逆方向を取得する関数
function getOppositeDirection(direction: number): number {
  return (direction + 2) % 4;
}

// 敵が煙に接触しているかチェックする関数
function checkEnemySmokeCollision(
  enemy: Enemy,
  state: LabyracerState
): boolean {
  return state.smokeTrails.some(
    (smoke) => smoke.x === enemy.x && smoke.y === enemy.y
  );
}

// 敵同士の接触をチェックする関数
function checkEnemyEnemyCollision(
  enemy: Enemy,
  otherEnemies: Enemy[]
): boolean {
  return otherEnemies.some(
    (other) =>
      other.id !== enemy.id &&
      other.x === enemy.x &&
      other.y === enemy.y &&
      !other.isSpawning && // 出現中の敵は接触判定なし
      !other.isStunned // スタン中の敵は接触判定なし
  );
}

// 敵をスタン状態にする関数
function stunEnemy(enemy: Enemy): Enemy {
  return {
    ...enemy,
    isStunned: true,
    stunnedTimer: 0,
    originalDirection: enemy.direction, // 現在の方向を保存
    stunnedRotationDirection: Math.floor(Math.random() * 2), // 0=時計回り、1=反時計回り
  };
}

// 敵のAI - プレイヤーを追いかける（引き返しを避ける）
function updateEnemyAI(enemy: Enemy, state: LabyracerState): Enemy {
  // 出現中の敵は動かない
  if (enemy.isSpawning) {
    return enemy;
  }

  // プレイヤーとの距離を計算
  const dx = state.playerX - enemy.x;
  const dy = state.playerY - enemy.y;

  // 逆方向（引き返し方向）を取得
  const oppositeDirection = getOppositeDirection(enemy.previousDirection);

  // プレイヤーに向かう方向を決定
  let targetDirection = enemy.direction;

  if (Math.abs(dx) > Math.abs(dy)) {
    // 水平方向の移動を優先
    targetDirection = dx > 0 ? 1 : 3; // 右 or 左
  } else {
    // 垂直方向の移動を優先
    targetDirection = dy > 0 ? 2 : 0; // 下 or 上
  }

  // 目標方向への移動が可能かチェック（引き返しでない場合）
  if (targetDirection !== oppositeDirection) {
    const nextPos = getNextPosition(enemy.x, enemy.y, targetDirection);
    if (isValidMoveForEnemy(state, nextPos.x, nextPos.y)) {
      return {
        ...enemy,
        direction: targetDirection,
        x: nextPos.x,
        y: nextPos.y,
        previousDirection: targetDirection,
        stuckCounter: 0,
      };
    }
  }

  // 現在の方向に継続して移動を試行（引き返しでない場合）
  if (enemy.direction !== oppositeDirection) {
    const currentPos = getNextPosition(enemy.x, enemy.y, enemy.direction);
    if (isValidMoveForEnemy(state, currentPos.x, currentPos.y)) {
      return {
        ...enemy,
        x: currentPos.x,
        y: currentPos.y,
        previousDirection: enemy.direction,
        stuckCounter: 0,
      };
    }
  }

  // 他の方向を試す（引き返しを最後の選択肢にする）
  const allDirections = [0, 1, 2, 3];
  const nonBackwardDirections = allDirections.filter(
    (dir) =>
      dir !== oppositeDirection &&
      dir !== targetDirection &&
      dir !== enemy.direction
  );

  // 引き返し以外の方向をランダムに試行
  const shuffledDirections = nonBackwardDirections.sort(
    () => Math.random() - 0.5
  );

  for (const dir of shuffledDirections) {
    const tryPos = getNextPosition(enemy.x, enemy.y, dir);
    if (isValidMoveForEnemy(state, tryPos.x, tryPos.y)) {
      return {
        ...enemy,
        direction: dir,
        x: tryPos.x,
        y: tryPos.y,
        previousDirection: dir,
        stuckCounter: 0,
      };
    }
  }

  // 行き詰まりカウンターを増加
  const newStuckCounter = enemy.stuckCounter + 1;

  // 完全に行き詰まった場合、または一定回数行き詰まった場合のみ引き返しを許可
  if (newStuckCounter > 3) {
    const backwardPos = getNextPosition(enemy.x, enemy.y, oppositeDirection);
    if (isValidMoveForEnemy(state, backwardPos.x, backwardPos.y)) {
      return {
        ...enemy,
        direction: oppositeDirection,
        x: backwardPos.x,
        y: backwardPos.y,
        previousDirection: oppositeDirection,
        stuckCounter: 0, // リセット
      };
    }
  }

  // どの方向にも移動できない場合は現在位置を維持
  return {
    ...enemy,
    stuckCounter: newStuckCounter,
  };
}

// 敵の更新処理
// ミスアニメーションを開始する関数
function startMissAnimation(state: LabyracerState): LabyracerState {
  const newState = {
    ...state,
    isMissAnimation: true,
    missAnimationTimer: 90, // 1.5秒間のアニメーション（60fps × 1.5秒）
    missAnimationFrame: 0,
    explosionX: state.playerX,
    explosionY: state.playerY,
  };

  // 爆発音を再生
  playSoundEffect(newState, "explosion", state.playerX + state.playerY);

  return newState;
}

// ミスアニメーションを更新する関数
function updateMissAnimation(state: LabyracerState): LabyracerState {
  if (!state.isMissAnimation) {
    return state;
  }

  let newState = { ...state };

  // タイマーを減らす
  newState.missAnimationTimer = Math.max(0, newState.missAnimationTimer - 1);

  // アニメーションフレームを進める
  newState.missAnimationFrame = newState.missAnimationFrame + 1;

  // アニメーション終了時の処理
  if (newState.missAnimationTimer <= 0) {
    // ライフを減らす
    newState = loseLife(newState) as LabyracerState;

    // プレイヤーを初期位置に戻す
    newState = {
      ...newState,
      playerX: newState.initialPlayerX,
      playerY: newState.initialPlayerY,
      direction: 0, // 上向きにリセット
    };

    // 全ての敵を削除
    newState = {
      ...newState,
      enemies: [],
      nextEnemyId: 0,
    };

    // 煙の軌跡をクリア
    newState = {
      ...newState,
      smokeTrails: [],
      smokeTrailActive: false,
      smokeTrailRemainingMoves: 0,
    };

    // 燃料を満タンに戻す
    newState = {
      ...newState,
      fuel: newState.maxFuel,
    };

    // アニメーション状態をリセット
    newState = {
      ...newState,
      isMissAnimation: false,
      missAnimationTimer: 0,
      missAnimationFrame: 0,
    };
  }

  return newState;
}

// 爆発エフェクトを描画する関数
function drawExplosionEffect(state: LabyracerState): LabyracerState {
  let newState = state;

  // 爆発アニメーションのフェーズを計算
  const animationPhase = Math.floor(state.missAnimationFrame / 6); // 6フレームごとにフェーズ変更
  const centerX = state.explosionX;
  const centerY = state.explosionY;

  // フェーズに応じて爆発パターンを描画
  switch (animationPhase % 4) {
    case 0:
      // フェーズ1: 中心に小さな爆発
      newState = drawText(newState, "*", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "red",
      }) as LabyracerState;
      break;

    case 1:
      // フェーズ2: 十字に広がる爆発
      newState = drawText(newState, "*", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "yellow",
      }) as LabyracerState;

      // 上下左右に爆発エフェクト
      const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 }, // 上下
        { x: -1, y: 0 },
        { x: 1, y: 0 }, // 左右
      ];

      for (const dir of directions) {
        const x = centerX + dir.x;
        const y = centerY + dir.y;
        if (x >= 0 && x < 40 && y >= 0 && y < 25) {
          newState = drawText(newState, "+", x, y, {
            entityType: "explosion",
            isPassable: true,
            color: "yellow",
          }) as LabyracerState;
        }
      }
      break;

    case 2:
      // フェーズ3: さらに大きく広がる爆発
      newState = drawText(newState, "X", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "white",
      }) as LabyracerState;

      // 8方向に爆発エフェクト
      const allDirections = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const dir of allDirections) {
        const x = centerX + dir.x;
        const y = centerY + dir.y;
        if (x >= 0 && x < 40 && y >= 0 && y < 25) {
          newState = drawText(newState, "o", x, y, {
            entityType: "explosion",
            isPassable: true,
            color: "white",
          }) as LabyracerState;
        }
      }
      break;

    case 3:
      // フェーズ4: 煙に変わる
      newState = drawText(newState, ".", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "light_black",
      }) as LabyracerState;

      // 周囲に薄い煙
      const smokeDirections = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const dir of smokeDirections) {
        const x = centerX + dir.x;
        const y = centerY + dir.y;
        if (x >= 0 && x < 40 && y >= 0 && y < 25) {
          newState = drawText(newState, ".", x, y, {
            entityType: "explosion",
            isPassable: true,
            color: "light_black",
          }) as LabyracerState;
        }
      }
      break;
  }

  return newState;
}

function updateEnemies(state: LabyracerState): LabyracerState {
  let newState = state;

  // ミスアニメーション中は全ての敵を停止
  if (state.isMissAnimation) {
    return newState;
  }

  const updatedEnemies = state.enemies.map((enemy) => {
    // 凍結中の敵は動かない
    if (enemy.isFrozen) {
      return enemy;
    }

    // 出現中の敵の処理
    if (enemy.isSpawning) {
      const newSpawnTimer = enemy.spawnTimer + 1;
      const spawnDuration = 120; // 2秒 (60fps * 2)

      if (newSpawnTimer >= spawnDuration) {
        // 出現完了、通常の敵として活動開始
        return {
          ...enemy,
          isSpawning: false,
          spawnTimer: 0,
          blinkState: false,
          movementCounter: 0,
        };
      } else {
        // 出現タイマーを更新
        return {
          ...enemy,
          spawnTimer: newSpawnTimer,
          blinkState: Math.floor(newSpawnTimer / 8) % 2 === 0,
        };
      }
    }

    // スタン中の敵の処理
    if (enemy.isStunned) {
      const newStunnedTimer = enemy.stunnedTimer + 1;
      const stunDuration = 180; // 3秒 (60fps * 3)

      if (newStunnedTimer >= stunDuration) {
        // スタン終了、逆方向に進む
        const reverseDirection = getOppositeDirection(enemy.originalDirection);

        // スタン解除時に1キャラ分進んで再衝突を防ぐ
        const nextPos = getNextPosition(enemy.x, enemy.y, reverseDirection);
        let newX = enemy.x;
        let newY = enemy.y;

        // 移動先が有効な場合のみ移動
        if (isValidMoveForEnemy(newState, nextPos.x, nextPos.y)) {
          newX = nextPos.x;
          newY = nextPos.y;
        }

        return {
          ...enemy,
          isStunned: false,
          stunnedTimer: 0,
          direction: reverseDirection,
          previousDirection: reverseDirection,
          movementCounter: 0,
          x: newX,
          y: newY,
        };
      } else {
        // スタン中は回転しながら点滅
        let newDirection = enemy.direction;

        // 約15フレームごとに回転（1秒間に4回転）
        if (newStunnedTimer % 15 === 0) {
          if (enemy.stunnedRotationDirection === 0) {
            // 時計回り
            newDirection = rotateClockwise(enemy.direction);
          } else {
            // 反時計回り
            newDirection = rotateCounterclockwise(enemy.direction);
          }
        }

        return {
          ...enemy,
          stunnedTimer: newStunnedTimer,
          direction: newDirection,
          blinkState: Math.floor(newStunnedTimer / 8) % 2 === 0,
        };
      }
    }

    // 煙との接触チェック
    if (checkEnemySmokeCollision(enemy, newState)) {
      // 敵が接触した煙を除去
      newState = {
        ...newState,
        smokeTrails: newState.smokeTrails.filter(
          (smoke) => !(smoke.x === enemy.x && smoke.y === enemy.y)
        ),
      };

      // 敵が煙に巻き込まれた時の効果音を再生
      playMml(newState, AUDIO_PATTERNS.ENEMY_SMOKE_HIT);

      return stunEnemy(enemy);
    }

    // 敵同士の接触チェック
    if (checkEnemyEnemyCollision(enemy, state.enemies)) {
      // 敵同士の接触効果音を再生
      playMml(newState, AUDIO_PATTERNS.ENEMY_COLLISION);

      return stunEnemy(enemy);
    }

    // 通常の敵の移動処理
    const updatedEnemy = {
      ...enemy,
      movementCounter: enemy.movementCounter + 1,
    };

    // 移動間隔に達した場合のみ移動
    if (updatedEnemy.movementCounter >= state.movementInterval + 2) {
      updatedEnemy.movementCounter = 0;
      return updateEnemyAI(updatedEnemy, newState);
    }

    return updatedEnemy;
  });

  return {
    ...newState,
    enemies: updatedEnemies,
  };
}

// プレイヤーと敵の衝突チェック
function checkPlayerEnemyCollision(state: LabyracerState): LabyracerState {
  // ミスアニメーション中は衝突判定を行わない
  if (state.isMissAnimation) {
    return state;
  }

  for (const enemy of state.enemies) {
    // 出現中の敵とは衝突しない
    if (enemy.isSpawning) {
      continue;
    }

    // スタン中の敵とは衝突しない
    if (enemy.isStunned) {
      continue;
    }

    // 凍結中の敵とは衝突しない
    if (enemy.isFrozen) {
      continue;
    }

    if (enemy.x === state.playerX && enemy.y === state.playerY) {
      // 衝突した場合、ミスアニメーションを開始
      return startMissAnimation(state);
    }
  }
  return state;
}

// プレイヤーと岩の衝突チェック
function checkPlayerRockCollision(state: LabyracerState): LabyracerState {
  // ミスアニメーション中は衝突判定を行わない
  if (state.isMissAnimation) {
    return state;
  }

  // プレイヤーの位置を迷路座標系に変換
  const playerMazeX = state.playerX - 1;
  const playerMazeY = state.playerY - 2;

  // 岩との衝突をチェック（迷路座標系で比較）
  const hasRockCollision = state.rocks.some(
    (rock) => rock.x === playerMazeX && rock.y === playerMazeY
  );

  if (hasRockCollision) {
    // 衝突した場合、ミスアニメーションを開始
    return startMissAnimation(state);
  }

  return state;
}

// 旗の回収処理
function checkFlagCollection(state: LabyracerState): LabyracerState {
  // プレイヤーの位置を迷路座標系に変換
  const playerMazeX = state.playerX - 1;
  const playerMazeY = state.playerY - 2;

  // 特殊な旗の回収チェック（迷路座標系で比較）
  const specialFlagIndex = state.specialFlags.findIndex(
    (flag) => flag.x === playerMazeX && flag.y === playerMazeY
  );

  if (specialFlagIndex !== -1) {
    // 特殊な旗を回収 - 配列から削除して対応する半分の迷路を再生成
    const newSpecialFlags = [...state.specialFlags];
    const collectedSpecialFlag = newSpecialFlags.splice(specialFlagIndex, 1)[0];

    let newState = addScore(state, 30) as LabyracerState; // 特殊な旗は30点
    newState = { ...newState, specialFlags: newSpecialFlags };

    // 特殊旗回収音を再生
    playMml(newState, [...AUDIO_PATTERNS.SPECIAL_FLAG_COLLECT]);

    // 燃料を補給
    const newFuel = Math.min(
      newState.fuel + newState.fuelRefillAmount,
      newState.maxFuel
    );
    newState = { ...newState, fuel: newFuel };

    // 燃料補給音を再生
    playMml(newState, AUDIO_PATTERNS.FUEL_REFILL);

    // 特殊旗の位置で再生成する半分を判断してアニメーションを開始
    const halfWidth = Math.floor(state.mazeWidth / 2);
    if (collectedSpecialFlag.x >= halfWidth) {
      // 右半分にある特殊旗を回収した場合、左半分を再生成
      newState = startMazeTransition(newState, "left");
      newState = freezeEnemiesOnSide(newState, "left");
      newState = regenerateHalf(newState, "left");
    } else {
      // 左半分にある特殊旗を回収した場合、右半分を再生成
      newState = startMazeTransition(newState, "right");
      newState = freezeEnemiesOnSide(newState, "right");
      newState = regenerateHalf(newState, "right");
    }

    return newState;
  }

  // 通常の旗の回収チェック（迷路座標系で比較）
  const flagIndex = state.flags.findIndex(
    (flag) => flag.x === playerMazeX && flag.y === playerMazeY
  );

  if (flagIndex !== -1) {
    // 旗を回収 - 配列から削除
    const newFlags = [...state.flags];
    const collectedFlag = newFlags.splice(flagIndex, 1)[0]; // 回収した旗の情報を保存

    // スコア加算（旗回収時は10点）
    let newState = addScore(state, 10) as LabyracerState;
    newState = { ...newState, flags: newFlags };

    // 通常旗回収音を再生
    playMml(newState, AUDIO_PATTERNS.FLAG_COLLECT);

    // 敵が1台もいない場合は、enemyAppearanceCountを1にリセット
    let currentEnemyAppearanceCount = newState.enemyAppearanceCount;
    if (newState.enemies.length === 0) {
      currentEnemyAppearanceCount = 1;
    }

    // 敵出現カウンターに難易度を加算
    const newEnemyAppearanceCount =
      currentEnemyAppearanceCount + Math.sqrt(newState.difficulty);

    // 1を超えた分だけ敵を出現させる
    const enemiesToSpawn = Math.floor(newEnemyAppearanceCount);
    const remainingCount = newEnemyAppearanceCount - enemiesToSpawn;

    if (enemiesToSpawn > 0) {
      // 旗を回収した位置の周辺に敵を出現させる
      newState = spawnEnemiesNearFlag(
        newState,
        collectedFlag.x,
        collectedFlag.y,
        enemiesToSpawn
      );
    }

    // 敵出現カウンターを更新（出現した分を減算）
    newState = {
      ...newState,
      enemyAppearanceCount: remainingCount,
    };

    // 左半分の旗がすべて回収されたかチェック（迷路座標系で判定）
    const halfWidth = Math.floor(state.mazeWidth / 2);
    const leftFlags = newFlags.filter((flag) => flag.x < halfWidth);
    const rightFlags = newFlags.filter((flag) => flag.x >= halfWidth);

    if (leftFlags.length === 0 && !state.hasCollectedAllLeftFlags) {
      // 左半分の旗をすべて回収した - 右半分に特殊な旗を生成
      const specialFlag = generateSpecialFlag(
        state.maze,
        state.mazeWidth,
        state.mazeHeight,
        "right",
        [...newFlags, ...state.specialFlags] // 残りの通常旗と既存の特殊旗を避ける
      );
      const newSpecialFlags = specialFlag
        ? [...state.specialFlags, specialFlag]
        : state.specialFlags;
      newState = {
        ...newState,
        specialFlags: newSpecialFlags,
        hasCollectedAllLeftFlags: true,
      };

      // 特殊旗出現音を再生（特殊旗が実際に生成された場合のみ）
      if (specialFlag) {
        playMml(newState, [...AUDIO_PATTERNS.SPECIAL_FLAG_SPAWN]);
      }
    } else if (rightFlags.length === 0 && !state.hasCollectedAllRightFlags) {
      // 右半分の旗をすべて回収した - 左半分に特殊な旗を生成
      const specialFlag = generateSpecialFlag(
        state.maze,
        state.mazeWidth,
        state.mazeHeight,
        "left",
        [...newFlags, ...state.specialFlags] // 残りの通常旗と既存の特殊旗を避ける
      );
      const newSpecialFlags = specialFlag
        ? [...state.specialFlags, specialFlag]
        : state.specialFlags;
      newState = {
        ...newState,
        specialFlags: newSpecialFlags,
        hasCollectedAllRightFlags: true,
      };

      // 特殊旗出現音を再生（特殊旗が実際に生成された場合のみ）
      if (specialFlag) {
        playMml(newState, [...AUDIO_PATTERNS.SPECIAL_FLAG_SPAWN]);
      }
    }

    return newState;
  }

  return state;
}

// 煙の軌跡を更新する関数
function updateSmokeTrails(state: LabyracerState): LabyracerState {
  // プレイヤーの周りの11x11範囲の可視性設定
  const visibilityRadius = 5; // プレイヤーの周り5セル

  // 煙のタイマーを減らし、可視範囲外の煙を削除
  const updatedSmokeTrails = state.smokeTrails
    .map((smoke) => ({
      ...smoke,
      timer: Math.max(smoke.timer - 1, 1),
    }))
    .filter((smoke) => {
      // プレイヤーからの距離をチェック
      const distanceX = Math.abs(smoke.x - state.playerX);
      const distanceY = Math.abs(smoke.y - state.playerY);

      // 11x11の範囲内（プレイヤーから5セル以内）の場合のみ保持
      return distanceX <= visibilityRadius && distanceY <= visibilityRadius;
    });

  return {
    ...state,
    smokeTrails: updatedSmokeTrails,
  };
}

// 煙の軌跡を追加する関数
function addSmokeTrail(
  state: LabyracerState,
  x: number,
  y: number
): LabyracerState {
  const newSmoke = { x, y, timer: 60 }; // 初期タイマー（アニメーション用）

  return {
    ...state,
    smokeTrails: [...state.smokeTrails, newSmoke],
  };
}

// 迷路切り替えアニメーションを開始する関数
function startMazeTransition(
  state: LabyracerState,
  direction: "left" | "right"
): LabyracerState {
  const centerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);

  const newState = {
    ...state,
    mazeTransitionActive: true,
    transitionLineX: centerX,
    transitionDirection: direction,
    transitionTimer: 0,
    destructionBonusCounter: 0, // アニメーション開始時にボーナスカウンターをリセット
  };

  // 迷路切り替えアニメーション開始音を再生
  playMml(newState, [...AUDIO_PATTERNS.MAZE_TRANSITION_START]);

  return newState;
}

// 指定された側の敵を凍結状態にする関数
function freezeEnemiesOnSide(
  state: LabyracerState,
  side: "left" | "right"
): LabyracerState {
  const halfWidth = Math.floor(state.mazeWidth / 2);
  const centerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);

  const updatedEnemies = state.enemies.map((enemy) => {
    const enemyIsOnTargetSide =
      side === "left" ? enemy.x < centerX : enemy.x > centerX;

    if (enemyIsOnTargetSide) {
      return { ...enemy, isFrozen: true };
    }
    return enemy;
  });

  return {
    ...state,
    enemies: updatedEnemies,
  };
}

// 迷路切り替えアニメーションを更新する関数
function updateMazeTransition(state: LabyracerState): LabyracerState {
  if (!state.mazeTransitionActive) {
    return state;
  }

  const newTimer = state.transitionTimer + 1;
  const animationDuration = 30; // 0.5秒 (60fps * 0.5)

  // アニメーション終了チェック
  if (newTimer >= animationDuration) {
    // アニメーション終了時に残った凍結敵を削除
    const updatedEnemies = state.enemies.filter((enemy) => !enemy.isFrozen);

    return {
      ...state,
      mazeTransitionActive: false,
      transitionTimer: 0,
      enemies: updatedEnemies,
      destructionBonusCounter: 0, // アニメーション終了時にボーナスカウンターをリセット
    };
  }

  // 線の位置を更新
  const centerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
  const progress = newTimer / animationDuration;

  let newLineX = centerX;

  if (state.transitionDirection === "left") {
    // 中央から左端へ移動
    const targetX = 1; // 左端の壁の内側
    newLineX = Math.floor(centerX - (centerX - targetX) * progress);
  } else {
    // 中央から右端へ移動
    const targetX = VIRTUAL_SCREEN_WIDTH - 2; // 右端の壁の内側
    newLineX = Math.floor(centerX + (targetX - centerX) * progress);
  }

  // 線が通過した位置にいる凍結敵を削除し、得点を加算
  let newState = state;
  let newDestructionBonusCounter = state.destructionBonusCounter;

  const updatedEnemies = state.enemies.filter((enemy) => {
    if (!enemy.isFrozen) return true; // 凍結していない敵は保持

    // 線が敵の位置を通過したかチェック
    let shouldDestroy = false;
    if (state.transitionDirection === "left") {
      shouldDestroy = enemy.x >= newLineX; // 線が到達した敵を破壊
    } else {
      shouldDestroy = enemy.x <= newLineX; // 線が到達した敵を破壊
    }

    if (shouldDestroy) {
      // 敵を破壊し、得点を加算
      const bonus = calculateDestructionBonus(newDestructionBonusCounter);
      newState = addScore(newState, bonus) as LabyracerState;
      newState = addScoreDisplay(newState, enemy.x, enemy.y, bonus);

      // 敵破壊ボーナス音を再生
      playMml(newState, AUDIO_PATTERNS.ENEMY_DESTRUCTION_BONUS);

      newDestructionBonusCounter++;
      return false; // 敵を削除
    }

    return true; // 敵を保持
  });

  return {
    ...newState,
    transitionLineX: newLineX,
    transitionTimer: newTimer,
    enemies: updatedEnemies,
    destructionBonusCounter: newDestructionBonusCounter,
  };
}

// 得点表示を描画する関数
function drawScoreDisplays(state: LabyracerState): LabyracerState {
  let newState = state;

  for (const scoreDisplay of state.scoreDisplays) {
    // 得点を+記号付きで表示
    const scoreText = `+${scoreDisplay.score}`;
    newState = drawText(newState, scoreText, scoreDisplay.x, scoreDisplay.y, {
      entityType: "score_display",
      isPassable: true,
      color: "yellow",
    }) as LabyracerState;
  }

  return newState;
}

// 得点表示を更新する関数
function updateScoreDisplays(state: LabyracerState): LabyracerState {
  // タイマーを減らして、0以下になったものを削除
  const updatedScoreDisplays = state.scoreDisplays
    .map((display) => ({
      ...display,
      timer: display.timer - 1,
    }))
    .filter((display) => display.timer > 0);

  return {
    ...state,
    scoreDisplays: updatedScoreDisplays,
  };
}

// 敵破壊時の得点を計算する関数
function calculateDestructionBonus(bonusCounter: number): number {
  const bonusScores = [100, 200, 400, 800, 1600, 3200, 6400, 9890];

  if (bonusCounter >= bonusScores.length) {
    return 9890; // 9890点以降はずっと9890点
  }

  return bonusScores[bonusCounter];
}

// 得点表示を追加する関数
function addScoreDisplay(
  state: LabyracerState,
  x: number,
  y: number,
  score: number
): LabyracerState {
  const newScoreDisplay: ScoreDisplay = {
    x,
    y,
    score,
    timer: 120, // 2秒間表示（60fps * 2）
  };

  return {
    ...state,
    scoreDisplays: [...state.scoreDisplays, newScoreDisplay],
  };
}

// 時間経過による難易度を更新する関数
function updateDifficulty(state: LabyracerState): LabyracerState {
  const framesPerMinute = 3600;
  const newDifficulty = state.difficulty + 1 / framesPerMinute;
  return {
    ...state,
    difficulty: newDifficulty,
  };
}

// フィボナッチ数列ベースのライフ増加システム
// 1000点、2000点、3000点、5000点、8000点、13000点、21000点...
function getFibonacciLifeThreshold(index: number): number {
  const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

  if (index >= fibonacciSequence.length) {
    // インデックスが配列を超えた場合は最後の値を使用
    return fibonacciSequence[fibonacciSequence.length - 1] * 1000;
  }

  return fibonacciSequence[index] * 1000;
}

// スコアに基づいてライフを増加させる関数
function checkLifeIncrease(state: LabyracerState): LabyracerState {
  const MAX_LIVES = 5; // 最大ライフ数

  // 最大ライフに達している場合は何もしない
  if (state.lives >= MAX_LIVES) {
    return state;
  }

  // スコアが次のライフ増加閾値に達しているかチェック
  if (state.score >= state.nextLifeThreshold) {
    // ライフを1増加
    const newLives = Math.min(state.lives + 1, MAX_LIVES);

    // 次の閾値を計算
    const nextIndex = state.lifeThresholdIndex + 1;
    const nextThreshold = getFibonacciLifeThreshold(nextIndex);

    const newState = {
      ...state,
      lives: newLives,
      nextLifeThreshold: nextThreshold,
      lifeThresholdIndex: nextIndex,
    };

    // 自車増加ジングルを再生
    playMml(newState, [...AUDIO_PATTERNS.EXTRA_LIFE_JINGLE]);

    return newState;
  }

  return state;
}

// 残りライフを車のアイコンで表示する関数
function renderLivesAsCarIcons(state: LabyracerState): LabyracerState {
  const MAX_LIVES = 5; // 最大表示ライフ数
  const remainingLives = Math.min(state.lives - 1, MAX_LIVES - 1); // 現在のライフは表示しない、最大4個まで表示

  if (remainingLives > 0) {
    const livesStartX = Math.floor(
      (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
    );
    let newState = state;
    for (let i = 0; i < remainingLives; i++) {
      // 車のアイコンとして右向きの矢印を使用
      newState = drawText(newState, ">", livesStartX + i * 2, 0, {
        color: "cyan",
      }) as LabyracerState;
    }
    return newState;
  }

  return state;
}

// labyracer専用のUI描画関数（ハイスコア表示）
function renderLabyracerUI(state: LabyracerState): LabyracerState {
  let newState = state;

  // 左上にスコア表示
  const scoreText = `Score: ${state.score}`;
  newState = drawText(newState, scoreText, 1, 0, {
    color: "white",
  }) as LabyracerState;

  // 右上にハイスコア表示
  const highScore = getHighScore(state);
  const hiScoreText = `HI ${highScore}`;
  newState = drawText(
    newState,
    hiScoreText,
    VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1,
    0,
    { color: "yellow" }
  ) as LabyracerState;

  // 下部にリスタート指示
  newState = drawText(newState, "R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
    color: "light_black",
  }) as LabyracerState;

  return newState;
}

// labyracer専用のゲームオーバー画面描画関数（Rキーメッセージなし）
function renderLabyracerGameOverScreen(state: LabyracerState): LabyracerState {
  const gameOverMessage = "Game Over!";
  const gameOverMessageY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2;
  const finalScoreY = gameOverMessageY + 1;

  let newState = state;

  // ゲームオーバーメッセージ
  newState = drawCenteredText(newState, gameOverMessage, gameOverMessageY, {
    color: "red",
  }) as LabyracerState;

  // 最終スコア
  const scoreText = `Score: ${state.score}`;
  newState = drawCenteredText(newState, scoreText, finalScoreY, {
    color: "white",
  }) as LabyracerState;

  // ハイスコア（存在する場合）
  const highScore = Math.max(state.score, state.internalHighScore);
  if (highScore > 0) {
    const highScoreText = `High: ${highScore}`;
    const highScoreY = finalScoreY + 1;
    newState = drawCenteredText(newState, highScoreText, highScoreY, {
      color: "light_cyan",
    }) as LabyracerState;
  }

  return newState;
}

export function updateLabyracer(
  state: LabyracerState,
  inputState: InputState
): LabyracerState {
  // ゲームオーバー時は画面描画のみ
  if (isGameOver(state)) {
    let newState = clearVirtualScreen(state) as LabyracerState;
    newState = renderLabyracerGameOverScreen(newState);
    newState = renderLabyracerUI(newState);
    newState = renderLivesAsCarIcons(newState);
    return newState;
  }

  let newState = clearVirtualScreen(state) as LabyracerState;

  // 時間経過による難易度を更新
  newState = updateDifficulty(newState);

  // スコアに基づくライフ増加をチェック
  newState = checkLifeIncrease(newState);

  // アクションボタンがjust pressedされた場合のみ、煙の軌跡を有効化
  const isAction1JustPressed =
    inputState.action1 && !state.previousInputState.action1;
  const isAction2JustPressed =
    inputState.action2 && !state.previousInputState.action2;

  if (isAction1JustPressed || isAction2JustPressed) {
    // 燃料が十分にある場合のみ煙を有効化
    if (newState.fuel >= newState.fuelConsumptionSmoke) {
      newState = {
        ...newState,
        smokeTrailActive: true,
        smokeTrailRemainingMoves: 3, // 3回の移動で煙を出す
        fuel: newState.fuel - newState.fuelConsumptionSmoke, // 煙使用時の燃料消費
      };

      // 煙幕発動音を再生
      playMml(newState, AUDIO_PATTERNS.SMOKE_ACTIVATED);
    }
  }

  // UIを描画
  newState = renderLabyracerUI(newState);

  // 残りライフを車のアイコンで表示
  newState = renderLivesAsCarIcons(newState);

  // 外周の壁を描画
  newState = drawBorderWalls(newState);

  // 迷路を描画
  newState = drawMaze(newState);

  // 旗を描画
  newState = drawFlags(newState);

  // 特殊な旗を描画
  newState = drawSpecialFlag(newState);

  // 岩を描画
  newState = drawRocks(newState);

  // 煙の軌跡を描画
  newState = drawSmokeTrails(newState);

  // 敵を描画
  newState = drawEnemies(newState);

  // 敵の更新処理
  newState = updateEnemies(newState);

  // 煙の軌跡を更新
  newState = updateSmokeTrails(newState);

  // ミスアニメーションを更新
  newState = updateMissAnimation(newState);

  // 得点表示を更新
  newState = updateScoreDisplays(newState);

  // 迷路切り替えアニメーションを更新
  newState = updateMazeTransition(newState);

  // 迷路切り替えアニメーションを描画（他の要素の上に描画）
  newState = drawTransitionLine(newState);

  // 得点表示を描画（最前面に表示）
  newState = drawScoreDisplays(newState);

  // FUELメーターを描画
  newState = drawFuelMeter(newState);

  // プレイヤーの移動処理（ミスアニメーション中は移動しない）
  if (!newState.isMissAnimation) {
    newState.movementFrameCounter++;

    // 燃料切れ時は移動速度を半分にする
    const currentMovementInterval =
      newState.fuel <= 0
        ? newState.movementInterval * 2
        : newState.movementInterval;

    if (newState.movementFrameCounter >= currentMovementInterval) {
      newState.movementFrameCounter = 0;

      // プレイヤーの入力に基づいて方向を更新
      newState = {
        ...newState,
        direction: updateDirectionFromInput(
          newState.direction,
          inputState,
          newState.playerX,
          newState.playerY,
          newState
        ),
      };

      // 現在の方向に基づいて次の位置を計算
      let nextPos = getNextPosition(
        newState.playerX,
        newState.playerY,
        newState.direction
      );

      // 移動が有効でない場合は最後の入力に基づいて方向を変えて再試行
      if (!isValidMove(newState, nextPos.x, nextPos.y)) {
        const originalDirection = newState.direction;
        const tryDirections = getTryDirectionsBasedOnLastMovement(
          originalDirection,
          newState.lastVerticalMovement,
          newState.lastHorizontalMovement
        );

        for (const tryDirection of tryDirections) {
          const tryPos = getNextPosition(
            newState.playerX,
            newState.playerY,
            tryDirection
          );
          if (isValidMove(newState, tryPos.x, tryPos.y)) {
            newState = { ...newState, direction: tryDirection };
            nextPos = tryPos;
            break;
          }
        }
      }

      // 移動が可能な場合は移動
      if (isValidMove(newState, nextPos.x, nextPos.y)) {
        // 煙の軌跡が有効な場合、現在の位置に煙を追加
        if (
          newState.smokeTrailActive &&
          newState.smokeTrailRemainingMoves > 0
        ) {
          newState = addSmokeTrail(
            newState,
            newState.playerX,
            newState.playerY
          );
          newState = {
            ...newState,
            smokeTrailRemainingMoves: newState.smokeTrailRemainingMoves - 1,
          };

          // 残り回数が0になったら煙の軌跡を無効化
          if (newState.smokeTrailRemainingMoves <= 0) {
            newState = {
              ...newState,
              smokeTrailActive: false,
            };
          }
        }

        // 移動時の燃料消費
        const newFuel = Math.max(
          0,
          newState.fuel - newState.fuelConsumptionMove
        );
        newState = {
          ...newState,
          playerX: nextPos.x,
          playerY: nextPos.y,
          fuel: newFuel,
        };

        // 実際に移動した時に移動履歴を更新
        newState = updateMovementHistory(newState, newState.direction);

        // 旗の回収チェック
        newState = checkFlagCollection(newState);
      }
    }
  }

  // プレイヤーと敵の衝突チェック
  newState = checkPlayerEnemyCollision(newState);

  // プレイヤーと岩の衝突チェック
  newState = checkPlayerRockCollision(newState);

  // プレイヤーを描画
  newState = drawPlayer(newState);

  // 燃料警告音の再生（一定間隔で警告）
  if (!newState.isMissAnimation) {
    // 燃料が20%以下の場合は警告音
    if (newState.fuel <= newState.maxFuel * 0.2 && newState.fuel > 0) {
      // 2秒ごとに警告音を再生
      if (newState.movementFrameCounter % 120 === 0) {
        playMml(newState, AUDIO_PATTERNS.FUEL_WARNING);
      }
    }
    // 燃料が完全に切れた場合はより強い警告音
    else if (newState.fuel <= 0) {
      // 3秒ごとに危険警告音を再生
      if (newState.movementFrameCounter % 180 === 0) {
        playMml(newState, AUDIO_PATTERNS.FUEL_CRITICAL);
      }
    }
  }

  // 前回の入力状態を更新（次回のjust pressed検出用）
  newState = {
    ...newState,
    previousInputState: inputState,
  };

  return newState;
}

// ゲーム操作オブジェクト
export const labyracerOperations = {
  initializeGame: initializeLabyracer,
  updateGame: updateLabyracer,
};
