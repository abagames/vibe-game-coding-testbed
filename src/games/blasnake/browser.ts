import "crisp-game-lib";
import { GameManager } from "./GameManager.js";
import { createBrowserAudioService } from "../../utils/browserAudioService.js";
import {
  createStandardCglOptions,
  StandardGameHelperOptions,
  loadHighScoreFromStorage,
  saveHighScoreToStorage,
  mapCrispInputToGameInputState,
  renderVirtualScreen,
} from "../../utils/browserHelper.js";
import {
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  BaseGameOptions,
  InputState,
} from "../../core/coreTypes.js";

// Factory function for GameManager
function createBlasnakeGame(options: any = {}) {
  return new GameManager({
    ...options,
    audioService: createBrowserAudioService(),
  });
}

const helperOptions: StandardGameHelperOptions = {
  enableGlobalReset: true,
  gameName: "blasnake",
  enableHighScoreStorage: true,
};

initStandardTextGameForClass(
  createBlasnakeGame,
  helperOptions,
  {
    isSoundEnabled: true,
    audioSeed: 1,
    audioTempo: 156,
    bgmVolume: 6,
  },
  {
    bgm: "Pixelated_Rush.mp3",
  }
);

type ClassGameFactory = (options?: Partial<BaseGameOptions>) => any;

function initStandardTextGameForClass(
  gameFactory: ClassGameFactory,
  helperOptions: Partial<StandardGameHelperOptions> = {},
  cglOptions?: Partial<Options>,
  audioFiles?: { [key: string]: string }
): void {
  const defaultOptions = createStandardCglOptions();
  const _cglOptions = { ...defaultOptions, ...cglOptions };

  const { gameUpdate, reinitializeGame } = createStandardGameLoopForClass(
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
  sss.setQuantize(0);
}

function createStandardGameLoopForClass(
  gameFactory: ClassGameFactory,
  gameName?: string,
  enableHighScoreStorage?: boolean,
  screenWidth: number = VIRTUAL_SCREEN_WIDTH,
  screenHeight: number = VIRTUAL_SCREEN_HEIGHT,
  charWidth: number = 4,
  charHeight: number = 6,
  enableGlobalReset: boolean = true
) {
  let game: any;

  function reinitializeGame() {
    const gameOptions = {
      isBrowserEnvironment: true,
      gameName: gameName,
      enableHighScoreStorage: enableHighScoreStorage === true,
    };
    game = gameFactory(gameOptions);

    // Load high score from localStorage if enabled
    if (
      enableHighScoreStorage &&
      gameName &&
      game.internalHighScore !== undefined
    ) {
      const storedHighScore = loadHighScoreFromStorage(gameName);
      game.internalHighScore = Math.max(
        game.internalHighScore,
        storedHighScore
      );
    }
  }

  function gameUpdate() {
    if (!game) {
      reinitializeGame();
    }

    const gameInputState: InputState = mapCrispInputToGameInputState();
    const wasGameOver = game.isGameOver ? game.isGameOver() : false;

    if (
      enableGlobalReset &&
      gameInputState.r &&
      keyboard.code.KeyR.isJustPressed
    ) {
      if (wasGameOver) {
        game.update(gameInputState);
      } else {
        console.log(
          "[browserHelper] Global R pressed, reinitializing game via reinitializeGame()."
        );
        reinitializeGame();
      }
    } else {
      game.update(gameInputState);
    }

    // Save high score when game becomes over
    const isGameOverNow = game.isGameOver ? game.isGameOver() : false;
    if (!wasGameOver && isGameOverNow && enableHighScoreStorage && gameName) {
      if (game.internalHighScore !== undefined) {
        saveHighScoreToStorage(gameName, game.internalHighScore);
      }
    }

    const virtualScreenData = game.getVirtualScreenData();
    renderVirtualScreen(
      virtualScreenData,
      screenWidth,
      screenHeight,
      charWidth,
      charHeight
    );
  }

  return { gameUpdate, reinitializeGame };
}
