import { VIRTUAL_SCREEN_WIDTH, InputState } from "../../../core/coreTypes";
import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { Car } from "../CarManager";

const VIP_CAR_CHAR = "V";
const ESCORT_CAR_CHAR = "E";
const PROCESSION_SPEED_FACTOR = 0.3; // Very slow
const FORMATION_SPACING = 3; // Distance between cars in formation

export class VIPEscortEvent implements GameEvent {
  // GameEvent properties
  id = "vip_escort_event"; // A default ID
  type = "VIP_ESCORT";
  isActive = false;
  elapsedTicks = 0;
  durationTicks = 3000; // Maximum duration

  private processionCars: Car[] = [];
  private leadCar: Car | null = null;
  private targetSpeed: number = 0;
  private formationLanes: number[] = [];

  constructor() {}

  start(game: HopwayGame): void {
    this.isActive = true;
    const carManager = game.getCarManager();
    const lanes = carManager.getLaneDefinitions();

    // Choose a side of the road (top or bottom half)
    const isTopHalf = Math.random() < 0.5;
    const halfLanes = isTopHalf
      ? lanes.filter((l) => l.direction === -1)
      : lanes.filter((l) => l.direction === 1);

    if (halfLanes.length < 2) {
      this.isActive = false;
      return;
    }

    // Select consecutive lanes for the procession
    const startLaneIndex = Math.floor(Math.random() * (halfLanes.length - 1));
    const lane1 = halfLanes[startLaneIndex];
    const lane2 = halfLanes[startLaneIndex + 1];

    this.formationLanes = [lane1.y, lane2.y];
    const direction = lane1.direction;
    this.targetSpeed =
      ((carManager.minCarSpeed + carManager.maxCarSpeed) / 2) *
      PROCESSION_SPEED_FACTOR *
      direction;

    // Spawn VIP car in the center lane
    const startX = direction > 0 ? -5 : VIRTUAL_SCREEN_WIDTH + 5;
    const vipCar = carManager.spawnCarInLane(lane1.y, direction, {
      char: VIP_CAR_CHAR,
      colorOverride: "purple",
      speed: this.targetSpeed,
      isEventCar: true,
    });

    if (vipCar) {
      vipCar.x = startX; // Set initial position
      this.leadCar = vipCar;
      this.processionCars.push(vipCar);
    } else {
      this.isActive = false;
      return;
    }

    // Spawn escort cars in formation
    const escortPositions = [
      { x: startX + direction * -FORMATION_SPACING, y: lane1.y }, // Behind VIP
      { x: startX + direction * FORMATION_SPACING, y: lane1.y }, // Front of VIP
      { x: startX, y: lane2.y }, // Parallel to VIP
      { x: startX + direction * -FORMATION_SPACING, y: lane2.y }, // Behind parallel
    ];

    for (const pos of escortPositions) {
      const escortCar = carManager.spawnCarInLane(pos.y, direction, {
        char: ESCORT_CAR_CHAR,
        colorOverride: "yellow",
        speed: this.targetSpeed,
        isEventCar: true,
      });
      if (escortCar) {
        escortCar.x = pos.x;
        this.processionCars.push(escortCar);
      }
    }

    if (this.processionCars.length > 1) {
      game.play("synth");
    }
  }

  update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) return;
    this.elapsedTicks++;

    // Keep all procession cars synchronized
    if (this.leadCar && this.processionCars.length > 1) {
      for (const car of this.processionCars) {
        if (car !== this.leadCar) {
          // Ensure all cars maintain the same speed as the lead car
          car.speed = this.leadCar.speed;
        }
      }
    }

    // Remove cars that are no longer valid
    this.processionCars = this.processionCars.filter((car) => {
      const carManager = game.getCarManager();
      return carManager.getCarById(car.id) !== undefined;
    });

    // Update lead car reference if needed
    if (this.leadCar && !game.getCarManager().getCarById(this.leadCar.id)) {
      this.leadCar =
        this.processionCars.length > 0 ? this.processionCars[0] : null;
    }
  }

  isFinished(): boolean {
    // Event finishes when all cars are off screen or max duration reached
    if (this.elapsedTicks >= this.durationTicks) return true;
    if (this.processionCars.length === 0) return true;
    if (!this.leadCar) return true;

    const isOffScreen =
      this.leadCar.speed > 0
        ? this.leadCar.x >= VIRTUAL_SCREEN_WIDTH + 5
        : this.leadCar.x < -5;

    return isOffScreen;
  }

  end(game: HopwayGame): void {
    this.isActive = false;
    // Cars are removed automatically by CarManager. No other cleanup needed.
  }

  getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    return "VIP ESCORT PASSING - KEEP CLEAR";
  }

  draw(game: HopwayGame): void {
    // Visual effects are handled by the cars themselves
    // This method is called but cars are drawn by CarManager
  }
}
