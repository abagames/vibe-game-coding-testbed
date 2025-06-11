import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { InputState, VIRTUAL_SCREEN_WIDTH } from "../../../core/coreTypes";
import { Car } from "../CarManager";

const BROKEN_DOWN_CHAR = "B";

export interface BrokenDownCarEventOptions {
  duration?: number;
}

export class BrokenDownCarEvent implements GameEvent {
  public readonly id: string;
  public readonly type: string = "BROKEN_DOWN_CAR";
  public isActive: boolean = false;
  public durationTicks: number;
  public elapsedTicks: number = 0;

  private targetCar: Car | null = null;
  private originalChar: string = "";

  constructor(options: BrokenDownCarEventOptions = {}) {
    this.id = `event-${this.type}-${Date.now()}`;
    this.durationTicks = options.duration ?? 900; // 15 seconds at 60tps
  }

  public start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;

    const cars = game.getCars();
    const eligibleCars = cars.filter(
      (c) => !c.isSignaling && c.x > 10 && c.x < VIRTUAL_SCREEN_WIDTH - 10
    );

    if (eligibleCars.length > 0) {
      this.targetCar =
        eligibleCars[Math.floor(Math.random() * eligibleCars.length)];
      this.targetCar.isStaticObstacle = true;
      this.targetCar.speed = 0;
      this.originalChar = this.targetCar.char;
      this.targetCar.char = BROKEN_DOWN_CHAR;
      game.play("explosion");
    } else {
      this.end(game);
    }
  }

  public update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) {
      return;
    }

    this.elapsedTicks++;

    if (this.targetCar) {
      const BLINK_INTERVAL = 15;
      this.targetCar.char =
        game.gameTickCounter % BLINK_INTERVAL < BLINK_INTERVAL / 2
          ? BROKEN_DOWN_CHAR
          : " ";
      this.targetCar.colorOverride = "purple";
    }

    if (this.isFinished()) {
      this.end(game);
    }
  }

  public end(game: HopwayGame): void {
    if (this.targetCar) {
      this.targetCar.isStaticObstacle = false;
      this.targetCar.speed = this.targetCar.originalSpeed;
      this.targetCar.char = this.originalChar;
      this.targetCar.colorOverride = null;
      this.targetCar = null;
    }
    this.isActive = false;
  }

  public isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  public getDisplayMessage(): string {
    const remainingS = ((this.durationTicks - this.elapsedTicks) / 60).toFixed(
      1
    );
    return `BROKEN DOWN CAR! ${remainingS}s`;
  }

  public draw(game: HopwayGame): void {
    // The car's appearance is modified in update(), so no drawing logic is needed here.
    // The game's CarManager will handle drawing the car with its modified state.
    // Message is handled by getDisplayMessage.
  }
}
