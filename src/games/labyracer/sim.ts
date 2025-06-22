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

console.log("🚀 sim.ts executed!");
console.log("🚀 Current time:", new Date().toISOString());

const labyracerOperations = {
  initializeGame: initializeLabyracer,
  updateGame: updateLabyracer,
};
function runLabyracerTestSimulation() {
  const gameState = createLabyracerState({
    initialLives: 3,
    enemyCount: 3,
  });

  const gameInstanceFunctional = {
    initializeGame: () => {
      // Initialization
    },
    update: (inputState: any) => {
      // Update processing
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

console.log("=== Simulation Settings Check ===");
console.log("Player position (screen coords):", { x: 8, y: 10 });
console.log("Special flag position (maze coords):", { x: 8, y: 8 });
console.log("Special flag position (screen coords):", { x: 8 + 1, y: 8 + 2 });
console.log("hasCollectedAllLeftFlags:", true);
console.log("=================================");

let gameStateFunctional = createLabyracerState({
  initialLives: 51,
});

console.log("🔥 Manually calling initializeLabyracer...");
gameStateFunctional = initializeLabyracer(gameStateFunctional);
console.log("🔥 Manual initialization complete:");
console.log(
  "  Player position:",
  gameStateFunctional.playerX,
  gameStateFunctional.playerY
);
console.log("  Special flags count:", gameStateFunctional.specialFlags.length);
console.log("  Special flag positions:", gameStateFunctional.specialFlags);
console.log("  Enemy count:", gameStateFunctional.enemies.length);
console.log(
  "  hasCollectedAllLeftFlags:",
  gameStateFunctional.hasCollectedAllLeftFlags
);
console.log("  Regular flags count:", gameStateFunctional.flags.length);

if (gameStateFunctional.specialFlags.length > 0) {
  const specialFlag = gameStateFunctional.specialFlags[0];
  console.log("  Special flag screen coords:", {
    x: specialFlag.x + 1,
    y: specialFlag.y + 2,
  });
  console.log("  Distance from player:", {
    dx: specialFlag.x + 1 - gameStateFunctional.playerX,
    dy: specialFlag.y + 2 - gameStateFunctional.playerY,
  });
}

const demoInputs = [
  "",
  "",
  "",
  "",
  "",
  "right",
  "right",
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
    console.log("🔥 consoleSimulator called initializeGame");
    console.log("🔥 State before re-initialization:");
    console.log(
      "  Player position:",
      gameStateFunctional.playerX,
      gameStateFunctional.playerY
    );
    console.log(
      "  Special flags count:",
      gameStateFunctional.specialFlags.length
    );
    console.log("  Enemy count:", gameStateFunctional.enemies.length);
    console.log("  Regular flags count:", gameStateFunctional.flags.length);

    gameStateFunctional = initializeLabyracer(gameStateFunctional);

    console.log("🔥 State after re-initialization:");
    console.log(
      "  Player position:",
      gameStateFunctional.playerX,
      gameStateFunctional.playerY
    );
    console.log(
      "  Special flags count:",
      gameStateFunctional.specialFlags.length
    );
    console.log("  Special flag positions:", gameStateFunctional.specialFlags);
    console.log("  Enemy count:", gameStateFunctional.enemies.length);
    console.log("  Regular flags count:", gameStateFunctional.flags.length);
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
