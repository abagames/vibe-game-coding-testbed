import "crisp-game-lib";
import { CoreGameLogic } from "./core.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";

// 標準設定で初期化
initStandardTextGame(
  () => new CoreGameLogic() // ゲームファクトリ関数
);
