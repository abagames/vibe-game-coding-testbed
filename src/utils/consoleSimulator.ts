import {
  GameCore, // Use GameCore type
  InputState,
  GridData, // Needed for printScreen type
  CellInfo, // Needed for printScreen type
  VIRTUAL_SCREEN_WIDTH as DEFAULT_SCREEN_WIDTH, // Assuming a default screen width for console
  VIRTUAL_SCREEN_HEIGHT as DEFAULT_SCREEN_HEIGHT, // Assuming a default screen height for console
} from "../core/coreTypes.js";

export type SimulationMode = "fixed" | "random" | "interactive" | "predefined";

export type ConsoleSimulatorOptions = {
  predefinedMoves?: string[]; // For 'predefined' mode
  fixedInput?: InputState; // For 'fixed' mode
  totalTicks?: number;
  tickDurationMs?: number;
  screenWidth?: number;
  screenHeight?: number;
};

export type ConsoleSimulatorState = {
  gameInstance: GameCore;
  mode: SimulationMode;
  tickCount: number;
  lastInput: InputState;
  predefinedMoves: string[];
  currentMoveIndex: number;
  fixedInput: InputState;
  totalTicks: number;
  tickDurationMs: number;
  screenWidth: number;
  screenHeight: number;
  simulationTimer: any;
};

export function createConsoleSimulator(
  gameInstance: GameCore,
  mode: SimulationMode = "fixed",
  options: ConsoleSimulatorOptions = {}
): ConsoleSimulatorState {
  return {
    gameInstance,
    mode,
    tickCount: 0,
    lastInput: options.fixedInput || {},
    predefinedMoves:
      options.predefinedMoves || "rrrrddddllllddrrruuullll".split(""), // Default predefined path
    currentMoveIndex: 0,
    fixedInput: options.fixedInput || {},
    totalTicks: options.totalTicks === undefined ? 150 : options.totalTicks,
    tickDurationMs:
      options.tickDurationMs === undefined ? 100 : options.tickDurationMs,
    screenWidth: options.screenWidth || DEFAULT_SCREEN_WIDTH,
    screenHeight: options.screenHeight || DEFAULT_SCREEN_HEIGHT,
    simulationTimer: null,
  };
}

function getNextInput(
  state: ConsoleSimulatorState
): [InputState, ConsoleSimulatorState] {
  const input: InputState = {};
  let newState = { ...state };

  switch (state.mode) {
    case "fixed":
      return [{ ...state.fixedInput }, newState]; // Return a copy
    case "random":
      if (Math.random() < 0.3) {
        // 30% chance to make a move
        const moves = ["up", "down", "left", "right"] as const;
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        if (randomMove === "up") input.up = true;
        else if (randomMove === "down") input.down = true;
        else if (randomMove === "left") input.left = true;
        else if (randomMove === "right") input.right = true;
      }
      break;
    case "predefined":
      if (state.currentMoveIndex < state.predefinedMoves.length) {
        const move = state.predefinedMoves[state.currentMoveIndex];
        newState = {
          ...newState,
          currentMoveIndex: state.currentMoveIndex + 1,
        };
        switch (move) {
          case "u":
            input.up = true;
            break;
          case "d":
            input.down = true;
            break;
          case "l":
            input.left = true;
            break;
          case "r":
            input.right = true;
            break;
          case "a":
            input.action1 = true;
            break; // Example action1
        }
      }
      break;
    case "interactive":
      // Placeholder: In a real interactive console, this would read from stdin.
      // For now, defaults to random as a stand-in.
      console.warn(
        "Interactive mode is not fully implemented, using random input."
      );
      if (Math.random() < 0.2) {
        const moves = ["up", "down", "left", "right"] as const;
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        if (randomMove === "up") input.up = true;
        else if (randomMove === "down") input.down = true;
        else if (randomMove === "left") input.left = true;
        else if (randomMove === "right") input.right = true;
      }
      break;
  }

  newState = { ...newState, lastInput: input };
  return [input, newState];
}

function logAndRenderState(state: ConsoleSimulatorState): void {
  const screenData = state.gameInstance.getVirtualScreenData();

  const inputDirections = [];
  if (state.lastInput.up) inputDirections.push("up");
  if (state.lastInput.down) inputDirections.push("down");
  if (state.lastInput.left) inputDirections.push("left");
  if (state.lastInput.right) inputDirections.push("right");
  if (state.lastInput.action1) inputDirections.push("action1");

  // Output debug information to console.log
  // console.log(`--- Tick: ${state.tickCount} (Mode: ${state.mode}) ---`);
  // console.log(`Input: ${inputDirections.join(", ") || "None"}`);
  // console.log(`Score: ${state.gameInstance.getScore()} | Lives: ${state.gameInstance.getLives()} | GameOver: ${state.gameInstance.isGameOver()}`);

  let output = "-".repeat(state.screenWidth + 2) + "\n"; // Top border
  for (let y = 0; y < state.screenHeight; y++) {
    output += "|"; // Left border
    for (let x = 0; x < state.screenWidth; x++) {
      const cell = screenData[y]?.[x] as CellInfo; // Ensure cell exists
      output += cell ? cell.char : " "; // Default to space if cell is somehow undefined
    }
    output += "|\n"; // Right border and newline
  }
  output += "-".repeat(state.screenWidth + 2); // Bottom border
  console.log(output);
}

export function runSimulation(state: ConsoleSimulatorState): void {
  console.log(
    `Starting console simulation for ${state.gameInstance.constructor.name} in ${state.mode} mode...`
  );
  state.gameInstance.initializeGame();
  let currentState = {
    ...state,
    tickCount: 0,
    currentMoveIndex: 0,
    simulationTimer: null,
  };

  console.log("Initial screen:");
  logAndRenderState(currentState); // Log initial state

  const simulationStep = () => {
    if (
      currentState.tickCount >= currentState.totalTicks ||
      currentState.gameInstance.isGameOver()
    ) {
      const reason = currentState.gameInstance.isGameOver()
        ? "Game Over"
        : "Total ticks reached";
      console.log(`Simulation finished: ${reason}.`);
      if (currentState.gameInstance.isGameOver()) {
        // Check for win condition based on score (example from old sim)
        const score = currentState.gameInstance.getScore();
        if (
          score >= 100 &&
          currentState.gameInstance.constructor.name === "CoreGameLogic"
        ) {
          // Example win for CoreGameLogic
          console.log(
            "Player won by collecting all items (or reaching score threshold)!"
          );
        }
      }
      logAndRenderState(currentState); // Log final state
      return;
    }

    const [currentInput, newState] = getNextInput(currentState);
    currentState = newState;
    currentState.gameInstance.update(currentInput);
    currentState = { ...currentState, tickCount: currentState.tickCount + 1 };
    logAndRenderState(currentState);

    if (currentState.tickDurationMs > 0) {
      currentState.simulationTimer = setTimeout(
        simulationStep,
        currentState.tickDurationMs
      ) as any;
    } else {
      // Synchronous execution for 0ms duration
      simulationStep();
    }
  };

  if (currentState.tickDurationMs > 0) {
    currentState.simulationTimer = setTimeout(
      simulationStep,
      currentState.tickDurationMs
    ) as any;
  } else {
    simulationStep(); // Start immediately for zero duration
  }
}

export function stopSimulation(state: ConsoleSimulatorState): void {
  if (state.simulationTimer) {
    clearTimeout(state.simulationTimer);
    console.log("Console simulation stopped by user.");
  }
}
