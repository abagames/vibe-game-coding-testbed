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
} from "./coreTypes.js";

export abstract class BaseGame implements GameCore {
  protected virtualScreen: GridData;
  protected score: number;
  protected lives: number;
  protected gameOverState: boolean;
  private readonly initialLives: number; // 初期ライフ数を保存
  protected isDemoPlay: boolean; // Demo play mode flag
  protected audioService?: AudioService; // Added audioService instance variable

  // High score options
  protected gameName?: string;
  protected enableHighScoreStorage: boolean;
  protected isBrowserEnvironment: boolean;
  protected internalHighScore: number = 0; // Session high score

  constructor(options: BaseGameOptions = {}) {
    const {
      initialLives = 3,
      isDemoPlay = false,
      audioService,
      gameName, // Added
      enableHighScoreStorage = false, // Added
      isBrowserEnvironment = false, // Added
    } = options;
    this.initialLives = initialLives;
    this.isDemoPlay = isDemoPlay;
    this.audioService = audioService;
    this.score = 0;
    this.lives = initialLives;
    this.gameOverState = false;
    this.virtualScreen = this.initializeVirtualScreen();

    // Store high score options
    this.gameName = gameName;
    this.enableHighScoreStorage = enableHighScoreStorage;
    this.isBrowserEnvironment = isBrowserEnvironment;

    // Load high score from localStorage at construction
    this.internalHighScore = 0; // Default
    if (this.enableHighScoreStorage && this.isBrowserEnvironment) {
      const key = this.getHighScoreKey();
      if (key) {
        try {
          const storedScore = localStorage.getItem(key);
          if (storedScore) {
            const parsedScore = parseInt(storedScore, 10);
            if (!isNaN(parsedScore)) {
              this.internalHighScore = parsedScore;
            }
          }
        } catch (e) {
          console.error(
            "Failed to retrieve high score from localStorage during init:",
            e
          );
        }
      }
    }
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
    x: number,
    y: number,
    attributes?: CellAttributes
  ): void {
    if (y < 0 || y >= VIRTUAL_SCREEN_HEIGHT) {
      console.warn(`drawText: y coordinate (${y}) out of bounds.`);
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
    // or BaseGame could have an optional maxLives constructor option.
    // For now, it just increments.
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
    this.virtualScreen = this.initializeVirtualScreen();
    // internalHighScore is NOT reset here
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
    this.commitHighScoreToStorage(); // Commit high score to storage on game over
  }

  // High score methods
  protected getHighScoreKey(): string | null {
    if (this.gameName) {
      return `abagames-vgct-${this.gameName}`;
    }
    return null;
  }

  public commitHighScoreToStorage(): void {
    if (!this.enableHighScoreStorage || !this.isBrowserEnvironment) {
      return;
    }
    const key = this.getHighScoreKey();
    if (key) {
      try {
        // internalHighScore already holds the definitive high score for the session
        localStorage.setItem(key, this.internalHighScore.toString());
        console.log(
          `[${this.gameName}] High score committed to storage: ${this.internalHighScore}`
        );
      } catch (e) {
        console.error("Failed to commit high score to localStorage:", e);
      }
    }
  }

  public getHighScore(): number {
    // No longer nullable, returns session high score
    return this.internalHighScore;
  }

  // Abstract methods that must be implemented by subclasses
  public abstract initializeGame(): void;
  protected abstract updateGame(inputState: InputState): void;

  // Template method that clears screen each frame before calling updateGame
  public update(inputState: InputState): void {
    this.clearVirtualScreen(); // Clear screen only when game is active and updating
    if (!this.gameOverState) {
      this.updateGame(inputState); // Call abstract game logic update
    } else {
      // Render game over screen if game ended this frame or is ongoing
      this.renderGameOverScreen();
    }
    this.renderStandardUI();
  }
}
