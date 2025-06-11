import {
  GameCore, // Use GameCore interface
  InputState,
  GridData, // Needed for printScreen type
  CellInfo, // Needed for printScreen type
  VIRTUAL_SCREEN_WIDTH as DEFAULT_SCREEN_WIDTH, // Assuming a default screen width for console
  VIRTUAL_SCREEN_HEIGHT as DEFAULT_SCREEN_HEIGHT, // Assuming a default screen height for console
} from "../core/coreTypes.js";

type SimulationMode = "fixed" | "random" | "interactive" | "predefined";

export interface ConsoleSimulatorOptions {
  predefinedMoves?: string[]; // For 'predefined' mode
  fixedInput?: InputState; // For 'fixed' mode
  totalTicks?: number;
  tickDurationMs?: number;
  screenWidth?: number;
  screenHeight?: number;
}

export class ConsoleSimulator {
  private gameInstance: GameCore;
  private mode: SimulationMode;
  private tickCount: number;
  private lastInput: InputState;

  private predefinedMoves: string[];
  private currentMoveIndex: number;
  private fixedInput: InputState;

  private totalTicks: number;
  private tickDurationMs: number;
  private screenWidth: number;
  private screenHeight: number;

  private simulationTimer: NodeJS.Timeout | null = null;

  constructor(
    gameInstance: GameCore,
    mode: SimulationMode = "fixed",
    options: ConsoleSimulatorOptions = {}
  ) {
    this.gameInstance = gameInstance;
    this.mode = mode;

    this.tickCount = 0;
    this.lastInput = options.fixedInput || {};

    this.predefinedMoves =
      options.predefinedMoves || "rrrrddddllllddrrruuullll".split(""); // Default predefined path
    this.currentMoveIndex = 0;
    this.fixedInput = options.fixedInput || {};

    this.totalTicks =
      options.totalTicks === undefined ? 150 : options.totalTicks;
    this.tickDurationMs =
      options.tickDurationMs === undefined ? 100 : options.tickDurationMs;
    this.screenWidth = options.screenWidth || DEFAULT_SCREEN_WIDTH;
    this.screenHeight = options.screenHeight || DEFAULT_SCREEN_HEIGHT;
  }

  private _getNextInput(): InputState {
    const input: InputState = {};

    switch (this.mode) {
      case "fixed":
        return { ...this.fixedInput }; // Return a copy
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
        if (this.currentMoveIndex < this.predefinedMoves.length) {
          const move = this.predefinedMoves[this.currentMoveIndex];
          this.currentMoveIndex++;
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
    this.lastInput = input;
    return input;
  }

  private _logAndRenderState(): void {
    const screenData = this.gameInstance.getVirtualScreenData();

    const inputDirections = [];
    if (this.lastInput.up) inputDirections.push("up");
    if (this.lastInput.down) inputDirections.push("down");
    if (this.lastInput.left) inputDirections.push("left");
    if (this.lastInput.right) inputDirections.push("right");
    if (this.lastInput.action1) inputDirections.push("action1");

    // Output debug information to console.log
    // console.log(`--- Tick: ${this.tickCount} (Mode: ${this.mode}) ---`);
    // console.log(`Input: ${inputDirections.join(", ") || "None"}`);
    // console.log(`Score: ${this.gameInstance.getScore()} | Lives: ${this.gameInstance.getLives()} | GameOver: ${this.gameInstance.isGameOver()}`);

    let output = "-".repeat(this.screenWidth + 2) + "\n"; // Top border
    for (let y = 0; y < this.screenHeight; y++) {
      output += "|"; // Left border
      for (let x = 0; x < this.screenWidth; x++) {
        const cell = screenData[y]?.[x] as CellInfo; // Ensure cell exists
        output += cell ? cell.char : " "; // Default to space if cell is somehow undefined
      }
      output += "|\n"; // Right border and newline
    }
    output += "-".repeat(this.screenWidth + 2); // Bottom border
    console.log(output);
  }

  public run(): void {
    console.log(
      `Starting console simulation for ${this.gameInstance.constructor.name} in ${this.mode} mode...`
    );
    this.gameInstance.initializeGame();
    this.tickCount = 0;
    this.currentMoveIndex = 0;

    console.log("Initial screen:");
    this._logAndRenderState(); // Log initial state

    const simulationStep = () => {
      if (this.tickCount >= this.totalTicks || this.gameInstance.isGameOver()) {
        const reason = this.gameInstance.isGameOver()
          ? "Game Over"
          : "Total ticks reached";
        console.log(`Simulation finished: ${reason}.`);
        if (this.gameInstance.isGameOver()) {
          // Check for win condition based on score (example from old sim)
          const score = this.gameInstance.getScore();
          if (
            score >= 100 &&
            this.gameInstance.constructor.name === "CoreGameLogic"
          ) {
            // Example win for CoreGameLogic
            console.log(
              "Player won by collecting all items (or reaching score threshold)!"
            );
          }
        }
        this._logAndRenderState(); // Log final state
        return;
      }

      const currentInput = this._getNextInput();
      this.gameInstance.update(currentInput);
      this.tickCount++;
      this._logAndRenderState();

      if (this.tickDurationMs > 0) {
        this.simulationTimer = setTimeout(simulationStep, this.tickDurationMs);
      } else {
        // Synchronous execution for 0ms duration
        simulationStep();
      }
    };

    if (this.tickDurationMs > 0) {
      this.simulationTimer = setTimeout(simulationStep, this.tickDurationMs);
    } else {
      simulationStep(); // Start immediately for zero duration
    }
  }

  public stop(): void {
    if (this.simulationTimer) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
      console.log("Console simulation stopped by user.");
    }
  }
}
