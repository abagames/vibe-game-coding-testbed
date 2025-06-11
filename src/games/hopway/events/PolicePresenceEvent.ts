import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import { VIRTUAL_SCREEN_WIDTH } from "../../../core/coreTypes";
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
  }

  update(): void {
    if (!this.isActive) return;
    this.elapsedTicks++;

    if (this.isSpeedTrapActive) {
      this.speedTrapTicks++;
      if (this.speedTrapTicks > SPEED_TRAP_DURATION_TICKS) {
        this.isSpeedTrapActive = false;
        // Effect ends automatically by carManager
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
    if (!this.isSpeedTrapActive) return null;
    const remainingS = (
      (SPEED_TRAP_DURATION_TICKS - this.speedTrapTicks) /
      60
    ).toFixed(1);
    return `SPEED TRAP ACTIVE! ${remainingS}s`;
  }

  public draw(): void {
    // All visual effects are handled by the car speed reduction
    // and the message is handled by getDisplayMessage.
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
