import {
  EnemyType,
  SimpleLevel,
  SimpleSpawnPattern,
  SpawnDecision,
} from "./enemies/types.js";

const FRAMES_PER_SECOND = 60;

// レベル定義データ
const SIMPLE_LEVELS: SimpleLevel[] = [
  // レベル1: ワンダラー導入（簡単）
  {
    id: 1,
    name: "基本訓練",
    timeThreshold: 0 * FRAMES_PER_SECOND, // ゲーム開始時
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 3,
      interval: 600, // 10秒間隔 (600 frames)
      maxTotal: 5,
    },
  },

  // レベル2: ガード導入（簡単）
  {
    id: 2,
    name: "守護者登場",
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

  // レベル3: ワンダラー + ガード混合（標準的難易度に近づく）
  {
    id: 3,
    name: "混合戦闘I",
    timeThreshold: 40 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER, EnemyType.GUARD],
    spawnPattern: {
      enemyType: EnemyType.WANDERER, // メイン
      count: 2,
      interval: 480, // 8秒間隔 (480 frames)
      maxTotal: 7,
    },
  },

  // レベル4: チェイサー導入（標準的難易度）
  {
    id: 4,
    name: "追跡者登場",
    timeThreshold: 60 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.CHASER],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 2,
      interval: 720, // 12秒間隔 (720 frames)
      maxTotal: 4,
    },
  },

  // レベル5: ワンダラー + チェイサー混合（標準的難易度）
  {
    id: 5,
    name: "混合戦闘II",
    timeThreshold: 80 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.WANDERER, EnemyType.CHASER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 2,
      interval: 420, // 7秒間隔 (420 frames)
      maxTotal: 6,
    },
  },

  // レベル6: スプリッター導入（標準的難易度）
  {
    id: 6,
    name: "分裂者登場",
    timeThreshold: 100 * FRAMES_PER_SECOND,
    duration: 20 * FRAMES_PER_SECOND,
    enemyTypes: [EnemyType.SPLITTER],
    spawnPattern: {
      enemyType: EnemyType.SPLITTER,
      count: 1,
      interval: 900, // 15秒間隔 (900 frames)
      maxTotal: 6,
    },
  },

  // レベル7: 3種混合戦闘（標準的難易度を超える）
  {
    id: 7,
    name: "混合戦闘III",
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

  // レベル8: スピードスター導入（難易度上昇）
  {
    id: 8,
    name: "高速戦闘",
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

  // レベル9: ミミック導入（難易度上昇）
  {
    id: 9,
    name: "模倣者登場",
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

  // レベル10: スネーク導入（難易度上昇）
  {
    id: 10,
    name: "スネーク登場",
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

  // レベル11: ウォールクリーパー導入（難易度上昇）
  {
    id: 11,
    name: "壁這い登場",
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

  // レベル12: ゴースト導入（難易度上昇）
  {
    id: 12,
    name: "幽霊登場",
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

  // レベル13: スワーム導入（難易度上昇）
  {
    id: 13,
    name: "群れ登場",
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

  // レベル14-19: 高難易度混合戦闘（12-15匹程度）
  {
    id: 14,
    name: "混合戦闘IV",
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
    name: "混合戦闘V",
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
    name: "混合戦闘VI",
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
    name: "混合戦闘VII",
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
    name: "混合戦闘VIII",
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
    name: "最終試練",
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
    name: "全敵統合",
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
