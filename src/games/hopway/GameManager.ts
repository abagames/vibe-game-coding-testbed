import { BaseGame } from "../../core/BaseGame.js";
import {
  InputState,
  GridData,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
} from "../../core/coreTypes.js";
import { HopwayGame, HopwayGameOptions } from "./core.js";
import { drawLargeText } from "../../utils/largeTextHelper.js";

export enum GameFlowState {
  TITLE,
  PLAYING,
  GAME_OVER,
}

const GAME_OVER_SCREEN_DURATION = 300;

export interface HopwayGameManagerOptions extends HopwayGameOptions {
  startInPlayingState?: boolean;
}

export class HopwayGameManager extends BaseGame {
  private currentFlowState: GameFlowState;
  private actualGame!: HopwayGame;
  private gameOptions: HopwayGameManagerOptions;
  private lastScore: number = 0;
  private gameOverTimer: number = 0;

  // Title screen animation states
  private titleAnimationTimer: number = 0;
  private blinkTimer: number = 0;
  private showStartMessage: boolean = true;

  private static readonly TITLE_TO_DEMO_DELAY_FRAMES = 300; // 5 seconds
  private static readonly DEMO_PLAY_DURATION_FRAMES = 900; // 15 seconds
  private static readonly BLINK_INTERVAL_FRAMES = 30; // 0.5 seconds

  private titleToDemoTimer: number = 0;
  private demoPlayTimer: number = 0;

  constructor(options: HopwayGameManagerOptions = {}) {
    super({
      ...options,
      gameName: "Hopway",
      enableHighScoreStorage: true,
    });
    this.gameOptions = options;

    if (options.startInPlayingState) {
      this.currentFlowState = GameFlowState.PLAYING;
      this.setIsDemoPlay(false);
      this.initializeCoreGame();
    } else {
      this.currentFlowState = GameFlowState.TITLE;
      this.setIsDemoPlay(false);
      this.initializeGame();
    }
  }

  public initializeGame(): void {
    if (this.currentFlowState !== GameFlowState.PLAYING) {
      this.currentFlowState = GameFlowState.TITLE;
      this.resetTitleAnimationStates();
    }
  }

  private resetTitleAnimationStates(): void {
    this.titleAnimationTimer = 0;
    this.blinkTimer = 0;
    this.showStartMessage = true;
    this.titleToDemoTimer = 0;
    this.demoPlayTimer = 0;
  }

  private initializeCoreGame(): void {
    this.actualGame = new HopwayGame({
      ...this.gameOptions,
      // Force reduced car density for title screen demo
      carDensity:
        this.currentFlowState === GameFlowState.TITLE
          ? 0.3
          : this.gameOptions.carDensity,
    });

    // Set demo play mode for the actual game
    this.actualGame.setIsDemoPlay(this.isDemoPlay);
    this.actualGame.initializeGame();
  }

  protected updateGame(inputState: InputState): void {
    // This method is called by BaseGame.update()
    // We handle the game flow logic here instead of overriding update()
    switch (this.currentFlowState) {
      case GameFlowState.TITLE:
        this.updateTitleScreen(inputState);
        break;
      case GameFlowState.PLAYING:
        if (!this.actualGame) {
          this.initializeCoreGame();
        }
        this.actualGame.update(inputState);
        if (this.actualGame.isGameOver()) {
          this.lastScore = this.actualGame.getScore();
          this.currentFlowState = GameFlowState.GAME_OVER;
          this.gameOverTimer = GAME_OVER_SCREEN_DURATION;
          this.stopBgm();
        }
        break;
      case GameFlowState.GAME_OVER:
        this.updateGameOverScreen(inputState);
        break;
    }
  }

  public override renderStandardUI(): void {
    // Handle drawing based on current flow state
    switch (this.currentFlowState) {
      case GameFlowState.TITLE:
        this.drawTitleScreen();
        break;
      case GameFlowState.PLAYING:
        // Let the actual game handle its own UI rendering
        if (this.actualGame) {
          this.actualGame.renderStandardUI();
        }
        break;
      case GameFlowState.GAME_OVER:
        this.drawGameOverScreen();
        break;
    }
  }

  public override getVirtualScreenData(): GridData {
    // Return the actual game's screen data when playing
    if (this.currentFlowState === GameFlowState.PLAYING && this.actualGame) {
      return this.actualGame.getVirtualScreenData();
    }
    // Otherwise return our own screen data (for title/game over screens)
    return super.getVirtualScreenData();
  }

  private updateTitleScreen(inputState: InputState): void {
    if (
      inputState.action1 ||
      inputState.action2 ||
      inputState.space ||
      inputState.enter
    ) {
      this.startGameFromTitleOrDemo();
      return;
    }

    this.titleAnimationTimer++;
    this.blinkTimer++;

    // Handle blinking start message
    if (this.blinkTimer >= HopwayGameManager.BLINK_INTERVAL_FRAMES) {
      this.showStartMessage = !this.showStartMessage;
      this.blinkTimer = 0;
    }

    // Initialize demo game if not already running
    if (!this.actualGame) {
      this.setIsDemoPlay(true);
      this.initializeCoreGame();
      this.demoPlayTimer = 0;
    }

    // Update demo gameplay in background
    if (this.actualGame) {
      this.demoPlayTimer++;

      // Simple demo input - just move up occasionally
      const demoInput: InputState = {
        up: this.demoPlayTimer % 180 === 0, // Move up every 3 seconds
        down: false,
        left: false,
        right: false,
        action1: false,
        r: false,
      };

      this.actualGame.update(demoInput);

      // Don't reset demo when game over - let it continue running
      // This provides a continuous demo experience
    }
  }

  private updateGameOverScreen(inputState: InputState): void {
    // Check for restart input (multiple keys for better accessibility)
    if (
      inputState.action1 ||
      inputState.action2 ||
      inputState.space ||
      inputState.enter ||
      inputState.up ||
      inputState.down ||
      inputState.left ||
      inputState.right
    ) {
      this.startGameFromTitleOrDemo();
      return;
    }

    this.gameOverTimer--;
    if (this.gameOverTimer <= 0) {
      // Return to title screen after timeout
      this.currentFlowState = GameFlowState.TITLE;
      this.resetTitleAnimationStates();
      this.resetGame();
      // Create new demo game for title screen
      this.setIsDemoPlay(true);
      this.initializeCoreGame();
      this.demoPlayTimer = 0;
    }
  }

  private startGameFromTitleOrDemo(): void {
    this.currentFlowState = GameFlowState.PLAYING;
    this.setIsDemoPlay(false);
    this.initializeCoreGame();
    this.playBgm();
  }

  private drawTitleScreen(): void {
    // First, draw the demo game background if available
    if (this.actualGame) {
      // Get the demo game's screen data and copy it to our screen
      const demoScreenData = this.actualGame.getVirtualScreenData();
      for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
        for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
          const cell = demoScreenData[y][x];
          if (cell && cell.char && cell.char !== " ") {
            this.drawText(cell.char, x, y, cell.attributes);
          }
        }
      }
    }

    // Overlay title elements on top of demo
    // Draw large "HOPWAY" title
    const titleText = "Hopway";
    const titleWidth = titleText.length * 4; // 4 characters per large letter
    const titleX = Math.floor((VIRTUAL_SCREEN_WIDTH - titleWidth) / 2);
    const titleY = 2; // Moved higher to leave more space for demo

    drawLargeText(this, titleText, titleX, titleY, "#", { color: "cyan" });

    // Display Last Score and High Score
    const lastScoreText = `${this.lastScore}`;
    this.drawText(lastScoreText, 1, 0, { color: "white" });
    const highScoreText = `HI ${this.getHighScore()}`;
    this.drawText(
      highScoreText,
      VIRTUAL_SCREEN_WIDTH - highScoreText.length - 1,
      0,
      { color: "yellow" }
    );

    // Blinking start message at bottom
    if (this.showStartMessage) {
      const startText = "Press Space/Z/X to Start";
      const startTextX = Math.floor(
        (VIRTUAL_SCREEN_WIDTH - startText.length) / 2
      );
      this.drawText(startText, startTextX, VIRTUAL_SCREEN_HEIGHT - 3, {
        color: "yellow",
      });
    }
  }

  private drawGameOverScreen(): void {
    const gameOverMessage = "GAME OVER";
    this.drawCenteredText(gameOverMessage, 7, { color: "red" });

    const scoreText = `Score: ${this.lastScore}`;
    this.drawCenteredText(scoreText, 10, { color: "white" });

    const highScoreDisplayText = `Hi-Score: ${this.getHighScore()}`;
    this.drawCenteredText(highScoreDisplayText, 12, { color: "yellow" });

    this.drawCenteredText("Press Space/Z/X to Start", 16, { color: "cyan" });
  }

  // Expose methods for external access
  public getCoreGame(): HopwayGame | undefined {
    return this.actualGame;
  }

  public getEventManager() {
    return this.actualGame?.getEventManager();
  }

  public getGameTickCounter(): number {
    return this.actualGame?.getGameTickCounter() || 0;
  }

  public override isGameOver(): boolean {
    return this.currentFlowState === GameFlowState.GAME_OVER;
  }

  public override getScore(): number {
    return this.actualGame ? this.actualGame.getScore() : this.lastScore;
  }

  public override getLives(): number {
    return this.actualGame ? this.actualGame.getLives() : 3;
  }

  public override update(inputState: InputState): void {
    this.gameTickCounter++; // Increment global game tick counter

    // Always clear screen and call updateGame for flow state management
    this.clearVirtualScreen();
    this.updateGame(inputState);

    // Render UI based on current flow state
    this.renderStandardUI();
  }

  protected override resetGame(): void {
    super.resetGame(); // Call BaseGame's resetGame first

    // Reset GameManager-specific state
    this.gameOverTimer = 0;
    this.titleAnimationTimer = 0;
    this.blinkTimer = 0;
    this.showStartMessage = true;
    this.titleToDemoTimer = 0;
    this.demoPlayTimer = 0;

    // Don't reset currentFlowState here as it's managed by flow transitions
  }
}
