import { GameManager } from "./GameManager.js";
import { InputState } from "../../core/coreTypes.js";
import { CoreGameLogic } from "./core.js";

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

// Instantiate GameManager
const game = new GameManager({
  initialLives: 3,
  movementInterval: 8,
  debugMode: DEBUG_MODE,
  invincible: INVINCIBLE,
  timeAcceleration: TIME_ACCELERATION,
  constrainToBounds: CONSTRAIN_TO_BOUNDS,
  startInPlayingState: true, // Start directly in playing state for simulation
});

// Immediately start the game for simulation purposes, bypassing title screen
// game.startGameImmediately(); // This call is no longer needed

// Access CoreGameLogic for specific debug setup
const coreGame = game.getCoreGameLogic();

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

// Modify coreGame properties directly for sim setup
(coreGame as any).snake = [];
for (let i = 0; i < initialSnakeLength; i++) {
  (coreGame as any).snake.push({ x: snakeStartX - i, y: snakeStartY });
}
(coreGame as any).direction = 3; // Start RIGHT (assuming 3 is Direction.RIGHT)
(coreGame as any).nextDirection = 3; // Start RIGHT

const maxTicks = 3600; // 通常速度で約60秒間のテスト
let tick = 0;

// Screen center circling pattern
const horizontalMoveTicks = 15; // Move 15 ticks (adjust as needed for screen size)
const verticalMoveTicks = 10; // Move 10 ticks (adjust as needed for screen size)

const inputs: Array<Partial<InputState>> = [];
const cycles = Math.floor(
  maxTicks / ((horizontalMoveTicks + verticalMoveTicks) * 2)
);

for (let i = 0; i < cycles; i++) {
  inputs.push(...Array(horizontalMoveTicks).fill({ right: true }));
  inputs.push(...Array(verticalMoveTicks).fill({ down: true }));
  inputs.push(...Array(horizontalMoveTicks).fill({ left: true }));
  inputs.push(...Array(verticalMoveTicks).fill({ up: true }));
}
// Fill remaining ticks with no input, if any
const remainingTicks = maxTicks - inputs.length;
if (remainingTicks > 0) {
  inputs.push(...Array(remainingTicks).fill({}));
}

let inputIndex = 0;
let lastLevel = 1; // 前回のレベルを記録
let lastLives = (game.getCoreGameLogic() as any).initialLivesCount || 3; // Get initial lives from coreGame if possible

// game.isGameOver() will now check GameManager's state, which in turn checks CoreGameLogic
while (tick < maxTicks && !game.isGameOver()) {
  let currentInput: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action1: false,
    enter: false, // ensure all new InputState fields are present
    space: false,
    escape: false,
    r: false,
    ...(inputs[inputIndex] || {}),
  };

  game.update(currentInput); // This calls GameManager.update

  const currentCoreGame = game.getCoreGameLogic();
  const currentLives = currentCoreGame.getLives();

  if (currentLives !== lastLives) {
    console.log(`\n💥💥💥 LIFE LOST! 💥💥💥`);
    console.log(`💔 Lives: ${lastLives} → ${currentLives}`);
    console.log(`⏰ Tick: ${tick}`);
    console.log(`🎮 Score: ${currentCoreGame.getScore()}`);

    const snakeHead = (currentCoreGame as any).snake[0];
    if (snakeHead) {
      console.log(`🐍 Snake Head Position: (${snakeHead.x}, ${snakeHead.y})`);
    }

    const debugInfo = currentCoreGame.getEnemyDebugInfo();
    console.log(`👹 Enemies on field: ${debugInfo.totalEnemies}`);
    console.log(`💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥\n`);

    lastLives = currentLives;
  }

  const spawnDebugInfo = currentCoreGame.getSpawnDebugInfo();
  const currentLevel = spawnDebugInfo.currentLevel;

  if (currentLevel !== lastLevel) {
    console.log(`\n🎯🎯🎯 LEVEL CHANGE DETECTED! 🎯🎯🎯`);
    console.log(`📈 Level ${lastLevel} → Level ${currentLevel}`);
    console.log(`⏰ Game Time: ${spawnDebugInfo.gameTimeSeconds.toFixed(1)}s`);
    console.log(`🎮 Level Name: ${currentCoreGame.getCurrentLevelInfo()}`);

    const levelInfo = spawnDebugInfo.levelName;
    console.log(`👹 New Level Focus: ${levelInfo}`);
    console.log(`🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯🎯\n`);

    lastLevel = currentLevel;
  }

  if (tick % 60 === 0 || tick < 30) {
    console.log(`--- Tick ${tick} ---`);
    const snakeHead = (currentCoreGame as any).snake[0];
    if (snakeHead) {
      const headPos = `(${snakeHead.x},${snakeHead.y})`;
      console.log(
        `🐍 Snake Head: ${headPos}, Score: ${currentCoreGame.getScore()}, Lives: ${currentCoreGame.getLives()}`
      );
    }

    const levelInfo = currentCoreGame.getCurrentLevelInfo();
    console.log(`🎯 Current Level: ${levelInfo}`);

    const currentSpawnDebugInfo = currentCoreGame.getSpawnDebugInfo(); // re-fetch for clarity
    console.log(
      `⏰ Game Time: ${currentSpawnDebugInfo.gameTimeSeconds.toFixed(1)}s`
    );

    const enemyDebugInfo = currentCoreGame.getEnemyDebugInfo(); // re-fetch for clarity
    console.log(`👹 Total Enemies: ${enemyDebugInfo.totalEnemies}`);

    const nonZeroCounts = Object.entries(currentSpawnDebugInfo.enemyCounts)
      .filter(([_, count]) => (count as number) > 0)
      .map(([type, count]) => `${type}: ${count}`)
      .join(", ");

    if (nonZeroCounts) {
      console.log(`📊 Enemy Counts: ${nonZeroCounts}`);
    } else {
      console.log(`📊 Enemy Counts: None`);
    }

    if (
      (!INVINCIBLE && TIME_ACCELERATION === 1.0 && tick % 60 === 0) ||
      tick % 300 === 0
    ) {
      console.log("=== CURRENT SCREEN STATE ===");
      const screenData = game.getVirtualScreenData(); // This is from GameManager (BaseGame)
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

const finalCoreGame = game.getCoreGameLogic();
console.log("🏁 Blasnake Simulation finished.");
console.log(
  "Final Score:",
  finalCoreGame.getScore(),
  "Lives:",
  finalCoreGame.getLives()
);

if (game.isGameOver()) {
  // GameManager knows if the game (via CoreGameLogic) is over
  console.log("💀 GAME OVER!");
  if (finalCoreGame.getLives() <= 0) {
    console.log("💔 All lives lost!");
  }
} else {
  console.log("⏰ Simulation time limit reached");
}

const finalLevelInfo = finalCoreGame.getCurrentLevelInfo();
const finalSpawnDebugInfo = finalCoreGame.getSpawnDebugInfo();
console.log("=== FINAL GAME STATE ===");
console.log(`🎯 Final Level: ${finalLevelInfo}`);
console.log(
  `⏰ Final Game Time: ${finalSpawnDebugInfo.gameTimeSeconds.toFixed(1)}s`
);

const finalNonZeroCounts = Object.entries(finalSpawnDebugInfo.enemyCounts)
  .filter(([_, count]) => (count as number) > 0)
  .map(([type, count]) => `${type}: ${count}`)
  .join(", ");

if (finalNonZeroCounts) {
  console.log(`👹 Final Enemy Counts: ${finalNonZeroCounts}`);
} else {
  console.log(`👹 Final Enemy Counts: None`);
}
