import { VIRTUAL_SCREEN_WIDTH } from "../../../core/coreTypes";
import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { Car } from "../CarManager";

const VIP_CAR_CHAR = "V";
const ESCORT_CAR_CHAR = "E";
const PROCESSION_SPEED_FACTOR = 0.3; // Very slow

export class VIPEscortEvent implements GameEvent {
  // GameEvent properties
  id = "vip_escort_event"; // A default ID
  type = "VIP_ESCORT";
  isActive = false;
  elapsedTicks = 0;

  private processionCars: Car[] = [];
  private leadCar: Car | null = null;

  constructor() {}

  start(game: HopwayGame): void {
    this.isActive = true;
    const carManager = game.getCarManager();
    const lanes = carManager.getLaneDefinitions();

    const isTopHalf = Math.random() < 0.5;
    const halfLanes = isTopHalf
      ? lanes.filter((l) => l.direction === -1)
      : lanes.filter((l) => l.direction === 1);

    if (halfLanes.length < 2) {
      this.isActive = false;
      return;
    }

    const startLaneIndex = Math.floor(Math.random() * (halfLanes.length - 1));
    const lane1 = halfLanes[startLaneIndex];
    const lane2 = halfLanes[startLaneIndex + 1];

    const direction = lane1.direction;
    const speed =
      ((carManager.minCarSpeed + carManager.maxCarSpeed) / 2) *
      PROCESSION_SPEED_FACTOR;

    const commonOptions = {
      speed,
      isEventCar: true,
    };

    const vipCar = carManager.spawnCarInLane(lane1.y, direction, {
      char: VIP_CAR_CHAR,
      colorOverride: "purple",
      ...commonOptions,
    });
    if (vipCar) {
      this.leadCar = vipCar;
      this.processionCars.push(vipCar);
    } else {
      this.isActive = false;
      return;
    }

    const processionDefinition = [
      { dx: direction * 5, dy: 0, char: ESCORT_CAR_CHAR },
      { dx: direction * -5, dy: 0, char: ESCORT_CAR_CHAR },
      { dx: 0, dy: lane2.y - lane1.y, char: ESCORT_CAR_CHAR },
      { dx: direction * -5, dy: lane2.y - lane1.y, char: ESCORT_CAR_CHAR },
    ];

    for (const def of processionDefinition) {
      const escortCar = carManager.spawnCarInLane(lane1.y + def.dy, direction, {
        char: def.char,
        colorOverride: "yellow",
        x: vipCar.x + def.dx,
        ...commonOptions,
      });
      if (escortCar) {
        this.processionCars.push(escortCar);
      }
    }

    if (this.processionCars.length > 1) {
      game.play("siren");
    }
  }

  update(game: HopwayGame): void {
    if (!this.isActive) return;
    this.elapsedTicks++;
  }

  isFinished(): boolean {
    if (!this.leadCar) return true;

    const isOffScreen =
      this.leadCar.speed > 0
        ? this.leadCar.x >= VIRTUAL_SCREEN_WIDTH
        : this.leadCar.x < 0;

    return isOffScreen;
  }

  end(game: HopwayGame): void {
    this.isActive = false;
    // Cars are removed automatically by CarManager. No other cleanup needed.
  }
}
