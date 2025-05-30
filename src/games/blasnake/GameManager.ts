import { BaseGame } from "../../core/BaseGame.js";
import {
  InputState,
  CellAttributes,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  cglColor,
} from "../../core/coreTypes.js";
import { CoreGameLogic } from "./core.js"; // Your existing game logic
import { BlasnakeGameOptions } from "./core.js"; // Options for CoreGameLogic
import { drawLargeText } from "../../utils/largeTextHelper.js";

export enum GameFlowState {
  TITLE,
  DEMO,
  PLAYING,
  GAME_OVER,
}

const GAME_OVER_SCREEN_DURATION = 300; // Approx 5 seconds at 60 FPS

interface EnemyShowcaseInfo {
  name: string; // Full name for reference, not displayed
  shortName: string;
  activeChar: string;
  activeColor: cglColor;
  spawningChar: string;
  spawningColor: cglColor;
  baseScore: number;
}

// Updated enemyShowcaseList based on enemy manager files and user preferences
const enemyShowcaseList: EnemyShowcaseInfo[] = [
  {
    name: "Wanderer",
    shortName: "WANDER",
    activeChar: "W",
    activeColor: "red",
    spawningChar: "o",
    spawningColor: "light_red",
    baseScore: 100,
  },
  {
    name: "Guard",
    shortName: "GUARD",
    activeChar: "G",
    activeColor: "yellow",
    spawningChar: "G",
    spawningColor: "light_red",
    baseScore: 120,
  },
  {
    name: "Chaser",
    shortName: "CHASER",
    activeChar: "C",
    activeColor: "light_cyan",
    spawningChar: "c",
    spawningColor: "cyan",
    baseScore: 220,
  },
  {
    name: "Splitter",
    shortName: "SPLIT",
    activeChar: "S",
    activeColor: "purple",
    spawningChar: "s",
    spawningColor: "light_purple",
    baseScore: 80,
  },
  {
    name: "Speedster",
    shortName: "SPEED",
    activeChar: "F",
    activeColor: "cyan",
    spawningChar: "f",
    spawningColor: "light_cyan",
    baseScore: 300,
  },
  {
    name: "Mimic",
    shortName: "MIMIC",
    activeChar: "M",
    activeColor: "light_cyan",
    spawningChar: "m",
    spawningColor: "light_black",
    baseScore: 130,
  },
  {
    name: "Wall Creeper",
    shortName: "CREEP",
    activeChar: "W",
    activeColor: "light_black",
    spawningChar: "w",
    spawningColor: "red",
    baseScore: 150,
  },
  {
    name: "Evil Snake",
    shortName: "SNAKE",
    activeChar: "S",
    activeColor: "yellow",
    spawningChar: "s",
    spawningColor: "light_yellow",
    baseScore: 330,
  },
  {
    name: "Ghost",
    shortName: "GHOST",
    activeChar: "?",
    activeColor: "light_black",
    spawningChar: ".",
    spawningColor: "light_blue",
    baseScore: 270,
  }, // User color preference for activeColor
  {
    name: "Swarm Leader",
    shortName: "SWARM",
    activeChar: "S",
    activeColor: "green",
    spawningChar: "s",
    spawningColor: "light_green",
    baseScore: 360,
  },
];

export class GameManager extends BaseGame {
  private currentFlowState: GameFlowState;
  private actualGame!: CoreGameLogic; // Definite assignment assertion, initialized in constructor or startGameImmediately
  private gameOptions: BlasnakeGameOptions;

  private lastScore: number = 0;
  private gameWon: boolean = false; // To know if game over was a win
  private highScore: number = 0; // To display high score on game over

  private gameOverTimer: number = 0;

  // Title screen animation states
  private titleAnimationTimer: number = 0; // Generic timer for phases
  private titleAnimationPhase:
    | "initial"
    | "textMoving"
    | "gridRevealing"
    | "fullyRevealed" = "initial";

  private enemyGlobalAnimTimer: number = 0; // For continuous enemy char animation

  private static readonly INTRO_DELAY_FRAMES = 120; // 2s before anything happens
  private static readonly TITLE_MOVE_DURATION_FRAMES = 60; // 1s for title to move
  private static readonly GRID_REVEAL_DELAY_FRAMES = 30; // 0.5s after title moves, before grid starts
  private static readonly ENEMY_REVEAL_INTERVAL_FRAMES = 20; // 0.33s between each enemy appearing
  private static readonly ENEMY_SPAWN_ANIM_DURATION_FRAMES = 30; // 0.5 sec for spawn char
  private static readonly ENEMY_CHAR_ANIM_HALF_CYCLE_FRAMES = 30; // Duration for one visual (active/spawn) in continuous anim

  private static readonly TITLE_TO_DEMO_DELAY_FRAMES = 300; // Approx 5 seconds at 60FPS (was 600)
  private static readonly DEMO_PLAY_DURATION_FRAMES = 900; // Approx 15 seconds at 60FPS
  private static readonly DEMO_AI_INPUT_COOLDOWN_FRAMES = 15; // AI changes direction every ~0.25s

  private titleTextCurrentY: number = 5;
  private static readonly TITLE_TEXT_START_Y = 5;
  private static readonly TITLE_TEXT_TARGET_Y = 2;

  private enemiesRevealedCount: number = 0;
  private currentEnemySpawnProgressTimer: number = 0; // Timer for the current enemy's spawn animation

  private titleToDemoTimer: number = 0;
  private demoPlayTimer: number = 0;
  private demoCurrentInput: InputState = {};
  private demoInputCooldown: number = 0;

  private static readonly ENEMY_GRID_COLS = 2;
  private static readonly ENEMY_GRID_ROWS = 5; // Should match enemyShowcaseList.length / COLS
  private static readonly ENEMY_GRID_START_X_COL1 = 4; // Adjusted for space
  private static readonly ENEMY_GRID_START_X_COL2 = 22; // Adjusted for space
  private static readonly ENEMY_GRID_START_Y = 9; // User preference
  private static readonly ENEMY_GRID_CELL_HEIGHT = 2; // User preference

  constructor(options: BlasnakeGameOptions = {}) {
    super(options); // Pass BaseGame options like initialLives if GameManager itself uses them directly
    this.gameOptions = options;

    if (options.startInPlayingState) {
      this.currentFlowState = GameFlowState.PLAYING;
      this.setIsDemoPlay(false); // Not a demo
      this.initializeCoreGame(); // Initialize game logic immediately
    } else {
      this.currentFlowState = GameFlowState.TITLE;
      this.setIsDemoPlay(false); // Title screen is not a demo initially
      this.initializeGame(); // Standard initialization for title screen
    }
  }

  public initializeGame(): void {
    // This method is called by BaseGame's constructor and resetGame.
    // We'll use it to reset to the title screen or current game state.
    // Only reset to title if not already in playing from constructor
    if (this.currentFlowState !== GameFlowState.PLAYING) {
      this.currentFlowState = GameFlowState.TITLE;
      this.resetTitleAnimationStates();
    }
  }

  private resetTitleAnimationStates(): void {
    this.titleAnimationTimer = 0;
    this.titleAnimationPhase = "initial";
    this.titleTextCurrentY = GameManager.TITLE_TEXT_START_Y;
    this.enemiesRevealedCount = 0;
    this.currentEnemySpawnProgressTimer = 0;
    this.enemyGlobalAnimTimer = 0;
    this.titleToDemoTimer = 0;
    this.demoPlayTimer = 0;
    this.demoCurrentInput = {};
    this.demoInputCooldown = 0;
  }

  // Override clearVirtualScreen to prevent clearing during GAME_OVER state
  protected clearVirtualScreen(): void {
    if (this.currentFlowState !== GameFlowState.GAME_OVER) {
      super.clearVirtualScreen();
    }
    // If currentFlowState is GAME_OVER, do nothing, preserving the screen.
  }

  private initializeCoreGame(): void {
    if (!this.actualGame || this.actualGame.isGameOver()) {
      // Re-initialize if not present or previous game ended
      this.actualGame = new CoreGameLogic(this.gameOptions, this);
    }
    this.actualGame.initializeGame();
    // Carry over high score if actualGame tracks it and GameManager wants to maintain it across sessions
    if (this.actualGame.getHighScore) {
      // Check if method exists
      this.highScore = Math.max(this.highScore, this.actualGame.getHighScore());
    }
  }

  // Method for sim.ts to access CoreGameLogic instance for debug setup
  public getCoreGameLogic(): CoreGameLogic {
    if (!this.actualGame) {
      // This case should ideally be handled by ensuring startGameImmediately or transition to PLAYING has occurred.
      console.warn("Accessing CoreGameLogic before it is initialized!");
      this.initializeCoreGame(); // Initialize if accessed early, though flow might be unexpected
    }
    return this.actualGame;
  }

  protected updateGame(inputState: InputState): void {
    // Note: clearVirtualScreen is now conditionally called based on currentFlowState
    // So, when GAME_OVER, the screen from the last PLAYING frame remains.

    switch (this.currentFlowState) {
      case GameFlowState.TITLE:
        this.updateTitleScreen(inputState);
        this.drawTitleScreen();
        break;
      case GameFlowState.DEMO:
        this.updateDemoScreen(inputState);
        this.drawDemoScreen();
        break;
      case GameFlowState.PLAYING:
        if (!this.actualGame) {
          // Should be initialized by now
          this.initializeCoreGame();
        }
        this.actualGame.update(inputState);
        if (this.actualGame.isGameOver()) {
          // CoreGameLogic needs isGameOver()
          this.lastScore = this.actualGame.getScore(); // CoreGameLogic needs getScore()
          this.gameWon = this.actualGame.isGameWon(); // CoreGameLogic needs isGameWon()
          if (this.actualGame.getHighScore) {
            // Check if method exists
            this.highScore = Math.max(
              this.highScore,
              this.actualGame.getHighScore()
            );
          }
          this.currentFlowState = GameFlowState.GAME_OVER;
          this.gameOverTimer = GAME_OVER_SCREEN_DURATION; // Start the timer
        }
        break;
      case GameFlowState.GAME_OVER:
        // The screen is not cleared here due to the override.
        // We just update logic and redraw overlays.
        this.updateGameOverScreen(inputState);
        this.drawGameOverScreen(); // This will draw on top of the frozen game screen
        break;
    }

    // Note: BaseGame.update also calls this.renderStandardUI() after this.updateGame().
    // We might want to prevent renderStandardUI in TITLE or DEMO states if it's not desired.
    // For now, we'll let it draw. It shows "R: Restart"
  }

  // --- TITLE SCREEN ---
  private updateTitleScreen(inputState: InputState): void {
    if (this.gameOptions.startInPlayingState) {
      this.currentFlowState = GameFlowState.PLAYING;
      this.setIsDemoPlay(false);
      if (!this.actualGame) this.initializeCoreGame();
      return;
    }

    if (inputState.action1 || inputState.action2) {
      this.startGameFromTitleOrDemo();
      return;
    }

    this.titleAnimationTimer++;

    if (this.titleAnimationPhase === "fullyRevealed") {
      this.titleToDemoTimer++;
      if (this.titleToDemoTimer > GameManager.TITLE_TO_DEMO_DELAY_FRAMES) {
        this.initializeCoreGame();
        this.currentFlowState = GameFlowState.DEMO;
        this.setIsDemoPlay(true); // Entering demo mode
        this.demoPlayTimer = 0;
        this.demoCurrentInput = { right: true }; // Start demo moving right
        this.demoInputCooldown = GameManager.DEMO_AI_INPUT_COOLDOWN_FRAMES;
        // titleToDemoTimer will be reset by resetTitleAnimationStates when returning to TITLE
        return;
      }
    } else {
      // Reset demo countdown if title animation isn't finished or has been interrupted
      this.titleToDemoTimer = 0;
    }

    if (
      this.titleAnimationPhase === "gridRevealing" ||
      this.titleAnimationPhase === "fullyRevealed"
    ) {
      this.enemyGlobalAnimTimer++; // Increment for continuous animation
    }

    if (
      this.titleAnimationPhase === "gridRevealing" &&
      this.enemiesRevealedCount > 0 &&
      this.enemiesRevealedCount <= enemyShowcaseList.length
    ) {
      if (
        this.currentEnemySpawnProgressTimer <
        GameManager.ENEMY_SPAWN_ANIM_DURATION_FRAMES
      ) {
        this.currentEnemySpawnProgressTimer++;
      }
    }

    switch (this.titleAnimationPhase) {
      case "initial":
        if (this.titleAnimationTimer > GameManager.INTRO_DELAY_FRAMES) {
          this.titleAnimationPhase = "textMoving";
          this.titleAnimationTimer = 0; // Reset timer for next phase
        }
        break;

      case "textMoving":
        const progress = Math.min(
          1,
          this.titleAnimationTimer / GameManager.TITLE_MOVE_DURATION_FRAMES
        );
        this.titleTextCurrentY =
          GameManager.TITLE_TEXT_START_Y -
          (GameManager.TITLE_TEXT_START_Y - GameManager.TITLE_TEXT_TARGET_Y) *
            progress;
        if (progress >= 1) {
          this.titleAnimationPhase = "gridRevealing";
          this.titleAnimationTimer = 0; // Reset timer for next phase
          this.enemiesRevealedCount = 0; // Start revealing enemies
        }
        break;

      case "gridRevealing":
        if (this.titleAnimationTimer < GameManager.GRID_REVEAL_DELAY_FRAMES) {
          // Initial delay before first enemy shows
          break;
        }

        const effectiveRevealTimer =
          this.titleAnimationTimer - GameManager.GRID_REVEAL_DELAY_FRAMES;
        // Calculate how many enemies *should* be revealed based on time passed since grid reveal started
        // Add 1 because we want to reveal the first enemy at effectiveRevealTimer = 0 (or close to it)
        const potentialEnemiesToReveal =
          Math.floor(
            effectiveRevealTimer / GameManager.ENEMY_REVEAL_INTERVAL_FRAMES
          ) + 1;

        if (
          this.enemiesRevealedCount < potentialEnemiesToReveal &&
          this.enemiesRevealedCount < enemyShowcaseList.length
        ) {
          const newlyRevealedThisFrame =
            Math.min(potentialEnemiesToReveal, enemyShowcaseList.length) -
            this.enemiesRevealedCount;
          this.enemiesRevealedCount = Math.min(
            potentialEnemiesToReveal,
            enemyShowcaseList.length
          );
          if (newlyRevealedThisFrame > 0) {
            this.currentEnemySpawnProgressTimer = 0; // Reset spawn anim timer for the *first* of the newly revealed group/enemy
          }
        }

        // Check if all enemies are revealed AND the last one's spawn animation is complete
        if (
          this.enemiesRevealedCount >= enemyShowcaseList.length &&
          this.currentEnemySpawnProgressTimer >=
            GameManager.ENEMY_SPAWN_ANIM_DURATION_FRAMES
        ) {
          this.titleAnimationPhase = "fullyRevealed";
        }
        break;

      case "fullyRevealed":
        // Static state, everything is shown. Player can start game.
        break;
    }
  }

  private drawTitleScreen(): void {
    drawLargeText(
      this,
      "BLASNAKE",
      Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - (8 * 4) / 2),
      Math.floor(this.titleTextCurrentY),
      "#",
      { color: "green" }
    );

    // Display Last Score and High Score
    const lastScoreText = `${this.lastScore}`;
    this.drawText(lastScoreText, 1, 0, { color: "white" });
    const highScoreText = `HI: ${this.highScore}`;
    this.drawText(
      highScoreText,
      VIRTUAL_SCREEN_WIDTH - highScoreText.length - 1,
      0,
      { color: "yellow" }
    );

    if (
      this.titleAnimationPhase === "gridRevealing" ||
      this.titleAnimationPhase === "fullyRevealed"
    ) {
      for (let i = 0; i < this.enemiesRevealedCount; i++) {
        const enemy = enemyShowcaseList[i];
        const row = Math.floor(i / GameManager.ENEMY_GRID_COLS);
        const col = i % GameManager.ENEMY_GRID_COLS;

        const baseX =
          col === 0
            ? GameManager.ENEMY_GRID_START_X_COL1
            : GameManager.ENEMY_GRID_START_X_COL2;
        const baseY =
          GameManager.ENEMY_GRID_START_Y +
          row * GameManager.ENEMY_GRID_CELL_HEIGHT;

        let charToDisplay = enemy.activeChar;
        let charColorToDisplay = enemy.activeColor;
        let nameColor = enemy.activeColor;
        const scoreColor: cglColor = "white";

        const isInitialSpawning =
          i === this.enemiesRevealedCount - 1 &&
          this.titleAnimationPhase === "gridRevealing" &&
          this.currentEnemySpawnProgressTimer <
            GameManager.ENEMY_SPAWN_ANIM_DURATION_FRAMES;

        if (isInitialSpawning) {
          charToDisplay = enemy.spawningChar;
          charColorToDisplay = enemy.spawningColor;
        } else {
          const halfCycle = GameManager.ENEMY_CHAR_ANIM_HALF_CYCLE_FRAMES;
          const phase = Math.floor(this.enemyGlobalAnimTimer / halfCycle) % 2;
          if (phase === 1) {
            charToDisplay = enemy.spawningChar;
            charColorToDisplay = enemy.spawningColor;
          } else {
            charToDisplay = enemy.activeChar;
            charColorToDisplay = enemy.activeColor;
          }
        }

        nameColor = enemy.activeColor;
        this.drawText(charToDisplay, baseX, baseY, {
          color: charColorToDisplay,
        });

        const nameDisplay = ` ${enemy.shortName}`;
        this.drawText(nameDisplay, baseX + 1, baseY, { color: nameColor });

        const scoreDisplay = `${enemy.baseScore} pts`;
        this.drawText(scoreDisplay, baseX + 9, baseY, {
          color: scoreColor,
        });
      }
    }

    const promptYPosition =
      this.titleAnimationPhase === "initial" ||
      this.titleAnimationPhase === "textMoving"
        ? 15
        : VIRTUAL_SCREEN_HEIGHT - 4; // Adjusted for more space with 2x5 grid at Y=9

    const startText = "Z/X/Space Key to Start";
    const startTextX = Math.floor(
      VIRTUAL_SCREEN_WIDTH / 2 - startText.length / 2
    );
    this.drawText(startText, startTextX, promptYPosition, { color: "yellow" });
  }

  // --- DEMO SCREEN ---
  private updateDemoScreen(inputState: InputState): void {
    if (inputState.action1 || inputState.action2) {
      this.startGameFromTitleOrDemo();
      return;
    }

    if (this.gameOptions.startInPlayingState) {
      this.currentFlowState = GameFlowState.PLAYING;
      this.setIsDemoPlay(false);
      if (!this.actualGame) this.initializeCoreGame();
      return;
    }

    if (inputState.escape) {
      this.currentFlowState = GameFlowState.TITLE;
      this.setIsDemoPlay(false); // Exiting demo mode
      this.resetTitleAnimationStates();
      return;
    }

    if (!this.actualGame) {
      this.initializeCoreGame();
      // Ensure actualGame is ready for demo
      // this.actualGame.initializeGame(); // Explicitly ensure it's reset if needed - initializeCoreGame already does this.
      this.demoCurrentInput = { right: true };
      this.demoInputCooldown = GameManager.DEMO_AI_INPUT_COOLDOWN_FRAMES;
    }

    this.demoPlayTimer++;

    // Simple AI: Change direction randomly at intervals, try to avoid immediate obstacles
    this.demoInputCooldown--;
    if (this.demoInputCooldown <= 0) {
      this.demoInputCooldown = GameManager.DEMO_AI_INPUT_COOLDOWN_FRAMES;
      const head = this.actualGame.getSnakeHeadPosition();
      let currentDirectionString: "UP" | "DOWN" | "LEFT" | "RIGHT" = "RIGHT"; // Default/fallback

      if (this.demoCurrentInput.up) currentDirectionString = "UP";
      else if (this.demoCurrentInput.down) currentDirectionString = "DOWN";
      else if (this.demoCurrentInput.left) currentDirectionString = "LEFT";
      else if (this.demoCurrentInput.right) currentDirectionString = "RIGHT";

      if (head) {
        const possibleMoves: {
          direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
          x: number;
          y: number;
          safe: boolean;
        }[] = [
          { direction: "UP", x: head.x, y: head.y - 1, safe: false },
          { direction: "DOWN", x: head.x, y: head.y + 1, safe: false },
          { direction: "LEFT", x: head.x - 1, y: head.y, safe: false },
          { direction: "RIGHT", x: head.x + 1, y: head.y, safe: false },
        ];

        possibleMoves.forEach((move) => {
          move.safe = this.actualGame.isCellSafeForMovement(move.x, move.y);
        });

        const safeMoves = possibleMoves.filter((move) => move.safe);

        let chosenDirectionString: "UP" | "DOWN" | "LEFT" | "RIGHT" | null =
          null;

        if (safeMoves.length > 0) {
          // Prefer to continue in the current direction if it's safe
          const currentMoveIsSafe = safeMoves.find(
            (m) => m.direction === currentDirectionString
          );
          if (currentMoveIsSafe && Math.random() < 0.7) {
            // 70% chance to continue
            chosenDirectionString = currentDirectionString;
          } else {
            // Otherwise, pick a random safe move
            chosenDirectionString =
              safeMoves[Math.floor(Math.random() * safeMoves.length)].direction;
          }
        } else {
          // No safe moves, pick the current direction (will lead to game over)
          chosenDirectionString = currentDirectionString;
        }

        const newDemoInput: InputState = {};
        if (chosenDirectionString === "UP") newDemoInput.up = true;
        else if (chosenDirectionString === "DOWN") newDemoInput.down = true;
        else if (chosenDirectionString === "LEFT") newDemoInput.left = true;
        else if (chosenDirectionString === "RIGHT") newDemoInput.right = true;
        this.demoCurrentInput = newDemoInput;
      } else {
        // Fallback if head is somehow null (should not happen in normal demo flow)
        const directions: Array<"UP" | "DOWN" | "LEFT" | "RIGHT"> = [
          "UP",
          "DOWN",
          "LEFT",
          "RIGHT",
        ];
        const randomDirectionString =
          directions[Math.floor(Math.random() * directions.length)];
        const newDemoInput: InputState = {};
        if (randomDirectionString === "UP") newDemoInput.up = true;
        else if (randomDirectionString === "DOWN") newDemoInput.down = true;
        else if (randomDirectionString === "LEFT") newDemoInput.left = true;
        else if (randomDirectionString === "RIGHT") newDemoInput.right = true;
        this.demoCurrentInput = newDemoInput;
      }
    }

    this.actualGame.update(this.demoCurrentInput);

    if (
      this.actualGame.isGameOver() ||
      this.demoPlayTimer > GameManager.DEMO_PLAY_DURATION_FRAMES
    ) {
      // Do not update lastScore or highScore from demo play
      // this.lastScore = this.actualGame.getScore();
      // this.gameWon = this.actualGame.isGameWon();
      // if (this.actualGame.getHighScore) {
      //   this.highScore = Math.max(
      //     this.highScore,
      //     this.actualGame.getHighScore()
      //   );
      // }
      this.currentFlowState = GameFlowState.TITLE;
      this.setIsDemoPlay(false); // Exiting demo mode
      this.resetTitleAnimationStates();
    }
  }

  private drawDemoScreen(): void {
    // actualGame.update() handles its own drawing.
    // We just draw overlays for demo mode.
    if (this.actualGame) {
      // CoreGameLogic's update would have handled its drawing.
      // BaseGame's clearVirtualScreen behavior depends on the current state.
      // Ensure screen is clear for demo, or that actualGame redraws everything.
      // The main loop calls clearVirtualScreen, then this.updateGame (which calls updateDemoScreen),
      // then actualGame.update() (which draws game elements), then drawDemoScreen (for overlays).
    }

    // Display Last Score and High Score
    const lastScoreText = `${this.lastScore}`;
    this.drawText(lastScoreText, 1, 0, { color: "white" });
    const highScoreText = `HI: ${this.highScore}`;
    this.drawText(
      highScoreText,
      VIRTUAL_SCREEN_WIDTH - highScoreText.length - 1,
      0,
      { color: "yellow" }
    );

    // Display "GAME OVER" in the center, similar to the actual game over screen
    this.drawCenteredText(
      "GAME OVER",
      Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2,
      { color: "red" }
    );

    // The game itself (actualGame) is drawn as part of its update cycle.
    // No need to call specific draw methods for actualGame here if its update handles drawing.
  }

  // --- GAME START LOGIC ---
  private startGameFromTitleOrDemo(): void {
    this.setIsDemoPlay(false); // Moved before playMml
    const gameStartMml = [
      // Part 1: Melody - All note durations halved
      "@synth@s1 v70 l32 o5 g16 e16 c16 e16 g8 >c8 <g16 e16 c16 e16 g8 >d8",

      // Part 2: Harmony/Counter-Melody - All note durations halved
      "@synth@s2 v50 l32 o4 e16 c16 <g16> c16 e8 g8 e16 c16 <g16> c16 e8 >f+8",

      // Part 3: Bass Line - All note durations halved
      "@synth@s3 v60 l16 o3 c c g g c c >c <c",
    ];
    this.playMml(gameStartMml);
    this.initializeCoreGame();
    this.currentFlowState = GameFlowState.PLAYING;
    this.resetTitleAnimationStates(); // Reset title/demo related timers
  }

  // --- GAME OVER SCREEN ---
  private updateGameOverScreen(inputState: InputState): void {
    if (inputState.action1 || inputState.action2) {
      this.startGameFromTitleOrDemo(); // Call the centralized game start method
      // this.initializeCoreGame(); // Now handled by startGameFromTitleOrDemo
      // this.currentFlowState = GameFlowState.PLAYING; // Now handled by startGameFromTitleOrDemo
      // this.setIsDemoPlay(false); // Now handled by startGameFromTitleOrDemo
      return;
    }

    this.gameOverTimer--;
    if (this.gameOverTimer <= 0) {
      if (!this.gameOptions.startInPlayingState) {
        this.currentFlowState = GameFlowState.TITLE;
        this.setIsDemoPlay(false); // Going to title, not a demo
        this.resetTitleAnimationStates();
      }
      // In simulation mode with startInPlayingState,
      // do not transition back to TITLE from GAME_OVER automatically.
      // The simulation will either end by maxTicks or handle restart via input if programmed.
    }
  }

  private drawGameOverScreen(): void {
    const gameOverMessage = this.gameWon ? "YOU WIN!" : "GAME OVER";
    this.drawCenteredText(gameOverMessage, 7, {
      color: this.gameWon ? "yellow" : "red",
    });

    const scoreText = `Score: ${this.lastScore}`;
    this.drawCenteredText(scoreText, 10, { color: "white" });

    const highScoreText = `Hi-Score: ${this.highScore}`;
    this.drawCenteredText(highScoreText, 12, { color: "yellow" });

    this.drawCenteredText("Z/X/Space Key to Restart", 16, { color: "cyan" });
  }

  // Override renderStandardUI to prevent it from drawing during Title/Demo
  public renderStandardUI(): void {
    if (this.currentFlowState === GameFlowState.GAME_OVER) {
      super.drawText("R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
        color: "light_black",
      });
    }
    // For PLAYING: Assume CoreGameLogic draws its own HUD (score, lives) during its update.
    // For TITLE: Custom UI is drawn by drawTitleScreen.
    // For DEMO: Custom UI is drawn by drawDemoScreen (overlays), CoreGameLogic draws game.
    // Thus, we don't call super.renderStandardUI() for PLAYING, TITLE, or DEMO
    // unless BaseGame's default UI is specifically desired for those states.
  }
}
