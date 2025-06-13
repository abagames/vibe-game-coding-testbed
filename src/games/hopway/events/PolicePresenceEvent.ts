import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import {
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
} from "../../../core/coreTypes";
import { MEDIAN_ROW } from "../core";

const EVENT_DURATION_TICKS = 1500; // Approximately 25 seconds at 60 TPS
const POLICE_INFLUENCE_RADIUS = 12;
const LEGAL_SPEED_MULTIPLIER = 0.5;
const SPEED_TRAP_DURATION_TICKS = 1000; // 1000 ticks = 16.67 seconds at 60 TPS

export class PolicePresenceEvent implements GameEvent {
  readonly id: string;
  readonly type: string = "POLICE_PRESENCE";
  isActive: boolean = false;
  durationTicks: number = EVENT_DURATION_TICKS;
  elapsedTicks: number = 0;
  private policeCarPosition: { x: number; y: number };
  private isSpeedTrapActive: boolean = false;
  private speedTrapTicks: number = 0;

  constructor(private game: HopwayGame) {
    this.id = `police-${Date.now()}`;

    const randomX = Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 10)) + 5; // Avoid edges

    this.policeCarPosition = { x: randomX, y: MEDIAN_ROW };
  }

  start(): void {
    this.isActive = true;
    this.isSpeedTrapActive = true;
    this.speedTrapTicks = 0;
  }

  update(): void {
    if (!this.isActive) return;
    this.elapsedTicks++;

    if (this.isSpeedTrapActive) {
      this.speedTrapTicks++;
      if (this.speedTrapTicks >= SPEED_TRAP_DURATION_TICKS) {
        this.isSpeedTrapActive = false;
        this.speedTrapTicks = 0;
      }
    }
  }

  end(): void {
    this.isActive = false;
  }

  isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  public getDisplayMessage(): string | null {
    if (!this.isActive) return null;

    if (this.isSpeedTrapActive) {
      const remainingS = (
        (SPEED_TRAP_DURATION_TICKS - this.speedTrapTicks) /
        60
      ).toFixed(1);
      return `SPEED TRAP ACTIVE! ${remainingS}s`;
    } else {
      const remainingS = (
        (this.durationTicks - this.elapsedTicks) /
        60
      ).toFixed(1);
      return `POLICE PRESENCE ${remainingS}s`;
    }
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;

    // Draw police car at the median
    game.drawText("P", this.policeCarPosition.x, this.policeCarPosition.y, {
      color: "blue",
    });

    // Draw police influence area (optional visual indicator)
    if (this.isSpeedTrapActive) {
      // Draw speed trap indicators around the police car
      const radius = Math.min(POLICE_INFLUENCE_RADIUS, 8); // Limit visual radius
      for (let dx = -radius; dx <= radius; dx += 2) {
        for (let dy = -2; dy <= 2; dy += 1) {
          const x = this.policeCarPosition.x + dx;
          const y = this.policeCarPosition.y + dy;
          if (
            x >= 0 &&
            x < VIRTUAL_SCREEN_WIDTH &&
            y >= 0 &&
            y < VIRTUAL_SCREEN_HEIGHT
          ) {
            // Only draw if the cell is empty
            const cellInfo = game.getCellInfo(x, y);
            if (!cellInfo || cellInfo.char === " ") {
              game.drawText(".", x, y, { color: "blue" });
            }
          }
        }
      }
    }
  }

  public getPoliceCarPosition(): { x: number; y: number } {
    return this.policeCarPosition;
  }

  public getInfluenceRadius(): number {
    return POLICE_INFLUENCE_RADIUS;
  }

  public getLegalSpeedMultiplier(): number {
    return LEGAL_SPEED_MULTIPLIER;
  }
}
