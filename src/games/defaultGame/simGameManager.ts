import { InputState } from "../../core/coreTypes.js";
import { createNodeAudioService } from "../../utils/nodeAudioService.js";
import {
  createConsoleSimulator,
  runSimulation,
  ConsoleSimulatorOptions,
} from "../../utils/consoleSimulator.js";
import {
  createDefaultGameManagerState,
  updateGameManager,
  renderGameManager,
  getCurrentFlowState,
  getGameManagerScore,
  getGameManagerLives,
} from "./gameManager.js";

// Game flow state constants (matching gameManager.ts)
const GAME_FLOW_STATE_TITLE = 0;
const GAME_FLOW_STATE_PLAYING = 1;
const GAME_FLOW_STATE_GAME_OVER = 2;

function runDefaultGameManagerSimulation() {
  console.log("🎮 Default Game Manager Module Simulation");
  console.log("Features:");
  console.log("  ✅ Title screen with demo play");
  console.log("  ✅ Game over screen with auto-timeout");
  console.log("  ✅ High score management");
  console.log("  ✅ Background music and sound effects");
  console.log("  ✅ Complete flow control");
  console.log();

  const audioService = createNodeAudioService();

  // Create initial game state with GameManager
  let gameState = createDefaultGameManagerState({
    initialLives: 3,
    audioService: audioService,
    gameName: "Default Game Manager",
    enableHighScoreStorage: false, // Disabled for console simulation
    isBrowserEnvironment: false,
  });

  // Create GameCore-compatible wrapper for consoleSimulator
  const gameInstance = {
    initializeGame: () => {
      // GameManager initializes in TITLE state by default
      console.log("🎯 Game initialized in TITLE state");
    },
    update: (inputState: InputState) => {
      const prevFlow = getCurrentFlowState(gameState);

      // Update game state
      gameState = updateGameManager(gameState, inputState);

      // Render the game
      gameState = renderGameManager(gameState);

      const currentFlow = getCurrentFlowState(gameState);

      // Log flow state changes
      if (prevFlow !== currentFlow) {
        const flowNames = ["TITLE", "PLAYING", "GAME_OVER"];
        console.log(
          `🔄 Flow state changed: ${flowNames[prevFlow]} → ${flowNames[currentFlow]}`
        );

        if (currentFlow === GAME_FLOW_STATE_PLAYING) {
          console.log("🚀 Game started!");
        } else if (currentFlow === GAME_FLOW_STATE_GAME_OVER) {
          console.log(
            `💀 Game over! Final score: ${getGameManagerScore(gameState)}`
          );
        } else if (currentFlow === GAME_FLOW_STATE_TITLE) {
          console.log("🏠 Returned to title screen");
        }
      }
    },
    getVirtualScreenData: () => gameState.virtualScreen,
    getScore: () => getGameManagerScore(gameState),
    getLives: () => getGameManagerLives(gameState),
    isGameOver: () => {
      // For simulation purposes, consider the game "over" only when in GAME_OVER state
      // This allows the title screen demo to continue running
      return getCurrentFlowState(gameState) === GAME_FLOW_STATE_GAME_OVER;
    },
    // Additional methods for GameCore compatibility
    drawText: (text: string, x: number, y: number, attributes?: any) => {
      // This is handled internally by the game manager
    },
    getCellInfo: (x: number, y: number) => {
      return gameState.virtualScreen[y]?.[x] || null;
    },
  };

  console.log("🎵 Audio initialized");
  console.log("📱 Starting console simulation...");
  console.log();

  // Console simulator options for GameManager demo
  const titleWait = "..........".split(""); // Wait in title screen for demo to play
  const startGame = ["a"]; // Start the game (action1 simulates space key)
  const gameplay = "rrrdddlluurrdd".split(""); // Play the game with movement
  const moreMovement = "lurdlurd".split(""); // More movement patterns
  const finalWait = ".....".split(""); // Let it run a bit more

  const options: ConsoleSimulatorOptions = {
    predefinedMoves: [
      ...titleWait,
      ...startGame,
      ...gameplay,
      ...moreMovement,
      ...finalWait,
    ],
    totalTicks: 80,
    tickDurationMs: 300, // Slower to see the flow changes
  };

  const simulatorState = createConsoleSimulator(
    gameInstance,
    "predefined",
    options
  );

  runSimulation(simulatorState);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down game...");
  process.exit(0);
});

runDefaultGameManagerSimulation();
