import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";

export interface RushHourEventOptions {
  duration?: number;
  spawnMultiplier?: number;
  speedMultiplier?: number;
  laneChangeCooldownFactor?: number; // How much to reduce cooldown by (e.g., 0.5 for half)
  laneChangeDistanceFactor?: number; // How much to increase initiation distance by
}

export class RushHourEvent implements GameEvent {
  id: string = ""; // Will be set by EventManager
  type: string = "RUSH_HOUR";
  isActive: boolean = false;
  elapsedTicks: number = 0;
  durationTicks: number;

  private spawnMultiplier: number;
  private speedMultiplier: number;
  private laneChangeCooldownFactor: number;
  private laneChangeDistanceFactor: number;

  private originalSpawnIntervalMultiplier: number = 1;
  private originalCarSpeedMultiplier: number = 1;
  private originalLaneChangeCooldown: number = 0;
  private originalLaneChangeDistance: number = 0;

  constructor(options: RushHourEventOptions) {
    this.durationTicks = options.duration ?? 600; // 10 seconds at 60tps
    this.spawnMultiplier = options.spawnMultiplier ?? 2.0;
    this.speedMultiplier = options.speedMultiplier ?? 1.15;
    this.laneChangeCooldownFactor = options.laneChangeCooldownFactor ?? 0.5; // Cooldown is halved
    this.laneChangeDistanceFactor = options.laneChangeDistanceFactor ?? 1.5; // More eager to change
  }

  start(game: HopwayGame): void {
    this.isActive = true;
    const carManager = game.getCarManager();

    // Store original values
    this.originalSpawnIntervalMultiplier = carManager.spawnIntervalMultiplier;
    this.originalCarSpeedMultiplier = carManager.carSpeedMultiplier;
    this.originalLaneChangeCooldown = carManager.laneChangeCooldownTicks;
    this.originalLaneChangeDistance =
      carManager.laneChangeInitiateDistanceFactor;

    // Apply event modifiers
    carManager.spawnIntervalMultiplier = this.spawnMultiplier;
    carManager.carSpeedMultiplier = this.speedMultiplier;
    carManager.laneChangeCooldownTicks *= this.laneChangeCooldownFactor;
    carManager.laneChangeInitiateDistanceFactor *=
      this.laneChangeDistanceFactor;

    console.log(
      `Rush Hour event started. Duration: ${this.durationTicks} ticks.`
    );
  }

  update(game: HopwayGame): void {
    // Event logic could go here if it needs to change over time
  }

  end(game: HopwayGame): void {
    this.isActive = false;
    const carManager = game.getCarManager();

    // Restore original values
    carManager.spawnIntervalMultiplier = this.originalSpawnIntervalMultiplier;
    carManager.carSpeedMultiplier = this.originalCarSpeedMultiplier;
    carManager.laneChangeCooldownTicks = this.originalLaneChangeCooldown;
    carManager.laneChangeInitiateDistanceFactor =
      this.originalLaneChangeDistance;

    console.log("Rush Hour event ended.");
  }

  isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  getDisplayMessage(): string {
    const remainingS = ((this.durationTicks - this.elapsedTicks) / 60).toFixed(
      1
    );
    return `RUSH HOUR! ${remainingS}s`;
  }

  draw(): void {
    // Visual-only effects can remain here. Message is now handled by getDisplayMessage.
  }
}
