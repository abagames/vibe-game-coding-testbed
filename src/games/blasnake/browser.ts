import "crisp-game-lib";
import { GameManager } from "./GameManager.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";
import { BrowserAudioService } from "../../utils/BrowserAudioService.js"; // Import BrowserAudioService
import { BaseGameOptions } from "../../core/coreTypes.js"; // Import BaseGameOptions

// 標準設定で初期化
initStandardTextGame(
  (options?: Partial<BaseGameOptions>) =>
    new GameManager({
      audioService: new BrowserAudioService(),
      ...options, // Spread the options from browserHelper
    }),
  {
    gameName: "blasnake", // Provide the game name
    enableHighScoreStorage: true, // Enable high score storage
    enableGlobalReset: false, // Keep existing setting
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
