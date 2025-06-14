import { HopwayGameManager, HopwayGameManagerOptions } from "./GameManager.js";
import {
  initStandardTextGame,
  StandardGameHelperOptions,
} from "../../utils/browserHelper.js";
import { BrowserAudioService } from "../../utils/BrowserAudioService.js";

const gameFactory = () => {
  const gameOptions: HopwayGameManagerOptions = {
    isBrowserEnvironment: true,
    enableHighScoreStorage: true,
    audioService: new BrowserAudioService(),
    gameName: "Hopway", // gameName for high score key

    maxCarSpeed: 0.25,
    minCarSpeed: 0.1,
    playerMoveInterval: 8,
    initialLives: 3,
    minCarFollowingDistance: 2.0,
  };
  return new HopwayGameManager(gameOptions);
};

const helperOptions: Partial<StandardGameHelperOptions> = {
  gameName: "Hopway", // Also ensure gameName is part of helperOptions if browserHelper uses it
  enableHighScoreStorage: true,
  enableGlobalReset: false,
};

// Initialize and start the game in the browser
initStandardTextGame(
  gameFactory,
  helperOptions,
  {
    isSoundEnabled: true,
    audioSeed: 3,
    audioTempo: 150,
    bgmVolume: 2,
  },
  {
    bgm: "Digital_Leap.mp3",
  }
);
