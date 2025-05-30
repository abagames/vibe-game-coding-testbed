import {
  CellAttributes,
  CellInfo,
  GridData,
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  GameCore,
} from "./coreTypes.js";
import {
  playSoundEffect,
  playMml as playMmlFromHelper,
} from "../utils/browserHelper.js"; // Import playSoundEffect and playMml

// ベースゲーム設定オプション
interface BaseGameOptions {
  initialLives?: number;
  gameSpeed?: number; // ゲーム速度設定を追加
  isDemoPlay?: boolean; // Demo play mode
}

export abstract class BaseGame implements GameCore {
  protected virtualScreen: GridData;
  protected score: number;
  protected lives: number;
  protected gameOverState: boolean;
  protected wonGame: boolean;
  private readonly initialLives: number; // 初期ライフ数を保存
  protected isDemoPlay: boolean; // Demo play mode flag

  // gameSpeed制御機能
  protected gameSpeed: number; // ゲーム速度倍率
  protected gameSpeedAccumulator: number; // 時間蓄積値
  private readonly initialGameSpeed: number; // 初期速度を保存

  constructor(options: BaseGameOptions = {}) {
    const { initialLives = 3, gameSpeed = 1.0, isDemoPlay = false } = options; // Destructure isDemoPlay
    this.initialLives = initialLives; // 初期値を保存
    this.initialGameSpeed = gameSpeed; // 初期速度を保存
    this.isDemoPlay = isDemoPlay; // Set demo play mode
    this.score = 0;
    this.lives = initialLives;
    this.gameOverState = false;
    this.wonGame = false;
    this.gameSpeed = gameSpeed;
    this.gameSpeedAccumulator = 0.0;
    this.virtualScreen = this.initializeVirtualScreen();
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
    //this.drawText(`Score: ${this.score}`, 1, 0, { color: "white" });

    // Display lives if more than 1 life system
    //this.drawText(`Lives: ${this.lives}`, 31, 0, { color: "white" });

    // Display restart instruction
    this.drawText("R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
      color: "light_black",
    });
  }

  public renderGameOverScreen(wonGame: boolean = false): void {
    const gameOverMessage = wonGame ? "You Win!" : "Game Over!";
    const gameOverMessageY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 1;

    this.drawCenteredText(gameOverMessage, gameOverMessageY, {
      color: wonGame ? "green" : "red",
    });

    const restartPromptY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) + 1;
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
  }

  public loseLife(): void {
    this.lives--;
    if (this.lives <= 0) {
      this.lives = 0;
      this.gameOverState = true;
    }
  }

  public getScore(): number {
    return this.score;
  }

  public getLives(): number {
    return this.lives;
  }

  public isGameOver(): boolean {
    return this.gameOverState;
  }

  public getVirtualScreenData(): GridData {
    return this.virtualScreen;
  }

  public winGame(): void {
    this.wonGame = true;
    this.gameOverState = true;
  }

  public isGameWon(): boolean {
    return this.wonGame;
  }

  protected resetGame(): void {
    this.score = 0;
    this.lives = this.initialLives; // 保存された初期値を使用
    this.gameOverState = false;
    this.wonGame = false;
    this.gameSpeed = this.initialGameSpeed; // 初期速度に戻す
    this.gameSpeedAccumulator = 0.0; // 蓄積値をリセット
    this.virtualScreen = this.initializeVirtualScreen();
  }

  // gameSpeed制御API
  public setGameSpeed(speed: number): void {
    this.gameSpeed = Math.max(0.1, Math.min(3.0, speed)); // 範囲制限
  }

  public getGameSpeed(): number {
    return this.gameSpeed;
  }

  public adjustGameSpeed(delta: number): void {
    this.setGameSpeed(this.gameSpeed + delta);
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
  public playSound(sound: SoundEffectType, seed?: number): void {
    if (!this.isDemoPlay) {
      playSoundEffect(sound, seed);
    }
  }

  /**
   * Plays MML (Music Macro Language) if not in demo play mode.
   * @param mml The MML string or array of MML strings to play.
   */
  public playMml(mml: string | string[]): void {
    if (!this.isDemoPlay) {
      if (typeof mml === "string") {
        playMmlFromHelper([mml]);
      } else {
        playMmlFromHelper(mml);
      }
    }
  }

  // Abstract methods that must be implemented by subclasses
  public abstract initializeGame(): void;
  protected abstract updateGame(inputState: InputState): void;

  // Template method that clears screen each frame before calling updateGame
  public update(inputState: InputState): void {
    if (this.gameOverState) {
      return;
    }

    // gameSpeed制御: 時間を蓄積し、1.0以上になったらゲームロジック実行
    this.gameSpeedAccumulator += this.gameSpeed;

    while (this.gameSpeedAccumulator >= 1.0) {
      this.clearVirtualScreen();
      this.updateGame(inputState);
      this.gameSpeedAccumulator -= 1.0;
    }

    // UI要素は毎フレーム描画（視覚的滑らかさのため）
    this.renderStandardUI();

    // Render game over screen if game ended this frame
    if (this.gameOverState) {
      this.renderGameOverScreen(this.wonGame);
    }
  }
}
