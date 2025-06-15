import "crisp-game-lib";
import { initStandardTextGame } from "../../utils/browserHelper.js";
import { createBrowserAudioService } from "../../utils/browserAudioService.js";
import { BaseGameOptions } from "../../core/coreTypes.js";
//*
// === Simple core game version ===
import { createDefaultGame, defaultGameOperations } from "./core.js";
/*/
// === GameManager version (with title screen) ===
import {
  createDefaultGameManager,
  defaultGameManagerOperations,
  DefaultGameManagerOptions,
} from "./gameManager.js";
//*/

initStandardTextGame(
  (options?: Partial<BaseGameOptions>) => {
    //*
    // === Simple core game version ===
    const state = createDefaultGame({
      audioService: createBrowserAudioService(),
      ...options,
    });
    return {
      state,
      operations: defaultGameOperations,
    };
    /*/
    // === GameManager version ===
    const managerOptions: DefaultGameManagerOptions = {
      audioService: createBrowserAudioService(),
      isBrowserEnvironment: true,
      ...options,
    };
    const state = createDefaultGameManager(managerOptions);
    return {
      state,
      operations: defaultGameManagerOperations,
    };
    //*/
  },
  {
    gameName: "defaultGame",
    enableHighScoreStorage: false,
    enableGlobalReset: true,
  },
  {
    isSoundEnabled: true,
    audioSeed: 42,
  }
);
