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
  SNAKE = "snake",
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
  movementState: "moving" | "paused";
  pauseDuration: number;
  maxPauseDuration: number;
  movementDistance: number;
  maxMovementDistance: number;
  rotationPattern: "clockwise" | "counterclockwise";
  currentDirectionIndex: number; // 現在の方向のインデックス
}

export interface MimicEnemy extends BaseEnemy {
  type: EnemyType.MIMIC;
  mimicTarget: Position[];
  mimicDelay: number;
  mimicAccuracy: number;
  recordingBuffer: Position[];
  maxRecordLength: number;
}

export interface SnakeEnemy extends BaseEnemy {
  type: EnemyType.SNAKE;
  body: Position[];
  maxLength: number;
  currentLength: number;
  growthRate: number;
  lastGrowthTime: number;
  movementPattern: "patrol" | "chase" | "territorial";
  territoryCenter: Position;
  territoryRadius: number;
  pathHistory: Position[];
  selfCollisionCheck: boolean;
}

export interface WallCreeperEnemy extends BaseEnemy {
  type: EnemyType.WALL_CREEPER;
  currentBehaviorState: "in_wall" | "crossing_open_space";
  wallFollowCardinalDirection: Direction;
  targetCrossPosition: Position | null;
  behaviorTimer: number;
  exitWallDecisionTimer: number;
}

export interface GhostEnemy extends BaseEnemy {
  type: EnemyType.GHOST;
  isPhasing: boolean;
  phaseTimer: number;
  phaseChance: number;
  phaseCooldown: number;
  phaseWarningTimer: number;
}

export interface SwarmEnemy extends BaseEnemy {
  type: EnemyType.SWARM;
  swarmSize: number; // 群れ全体のサイズ
  isLeader: boolean; // 群れのリーダーかどうか
  leaderPosition: Position | null; // リーダーの位置（仲間用）
  leaderId: string | null; // リーダーのID（仲間用）
  formationOffset: Position; // 編隊内の相対位置
  swarmId: string; // 群れID（同じ群れの識別用）
  leadershipScore: number; // リーダーシップスコア（未使用、将来拡張用）
  cohesionStrength: number; // 結束力（0.0-1.0）
  formationType: "diamond" | "line" | "circle" | "v_formation"; // 編隊タイプ
  maxDistanceFromLeader: number; // リーダーからの最大距離
  followDelay: number; // 追従遅延フレーム数
  lastLeaderPosition: Position | null; // リーダーの前回位置
  separationTimer: number; // 分離タイマー
  reunionTimer: number; // 再結合タイマー
  isSeparated: boolean; // 分離状態フラグ
  isReuniting: boolean; // 再結合中フラグ
}

// 判別可能な共用体型
export type Enemy =
  | WandererEnemy
  | GuardEnemy
  | ChaserEnemy
  | SplitterEnemy
  | SpeedsterEnemy
  | MimicEnemy
  | SnakeEnemy
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
  score: number; // 最終スコア（基本点数 × 倍率）
  baseScore: number; // 基本点数
  multiplier: number;
}

// レベルシステム関連の型定義
export interface SimpleLevel {
  id: number;
  name: string;
  timeThreshold: number; // ゲーム開始からの秒数
  duration: number; // レベル持続時間（秒）
  enemyTypes: EnemyType[]; // 出現する敵タイプ
  spawnPattern: SimpleSpawnPattern;
}

export interface SimpleSpawnPattern {
  enemyType: EnemyType;
  count: number; // 同時出現数
  interval: number; // スポーン間隔（フレーム数）
  maxTotal: number; // 最大総数
}

// スポーン判定結果の型定義
export interface SpawnDecision {
  shouldSpawn: boolean;
  reason: string;
  isEmergency?: boolean;
  interval?: number; // 使用された間隔（デバッグ用）
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
  foodPosition?: Position; // 食べ物の位置を追加
  lastPlayerAction?: string;
}
