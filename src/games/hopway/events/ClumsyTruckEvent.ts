import { HopwayGame } from "../core";
import { Car } from "../CarManager";
import { GameEvent } from "./GameEvent";
import {
  InputState,
  cglColor,
  VIRTUAL_SCREEN_WIDTH,
} from "../../../core/coreTypes";

const TRUCK_CHAR = "T";
const TRUCK_COLOR: cglColor = "yellow";
const DEBRIS_CHAR = "O";
const DEBRIS_COLOR: cglColor = "light_black";
const DEBRIS_DROP_PROBABILITY = 0.05; // 5% chance per update tick
const TRUCK_SPEED_MULTIPLIER = 0.8; // Slightly slower than normal cars
const POST_TRUCK_DURATION_TICKS = 150; // How long debris lasts after truck is gone

export class ClumsyTruckEvent implements GameEvent {
  public readonly id: string;
  public readonly type: string = "CLUMSY_TRUCK";
  public isActive: boolean = false;
  public durationTicks: number = Infinity; // Event runs until the truck is off-screen
  public elapsedTicks: number = 0;

  private truckId: number | null = null;
  private truckHasDespawned: boolean = false;
  private postDespawnElapsedTicks: number = 0;

  constructor() {
    this.id = `event-${this.type}-${Date.now()}`;
  }

  public start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;
    this.truckHasDespawned = false;
    this.postDespawnElapsedTicks = 0;

    const carManager = game.getCarManager();
    const lanes = carManager.getLaneDefinitions();
    if (lanes.length === 0) {
      this.end(game);
      return;
    }

    const targetLane = lanes[Math.floor(Math.random() * lanes.length)];
    const speed = carManager.getMaxCarSpeed() * TRUCK_SPEED_MULTIPLIER;

    const truck = game.spawnCarInLane(targetLane.y, targetLane.direction, {
      char: TRUCK_CHAR,
      colorOverride: TRUCK_COLOR,
      speed: speed,
      isClumsy: true, // Custom flag
    });

    if (truck) {
      this.truckId = truck.id;
      game.play("hit"); // A "thud" sound
    } else {
      this.end(game);
    }
  }

  public update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) {
      return;
    }

    this.elapsedTicks++;

    if (this.truckHasDespawned) {
      this.postDespawnElapsedTicks++;
      if (this.postDespawnElapsedTicks > POST_TRUCK_DURATION_TICKS) {
        this.end(game);
      }
      return;
    }

    // If we are here, truck has not despawned yet.
    if (this.truckId === null) {
      this.end(game); // Should not happen if start was successful
      return;
    }

    const truckInstance = game.getCarManager().getCarById(this.truckId);

    if (truckInstance) {
      // Check if we should drop debris
      if (Math.random() < DEBRIS_DROP_PROBABILITY) {
        const truckDirection = Math.sign(truckInstance.speed);
        // Drop debris behind the truck
        const debrisX = Math.floor(truckInstance.x - truckDirection * 2);
        const debrisY = truckInstance.y;

        // Avoid dropping on top of existing debris or out of bounds
        if (debrisX >= 0 && debrisX < VIRTUAL_SCREEN_WIDTH) {
          const cellInfo = game.getCellInfo(debrisX, debrisY);
          const isOccupied = cellInfo && cellInfo.char !== " ";

          if (!isOccupied) {
            game
              .getCarManager()
              .spawnStaticObstacle(debrisX, debrisY, DEBRIS_CHAR, DEBRIS_COLOR);
          }
        }
      }
    } else {
      // The truck has been despawned (went off-screen)
      this.truckHasDespawned = true;
    }
  }

  public end(game: HopwayGame): void {
    if (!this.isActive) return;

    // Clean up all debris dropped by this event
    game.getCarManager().removeStaticObstaclesByChar(DEBRIS_CHAR);
    this.truckId = null;
    this.isActive = false;
  }

  public isFinished(): boolean {
    // This event ends once the truck is off-screen or despawned.
    return !this.isActive;
  }

  public getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    return `! CLUMSY TRUCK !`;
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;
    // The truck and its dropped obstacles are drawn by CarManager and the event's own obstacle management.
    // The text message is now handled by getDisplayMessage.
  }
}
