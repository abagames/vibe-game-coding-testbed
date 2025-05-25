# Vibe Game Coding Testbed (VGCT)

The Vibe Game Coding Testbed (VGCT) is an experimental platform designed for the efficient and iterative transformation of initial, ambiguous "Vibes" (atmospheres, concepts) into concrete, playable text-based games. It particularly aims to explore and establish new game development processes leveraging Large Language Models (LLMs) and AI coding agents.

VGCT is built to turn abstract game ideas into playable prototypes quickly, fostering creativity within a constrained environment (a 40x25 character text-based terminal using ASCII characters).

## Key Features

- **Rapid Prototyping with LLMs/AI:** Designed to get from a game idea to a playable prototype quickly, leveraging LLMs for various development tasks.
- **Creativity through Constraints:** The 40x25 text-based terminal and ASCII-only display encourage innovative game mechanics and unique visual expressions.
- **Deterministic & Reproducible Development:** Core game logic is separated, ensuring identical game behavior in both simulation and browser environments for easier testing and debugging.
- **LLM-Friendly Game State Representation:** The console simulator outputs the game screen as text, making it easily parsable and understandable for LLMs, facilitating AI-driven testing, analysis, and even gameplay.
- **Focused Learning & Experimentation:** Provides a sandbox to try out diverse ideas, rules, and LLM prompting techniques, facilitating a cycle of evaluation and learning to discover better game development methodologies.
- **Independent Game Modules:** Each game is self-contained with its own logic, browser entry point, and simulator, allowing for parallel development and testing.

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
# Example for 'defaultGame'
npm run dev:defaultGame
```

(Note: You'll need to configure `vite.config.ts` for each new game to use the dev server.)

A more general way to serve the `index.html` of any game is to use a simple HTTP server from the root directory. `index.html` files are typically found in `src/games/[gameName]/index.html`.

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
      CellAttributes,
      VIRTUAL_SCREEN_WIDTH,
      VIRTUAL_SCREEN_HEIGHT,
    } from "../../core/coreTypes.js";

    export class CoreGameLogic extends BaseGame {
      constructor(options = {}) {
        // Add any game-specific options
        super(options);
        // Initialize game-specific properties here
      }

      initializeGame(): void {
        super.initializeGame(); // Important to call super
        // Your game's initial setup: draw initial screen, place player, etc.
        this.drawText("My New Game!", 10, 5, { color: "white" });
      }

      updateGame(input: InputState): void {
        // Your game's update logic based on input
        if (input.action1) {
          // Handle action
        }
        // Move player, update enemies, check collisions, etc.
      }

      // Add any other game-specific methods
    }
    ```

3.  **Create `browser.ts`:**
    Create `src/games/myNewGame/browser.ts` to integrate with `crisp-game-lib`.

    ```typescript
    // src/games/myNewGame/browser.ts
    import "crisp-game-lib"; // Imports crisp-game-lib globally
    import { CoreGameLogic } from "./core.js";
    import { initStandardTextGame } from "../../utils/browserHelper.js";

    // Optional: Define a win condition function for your game
    const winCondition = (game: CoreGameLogic): boolean => {
      // Example: return game.getScore() >= 100;
      return false; // Replace with actual win condition
    };

    initStandardTextGame(
      () => new CoreGameLogic(), // Factory function to create a new game instance
      winCondition // Pass your win condition, or undefined if not used by helper
    );
    ```

4.  **Create `sim.ts`:**
    Create `src/games/myNewGame/sim.ts` for console simulation.

    ```typescript
    // src/games/myNewGame/sim.ts
    import { CoreGameLogic } from "./core.js";
    import { ConsoleSimulator } from "../../utils/consoleSimulator.js";

    console.log("MyNewGame Simulator");

    const game = new CoreGameLogic();

    // Define a key press pattern for the simulation
    const keyPressPattern: string[] = "r.r.d.d.l.l.u.u.".split(""); // Example: right, wait, right, wait ...

    const simulator = new ConsoleSimulator(game, "predefined", {
      totalTicks: 50,
      tickDurationMs: 200,
      predefinedMoves: keyPressPattern,
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

    _Important:_ Update the path to `crisp-game-lib/bundle.js` if your project structure differs or if it's installed globally/differently. The path shown `../../node_modules/crisp-game-lib/bundle.js` assumes `crisp-game-lib` is in `node_modules` at the project root. A simpler way if serving from root is `<script src="/node_modules/crisp-game-lib/bundle.js"></script>`. Adjust as necessary for your setup. For VGCT, `crisp-game-lib` is often imported directly in `browser.ts` if using a bundler like Vite. The example above assumes direct script inclusion.
    A typical setup with Vite might not need the script tag for `crisp-game-lib` in `index.html` as it's handled by the import in `browser.ts`.

6.  **Add npm Script:**
    In `package.json`, add a script to run your game's simulator:

    ```json
    // package.json
    "scripts": {
      // ... other scripts
      "sim:myNewGame": "npx tsx src/games/myNewGame/sim.ts",
      "dev:myNewGame": "vite --config vite.config.myNewGame.ts" // Example for Vite
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
        outDir: "../../../../dist/myNewGame", // Adjust output directory as needed
      },
    });
    ```

## Technology Stack

- **Programming Language:** TypeScript
- **Core Game Logic:** Plain TypeScript, no external game engine dependencies for the logic itself.
- **Browser Environment:**
  - Rendering/Input: `crisp-game-lib` (a minimalistic library for text-based/pixel games).
  - Game Loop: Handled by `crisp-game-lib` or `requestAnimationFrame` via helpers.
- **Simulation Environment:**
  - Runtime: Node.js.
  - Input Simulation: Custom scripts within `sim.ts` files.
- **LLM/AI Coding Agents:**
  - APIs: OpenAI API (GPT-4, GPT-3.5-turbo, etc.), Anthropic Claude, or others.
  - IDE Integrations: GitHub Copilot, Cursor, or other AI-assisted coding tools.
- **Version Control:** Git, GitHub/GitLab.
- **Documentation:** Markdown.

## Contributing

Contributions are welcome! Whether it's improving the core framework, adding new example games, enhancing documentation, or reporting bugs, your input is valuable.

1.  **Reporting Bugs:** Please open an issue on the GitHub repository, providing as much detail as possible.
2.  **Suggesting Enhancements:** Open an issue to discuss new features or improvements.
3.  **Pull Requests:** Fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Please ensure your code adheres to the existing style and that simulations/tests pass if applicable.

## Unique Value of VGCT

- **LLM-First Game Development Exploration:** Actively investigates how to best use LLMs' strengths and mitigate their weaknesses in a game development context.
- **Minimalist Charm from Constraints:** The text-based limitation encourages focus on core game mechanics and stimulates player imagination.
- **Educational Aspect:** The clear separation of concerns (state, input, logic, rendering) and the iterative building process make it suitable for learning programming and game design fundamentals.
- **Rapid Idea Validation:** Quickly answer the question: "Does this 'Vibe' make for a viable game?" often within hours or a few days.

VGCT aims to be more than just a toolset; it's a living laboratory for discovering, sharing, and evolving game development methodologies in the age of AI.
