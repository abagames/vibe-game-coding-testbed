import { CoreGameLogic } from "./core.js";
import { ConsoleSimulator } from "../../utils/consoleSimulator.js";

const totalTicks = 200; // Blasnake用 - 領域囲みテスト用に増加
const tickDurationMs = 150;

console.log("Blasnake Simulator");
console.log(
  "Test Pattern: 初期10tick待機 -> 四角形を描いて領域囲み爆発をテスト"
);

const game = new CoreGameLogic({
  initialLives: 3, // テスト用にライフを多めに
  movementInterval: 5, // 少し早めに
});

const keyPressPattern: string[] = [];

// Initial 5 ticks: Wait
for (let i = 0; i < 5; i++) {
  keyPressPattern.push(".");
}

// まず食べ物を取りに行く (スネークを成長させる)
// 20 ticks: 右下の食べ物を目指す
for (let i = 0; i < 10; i++) {
  keyPressPattern.push("r");
}
for (let i = 0; i < 10; i++) {
  keyPressPattern.push("d");
}

// 食べ物近くに行ったら取る
for (let i = 0; i < 5; i++) {
  keyPressPattern.push("r");
}

// 15 ticks: Right movement (四角形の右辺)
for (let i = 0; i < 15; i++) {
  keyPressPattern.push("r");
}

// 10 ticks: Down movement (四角形の下辺)
for (let i = 0; i < 10; i++) {
  keyPressPattern.push("d");
}

// 15 ticks: Left movement (四角形の左辺)
for (let i = 0; i < 15; i++) {
  keyPressPattern.push("l");
}

// 10 ticks: Up movement (四角形の上辺で領域を閉じる)
for (let i = 0; i < 10; i++) {
  keyPressPattern.push("u");
}

// Wait a bit to see the explosion effect
for (let i = 0; i < 5; i++) {
  keyPressPattern.push(".");
}

// Test another smaller rectangle
// 8 ticks: Right movement (小さい四角形)
for (let i = 0; i < 8; i++) {
  keyPressPattern.push("r");
}

// 5 ticks: Down movement
for (let i = 0; i < 5; i++) {
  keyPressPattern.push("d");
}

// 8 ticks: Left movement
for (let i = 0; i < 8; i++) {
  keyPressPattern.push("l");
}

// 5 ticks: Up movement (小さい領域を閉じる)
for (let i = 0; i < 5; i++) {
  keyPressPattern.push("u");
}

// Remaining ticks: Random exploration
const moves = ["u", "d", "l", "r", "."];
for (let i = keyPressPattern.length; i < totalTicks; i++) {
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  keyPressPattern.push(randomMove);
}

const simulator = new ConsoleSimulator(game, "predefined", {
  totalTicks: totalTicks,
  tickDurationMs: tickDurationMs,
  predefinedMoves: keyPressPattern,
});

simulator.run();
