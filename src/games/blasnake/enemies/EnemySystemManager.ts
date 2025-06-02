import { WandererEnemyManager } from "./WandererEnemyManager.js";
import { GuardEnemyManager } from "./GuardEnemyManager.js";
import { ChaserEnemyManager } from "./ChaserEnemyManager.js";
import { SplitterEnemyManager } from "./SplitterEnemyManager.js";
import { SpeedsterEnemyManager } from "./SpeedsterEnemyManager.js";
import { MimicEnemyManager } from "./MimicEnemyManager.js";
import { SnakeEnemyManager } from "./SnakeEnemyManager.js";
import { WallCreeperEnemyManager } from "./WallCreeperEnemyManager.js";
import { GhostEnemyManager } from "./GhostEnemyManager.js";
import { SwarmEnemyManager } from "./SwarmEnemyManager.js";
import { GlobalEnemyIdGenerator } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  GameState,
  EnemyDestroyEffect,
  ScoreDisplayEffect,
} from "./types.js";
import { CellAttributes } from "../../../core/coreTypes.js";
import { EnemyUpdateResult } from "./BaseEnemyManager.js";

export interface SpawnRequest {
  type: EnemyType;
  position: Position;
  options?: any;
}

export class EnemySystemManager {
  private wandererManager: WandererEnemyManager;
  private guardManager: GuardEnemyManager;
  private chaserManager: ChaserEnemyManager;
  private splitterManager: SplitterEnemyManager;
  private speedsterManager: SpeedsterEnemyManager;
  private mimicManager: MimicEnemyManager;
  private snakeManager: SnakeEnemyManager;
  private wallCreeperManager: WallCreeperEnemyManager;
  private ghostManager: GhostEnemyManager;
  private swarmManager: SwarmEnemyManager;
  // Add other enemy managers in the future
  // etc...

  private spawnTimer: number = 0;
  private spawnInterval: number = 600; // 10-second interval
  private fastSpawnInterval: number = 60; // 1-second interval
  private minEnemyCount: number = 5;

  constructor() {
    this.wandererManager = new WandererEnemyManager();
    this.guardManager = new GuardEnemyManager();
    this.chaserManager = new ChaserEnemyManager();
    this.splitterManager = new SplitterEnemyManager();
    this.speedsterManager = new SpeedsterEnemyManager();
    this.mimicManager = new MimicEnemyManager();
    this.snakeManager = new SnakeEnemyManager();
    this.wallCreeperManager = new WallCreeperEnemyManager();
    this.ghostManager = new GhostEnemyManager();
    this.swarmManager = new SwarmEnemyManager();
  }

  public updateAllEnemies(gameState: GameState): EnemyUpdateResult {
    const result: EnemyUpdateResult = {
      enemiesToRemove: [],
      effectsToAdd: [],
      scoreToAdd: 0,
    };

    // Update each enemy manager
    const wandererResult = this.wandererManager.updateAllEnemies(gameState);
    this.mergeResults(result, wandererResult);

    const guardResult = this.guardManager.updateAllEnemies(gameState);
    this.mergeResults(result, guardResult);

    const chaserResult = this.chaserManager.updateAllEnemies(gameState);
    this.mergeResults(result, chaserResult);

    const splitterResult = this.splitterManager.updateAllEnemies(gameState);
    this.mergeResults(result, splitterResult);

    const speedsterResult = this.speedsterManager.updateAllEnemies(gameState);
    this.mergeResults(result, speedsterResult);

    const mimicResult = this.mimicManager.updateAllEnemies(gameState);
    this.mergeResults(result, mimicResult);

    const snakeResult = this.snakeManager.updateAllEnemies(gameState);
    this.mergeResults(result, snakeResult);

    const wallCreeperResult =
      this.wallCreeperManager.updateAllEnemies(gameState);
    this.mergeResults(result, wallCreeperResult);

    const ghostResult = this.ghostManager.updateAllEnemies(gameState);
    this.mergeResults(result, ghostResult);

    const swarmResult = this.swarmManager.updateAllEnemies(gameState);
    this.mergeResults(result, swarmResult);

    // Update effects
    this.wandererManager.updateDestroyEffects();
    this.guardManager.updateDestroyEffects();
    this.chaserManager.updateDestroyEffects();
    this.splitterManager.updateDestroyEffects();
    this.speedsterManager.updateDestroyEffects();
    this.mimicManager.updateDestroyEffects();
    this.snakeManager.updateDestroyEffects();
    this.wallCreeperManager.updateDestroyEffects();
    this.ghostManager.updateDestroyEffects();
    this.swarmManager.updateDestroyEffects();

    return result;
  }

  // Spawn processing
  public updateSpawning(gameState: GameState): void {
    this.spawnTimer++;

    const currentEnemyCount = this.getTotalEnemyCount();
    const needsMoreEnemies = currentEnemyCount < this.minEnemyCount;

    // If the number of enemies is less than or equal to the minimum value, they appear in a short time, otherwise at normal intervals
    const spawnInterval = needsMoreEnemies
      ? this.fastSpawnInterval
      : this.spawnInterval;

    // The first enemy appears immediately
    const shouldSpawnImmediately =
      currentEnemyCount === 0 && this.spawnTimer >= 1;

    if (this.spawnTimer >= spawnInterval || shouldSpawnImmediately) {
      this.spawnNewEnemy(gameState);
      this.spawnTimer = 0;
    }
  }

  // Spawn a new enemy
  private spawnNewEnemy(gameState: GameState): void {
    // Determine enemy type (for Swarm test)
    const rand = Math.random();
    let enemyType: EnemyType;
    if (rand < 0.5) {
      enemyType = EnemyType.SWARM; // Swarm enemy 50% (for test)
    } else if (rand < 0.7) {
      enemyType = EnemyType.WANDERER; // Basic enemy 20%
    } else if (rand < 0.85) {
      enemyType = EnemyType.CHASER; // Chaser enemy 15%
    } else if (rand < 0.95) {
      enemyType = EnemyType.GUARD; // Tactical enemy 10%
    } else {
      enemyType = EnemyType.SPEEDSTER; // High-speed enemy 5%
    }

    let position: Position | null = null;

    // In the case of Guard, spawn near food
    if (enemyType === EnemyType.GUARD) {
      const foodPosition = (gameState as any).foodPosition;
      if (foodPosition) {
        position = this.findValidSpawnPositionNearFood(foodPosition, gameState);
      }
    }

    // If a position for Guard is not found, or in the case of Wanderer, normal random position
    if (!position) {
      position = this.findValidSpawnPosition(gameState);
    }

    if (!position) {
      console.log("❌ No valid spawn position found");
      return;
    }

    let enemyId: string | null = null;

    if (enemyType === EnemyType.WANDERER) {
      enemyId = this.wandererManager.spawnWanderer(position, true);
      if (enemyId) {
        console.log(
          `👹 Wanderer spawned at (${position.x}, ${
            position.y
          }) - Total enemies: ${this.getTotalEnemyCount()}`
        );
      }
    } else if (enemyType === EnemyType.GUARD) {
      // 食べ物の位置を取得
      const foodPosition = (gameState as any).foodPosition;
      if (foodPosition) {
        enemyId = this.guardManager.spawnGuard(position, foodPosition, true);
        if (enemyId) {
          console.log(
            `🛡️ Guard spawned at (${position.x}, ${
              position.y
            }) guarding food at (${foodPosition.x}, ${
              foodPosition.y
            }) - Total enemies: ${this.getTotalEnemyCount()}`
          );
        }
      } else {
        // If there is no food, spawn Wanderer instead
        enemyId = this.wandererManager.spawnWanderer(position, true);
        if (enemyId) {
          console.log(
            `👹 Wanderer spawned (fallback) at (${position.x}, ${
              position.y
            }) - Total enemies: ${this.getTotalEnemyCount()}`
          );
        }
      }
    } else if (enemyType === EnemyType.CHASER) {
      enemyId = this.chaserManager.spawnChaser(position, true);
      if (enemyId) {
        console.log(
          `🏃 Chaser spawned at (${position.x}, ${
            position.y
          }) - Total enemies: ${this.getTotalEnemyCount()}`
        );
      }
    } else if (enemyType === EnemyType.SPEEDSTER) {
      enemyId = this.speedsterManager.spawnSpeedster(position, true);
      if (enemyId) {
        console.log(
          `⚡ Speedster spawned at (${position.x}, ${
            position.y
          }) - Total enemies: ${this.getTotalEnemyCount()}`
        );
      }
    } else if (enemyType === EnemyType.SWARM) {
      const swarmLeader = this.swarmManager.spawnSwarmGroup(position);
      if (swarmLeader) {
        console.log(
          `🐝 Swarm group spawned at (${position.x}, ${
            position.y
          }) with leader and followers - Total enemies: ${this.getTotalEnemyCount()}`
        );
      }
    }
  }

  // Find a valid spawn position near food
  private findValidSpawnPositionNearFood(
    foodPosition: Position,
    gameState: GameState
  ): Position | null {
    const maxAttempts = 30;
    const spawnRadius = 5; // Within 5 units from food

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * spawnRadius + 2;

      const position: Position = {
        x: Math.round(foodPosition.x + Math.cos(angle) * distance),
        y: Math.round(foodPosition.y + Math.sin(angle) * distance),
      };

      // Check if the position is within the screen boundaries
      if (
        position.x < 1 ||
        position.x > 38 ||
        position.y < 2 ||
        position.y > 23
      ) {
        continue;
      }

      if (this.isValidSpawnPosition(position, gameState)) {
        return position;
      }
    }

    return null;
  }

  // Find a valid spawn position
  private findValidSpawnPosition(gameState: GameState): Position | null {
    const maxAttempts = 50;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const position: Position = {
        x: Math.floor(Math.random() * 38) + 1, // 1-38
        y: Math.floor(Math.random() * 22) + 2, // 2-23
      };

      if (this.isValidSpawnPosition(position, gameState)) {
        return position;
      }
    }

    return null;
  }

  // Check if the spawn position is valid
  private isValidSpawnPosition(pos: Position, gameState: GameState): boolean {
    // Check for player collision
    if (
      pos.x === gameState.playerPosition.x &&
      pos.y === gameState.playerPosition.y
    ) {
      return false;
    }

    // Check for existing enemy collision
    const hasEnemy = this.getEnemyAtPosition(pos) !== null;
    if (hasEnemy) return false;

    // Check for food collision (will be implemented later)
    // const hasFood = pos.x === gameState.foodPosition.x && pos.y === gameState.foodPosition.y;
    // if (hasFood) return false;

    return true;
  }

  // Get enemy display information
  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    switch (enemy.type) {
      case EnemyType.WANDERER:
        return this.wandererManager.getEnemyDisplayInfo(enemy);
      case EnemyType.GUARD:
        return this.guardManager.getEnemyDisplayInfo(enemy);
      case EnemyType.CHASER:
        return this.chaserManager.getEnemyDisplayInfo(enemy);
      case EnemyType.SPLITTER:
        return this.splitterManager.getEnemyDisplayInfo(enemy);
      case EnemyType.SPEEDSTER:
        return this.speedsterManager.getEnemyDisplayInfo(enemy);
      case EnemyType.MIMIC:
        return this.mimicManager.getEnemyDisplayInfo(enemy);
      case EnemyType.SNAKE:
        return this.snakeManager.getEnemyDisplayInfo(enemy);
      case EnemyType.WALL_CREEPER:
        return this.wallCreeperManager.getEnemyDisplayInfo(enemy);
      case EnemyType.GHOST:
        return this.ghostManager.getEnemyDisplayInfo(enemy);
      case EnemyType.SWARM:
        return this.swarmManager.getEnemyDisplayInfo(enemy);
      default:
        return { char: "?", attributes: { color: "white" } };
    }
  }

  // Get all enemies
  public getAllEnemies(): Enemy[] {
    const enemies: Enemy[] = [];
    enemies.push(...this.wandererManager.getAllEnemies());
    enemies.push(...this.guardManager.getAllEnemies());
    enemies.push(...this.chaserManager.getAllEnemies());
    enemies.push(...this.splitterManager.getAllEnemies());
    enemies.push(...this.speedsterManager.getAllEnemies());
    enemies.push(...this.mimicManager.getAllEnemies());
    enemies.push(...this.snakeManager.getAllEnemies());
    enemies.push(...this.wallCreeperManager.getAllEnemies());
    enemies.push(...this.ghostManager.getAllEnemies());
    enemies.push(...this.swarmManager.getAllEnemies());
    return enemies;
  }

  // Get an enemy at a specific position
  public getEnemyAtPosition(pos: Position): Enemy | null {
    const wandererEnemy = this.wandererManager.getEnemyAtPosition(pos);
    if (wandererEnemy) return wandererEnemy;

    const guardEnemy = this.guardManager.getEnemyAtPosition(pos);
    if (guardEnemy) return guardEnemy;

    const chaserEnemy = this.chaserManager.getEnemyAtPosition(pos);
    if (chaserEnemy) return chaserEnemy;

    const splitterEnemy = this.splitterManager.getEnemyAtPosition(pos);
    if (splitterEnemy) return splitterEnemy;

    const speedsterEnemy = this.speedsterManager.getEnemyAtPosition(pos);
    if (speedsterEnemy) return speedsterEnemy;

    const mimicEnemy = this.mimicManager.getEnemyAtPosition(pos);
    if (mimicEnemy) return mimicEnemy;

    const snakeEnemy = this.snakeManager.getEnemyAtPosition(pos);
    if (snakeEnemy) return snakeEnemy;

    const wallCreeperEnemy = this.wallCreeperManager.getEnemyAtPosition(pos);
    if (wallCreeperEnemy) return wallCreeperEnemy;

    const ghostEnemy = this.ghostManager.getEnemyAtPosition(pos);
    if (ghostEnemy) return ghostEnemy;

    const swarmEnemy = this.swarmManager.getEnemyAtPosition(pos);
    if (swarmEnemy) return swarmEnemy;

    return null;
  }

  // Get the total number of enemies
  public getTotalEnemyCount(): number {
    return (
      this.wandererManager.getAllEnemies().length +
      this.guardManager.getAllEnemies().length +
      this.chaserManager.getAllEnemies().length +
      this.splitterManager.getAllEnemies().length +
      this.speedsterManager.getAllEnemies().length +
      this.mimicManager.getAllEnemies().length +
      this.snakeManager.getAllEnemies().length +
      this.wallCreeperManager.getAllEnemies().length +
      this.ghostManager.getAllEnemies().length +
      this.swarmManager.getAllEnemies().length
    );
  }

  // Get all destroy effects
  public getAllDestroyEffects(): EnemyDestroyEffect[] {
    const effects: EnemyDestroyEffect[] = [];
    effects.push(...this.wandererManager.getDestroyEffects());
    effects.push(...this.guardManager.getDestroyEffects());
    effects.push(...this.chaserManager.getDestroyEffects());
    effects.push(...this.splitterManager.getDestroyEffects());
    effects.push(...this.speedsterManager.getDestroyEffects());
    effects.push(...this.mimicManager.getDestroyEffects());
    effects.push(...this.snakeManager.getDestroyEffects());
    effects.push(...this.wallCreeperManager.getDestroyEffects());
    effects.push(...this.ghostManager.getDestroyEffects());
    effects.push(...this.swarmManager.getDestroyEffects());
    return effects;
  }

  // Get all score display effects
  public getAllScoreDisplayEffects(): ScoreDisplayEffect[] {
    const effects: ScoreDisplayEffect[] = [];
    effects.push(...this.wandererManager.getScoreDisplayEffects());
    effects.push(...this.guardManager.getScoreDisplayEffects());
    effects.push(...this.chaserManager.getScoreDisplayEffects());
    effects.push(...this.splitterManager.getScoreDisplayEffects());
    effects.push(...this.speedsterManager.getScoreDisplayEffects());
    effects.push(...this.mimicManager.getScoreDisplayEffects());
    effects.push(...this.snakeManager.getScoreDisplayEffects());
    effects.push(...this.wallCreeperManager.getScoreDisplayEffects());
    effects.push(...this.ghostManager.getScoreDisplayEffects());
    effects.push(...this.swarmManager.getScoreDisplayEffects());
    return effects;
  }

  // Update all destroy effects
  public updateAllDestroyEffects(): void {
    this.wandererManager.updateDestroyEffects();
    this.guardManager.updateDestroyEffects();
    this.chaserManager.updateDestroyEffects();
    this.speedsterManager.updateDestroyEffects();
    this.mimicManager.updateDestroyEffects();
    this.snakeManager.updateDestroyEffects();
    this.wallCreeperManager.updateDestroyEffects();
  }

  // Destroy enemies in an area
  public destroyEnemiesInArea(
    startPos: Position,
    endPos: Position
  ): { destroyedCount: number; totalScore: number } {
    const enemiesInBoundingBox = this.getEnemiesInArea(startPos, endPos);
    // This method is too broad. We'll replace its usage in core.ts
    // with more specific destruction logic.
    // For now, let's make it clear it's deprecated for area explosion
    console.warn(
      "destroyEnemiesInArea (bounding box) called, prefer specific ID destruction for blasts."
    );
    let destroyedCount = 0;
    let totalScore = 0;
    for (const enemy of enemiesInBoundingBox) {
      // Use the actual baseScore of the enemy
      const score = enemy.baseScore * enemiesInBoundingBox.length; // Simple multiplier
      if (this.destroyEnemyById(enemy.id, score, enemiesInBoundingBox.length)) {
        destroyedCount++;
        totalScore += score;
      }
    }
    return { destroyedCount, totalScore };
  }

  public destroyEnemyById(
    id: string,
    score: number,
    multiplier: number
  ): boolean {
    // Try to destroy with the Wanderer manager
    const wandererEnemy = this.wandererManager.getEnemy(id);
    if (wandererEnemy) {
      return this.wandererManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Guard manager
    const guardEnemy = this.guardManager.getEnemy(id);
    if (guardEnemy) {
      return this.guardManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Chaser manager
    const chaserEnemy = this.chaserManager.getEnemy(id);
    if (chaserEnemy) {
      return this.chaserManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Splitter manager
    const splitterEnemy = this.splitterManager.getEnemy(id);
    if (splitterEnemy) {
      return this.splitterManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Speedster manager
    const speedsterEnemy = this.speedsterManager.getEnemy(id);
    if (speedsterEnemy) {
      return this.speedsterManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Mimic manager
    const mimicEnemy = this.mimicManager.getEnemy(id);
    if (mimicEnemy) {
      return this.mimicManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Snake manager
    const snakeEnemy = this.snakeManager.getEnemy(id);
    if (snakeEnemy) {
      return this.snakeManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Wall Creeper manager
    const wallCreeperEnemy = this.wallCreeperManager.getEnemy(id);
    if (wallCreeperEnemy) {
      return this.wallCreeperManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Ghost manager
    const ghostEnemy = this.ghostManager.getEnemy(id);
    if (ghostEnemy) {
      return this.ghostManager.destroyEnemy(id, score, multiplier);
    }

    // Try to destroy with the Swarm manager
    const swarmEnemy = this.swarmManager.getEnemy(id);
    if (swarmEnemy) {
      return this.swarmManager.destroyEnemy(id, score, multiplier);
    }

    return false;
  }

  // Get enemies in an area
  public getEnemiesInArea(startPos: Position, endPos: Position): Enemy[] {
    const enemies: Enemy[] = [];
    enemies.push(...this.wandererManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.guardManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.chaserManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.splitterManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.speedsterManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.mimicManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.snakeManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.wallCreeperManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.ghostManager.getEnemiesInArea(startPos, endPos));
    enemies.push(...this.swarmManager.getEnemiesInArea(startPos, endPos));
    return enemies;
  }

  // Check for enemy collision
  public checkEnemyCollision(pos: Position): Enemy | null {
    const enemy = this.getEnemyAtPosition(pos);
    if (enemy && !enemy.isBlinking) {
      return enemy;
    }
    return null;
  }

  // Update spawn settings
  public updateSpawnSettings(settings: {
    spawnInterval?: number;
    fastSpawnInterval?: number;
    minEnemyCount?: number;
  }): void {
    if (settings.spawnInterval !== undefined) {
      this.spawnInterval = settings.spawnInterval;
    }
    if (settings.fastSpawnInterval !== undefined) {
      this.fastSpawnInterval = settings.fastSpawnInterval;
    }
    if (settings.minEnemyCount !== undefined) {
      this.minEnemyCount = settings.minEnemyCount;
    }
  }

  // Debug information
  public getDebugInfo(): any {
    return {
      totalEnemies: this.getTotalEnemyCount(),
      spawnTimer: this.spawnTimer,
      spawnInterval: this.spawnInterval,
      minEnemyCount: this.minEnemyCount,
      wandererInfo: this.wandererManager.getWandererDebugInfo(),
      guardInfo: this.guardManager.getGuardDebugInfo(),
      chaserInfo: this.chaserManager.getChaserDebugInfo(),
      splitterInfo: this.splitterManager.getDebugInfo(),
      speedsterInfo: this.speedsterManager.getSpeedsterDebugInfo(),
      mimicInfo: this.mimicManager.getDebugInfo(),
      snakeInfo: this.snakeManager.getDebugInfo(),
      ghostInfo: this.ghostManager.getGhostDebugInfo(),
    };
  }

  // Merge results
  private mergeResults(
    target: EnemyUpdateResult,
    source: EnemyUpdateResult
  ): void {
    target.enemiesToRemove.push(...source.enemiesToRemove);
    target.effectsToAdd.push(...source.effectsToAdd);
    target.scoreToAdd += source.scoreToAdd;
  }

  // Clear all enemies (when player explodes)
  public clearAllEnemies(): void {
    this.wandererManager.getAllEnemies().forEach((enemy) => {
      this.wandererManager.removeEnemy(enemy.id);
    });
    this.guardManager.getAllEnemies().forEach((enemy) => {
      this.guardManager.removeEnemy(enemy.id);
    });
    this.chaserManager.getAllEnemies().forEach((enemy) => {
      this.chaserManager.removeEnemy(enemy.id);
    });
    this.splitterManager.getAllEnemies().forEach((enemy) => {
      this.splitterManager.removeEnemy(enemy.id);
    });
    this.speedsterManager.getAllEnemies().forEach((enemy) => {
      this.speedsterManager.removeEnemy(enemy.id);
    });
    this.mimicManager.getAllEnemies().forEach((enemy) => {
      this.mimicManager.removeEnemy(enemy.id);
    });
    this.snakeManager.getAllEnemies().forEach((enemy) => {
      this.snakeManager.removeEnemy(enemy.id);
    });
    this.wallCreeperManager.getAllEnemies().forEach((enemy) => {
      this.wallCreeperManager.removeEnemy(enemy.id);
    });
    this.ghostManager.getAllEnemies().forEach((enemy) => {
      this.ghostManager.removeEnemy(enemy.id);
    });
    this.swarmManager.getAllEnemies().forEach((enemy) => {
      this.swarmManager.removeEnemy(enemy.id);
    });
    this.wandererManager = new WandererEnemyManager(); // Resets wanderers
    this.guardManager = new GuardEnemyManager(); // Resets guards
    this.chaserManager = new ChaserEnemyManager(); // Resets chasers
    this.splitterManager = new SplitterEnemyManager(); // Resets splitters
    this.speedsterManager = new SpeedsterEnemyManager(); // Resets speedsters
    this.mimicManager = new MimicEnemyManager(); // Resets mimics
    this.snakeManager = new SnakeEnemyManager(); // Resets snakes
    this.wallCreeperManager = new WallCreeperEnemyManager(); // Resets wall creepers
    this.ghostManager = new GhostEnemyManager(); // Resets ghosts
    this.swarmManager = new SwarmEnemyManager(); // Resets swarms
    this.spawnTimer = 0; // Reset spawn timer as well

    // Reset the global ID generator
    GlobalEnemyIdGenerator.getInstance().reset();
  }

  // Update guard enemy targets
  public updateGuardTargets(foodPosition: Position): void {
    this.guardManager.updateGuardTargets(foodPosition);
  }
}
