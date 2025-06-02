import "crisp-game-lib";
import { GameManager } from "./GameManager.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";
import { BrowserAudioService } from "../../utils/BrowserAudioService.js";
import { BaseGameOptions } from "../../core/coreTypes.js";

initStandardTextGame(
  (options?: Partial<BaseGameOptions>) =>
    new GameManager({
      audioService: new BrowserAudioService(),
      ...options,
    }),
  {
    gameName: "blasnake",
    enableHighScoreStorage: true,
    enableGlobalReset: false,
  },
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
