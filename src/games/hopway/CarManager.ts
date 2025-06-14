import { cglColor, VIRTUAL_SCREEN_WIDTH } from "../../core/coreTypes";
import { EventManager } from "./events/EventManager";
import { EmergencyVehicleEvent } from "./events/EmergencyVehicleEvent";
import { HopwayGame, HopwayGameOptions } from "./core";
import { PolicePresenceEvent } from "./events/PolicePresenceEvent";
import { Animal } from "./events/Animal";
import { PowerOutageEvent } from "./events/PowerOutageEvent";

// Car Mechanics
const SLOW_CAR_SPEED_FACTOR = 0.4;
const SLOW_CAR_CHAR = "T";
const CAR_CHAR = "#";
const LANE_CHANGE_SIGNAL_DURATION_TICKS = 15;
const LANE_CHANGE_COOLDOWN_TICKS = 30;
const LANE_CHANGE_INITIATE_DISTANCE_FACTOR = 1.5;
const LANE_CHANGE_SAFETY_CHECK_AHEAD_FACTOR = 1.5;
const LANE_CHANGE_SAFETY_CHECK_BEHIND_FACTOR = 1.0;
const SIGNAL_CHAR_UP = "^";
const SIGNAL_CHAR_DOWN = "v";
const WRONG_WAY_AVOIDANCE_DISTANCE = 10;

// New Time-based Spawning Constants
const BASE_SPAWN_INTERVAL_TICKS = 160; // Average ticks between spawns
const SPAWN_INTERVAL_VARIATION_TICKS = 40; // Random variation in spawn time

// Constants from HopwayGame
const TOP_SAFE_ROW = 1;
const BOTTOM_SAFE_ROW = 23;
const MEDIAN_ROW = 12;

export interface CarOptions {
  id: number;
  y: number;
  x: number;
  speed: number;
  originalSpeed: number;
  char: string;
  colorOverride?: string | null;
  isSignaling?: boolean;
  signalTicks?: number;
  targetLaneY?: number | null;
  laneChangeDecision?: "up" | "down" | null;
  ticksSinceLastLaneChange?: number;
  nextActionTick?: number;
  lastTrailCleanupTick?: number;
  targetSpeedOverride?: number | null;
  isStaticObstacle?: boolean;
  isEmergency?: boolean;
  isSlowedByEvent?: boolean;
  isWrongWay?: boolean;
  isClumsy?: boolean;
  isEventCar?: boolean;
  isSlipping?: boolean;
  slipCooldown?: number;
  y_offset?: number;
}

export class Car {
  id: number;
  y: number;
  x: number;
  speed: number;
  originalSpeed: number;
  char: string;
  colorOverride: string | null;
  isSignaling: boolean;
  signalTicks: number;
  targetLaneY: number | null;
  laneChangeDecision: "up" | "down" | null;
  ticksSinceLastLaneChange: number;
  nextActionTick: number;
  lastTrailCleanupTick: number;
  targetSpeedOverride: number | null;
  isStaticObstacle: boolean;
  isEmergency: boolean;
  isSlowedByEvent: boolean;
  isWrongWay: boolean;
  isClumsy: boolean;
  isEventCar: boolean;
  isSlipping: boolean;
  slipCooldown: number;
  y_offset: number;

  constructor(options: CarOptions) {
    this.id = options.id;
    this.y = options.y;
    this.x = options.x;
    this.speed = options.speed;
    this.originalSpeed = options.originalSpeed;
    this.char = options.char;
    this.colorOverride = options.colorOverride ?? null;
    this.isSignaling = options.isSignaling ?? false;
    this.signalTicks = options.signalTicks ?? 0;
    this.targetLaneY = options.targetLaneY ?? null;
    this.laneChangeDecision = options.laneChangeDecision ?? null;
    this.ticksSinceLastLaneChange = options.ticksSinceLastLaneChange ?? 999;
    this.nextActionTick = options.nextActionTick ?? 0;
    this.lastTrailCleanupTick = options.lastTrailCleanupTick ?? 0;
    this.targetSpeedOverride = options.targetSpeedOverride ?? null;
    this.isStaticObstacle = options.isStaticObstacle ?? false;
    this.isEmergency = options.isEmergency ?? false;
    this.isSlowedByEvent = options.isSlowedByEvent ?? false;
    this.isWrongWay = options.isWrongWay ?? false;
    this.isClumsy = options.isClumsy ?? false;
    this.isEventCar = options.isEventCar ?? false;
    this.isSlipping = options.isSlipping ?? false;
    this.slipCooldown = options.slipCooldown ?? 0;
    this.y_offset = options.y_offset ?? 0;
  }

  update(
    carManager: CarManager,
    emergencyVehicle: Car | undefined,
    policeEvent: PolicePresenceEvent | undefined,
    game: HopwayGame,
    animals: Animal[]
  ): void {
    this.ticksSinceLastLaneChange++;

    if (this.slipCooldown > 0) {
      this.slipCooldown--;
      this.x += (Math.random() - 0.5) * 0.6; // Continue to wiggle horizontally
      this.y_offset = (Math.random() - 0.5) * 1.5; // Visual vertical bounce

      if (this.slipCooldown === 0) {
        this.isSlipping = false;
        this.y_offset = 0; // Reset offset when slip ends
      }
    } else {
      this.y_offset = 0; // Ensure it's reset
    }

    // Check for oil slick effect
    const effect = game.getEventManager().getEffectAt(this.x, this.y);
    if (
      effect === "OIL_SLICK" &&
      !this.isSlipping &&
      !this.isStaticObstacle &&
      !this.isSignaling
    ) {
      if (Math.random() < 0.15) {
        // 15% chance to start slipping
        this.isSlipping = true;
        this.slipCooldown = 20; // Slip for 20 ticks
        // One big initial slip
        this.x += (Math.random() - 0.5) * 2.0;
      }
    }

    if (this.isEventCar) {
      this.x += this.speed;
      return;
    }

    if (this.isWrongWay) {
      this.x += this.speed;
      return;
    }

    if (this.isSignaling) {
      this.signalTicks++;
      if (this.signalTicks > LANE_CHANGE_SIGNAL_DURATION_TICKS) {
        if (this.targetLaneY !== null) {
          this.y = this.targetLaneY;
        }
        this.isSignaling = false;
        this.signalTicks = 0;
        this.targetLaneY = null;
        this.laneChangeDecision = null;
        this.ticksSinceLastLaneChange = 0;
      }
      if (this.isStaticObstacle) {
        return;
      }
      this.x += this.speed;
      return;
    }

    if (this.isEmergency) {
      this.x += this.speed;
      return;
    }

    if (this.isStaticObstacle) {
      return;
    }

    // --- Animal Avoidance ---
    const animalInFront = carManager.getAnimalInFront(this, animals);
    if (animalInFront) {
      // Slow down drastically for animals
      this.speed = this.originalSpeed * 0.2;

      // Also try to change lanes
      if (
        this.ticksSinceLastLaneChange > carManager.laneChangeCooldownTicks &&
        !this.isSignaling
      ) {
        carManager.attemptLaneChange(this);
      }
    } else {
      // --- Wrong Way Driver Avoidance ---
      const wrongWayCar = carManager.findOncomingWrongWayCar(this);
      if (
        wrongWayCar &&
        this.ticksSinceLastLaneChange > LANE_CHANGE_COOLDOWN_TICKS &&
        !this.isSignaling
      ) {
        carManager.attemptLaneChange(this);
      }
      // --- End Wrong Way Driver Avoidance ---

      const carInFront = carManager.getCarInFront(this);
      let shouldTryLaneChange = false;
      let targetSpeed = this.originalSpeed;

      if (carInFront) {
        const distanceToFront = Math.abs(carInFront.x - this.x);
        const ownSpeed = Math.abs(this.speed);
        const frontSpeed = Math.abs(carInFront.speed);

        if (
          ownSpeed > frontSpeed &&
          distanceToFront <
            ownSpeed * carManager.laneChangeInitiateDistanceFactor * 10
        ) {
          shouldTryLaneChange = true;
        }

        if (distanceToFront < carManager.getMinCarFollowingDistance()) {
          targetSpeed = carInFront.speed;
        }
      }

      if (
        shouldTryLaneChange &&
        this.ticksSinceLastLaneChange > carManager.laneChangeCooldownTicks
      ) {
        carManager.attemptLaneChange(this);
      }
      this.speed = targetSpeed;
    }

    // Apply speed modifications from events
    if (policeEvent) {
      const policePos = policeEvent.getPoliceCarPosition();
      const distanceToPolice = Math.sqrt(
        Math.pow(this.x - policePos.x, 2) + Math.pow(this.y - policePos.y, 2)
      );

      if (distanceToPolice < policeEvent.getInfluenceRadius()) {
        let legalSpeed =
          this.originalSpeed * policeEvent.getLegalSpeedMultiplier();

        // Define a minimum speed to prevent cars from stopping completely or reversing.
        const MIN_ABSOLUTE_SPEED = 0.1;
        if (Math.abs(legalSpeed) < MIN_ABSOLUTE_SPEED) {
          legalSpeed = MIN_ABSOLUTE_SPEED * Math.sign(this.originalSpeed);
        }

        // Apply the legal speed if it's slower than the car's current speed.
        if (Math.abs(this.speed) > Math.abs(legalSpeed)) {
          this.speed = legalSpeed;
        }
      }
    }

    if (emergencyVehicle && this.id !== emergencyVehicle.id) {
      const isCarInTopHalf = this.y < MEDIAN_ROW;
      const isEmergencyVehicleInTopHalf = emergencyVehicle.y < MEDIAN_ROW;

      if (isCarInTopHalf === isEmergencyVehicleInTopHalf) {
        const SLOWDOWN_RATIO = 0.7;
        const emergencyVehicleSpeedAbs = Math.abs(emergencyVehicle.speed);
        const newSpeedAbs = emergencyVehicleSpeedAbs * SLOWDOWN_RATIO;

        this.speed = newSpeedAbs * Math.sign(this.speed);

        if (
          this.y === emergencyVehicle.y &&
          this.ticksSinceLastLaneChange > LANE_CHANGE_COOLDOWN_TICKS
        ) {
          carManager.attemptLaneChange(this);
        }
      }
    }
    this.x += this.speed;
  }

  public draw(game: HopwayGame): void {
    let charToDraw = this.char;
    if (this.isSignaling && !this.isStaticObstacle) {
      const BLINK_INTERVAL = 8;
      if (this.signalTicks % BLINK_INTERVAL < BLINK_INTERVAL / 2) {
        charToDraw =
          this.laneChangeDecision === "up" ? SIGNAL_CHAR_UP : SIGNAL_CHAR_DOWN;
      }
    }
    game.drawText(charToDraw, this.x, this.y + this.y_offset, {
      color: this.colorOverride ? (this.colorOverride as cglColor) : "white",
    });
  }
}

export class CarManager {
  private game: HopwayGame;
  private cars: Car[];
  private nextCarId: number;
  private lanes: Array<{ y: number; direction: number; nextSpawnTick: number }>;

  // Dedicated tick counter for car spawning (only increments during normal gameplay)
  private carSpawnTickCounter: number = 0;

  // Car configuration
  public maxCarSpeed: number;
  public minCarSpeed: number;
  private minCarFollowingDistance: number;
  private carChar: string;
  public slowCarProbability: number;

  // Event-modifiable parameters
  public spawnIntervalMultiplier: number = 1.0;
  public carSpeedMultiplier: number = 1.0;
  public followingDistanceMultiplier: number = 1.0;

  // Base values for lane changing, can be modified by events
  public laneChangeCooldownTicks: number = LANE_CHANGE_COOLDOWN_TICKS;
  public laneChangeInitiateDistanceFactor: number =
    LANE_CHANGE_INITIATE_DISTANCE_FACTOR;

  constructor(game: HopwayGame, options: HopwayGameOptions) {
    this.game = game;
    this.cars = [];
    this.nextCarId = 0;
    this.lanes = [];

    this.maxCarSpeed = options.maxCarSpeed ?? 0.5;
    this.minCarSpeed = options.minCarSpeed ?? 0.2;
    this.minCarFollowingDistance = options.minCarFollowingDistance ?? 2.0;
    this.carChar = options.carChar ?? CAR_CHAR;
    this.slowCarProbability = options.slowCarProbability ?? 0;

    this.initializeLanes();
  }

  public initialize(): void {
    this.cars = [];
    this.nextCarId = 0;
    this.carSpawnTickCounter = 0; // Reset spawn tick counter
    this.initializeLanes();

    // Reset event-driven parameters
    this.spawnIntervalMultiplier = 1.0;
    this.carSpeedMultiplier = 1.0;
    this.followingDistanceMultiplier = 1.0;
    this.laneChangeCooldownTicks = LANE_CHANGE_COOLDOWN_TICKS;
    this.laneChangeInitiateDistanceFactor =
      LANE_CHANGE_INITIATE_DISTANCE_FACTOR;
  }

  public incrementSpawnTick(): void {
    // Only increment spawn tick counter during normal gameplay
    // This prevents car spam after death/score animations
    this.carSpawnTickCounter++;
  }

  private initializeLanes(): void {
    this.cars = [];
    this.lanes = [];
    for (let y = MEDIAN_ROW + 1; y < BOTTOM_SAFE_ROW; y++) {
      const nextSpawnTick =
        this.carSpawnTickCounter + Math.random() * BASE_SPAWN_INTERVAL_TICKS;
      this.lanes.push({ y, direction: 1, nextSpawnTick });
    }
    for (let y = TOP_SAFE_ROW + 1; y < MEDIAN_ROW; y++) {
      const nextSpawnTick =
        this.carSpawnTickCounter + Math.random() * BASE_SPAWN_INTERVAL_TICKS;
      this.lanes.push({ y, direction: -1, nextSpawnTick });
    }
  }

  public getCars(): Car[] {
    return this.cars;
  }

  public getCarById(id: number): Car | undefined {
    return this.cars.find((c) => c.id === id);
  }

  public update(animals: Animal[]): void {
    this.updateCarsAndHandleSpawning(animals);
  }

  public draw(): void {
    const powerOutageEvent = this.game
      .getEventManager()
      .getActiveEventByType("POWER_OUTAGE") as PowerOutageEvent | undefined;
    const darkZone = powerOutageEvent?.getDarkZone();

    for (const car of this.cars) {
      if (car.isStaticObstacle) {
        this.game.drawText(car.char, car.x, car.y, {
          color: car.colorOverride as cglColor,
        });
      } else {
        const carY = car.y + car.y_offset; // Use offset for visual effects
        const isInDarkZone =
          darkZone &&
          car.y >= darkZone.y &&
          car.y < darkZone.y + darkZone.height;

        // Only draw car body if not in the dark zone
        if (!isInDarkZone) {
          this.game.drawText(car.char, car.x, carY, {
            color: this.getCarColor(car),
          });
        }

        // Headlights during power outage
        if (isInDarkZone && !car.isWrongWay) {
          const lane = this.lanes.find((l) => l.y === car.y);
          if (lane) {
            const direction = lane.direction;
            const headlightChar =
              this.game.getGameTickCounter() % 10 < 5 ? ":" : "."; // Flickering effect
            this.game.drawText(headlightChar, car.x + direction, carY, {
              color: "yellow",
            });
          }
        }

        if (car.isSignaling) {
          const signalChar =
            car.laneChangeDecision === "up" ? SIGNAL_CHAR_UP : SIGNAL_CHAR_DOWN;
          this.game.drawText(signalChar, car.x, car.y, {
            color: "yellow",
          });
        }
      }
    }
  }

  private getCarColor(car: Car): cglColor {
    // Check for color override first
    if (car.colorOverride) return car.colorOverride as cglColor;

    if (car.isWrongWay) return "red";
    if (car.isEmergency) return "light_red";
    if (car.isClumsy) return "yellow";
    if (car.char === SLOW_CAR_CHAR) return "cyan";
    return "white";
  }

  private updateCarsAndHandleSpawning(animals: Animal[]): void {
    const emergencyVehicleEvent = this.game
      .getEventManager()
      .getActiveEventByType("EMERGENCY_VEHICLE") as
      | EmergencyVehicleEvent
      | undefined;
    const emergencyVehicle = emergencyVehicleEvent?.getVehicle();

    // Update active cars and handle despawning
    this.cars = this.cars.filter((car) => {
      car.update(
        this,
        emergencyVehicle ? emergencyVehicle : undefined,
        this.game.getEventManager().getActiveEventByType("POLICE_PRESENCE") as
          | PolicePresenceEvent
          | undefined,
        this.game,
        animals
      );

      const isOffScreen =
        (car.speed > 0 && car.x >= VIRTUAL_SCREEN_WIDTH) ||
        (car.speed < 0 && car.x < 0);
      if (isOffScreen && !car.isEventCar) {
        return false; // Remove car
      }
      return true;
    });

    // Handle new car spawning using dedicated spawn tick counter
    for (const lane of this.lanes) {
      if (this.carSpawnTickCounter >= lane.nextSpawnTick) {
        const isSlow = Math.random() < this.slowCarProbability;
        this.spawnCar(lane.y, lane.direction, isSlow);
        const spawnInterval =
          (BASE_SPAWN_INTERVAL_TICKS +
            (Math.random() * SPAWN_INTERVAL_VARIATION_TICKS -
              SPAWN_INTERVAL_VARIATION_TICKS / 2)) /
          this.spawnIntervalMultiplier;
        lane.nextSpawnTick = this.carSpawnTickCounter + spawnInterval;
      }
    }
  }

  public getCarInFront(currentCar: Car): Car | undefined {
    if (currentCar.isWrongWay) return undefined;
    let closestCarInFront: Car | undefined = undefined;
    let minDistance = Infinity;

    this.cars.forEach((otherCar) => {
      if (currentCar.id === otherCar.id || currentCar.y !== otherCar.y) {
        return;
      }

      const distance =
        (otherCar.x - currentCar.x) * Math.sign(currentCar.speed);

      if (distance > 0 && distance < minDistance) {
        minDistance = distance;
        closestCarInFront = otherCar;
      }
    });

    return closestCarInFront;
  }

  public isLaneSafe(
    targetY: number,
    currentCar: Car,
    direction: number
  ): boolean {
    if (
      targetY <= TOP_SAFE_ROW ||
      targetY >= BOTTOM_SAFE_ROW ||
      targetY === MEDIAN_ROW
    ) {
      return false;
    }

    for (const car of this.cars) {
      if (car.y === targetY) {
        const relativePos = car.x - currentCar.x;
        const safetyMarginAhead =
          Math.abs(currentCar.speed) *
          LANE_CHANGE_SAFETY_CHECK_AHEAD_FACTOR *
          10;
        const safetyMarginBehind =
          Math.abs(car.speed) * LANE_CHANGE_SAFETY_CHECK_BEHIND_FACTOR * 10;

        if (direction > 0 && relativePos > 0 && relativePos < safetyMarginAhead)
          return false;
        if (
          direction < 0 &&
          relativePos < 0 &&
          -relativePos < safetyMarginAhead
        )
          return false;

        if (
          direction > 0 &&
          relativePos < 0 &&
          -relativePos < safetyMarginBehind
        )
          return false;
        if (
          direction < 0 &&
          relativePos > 0 &&
          relativePos < safetyMarginBehind
        )
          return false;
      }
    }
    return true;
  }

  public attemptLaneChange(car: Car): void {
    const direction = Math.sign(car.speed);
    const possibleLanes: ("up" | "down")[] =
      Math.random() > 0.5 ? ["up", "down"] : ["down", "up"];

    for (const decision of possibleLanes) {
      const targetY = car.y + (decision === "up" ? -1 : 1);
      if (this.isLaneSafe(targetY, car, direction)) {
        car.isSignaling = true;
        car.signalTicks = 0;
        car.targetLaneY = targetY;
        car.laneChangeDecision = decision;
        return;
      }
    }
  }

  public getLaneDefinitions(): Array<{ y: number; direction: number }> {
    return this.lanes.map((lane) => ({ y: lane.y, direction: lane.direction }));
  }

  public getMinCarFollowingDistance(): number {
    return this.minCarFollowingDistance * this.followingDistanceMultiplier;
  }

  private spawnCar(
    y: number,
    direction: number,
    isSlow: boolean,
    spawnBehind: boolean = false
  ): void {
    const startX = direction > 0 ? -1 : VIRTUAL_SCREEN_WIDTH;
    const baseSpeed =
      this.minCarSpeed + Math.random() * (this.maxCarSpeed - this.minCarSpeed);
    let speed = direction * baseSpeed * this.carSpeedMultiplier;
    let char = this.carChar;

    if (isSlow) {
      speed *= SLOW_CAR_SPEED_FACTOR;
      char = SLOW_CAR_CHAR;
    }

    const newCar = new Car({
      id: this.nextCarId++,
      y,
      x: startX,
      speed: speed,
      originalSpeed: speed,
      char: char,
    });
    this.cars.push(newCar);

    if (isSlow && spawnBehind) {
      this.spawnCar(y, direction, false, false);
    }
  }

  private isCarNearEdge(y: number, direction: number): boolean {
    const edgeX = direction > 0 ? 0 : VIRTUAL_SCREEN_WIDTH - 1;
    const checkWidth = 5;
    for (const car of this.cars) {
      if (car.y === y) {
        if (direction > 0 && car.x < checkWidth) return true;
        if (direction < 0 && car.x > edgeX - checkWidth) return true;
      }
    }
    return false;
  }

  public spawnStaticObstacle(
    x: number,
    y: number,
    char: string,
    color: cglColor
  ): void {
    this.cars.push(
      new Car({
        id: this.nextCarId++,
        y,
        x,
        speed: 0,
        originalSpeed: 0,
        char,
        colorOverride: color,
        ticksSinceLastLaneChange: 9999,
        isStaticObstacle: true,
      })
    );
  }

  public removeStaticObstaclesByChar(char: string): void {
    this.cars = this.cars.filter(
      (car) => !(car.isStaticObstacle && car.char === char)
    );
  }

  public removeCarsByIds(ids: number[]): void {
    this.cars = this.cars.filter((car) => !ids.includes(car.id));
  }

  public getMaxCarSpeed(): number {
    return this.maxCarSpeed;
  }

  public spawnCarInLane(
    y: number,
    direction: number,
    options: Partial<CarOptions> = {}
  ): Car {
    const baseSpeed =
      options.speed ??
      this.minCarSpeed + Math.random() * (this.maxCarSpeed - this.minCarSpeed);
    const speed = baseSpeed * direction;
    const carChar = options.char ?? this.carChar;

    const newCar = new Car({
      id: this.nextCarId++,
      y: y,
      x: direction > 0 ? -1 : VIRTUAL_SCREEN_WIDTH,
      speed: speed,
      originalSpeed: speed,
      char: carChar,
      ...options,
    });

    this.cars.push(newCar);
    return newCar;
  }

  public spawnWrongWayCar(): Car | null {
    const laneDefs = this.getLaneDefinitions();
    const availableLanes = laneDefs.filter(
      (lane) =>
        !this.isCarNearEdge(lane.y, lane.direction) &&
        !this.cars.some((c) => c.y === lane.y && c.isWrongWay)
    );

    if (availableLanes.length === 0) {
      return null;
    }

    const lane =
      availableLanes[Math.floor(Math.random() * availableLanes.length)];
    const speed =
      this.maxCarSpeed * 1.5 * this.carSpeedMultiplier * -lane.direction; // Faster and opposite direction

    return this.spawnCarInLane(lane.y, -lane.direction, {
      speed: speed,
      originalSpeed: speed,
      colorOverride: "light_red",
      isWrongWay: true,
      char: "W",
    });
  }

  public findOncomingWrongWayCar(currentCar: Car): Car | undefined {
    const wrongWayCars = this.cars.filter((c) => c.isWrongWay);
    for (const wrongWayCar of wrongWayCars) {
      if (wrongWayCar.y !== currentCar.y) {
        continue; // Not in the same lane
      }

      const distance = Math.abs(currentCar.x - wrongWayCar.x);
      if (distance > WRONG_WAY_AVOIDANCE_DISTANCE) {
        continue; // Too far away
      }

      const isCarMovingRight = currentCar.speed > 0;
      // Check if they are on a collision course
      if (isCarMovingRight && wrongWayCar.x > currentCar.x) {
        return wrongWayCar; // Current car is moving right, WW car is to the right
      }
      if (!isCarMovingRight && wrongWayCar.x < currentCar.x) {
        return wrongWayCar; // Current car is moving left, WW car is to the left
      }
    }
    return undefined;
  }

  public getLaneYCoords(): number[] {
    return this.lanes.map((lane) => lane.y);
  }

  public getAnimalInFront(
    currentCar: Car,
    animals: Animal[]
  ): Animal | undefined {
    const carDirection = Math.sign(currentCar.speed);
    if (carDirection === 0) return undefined;

    let closestAnimal: Animal | undefined = undefined;
    let minDistance = Infinity;

    for (const animal of animals) {
      if (animal.y !== currentCar.y) continue;

      const distance = (animal.x - currentCar.x) * carDirection;
      if (distance > 0 && distance < minDistance) {
        minDistance = distance;
        closestAnimal = animal;
      }
    }

    // Only react to animals that are close
    if (minDistance < Math.abs(currentCar.speed * 20)) {
      // React within 20 ticks of travel
      return closestAnimal;
    }

    return undefined;
  }
}
