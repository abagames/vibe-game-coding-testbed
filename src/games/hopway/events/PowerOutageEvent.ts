import { VIRTUAL_SCREEN_WIDTH, InputState } from "../../../core/coreTypes";
import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";

export interface PowerOutageEventOptions {
  duration?: number;
}

export class PowerOutageEvent implements GameEvent {
  id: string;
  type: string = "POWER_OUTAGE";
  isActive: boolean = false;
  durationTicks: number;
  elapsedTicks: number = 0;

  private darkZoneY: number = 0;
  private darkZoneHeight: number = 0;
  private hasInitializedLanes: boolean = false;

  constructor(options: PowerOutageEventOptions) {
    this.id = `power-outage-${Date.now()}`;
    this.durationTicks = options.duration ?? 600; // Default to 10 seconds at 60tps
  }

  private selectRandomLanes(game: HopwayGame) {
    // Select 3 to 5 contiguous lanes to be the dark zone
    const availableLanes = game.getCarManager().getLaneYCoords();
    if (availableLanes.length < 3) {
      this.darkZoneY = availableLanes[0] ?? 5;
      this.darkZoneHeight = availableLanes.length;
      return;
    }

    this.darkZoneHeight = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 lanes
    const startIndex = Math.floor(
      Math.random() * (availableLanes.length - this.darkZoneHeight)
    );
    this.darkZoneY = availableLanes[startIndex];
  }

  start(game: HopwayGame): void {
    if (!this.hasInitializedLanes) {
      this.selectRandomLanes(game);
      this.hasInitializedLanes = true;
    }
    this.isActive = true;
    game.play("explosion"); // A startling sound for power outage
  }

  update(game: HopwayGame, inputState: InputState): void {
    this.elapsedTicks++;
  }

  end(game: HopwayGame): void {
    this.isActive = false;
  }

  isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  public getDisplayMessage(): string {
    const remainingS = ((this.durationTicks - this.elapsedTicks) / 60).toFixed(
      1
    );
    return `POWER OUTAGE! ${remainingS}s`;
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;

    const allLanes = game.getCarManager().getLaneYCoords();

    // Draw the dark zone background
    for (
      let y = this.darkZoneY;
      y < this.darkZoneY + this.darkZoneHeight;
      y++
    ) {
      // Only affect actual lanes, not the median or safe zones
      if (!allLanes.includes(y)) continue;

      for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
        const cell = game.getCellInfo(x, y);
        // Only draw over empty spaces to avoid overwriting cars, player, etc.
        if (cell?.char === " ") {
          game.drawText(" ", x, y, {
            backgroundColor: "black",
          });
        }
      }
    }

    // Draw flickering streetlights (visual effect)
    if (this.elapsedTicks % 25 < 5) {
      // Very brief flash
      for (
        let y = this.darkZoneY;
        y < this.darkZoneY + this.darkZoneHeight;
        y++
      ) {
        if (!allLanes.includes(y)) continue;
        game.drawText("-", 0, y, { color: "light_black" });
        game.drawText("-", VIRTUAL_SCREEN_WIDTH - 1, y, {
          color: "light_black",
        });
      }
    }
  }

  public getDarkZone(): { y: number; height: number } {
    return { y: this.darkZoneY, height: this.darkZoneHeight };
  }
}
