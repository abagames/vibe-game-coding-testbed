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
      maxTotal: 6,
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
      count: 1,
      interval: 900, // 15秒間隔 (900 frames)
      maxTotal: 3,
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
      count: 1,
      interval: 720, // 12秒間隔 (720 frames)
      maxTotal: 2,
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
      maxTotal: 8,
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
      maxTotal: 3,
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
      interval: 360, // 6秒間隔 (360 frames)
      maxTotal: 10,
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
      count: 1,
      interval: 1080, // 18秒間隔 (1080 frames)
      maxTotal: 2,
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
      count: 1,
      interval: 1200, // 20秒間隔 (1200 frames)
      maxTotal: 2,
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
      interval: 1500, // 25秒間隔 (1500 frames)
      maxTotal: 2,
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
      count: 1,
      interval: 900, // 15秒間隔 (900 frames)
      maxTotal: 4,
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
      interval: 1800, // 30秒間隔 (1800 frames)
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
      count: 4, // リーダー1 + 仲間3
      interval: 1200, // 20秒間隔 (1200 frames)
      maxTotal: 4,
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
      interval: 300, // 5秒間隔 (300 frames)
      maxTotal: 10,
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
      interval: 360, // 6秒間隔 (360 frames)
      maxTotal: 11,
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
      interval: 300, // 5秒間隔 (300 frames)
      maxTotal: 10,
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
      interval: 240, // 4秒間隔 (240 frames)
      maxTotal: 12,
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
      interval: 240, // 4秒間隔 (240 frames)
      maxTotal: 11,
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
      interval: 180, // 3秒間隔 (180 frames)
      maxTotal: 12,
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
      interval: 180, // 3秒間隔 (180 frames)
      maxTotal: 15,
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

  constructor() {
    // Constructor is now empty as gameStartTime and timeAcceleration are removed
  }

  public incrementFrame(): void {
    this.currentFrame++;
  }

  public getCurrentLevel(): SimpleLevel {
    if (this.isEndlessMode && this.currentEndlessLevel) {
      return this.currentEndlessLevel;
    }
    return this.levels[this.currentLevel - 1];
  }

  public update(): boolean {
    this.incrementFrame(); // Increment frame internally on each update call
    if (!this.isEndlessMode) {
      return this.checkLevelUp();
    } else {
      return this.updateEndlessMode();
    }
  }

  private checkLevelUp(): boolean {
    const nextLevelIndex = this.currentLevel - 1;

    if (nextLevelIndex < this.levels.length) {
      // If we are at the last defined level
      if (this.currentLevel === this.levels.length) {
        const levelData = this.levels[this.currentLevel - 1];
        if (this.currentFrame >= levelData.timeThreshold + levelData.duration) {
          this.startEndlessMode();
          return true;
        }
      } else {
        // For other levels, check if currentFrame reached the next level's timeThreshold
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
      this.endlessMultiplier += 0.2;
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
    // レベル3以降からランダム選択（基本敵のみのレベルを避ける）
    const availableLevels = this.levels.slice(2); // レベル3以降
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const baseLevel = availableLevels[randomIndex];
    const endlessLevelDurationFrames = 20 * FRAMES_PER_SECOND;

    // エンドレス用に調整されたレベル
    this.currentEndlessLevel = {
      ...baseLevel,
      id: 999, // エンドレス識別用
      name: `${baseLevel.name} (Endless x${this.endlessMultiplier.toFixed(1)})`,
      timeThreshold: 0, // Endless levels start immediately relevant to their own duration
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
          60, // 最小1秒間隔 (60 frames)
          Math.floor(baseLevel.spawnPattern.interval / this.endlessMultiplier)
        ),
      },
    };
  }

  // ハイブリッドスポーンロジック：最小数維持 + レベル設計 + 動的間隔調整
  public shouldSpawnEnemy(
    enemyType: EnemyType,
    currentCount: number,
    totalEnemyCount: number,
    framesSinceLastSpawn: number
  ): SpawnDecision {
    const level = this.getCurrentLevel();

    // 1. このレベルで出現しない敵タイプはスキップ
    if (!level.enemyTypes.includes(enemyType)) {
      return { shouldSpawn: false, reason: "not_in_level" };
    }

    // 2. 強力な敵の個別制限チェック
    const powerfulEnemyLimit = this.getPowerfulEnemyLimit(enemyType);
    if (powerfulEnemyLimit > 0 && currentCount >= powerfulEnemyLimit) {
      return { shouldSpawn: false, reason: "powerful_enemy_limit_reached" };
    }

    // 3. 緊急スポーン判定（現在のロジックを採用）
    const minEnemyCount = Math.max(
      3, // 最小3匹は常に維持
      Math.floor(level.spawnPattern.maxTotal * 0.6) // 60%の閾値に変更（40%→60%）
    );
    const isEmergencySpawn = totalEnemyCount < minEnemyCount;

    if (isEmergencySpawn) {
      // 緊急時は動的間隔でスポーン（難易度に応じて調整）
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

    // 4. 通常スポーン判定
    // 最大数チェック（敵タイプ別の上限）
    if (currentCount >= level.spawnPattern.maxTotal) {
      return { shouldSpawn: false, reason: "max_count_reached" };
    }

    // スポーン間隔チェック（敵タイプ別の間隔 + 難易度調整）
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

  // 強力な敵の個別制限を取得
  private getPowerfulEnemyLimit(enemyType: EnemyType): number {
    // レベルに応じて強力な敵の最大数を制限
    const currentLevelNumber = this.currentLevel;

    switch (enemyType) {
      case EnemyType.CHASER:
        if (currentLevelNumber <= 10) return 2; // 初期レベルでは2匹まで
        if (currentLevelNumber <= 15) return 3; // 中期レベルでは3匹まで
        return 4; // 後期レベルでは4匹まで

      case EnemyType.SPEEDSTER:
        if (currentLevelNumber <= 12) return 1; // 初期レベルでは1匹まで
        if (currentLevelNumber <= 17) return 2; // 中期レベルでは2匹まで
        return 3; // 後期レベルでは3匹まで

      case EnemyType.SNAKE:
        if (currentLevelNumber <= 15) return 1; // 初期・中期レベルでは1匹まで
        return 2; // 後期レベルでは2匹まで

      case EnemyType.SWARM:
        if (currentLevelNumber <= 15) return 4; // 初期・中期レベルでは1グループ（4匹）まで
        return 8; // 後期レベルでは2グループ（8匹）まで

      default:
        return 0; // 制限なし
    }
  }

  // 緊急スポーン間隔の動的計算
  private calculateEmergencyInterval(): number {
    const baseEmergencyInterval = 180; // 基本3秒間隔

    if (this.isEndlessMode) {
      // エンドレスモードでは難易度倍率に応じて短縮
      const adjustedInterval = Math.max(
        Math.floor(baseEmergencyInterval / this.endlessMultiplier),
        60 // 最小1秒間隔
      );
      return adjustedInterval;
    } else {
      // 通常レベルでは段階的に短縮
      const levelDifficultyMultiplier = this.getLevelDifficultyMultiplier();
      const adjustedInterval = Math.max(
        Math.floor(baseEmergencyInterval / levelDifficultyMultiplier),
        90 // 最小1.5秒間隔（通常レベルでは緩やか）
      );
      return adjustedInterval;
    }
  }

  // 通常スポーン間隔の動的計算
  private calculateNormalInterval(baseInterval: number): number {
    if (this.isEndlessMode) {
      // エンドレスモードでは難易度倍率に応じて短縮
      const adjustedInterval = Math.max(
        Math.floor(baseInterval / this.endlessMultiplier),
        120 // 最小2秒間隔
      );
      return adjustedInterval;
    } else {
      // 通常レベルでは段階的に短縮
      const levelDifficultyMultiplier = this.getLevelDifficultyMultiplier();
      const adjustedInterval = Math.max(
        Math.floor(baseInterval / levelDifficultyMultiplier),
        180 // 最小3秒間隔（通常レベルでは緩やか）
      );
      return adjustedInterval;
    }
  }

  // レベル難易度倍率の計算
  private getLevelDifficultyMultiplier(): number {
    // レベル1-5: 1.0倍（基本）
    // レベル6-10: 1.1倍
    // レベル11-15: 1.2倍
    // レベル16-20: 1.3倍
    if (this.currentLevel <= 5) {
      return 1.0;
    } else if (this.currentLevel <= 10) {
      return 1.1;
    } else if (this.currentLevel <= 15) {
      return 1.2;
    } else {
      return 1.3;
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
    // Added getter for currentFrame
    return this.currentFrame;
  }

  // UI表示用のレベル情報取得
  public getCurrentLevelInfo(): string {
    const level = this.getCurrentLevel();
    if (this.isEndlessMode) {
      return `${level.name} (${this.endlessMultiplier.toFixed(1)}x)`;
    }
    return `Level ${level.id}: ${level.name}`;
  }

  // デバッグ用：現在のレベル状態を取得
  public getDebugInfo(): any {
    const level = this.getCurrentLevel();
    return {
      currentLevelNumber: this.currentLevel,
      isEndlessMode: this.isEndlessMode,
      endlessMultiplier: this.endlessMultiplier,
      levelDifficultyMultiplier: this.getLevelDifficultyMultiplier(),
      currentFrame: this.currentFrame, // Ensure this uses the property
      levelName: level.name,
      levelEnemyTypes: level.enemyTypes,
      spawnPattern: level.spawnPattern,
      emergencyInterval: this.calculateEmergencyInterval(),
      normalInterval: this.calculateNormalInterval(level.spawnPattern.interval),
    };
  }
}
