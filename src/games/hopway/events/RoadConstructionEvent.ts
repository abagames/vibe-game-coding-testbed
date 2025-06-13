import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { InputState, VIRTUAL_SCREEN_WIDTH } from "../../../core/coreTypes";

const CONSTRUCTION_CHAR = "A";
const CONSTRUCTION_COLOR = "yellow";

export interface RoadConstructionEventOptions {
  duration?: number;
  laneY?: number;
  length?: number;
  startX?: number;
}

export class RoadConstructionEvent implements GameEvent {
  public readonly id: string;
  public readonly type: string = "ROAD_CONSTRUCTION";
  public isActive: boolean = false;
  public durationTicks: number;
  public elapsedTicks: number = 0;

  private options: RoadConstructionEventOptions;
  private affectedLaneY: number = -1;

  constructor(options: RoadConstructionEventOptions = {}) {
    this.id = `event-${this.type}-${Date.now()}`;
    this.durationTicks = options.duration ?? 1800; // 30 seconds at 60tps
    this.options = options;
  }

  public start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;

    const lanes = game.getLaneDefinitions();
    if (lanes.length === 0) {
      this.end(game);
      return;
    }

    // Select a lane for construction based on player position
    if (this.options.laneY !== undefined) {
      this.affectedLaneY = this.options.laneY;
    } else {
      const playerY = game.getPlayerY();
      const screenMidpoint = 12;

      // Filter lanes based on player position
      let availableLanes: Array<{ y: number; direction: number }>;
      if (playerY <= screenMidpoint) {
        // Player is in upper half, place construction in lower half
        availableLanes = lanes.filter((lane) => lane.y > screenMidpoint);
      } else {
        // Player is in lower half, place construction in upper half
        availableLanes = lanes.filter((lane) => lane.y < screenMidpoint);
      }

      // If no lanes available on opposite side, use any lane
      if (availableLanes.length === 0) {
        availableLanes = lanes;
      }

      this.affectedLaneY =
        availableLanes[Math.floor(Math.random() * availableLanes.length)].y;
    }

    const length = this.options.length ?? 10;
    // Place construction in the middle of the road by default
    const startX =
      this.options.startX ??
      Math.floor(VIRTUAL_SCREEN_WIDTH / 2) - Math.floor(length / 2);

    for (let i = 0; i < length; i++) {
      const x = startX + i;
      if (x >= 0 && x < VIRTUAL_SCREEN_WIDTH) {
        game.spawnStaticObstacle(
          x,
          this.affectedLaneY,
          CONSTRUCTION_CHAR,
          CONSTRUCTION_COLOR
        );
      }
    }

    game.play("synth"); // A different sound for this event
  }

  public update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) {
      return;
    }

    this.elapsedTicks++;

    if (this.isFinished()) {
      this.end(game);
    }
  }

  public end(game: HopwayGame): void {
    if (this.affectedLaneY !== -1) {
      game.removeStaticObstaclesByChar(CONSTRUCTION_CHAR);
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
    return `LANE CLOSED! ${remainingS}s`;
  }

  public draw(game: HopwayGame): void {
    // Visuals are handled by static obstacles, message by getDisplayMessage.
  }
}
