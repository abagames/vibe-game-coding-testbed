import {
  cglColor,
  CellAttributes,
  CellInfo,
  InputState,
  GridData,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  AudioService,
} from "../../core/coreTypes.js";
import { BaseGame } from "../../core/BaseGame.js";

const INITIAL_LIVES = 3;
const PLAYER_MOVEMENT_INTERVAL = 3; // Move once every 3 frames

interface DefaultGameOptions {
  initialLives?: number;
  movementInterval?: number;
  obstacleCount?: number;
  itemCount?: number;
  audioService?: AudioService;
}

export class CoreGameLogic extends BaseGame {
  private playerX: number;
  private playerY: number;
  private movementFrameCounter: number;
  private movementInterval: number;
  private obstacleCount: number;
  private itemCount: number;
  private obstacles: Array<{ x: number; y: number }> = [];
  private items: Array<{ x: number; y: number }> = [];

  constructor(options: DefaultGameOptions = {}) {
    const {
      initialLives = INITIAL_LIVES,
      movementInterval = PLAYER_MOVEMENT_INTERVAL,
      obstacleCount = 20,
      itemCount = 10,
      audioService,
    } = options;

    super({ initialLives, audioService });
    this.playerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    this.playerY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);
    this.movementFrameCounter = 0;
    this.movementInterval = movementInterval;
    this.obstacleCount = obstacleCount;
    this.itemCount = itemCount;
    this.initializeGame();
  }

  public initializeGame(): void {
    // Initialize game state, e.g., place player, walls, items
    this.resetGame();
    this.playerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    this.playerY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);
    this.movementFrameCounter = 0;

    // Generate obstacle positions
    this.obstacles = [];
    for (let i = 0; i < this.obstacleCount; i++) {
      const x = Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1;
      const y = Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 2)) + 1;

      // Don't place obstacles on player's starting position
      if (Math.abs(x - this.playerX) < 3 && Math.abs(y - this.playerY) < 3) {
        continue;
      }

      this.obstacles.push({ x, y });
    }

    // Generate item positions
    this.items = [];
    for (let i = 0; i < this.itemCount; i++) {
      const x = Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1;
      const y = Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 2)) + 1;

      // Don't place items on player's starting position or where there's already something
      const hasObstacle = this.obstacles.some(
        (obs) => obs.x === x && obs.y === y
      );
      if (
        (Math.abs(x - this.playerX) < 2 && Math.abs(y - this.playerY) < 2) ||
        hasObstacle
      ) {
        continue;
      }

      this.items.push({ x, y });
    }
  }

  private drawStaticElements(): void {
    // Draw border
    const wallChar = "#";
    const wallAttributes = {
      entityType: "wall",
      isPassable: false,
      color: "light_black",
    } as const;
    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      this.drawText(wallChar, x, 0, wallAttributes);
      this.drawText(wallChar, x, VIRTUAL_SCREEN_HEIGHT - 1, wallAttributes);
    }
    for (let y = 1; y < VIRTUAL_SCREEN_HEIGHT - 1; y++) {
      this.drawText(wallChar, 0, y, wallAttributes);
      this.drawText(wallChar, VIRTUAL_SCREEN_WIDTH - 1, y, wallAttributes);
    }

    // Draw obstacles
    for (const obstacle of this.obstacles) {
      this.drawText("*", obstacle.x, obstacle.y, {
        entityType: "obstacle",
        isPassable: false,
        color: "red",
      });
    }

    // Draw items
    for (const item of this.items) {
      this.drawText("$", item.x, item.y, {
        entityType: "item",
        isPassable: true,
        color: "yellow",
      });
    }
  }

  private updatePlayerPosition(): void {
    // Draw player at current position (no need to clear previous position since screen is cleared each frame)
    this.drawText("@", this.playerX, this.playerY, {
      entityType: "player",
      isPassable: true,
      color: "yellow",
    });
  }

  private isPassable(x: number, y: number): boolean {
    if (
      x < 0 ||
      x >= VIRTUAL_SCREEN_WIDTH ||
      y < 0 ||
      y >= VIRTUAL_SCREEN_HEIGHT
    ) {
      return false;
    }

    // Check for border walls
    if (
      x === 0 ||
      x === VIRTUAL_SCREEN_WIDTH - 1 ||
      y === 0 ||
      y === VIRTUAL_SCREEN_HEIGHT - 1
    ) {
      return false;
    }

    // Obstacles are now passable but will cause damage
    return true;
  }

  private checkObstacleCollision(x: number, y: number): boolean {
    return this.obstacles.some(
      (obstacle) => obstacle.x === x && obstacle.y === y
    );
  }

  private resetPlayerPosition(): void {
    // Reset player to starting position when a life is lost
    this.playerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
    this.playerY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);
  }

  private collectItem(x: number, y: number): void {
    const itemIndex = this.items.findIndex(
      (item) => item.x === x && item.y === y
    );
    if (itemIndex !== -1) {
      this.addScore(10);
      // Remove the item from the array
      this.items.splice(itemIndex, 1);
    }
  }

  public updateGame(inputState: InputState): void {
    // Game over check is now handled in BaseGame.update()

    // Redraw all static elements each frame
    this.drawStaticElements();

    this.movementFrameCounter++;

    // Process player movement
    let newX = this.playerX;
    let newY = this.playerY;

    if (this.movementFrameCounter >= this.movementInterval) {
      if (inputState.up) {
        newY--;
      } else if (inputState.down) {
        newY++;
      } else if (inputState.left) {
        newX--;
      } else if (inputState.right) {
        newX++;
      }

      // Check if the new position is valid (passable)
      if (this.isPassable(newX, newY)) {
        // Check for obstacle collision - causes life loss
        if (this.checkObstacleCollision(newX, newY)) {
          this.loseLife();
          // Don't update position if game is over
          if (!this.isGameOver()) {
            // Player position is reset in loseLife method
          }
        } else {
          // Check if there's an item to collect
          this.collectItem(newX, newY);
          // Update player position
          this.playerX = newX;
          this.playerY = newY;
        }
      }
      this.movementFrameCounter = 0; // Reset counter after processing movement
    }

    // Draw player
    this.updatePlayerPosition();

    // Check win condition (all items collected)
    if (this.items.length === 0) {
      // Player won by collecting all items
      this.addScore(100); // Bonus for winning
      this.triggerGameOver();
    }
  }

  public loseLife(): void {
    super.loseLife(); // Call parent implementation
    this.resetPlayerPosition(); // Add custom reset behavior
  }
}
