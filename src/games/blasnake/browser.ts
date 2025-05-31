import "crisp-game-lib";
import { GameManager } from "./GameManager.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";
import { BrowserAudioService } from "../../utils/BrowserAudioService.js"; // Import BrowserAudioService

// 標準設定で初期化
initStandardTextGame(
  () => new GameManager({ audioService: new BrowserAudioService() }),
  { enableGlobalReset: false },
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
