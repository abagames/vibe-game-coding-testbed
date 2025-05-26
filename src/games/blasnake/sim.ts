import { CoreGameLogic } from "./core.js";
import { InputState } from "../../core/coreTypes.js";
// import { Position } from "./enemies/types.js"; // No enemies needed for this test

const game = new CoreGameLogic({
  initialLives: 1,
  movementInterval: 1, // Make snake move every tick for sim
});

console.log(
  "🎮 Starting Blasnake simulation (Long snake with guideline intersection)..."
);

const enemySystem = (game as any).enemySystem;
enemySystem.clearAllEnemies();
enemySystem.updateSpawnSettings({
  minEnemyCount: 0, // No enemies for this test
  spawnInterval: 1000000,
  fastSpawnInterval: 1000000,
});

(game as any).food = { x: 5, y: 5 }; // Food out of the way

// Create a long horizontal snake that will have guideline intersecting its body
const snakeStartX = 15;
const snakeStartY = 10;
const initialSnakeLength = 20; // Much longer snake
(game as any).snake = [];

// Create horizontal snake moving RIGHT
for (let i = 0; i < initialSnakeLength; i++) {
  (game as any).snake.push({ x: snakeStartX - i, y: snakeStartY });
}

(game as any).direction = 3; // Start RIGHT
(game as any).nextDirection = 3; // Start RIGHT

const maxTicks = 50;
let tick = 0;

// Input sequence to create guideline intersection with snake body
const inputs: Array<Partial<InputState>> = [
  // Snake starts horizontal: Head at (15,10), body extends left to (-4,10)
  // Move right a few steps to get away from negative coordinates
  { right: true }, // H(16,10), tail at (-3,10)
  { right: true }, // H(17,10), tail at (-2,10)
  { right: true }, // H(18,10), tail at (-1,10)
  { right: true }, // H(19,10), tail at (0,10)
  { right: true }, // H(20,10), tail at (1,10)

  // Now snake is: Head(20,10), body from (19,10) to (1,10)
  // Turn DOWN and move longer to create a bigger vertical segment
  { down: true }, // H(20,11), guideline will show DOWN from (20,11)
  { down: true }, // H(20,12), guideline continues DOWN
  { down: true }, // H(20,13), guideline continues DOWN
  { down: true }, // H(20,14), continue DOWN longer
  { down: true }, // H(20,15), continue DOWN longer
  { down: true }, // H(20,16), continue DOWN longer

  // Turn LEFT - but shorter movement this time
  { left: true }, // H(19,16), guideline goes LEFT from here
  { left: true }, // H(18,16), guideline goes LEFT
  { left: true }, // H(17,16), guideline goes LEFT

  // Turn UP to create the enclosure
  { up: true }, // H(17,15), guideline goes UP from here
  { up: true }, // H(17,14), guideline goes UP
  { up: true }, // H(17,13), guideline goes UP
  { up: true }, // H(17,12), guideline goes UP
  { up: true }, // H(17,11), guideline goes UP
  { up: true }, // H(17,10), this should intersect with the original horizontal body!

  // Continue UP to see if enclosure is detected
  { up: true }, // H(17,9), continue UP

  // Hold to observe the area formation
  ...Array(15).fill({}),
];

let inputIndex = 0;

while (tick < maxTicks && !game.isGameOver()) {
  let currentInput: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    action1: false,
    ...(inputs[inputIndex] || {}),
  };

  game.update(currentInput);

  console.log(`--- Tick ${tick} ---`);
  const snakeHead = (game as any).snake[0];
  if (snakeHead) {
    const headPos = `(${snakeHead.x},${snakeHead.y})`;
    const segments = (game as any).snake
      .map((seg: any) => `(${seg.x},${seg.y})`)
      .slice(0, 8) // Show first 8 segments to avoid too much output
      .join(" ");
    console.log(
      `Snake Head: ${headPos}, Dir: ${(game as any).direction}, Length: ${
        (game as any).snake.length
      }`
    );
    console.log(`Snake Segments (first 8): [${segments}...]`);

    // Log guideline info
    const guidelines = (game as any).guideLines;
    if (guidelines && guidelines.length > 0) {
      const guidelineStr = guidelines
        .map((g: any) => `(${g.x},${g.y})`)
        .join(" ");
      console.log(`Guidelines: [${guidelineStr}]`);
    } else {
      console.log(`Guidelines: []`);
    }
  }

  // Display current game state screen for key ticks
  if (tick >= 10 && tick <= 30) {
    // Expanded range to include explosion ticks and more
    console.log("=== CURRENT SCREEN STATE ===");
    const screenData = game.getVirtualScreenData();
    for (let y = 0; y < screenData.length; y++) {
      let line = "|";
      for (let x = 0; x < screenData[y].length; x++) {
        line += screenData[y][x].char;
      }
      line += "|";
      console.log(line);
    }
    console.log("=== END SCREEN STATE ===");
  }

  console.log("------------------------------------------");

  if (inputIndex < inputs.length - 1) {
    inputIndex++;
  }

  tick++;
}

console.log("🏁 Simulation finished.");
console.log("Final Score:", game.getScore(), "Lives:", game.getLives());

// Display final game state
const screenData = game.getVirtualScreenData();
for (let y = 0; y < screenData.length; y++) {
  let line = "|";
  for (let x = 0; x < screenData[y].length; x++) {
    line += screenData[y][x].char;
  }
  line += "|";
  console.log(line);
}
