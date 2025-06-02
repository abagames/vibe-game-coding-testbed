// Basic type definitions
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

// Base enemy interface
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

// Enemy type enumeration
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

// Threat level
export enum ThreatLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  EXTREME = 4,
}

// Enemy type definitions using discriminated unions
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
  currentDirectionIndex: number; // Index of the current direction
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
  swarmSize: number; // Overall size of the swarm
  isLeader: boolean; // Whether it is the leader of the swarm
  leaderPosition: Position | null; // Leader's position (for companions)
  leaderId: string | null; // Leader's ID (for companions)
  formationOffset: Position; // Relative position within the formation
  swarmId: string; // Swarm ID (for identifying the same swarm)
  leadershipScore: number; // Leadership score (unused, for future expansion)
  cohesionStrength: number; // Cohesion strength (0.0-1.0)
  formationType: "diamond" | "line" | "circle" | "v_formation"; // Formation type
  maxDistanceFromLeader: number; // Maximum distance from leader
  followDelay: number; // Follow delay frame count
  lastLeaderPosition: Position | null; // Leader's previous position
  separationTimer: number; // Separation timer
  reunionTimer: number; // Reunion timer
  isSeparated: boolean; // Separation state flag
  isReuniting: boolean; // Reuniting flag
}

// Discriminated union type
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

// Enemy configuration interface
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

// Effect-related types
export interface EnemyDestroyEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
  score: number;
  multiplier: number;
}

// Score display effect (shown after destruction effect ends)
export interface ScoreDisplayEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
  score: number; // Final score (basic points x multiplier)
  baseScore: number; // Basic points
  multiplier: number;
}

// Level system related type definitions
export interface SimpleLevel {
  id: number;
  name: string;
  timeThreshold: number; // Seconds from game start
  duration: number; // Level duration (seconds)
  enemyTypes: EnemyType[]; // Enemy types that appear
  spawnPattern: SimpleSpawnPattern;
}

export interface SimpleSpawnPattern {
  enemyType: EnemyType;
  count: number; // Number of simultaneous appearances
  interval: number; // Spawn interval (number of frames)
  maxTotal: number; // Maximum total number
}

// Spawn decision result type definition
export interface SpawnDecision {
  shouldSpawn: boolean;
  reason: string;
  isEmergency?: boolean;
  interval?: number; // Interval used (for debugging)
}

// Game state interface
export interface GameState {
  gameTime: number;
  score: number;
  snakeLength: number;
  totalEnemiesDestroyed: number;
  lives: number;
  playerPosition: Position;
  snakeSegments: Position[];
  enemies: Enemy[];
  foodPosition?: Position; // Add food position
  lastPlayerAction?: string;
}
