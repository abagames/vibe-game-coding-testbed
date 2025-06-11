import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { Car } from "../CarManager";

export class WrongWayDriverEvent implements GameEvent {
  // GameEvent interface properties
  readonly id: string = ""; // Assigned by EventManager
  readonly type: string = "WRONG_WAY_DRIVER";
  isActive: boolean = false;
  durationTicks: number = Infinity; // Event lasts until the car is off-screen
  elapsedTicks: number = 0;

  private wrongWayCar: Car | null = null;

  start(game: HopwayGame): void {
    const carManager = game.getCarManager();
    const car = carManager.spawnWrongWayCar();

    if (car) {
      this.wrongWayCar = car;
      this.isActive = true;
      game.play("laserShoot"); // A jarring, futuristic sound for a sudden event
      console.log(
        `Event Started: ${this.type}. Car ID: ${this.wrongWayCar.id}`
      );
    } else {
      // Could not spawn a car, so the event shouldn't start
      this.isActive = false;
      this.durationTicks = 0; // End immediately
      console.warn(`Event Failed: ${this.type}. Could not spawn car.`);
    }
  }

  update(game: HopwayGame): void {
    if (!this.wrongWayCar) {
      return;
    }

    // Check if the car is still on the board.
    // If not, the event is over.
    const carStillExists = game.getCarManager().getCarById(this.wrongWayCar.id);
    if (!carStillExists) {
      this.wrongWayCar = null;
      this.isActive = false; // The EventManager will catch this state via isFinished()
    }
  }

  end(): void {
    // No specific cleanup needed as the car manager handles car removal.
    // Any remaining on-screen warnings would be cleared here.
    console.log(`Event Ended: ${this.type}.`);
  }

  isFinished(): boolean {
    // The event is finished if it's no longer active (set in update)
    return !this.isActive;
  }

  getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    return "!! WRONG WAY DRIVER !!";
  }

  draw(game: HopwayGame): void {
    if (!this.isActive) return;
    // Vehicle is drawn by CarManager, message by getDisplayMessage
  }
}
