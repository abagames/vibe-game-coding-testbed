import { CoreGameLogic } from "./core.js";
import { InputState } from "../../core/coreTypes.js";

// デバッグモード設定 - 通常プレイテスト用
// Debug Mode Settings - For Normal Gameplay Testing
//
// FOR LEVEL DEBUGGING: Change these settings to quickly test level progression:
// - Set INVINCIBLE = true (to avoid dying during level testing)
// - Set TIME_ACCELERATION = 100.0 or higher (to speed up level progression)
// - Set maxTicks = 3600 (simulates 100 game minutes with 100x acceleration)
// - Reduce input complexity (use simple movement patterns)
//
// FOR NORMAL GAMEPLAY TESTING: Use current settings:
// - INVINCIBLE = false (to test collision mechanics)
// - TIME_ACCELERATION = 1.0 (normal game speed)
// - maxTicks = 3600 (about 60 seconds of testing)
// - Complex input patterns (to test various gameplay scenarios)

const DEBUG_MODE = true; // デバッグ情報は表示したまま
const INVINCIBLE = false; // 無敵状態を解除 // Set to true for level debugging
const TIME_ACCELERATION = 1.0; // 通常速度に戻す // Set to 100.0+ for level debugging
const CONSTRAIN_TO_BOUNDS = true;

const game = new CoreGameLogic({
  initialLives: 3,
  movementInterval: 8,
  debugMode: DEBUG_MODE,
  invincible: INVINCIBLE,
  timeAcceleration: TIME_ACCELERATION,
  constrainToBounds: CONSTRAIN_TO_BOUNDS,
});

console.log("🎮 Starting Blasnake Simulation - Normal Gameplay Test...");
console.log(`🔧 Debug Mode: ${DEBUG_MODE ? "ON" : "OFF"}`);
console.log(`🛡️ Invincible: ${INVINCIBLE ? "ON" : "OFF"}`);
console.log(`⚡ Time Acceleration: ${TIME_ACCELERATION}x`);
console.log(`🔒 Constrain to Bounds: ${CONSTRAIN_TO_BOUNDS ? "ON" : "OFF"}`);
console.log("---");

// Create a shorter snake for easier movement
const snakeStartX = 15;
const snakeStartY = 12;
const initialSnakeLength = 6;
(game as any).snake = [];

// Create horizontal snake moving RIGHT
for (let i = 0; i < initialSnakeLength; i++) {
  (game as any).snake.push({ x: snakeStartX - i, y: snakeStartY });
}

(game as any).direction = 3; // Start RIGHT
(game as any).nextDirection = 3; // Start RIGHT

const maxTicks = 3600; // 通常速度で約60秒間のテスト
let tick = 0;

// より複雑な移動パターンで衝突や囲まれ状況をテスト
// Complex movement patterns for collision and enclosure testing
//
// FOR LEVEL DEBUGGING: Replace with simpler patterns like:
/*
const inputs: Array<Partial<InputState>> = [
  ...Array(10).fill({ right: true }),
  ...Array(10).fill({ down: true }),
  ...Array(10).fill({ left: true }),
  ...Array(10).fill({ up: true }),
  ...Array(35960).fill({}), // Remaining time with no input for time progression
];
*/
//
const inputs: Array<Partial<InputState>> = [
  // 初期移動 - 右に移動
  ...Array(20).fill({ right: true }),
  // 下に移動
  ...Array(15).fill({ down: true }),
  // 左に移動（壁に近づく）
  ...Array(25).fill({ left: true }),
  // 上に移動
  ...Array(15).fill({ up: true }),
  // 右に移動（敵との遭遇を狙う）
  ...Array(20).fill({ right: true }),
  // 複雑な移動パターン（囲まれ状況を作る）
  ...Array(10).fill({ down: true }),
  ...Array(10).fill({ left: true }),
  ...Array(10).fill({ up: true }),
  ...Array(10).fill({ right: true }),
  // 危険な移動（敵の多い場所へ）
  ...Array(15).fill({ down: true }),
  ...Array(15).fill({ right: true }),
  // 残りは様々な方向への移動
  ...Array(50).fill({ left: true }),
  ...Array(50).fill({ up: true }),
  ...Array(50).fill({ right: true }),
  ...Array(50).fill({ down: true }),
  // 最後は入力なしで敵の動きを観察
  ...Array(3000).fill({}),
];

let inputIndex = 0;
let lastLevel = 1; // 前回のレベルを記録
let lastLives = 3; // 前回のライフ数を記録

while (tick < maxTicks && !game.isGameOver()) {
  let currentInput: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action1: false,
    ...(inputs[inputIndex] || {}),
  };

  game.update(currentInput);

  // ライフ変更の検出（ミスや爆発の検出）
  const currentLives = game.getLives();
  if (currentLives !== lastLives) {
    console.log(`\n💥💥💥 LIFE LOST! 💥💥💥`);
    console.log(`💔 Lives: ${lastLives} → ${currentLives}`);
    console.log(`⏰ Tick: ${tick}`);
    console.log(`🎮 Score: ${game.getScore()}`);

    // 死因を推測するための情報表示
    const snakeHead = (game as any).snake[0];
    if (snakeHead) {
      console.log(`🐍 Snake Head Position: (${snakeHead.x}, ${snakeHead.y})`);
    }

    const debugInfo = game.getEnemyDebugInfo();
    console.log(`👹 Enemies on field: ${debugInfo.totalEnemies}`);
    console.log(`💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥\n`);

    lastLives = currentLives;
  }

  // レベル変更の検出
  const spawnDebugInfo = game.getSpawnDebugInfo();
  const currentLevel = spawnDebugInfo.currentLevel;

  if (currentLevel !== lastLevel) {
    console.log(`\n🎯🎯🎯 LEVEL CHANGE DETECTED! 🎯🎯🎯`);
    console.log(`📈 Level ${lastLevel} → Level ${currentLevel}`);
    console.log(`⏰ Game Time: ${spawnDebugInfo.gameTimeSeconds.toFixed(1)}s`);
    console.log(`🎮 Level Name: ${game.getCurrentLevelInfo()}`);

    // 新レベルで出現する敵タイプを表示
    const levelInfo = spawnDebugInfo.levelName;
    console.log(`👹 New Level Focus: ${levelInfo}`);
    console.log(`🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯\n`);

    lastLevel = currentLevel;
  }

  // Log every few ticks - より頻繁にログ出力（通常速度なので）
  if (tick % 60 === 0 || tick < 30) {
    // 60ティックごと（約1秒ごと）にログ出力
    console.log(`--- Tick ${tick} ---`);
    const snakeHead = (game as any).snake[0];
    if (snakeHead) {
      const headPos = `(${snakeHead.x},${snakeHead.y})`;
      console.log(
        `🐍 Snake Head: ${headPos}, Score: ${game.getScore()}, Lives: ${game.getLives()}`
      );
    }

    // Log level information
    const levelInfo = game.getCurrentLevelInfo();
    console.log(`🎯 Current Level: ${levelInfo}`);

    // Log spawn system debug info
    const spawnDebugInfo = game.getSpawnDebugInfo();
    console.log(`⏰ Game Time: ${spawnDebugInfo.gameTimeSeconds.toFixed(1)}s`);

    // Log enemy information
    const debugInfo = game.getEnemyDebugInfo();
    console.log(`👹 Total Enemies: ${debugInfo.totalEnemies}`);

    // Log enemy counts by type (非ゼロのもののみ)
    const nonZeroCounts = Object.entries(spawnDebugInfo.enemyCounts)
      .filter(([_, count]) => (count as number) > 0)
      .map(([type, count]) => `${type}: ${count}`)
      .join(", ");

    if (nonZeroCounts) {
      console.log(`📊 Enemy Counts: ${nonZeroCounts}`);
    } else {
      console.log(`📊 Enemy Counts: None`);
    }

    // Display current game state screen more frequently for collision analysis
    if (tick % 300 === 0) {
      // 5秒ごとに画面表示
      console.log("=== CURRENT SCREEN STATE ===");
      const screenData = game.getVirtualScreenData();
      for (let y = 0; y < screenData.length; y++) {
        let line = "|";
        for (let x = 0; x < screenData[y].length; x++) {
          line += screenData[y][x].char;
        }
        line += "|";
        console.log(line);
      }
      console.log("=== END SCREEN STATE ===");
      console.log(
        "Legend: @ = Snake Head, * = Snake Body, X = Wanderer, G = Guard, C = Chaser, S = Splitter, F = Speedster, M = Mimic, N = Snake, W = Wall Creeper, H = Ghost, R = Swarm, $ = Food, # = Wall"
      );
    }

    console.log("------------------------------------------");
  }

  if (inputIndex < inputs.length - 1) {
    inputIndex++;
  }

  tick++;
}

console.log("🏁 Blasnake Simulation finished.");
console.log("Final Score:", game.getScore(), "Lives:", game.getLives());

if (game.isGameOver()) {
  console.log("💀 GAME OVER!");
  if (game.getLives() <= 0) {
    console.log("💔 All lives lost!");
  }
} else {
  console.log("⏰ Simulation time limit reached");
}

// Display final level and spawn system info
const finalLevelInfo = game.getCurrentLevelInfo();
const finalSpawnDebugInfo = game.getSpawnDebugInfo();
console.log("=== FINAL GAME STATE ===");
console.log(`🎯 Final Level: ${finalLevelInfo}`);
console.log(
  `⏰ Final Game Time: ${finalSpawnDebugInfo.gameTimeSeconds.toFixed(1)}s`
);

// Display final enemy counts (非ゼロのもののみ)
const finalNonZeroCounts = Object.entries(finalSpawnDebugInfo.enemyCounts)
  .filter(([_, count]) => (count as number) > 0)
  .map(([type, count]) => `${type}: ${count}`)
  .join(", ");

if (finalNonZeroCounts) {
  console.log(`👹 Final Enemy Counts: ${finalNonZeroCounts}`);
} else {
  console.log(`👹 Final Enemy Counts: None`);
}
