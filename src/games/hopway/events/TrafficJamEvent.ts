import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";

interface TrafficJamEventOptions {
  duration?: number;
}

export class TrafficJamEvent implements GameEvent {
  // GameEvent interface properties
  readonly id: string = ""; // Assigned by EventManager
  readonly type: string = "TRAFFIC_JAM";
  isActive: boolean = false;
  durationTicks: number;
  elapsedTicks: number = 0;

  private originalSlowCarProbability: number = 0;

  constructor(options: TrafficJamEventOptions = {}) {
    this.durationTicks = options.duration ?? 600; // Default to 600 ticks
  }

  start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;
    const carManager = game.getCarManager();
    this.originalSlowCarProbability = carManager.slowCarProbability;
    carManager.slowCarProbability = 0.75; // Drastically increase slow car chance
    game.play("explosion"); // A more fitting sound for a major event
    console.log(
      `Event Started: ${this.type}. Duration: ${this.durationTicks} ticks.`
    );
  }

  update(): void {
    // Nothing to do here, the core logic is based on elapsedTicks
    // which is managed by the EventManager.
  }

  end(game: HopwayGame): void {
    this.isActive = false;
    // Restore the original probability
    game.getCarManager().slowCarProbability = this.originalSlowCarProbability;
    console.log(`Event Ended: ${this.type}.`);
  }

  isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  getDisplayMessage(): string {
    const remainingS = ((this.durationTicks - this.elapsedTicks) / 60).toFixed(
      1
    );
    return `TRAFFIC JAM! ${remainingS}s`;
  }

  draw(game: HopwayGame): void {
    // Visual-only effects can remain here. Message is now handled by getDisplayMessage.
  }
}
