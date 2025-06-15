import {
  CellAttributes,
  CellInfo,
  GridData,
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  GameCore,
  AudioService,
  SoundEffectType,
  BaseGameOptions,
} from "../../core/coreTypes.js";

export abstract class BaseGame implements GameCore {
  protected virtualScreen: GridData;
  protected score: number;
  protected lives: number;
  protected gameOverState: boolean;
  private readonly initialLives: number;
  protected isDemoPlay: boolean; // Demo play mode flag
  protected audioService?: AudioService; // AudioService instance variable
  public gameTickCounter: number; // Global game tick tracking

  // High score options
  protected gameName?: string;
  protected enableHighScoreStorage: boolean;
  protected isBrowserEnvironment: boolean;
  protected internalHighScore: number; // Session high score

  constructor(options: BaseGameOptions = {}) {
    const {
      initialLives = 3,
      isDemoPlay = false,
      audioService,
      gameName,
      enableHighScoreStorage = false,
      isBrowserEnvironment = false,
    } = options;
    this.initialLives = initialLives;
    this.isDemoPlay = isDemoPlay;
    this.audioService = audioService;
    this.score = 0;
    this.lives = initialLives;
    this.gameOverState = false;
    this.virtualScreen = this.initializeVirtualScreen();
    this.gameTickCounter = 0;

    // Store high score options
    this.gameName = gameName;
    this.enableHighScoreStorage = enableHighScoreStorage;
    this.isBrowserEnvironment = isBrowserEnvironment;

    // Initialize session high score to 0
    // Actual loading from storage should be handled by browserHelper
    this.internalHighScore = 0;
  }

  protected initializeVirtualScreen(): GridData {
    const screen: GridData = [];
    for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
      const row: CellInfo[] = [];
      for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
        row.push({ char: " ", attributes: {} });
      }
      screen.push(row);
    }
    return screen;
  }

  protected clearVirtualScreen(): void {
    for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
      for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
        this.virtualScreen[y][x] = { char: " ", attributes: {} };
      }
    }
  }

  public drawText(
    text: string,
    _x: number,
    _y: number,
    attributes?: CellAttributes
  ): void {
    const x = Math.floor(_x);
    const y = Math.floor(_y);
    if (y < 0 || y >= VIRTUAL_SCREEN_HEIGHT) {
      return;
    }

    for (let i = 0; i < text.length; i++) {
      const currentX = x + i;
      if (currentX < 0 || currentX >= VIRTUAL_SCREEN_WIDTH) {
        continue; // Skip characters outside the screen width
      }
      this.virtualScreen[y][currentX] = {
        char: text[i],
        attributes: { ...attributes },
      };
    }
  }

  public drawCenteredText(
    text: string,
    y: number,
    attributes?: CellAttributes
  ): void {
    const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - text.length / 2);
    this.drawText(text, startX, y, attributes);
  }

  public renderStandardUI(): void {
    // Display score
    this.drawText(`Score: ${this.score}`, 1, 0, { color: "white" });

    // Display lives
    this.drawText(`Lives: ${this.lives}`, 31, 0, { color: "white" });

    // Display restart instruction
    this.drawText("R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
      color: "light_black",
    });
  }

  public renderGameOverScreen(): void {
    const gameOverMessage = "Game Over!";
    const messageColor = "red";
    const gameOverMessageY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2;

    this.drawCenteredText(gameOverMessage, gameOverMessageY, {
      color: messageColor as any,
    });

    const finalScoreY = gameOverMessageY + 1;
    this.drawCenteredText(`Score: ${this.score}`, finalScoreY, {
      color: "white",
    });

    const highScore = this.getHighScore();
    if (highScore !== null) {
      const highScoreY = finalScoreY + 1;
      this.drawCenteredText(`High: ${highScore}`, highScoreY, {
        color: "light_cyan",
      });
    }

    const restartPromptY =
      highScore !== null
        ? Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) + 2
        : Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) + 1;
    this.drawCenteredText("Press R to restart", restartPromptY, {
      color: "white",
    });
  }

  public getCellInfo(x: number, y: number): CellInfo | null {
    if (
      x < 0 ||
      x >= VIRTUAL_SCREEN_WIDTH ||
      y < 0 ||
      y >= VIRTUAL_SCREEN_HEIGHT
    ) {
      return null;
    }
    return this.virtualScreen[y][x];
  }

  public addScore(value: number): void {
    this.score += value;
    if (this.score > this.internalHighScore) {
      this.internalHighScore = this.score; // Update session high score if current game score is higher
    }
  }

  public loseLife(): void {
    this.lives--;
    if (this.lives <= 0) {
      this.lives = 0;
      this.triggerGameOver();
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getLives(): number {
    return this.lives;
  }

  /**
   * Increases the number of lives by the specified amount.
   * Does not exceed any maximum life limit if defined by the game itself.
   * @param count The number of lives to gain, defaults to 1.
   */
  public gainLife(count: number = 1): void {
    if (count <= 0) return;
    this.lives += count;
    // Max lives logic should be handled by the specific game if needed,
    console.log(
      `BaseGame: Gained ${count} life/lives. Current lives: ${this.lives}`
    );
  }

  public isGameOver(): boolean {
    return this.gameOverState;
  }

  public getVirtualScreenData(): GridData {
    return this.virtualScreen;
  }

  protected resetGame(): void {
    this.score = 0;
    this.lives = this.initialLives;
    this.gameOverState = false;
    this.clearVirtualScreen();
    this.gameTickCounter = 0; // Reset game tick counter
    // Derived classes should call super.resetGame() if they override this
    // and then perform their own game-specific resets.
  }

  /**
   * Sets the demo play mode.
   * @param isDemo Whether the game is in demo play mode.
   */
  public setIsDemoPlay(isDemo: boolean): void {
    this.isDemoPlay = isDemo;
  }

  /**
   * Plays a sound effect if not in demo play mode.
   * @param sound The type of sound effect to play (from crisp-game-lib).
   * @param seed An optional seed for sound variation.
   */
  public play(sound: SoundEffectType, seed?: number): void {
    if (!this.isDemoPlay && this.audioService) {
      this.audioService.playSoundEffect(sound, seed);
    }
  }

  /**
   * Plays MML (Music Macro Language) if not in demo play mode.
   * @param mml The MML string or array of MML strings to play.
   */
  public playMml(mml: string | string[]): void {
    if (!this.isDemoPlay && this.audioService) {
      this.audioService.playMml(mml);
    }
  }

  /**
   * Plays background music if not in demo play mode.
   */
  public playBgm(): void {
    if (!this.isDemoPlay && this.audioService) {
      this.audioService.startPlayingBgm();
    }
  }

  /**
   * Stops the currently playing background music if not in demo play mode.
   */
  public stopBgm(): void {
    if (!this.isDemoPlay && this.audioService) {
      this.audioService.stopPlayingBgm();
    }
  }

  /**
   * Manually triggers the game over state.
   */
  public triggerGameOver(): void {
    this.gameOverState = true;
    // High score storage is now handled by browserHelper
  }

  // High score methods
  // localStorage operations moved to browserHelper.ts

  public getHighScore(): number {
    // Returns session high score
    return this.internalHighScore;
  }

  /**
   * Sets the internal high score. Used for synchronization between game instances.
   * @param highScore The high score value to set
   */
  public setHighScore(highScore: number): void {
    this.internalHighScore = Math.max(this.internalHighScore, highScore);
  }

  // Abstract methods that must be implemented by subclasses
  public abstract initializeGame(): void;
  protected abstract updateGame(inputState: InputState): void;

  // Template method that clears screen each frame before calling updateGame
  public update(inputState: InputState): void {
    this.gameTickCounter++; // Increment global game tick counter
    if (!this.isGameOver()) {
      this.clearVirtualScreen(); // Clear screen only if game is not over
      this.updateGame(inputState); // Call the game-specific update logic
    }
    // If game is over (either before this update or during updateGame), render game over screen
    if (this.isGameOver()) {
      this.clearVirtualScreen(); // Ensure screen is clear before game over screen
      this.renderGameOverScreen();
    }
    this.renderStandardUI(); // Render score, lives, etc.
  }
}
