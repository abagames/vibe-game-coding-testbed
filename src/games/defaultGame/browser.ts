import "crisp-game-lib";
import { CoreGameLogic } from "./core.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";
import { BrowserAudioService } from "../../utils/BrowserAudioService.js";
import { BaseGameOptions } from "../../core/coreTypes.js";

initStandardTextGame(
  (options?: Partial<BaseGameOptions>) =>
    new CoreGameLogic({
      audioService: new BrowserAudioService(),
      ...options,
    })
);
