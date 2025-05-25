import "crisp-game-lib";
import { CoreGameLogic } from "./core.js";
import { initStandardTextGame } from "../../utils/browserHelper.js";

// スネークゲームに勝利条件はないので、常にfalseを返す
const winCondition = (game: any) => {
  // スネークゲームは基本的にエンドレスなので勝利条件なし
  return false;
};

// 標準設定で初期化
initStandardTextGame(
  () => new CoreGameLogic(), // ゲームファクトリ関数
  winCondition // 勝利条件チェッカー
);
