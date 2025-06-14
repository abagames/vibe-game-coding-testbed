import { HopwayGame } from "../core";
import { GameEvent } from "./GameEvent";
import {
  VIRTUAL_SCREEN_HEIGHT,
  VIRTUAL_SCREEN_WIDTH,
  InputState,
} from "../../../core/coreTypes";

export type WeatherType = "RAIN" | "FOG";

interface WeatherEventOptions {
  type?: WeatherType;
  duration?: number;
}

interface Raindrop {
  x: number;
  y: number;
  char: string;
}

export class WeatherEvent implements GameEvent {
  readonly id: string = ""; // Assigned by EventManager
  readonly type: string = "WEATHER";
  isActive: boolean = false;
  durationTicks: number;
  elapsedTicks: number = 0;

  private weatherType: WeatherType;
  private originalMinCarSpeed?: number;
  private originalMaxCarSpeed?: number;
  private raindrops: Raindrop[] = [];
  private fogDensity: number = 0.3; // 30% of applicable cells will have fog

  constructor(options: WeatherEventOptions = {}) {
    this.durationTicks = options.duration ?? 1200; // Default to 1200 ticks (20 seconds)
    this.weatherType = options.type ?? (Math.random() < 0.5 ? "RAIN" : "FOG");
  }

  start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;

    if (this.weatherType === "RAIN") {
      const carManager = game.getCarManager();
      this.originalMinCarSpeed = carManager.minCarSpeed;
      this.originalMaxCarSpeed = carManager.maxCarSpeed;
      carManager.minCarSpeed *= 0.8;
      carManager.maxCarSpeed *= 0.85;
      this.initializeRain(game);

      // Enhanced rain audio
      game.playEventSound("WEATHER_RAIN");

      // Occasional thunder for dramatic effect
      if (Math.random() < 0.3) {
        setTimeout(() => {
          game.playEventSound("WEATHER_STORM");
        }, 1000 + Math.random() * 3000); // Thunder 1-4 seconds after rain starts
      }
    } else {
      // FOG - subtle atmospheric sound
      game.play("synth", 12345);
    }

    console.log(
      `Event Started: ${this.weatherType}. Duration: ${this.durationTicks} ticks.`
    );
  }

  update(game: HopwayGame, inputState: InputState): void {
    if (this.weatherType === "RAIN") {
      this.updateRain(game);

      // Removed frequent rain sounds to avoid audio spam
      // Rain sound only plays when weather event starts

      // Keep occasional thunder but reduce frequency
      if (this.elapsedTicks % 1200 === 0 && Math.random() < 0.1) {
        // Every 20 seconds, 10% chance
        game.playEventSound("WEATHER_STORM", this.elapsedTicks);
      }
    }
  }

  end(game: HopwayGame): void {
    this.isActive = false;
    if (
      this.weatherType === "RAIN" &&
      this.originalMinCarSpeed &&
      this.originalMaxCarSpeed
    ) {
      const carManager = game.getCarManager();
      carManager.minCarSpeed = this.originalMinCarSpeed;
      carManager.maxCarSpeed = this.originalMaxCarSpeed;
    }
    console.log(`Event Ended: ${this.weatherType}.`);
  }

  isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks;
  }

  public getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    const remainingSeconds = (
      (this.durationTicks - this.elapsedTicks) /
      60
    ).toFixed(1);
    return `${this.weatherType.toUpperCase()}! ${remainingSeconds}s`;
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;

    switch (this.weatherType) {
      case "RAIN":
        this.drawRain(game);
        break;
      case "FOG":
        this.drawFog(game);
        break;
    }
  }

  private initializeRain(game: HopwayGame): void {
    for (let i = 0; i < 50; i++) {
      this.raindrops.push({
        x: Math.floor(Math.random() * VIRTUAL_SCREEN_WIDTH),
        y: Math.floor(Math.random() * VIRTUAL_SCREEN_HEIGHT),
        char: Math.random() < 0.5 ? "`" : ".",
      });
    }
  }

  private updateRain(game: HopwayGame): void {
    this.raindrops.forEach((drop) => {
      drop.y += 1;
      if (drop.y > VIRTUAL_SCREEN_HEIGHT) {
        drop.y = 0;
        drop.x = Math.floor(Math.random() * VIRTUAL_SCREEN_WIDTH);
      }
    });
  }

  private drawRain(game: HopwayGame): void {
    this.raindrops.forEach((drop) => {
      // Avoid drawing over the player or cars for better visibility
      const cell = game.getCellInfo(drop.x, drop.y);
      if (!cell || cell.char === " " || cell.char === "=") {
        game.drawText(drop.char, drop.x, drop.y, { color: "cyan" });
      }
    });
  }

  private drawFog(game: HopwayGame): void {
    const laneYs = game.getCarManager().getLaneYCoords();
    for (const y of laneYs) {
      for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
        const cell = game.getCellInfo(x, y);
        // Only draw fog on empty road spaces to avoid obscuring cars/player
        if (cell && cell.char === " " && Math.random() < this.fogDensity) {
          game.drawText("~", x, y, { color: "light_black" });
        }
      }
    }
  }
}
