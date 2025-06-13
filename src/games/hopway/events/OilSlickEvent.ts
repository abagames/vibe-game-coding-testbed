import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import {
  cglColor,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  InputState,
} from "../../../core/coreTypes";
import { getRandomInt } from "../../../utils/math.js";

const OIL_SLICK_CHAR = ":";
const OIL_SLICK_BG_COLOR: cglColor = "light_blue";
const OIL_SLICK_COLOR: cglColor = "blue";
const MAX_PATCHES = 5;
const MIN_PATCH_SIZE = 2;
const MAX_PATCH_SIZE = 5;
const DEFAULT_DURATION_TICKS = 800;

interface OilPatch {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class OilSlickEvent implements GameEvent {
  public readonly id: string;
  public readonly type: string = "OIL_SLICK";
  public isActive: boolean = false;
  public durationTicks: number;
  public elapsedTicks: number = 0;

  private patches: OilPatch[] = [];

  constructor(duration: number = DEFAULT_DURATION_TICKS) {
    this.id = `event-${this.type}-${Date.now()}`;
    this.durationTicks = duration;
  }

  public start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;
    this.patches = [];
    console.log(`[OilSlickEvent] Starting event ${this.id}`);

    const carManager = game.getCarManager();
    const laneYs = carManager.getLaneYCoords();
    if (laneYs.length === 0) {
      this.end(game);
      return;
    }

    const numPatches = getRandomInt(1, MAX_PATCHES);

    for (let i = 0; i < numPatches; i++) {
      const targetLaneY = laneYs[Math.floor(Math.random() * laneYs.length)];
      const patchWidth = getRandomInt(MIN_PATCH_SIZE, MAX_PATCH_SIZE);
      const patchHeight = getRandomInt(1, 2); // 1 or 2 lanes high
      const patchX = getRandomInt(0, VIRTUAL_SCREEN_WIDTH - patchWidth);

      this.patches.push({
        x: patchX,
        y: targetLaneY,
        width: patchWidth,
        height: patchHeight,
      });
    }

    // We will need to modify EventManager to handle these "effect zones"
    game
      .getEventManager()
      .registerEffectZones(this.id, this.type, this.patches);
    game.play("hit"); // Placeholder sound
  }

  public update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) {
      return;
    }
    this.elapsedTicks++;
  }

  public end(game: HopwayGame): void {
    if (!this.isActive) return;

    game.getEventManager().unregisterEffectZones(this.id);
    this.isActive = false;
  }

  public isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  public getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    const remainingS = ((this.durationTicks - this.elapsedTicks) / 60).toFixed(
      1
    );
    return `OIL SLICK ON ROAD! ${remainingS}s`;
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;

    for (const patch of this.patches) {
      for (let y = patch.y; y < patch.y + patch.height; y++) {
        for (let x = patch.x; x < patch.x + patch.width; x++) {
          if (x < VIRTUAL_SCREEN_WIDTH && y < VIRTUAL_SCREEN_HEIGHT) {
            // Always draw the oil slick. Cars and player will be drawn on top of it later in the frame's draw cycle.
            game.drawText(OIL_SLICK_CHAR, x, y, {
              color: OIL_SLICK_COLOR,
              backgroundColor: OIL_SLICK_BG_COLOR,
            });
          }
        }
      }
    }
  }
}
