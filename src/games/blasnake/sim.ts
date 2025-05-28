import { CoreGameLogic } from "./core.js";
import { InputState } from "../../core/coreTypes.js";

// デバッグモード設定
const DEBUG_MODE = true;
const INVINCIBLE = true;
const TIME_ACCELERATION = 100.0; // 100倍速でレベル進行を確認
const CONSTRAIN_TO_BOUNDS = true;

const game = new CoreGameLogic({
  initialLives: 3,
  movementInterval: 8,
  debugMode: DEBUG_MODE,
  invincible: INVINCIBLE,
  timeAcceleration: TIME_ACCELERATION,
  constrainToBounds: CONSTRAIN_TO_BOUNDS,
});

console.log("🎮 Starting Blasnake Simulation...");
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

const maxTicks = 36000; // 100倍速で約60分間のゲーム時間をシミュレート（レベル15以降まで確認）
let tick = 0;

// Basic input sequence for general testing (レベル確認用に簡単な移動パターン)
const inputs: Array<Partial<InputState>> = [
  ...Array(10).fill({ right: true }),
  ...Array(10).fill({ down: true }),
  ...Array(10).fill({ left: true }),
  ...Array(10).fill({ up: true }),
  ...Array(35960).fill({}), // 残りは入力なしで時間経過を確認
];

let inputIndex = 0;
let lastLevel = 1; // 前回のレベルを記録

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

  // Log every few ticks
  if (tick % 600 === 0 || tick < 30) {
    // 600ティックごと（約10秒ごと）にログ出力
    console.log(`--- Tick ${tick} ---`);
    const snakeHead = (game as any).snake[0];
    if (snakeHead) {
      const headPos = `(${snakeHead.x},${snakeHead.y})`;
      console.log(`Snake Head: ${headPos}, Score: ${game.getScore()}`);
    }

    // Log level information (デバッグ情報として表示)
    const levelInfo = game.getCurrentLevelInfo();
    console.log(`🎯 Current Level: ${levelInfo}`);

    // Log spawn system debug info
    const spawnDebugInfo = game.getSpawnDebugInfo();
    console.log(
      `⏰ Game Time: ${spawnDebugInfo.gameTimeSeconds.toFixed(
        1
      )}s (${TIME_ACCELERATION}x accelerated)`
    );
    console.log(
      `📈 Level Difficulty Multiplier: ${spawnDebugInfo.levelDifficultyMultiplier}x`
    );

    if (spawnDebugInfo.isEndlessMode) {
      console.log(
        `🔄 Endless Multiplier: ${spawnDebugInfo.endlessMultiplier.toFixed(1)}x`
      );
    }

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

    // Display current game state screen occasionally
    if (tick % 3600 === 0) {
      // 60秒ごとに画面表示
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

// Display final level and spawn system info
const finalLevelInfo = game.getCurrentLevelInfo();
const finalSpawnDebugInfo = game.getSpawnDebugInfo();
console.log("=== FINAL LEVEL STATE ===");
console.log(`🎯 Final Level: ${finalLevelInfo}`);
console.log(
  `⏰ Final Game Time: ${finalSpawnDebugInfo.gameTimeSeconds.toFixed(
    1
  )}s (${TIME_ACCELERATION}x accelerated)`
);
console.log(
  `📈 Final Level Difficulty Multiplier: ${finalSpawnDebugInfo.levelDifficultyMultiplier}x`
);

if (finalSpawnDebugInfo.isEndlessMode) {
  console.log(
    `🔄 Endless Mode Reached - Multiplier: ${finalSpawnDebugInfo.endlessMultiplier.toFixed(
      1
    )}x`
  );
} else {
  console.log(`📊 Normal Mode - Level ${finalSpawnDebugInfo.currentLevel}/20`);
}

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
