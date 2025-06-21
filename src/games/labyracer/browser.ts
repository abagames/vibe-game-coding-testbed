import "crisp-game-lib";
import { initGame } from "../../utils/browserHelper.js";
import { createBrowserAudioService } from "../../utils/browserAudioService.js";
import {
  createLabyracerManagerState,
  initializeGameManager,
  updateGameManager,
  LabyracerManagerState,
  LabyracerManagerOptions,
} from "./gameManager.js";

initGame<LabyracerManagerState, LabyracerManagerOptions>({
  createState: createLabyracerManagerState,
  initializeGame: initializeGameManager,
  updateGame: updateGameManager,
  defaultAudioService: createBrowserAudioService,
  gameSettings: {
    gameName: "labyracer",
    enableHighScoreStorage: true,
    enableGlobalReset: false,
    audioQuantize: 0,
  },
  cglOptions: {
    isSoundEnabled: true,
    audioSeed: 77,
    audioTempo: 150,
    bgmVolume: 3,
  },
  audioFiles: {
    bgm: "Pixelated_Pursuit.mp3",
  },
});
