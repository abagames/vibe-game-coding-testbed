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

// Score Zone Constants
interface ScoreZone {
  x: number;
  width: number;
  multiplier: number;
  char: string;
  color: cglColor;
}

class ScoreZoneManager {
  private zones: ScoreZone[] = [];
  private lastGenerationTick: number = 0;
  private readonly generationInterval: number = 600; // Generate new zones every 10 seconds

  public generateZones(): void {
    this.zones = [];
    const availablePositions: number[] = [];

    // Create list of all possible starting positions
    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      availablePositions.push(x);
    }

    // Try to place zones
    const zoneTypes = [
      {
        multiplier: 2,
        width: 6,
        probability: 0.5,
        char: "2",
        color: "green" as cglColor,
      },
      {
        multiplier: 3,
        width: 4,
        probability: 1 / 3,
        char: "3",
        color: "yellow" as cglColor,
      },
      {
        multiplier: 5,
        width: 2,
        probability: 0.2,
        char: "5",
        color: "red" as cglColor,
      },
    ];

    for (const zoneType of zoneTypes) {
      if (Math.random() < zoneType.probability) {
        // Find a valid position for this zone
        const validPositions = availablePositions.filter(
          (x) =>
            x + zoneType.width <= VIRTUAL_SCREEN_WIDTH &&
            this.canPlaceZone(x, zoneType.width)
        );

        if (validPositions.length > 0) {
          const randomIndex = Math.floor(Math.random() * validPositions.length);
          const startX = validPositions[randomIndex];

          // Create zone
          this.zones.push({
            x: startX,
            width: zoneType.width,
            multiplier: zoneType.multiplier,
            char: zoneType.char,
            color: zoneType.color,
          });

          // Remove occupied positions
          for (let i = startX; i < startX + zoneType.width; i++) {
            const index = availablePositions.indexOf(i);
            if (index > -1) {
              availablePositions.splice(index, 1);
            }
          }
        }
      }
    }
  }

  private canPlaceZone(x: number, width: number): boolean {
    // Check if the zone would overlap with existing zones
    for (const zone of this.zones) {
      if (!(x >= zone.x + zone.width || x + width <= zone.x)) {
        return false; // Overlaps
      }
    }
    return true;
  }

  public shouldGenerateNewZones(currentTick: number): boolean {
    return currentTick - this.lastGenerationTick >= this.generationInterval;
  }

  public markGenerated(currentTick: number): void {
    this.lastGenerationTick = currentTick;
  }

  public getZones(): ScoreZone[] {
    return this.zones;
  }

  public getMultiplierAt(x: number): number {
    for (const zone of this.zones) {
      if (x >= zone.x && x < zone.x + zone.width) {
        return zone.multiplier;
      }
    }
    return 1; // Default multiplier
  }

  public reset(): void {
    this.zones = [];
    this.lastGenerationTick = 0;
  }
}

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
  forceRoadConstruction?: boolean; // For testing construction obstacles
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
  private playerCanMove: boolean; // Prevents movement until first key press after respawn
  private previousInputState: InputState; // Track previous frame input for isJustPressed detection

  // Death animation state
  private isPlayingDeathAnimation: boolean = false;
  private deathAnimationStartTick: number = 0;
  private readonly deathAnimationDurationTicks: number = 120; // 2 seconds at 60fps
  private deathAnimationFrame: number = 0;

  // Score display animation state
  private isShowingScoreDisplay: boolean = false;
  private scoreDisplayStartTick: number = 0;
  private readonly scoreDisplayDurationTicks: number = 60; // 1 second at 60fps
  private scoreDisplayText: string = "";
  private scoreDisplayX: number = 0;
  private scoreDisplayY: number = 0;

  private playerMoveInterval: number;
  private safeZoneChar: string;

  private eventManager: EventManager;
  private carManager: CarManager;
  private options: HopwayGameOptions;
  private scoreZoneManager: ScoreZoneManager;

  public gameTickCounter: number = 0;

  // Time-based scoring system
  private timeScore: number = 1000; // Starting score that decreases over time
  private lastTimeScoreDecreaseTick: number = 0;
  private readonly timeScoreDecreaseInterval: number = 1; // Decrease every 60 ticks (1 second at 60fps)
  private readonly timeScoreDecreaseAmount: number = 1; // Amount to decrease per interval

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
    this.playerCanMove = false;
    this.previousInputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      action1: false,
      r: false,
    };
    this.isPlayingDeathAnimation = false;
    this.deathAnimationStartTick = 0;
    this.deathAnimationFrame = 0;

    this.eventManager = new EventManager(this);
    this.carManager = new CarManager(this, options);
    this.scoreZoneManager = new ScoreZoneManager();

    this.eventManager.registerEventType(
      "TRAFFIC_JAM",
      () => new TrafficJamEvent({ duration: 300 }), // ~5 seconds at 60tps
      0.002,
      1800 // Cooldown ticks
    );
    this.eventManager.registerEventType(
      "BROKEN_DOWN_CAR",
      () => new BrokenDownCarEvent({ duration: 900 }), // ~15 seconds
      0.001,
      2400 // Cooldown
    );
    this.eventManager.registerEventType(
      "ROAD_CONSTRUCTION",
      () => new RoadConstructionEvent({ duration: 1200 }), // ~20 seconds
      0.001,
      3000 // Cooldown
    );
    this.eventManager.registerEventType(
      "EMERGENCY_VEHICLE",
      () => new EmergencyVehicleEvent(),
      0.003,
      3000 // Cooldown
    );
    this.eventManager.registerEventType(
      "CAR_COLLISION",
      () => new CarCollisionEvent({ duration: 600 }),
      0.002,
      1200 // Cooldown
    );
    this.eventManager.registerEventType(
      "WRONG_WAY_DRIVER",
      () => new WrongWayDriverEvent(),
      0.003,
      2500 // Cooldown
    );
    this.eventManager.registerEventType(
      "CLUMSY_TRUCK",
      () => new ClumsyTruckEvent(),
      0.002,
      2000 // Cooldown
    );
    this.eventManager.registerEventType(
      "WEATHER",
      () => new WeatherEvent({ duration: 900 }), // ~15 seconds
      0.0025,
      3000 // Cooldown
    );
    this.eventManager.registerEventType(
      "POLICE_PRESENCE",
      () => new PolicePresenceEvent(this),
      0.0015,
      4000 // Cooldown
    );
    this.eventManager.registerEventType(
      "VIP_ESCORT",
      () => new VIPEscortEvent(),
      0.001,
      8000 // Long cooldown
    );
    this.eventManager.registerEventType(
      "OIL_SLICK",
      () => new OilSlickEvent(),
      0.003,
      2000 // Cooldown
    );
    this.eventManager.registerEventType(
      "RUSH_HOUR",
      () => new RushHourEvent({}), // Use default options
      0.001,
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
      0.0015,
      4000 // Cooldown
    );
  }

  public initializeGame(): void {
    super.resetGame();
    this.playerX = PLAYER_START_X;
    this.playerY = PLAYER_START_Y;
    this.lastPlayerMoveTick = -1;
    this.gameTickCounter = 0;
    this.playerSlipState = { isSlipping: false, dx: 0, dy: 0, ticks: 0 };
    this.playerCanMove = false;
    this.previousInputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      action1: false,
      r: false,
    };
    this.timeScore = 1000;
    this.lastTimeScoreDecreaseTick = 0;
    this.isPlayingDeathAnimation = false;
    this.deathAnimationStartTick = 0;
    this.deathAnimationFrame = 0;
    this.carManager.initialize();
    this.eventManager.reset();
    this.scoreZoneManager.reset();
    this.scoreZoneManager.generateZones();
    this.scoreZoneManager.markGenerated(this.gameTickCounter);

    if (this.options.forceWeather) {
      this.eventManager.manuallyTriggerEvent(
        new WeatherEvent({
          type: this.options.forceWeather,
          duration: 9999,
        })
      );
    }

    if (this.options.forceRoadConstruction) {
      this.eventManager.manuallyTriggerEvent(
        new RoadConstructionEvent({ duration: 9999 })
      );
    }
  }

  public updateGame(inputState: InputState): void {
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

    // Handle death animation
    if (this.isPlayingDeathAnimation) {
      this.updateDeathAnimation();
      this.drawEverything();
      return;
    }

    // Handle score display animation - but continue game updates
    if (this.isShowingScoreDisplay) {
      this.updateScoreDisplay();
      // Continue game updates during score display
      this.updateTimeScore();
      this.updateScoreZones();
      this.eventManager.update(inputState);
      // Don't update player state during score display

      const animalEvent = this.eventManager.getActiveEventByType(
        "ANIMAL_CROSSING"
      ) as AnimalCrossingEvent | undefined;
      const animals = animalEvent ? animalEvent.getAnimals() : [];
      this.carManager.update(animals);

      this.drawEverything();
      this.drawScoreDisplay();
      return;
    }

    this.updateTimeScore();
    this.updateScoreZones();
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
    // Calculate score with multiplier based on player position
    const multiplier = this.scoreZoneManager.getMultiplierAt(this.playerX);
    const baseScore = 100 + this.timeScore;
    const finalScore = baseScore * multiplier;

    this.addScore(finalScore);
    this.play("powerUp");

    // Show multiplier effect if > 1
    if (multiplier > 1) {
      console.log(
        `Score multiplied by ${multiplier}x! ${baseScore} × ${multiplier} = ${finalScore}`
      );
    }

    // Reset time score for next level
    this.timeScore = 1000;
    this.lastTimeScoreDecreaseTick = this.gameTickCounter;

    // Generate new score zones for next level
    this.scoreZoneManager.generateZones();
    this.scoreZoneManager.markGenerated(this.gameTickCounter);

    // Show score display for 1 second at the goal position
    this.isShowingScoreDisplay = true;
    this.scoreDisplayStartTick = this.gameTickCounter;
    this.scoreDisplayText = `+${finalScore.toLocaleString()}`;
    this.scoreDisplayX = this.playerX; // Show at the goal position where player completed
    this.scoreDisplayY = this.playerY; // Show at the goal position where player completed
  }

  private updateTimeScore(): void {
    // Decrease time score over time
    if (
      this.gameTickCounter - this.lastTimeScoreDecreaseTick >=
      this.timeScoreDecreaseInterval
    ) {
      this.timeScore = Math.max(
        0,
        this.timeScore - this.timeScoreDecreaseAmount
      );
      this.lastTimeScoreDecreaseTick = this.gameTickCounter;
    }
  }

  private updateScoreZones(): void {
    // Score zones are only generated when player completes a level
    // No periodic generation during gameplay
  }

  private updateDeathAnimation(): void {
    const elapsedTicks = this.gameTickCounter - this.deathAnimationStartTick;
    this.deathAnimationFrame = elapsedTicks;

    if (elapsedTicks >= this.deathAnimationDurationTicks) {
      // Animation finished, respawn player
      this.isPlayingDeathAnimation = false;
      // Now actually lose the life after animation
      super.loseLife();
      if (!this.isGameOver()) {
        this.resetPlayerPosition();
      }
    }
  }

  private updateScoreDisplay(): void {
    const elapsedTicks = this.gameTickCounter - this.scoreDisplayStartTick;

    if (elapsedTicks >= this.scoreDisplayDurationTicks) {
      // Score display finished, complete the level transition
      this.isShowingScoreDisplay = false;
      this.resetPlayerPosition();
    }
  }

  private startDeathAnimation(): void {
    this.isPlayingDeathAnimation = true;
    this.deathAnimationStartTick = this.gameTickCounter;
    this.deathAnimationFrame = 0;
  }

  public override loseLife(): void {
    // Don't lose life during death animation to prevent immediate game over
    if (this.isPlayingDeathAnimation) {
      return;
    }
    super.loseLife();
  }

  private updatePlayerState(inputState: InputState): void {
    // Don't update player state during death animation
    if (this.isPlayingDeathAnimation) {
      return;
    }

    let canMove =
      this.gameTickCounter - this.lastPlayerMoveTick >= this.playerMoveInterval;

    // Check if player can move (must press a key first after respawn)
    if (!this.playerCanMove) {
      // Enable movement if any directional key is JUST pressed (isJustPressed)
      const isJustPressedUp = inputState.up && !this.previousInputState.up;
      const isJustPressedDown =
        inputState.down && !this.previousInputState.down;
      const isJustPressedLeft =
        inputState.left && !this.previousInputState.left;
      const isJustPressedRight =
        inputState.right && !this.previousInputState.right;

      if (
        isJustPressedUp ||
        isJustPressedDown ||
        isJustPressedLeft ||
        isJustPressedRight
      ) {
        this.playerCanMove = true;
      } else {
        // Update previous input state for next frame
        this.previousInputState = { ...inputState };
        return; // Cannot move until first key press
      }
    }

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

    // Update previous input state for next frame
    this.previousInputState = { ...inputState };
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
    // Don't draw score zones during score display
    if (!this.isShowingScoreDisplay) {
      this.drawScoreZones();
    }
    this.eventManager.drawActiveEvents();
    this.carManager.draw();
    this.drawPlayer();
  }

  public override renderStandardUI(): void {
    // Render score and lives from BaseGame
    super.renderStandardUI();

    // Show time score in the bottom right corner
    const timeScoreText = `Time: ${this.timeScore}`;
    const timeScoreX = VIRTUAL_SCREEN_WIDTH - timeScoreText.length;
    this.drawText(timeScoreText, timeScoreX, VIRTUAL_SCREEN_HEIGHT - 1, {
      color:
        this.timeScore > 500
          ? "green"
          : this.timeScore > 200
          ? "yellow"
          : "red",
    });

    // Custom message rendering (shortened to fit with time score)
    const eventMessage = this.eventManager.getActiveEventMessage();
    if (eventMessage) {
      // Truncate event message if it would overlap with time score
      const maxMessageLength = VIRTUAL_SCREEN_WIDTH - timeScoreText.length - 2;
      const truncatedMessage =
        eventMessage.length > maxMessageLength
          ? eventMessage.substring(0, maxMessageLength - 3) + "..."
          : eventMessage;
      this.drawText(truncatedMessage, 1, VIRTUAL_SCREEN_HEIGHT - 1, {
        color: "yellow",
      });
    } else {
      // Default message if no event is active
      this.drawText("R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
        color: "light_black",
      });
    }
  }

  private getMaxConcurrentEvents(): number {
    const ticksPerSecond = 60;
    const ticksPerMinute = ticksPerSecond * 60;
    const currentMinute = Math.floor(this.gameTickCounter / ticksPerMinute) + 1;
    return Math.min(currentMinute, 7);
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

  private drawScoreZones(): void {
    const zones = this.scoreZoneManager.getZones();
    for (const zone of zones) {
      // Draw the score zone with width-appropriate format
      let zoneText: string;
      if (zone.width === 6) {
        zoneText = `--x${zone.char}--`; // --x2--
      } else if (zone.width === 4) {
        zoneText = `-x${zone.char}-`; // -x3-
      } else if (zone.width === 2) {
        zoneText = `x${zone.char}`; // x5
      } else {
        // Fallback for any other width
        zoneText = `x${zone.char}`;
      }
      this.drawText(zoneText, zone.x, TOP_SAFE_ROW, { color: zone.color });
    }
  }

  private drawPlayer(): void {
    if (this.isPlayingDeathAnimation) {
      // Death animation: cycle through different characters and colors
      const animationChars = ["X", "*", "+", ".", " "];
      const animationColors: cglColor[] = [
        "red",
        "yellow",
        "white",
        "light_black",
        "light_black",
      ];
      const frameRate = 8; // Change character every 8 ticks
      const charIndex =
        Math.floor(this.deathAnimationFrame / frameRate) %
        animationChars.length;

      if (animationChars[charIndex] !== " ") {
        this.drawText(animationChars[charIndex], this.playerX, this.playerY, {
          color: animationColors[charIndex],
        });
      }
    } else {
      this.drawText("P", this.playerX, this.playerY, { color: "cyan" });
    }
  }

  private drawScoreDisplay(): void {
    // Draw the score display text at the goal position in white
    const textLength = this.scoreDisplayText.length;
    let displayX = this.scoreDisplayX;

    // Adjust position to keep text on screen
    if (displayX + textLength > VIRTUAL_SCREEN_WIDTH) {
      displayX = VIRTUAL_SCREEN_WIDTH - textLength;
    }
    if (displayX < 0) {
      displayX = 0;
    }

    this.drawText(this.scoreDisplayText, displayX, this.scoreDisplayY, {
      color: "white",
    });
  }

  private resetPlayerPosition(): void {
    this.playerX = PLAYER_START_X;
    this.playerY = PLAYER_START_Y;
    this.lastPlayerMoveTick = this.gameTickCounter; // Add a small delay before moving again
    this.playerCanMove = false; // Require key press to start moving again
    this.previousInputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      action1: false,
      r: false,
    };
  }

  private checkCollisions(): void {
    const cars = this.carManager.getCars();
    const playerCellContent = this.getCellInfo(this.playerX, this.playerY);

    // Check for collision with cars
    for (const car of cars) {
      if (
        Math.floor(this.playerX) === Math.floor(car.x) &&
        this.playerY === car.y
      ) {
        this.play("explosion");
        this.startDeathAnimation();
        return; // Only one collision per frame
      }
    }

    // Check for collision with static obstacles from events
    if (
      playerCellContent &&
      playerCellContent.attributes.entityType === "static_obstacle"
    ) {
      this.play("hit");
      this.startDeathAnimation();
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

  public getPlayerY(): number {
    return this.playerY;
  }
}
