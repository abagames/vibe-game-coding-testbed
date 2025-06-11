import { HopwayGame } from "../core";
import { Car } from "../CarManager";
import { GameEvent } from "./GameEvent";
import { InputState, VIRTUAL_SCREEN_WIDTH } from "../../../core/coreTypes";

const COLLISION_CHAR = "X";
const COLLISION_COLOR = "red";

export interface CarCollisionEventOptions {
  duration?: number;
}

export class CarCollisionEvent implements GameEvent {
  public readonly id: string;
  public readonly type: string = "CAR_COLLISION";
  public isActive: boolean = false;
  public durationTicks: number;
  public elapsedTicks: number = 0;

  private collidedCars: Car[] = [];

  constructor(options: CarCollisionEventOptions = {}) {
    this.id = `event-${this.type}-${Date.now()}`;
    this.durationTicks = options.duration ?? 1000; // ~16 seconds
  }

  private findCollisionCandidates(game: HopwayGame): [Car, Car] | null {
    const cars = game
      .getCars()
      .filter(
        (c) =>
          !c.isStaticObstacle &&
          !c.isEmergency &&
          c.x >= 0 &&
          c.x < VIRTUAL_SCREEN_WIDTH
      );
    const shuffledCars = [...cars].sort(() => 0.5 - Math.random());

    for (const car1 of shuffledCars) {
      for (const car2 of shuffledCars) {
        if (car1.id === car2.id) continue;

        // Check for a potential rear-end collision
        // Condition: Same lane, same direction, car2 is behind car1, and car2 is faster
        if (
          car1.y === car2.y &&
          Math.sign(car1.speed) === Math.sign(car2.speed)
        ) {
          const isCar2Behind =
            Math.sign(car1.speed) > 0 ? car2.x < car1.x : car2.x > car1.x;
          const isCar2Faster = Math.abs(car2.speed) > Math.abs(car1.speed);

          if (isCar2Behind && isCar2Faster) {
            const distance = Math.abs(car1.x - car2.x);
            if (distance < 5) {
              return [car1, car2]; // Found a collision pair
            }
          }
        }
      }
    }

    return null;
  }

  public start(game: HopwayGame): void {
    const candidates = this.findCollisionCandidates(game);

    if (candidates) {
      this.isActive = true;
      this.elapsedTicks = 0;
      this.collidedCars = candidates;

      for (const car of this.collidedCars) {
        car.isStaticObstacle = true;
        car.speed = 0;
        car.char = COLLISION_CHAR;
        car.colorOverride = COLLISION_COLOR;
      }

      game.play("explosion");
    } else {
      this.isActive = false;
    }
  }

  public update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) return;

    this.elapsedTicks++;

    const BLINK_INTERVAL = 20;
    const isVisible = this.elapsedTicks % BLINK_INTERVAL < BLINK_INTERVAL / 2;
    for (const car of this.collidedCars) {
      car.char = isVisible ? COLLISION_CHAR : " ";
    }

    if (this.isFinished()) {
      this.end(game);
    }
  }

  public end(game: HopwayGame): void {
    if (this.collidedCars.length > 0) {
      const carIdsToRemove = this.collidedCars.map((c) => c.id);
      game.removeCarsByIds(carIdsToRemove);
    }
    this.isActive = false;
    this.collidedCars = [];
  }

  public isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  public getDisplayMessage(): string {
    const remainingS = ((this.durationTicks - this.elapsedTicks) / 60).toFixed(
      1
    );
    return `! ACCIDENT ! ${remainingS}s`;
  }

  public draw(game: HopwayGame): void {
    // No-op. The visual effect is handled in the update method by modifying car properties.
  }
}
