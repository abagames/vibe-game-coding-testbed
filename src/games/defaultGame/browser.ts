import "crisp-game-lib";
import { CoreGameLogic } from "./core.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";

// ✅ Define win condition (return true when player wins)
const winCondition = (game: any) => {
  // Player wins by collecting all items
  return game
    .getVirtualScreenData()
    .flat()
    .every((cell: any) => cell.attributes?.entityType !== "item");
};

// ✅ Initialize with standard configuration
initStandardTextGame(
  () => new CoreGameLogic(), // Game factory function
  winCondition // Win condition checker
);
