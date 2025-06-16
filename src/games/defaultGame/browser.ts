import "crisp-game-lib";
import { initGame } from "../../utils/browserHelper.js";
import { createBrowserAudioService } from "../../utils/browserAudioService.js";
//*
// === Simple core game version ===
import {
  createDefaultGameState,
  initializeDefaultGame,
  updateDefaultGame,
  DefaultGameState,
  DefaultGameOptions,
} from "./core.js";
/*/
// === GameManager version (with title screen) ===
import {
  createDefaultGameManagerState,
  updateGameManager,
  DefaultGameManagerState,
  DefaultGameManagerOptions,
} from "./gameManager.js";
//*/

//*
// === Simple core game version ===
initGame<DefaultGameState, DefaultGameOptions>({
  createState: createDefaultGameState,
  initializeGame: initializeDefaultGame,
  updateGame: updateDefaultGame,
  defaultAudioService: createBrowserAudioService,
  gameSettings: {
    gameName: "defaultGame",
    enableHighScoreStorage: false,
    enableGlobalReset: true,
  },
  cglOptions: {
    isSoundEnabled: true,
    audioSeed: 42,
  },
});
/*/
// === GameManager version (with title screen) ===
initGame<DefaultGameManagerState, DefaultGameManagerOptions>({
  createState: createDefaultGameManagerState,
  initializeGame: (state) => state,
  updateGame: updateGameManager,
  defaultAudioService: createBrowserAudioService,
  gameSettings: {
    gameName: "defaultGame",
    enableHighScoreStorage: false,
    enableGlobalReset: true,
  },
  cglOptions: {
    isSoundEnabled: true,
    audioSeed: 42,
  },
});
//*/
