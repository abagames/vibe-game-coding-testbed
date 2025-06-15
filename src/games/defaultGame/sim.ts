import { InputState } from "../../core/coreTypes.js";
import { updateBaseGame } from "../../core/baseGame.js";
import {
  createDefaultGame,
  defaultGameOperations,
  type DefaultGameState,
} from "./core.js";
import {
  createConsoleSimulator,
  runSimulation,
  ConsoleSimulatorOptions,
} from "../../utils/consoleSimulator.js";
import { createNodeAudioService } from "../../utils/nodeAudioService.js";

function runDefaultGameSimulation() {
  console.log("=== Default Game Module Simulation ===");

  let gameState = createDefaultGame({
    initialLives: 3,
    obstacleCount: 5,
    itemCount: 3,
  });

  gameState = defaultGameOperations.initializeGame(gameState);

  console.log("Initial state:");
  console.log(`Player position: (${gameState.playerX}, ${gameState.playerY})`);
  console.log(`Obstacles: ${gameState.obstacles.length}`);
  console.log(`Items: ${gameState.items.length}`);
  console.log(`Lives: ${gameState.lives}`);
  console.log(`Score: ${gameState.score}`);

  const moves = [
    { up: false, down: true, left: false, right: false, action1: false },
    { up: false, down: true, left: false, right: false, action1: false },
    { up: false, down: false, left: false, right: true, action1: false },
    { up: false, down: false, left: false, right: true, action1: false },
  ];

  console.log("\n=== Testing Restart Functionality ===");

  gameState = { ...gameState, gameOverState: true, lives: 0 };
  console.log(`Game Over State: ${gameState.gameOverState}`);

  const restartInput: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action1: false,
    action2: false,
    enter: false,
    space: false,
    escape: false,
    r: true,
    period: false,
    slash: false,
  };
  if (gameState.gameOverState) {
    console.log("Restart key pressed - processing through updateBaseGame...");
    gameState = updateBaseGame(
      gameState,
      restartInput,
      defaultGameOperations as any
    ) as DefaultGameState;
    console.log(
      `After restart - Game Over: ${gameState.gameOverState}, Lives: ${gameState.lives}, Score: ${gameState.score}`
    );
  }

  for (let i = 0; i < moves.length && !gameState.gameOverState; i++) {
    const inputState: InputState = moves[i];
    gameState = updateBaseGame(
      gameState,
      inputState,
      defaultGameOperations as any
    ) as DefaultGameState;

    console.log(`\nMove ${i + 1}:`);
    console.log(
      `Player position: (${gameState.playerX}, ${gameState.playerY})`
    );
    console.log(`Items remaining: ${gameState.items.length}`);
    console.log(`Lives: ${gameState.lives}`);
    console.log(`Score: ${gameState.score}`);
    console.log(`Game Over: ${gameState.gameOverState}`);
  }

  console.log("\n=== Simulation Complete ===");
}

runDefaultGameSimulation();
let gameStateFunctional = createDefaultGame({
  audioService: createNodeAudioService(),
  initialLives: 3,
});

const gameInstanceFunctional = {
  initializeGame: () => {
    gameStateFunctional =
      defaultGameOperations.initializeGame(gameStateFunctional);
  },
  update: (inputState: any) => {
    gameStateFunctional = updateBaseGame(
      gameStateFunctional,
      inputState,
      defaultGameOperations as any
    ) as DefaultGameState;
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

console.log("Starting DefaultGame simulation using functional module...");

const optionsFunctional: ConsoleSimulatorOptions = {
  predefinedMoves: "rrrrddddllllddrrruuullll".split(""),
  totalTicks: 50,
  tickDurationMs: 200,
};

const simulatorStateFunctional = createConsoleSimulator(
  gameInstanceFunctional,
  "predefined",
  optionsFunctional
);
runSimulation(simulatorStateFunctional);
