import "crisp-game-lib";
import { CoreGameLogic } from "./core.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";
import { BrowserAudioService } from "../../utils/BrowserAudioService.js";

// ✅ Initialize with standard configuration
initStandardTextGame(
  () => new CoreGameLogic({ audioService: new BrowserAudioService() }) // Pass BrowserAudioService instance
);
