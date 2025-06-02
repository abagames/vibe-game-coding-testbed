import { CoreGameLogic } from "./core.js";
import { ConsoleSimulator } from "../../utils/consoleSimulator.js";
import { NodeAudioService } from "../../utils/NodeAudioService.js";

const totalTicks = 200; // Set longer for DefaultGame
const tickDurationMs = 100;

console.log("DefaultGame Simulator");
console.log(
  "Test Pattern: Wait 10 ticks -> Right 30 ticks -> Left 30 ticks -> Up 30 ticks -> Down 30 ticks -> Random for remaining"
);

const game = new CoreGameLogic({
  initialLives: 5, // Custom lives
  movementInterval: 2, // Faster movement
  obstacleCount: 15, // Fewer obstacles
  itemCount: 5, // Fewer items
  audioService: new NodeAudioService(), // Pass NodeAudioService instance
});

const keyPressPattern: string[] = [];

// Initial 10 ticks: Wait
for (let i = 0; i < 10; i++) {
  keyPressPattern.push(".");
}

// 30 ticks: Right movement
for (let i = 0; i < 30; i++) {
  keyPressPattern.push("r");
}

// 30 ticks: Left movement
for (let i = 0; i < 30; i++) {
  keyPressPattern.push("l");
}

// 30 ticks: Up movement
for (let i = 0; i < 30; i++) {
  keyPressPattern.push("u");
}

// 30 ticks: Down movement
for (let i = 0; i < 30; i++) {
  keyPressPattern.push("d");
}

// Remaining ticks: Random exploration
const moves = ["u", "d", "l", "r"];
for (let i = keyPressPattern.length; i < totalTicks; i++) {
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  keyPressPattern.push(randomMove);
}

const simulator = new ConsoleSimulator(game, "predefined", {
  totalTicks: totalTicks,
  tickDurationMs: tickDurationMs,
  predefinedMoves: keyPressPattern,
});

simulator.run();
