import "crisp-game-lib";
import {
  InputState,
  CellAttributes,
  GridData,
  CellInfo,
  GameCore,
  cglColor,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
} from "../core/coreTypes.js";

/**
 * Maps crisp-game-lib keyboard input to the game's InputState.
 */
export function mapCrispInputToGameInputState(): InputState {
  return {
    up: keyboard.code.ArrowUp.isPressed || keyboard.code.KeyW.isPressed,
    down: keyboard.code.ArrowDown.isPressed || keyboard.code.KeyS.isPressed,
    left: keyboard.code.ArrowLeft.isPressed || keyboard.code.KeyA.isPressed,
    right: keyboard.code.ArrowRight.isPressed || keyboard.code.KeyD.isPressed,
    action1:
      keyboard.code.Space.isPressed ||
      keyboard.code.Enter.isPressed ||
      keyboard.code.KeyZ.isPressed ||
      keyboard.code.KeyX.isPressed,
  };
}

/**
 * Helper to draw text on a grid using a provided drawing function.
 * @deprecated Use BaseGame.drawText() instead
 */
export function drawTextOnGrid(
  drawFunction: (
    text: string,
    x: number,
    y: number,
    attributes?: CellAttributes
  ) => void,
  screenHeight: number,
  message: string,
  startGridX: number,
  gridY: number,
  attributes: CellAttributes
): void {
  if (gridY >= 0 && gridY < screenHeight) {
    drawFunction(message, startGridX, gridY, attributes);
  }
}

/**
 * Helper to draw centered text on a grid using a provided drawing function.
 * @deprecated Use BaseGame.drawCenteredText() instead
 */
export function drawCenteredTextOnGrid(
  drawFunction: (
    text: string,
    x: number,
    y: number,
    attributes?: CellAttributes
  ) => void,
  screenWidth: number,
  screenHeight: number,
  message: string,
  gridY: number,
  attributes: CellAttributes
): void {
  const startGridX = Math.floor(screenWidth / 2 - message.length / 2);
  drawTextOnGrid(
    drawFunction,
    screenHeight,
    message,
    startGridX,
    gridY,
    attributes
  );
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
 * Renders standard UI elements (score, restart instruction, etc.)
 * @deprecated UI rendering is now handled automatically by BaseGame
 */
export function renderStandardUI(
  game: GameCore,
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT
): void {
  // This function is deprecated - BaseGame now handles UI rendering automatically
  console.warn(
    "renderStandardUI is deprecated - BaseGame handles this automatically"
  );
}

/**
 * Renders game over screen with win/lose message and restart prompt.
 * @deprecated Game over rendering is now handled automatically by BaseGame
 */
export function renderGameOverScreen(
  game: GameCore,
  winCondition: (game: GameCore) => boolean,
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT
): void {
  // This function is deprecated - BaseGame now handles game over rendering automatically
  console.warn(
    "renderGameOverScreen is deprecated - BaseGame handles this automatically"
  );
}

/**
 * Standard game loop handler that can be used by both games.
 */
export function createStandardGameLoop(
  gameFactory: () => GameCore,
  winCondition: (game: GameCore) => boolean = (game) => game.getScore() >= 100,
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT,
  charWidth: number = 4,
  charHeight: number = 6
) {
  let game: GameCore;

  function resetGame() {
    game = gameFactory();
    game.initializeGame();
  }

  function gameUpdate() {
    if (!game || keyboard.code.KeyR.isJustPressed) {
      resetGame();
    }

    const gameInputState: InputState = mapCrispInputToGameInputState();
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
 * Initializes a standard text-based game with crisp-game-lib.
 */
export function initStandardTextGame(
  gameFactory: () => GameCore,
  winCondition?: (game: GameCore) => boolean,
  customOptions?: Partial<Options>
): void {
  const defaultOptions = createStandardGameOptions();
  const cglOptions = { ...defaultOptions, ...customOptions };

  const { gameUpdate } = createStandardGameLoop(gameFactory, winCondition);

  init({
    update: gameUpdate,
    options: cglOptions,
  });
}
