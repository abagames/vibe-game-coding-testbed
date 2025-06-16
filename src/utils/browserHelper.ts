import "crisp-game-lib";
import {
  InputState,
  GridData,
  CellInfo,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  BaseGameOptions,
} from "../core/coreTypes.js";
import {
  updateBaseGame,
  getVirtualScreenData,
  isGameOver,
} from "../core/baseGame.js";

export function mapCrispInputToGameInputState(): InputState {
  const code = keyboard.code;
  return {
    up: code.ArrowUp.isPressed || code.KeyW.isPressed,
    down: code.ArrowDown.isPressed || code.KeyS.isPressed,
    left: code.ArrowLeft.isPressed || code.KeyA.isPressed,
    right: code.ArrowRight.isPressed || code.KeyD.isPressed,

    action1:
      code.KeyX.isPressed || code.Slash.isPressed || code.Space.isPressed,

    action2:
      code.KeyZ.isPressed || code.Period.isPressed || code.Enter.isPressed,

    enter: code.Enter.isPressed,
    space: code.Space.isPressed,
    escape: code.Escape.isPressed,
    r: code.KeyR.isPressed,
    period: code.Period.isPressed,
    slash: code.Slash.isPressed,
  };
}

export function renderVirtualScreen(
  virtualScreenData: GridData,
  screenWidthChars: number,
  screenHeightChars: number,
  charPixelWidth: number,
  charPixelHeight: number
): void {
  for (let y = 0; y < screenHeightChars; y++) {
    for (let x = 0; x < screenWidthChars; x++) {
      const cell = virtualScreenData[y][x] as CellInfo;
      const drawX = x * charPixelWidth + charPixelWidth / 2;
      const drawY = y * charPixelHeight + charPixelHeight / 2;

      if (cell.char !== " ") {
        let cellColor = cell.attributes.color || "white";
        if (cellColor === "black") {
          cellColor = "white";
        } else if (cellColor === "white") {
          cellColor = "black";
        }
        text(cell.char, drawX, drawY, {
          color: cellColor as Color,
          backgroundColor:
            (cell.attributes.backgroundColor as Color) || "transparent",
          isSmallText: true,
        });
      }
    }
  }
}

export function createStandardCglOptions(
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT,
  charWidth: number = 4,
  charHeight: number = 6
): Options {
  return {
    viewSize: {
      x: screenWidth * charWidth,
      y: screenHeight * charHeight,
    },
    isSoundEnabled: false,
    isShowingScore: false,
    theme: "dark",
  };
}

type GameFactory = (options?: Partial<BaseGameOptions>) => {
  state: any;
  operations: any;
};

export function createStandardGameLoop(
  gameFactory: GameFactory,
  gameName?: string,
  enableHighScoreStorage?: boolean,
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT,
  charWidth: number = 4,
  charHeight: number = 6,
  enableGlobalReset: boolean = true
) {
  let gameState: any;
  let gameOperations: any;

  function reinitializeGame() {
    const gameData = gameFactory({
      isBrowserEnvironment: true,
      gameName: gameName,
      enableHighScoreStorage: enableHighScoreStorage === true,
    });
    gameState = gameData.state;
    gameOperations = gameData.operations;

    // Load high score from localStorage if enabled
    if (enableHighScoreStorage && gameName) {
      const storedHighScore = loadHighScoreFromStorage(gameName);
      if (gameState.internalHighScore !== undefined) {
        gameState.internalHighScore = Math.max(
          gameState.internalHighScore,
          storedHighScore
        );
      }
    }

    gameState = gameOperations.initializeGame(gameState);
  }

  function gameUpdate() {
    if (!gameState || !gameOperations) {
      reinitializeGame();
    }

    const gameInputState: InputState = mapCrispInputToGameInputState();
    const wasGameOver = isGameOver(gameState);

    if (
      enableGlobalReset &&
      gameInputState.r &&
      keyboard.code.KeyR.isJustPressed
    ) {
      if (isGameOver(gameState)) {
        // Check if the game has its own update logic (like GameManager)
        if (
          gameOperations.updateGame &&
          typeof gameOperations.updateGame === "function"
        ) {
          gameState = gameOperations.updateGame(gameState, gameInputState);
        } else {
          gameState = updateBaseGame(gameState, gameInputState, gameOperations);
        }
      } else {
        console.log(
          "[browserHelper] Global R pressed, reinitializing game via reinitializeGame()."
        );
        reinitializeGame();
      }
    } else {
      // Check if the game has its own update logic (like GameManager)
      if (
        gameOperations.updateGame &&
        typeof gameOperations.updateGame === "function"
      ) {
        gameState = gameOperations.updateGame(gameState, gameInputState);
      } else {
        gameState = updateBaseGame(gameState, gameInputState, gameOperations);
      }
    }

    // Save high score when game becomes over
    if (
      !wasGameOver &&
      isGameOver(gameState) &&
      enableHighScoreStorage &&
      gameName
    ) {
      if (gameState.internalHighScore !== undefined) {
        saveHighScoreToStorage(gameName, gameState.internalHighScore);
      }
    }

    const virtualScreenData = getVirtualScreenData(gameState);
    renderVirtualScreen(
      virtualScreenData,
      screenWidth,
      screenHeight,
      charWidth,
      charHeight
    );
  }

  return { gameUpdate };
}

export interface StandardGameHelperOptions {
  gameName?: string;
  enableGlobalReset?: boolean;
  enableHighScoreStorage?: boolean;
  audioQuantize?: number;
}

// High score localStorage operations
export function getHighScoreKey(gameName: string): string {
  return `abagames-vgct-${gameName}`;
}

export function loadHighScoreFromStorage(gameName: string): number {
  try {
    const key = getHighScoreKey(gameName);
    const storedScore = localStorage.getItem(key);
    if (storedScore) {
      const parsedScore = parseInt(storedScore, 10);
      if (!isNaN(parsedScore)) {
        return parsedScore;
      }
    }
  } catch (e) {
    console.error(
      `Failed to retrieve high score from localStorage for ${gameName}:`,
      e
    );
  }
  return 0;
}

export function saveHighScoreToStorage(gameName: string, score: number): void {
  try {
    const key = getHighScoreKey(gameName);
    localStorage.setItem(key, score.toString());
    console.log(`[${gameName}] High score saved to storage: ${score}`);
  } catch (e) {
    console.error(
      `Failed to save high score to localStorage for ${gameName}:`,
      e
    );
  }
}

export function initStandardTextGame(
  gameFactory: GameFactory,
  helperOptions: Partial<StandardGameHelperOptions> = {},
  cglOptions?: Partial<Options>,
  audioFiles?: { [key: string]: string }
): void {
  const defaultCglOptions = createStandardCglOptions();
  const _cglOptions = { ...defaultCglOptions, ...cglOptions };

  const { gameUpdate } = createStandardGameLoop(
    gameFactory,
    helperOptions.gameName,
    helperOptions.enableHighScoreStorage === true,
    VIRTUAL_SCREEN_WIDTH,
    VIRTUAL_SCREEN_HEIGHT,
    4,
    6,
    helperOptions.enableGlobalReset === true
  );

  init({
    update: gameUpdate,
    options: _cglOptions,
    audioFiles,
  });
  sss.setQuantize(helperOptions.audioQuantize || 8);
}

export function playSoundEffect(sound: SoundEffectType, seed?: number): void {
  play(sound, { seed });
}

export function playMml(mmlStrings: string[]): void {
  sss.playMml(mmlStrings, { isLooping: false });
}

export function startPlayingBgm(): void {
  playBgm();
}

export function stopPlayingBgm(): void {
  stopBgm();
}

export function createGameFactory<TState, TOptions extends BaseGameOptions>(
  createState: (options: TOptions) => TState,
  operations: {
    initializeGame: (state: TState) => TState;
    updateGame: (state: TState, input: InputState) => TState;
  },
  defaultAudioService?: () => any
): GameFactory {
  return (options?: Partial<BaseGameOptions>) => {
    const gameOptions = {
      ...(defaultAudioService ? { audioService: defaultAudioService() } : {}),
      ...options,
    } as TOptions;

    const state = createState(gameOptions);
    return { state, operations };
  };
}

export function createSimpleGameFactory<
  TState,
  TOptions extends BaseGameOptions
>(
  createState: (options: TOptions) => TState,
  initializeGame: (state: TState) => TState,
  updateGame: (state: TState, input: InputState) => TState,
  defaultAudioService?: () => any
): GameFactory {
  return createGameFactory(
    createState,
    { initializeGame, updateGame },
    defaultAudioService
  );
}

/**
 * Configuration object for game initialization
 * @template TState Game state type
 * @template TOptions Game options type
 */
export interface GameConfig<TState, TOptions extends BaseGameOptions> {
  /** Function to create game state */
  createState: (options: TOptions) => TState;
  /** Function to initialize the game */
  initializeGame: (state: TState) => TState;
  /** Function to update the game */
  updateGame: (state: TState, input: InputState) => TState;
  /** Default audio service (typically createBrowserAudioService) */
  defaultAudioService?: () => any;
  /** Basic game settings (name, high score storage, etc.) */
  gameSettings: Partial<StandardGameHelperOptions>;
  /** crisp-game-lib options (sound, theme, etc.) */
  cglOptions?: Partial<Options>;
  /** Audio file mappings */
  audioFiles?: { [key: string]: string };
}

/**
 * Initialize game from configuration object
 * Provides a cleaner and more type-safe alternative to the gameFactory pattern
 */
export function initGame<TState, TOptions extends BaseGameOptions>(
  config: GameConfig<TState, TOptions>
): void {
  const gameFactory = createSimpleGameFactory(
    config.createState,
    config.initializeGame,
    config.updateGame,
    config.defaultAudioService
  );

  initStandardTextGame(
    gameFactory,
    config.gameSettings,
    config.cglOptions,
    config.audioFiles
  );
}
