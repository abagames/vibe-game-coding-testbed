# Vibe Game Coding Testbed (VGCT)

The Vibe Game Coding Testbed (VGCT) is an experimental platform designed for the efficient and iterative transformation of initial, ambiguous "Vibes" (atmospheres, concepts) into concrete, playable text-based games. It particularly aims to explore and establish new game development processes leveraging Large Language Models (LLMs) and AI coding agents.

VGCT is built to turn abstract game ideas into playable prototypes quickly, fostering creativity within a constrained environment (a 40x25 character text-based terminal using ASCII characters).

## Key Features

- **Rapid Prototyping & Idea Validation:** Designed to get from a game idea to a playable prototype quickly, leveraging LLMs for various development tasks, allowing for rapid validation of game concepts.
- **Creativity and Minimalist Charm from Constraints:** The 40x25 text-based terminal and ASCII-only display encourage innovative game mechanics, unique visual expressions, focus on core gameplay, and stimulate player imagination.
- **Deterministic & Reproducible Development:** Core game logic is separated, ensuring identical game behavior in both simulation and browser environments for easier testing and debugging.
- **LLM-Friendly Game State Representation:** The console simulator outputs the game screen as text, making it easily parsable and understandable for LLMs, facilitating AI-driven testing, analysis, and even gameplay.
- **Focused Learning, Experimentation & Educational Value:** Provides a sandbox to try out diverse ideas, rules, and LLM prompting techniques. The clear separation of concerns and iterative process make it suitable for learning programming and game design fundamentals.
- **Independent Game Modules:** Each game is self-contained with its own logic, browser entry point, and simulator, allowing for parallel development and testing.
- **LLM-First Game Development Exploration:** Actively investigates how to best use LLMs' strengths and mitigate their weaknesses in a game development context.

## Sample Games

### Blasnake

Blasnake is an action-packed snake game built with VGCT. Control your snake to eat food ($) and grow longer. Enclose areas with your snake to destroy enemies within and score big points! Various enemy types will appear, challenging your survival. Collect enough points or grow long enough to earn extra lives. Use Arrow keys or W/A/S/D to control the snake.

Play Blasnake in your PC web browser: [Play Blasnake](https://abagames.github.io/vibe-game-coding-testbed/blasnake/)

## Quick Start

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/abagames/vibe-game-coding-testbed.git
    cd vibe-game-coding-testbed
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development Server

To run a game in the browser with live reloading (useful for testing with `crisp-game-lib`):

```bash
npm run dev
```

(Note: You'll need to configure `vite.config.ts` for each new game to use the dev server.)

### Running Game Simulations

Test your games directly in the console without a browser using dedicated simulators:

```bash
# Run the simulation for DefaultGame
npm run sim:defaultGame

# Run the simulation for Blasnake
npm run sim:blasnake
```

Each game has its own simulation script (`sim.ts`) with potentially customized test patterns and durations.

## Project Structure

```
vibe-game-coding-testbed/
├── src/
│   ├── core/
│   │   ├── BaseGame.ts         # Abstract base class for all games
│   │   └── coreTypes.ts        # Shared type definitions, constants, and interfaces
│   ├── games/
│   │   ├── defaultGame/        # Example: A self-contained game module
│   │   │   ├── core.ts         # Core game logic (extends BaseGame)
│   │   │   ├── browser.ts      # Browser environment entry point (integrates with crisp-game-lib)
│   │   │   ├── sim.ts          # Dedicated console simulator for this game
│   │   │   └── index.html      # HTML file for browser execution
│   │   └── yourGame/           # Placeholder for another game
│   │       ├── ...             # (core.ts, browser.ts, sim.ts, index.html)
│   └── utils/
│       ├── browserHelper.ts    # Helper functions for standard browser integration
│       └── consoleSimulator.ts # Framework for creating console-based game simulations
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Architecture

VGCT's architecture is designed for modularity and ease of experimentation.

### 1. Core Module (`src/core/`)

- **`BaseGame.ts`**: An abstract class that all games must extend. It provides foundational functionalities like score management, lives, game state (game over), and a virtual screen (`virtualScreenData`) for text-based rendering. It defines the core update loop (`update()`) and rendering methods (`drawText()`, `getVirtualScreenData()`).
- **`coreTypes.ts`**: Contains shared TypeScript interfaces and constants used across the testbed, such as `InputState`, `CellInfo`, `VIRTUAL_SCREEN_WIDTH`, and `VIRTUAL_SCREEN_HEIGHT`.

### 2. Game Modules (`src/games/[gameName]/`)

Each game is a self-contained module following a consistent pattern:

- **`core.ts`**: Contains the specific game logic, extending `BaseGame`. This is where you implement `initializeGame()`, `updateGame(inputState: InputState)`, and any other game-specific methods and properties.
- **`browser.ts`**: The entry point for running the game in a web browser. It typically uses `initStandardTextGame()` from `browserHelper.ts` to set up the game with `crisp-game-lib`.
- **`sim.ts`**: A Node.js script for running the game in a console-based simulation. It instantiates the game's `CoreGameLogic` and uses `ConsoleSimulator` from `utils/consoleSimulator.ts` to run automated test patterns or allow for different input modes.
- **`index.html`**: A simple HTML file to host the game for browser play, typically just loading `crisp-game-lib` and the game's `browser.ts` script.

### 3. Utility Module (`src/utils/`)

- **`browserHelper.ts`**: Provides helper functions, primarily `initStandardTextGame()`, to quickly set up a `crisp-game-lib` environment for any game developed within VGCT. This handles the game loop, input mapping, and rendering of the virtual screen.
- **`consoleSimulator.ts`**: A class that provides a framework for running game simulations in the console. It supports different input modes (predefined, random, fixed) and logs game state.

### Architectural Benefits

- **Independent Game Development:** Each game is isolated, allowing teams or individuals to work on different games without interference.
- **Code Reuse without Tight Coupling:** `BaseGame` and utility helpers provide common functionalities that games can leverage or override.
- **Rapid Prototyping:** The structured approach and helpers (especially for browser setup) mean new game ideas can be scaffolded quickly.

## Developing with LLMs/AI Agents in VGCT

VGCT is designed to facilitate a development process where LLMs and AI coding agents can be powerful assistants. Here's a suggested phased approach:

### Phase 1: Concept & "Vibe" Definition

1.  **Brainstorm:** Start with themes, keywords, or core feelings for your game.
2.  **LLM Collaboration:** Use an LLM to explore related concepts, suggest unique mechanics, or flesh out initial ideas.
3.  **Constraint-Driven Design:** Present VGCT's constraints (40x25 text grid, ASCII) to the LLM to refine the concept into something feasible within the testbed.
    - _Deliverable:_ A concept document outlining the game's premise, core mechanics, and player objectives.

### Phase 2: Core API & Structure Design

1.  **API Definition:** Define the key API signatures for your game's core logic (extending `BaseGame`) and the primary data structures it will use. This can be done by a human developer, with LLM assistance for suggestions.
2.  **Scaffolding with LLM:** Ask the LLM to generate the basic structure (class, methods stubs based on `BaseGame`) for your game's `core.ts` file.
    - _Deliverable:_ Skeleton code for your game's `core.ts` and a basic API outline.

### Phase 3: Iterative Rule Implementation & Verification

This phase involves short cycles of: Element Definition -> LLM Implementation -> Simulation/Browser Testing.

1.  **Define an Element/Rule:**
    - _Example Rule:_ "Draw a border wall around the play area using '#' characters."
    - _LLM Prompt:_ "In the `initializeGame()` method of my `core.ts` (which extends `BaseGame`), use the `drawText()` API to implement the logic for drawing this border."
2.  **Implement & Test:**
    - Integrate the LLM-generated code into `core.ts`.
    - Use the game's `sim.ts` to check `getVirtualScreenData()` output or run the game in the browser via `browser.ts` for visual confirmation.
3.  **Iterate for More Elements:**
    - _Example Rule:_ "Player character '@' moves with W,A,S,D keys. Walls '#' are impassable."
    - _LLM Prompt:_ "In the `updateGame(inputState: InputState)` method, implement logic to read `inputState`, update player coordinates, handle collisions with walls, and reflect changes on the virtual screen using `drawText()`."
    - Continue this process for items, enemies, scoring, game over conditions, etc.

### Phase 4: Browser Adapter Implementation (`browser.ts`)

1.  **Rendering:** If not using `initStandardTextGame`, you might ask an LLM to help write the rendering loop using `crisp-game-lib` that takes `game.getVirtualScreenData()` and draws it.
2.  **Input Handling:** Similarly, for custom input, ask the LLM to help map `crisp-game-lib` key inputs to the `InputState` object required by your game's `core.ts`.
    - _Note:_ `initStandardTextGame` in `browserHelper.ts` handles much of this for typical scenarios.

### Phase 5: Testing, Balancing, and Iteration

1.  **Simulation Testing:** Use the `sim.ts` environment with predefined move sequences or random inputs to test game balance and uncover bugs.
2.  **LLM for Scenarios/Balancing:** Ask LLMs to generate test scenarios or suggest parameter adjustments for game balance based on existing rules.
3.  **Refine:** Return to Phase 3 or 4 as needed to improve rules, fix bugs, or enhance features.

## Creating a New Game

1.  **Create Directory:**
    Make a new directory for your game under `src/games/`, e.g., `src/games/myNewGame/`.

2.  **Implement `core.ts`:**
    Inside `src/games/myNewGame/`, create `core.ts`. This file will contain your main game logic.

    ```typescript
    // src/games/myNewGame/core.ts
    import { BaseGame } from "../../core/BaseGame.js";
    import {
      InputState,
      // Add other necessary types from coreTypes.ts like:
      // CellAttributes, VIRTUAL_SCREEN_WIDTH, VIRTUAL_SCREEN_HEIGHT, BaseGameOptions, etc.
    } from "../../core/coreTypes.js";

    // Define an interface for your game's specific options, extending BaseGameOptions
    export interface MyNewGameOptions /* extends BaseGameOptions */ {
      // Extending BaseGameOptions is optional
      // Add game-specific options here
      // exampleOption?: number;
    }

    export class CoreGameLogic extends BaseGame {
      // Define game-specific properties here
      // private exampleProperty: number;

      constructor(options: MyNewGameOptions = {}) {
        super(options); // Pass options to BaseGame constructor

        // Initialize game-specific properties using options
        // this.exampleProperty = options.exampleOption ?? defaultValue;

        // It's good practice to call initializeGame at the end of the constructor
        // if BaseGame's constructor doesn't call it or if you need to ensure
        // all derived class properties are set before initialization.
        // BaseGame's constructor *does not* call initializeGame(), so we call it here.
        this.initializeGame();
      }

      initializeGame(): void {
        super.initializeGame(); // Important to call super to reset score, lives etc.

        // Your game's initial setup:
        // - Place player, enemies, items
        // - Draw initial static elements (like borders, if not part of a reusable method)
        this.drawText("My New Game!", 10, 5, { color: "white" });
      }

      updateGame(input: InputState): void {
        // Your game's main update logic:
        // 1. Draw static elements (if not handled by a separate method called first)
        // 2. Process player input and movement
        // 3. Update AI, enemies, game objects
        // 4. Check for collisions
        // 5. Update score, lives
        // 6. Draw dynamic elements (player, enemies) - BaseGame clears screen before this.

        if (input.action1) {
          // Handle action1 (e.g., jump, shoot)
          this.addScore(1); // Example action
        }

        // Example: Basic player movement logic (would be more complex in a real game)
        // let playerX = VIRTUAL_SCREEN_WIDTH / 2; // In reality, manage as class member variables
        // let playerY = VIRTUAL_SCREEN_HEIGHT / 2;
        // if (input.left) playerX--;
        // if (input.right) playerX++;
        // this.drawText("@", playerX, playerY, { color: "yellow" });

        // Remember to call methods like this.renderStandardUI() if needed,
        // or BaseGame might handle it.
      }

      // Add any other game-specific methods, e.g., for drawing, collision detection, etc.
      // private drawPlayer(): void { /* ... */ }
      // private checkCollisions(): void { /* ... */ }
    }
    ```

3.  **Create `browser.ts`:**
    Create `src/games/myNewGame/browser.ts` to integrate with `crisp-game-lib`.

    ```typescript
    // src/games/myNewGame/browser.ts
    import "crisp-game-lib";
    import { CoreGameLogic } from "./core.js";
    import { initStandardTextGame } from "../../utils/browserHelper.js";
    import { BaseGameOptions } from "../../core/coreTypes.js";

    initStandardTextGame(
      (options?: Partial<BaseGameOptions>) => new CoreGameLogic(options)
    );
    ```

4.  **Create `sim.ts`:**
    Create `src/games/myNewGame/sim.ts` for console simulation.

    ```typescript
    // src/games/myNewGame/sim.ts
    import { CoreGameLogic } from "./core.js";
    import { MyNewGameOptions } from "./core.js"; // Assuming you defined this in core.ts
    import { ConsoleSimulator } from "../../utils/consoleSimulator.js";
    import { NodeAudioService } from "../../utils/NodeAudioService.js"; // For simulation audio

    console.log("MyNewGame Simulator");

    // Example: Define options for your game simulation
    const gameOptions: MyNewGameOptions = {
      // initialLives: 5, // Example from BaseGameOptions
      // exampleOption: 10, // Example from MyNewGameOptions
      audioService: new NodeAudioService(), // Use NodeAudioService for console
    };

    const game = new CoreGameLogic(gameOptions);

    // Define a key press pattern for the simulation
    // 'u' = up, 'd' = down, 'l' = left, 'r' = right, '.' = wait/no action
    // '1' = action1 (X, Space, /), '2' = action2 (Z, Enter, .)
    const keyPressPattern: string[] = "r.r.d.d.l.l.u.u.1.2.".split(""); // Example pattern

    // More complex patterns can be generated programmatically:
    // const keyPressPattern: string[] = [];
    // for(let i=0; i<10; i++) keyPressPattern.push("r"); // Move right 10 times
    // for(let i=0; i<5; i++) keyPressPattern.push(".");   // Wait 5 times

    const simulator = new ConsoleSimulator(game, "predefined", {
      // Or "random", "fixed"
      totalTicks: 50, // Total number of simulation steps
      tickDurationMs: 200, // Duration of each tick in milliseconds
      predefinedMoves: keyPressPattern, // The pattern to use if mode is "predefined"
      // fixedMove: "r",      // The move to use if mode is "fixed"
    });

    simulator.run();
    ```

5.  **Create `index.html`:**
    Create `src/games/myNewGame/index.html`.

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>My New Game</title>
        <script src="../../node_modules/crisp-game-lib/bundle.js"></script>
        <meta charset="utf-8" />
      </head>
      <body>
        <script type="module" src="./browser.js"></script>
      </body>
    </html>
    ```

6.  **Add npm Script:**
    In `package.json`, add a script to run your game's simulator:

    ```json
    "scripts": {
      "sim:myNewGame": "npx tsx src/games/myNewGame/sim.ts",
      "dev:myNewGame": "vite --config vite.config.myNewGame.ts"
    },
    ```

    For the `dev` script with Vite, you'd also need a corresponding `vite.config.myNewGame.ts` file or to adjust your main `vite.config.ts` to handle multiple entry points if desired.

7.  **(Optional) Configure Vite for Development Server:**
    If using Vite, you might need a specific Vite config for your new game or adapt the existing one. For example, `vite.config.myNewGame.ts`:

    ```typescript
    // vite.config.myNewGame.ts
    import { defineConfig } from "vite";

    export default defineConfig({
      server: {
        port: 8000, // Or any other port
      },
      root: "src/games/myNewGame", // Serve from the game's directory
      build: {
        outDir: "../../../dist/myNewGame", // Adjust output directory as needed
      },
    });
    ```

## Technology Stack

- **Programming Language:** TypeScript
- **Core Game Logic:** Plain TypeScript, no external game engine dependencies for the logic itself.
- **Browser Environment:**
  - Rendering/Input, Game Loop: `crisp-game-lib` (a minimalistic library for text-based/pixel games).
- **Simulation Environment:**
  - Runtime: Node.js.
  - Input Simulation: Custom scripts within `sim.ts` files.
- **LLM/AI Coding Agents:**
  - LLMs: Anthropic Claude, Google Gemini, OpenAI GPT, or others.
  - IDE Integrations: Cursor, GitHub Copilot, or other AI-assisted coding tools.
- **Version Control:** Git, GitHub/GitLab.
- **Documentation:** Markdown.
