import { InputState } from "../../core/coreTypes.js";
import { createNodeAudioService } from "../../utils/nodeAudioService.js";
import {
  createConsoleSimulator,
  runSimulation,
  ConsoleSimulatorOptions,
} from "../../utils/consoleSimulator.js";
import {
  createLabyracerManagerState,
  updateGameManager,
  renderGameManager,
  getCurrentFlowState,
  getGameManagerScore,
  getGameManagerLives,
  initializeGameManager,
} from "./gameManager.js";

// Game flow state constants (matching gameManager.ts)
const GAME_FLOW_STATE_TITLE = 0;
const GAME_FLOW_STATE_DEMO = 1;
const GAME_FLOW_STATE_PLAYING = 2;
const GAME_FLOW_STATE_GAME_OVER = 3;

function runLabyracerGameManagerSimulation() {
  console.log("🏁 Labyracer Game Manager Module Simulation");
  console.log("Features:");
  console.log("  ✅ Title screen with large text");
  console.log("  ✅ Game over screen with auto-timeout");
  console.log("  ✅ High score management");
  console.log("  ✅ Background music and sound effects");
  console.log("  ✅ Complete flow control");
  console.log();
  console.log("🔍 Starting GameManager simulation...");
  console.log();

  const audioService = createNodeAudioService();

  // Create initial game state with GameManager
  let gameState = createLabyracerManagerState({
    initialLives: 3,
    audioService: audioService,
    gameName: "Labyracer",
    enableHighScoreStorage: false, // Disabled for console simulation
    isBrowserEnvironment: false,
    startInPlayingState: false, // Explicitly start in title screen
  });

  console.log(
    `🎯 Initial game state created: flow=${getCurrentFlowState(
      gameState
    )}, phase=${gameState.titlePhase}`
  );

  // Create GameCore-compatible wrapper for consoleSimulator
  const gameInstance = {
    initializeGame: () => {
      // GameManager initializes in TITLE state by default
      console.log(
        `🎯 Game state before initialization: flow=${getCurrentFlowState(
          gameState
        )}, phase=${gameState.titlePhase}`
      );
      gameState = initializeGameManager(gameState);
      console.log(
        `🎯 Game initialized in flow state: ${getCurrentFlowState(gameState)}`
      );
      console.log(`🎯 Current title phase: ${gameState.titlePhase}`);
      console.log(`🎯 Current title Y: ${gameState.titleY}`);
    },
    update: (inputState: InputState) => {
      const prevFlow = getCurrentFlowState(gameState);
      const prevTitlePhase = gameState.titlePhase;

      // Debug log every 60 frames (1 second)
      if (gameState.gameTickCounter % 60 === 0) {
        console.log(
          `🔍 Tick ${gameState.gameTickCounter}: flow=${prevFlow}, titlePhase=${prevTitlePhase}, titleY=${gameState.titleY}`
        );
      }

      // Update game state
      gameState = updateGameManager(gameState, inputState);

      // Render the game
      gameState = renderGameManager(gameState);

      const currentFlow = getCurrentFlowState(gameState);

      // Log flow state changes
      if (prevFlow !== currentFlow) {
        const flowNames = ["TITLE", "DEMO", "PLAYING", "GAME_OVER"];
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
        } else if (currentFlow === GAME_FLOW_STATE_DEMO) {
          console.log("🎮 Game in demo mode");
        }
      }

      // Log title phase changes
      if (
        currentFlow === GAME_FLOW_STATE_TITLE &&
        prevTitlePhase !== gameState.titlePhase
      ) {
        const phaseNames = [
          "INITIAL_DISPLAY",
          "MOVING_UP",
          "DEMONSTRATION",
          "WAITING_FOR_DEMO",
        ];
        console.log(
          `📺 Title phase changed: ${phaseNames[prevTitlePhase]} → ${
            phaseNames[gameState.titlePhase]
          }`
        );
        console.log(
          `🎬 Demonstration phase: ${gameState.demonstrationPhase}, timer: ${gameState.demonstrationTimer}`
        );
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
  const titleInitialDisplay = ".".repeat(60).split(""); // Wait 1 second for initial display
  const titleMovement = ".".repeat(120).split(""); // Wait 2 seconds for title movement
  const demonstrationPhase = ".".repeat(600).split(""); // Wait 10 seconds for demonstration
  const postDemoWait = ".".repeat(180).split(""); // Wait 3 seconds after demo
  const demoModeWait = ".".repeat(100).split(""); // Let demo mode run
  const startGame = ["a"]; // Start the game (action1 simulates space key)
  const gameplay = "rrrdddlluurrdd".split(""); // Play the game with movement
  const finalWait = ".....".split(""); // Let it run a bit more

  const options: ConsoleSimulatorOptions = {
    predefinedMoves: [
      ...titleInitialDisplay,
      ...titleMovement,
      ...demonstrationPhase,
      ...postDemoWait,
      ...demoModeWait,
      ...startGame,
      ...gameplay,
      ...finalWait,
    ],
    totalTicks: 1200, // Increased to see all title transitions
    tickDurationMs: 50, // Fast simulation
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

runLabyracerGameManagerSimulation();
