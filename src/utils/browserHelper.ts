import "crisp-game-lib";
import {
  InputState,
  GridData,
  CellInfo,
  GameCore,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  BaseGameOptions,
} from "../core/coreTypes.js";
import { BaseGame } from "../core/BaseGame.js";

/**
 * Maps crisp-game-lib keyboard input to the game's InputState.
 */
export function mapCrispInputToGameInputState(): InputState {
  const code = keyboard.code;
  return {
    up: code.ArrowUp.isPressed || code.KeyW.isPressed,
    down: code.ArrowDown.isPressed || code.KeyS.isPressed,
    left: code.ArrowLeft.isPressed || code.KeyA.isPressed,
    right: code.ArrowRight.isPressed || code.KeyD.isPressed,

    // X, Slash, Space
    action1:
      code.KeyX.isPressed || code.Slash.isPressed || code.Space.isPressed,

    // Z, Period, Enter
    action2:
      code.KeyZ.isPressed || code.Period.isPressed || code.Enter.isPressed,

    // Individual key states, can be useful for other specific bindings
    enter: code.Enter.isPressed,
    space: code.Space.isPressed,
    escape: code.Escape.isPressed, // Assuming Escape key for escape functionality
    r: code.KeyR.isPressed, // Assuming R key for restart
    period: code.Period.isPressed,
    slash: code.Slash.isPressed,
    // Note: KeyZ and KeyX are already part of action1/action2
  };
}

/**
 * Renders the entire virtual screen data to the browser canvas using crisp-game-lib.
 */
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
        // Black and white are inverted in dark theme
        if (cellColor === "black") {
          cellColor = "white";
        } else if (cellColor === "white") {
          cellColor = "black";
        }
        text(cell.char, drawX, drawY, {
          color: cellColor as Color,
          isSmallText: true,
        });
      }
    }
  }
}

/**
 * Creates standard crisp-game-lib options for text-based games.
 */
export function createStandardGameOptions(
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

/**
 * Standard game loop handler that can be used by both games.
 */
export function createStandardGameLoop(
  gameFactory: (options?: Partial<BaseGameOptions>) => GameCore,
  gameName?: string,
  enableHighScoreStorage?: boolean,
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT,
  charWidth: number = 4,
  charHeight: number = 6,
  enableGlobalReset: boolean = true
) {
  let game: GameCore;

  function resetGame() {
    game = gameFactory({
      isBrowserEnvironment: true,
      gameName: gameName,
      enableHighScoreStorage: enableHighScoreStorage === true,
    });
    game.initializeGame();
  }

  function gameUpdate() {
    if (!game) {
      // Initialize game on first update if not already
      resetGame();
    }

    const gameInputState: InputState = mapCrispInputToGameInputState();

    // Handle global R for reset if no specific game state handles it
    // This is closer to how BaseGame handled it.
    if (
      enableGlobalReset &&
      gameInputState.r &&
      keyboard.code.KeyR.isJustPressed
    ) {
      if (
        game instanceof BaseGame &&
        (game as any).currentFlowState !== undefined
      ) {
        const gm = game as any; // GameManager specific logic
        if (
          gm.currentFlowState !== 3 /* GAME_OVER */ &&
          gm.currentFlowState !== 2 /* PLAYING */
        ) {
          console.log(
            "[browserHelper] Global R pressed, resetting game via resetGame()."
          );
          resetGame();
        }
        // If in PLAYING or GAME_OVER, let the GameManager handle 'r' via its update method.
      } else {
        // If not a GameManager or state is unknown, default to reset.
        console.log(
          "[browserHelper] Global R pressed (non-GameManager or unknown state), resetting game via resetGame()."
        );
        resetGame();
      }
    }

    game.update(gameInputState);

    const virtualScreenData = game.getVirtualScreenData();
    renderVirtualScreen(
      virtualScreenData,
      screenWidth,
      screenHeight,
      charWidth,
      charHeight
    );
  }

  return { gameUpdate, resetGame };
}

/**
 * Options for the standard text game helper.
 */
export interface StandardGameHelperOptions {
  enableGlobalReset?: boolean;
  gameName?: string;
  enableHighScoreStorage?: boolean;
}

/**
 * Initializes a standard text-based game with crisp-game-lib.
 */
export function initStandardTextGame(
  gameFactory: (options?: Partial<BaseGameOptions>) => GameCore,
  helperOptions: Partial<StandardGameHelperOptions> = {},
  cglOptions?: Partial<Options>,
  audioFiles?: { [key: string]: string }
): void {
  const defaultOptions = createStandardGameOptions();
  const _cglOptions = { ...defaultOptions, ...cglOptions };

  const { gameUpdate } = createStandardGameLoop(
    gameFactory,
    helperOptions.gameName,
    helperOptions.enableHighScoreStorage === true,
    VIRTUAL_SCREEN_WIDTH,
    VIRTUAL_SCREEN_HEIGHT,
    4,
    6,
    helperOptions.enableGlobalReset !== false
  );

  init({
    update: gameUpdate,
    options: _cglOptions,
    audioFiles,
  });
}

/**
 * Plays a sound effect using crisp-game-lib.
 * @param sound The type of sound effect to play.
 */
export function playSoundEffect(sound: SoundEffectType, seed?: number): void {
  play(sound, { seed });
}

/**
 * Plays a MML (Music Macro Language) string using crisp-game-lib.
 * @param mml The MML string to play.
 */
export function playMml(mmlStrings: string[]): void {
  sss.playMml(mmlStrings, { isLooping: false });
}

/**
 * Plays a background music (BGM) using crisp-game-lib.
 * The BGM must be defined in the `audioFiles` option during `init`.
 */
export function startPlayingBgm(): void {
  playBgm();
}

/**
 * Stops the currently playing background music (BGM) using crisp-game-lib.
 */
export function stopPlayingBgm(): void {
  stopBgm();
}
