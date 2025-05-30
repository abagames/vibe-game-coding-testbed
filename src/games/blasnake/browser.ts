import "crisp-game-lib";
// import { CoreGameLogic } from "./core.js"; // Old import
import { GameManager } from "./GameManager.js"; // New import
import { initStandardTextGame } from "../../utils/browserHelper.js";

// 標準設定で初期化
initStandardTextGame(
  () => new GameManager(), // Instantiate GameManager instead of CoreGameLogic
  {
    isSoundEnabled: true,
    audioSeed: 1,
  }
);
