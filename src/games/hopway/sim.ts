import { HopwayGameManager, HopwayGameManagerOptions } from "./GameManager.js";
import {
  createConsoleSimulator,
  runSimulation as runConsoleSimulation,
  ConsoleSimulatorOptions,
} from "../../utils/consoleSimulator.js";
import { createNodeAudioService } from "../../utils/nodeAudioService.js";
import {
  InputState,
  VIRTUAL_SCREEN_HEIGHT,
  VIRTUAL_SCREEN_WIDTH,
} from "../../core/coreTypes";
// import { OilSlickEvent } from "./events/OilSlickEvent.js";
// import { RoadConstructionEvent } from "./events/RoadConstructionEvent";
// import { RushHourEvent } from "./events/RushHourEvent";
// import { WeatherEvent } from "./events/WeatherEvent.js";
// import { VIPEscortEvent } from "./events/VIPEscortEvent.js";

async function runSimulation() {
  const gameOptions: HopwayGameManagerOptions = {
    isBrowserEnvironment: false,
    enableHighScoreStorage: false,
    audioService: createNodeAudioService(),
    startInPlayingState: true, // Skip title screen for simulation
  };

  const game = new HopwayGameManager(gameOptions);
  game.initializeGame();

  const simOnlyOptions: ConsoleSimulatorOptions = {
    tickDurationMs: 50,
    totalTicks: 1000,
  };

  const simulatorState = createConsoleSimulator(
    game,
    "interactive",
    simOnlyOptions
  );

  console.log("--- Hopway Game Simulation ---");
  runConsoleSimulation(simulatorState);

  console.log("--- Simulation Finished ---");
  console.log("Final Score:", game.getScore());
  console.log("Game Over:", game.isGameOver());
}

// Test version with accelerated time progression
const testDifficultyProgression = () => {
  console.log("=".repeat(50));
  console.log("Testing Difficulty Progression (Accelerated)");
  console.log("=".repeat(50));

  const game = new HopwayGameManager({
    // Increase event probabilities for faster testing
    carDensity: 0.3,
    maxCarSpeed: 2,
    minCarSpeed: 0.5,
    startInPlayingState: true,
  });

  game.initializeGame();

  // Simulate 6 minutes of gameplay (accelerated)
  const ticksPerSecond = 60;
  const ticksPerMinute = ticksPerSecond * 60; // 3600 ticks per minute
  const totalMinutes = 6;

  console.log("Starting difficulty progression test...\n");

  for (let minute = 1; minute <= totalMinutes; minute++) {
    const startTick = (minute - 1) * ticksPerMinute;
    const endTick = minute * ticksPerMinute;

    console.log(`--- MINUTE ${minute} ---`);

    // Set the game tick counter to simulate time progression
    const coreGame = game.getCoreGame();
    if (!coreGame) continue;

    (coreGame as any).gameTickCounter = startTick;

    // Calculate expected max events for this minute
    const maxEvents = Math.min(minute, 5);
    console.log(`Expected Max Concurrent Events: ${maxEvents}`);

    // Simulate some ticks in this minute
    const dummyInput: InputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      action1: false,
      r: false,
    };

    let eventsTriggered = 0;
    const initialActiveEvents =
      coreGame.getEventManager().getActiveEvents?.() || [];
    const initialEventCount = initialActiveEvents.filter(
      (e: any) => e.isActive
    ).length;

    // Run simulation for a portion of the minute
    for (let tick = startTick; tick < startTick + 600; tick += 10) {
      // Sample every 10 ticks
      (coreGame as any).gameTickCounter = tick;
      game.update(dummyInput);

      // Check current active events
      const currentActiveEvents =
        coreGame.getEventManager().getActiveEvents?.() || [];
      const currentEventCount = currentActiveEvents.filter(
        (e: any) => e.isActive
      ).length;

      if (currentEventCount > initialEventCount + eventsTriggered) {
        eventsTriggered++;
        console.log(
          `  Event triggered! Total active: ${currentEventCount}/${maxEvents}`
        );

        if (currentEventCount >= maxEvents) {
          console.log(
            `  ✓ Reached maximum concurrent events for minute ${minute}`
          );
          break;
        }
      }
    }

    console.log(
      `Active Events at end of sampling: ${
        game
          .getEventManager()
          .getActiveEvents?.()
          ?.filter((e) => e.isActive).length || 0
      }`
    );
    console.log("");
  }

  console.log("=".repeat(50));
  console.log("Difficulty Progression Test Complete!");
  console.log("=".repeat(50));
};

// Add method to access active events for testing
declare module "./events/EventManager" {
  interface EventManager {
    getActiveEvents(): any[];
  }
}

// Run the test
testDifficultyProgression();

// Test score display functionality
const testScoreDisplay = () => {
  console.log("\n" + "=".repeat(50));
  console.log("Testing Score Display Feature");
  console.log("=".repeat(50));

  const game = new HopwayGameManager({
    carDensity: 0, // No cars to interfere
    maxCarSpeed: 0,
    minCarSpeed: 0,
    playerMoveInterval: 1, // Allow movement every tick for testing
    startInPlayingState: true,
  });

  game.initializeGame();

  // Manually position player close to goal for easy testing
  (game as any).playerY = 2; // Just below the top safe row (which is 1)
  (game as any).playerX = 20; // Center position
  (game as any).playerCanMove = true;
  (game as any).lastPlayerMoveTick = -10; // Allow immediate movement

  console.log("Player positioned at Y=2, one step away from goal (Y=1)");
  console.log("Simulating upward movement to trigger level completion...\n");

  let frameCount = 0;
  const maxFrames = 10; // Reduced for debugging
  let hasGivenUpInput = false;

  const simulate = () => {
    if (frameCount >= maxFrames) {
      console.log("Score display test completed.");
      console.log("------------------------------------------");
      return;
    }

    // Give up input on first few frames to trigger movement and level completion
    const currentInput =
      !hasGivenUpInput && frameCount < 5
        ? {
            up: true,
            down: false,
            left: false,
            right: false,
            action1: false,
            r: false,
          }
        : {
            up: false,
            down: false,
            left: false,
            right: false,
            action1: false,
            r: false,
          };

    if (frameCount === 5) {
      hasGivenUpInput = true;
    }

    game.update(currentInput);

    // Display game state every 5 frames to see the score display
    if (frameCount % 5 === 0) {
      const screen = game.getVirtualScreenData();
      console.log(`Frame ${frameCount}:`);
      console.log(renderScreen(screen));
      console.log(`Score: ${game.getScore()}, Lives: ${game.getLives()}`);
      console.log(`Game Tick: ${game.getGameTickCounter()}`);
      console.log(
        `Player Position: (${(game as any).playerX}, ${(game as any).playerY})`
      );
      console.log(`Can Move: ${(game as any).playerCanMove}`);
      console.log(
        `Showing Score Display: ${(game as any).isShowingScoreDisplay}`
      );
      console.log("-".repeat(42));
    }

    frameCount++;
    setTimeout(simulate, 50); // Slightly slower for better observation
  };

  setTimeout(simulate, 100); // Start after delay
};

// Run score display test
testScoreDisplay();

// Original simulation for reference
const runOriginalSimulation = () => {
  console.log("\n" + "=".repeat(50));
  console.log("Running Original Simulation");
  console.log("=".repeat(50));

  const game = new HopwayGameManager({ startInPlayingState: true });
  game.initializeGame();

  let frameCount = 0;
  const maxFrames = 2000; // Limit simulation length

  console.log("Interactive mode is not fully implemented, using random input.");
  console.log("-".repeat(42));

  const simulate = () => {
    if (frameCount >= maxFrames || game.isGameOver()) {
      console.log(
        `Simulation finished: ${
          game.isGameOver() ? "Game Over" : "Max frames reached"
        }.`
      );
      console.log("-".repeat(42));
      return;
    }

    // Random input for simulation
    const inputState: InputState = {
      up: Math.random() < 0.05,
      down: Math.random() < 0.05,
      left: Math.random() < 0.05,
      right: Math.random() < 0.05,
      action1: Math.random() < 0.01,
      r: false,
    };

    game.update(inputState);

    // Display game state every 30 frames
    if (frameCount % 30 === 0) {
      const screen = game.getVirtualScreenData();
      console.log(renderScreen(screen));
      console.log("-".repeat(42));
    }

    frameCount++;
    setTimeout(simulate, 16); // ~60 FPS
  };

  setTimeout(simulate, 100); // Start after delay
};

function renderScreen(screen: any[][]): string {
  return screen
    .map((row) => "|" + row.map((cell) => cell?.char || " ").join("") + "|")
    .join("\n");
}

// Run original simulation after test
// setTimeout(runOriginalSimulation, 1000);

// runSimulation().catch((e) => console.error("Error during simulation:", e));

console.log("Score display test completed.");
console.log("------------------------------------------");

// Test title screen display
console.log("");
console.log("==================================================");
console.log("Testing Title Screen Display");
console.log("==================================================");

// Create a new game manager starting in title state
const titleTestManager = new HopwayGameManager({
  isDemoPlay: false,
  startInPlayingState: false, // Start in title screen
});

titleTestManager.initializeGame();

console.log(
  `Initial flow state: ${(titleTestManager as any).currentFlowState}`
);

// Test title screen for a few frames
for (let frame = 0; frame < 3; frame++) {
  const emptyInput: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action1: false,
    r: false,
  };

  titleTestManager.update(emptyInput);
  const screenData = titleTestManager.getVirtualScreenData();

  console.log(`Title Screen Frame ${frame}:`);
  for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
    let line = "|";
    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      const cell = screenData[y][x];
      line += cell?.char || " ";
    }
    line += "|";
    console.log(line);
  }
  console.log(`Flow state: ${(titleTestManager as any).currentFlowState}`);
  console.log("------------------------------------------");
}

// Test game over screen countdown
console.log("");
console.log("==================================================");
console.log("Testing Game Over Screen Countdown");
console.log("==================================================");

// Create a new game manager for game over test
const gameOverTestManager = new HopwayGameManager({
  initialLives: 1, // Start with 1 life to trigger game over quickly
  isDemoPlay: false,
  startInPlayingState: true, // Start directly in playing state
});

gameOverTestManager.initializeGame();

// Force game over by losing all lives
const coreGame = gameOverTestManager.getCoreGame();
if (coreGame) {
  coreGame.loseLife(); // This should trigger game over
}

console.log(`Game over state: ${gameOverTestManager.isGameOver()}`);

// Test countdown for 5 frames
for (let frame = 0; frame < 5; frame++) {
  const emptyInput: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action1: false,
    r: false,
  };

  gameOverTestManager.update(emptyInput);
  const screenData = gameOverTestManager.getVirtualScreenData();

  console.log(`Frame ${frame}:`);
  for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
    let line = "|";
    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      const cell = screenData[y][x];
      line += cell?.char || " ";
    }
    line += "|";
    console.log(line);
  }
  console.log(`Game over state: ${gameOverTestManager.isGameOver()}`);
  console.log("------------------------------------------");
}
