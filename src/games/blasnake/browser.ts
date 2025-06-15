import "crisp-game-lib";
import { GameManager } from "./GameManager.js";
import { createBrowserAudioService } from "../../utils/browserAudioService.js";
import {
  initStandardTextGameForClass,
  StandardGameHelperOptions,
} from "../../utils/browserHelper.js";

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
