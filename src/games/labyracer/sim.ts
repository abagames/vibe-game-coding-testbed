import {
  createConsoleSimulator,
  ConsoleSimulatorState,
  runSimulation,
  ConsoleSimulatorOptions,
} from "../../utils/consoleSimulator.js";
import { updateBaseGame } from "../../core/baseGame.js";
import {
  createLabyracerState,
  initializeLabyracer,
  updateLabyracer,
  LabyracerState,
} from "./core.js";
import { InputState } from "../../core/coreTypes.js";

// 🔥 ファイル実行確認
console.log("🚀 sim.ts が実行されました！");
console.log("🚀 現在時刻:", new Date().toISOString());

// ゲーム操作をまとめたオブジェクト
const labyracerOperations = {
  initializeGame: initializeLabyracer,
  updateGame: updateLabyracer,
};

// 基本的なシミュレーション
function runLabyracerTestSimulation() {
  const gameState = createLabyracerState({
    initialLives: 3,
    enemyCount: 3,
  });

  const gameInstanceFunctional = {
    initializeGame: () => {
      // 初期化処理
    },
    update: (inputState: any) => {
      // 更新処理
    },
    getVirtualScreenData: () => gameState.virtualScreen,
    getScore: () => gameState.score,
    getLives: () => gameState.lives,
    isGameOver: () => gameState.gameOverState,
    drawText: (text: string, x: number, y: number, attributes?: any) => {
      // This is handled internally by the operations
    },
    getCellInfo: (x: number, y: number) => {
      return gameState.virtualScreen[y]?.[x] || null;
    },
  };

  const simulatorOptions: ConsoleSimulatorOptions = {
    predefinedMoves: [],
    totalTicks: 50,
    tickDurationMs: 200,
  };

  const simulatorStateFunctional = createConsoleSimulator(
    gameInstanceFunctional,
    "predefined",
    simulatorOptions
  );
  runSimulation(simulatorStateFunctional);
}

// デバッグ：設定確認
console.log("=== シミュレーション設定確認 ===");
console.log("プレイヤー位置（画面座標）:", { x: 8, y: 10 });
console.log("特殊旗位置（迷路座標）:", { x: 8, y: 8 });
console.log("特殊旗位置（画面座標）:", { x: 8 + 1, y: 8 + 2 }); // 迷路座標→画面座標変換
console.log("hasCollectedAllLeftFlags:", true);
console.log("=================================");

// 標準のゲーム状態を作成（テスト設定はcore.tsで実行）
let gameStateFunctional = createLabyracerState({
  initialLives: 51,
});

// core.tsのテスト設定を適用するために初期化実行
console.log("🔥 手動でinitializeLabyracerを呼び出します...");
gameStateFunctional = initializeLabyracer(gameStateFunctional);
console.log("🔥 手動初期化完了:");
console.log(
  "  プレイヤー位置:",
  gameStateFunctional.playerX,
  gameStateFunctional.playerY
);
console.log("  特殊旗数:", gameStateFunctional.specialFlags.length);
console.log("  特殊旗位置:", gameStateFunctional.specialFlags);
console.log("  敵の数:", gameStateFunctional.enemies.length);
console.log(
  "  hasCollectedAllLeftFlags:",
  gameStateFunctional.hasCollectedAllLeftFlags
);
console.log("  通常旗数:", gameStateFunctional.flags.length);

// プレイヤーと特殊旗の画面座標確認
if (gameStateFunctional.specialFlags.length > 0) {
  const specialFlag = gameStateFunctional.specialFlags[0];
  console.log("  特殊旗の画面座標:", {
    x: specialFlag.x + 1,
    y: specialFlag.y + 2,
  });
  console.log("  プレイヤーからの距離:", {
    dx: specialFlag.x + 1 - gameStateFunctional.playerX,
    dy: specialFlag.y + 2 - gameStateFunctional.playerY,
  });
}

// 特殊旗回収を確実にするプリセット入力
const demoInputs = [
  // 初期状態を確認するため、数フレーム待機
  "",
  "",
  "",
  "",
  "",
  // プレイヤーを右に移動させて特殊旗を回収
  "right", // 6フレーム目：右に1マス移動
  "right", // 7フレーム目：右に2マス移動（特殊旗回収）
  "", // 8フレーム目：回収後の状態確認
  "",
  "",
  // 敵の凍結状態を確認するため、長時間待機
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 迷路変更エフェクトと敵削除アニメーションを確認
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

const simulatorOptions: ConsoleSimulatorOptions = {
  predefinedMoves: demoInputs,
  totalTicks: 120,
  tickDurationMs: 300,
};

const gameInstanceFunctional = {
  initializeGame: () => {
    // consoleSimulatorが初期化を実行するので、ここでテスト設定を再適用
    console.log("🔥 consoleSimulatorがinitializeGameを呼び出しました");
    console.log("🔥 再初期化前の状態:");
    console.log(
      "  プレイヤー位置:",
      gameStateFunctional.playerX,
      gameStateFunctional.playerY
    );
    console.log("  特殊旗数:", gameStateFunctional.specialFlags.length);
    console.log("  敵の数:", gameStateFunctional.enemies.length);
    console.log("  通常旗数:", gameStateFunctional.flags.length);

    gameStateFunctional = initializeLabyracer(gameStateFunctional);

    console.log("🔥 再初期化後の状態:");
    console.log(
      "  プレイヤー位置:",
      gameStateFunctional.playerX,
      gameStateFunctional.playerY
    );
    console.log("  特殊旗数:", gameStateFunctional.specialFlags.length);
    console.log("  特殊旗位置:", gameStateFunctional.specialFlags);
    console.log("  敵の数:", gameStateFunctional.enemies.length);
    console.log("  通常旗数:", gameStateFunctional.flags.length);
    console.log(
      "  hasCollectedAllLeftFlags:",
      gameStateFunctional.hasCollectedAllLeftFlags
    );
  },
  update: (inputState: any) => {
    gameStateFunctional = updateBaseGame(
      gameStateFunctional,
      inputState,
      labyracerOperations as any
    ) as LabyracerState;
  },
  getVirtualScreenData: () => gameStateFunctional.virtualScreen,
  getScore: () => gameStateFunctional.score,
  getLives: () => gameStateFunctional.lives,
  isGameOver: () => gameStateFunctional.gameOverState,
  drawText: (text: string, x: number, y: number, attributes?: any) => {
    // This is handled internally by the operations
  },
  getCellInfo: (x: number, y: number) => {
    return gameStateFunctional.virtualScreen[y]?.[x] || null;
  },
};

const simulatorStateFunctional = createConsoleSimulator(
  gameInstanceFunctional,
  "predefined",
  simulatorOptions
);
runSimulation(simulatorStateFunctional);
