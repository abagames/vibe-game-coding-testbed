import "crisp-game-lib";
import { HopwayGameManager, HopwayGameManagerOptions } from "./GameManager.js";
import { createBrowserAudioService } from "../../utils/browserAudioService.js";
import {
  initStandardTextGameForClass,
  StandardGameHelperOptions,
} from "../../utils/browserHelper.js";

// Factory function for HopwayGameManager
function createHopwayGame(options: any = {}) {
  const gameOptions: HopwayGameManagerOptions = {
    ...options,
    audioService: createBrowserAudioService(),
    maxCarSpeed: 0.25,
    minCarSpeed: 0.1,
    playerMoveInterval: 8,
    initialLives: 3,
    minCarFollowingDistance: 2.0,
  };

  return new HopwayGameManager(gameOptions);
}

const helperOptions: StandardGameHelperOptions = {
  enableGlobalReset: true,
  gameName: "Hopway",
  enableHighScoreStorage: true,
};

initStandardTextGameForClass(
  createHopwayGame,
  helperOptions,
  {
    isSoundEnabled: true,
    audioSeed: 3,
    audioTempo: 150,
    bgmVolume: 3,
  },
  {
    bgm: "Digital_Leap.mp3",
  }
);
