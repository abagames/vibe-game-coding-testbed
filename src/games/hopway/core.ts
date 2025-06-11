import { BaseGame } from "../../core/BaseGame";
import {
  BaseGameOptions,
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  SoundEffectType,
  cglColor,
} from "../../core/coreTypes";
import { EventManager } from "./events/EventManager";
import { TrafficJamEvent } from "./events/TrafficJamEvent";
import { BrokenDownCarEvent } from "./events/BrokenDownCarEvent";
import { RoadConstructionEvent } from "./events/RoadConstructionEvent";
import { EmergencyVehicleEvent } from "./events/EmergencyVehicleEvent";
import { CarCollisionEvent } from "./events/CarCollisionEvent";
import { WrongWayDriverEvent } from "./events/WrongWayDriverEvent";
import { ClumsyTruckEvent } from "./events/ClumsyTruckEvent";
import { Car, CarManager } from "./CarManager";
import { WeatherEvent, WeatherType } from "./events/WeatherEvent";
import { PolicePresenceEvent } from "./events/PolicePresenceEvent";
import { VIPEscortEvent } from "./events/VIPEscortEvent";
import { OilSlickEvent } from "./events/OilSlickEvent";
import { RushHourEvent } from "./events/RushHourEvent";
import { AnimalCrossingEvent } from "./events/AnimalCrossingEvent";
import { PowerOutageEvent } from "./events/PowerOutageEvent";

// Game-specific constants
const PLAYER_START_X = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
const PLAYER_START_Y = VIRTUAL_SCREEN_HEIGHT - 2;
const BOTTOM_SAFE_ROW = VIRTUAL_SCREEN_HEIGHT - 2;
const TOP_SAFE_ROW = 1;
export const MEDIAN_ROW = 12;

// Original slow car probability, now used as a default
const DEFAULT_SLOW_CAR_PROBABILITY = 0;
const SLOW_CAR_SPEED_FACTOR = 0.4;
const SLOW_CAR_CHAR = "T";

// Car Mechanics
const CAR_CHAR = "#";
const CAR_SPAWN_ATTEMPT_PROBABILITY = 0.1;
const DYNAMIC_SPAWN_TARGET_MULTIPLIER = 1.2;
const LANE_CHANGE_SIGNAL_DURATION_TICKS = 15;
const LANE_CHANGE_COOLDOWN_TICKS = 30;
const LANE_CHANGE_INITIATE_DISTANCE_FACTOR = 1.5;
const LANE_CHANGE_SAFETY_CHECK_AHEAD_FACTOR = 1.5;
const LANE_CHANGE_SAFETY_CHECK_BEHIND_FACTOR = 1.0;
const SIGNAL_CHAR_UP = "^";
const SIGNAL_CHAR_DOWN = "v";

// New Time-based Spawning Constants
const BASE_SPAWN_INTERVAL_TICKS = 150; // Average ticks between spawns
const SPAWN_INTERVAL_VARIATION_TICKS = 50; // Random variation in spawn time

export interface HopwayGameOptions extends BaseGameOptions {
  carDensity?: number;
  maxCarSpeed?: number;
  minCarSpeed?: number;
  playerMoveInterval?: number;
  minCarFollowingDistance?: number;
  carChar?: string;
  safeZoneChar?: string;
  slowCarProbability?: number;
  forceWeather?: WeatherType;
}

export class HopwayGame extends BaseGame {
  private playerX: number;
  private playerY: number;
  private lastPlayerMoveTick: number;
  private playerSlipState: {
    isSlipping: boolean;
    dx: number;
    dy: number;
    ticks: number;
  };

  private playerMoveInterval: number;
  private safeZoneChar: string;

  private eventManager: EventManager;
  private carManager: CarManager;
  private options: HopwayGameOptions;

  public gameTickCounter: number = 0;

  constructor(options: HopwayGameOptions = {}) {
    super({
      ...options,
      gameName: "Hopway",
      enableHighScoreStorage: true,
    });

    this.options = options;
    this.playerMoveInterval = options.playerMoveInterval ?? 5;
    this.safeZoneChar = options.safeZoneChar ?? "=";

    this.playerX = 0;
    this.playerY = 0;
    this.lastPlayerMoveTick = 0;
    this.playerSlipState = { isSlipping: false, dx: 0, dy: 0, ticks: 0 };

    this.eventManager = new EventManager(this);
    this.carManager = new CarManager(this, options);

    this.eventManager.registerEventType(
      "TRAFFIC_JAM",
      () => new TrafficJamEvent({ duration: 300 }), // ~5 seconds at 60tps
      0.002, // Probability per check
      1800 // Cooldown ticks
    );
    this.eventManager.registerEventType(
      "BROKEN_DOWN_CAR",
      () => new BrokenDownCarEvent({ duration: 900 }), // ~15 seconds
      0.001, // Probability per check
      4800 // Cooldown ticks
    );
    this.eventManager.registerEventType(
      "ROAD_CONSTRUCTION",
      () => new RoadConstructionEvent({ duration: 1200 }), // ~20 seconds
      0.001, // Probability per check
      6000 // Cooldown
    );
    this.eventManager.registerEventType(
      "EMERGENCY_VEHICLE",
      () => new EmergencyVehicleEvent(),
      0.005, // High probability for debugging
      3000 // Short cooldown for debugging
    );
    this.eventManager.registerEventType(
      "CAR_COLLISION",
      () => new CarCollisionEvent({ duration: 600 }),
      0.01,
      1200
    );
    this.eventManager.registerEventType(
      "WRONG_WAY_DRIVER",
      () => new WrongWayDriverEvent(),
      0.003, // Probability
      2500 // Cooldown ticks
    );
    this.eventManager.registerEventType(
      "CLUMSY_TRUCK",
      () => new ClumsyTruckEvent(),
      0.002, // Probability
      2000 // Cooldown ticks
    );
    this.eventManager.registerEventType(
      "WEATHER",
      () => new WeatherEvent({ duration: 900 }), // ~15 seconds
      0.0025, // Probability per check
      3000 // Cooldown ticks
    );
    this.eventManager.registerEventType(
      "POLICE_PRESENCE",
      () => new PolicePresenceEvent(this),
      0.0015,
      4000
    );
    this.eventManager.registerEventType(
      "VIP_ESCORT",
      () => new VIPEscortEvent(),
      0.001, // Rare event
      8000 // Long cooldown
    );
    this.eventManager.registerEventType(
      "OIL_SLICK",
      () => new OilSlickEvent(),
      0.003, // Probability
      2000 // Cooldown
    );
    this.eventManager.registerEventType(
      "RUSH_HOUR",
      () => new RushHourEvent({}), // Use default options
      0.001, // Rare event
      5000 // Cooldown
    );
    this.eventManager.registerEventType(
      "ANIMAL_CROSSING",
      () => new AnimalCrossingEvent(),
      0.002,
      2000 // Cooldown
    );
    this.eventManager.registerEventType(
      "POWER_OUTAGE",
      () => new PowerOutageEvent({ duration: 900 }),
      0.0015, // Probability
      5000 // Cooldown
    );
  }

  public initializeGame(): void {
    super.resetGame();
    this.playerX = PLAYER_START_X;
    this.playerY = PLAYER_START_Y;
    this.lastPlayerMoveTick = -1;
    this.gameTickCounter = 0;
    this.playerSlipState = { isSlipping: false, dx: 0, dy: 0, ticks: 0 };
    this.carManager.initialize();
    this.eventManager.reset();

    if (this.options.forceWeather) {
      this.eventManager.manuallyTriggerEvent(
        new WeatherEvent({
          type: this.options.forceWeather,
          duration: 9999,
        })
      );
    }
  }

  protected updateGame(inputState: InputState): void {
    if (this.isGameOver()) {
      if (inputState.r) {
        this.initializeGame();
      }
      return;
    }

    if (inputState.r) {
      this.initializeGame();
      return;
    }

    this.gameTickCounter++;
    this.eventManager.update(inputState);
    this.updatePlayerState(inputState);

    const animalEvent = this.eventManager.getActiveEventByType(
      "ANIMAL_CROSSING"
    ) as AnimalCrossingEvent | undefined;
    const animals = animalEvent ? animalEvent.getAnimals() : [];
    this.carManager.update(animals);

    this.checkCollisions();
    this.drawEverything();

    if (this.playerY === TOP_SAFE_ROW) {
      this.levelComplete();
    }
  }

  private levelComplete(): void {
    this.addScore(100);
    this.play("powerUp");
    this.playerX = PLAYER_START_X;
    this.playerY = PLAYER_START_Y;
  }

  private updatePlayerState(inputState: InputState): void {
    let canMove =
      this.gameTickCounter - this.lastPlayerMoveTick >= this.playerMoveInterval;

    // Process slip state first
    if (this.playerSlipState.isSlipping) {
      if (this.playerSlipState.ticks > 0) {
        this.movePlayer(this.playerSlipState.dx, this.playerSlipState.dy, true);
        this.playerSlipState.ticks--;
        canMove = false; // Prevent immediate manual move after a slip move
      } else {
        this.playerSlipState.isSlipping = false;
      }
    }

    if (!canMove) {
      return;
    }

    // Process normal input
    let dx = 0;
    let dy = 0;

    if (inputState.up) dy = -1;
    else if (inputState.down) dy = 1;
    else if (inputState.left) dx = -1;
    else if (inputState.right) dx = 1;

    if (dx !== 0 || dy !== 0) {
      this.movePlayer(dx, dy);
    }
  }

  private movePlayer(
    dx: number,
    dy: number,
    isSlippingMove: boolean = false
  ): void {
    const newX = this.playerX + dx;
    const newY = this.playerY + dy;

    if (
      newX >= 0 &&
      newX < VIRTUAL_SCREEN_WIDTH &&
      newY > 0 && // Cannot move into the very top info bar
      newY < VIRTUAL_SCREEN_HEIGHT - 1 // Cannot move into the very bottom info bar
    ) {
      this.playerX = newX;
      this.playerY = newY;
      if (!isSlippingMove) {
        this.lastPlayerMoveTick = this.gameTickCounter;
        this.play("click");

        // Check for oil slick effect on the player
        const effect = this.eventManager.getEffectAt(
          this.playerX,
          this.playerY
        );
        if (effect === "OIL_SLICK" && !this.playerSlipState.isSlipping) {
          this.playerSlipState = {
            isSlipping: true,
            dx: dx,
            dy: dy,
            ticks: 2, // Slip for 2 ticks
          };
          this.play("laser");
        }
      }
    }
  }

  private drawEverything(): void {
    this.drawSafeZones();
    this.eventManager.drawActiveEvents();
    this.carManager.draw();
    this.drawPlayer();
  }

  public override renderStandardUI(): void {
    // Render score and lives from BaseGame
    super.renderStandardUI();

    // Custom message rendering
    const eventMessage = this.eventManager.getActiveEventMessage();
    if (eventMessage) {
      this.drawText(eventMessage, 1, VIRTUAL_SCREEN_HEIGHT - 1, {
        color: "yellow",
      });
    } else {
      // Default message if no event is active
      this.drawText("R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
        color: "light_black",
      });
    }
  }

  private drawSafeZones(): void {
    // Top safe zone
    this.drawText(
      this.safeZoneChar.repeat(VIRTUAL_SCREEN_WIDTH),
      0,
      TOP_SAFE_ROW,
      { color: "green" }
    );
    // Median safe zone
    this.drawText(
      this.safeZoneChar.repeat(VIRTUAL_SCREEN_WIDTH),
      0,
      MEDIAN_ROW,
      { color: "yellow" }
    );
    // Bottom safe zone
    this.drawText(
      this.safeZoneChar.repeat(VIRTUAL_SCREEN_WIDTH),
      0,
      BOTTOM_SAFE_ROW,
      { color: "green" }
    );
  }

  private drawPlayer(): void {
    this.drawText("P", this.playerX, this.playerY, { color: "cyan" });
  }

  private resetPlayerPosition(): void {
    this.playerX = PLAYER_START_X;
    this.playerY = PLAYER_START_Y;
    this.lastPlayerMoveTick = this.gameTickCounter; // Add a small delay before moving again
  }

  private checkCollisions(): void {
    const cars = this.carManager.getCars();
    const playerCellContent = this.getCellInfo(this.playerX, this.playerY);

    // Check for collision with animals from event
    const animalEvent = this.eventManager.getActiveEventByType(
      "ANIMAL_CROSSING"
    ) as AnimalCrossingEvent | undefined;
    if (animalEvent) {
      const animals = animalEvent.getAnimals();
      for (const animal of animals) {
        if (
          Math.floor(this.playerX) === Math.floor(animal.x) &&
          this.playerY === animal.y
        ) {
          this.play("hit");
          this.loseLife();
          if (!this.isGameOver()) {
            this.resetPlayerPosition();
          }
          return;
        }
      }
    }

    // Check for collision with cars
    for (const car of cars) {
      if (
        Math.floor(this.playerX) === Math.floor(car.x) &&
        this.playerY === car.y
      ) {
        this.play("explosion");
        this.loseLife();
        if (!this.isGameOver()) {
          this.resetPlayerPosition();
        }
        return; // Only one collision per frame
      }
    }

    // Check for collision with static obstacles from events
    if (
      playerCellContent &&
      playerCellContent.attributes.entityType === "static_obstacle"
    ) {
      this.play("hit");
      this.loseLife();
      if (!this.isGameOver()) {
        this.resetPlayerPosition();
      }
      return;
    }
  }

  public getGameTickCounter(): number {
    return this.gameTickCounter;
  }

  public getCarManager(): CarManager {
    return this.carManager;
  }

  public getEventManager(): EventManager {
    return this.eventManager;
  }

  public getLaneDefinitions(): Array<{ y: number; direction: number }> {
    return this.carManager.getLaneDefinitions();
  }

  public getCars(): Car[] {
    return this.carManager.getCars();
  }

  public spawnStaticObstacle(
    x: number,
    y: number,
    char: string,
    color: cglColor
  ): void {
    this.carManager.spawnStaticObstacle(x, y, char, color);
  }

  public removeStaticObstaclesByChar(char: string): void {
    this.carManager.removeStaticObstaclesByChar(char);
  }

  public removeCarsByIds(ids: number[]): void {
    this.carManager.removeCarsByIds(ids);
  }

  public getMaxCarSpeed(): number {
    return this.carManager.getMaxCarSpeed();
  }

  public spawnCarInLane(
    y: number,
    direction: number,
    options: Partial<Car> = {}
  ): Car {
    return this.carManager.spawnCarInLane(y, direction, options);
  }
}
