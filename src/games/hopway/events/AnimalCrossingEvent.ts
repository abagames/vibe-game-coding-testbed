import { HopwayGame } from "../core";
import { VIRTUAL_SCREEN_WIDTH, InputState } from "../../../core/coreTypes";
import { GameEvent } from "./GameEvent";
import { Animal } from "./Animal";
import { getRandomInt } from "../../../utils/math";

// Constants from HopwayGame, to avoid circular dependency
const TOP_SAFE_ROW = 1;
const BOTTOM_SAFE_ROW = 23;

export class AnimalCrossingEvent implements GameEvent {
  readonly id: string = "";
  readonly type: string = "ANIMAL_CROSSING";
  isActive: boolean = false;
  durationTicks: number = 1500; // Event lasts for 1500 ticks
  elapsedTicks: number = 0;

  private animals: Animal[] = [];
  private nextAnimalSpawnTicks: number = 0;
  private static nextId = 0;

  public getAnimals(): Animal[] {
    return this.animals;
  }

  start(game: HopwayGame): void {
    this.isActive = true;
    this.elapsedTicks = 0;
    this.animals = [];
    this.spawnAnimal(game); // Spawn one immediately
    this.nextAnimalSpawnTicks = getRandomInt(120, 240);
    console.log(`Event Started: ${this.type}`);
  }

  update(game: HopwayGame, inputState: InputState): void {
    if (!this.isActive) return;

    this.elapsedTicks++;
    this.nextAnimalSpawnTicks--;

    if (this.nextAnimalSpawnTicks <= 0) {
      this.spawnAnimal(game);
      this.nextAnimalSpawnTicks = getRandomInt(200, 400); // Time to next animal
    }

    this.updateAnimals(game);
  }

  private updateAnimals(game: HopwayGame): void {
    for (let i = this.animals.length - 1; i >= 0; i--) {
      const animal = this.animals[i];
      animal.ticksUntilNextMove--;

      if (animal.ticksUntilNextMove <= 0) {
        animal.y += animal.direction;

        // Deer can sidestep
        if (animal.type === "DEER" && Math.random() < 0.1) {
          animal.x += Math.random() < 0.5 ? 1 : -1;
          // Clamp to screen bounds
          animal.x = Math.max(0, Math.min(VIRTUAL_SCREEN_WIDTH - 1, animal.x));
        }

        animal.ticksUntilNextMove = animal.speed;
      }

      // Despawn if they've crossed the road
      if (animal.direction === 1 && animal.y >= BOTTOM_SAFE_ROW) {
        this.animals.splice(i, 1);
      } else if (animal.direction === -1 && animal.y <= TOP_SAFE_ROW) {
        this.animals.splice(i, 1);
      }
    }
  }

  end(game: HopwayGame): void {
    this.isActive = false;
    this.animals = []; // Clear all animals
    console.log(`Event Ended: ${this.type}`);

    this.animals.forEach((animal) => {
      game.drawText(animal.char, animal.x, animal.y, { color: animal.color });
    });
  }

  isFinished(): boolean {
    return this.elapsedTicks >= this.durationTicks && this.animals.length === 0;
  }

  public getDisplayMessage(): string | null {
    if (!this.isActive) return null;
    return `ANIMAL CROSSING!`;
  }

  public draw(game: HopwayGame): void {
    if (!this.isActive) return;

    this.animals.forEach((animal) => {
      game.drawText(animal.char, animal.x, animal.y, { color: animal.color });
    });
  }

  private spawnAnimal(game: HopwayGame): void {
    const laneYCoords = game.getCarManager().getLaneYCoords();
    if (laneYCoords.length === 0) return; // Can't spawn if there are no lanes

    const type = Math.random() < 0.4 ? "DEER" : "TURTLE";
    const direction = Math.random() < 0.5 ? 1 : -1; // 1 = down, -1 = up

    const x = getRandomInt(1, VIRTUAL_SCREEN_WIDTH - 2);
    const y = direction === 1 ? TOP_SAFE_ROW + 1 : BOTTOM_SAFE_ROW - 1;

    let newAnimal: Animal;

    if (type === "DEER") {
      newAnimal = {
        id: AnimalCrossingEvent.nextId++,
        type: "DEER",
        x,
        y,
        char: "D",
        color: "light_yellow",
        speed: getRandomInt(10, 15),
        ticksUntilNextMove: 0,
        direction,
        isSpooked: false,
      };
    } else {
      newAnimal = {
        id: AnimalCrossingEvent.nextId++,
        type: "TURTLE",
        x,
        y,
        char: "t",
        color: "light_green",
        speed: getRandomInt(30, 45),
        ticksUntilNextMove: 0,
        direction,
        isSpooked: false,
      };
    }

    this.animals.push(newAnimal);
  }
}
