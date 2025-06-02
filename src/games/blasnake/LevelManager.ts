import {
  EnemyType,
  SimpleLevel,
  SimpleSpawnPattern,
  SpawnDecision,
} from "./enemies/types.js";

const FRAMES_PER_SECOND = 60;

// Level definition data
const SIMPLE_LEVELS: SimpleLevel[] = [
  // Level 1: Wanderer Introduction (Easy)
  {
    id: 1,
    name: "Basic Training",
    timeThreshold: 0 * FRAMES_PER_SECOND, // Game start
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 3,
      interval: 600, // 10 second interval (600 frames)
      maxTotal: 5,
    },
  },

  // Level 2: Guard Introduction (Easy)
  {
    id: 2,
    name: "Guardian Appears",
    timeThreshold: 20 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.GUARD],
    spawnPattern: {
      enemyType: EnemyType.GUARD,
      count: 2,
      interval: 600,
      maxTotal: 5,
    },
  },

  // Level 3: Wanderer + Guard Mix (Approaching standard difficulty)
  {
    id: 3,
    name: "Mixed Combat I",
    timeThreshold: 40 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER, EnemyType.GUARD],
    spawnPattern: {
      enemyType: EnemyType.WANDERER, // Main
      count: 2,
      interval: 480, // 8 second interval (480 frames)
      maxTotal: 7,
    },
  },

  // Level 4: Chaser Introduction (Standard difficulty)
  {
    id: 4,
    name: "Tracker Appears",
    timeThreshold: 60 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.CHASER],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 2,
      interval: 720, // 12 second interval (720 frames)
      maxTotal: 4,
    },
  },

  // Level 5: Wanderer + Chaser Mix (Standard difficulty)
  {
    id: 5,
    name: "Mixed Combat II",
    timeThreshold: 80 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER, EnemyType.CHASER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 2,
      interval: 420, // 7 second interval (420 frames)
      maxTotal: 6,
    },
  },

  // Level 6: Splitter Introduction (Standard difficulty)
  {
    id: 6,
    name: "Divider Appears",
    timeThreshold: 100 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.SPLITTER],
    spawnPattern: {
      enemyType: EnemyType.SPLITTER,
      count: 1,
      interval: 900, // 15 second interval (900 frames)
      maxTotal: 6,
    },
  },

  // Level 7: 3-Type Mixed Combat (Exceeds standard difficulty)
  {
    id: 7,
    name: "Mixed Combat III",
    timeThreshold: 120 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER, EnemyType.CHASER, EnemyType.SPLITTER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 1,
      interval: 900,
      maxTotal: 7,
    },
  },

  // Level 8: Speedster Introduction (Increased difficulty)
  {
    id: 8,
    name: "High-Speed Combat",
    timeThreshold: 140 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.SPEEDSTER],
    spawnPattern: {
      enemyType: EnemyType.SPEEDSTER,
      count: 3,
      interval: 600,
      maxTotal: 5,
    },
  },

  // Level 9: Mimic Introduction (Increased difficulty)
  {
    id: 9,
    name: "Imitator Appears",
    timeThreshold: 160 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.MIMIC],
    spawnPattern: {
      enemyType: EnemyType.MIMIC,
      count: 2,
      interval: 480,
      maxTotal: 6,
    },
  },

  // Level 10: Snake Introduction (Increased difficulty)
  {
    id: 10,
    name: "Snake Appears",
    timeThreshold: 180 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.SNAKE],
    spawnPattern: {
      enemyType: EnemyType.SNAKE,
      count: 1,
      interval: 1200,
      maxTotal: 3,
    },
  },

  // Level 11: Wall Creeper Introduction (Increased difficulty)
  {
    id: 11,
    name: "Wall Crawler Appears",
    timeThreshold: 200 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WALL_CREEPER],
    spawnPattern: {
      enemyType: EnemyType.WALL_CREEPER,
      count: 3,
      interval: 600,
      maxTotal: 7,
    },
  },

  // Level 12: Ghost Introduction (Increased difficulty)
  {
    id: 12,
    name: "Ghost Appears",
    timeThreshold: 220 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.GHOST],
    spawnPattern: {
      enemyType: EnemyType.GHOST,
      count: 1,
      interval: 600,
      maxTotal: 3,
    },
  },

  // Level 13: Swarm Introduction (Increased difficulty)
  {
    id: 13,
    name: "Swarm Appears",
    timeThreshold: 240 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.SWARM],
    spawnPattern: {
      enemyType: EnemyType.SWARM,
      count: 1,
      interval: 900,
      maxTotal: 5,
    },
  },

  // Level 14-19: High Difficulty Mixed Combat (Around 12-15 enemies)
  {
    id: 14,
    name: "Mixed Combat IV",
    timeThreshold: 260 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.CHASER, EnemyType.SPLITTER, EnemyType.SPEEDSTER],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 1,
      interval: 900,
      maxTotal: 8,
    },
  },

  {
    id: 15,
    name: "Mixed Combat V",
    timeThreshold: 280 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.MIMIC, EnemyType.SNAKE, EnemyType.WALL_CREEPER],
    spawnPattern: {
      enemyType: EnemyType.WALL_CREEPER,
      count: 1,
      interval: 900,
      maxTotal: 8,
    },
  },

  {
    id: 16,
    name: "Mixed Combat VI",
    timeThreshold: 300 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.GHOST, EnemyType.SWARM, EnemyType.SPEEDSTER],
    spawnPattern: {
      enemyType: EnemyType.SPEEDSTER,
      count: 1,
      interval: 900,
      maxTotal: 8,
    },
  },

  {
    id: 17,
    name: "Mixed Combat VII",
    timeThreshold: 320 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [
      EnemyType.WANDERER,
      EnemyType.CHASER,
      EnemyType.SPLITTER,
      EnemyType.MIMIC,
    ],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 1,
      interval: 900,
      maxTotal: 8,
    },
  },

  {
    id: 18,
    name: "Mixed Combat VIII",
    timeThreshold: 340 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [
      EnemyType.SNAKE,
      EnemyType.WALL_CREEPER,
      EnemyType.GHOST,
      EnemyType.SWARM,
    ],
    spawnPattern: {
      enemyType: EnemyType.WALL_CREEPER,
      count: 1,
      interval: 900,
      maxTotal: 8,
    },
  },

  {
    id: 19,
    name: "Final Trial",
    timeThreshold: 360 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [
      EnemyType.CHASER,
      EnemyType.SPEEDSTER,
      EnemyType.MIMIC,
      EnemyType.SNAKE,
      EnemyType.GHOST,
    ],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 1,
      interval: 900,
      maxTotal: 8,
    },
  },

  {
    id: 20,
    name: "All Enemies Integrated",
    timeThreshold: 380 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [
      EnemyType.WANDERER,
      EnemyType.GUARD,
      EnemyType.CHASER,
      EnemyType.SPLITTER,
      EnemyType.SPEEDSTER,
      EnemyType.MIMIC,
      EnemyType.SNAKE,
      EnemyType.WALL_CREEPER,
      EnemyType.GHOST,
      EnemyType.SWARM,
    ],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 1,
      interval: 1200,
      maxTotal: 10,
    },
  },
];

export class SimpleLevelManager {
  private currentLevel: number = 1;
  private levels: SimpleLevel[] = SIMPLE_LEVELS;
  private currentFrame: number = 0;
  private isEndlessMode: boolean = false;
  private endlessMultiplier: number = 1.0;
  private lastEndlessLevelFrame: number = 0;
  private currentEndlessLevel: SimpleLevel | null = null;
  private timeAcceleration: number;

  constructor(timeAcceleration: number = 1.0) {
    this.timeAcceleration = timeAcceleration;
  }

  public incrementFrame(): void {
    this.currentFrame += this.timeAcceleration;
  }

  public getCurrentLevel(): SimpleLevel {
    if (this.isEndlessMode && this.currentEndlessLevel) {
      return this.currentEndlessLevel;
    }
    return this.levels[this.currentLevel - 1];
  }

  public update(): boolean {
    this.incrementFrame();
    if (!this.isEndlessMode) {
      return this.checkLevelUp();
    } else {
      return this.updateEndlessMode();
    }
  }

  private checkLevelUp(): boolean {
    const nextLevelIndex = this.currentLevel - 1;

    if (nextLevelIndex < this.levels.length) {
      if (this.currentLevel === this.levels.length) {
        const levelData = this.levels[this.currentLevel - 1];
        if (this.currentFrame >= levelData.timeThreshold + levelData.duration) {
          this.startEndlessMode();
          return true;
        }
      } else {
        const nextLevelData = this.levels[this.currentLevel];
        if (nextLevelData && this.currentFrame >= nextLevelData.timeThreshold) {
          this.currentLevel++;
          console.log(`Level Up! Now at level ${this.currentLevel}`);
          return true;
        }
      }
    } else {
      if (!this.isEndlessMode) {
        this.startEndlessMode();
        return true;
      }
    }
    return false;
  }

  private startEndlessMode(): void {
    this.isEndlessMode = true;
    this.endlessMultiplier = 1.0;
    this.lastEndlessLevelFrame = this.currentFrame;
    this.selectRandomEndlessLevel();
    console.log("🔄 Endless Mode Started!");
  }

  private updateEndlessMode(): boolean {
    const endlessLevelDurationFrames = 20 * FRAMES_PER_SECOND;
    if (
      this.currentFrame - this.lastEndlessLevelFrame >=
      endlessLevelDurationFrames
    ) {
      this.endlessMultiplier += 0.1;
      this.lastEndlessLevelFrame = this.currentFrame;
      this.selectRandomEndlessLevel();
      console.log(
        `🔄 Endless Level Change! Multiplier: ${this.endlessMultiplier.toFixed(
          1
        )}`
      );
      return true;
    }
    return false;
  }

  private selectRandomEndlessLevel(): void {
    const availableLevels = this.levels.slice(2);
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const baseLevel = availableLevels[randomIndex];
    const endlessLevelDurationFrames = 20 * FRAMES_PER_SECOND;

    this.currentEndlessLevel = {
      ...baseLevel,
      id: 999,
      name: `${baseLevel.name} (Endless x${this.endlessMultiplier.toFixed(1)})`,
      timeThreshold: 0,
      duration: endlessLevelDurationFrames,
      spawnPattern: {
        ...baseLevel.spawnPattern,
        count: Math.max(
          1,
          Math.floor(baseLevel.spawnPattern.count * this.endlessMultiplier)
        ),
        maxTotal: Math.max(
          1,
          Math.floor(baseLevel.spawnPattern.maxTotal * this.endlessMultiplier)
        ),
        interval: Math.max(
          60,
          Math.floor(baseLevel.spawnPattern.interval / this.endlessMultiplier)
        ),
      },
    };
  }

  public shouldSpawnEnemy(
    enemyType: EnemyType,
    currentCount: number,
    totalEnemyCount: number,
    framesSinceLastSpawn: number
  ): SpawnDecision {
    const level = this.getCurrentLevel();

    if (!level.enemyTypes.includes(enemyType)) {
      return { shouldSpawn: false, reason: "not_in_level" };
    }

    if (totalEnemyCount >= level.spawnPattern.maxTotal) {
      return { shouldSpawn: false, reason: "max_count_reached" };
    }

    const minEnemyCount = level.spawnPattern.count;
    const isEmergencySpawn = currentCount < minEnemyCount;

    if (isEmergencySpawn) {
      const emergencyInterval = this.calculateEmergencyInterval();
      if (framesSinceLastSpawn >= emergencyInterval) {
        return {
          shouldSpawn: true,
          reason: "emergency_spawn",
          isEmergency: true,
          interval: emergencyInterval,
        };
      }
    }

    const adjustedInterval = this.calculateNormalInterval(
      level.spawnPattern.interval
    );
    if (framesSinceLastSpawn < adjustedInterval) {
      return { shouldSpawn: false, reason: "interval_not_met" };
    }

    return {
      shouldSpawn: true,
      reason: "normal_spawn",
      isEmergency: false,
      interval: adjustedInterval,
    };
  }

  private calculateEmergencyInterval(): number {
    const baseEmergencyInterval = 180;

    if (this.isEndlessMode) {
      const adjustedInterval = Math.max(
        Math.floor(baseEmergencyInterval / this.endlessMultiplier),
        60
      );
      return adjustedInterval;
    } else {
      const adjustedInterval = Math.max(baseEmergencyInterval, 90);
      return adjustedInterval;
    }
  }

  private calculateNormalInterval(baseInterval: number): number {
    if (this.isEndlessMode) {
      const adjustedInterval = Math.max(
        Math.floor(baseInterval / this.endlessMultiplier),
        120
      );
      return adjustedInterval;
    } else {
      const adjustedInterval = Math.max(baseInterval, 180);
      return adjustedInterval;
    }
  }

  public isInEndlessMode(): boolean {
    return this.isEndlessMode;
  }

  public getEndlessMultiplier(): number {
    return this.endlessMultiplier;
  }

  public getCurrentLevelNumber(): number {
    return this.currentLevel;
  }

  public getCurrentFrame(): number {
    return this.currentFrame;
  }

  public getCurrentLevelInfo(): string {
    const level = this.getCurrentLevel();
    if (this.isEndlessMode) {
      return `${level.name} (${this.endlessMultiplier.toFixed(1)}x)`;
    }
    return `Level ${level.id}: ${level.name}`;
  }

  public getDebugInfo(): any {
    const level = this.getCurrentLevel();

    if (!level) {
      const fallbackLevelName = this.isEndlessMode
        ? "Endless (Initializing)"
        : "Level (Invalid)";
      return {
        currentLevelNumber: this.currentLevel,
        isEndlessMode: this.isEndlessMode,
        endlessMultiplier: this.endlessMultiplier,
        currentFrame: this.currentFrame,
        levelName: fallbackLevelName,
        levelEnemyTypes: [],
        spawnPattern: {
          enemyType: EnemyType.WANDERER,
          count: 0,
          interval: 300,
          maxTotal: 0,
        },
        emergencyInterval: this.calculateEmergencyInterval(),
        normalInterval: this.calculateNormalInterval(300),
      };
    }

    return {
      currentLevelNumber: this.currentLevel,
      isEndlessMode: this.isEndlessMode,
      endlessMultiplier: this.endlessMultiplier,
      currentFrame: this.currentFrame,
      levelName: level.name,
      levelEnemyTypes: level.enemyTypes,
      spawnPattern: level.spawnPattern,
      emergencyInterval: this.calculateEmergencyInterval(),
      normalInterval: this.calculateNormalInterval(level.spawnPattern.interval),
    };
  }
}
