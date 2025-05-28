import "crisp-game-lib";
import { CoreGameLogic } from "./core.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";

// ✅ Initialize with standard configuration
initStandardTextGame(
  () => new CoreGameLogic() // Game factory function
);
