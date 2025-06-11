import { HopwayGame, HopwayGameOptions } from "./core.js";
import {
  ConsoleSimulator,
  ConsoleSimulatorOptions,
} from "../../utils/consoleSimulator.js";
import { NodeAudioService } from "../../utils/NodeAudioService.js";
// import { OilSlickEvent } from "./events/OilSlickEvent.js";
// import { RoadConstructionEvent } from "./events/RoadConstructionEvent";
// import { RushHourEvent } from "./events/RushHourEvent";
// import { WeatherEvent } from "./events/WeatherEvent.js";
// import { VIPEscortEvent } from "./events/VIPEscortEvent.js";

async function runSimulation() {
  const gameOptions: HopwayGameOptions = {
    isBrowserEnvironment: false,
    enableHighScoreStorage: false,
    audioService: new NodeAudioService(),
  };

  const game = new HopwayGame(gameOptions);
  game.initializeGame();

  const simOnlyOptions: ConsoleSimulatorOptions = {
    tickDurationMs: 50,
    totalTicks: 1000,
  };

  const simulator = new ConsoleSimulator(game, "interactive", simOnlyOptions);

  console.log("--- Hopway Game Simulation ---");
  await simulator.run();

  console.log("--- Simulation Finished ---");
  console.log("Final Score:", game.getScore());
  console.log("Game Over:", game.isGameOver());
}

runSimulation().catch((e) => console.error("Error during simulation:", e));
