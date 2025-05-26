// 基本型定義
export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

// 基本敵インターフェース
export interface BaseEnemy {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  moveCounter: number;
  isBlinking: boolean;
  blinkDuration: number;
  maxBlinkDuration: number;
  type: EnemyType;
  baseScore: number;
  moveInterval: number;
  specialTimer: number;
  isDestroyed: boolean;
  spawnTime: number;
  threatLevel: ThreatLevel;
  playerLearningHints: string[];
}

// 敵タイプ列挙
export enum EnemyType {
  WANDERER = "wanderer",
  GUARD = "guard",
  CHASER = "chaser",
  SPLITTER = "splitter",
  SPEEDSTER = "speedster",
  MIMIC = "mimic",
  BOMBER = "bomber",
  WALL_CREEPER = "wall_creeper",
  GHOST = "ghost",
  SWARM = "swarm",
}

// 脅威レベル
export enum ThreatLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  EXTREME = 4,
}

// 判別可能な共用体型による敵タイプ定義
export interface WandererEnemy extends BaseEnemy {
  type: EnemyType.WANDERER;
  directionChangeChance: number;
}

export interface GuardEnemy extends BaseEnemy {
  type: EnemyType.GUARD;
  guardTarget: Position | null;
  patrolRadius: number;
  patrolAngle: number;
  returnToFoodTimer: number;
  alertLevel: number;
}

export interface ChaserEnemy extends BaseEnemy {
  type: EnemyType.CHASER;
  chaseTarget: Position;
  stunDuration: number;
  lastValidDirection: Direction;
  pathfindingCooldown: number;
  stuckCounter: number;
  chaseIntensity: number;
}

export interface SplitterEnemy extends BaseEnemy {
  type: EnemyType.SPLITTER;
  isChild: boolean;
  splitCount: number;
  parentId: string | null;
  maxSplits: number;
  splitWarningTimer: number;
}

export interface SpeedsterEnemy extends BaseEnemy {
  type: EnemyType.SPEEDSTER;
  speedMultiplier: number;
  directionChangeTimer: number;
  lastDirectionChange: number;
  boostCooldown: number;
  predictabilityCounter: number;
}

export interface MimicEnemy extends BaseEnemy {
  type: EnemyType.MIMIC;
  mimicTarget: Position[];
  mimicDelay: number;
  mimicAccuracy: number;
  recordingBuffer: Position[];
  maxRecordLength: number;
}

export interface BomberEnemy extends BaseEnemy {
  type: EnemyType.BOMBER;
  explosionRadius: number;
  chainReactionTriggered: boolean;
  explosionDamage: number;
  explosionEffectDuration: number;
  explosionWarningTimer: number;
}

export interface WallCreeperEnemy extends BaseEnemy {
  type: EnemyType.WALL_CREEPER;
  wallFollowDirection: "clockwise" | "counterclockwise";
  stuckCounter: number;
  lastWallPosition: Position | null;
  wallSearchRadius: number;
  cornerPauseTimer: number;
}

export interface GhostEnemy extends BaseEnemy {
  type: EnemyType.GHOST;
  isPhasing: boolean;
  phaseTimer: number;
  phaseChance: number;
  phaseCooldown: number;
  explosionResistance: number;
  phaseWarningTimer: number;
}

export interface SwarmEnemy extends BaseEnemy {
  type: EnemyType.SWARM;
  swarmSize: number;
  isLeader: boolean;
  leaderPosition: Position | null;
  formationOffset: Position;
  swarmId: string;
  leadershipScore: number;
  cohesionStrength: number;
}

// 判別可能な共用体型
export type Enemy =
  | WandererEnemy
  | GuardEnemy
  | ChaserEnemy
  | SplitterEnemy
  | SpeedsterEnemy
  | MimicEnemy
  | BomberEnemy
  | WallCreeperEnemy
  | GhostEnemy
  | SwarmEnemy;

// 敵設定インターフェース
export interface EnemyConfig {
  readonly displayChar: string;
  readonly color: string;
  readonly baseScore: number;
  readonly moveInterval: number;
  readonly spawnWeight: number;
  readonly maxCount: number;
  readonly threatLevel: ThreatLevel;
  readonly learningObjective: string;
  readonly counterStrategies: string[];
}

// エフェクト関連
export interface EnemyDestroyEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
  score: number;
  multiplier: number;
}

// スコア表示エフェクト（破壊エフェクト終了後に表示）
export interface ScoreDisplayEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
  score: number;
  multiplier: number;
}

// ゲーム状態インターフェース
export interface GameState {
  gameTime: number;
  score: number;
  snakeLength: number;
  totalEnemiesDestroyed: number;
  lives: number;
  playerPosition: Position;
  snakeSegments: Position[];
  enemies: Enemy[];
  lastPlayerAction?: string;
}
