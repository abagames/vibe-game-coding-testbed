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

// Extra life system constants
const MAX_LIVES = 5;
const INITIAL_EXTRA_LIFE_THRESHOLDS = [10000, 20000, 30000, 50000, 80000]; // Initial Fibonacci-based sequence

// Audio constants for consistent sound design
const AUDIO_PATTERNS = {
  // Emergency vehicle siren
  EMERGENCY_SIREN: "@synth@s12345 v60 l8 o5 c>c<c>c<c>c<",

  // Police siren
  POLICE_SIREN: "@synth@s54321 v50 l4 o5 c>c<r4c>c<r4c>c<r4",

  // Traffic jam horn sounds
  TRAFFIC_JAM_HORNS: [
    "@synth@s11111 v40 l4 o4 c2",
    "@synth@s22222 v35 l4 o3 f2",
    "@synth@s33333 v30 l4 o4 g2",
  ],

  // Construction machinery
  CONSTRUCTION_NOISE: "@hit@d@s99999 v30 l16 o4 cr cr cr cr",

  // Weather effects
  RAIN_SOUND: "@synth@s77777 v20 l32 o6 crcrcrcrcrcrcr",
  THUNDER: "@explosion@s88888 v70 l1 o2 c",

  // Level complete fanfare
  LEVEL_COMPLETE_FANFARE: [
    "@synth@s333 v90 l16 o4 c e g >c< e g >c<", // Victory melody
    "@synth@s600 v60 l8 o3 c g c g c", // Harmony
  ],

  // Extra life jingle
  EXTRA_LIFE_JINGLE: [
    "@synth@s100 v90 l8 o5 ceg>c<egc",
    "@synth@s200 v80 l4 o4 cg",
  ],

  // Danger warning
  DANGER_WARNING: [
    "@laser@s1000 v80 l16 o6 c r c r c r c r",
    "@synth@s1100 v40 l8 o4 c+ r c+ r c+ r c+ r",
  ],

  // Time running out warning
  TIME_WARNING: "@synth@s800 v50 l4 o5 c r c r c r >c<",

  // Oil slick slip sound
  OIL_SLIP: "@laser@s666 v40 l16 o4 c>c<c>c<c>c<",

  // Animal crossing sounds
  ANIMAL_SOUNDS: [
    "@synth@s111 v30 l8 o4 ege", // Bird chirp (simplified)
    "@synth@s222 v25 l4 o3 c2", // Low animal sound
    "@synth@s333 v35 l16 o5 crcrcr", // Quick animal movement
  ],
} as const;

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

  // Extra life system
  private extraLifeThresholdIndex: number = 0; // Track which threshold we're checking next

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
      () => new WeatherEvent({ duration: 600 }),
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
    this.extraLifeThresholdIndex = 0;
    this.isPlayingDeathAnimation = false;
    this.deathAnimationStartTick = 0;
    this.deathAnimationFrame = 0;
    this.carManager.initialize();
    this.eventManager.reset();
    this.scoreZoneManager.reset();
    this.scoreZoneManager.generateZones();
    this.scoreZoneManager.markGenerated(this.gameTickCounter);

    // Start background music for the game
    this.playBgm();

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

  protected updateGame(inputState: InputState): void {
    if (this.isGameOver()) {
      return;
    }

    this.gameTickCounter++;

    // Handle death animation
    if (this.isPlayingDeathAnimation && !this.isDemoPlay) {
      this.updateDeathAnimation();
      return;
    }

    // Handle score display animation - but continue game updates
    if (this.isShowingScoreDisplay && !this.isDemoPlay) {
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

      return;
    }

    // Skip time score updates during demo mode (demo doesn't need scoring)
    if (!this.isDemoPlay) {
      this.updateTimeScore();
      // Removed frequent background music to avoid audio spam
      // Background music is now only played at game start
    }
    this.updateScoreZones();
    this.eventManager.update(inputState);

    // Skip player-related processing during demo mode
    if (!this.isDemoPlay) {
      this.updatePlayerState(inputState);
    }

    const animalEvent = this.eventManager.getActiveEventByType(
      "ANIMAL_CROSSING"
    ) as AnimalCrossingEvent | undefined;
    const animals = animalEvent ? animalEvent.getAnimals() : [];

    // Increment car spawn tick counter only during normal gameplay
    this.carManager.incrementSpawnTick();
    this.carManager.update(animals);

    // Skip collision detection and level completion during demo mode
    if (!this.isDemoPlay) {
      this.checkCollisions();

      if (this.playerY === TOP_SAFE_ROW) {
        this.levelComplete();
      }
    }
  }

  private levelComplete(): void {
    // Calculate score with multiplier based on player position
    const multiplier = this.scoreZoneManager.getMultiplierAt(this.playerX);
    const baseScore = 100 + this.timeScore;
    const finalScore = baseScore * multiplier;

    this.addScore(finalScore);
    this.checkForExtraLife();

    // Enhanced audio for level completion
    if (multiplier > 1) {
      // Special fanfare for multiplier zones
      this.play("powerUp", 999);
      console.log(
        `Score multiplied by ${multiplier}x! ${baseScore} × ${multiplier} = ${finalScore}`
      );
    } else {
      // Standard level complete sound
      this.play("powerUp");
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
      const previousTimeScore = this.timeScore;
      this.timeScore = Math.max(
        0,
        this.timeScore - this.timeScoreDecreaseAmount
      );
      this.lastTimeScoreDecreaseTick = this.gameTickCounter;

      // Audio warnings for low time score
      if (previousTimeScore > 100 && this.timeScore <= 100) {
        // First warning at 100 points
        this.playMml(AUDIO_PATTERNS.TIME_WARNING);
      } else if (previousTimeScore > 50 && this.timeScore <= 50) {
        // More urgent warning at 50 points
        this.playMml([...AUDIO_PATTERNS.DANGER_WARNING]);
      } else if (previousTimeScore > 10 && this.timeScore <= 10) {
        // Critical warning at 10 points
        this.play("laser", 999);
      }

      // Player dies when timer reaches 0
      if (previousTimeScore > 0 && this.timeScore <= 0) {
        // Play death sound and start death animation
        this.play("explosion", 999);
        this.startDeathAnimation();
      }
    }
  }

  private updateScoreZones(): void {
    // Score zones are only generated when player completes a level
    // No periodic generation during gameplay
  }

  private drawScoreZones(): void {
    // Don't draw score zones during demo mode
    if (this.isDemoPlay) {
      return;
    }

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

  private getNextExtraLifeThreshold(): number {
    if (this.extraLifeThresholdIndex < INITIAL_EXTRA_LIFE_THRESHOLDS.length) {
      return INITIAL_EXTRA_LIFE_THRESHOLDS[this.extraLifeThresholdIndex];
    } else {
      // Continue Fibonacci sequence after initial thresholds
      // 80000 + 50000 = 130000, then 130000 + 80000 = 210000, etc.
      const fibIndex =
        this.extraLifeThresholdIndex - INITIAL_EXTRA_LIFE_THRESHOLDS.length;
      let prev1 = 50000; // Second to last initial threshold
      let prev2 = 80000; // Last initial threshold

      for (let i = 0; i <= fibIndex; i++) {
        const next = prev1 + prev2;
        prev1 = prev2;
        prev2 = next;
      }

      return prev2;
    }
  }

  private checkForExtraLife(): void {
    const currentScore = this.getScore();
    const nextThreshold = this.getNextExtraLifeThreshold();

    if (currentScore >= nextThreshold && this.getLives() < MAX_LIVES) {
      this.gainLife(1);
      // Special extra life jingle
      this.playMml([...AUDIO_PATTERNS.EXTRA_LIFE_JINGLE]);
      console.log(
        `Extra life earned at ${nextThreshold.toLocaleString()} points! Lives: ${this.getLives()}`
      );
      this.extraLifeThresholdIndex++;
    }
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
        // Play subtle game start sound on first movement only
        this.play("select");
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

        // Remove frequent movement sounds to avoid audio spam
        // Only play sound for special movements or important actions

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
          // Enhanced oil slip sound
          this.playMml(AUDIO_PATTERNS.OIL_SLIP);
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
    // Don't render game elements or UI during game over
    if (this.isGameOver()) {
      return;
    }

    // Always draw the game elements first
    this.drawEverything();

    // Draw score display if active (but not during demo mode)
    if (this.isShowingScoreDisplay && !this.isDemoPlay) {
      this.drawScoreDisplay();
    }

    // Don't render UI during demo mode (GameManager will handle title screen UI)
    if (this.isDemoPlay) {
      return;
    }

    // Top row: Score (left), High Score (right), Lives (center)
    // Current score on the left
    this.drawText(`${this.getScore()}`, 1, 0, { color: "white" });

    // High score on the right with "HI" prefix (blasnake style)
    const hiScoreText = `HI ${this.getHighScore()}`;
    const hiScoreX = VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1;
    this.drawText(hiScoreText, hiScoreX, 0, { color: "yellow" });

    // Remaining lives as characters in the center (blasnake style)
    const remainingLives = Math.min(this.getLives() - 1, MAX_LIVES - 1); // Don't show current life, cap at 4
    if (remainingLives > 0) {
      const livesStartX = Math.floor(
        (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
      );
      for (let i = 0; i < remainingLives; i++) {
        this.drawText("P", livesStartX + i * 2, 0, { color: "cyan" });
      }
    }

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

  private drawPlayer(): void {
    // Don't draw player during demo mode
    if (this.isDemoPlay) {
      return;
    }

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

    // Reset timer when player respawns
    this.timeScore = 1000;
    this.lastTimeScoreDecreaseTick = this.gameTickCounter;

    // Car spawn timing is now handled by dedicated tick counter
    // No need to reset timers as the counter only increments during normal gameplay
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
        // Enhanced car collision sound with variation based on car type
        this.play("explosion", car.id || this.gameTickCounter);

        // Add dramatic crash sound for high-speed collisions
        if (car.speed && Math.abs(car.speed) > 0.5) {
          this.playMml("@explosion@s" + (car.id || 123) + " v80 l8 o2 c4r4c4");
        }

        this.startDeathAnimation();
        return; // Only one collision per frame
      }
    }

    // Check for collision with static obstacles from events
    if (
      playerCellContent &&
      playerCellContent.attributes.entityType === "static_obstacle"
    ) {
      // Different sound for static obstacle collision
      this.play("hit", this.gameTickCounter % 200);
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

  // Enhanced audio methods for event-specific sounds
  public playEventSound(eventType: string, variation?: number): void {
    const seed = variation || this.gameTickCounter;

    switch (eventType) {
      case "EMERGENCY_VEHICLE":
        this.playMml(AUDIO_PATTERNS.EMERGENCY_SIREN);
        break;
      case "POLICE_PRESENCE":
        this.playMml(AUDIO_PATTERNS.POLICE_SIREN);
        break;
      case "TRAFFIC_JAM":
        // Play random horn sound from the array
        const hornIndex = seed % AUDIO_PATTERNS.TRAFFIC_JAM_HORNS.length;
        this.playMml(AUDIO_PATTERNS.TRAFFIC_JAM_HORNS[hornIndex]);
        break;
      case "ROAD_CONSTRUCTION":
        this.playMml(AUDIO_PATTERNS.CONSTRUCTION_NOISE);
        break;
      case "WEATHER_RAIN":
        this.playMml(AUDIO_PATTERNS.RAIN_SOUND);
        break;
      case "WEATHER_STORM":
        this.playMml(AUDIO_PATTERNS.THUNDER);
        break;
      case "ANIMAL_CROSSING":
        // Play random animal sound
        const animalIndex = seed % AUDIO_PATTERNS.ANIMAL_SOUNDS.length;
        this.playMml(AUDIO_PATTERNS.ANIMAL_SOUNDS[animalIndex]);
        break;
      case "CAR_COLLISION":
        this.play("explosion", seed);
        this.playMml("@explosion@s" + seed + " v60 l4 o3 c2r2c2");
        break;
      case "WRONG_WAY_DRIVER":
        // Danger warning for wrong way driver
        this.playMml([...AUDIO_PATTERNS.DANGER_WARNING]);
        break;
      case "POWER_OUTAGE":
        // Electronic shutdown sound
        this.playMml("@synth@s" + seed + " v40 l8 o4 c4>c<c4>c<c2");
        break;
      default:
        // Generic event sound
        this.play("select", seed);
        break;
    }
  }

  // Method for events to trigger ambient sounds
  public playAmbientEventSound(eventType: string, intensity: number = 1): void {
    const volume = Math.min(70, 20 + intensity * 10); // Scale volume with intensity
    const seed = this.gameTickCounter + Math.floor(intensity * 100);

    switch (eventType) {
      case "RUSH_HOUR":
        // Continuous traffic noise
        this.playMml(`@synth@s${seed} v${volume} l16 o3 crcrcrcr`);
        break;
      case "WEATHER_RAIN":
        // Continuous rain sound
        this.playMml(
          `@synth@s${seed} v${Math.min(volume, 30)} l32 o6 ${"cr".repeat(8)}`
        );
        break;
      case "CONSTRUCTION":
        // Intermittent construction noise
        if (this.gameTickCounter % 120 === 0) {
          // Every 2 seconds
          this.playMml(`@hit@d@s${seed} v${volume} l16 o4 cr cr cr`);
        }
        break;
    }
  }
}
