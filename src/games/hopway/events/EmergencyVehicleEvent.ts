import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { InputState, VIRTUAL_SCREEN_WIDTH } from "../../../core/coreTypes";
import { Car } from "../CarManager";

const EMERGENCY_VEHICLE_CHAR = "E";
const EMERGENCY_VEHICLE_COLOR = "light_red";
const EMERGENCY_VEHICLE_SPEED_MULTIPLIER = 0.5;

export interface EmergencyVehicleEventOptions {
  // Future options can be added here
}

export class EmergencyVehicleEvent implements GameEvent {
  public readonly id: string;
  public readonly type: string = "EMERGENCY_VEHICLE";
  public isActive: boolean = false;
  public durationTicks: number = Infinity; // Event runs until the vehicle is off-screen
  public elapsedTicks: number = 0;

  private vehicle: Car | null = null;

  constructor(options: EmergencyVehicleEventOptions = {}) {
    this.id = `event-${this.type}-${Date.now()}`;
  }

  public getVehicle(): Car | null {
    return this.vehicle;
  }

  public start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;

    const lanes = game.getLaneDefinitions();
    if (lanes.length === 0) {
      this.end(game);
      return;
    }

    console.log(
      `[DEBUG] EmergencyVehicleEvent: Starting event. Available lanes: ${lanes.length}`
    );
    lanes.forEach((lane) =>
      console.log(`[DEBUG]   - Lane Y: ${lane.y}, Direction: ${lane.direction}`)
    );

    const targetLane = lanes[Math.floor(Math.random() * lanes.length)];
    const speed = game.getMaxCarSpeed() * EMERGENCY_VEHICLE_SPEED_MULTIPLIER;

    console.log(
      `[DEBUG] EmergencyVehicleEvent: Chosen lane Y: ${targetLane.y}`
    );

    this.vehicle = game.spawnCarInLane(targetLane.y, targetLane.direction, {
      char: EMERGENCY_VEHICLE_CHAR,
      colorOverride: EMERGENCY_VEHICLE_COLOR,
      speed: speed,
      isEmergency: true,
    });

    if (this.vehicle) {
      game.play("laser"); // Use a distinct sound
    } else {
      this.end(game);
    }
  }

  public update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive || !this.vehicle) {
      return;
    }

    this.elapsedTicks++;

    // The vehicle's movement is handled by the main game loop.
    // We just need to check if it has gone off-screen.
    const vehicleInstance = game
      .getCars()
      .find((c) => c.id === this.vehicle!.id);

    if (!vehicleInstance) {
      // The vehicle has been despawned by the game (went off-screen)
      this.end(game);
    }
  }

  public end(game: HopwayGame): void {
    this.vehicle = null;
    this.isActive = false;
  }

  public isFinished(): boolean {
    // The event is finished when it's no longer active
    return !this.isActive;
  }

  public getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    return `! EMERGENCY VEHICLE !`;
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;
    // The vehicle itself is drawn by the CarManager.
    // The text message is now handled by getDisplayMessage.
  }
}
