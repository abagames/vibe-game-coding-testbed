import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  EnemyDestroyEffect,
  ScoreDisplayEffect,
  WandererEnemy,
} from "./types.js";
import { cglColor, CellAttributes } from "../../../core/coreTypes.js";

// Global enemy ID generation system
export class GlobalEnemyIdGenerator {
  private static instance: GlobalEnemyIdGenerator;
  private nextId: number = 1;

  private constructor() {}

  public static getInstance(): GlobalEnemyIdGenerator {
    if (!GlobalEnemyIdGenerator.instance) {
      GlobalEnemyIdGenerator.instance = new GlobalEnemyIdGenerator();
    }
    return GlobalEnemyIdGenerator.instance;
  }

  public generateId(enemyType: string): string {
    return `${enemyType}_${this.nextId++}`;
  }

  public reset(): void {
    this.nextId = 1;
  }
}

export interface EnemyUpdateResult {
  enemiesToRemove: string[];
  effectsToAdd: EnemyDestroyEffect[];
  scoreToAdd: number;
}

export abstract class BaseEnemyManager {
  protected enemies: Map<string, Enemy> = new Map();
  protected destroyEffects: EnemyDestroyEffect[] = [];
  protected scoreDisplayEffects: ScoreDisplayEffect[] = [];

  // Abstract method - Implement in each enemy type
  abstract createEnemy(
    type: EnemyType,
    position: Position,
    options?: any
  ): Enemy | null;
  abstract updateEnemyLogic(enemy: Enemy, gameState: GameState): void;
  abstract getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  };

  // Common methods
  public addEnemy(enemy: Enemy): void {
    this.enemies.set(enemy.id, enemy);
  }

  public removeEnemy(id: string): void {
    this.enemies.delete(id);
  }

  public getEnemy(id: string): Enemy | undefined {
    return this.enemies.get(id);
  }

  public getAllEnemies(): Enemy[] {
    return Array.from(this.enemies.values());
  }

  public getEnemiesByType(type: EnemyType): Enemy[] {
    return this.getAllEnemies().filter((enemy) => enemy.type === type);
  }

  public updateAllEnemies(gameState: GameState): EnemyUpdateResult {
    const result: EnemyUpdateResult = {
      enemiesToRemove: [],
      effectsToAdd: [],
      scoreToAdd: 0,
    };

    for (const enemy of this.enemies.values()) {
      this.updateBlinking(enemy);

      if (enemy.isDestroyed) {
        result.enemiesToRemove.push(enemy.id);
        continue;
      }

      this.updateEnemyLogic(enemy, gameState);

      this.updateMovement(enemy, gameState);
    }

    for (const id of result.enemiesToRemove) {
      this.removeEnemy(id);
    }

    return result;
  }

  protected updateBlinking(enemy: Enemy): void {
    if (enemy.isBlinking) {
      enemy.blinkDuration--;
      if (enemy.blinkDuration <= 0) {
        enemy.isBlinking = false;
      }
    }
  }

  protected updateMovement(enemy: Enemy, gameState: GameState): void {
    if (enemy.isBlinking) {
      // Do not move if blinking (spawn effect)
      // Reset moveCounter to ensure it starts fresh when blinking stops
      enemy.moveCounter = 0;
      return;
    }
    enemy.moveCounter++;
    if (enemy.moveCounter >= enemy.moveInterval) {
      enemy.moveCounter = 0;
      this.moveEnemy(enemy, gameState);
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    // Default random movement (can be overridden by each enemy type)
    if (Math.random() < 0.3) {
      enemy.direction = Math.floor(Math.random() * 4);
    }

    const newPos = this.calculateNewPosition(enemy);
    if (this.isValidPosition(newPos, gameState)) {
      enemy.x = newPos.x;
      enemy.y = newPos.y;
    } else {
      enemy.direction = Math.floor(Math.random() * 4);
    }
  }

  protected calculateNewPosition(enemy: Enemy): Position {
    const newPos = { x: enemy.x, y: enemy.y };

    switch (enemy.direction) {
      case Direction.UP:
        newPos.y--;
        break;
      case Direction.DOWN:
        newPos.y++;
        break;
      case Direction.LEFT:
        newPos.x--;
        break;
      case Direction.RIGHT:
        newPos.x++;
        break;
    }

    return newPos;
  }

  protected isValidPosition(pos: Position, gameState: GameState): boolean {
    // Wall check (screen boundary)
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // Collision check with the entire snake (head and all body parts)
    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasSnake) return false;

    // Collision check with other enemies (only non-blinking enemies)
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) => !enemy.isBlinking && enemy.x === pos.x && enemy.y === pos.y
    );
    if (hasOtherEnemy) return false;

    return true;
  }

  protected generateEnemyId(enemyType: string = "enemy"): string {
    return GlobalEnemyIdGenerator.getInstance().generateId(enemyType);
  }

  // Effect management
  public addDestroyEffect(effect: EnemyDestroyEffect): void {
    this.destroyEffects.push(effect);
  }

  public updateDestroyEffects(): void {
    for (let i = this.destroyEffects.length - 1; i >= 0; i--) {
      this.destroyEffects[i].duration--;
      if (this.destroyEffects[i].duration <= 0) {
        const finishedEffect = this.destroyEffects[i];

        // Create score display effect when destruction effect ends
        if (finishedEffect.score > 0) {
          const baseScore =
            finishedEffect.multiplier > 0
              ? Math.floor(finishedEffect.score / finishedEffect.multiplier)
              : finishedEffect.score;

          this.scoreDisplayEffects.push({
            x: finishedEffect.x,
            y: finishedEffect.y,
            duration: 90, // Display for 1.5 seconds
            maxDuration: 90,
            score: finishedEffect.score,
            baseScore: baseScore,
            multiplier: finishedEffect.multiplier,
          });
        }

        this.destroyEffects.splice(i, 1);
      }
    }

    for (let i = this.scoreDisplayEffects.length - 1; i >= 0; i--) {
      this.scoreDisplayEffects[i].duration--;
      if (this.scoreDisplayEffects[i].duration <= 0) {
        this.scoreDisplayEffects.splice(i, 1);
      }
    }
  }

  public getDestroyEffects(): EnemyDestroyEffect[] {
    return this.destroyEffects;
  }

  public getScoreDisplayEffects(): ScoreDisplayEffect[] {
    return this.scoreDisplayEffects;
  }

  // Enemy destruction processing
  public destroyEnemy(
    id: string,
    score: number = 0,
    multiplier: number = 1
  ): boolean {
    const enemy = this.getEnemy(id);
    if (!enemy) return false;

    enemy.isDestroyed = true;

    // Add destruction effect (keep score information but do not display)
    this.addDestroyEffect({
      x: enemy.x,
      y: enemy.y,
      duration: 120,
      maxDuration: 120,
      score: score,
      multiplier: multiplier,
    });

    return true;
  }

  // Get enemies in area
  public getEnemiesInArea(startPos: Position, endPos: Position): Enemy[] {
    const minX = Math.min(startPos.x, endPos.x);
    const maxX = Math.max(startPos.x, endPos.x);
    const minY = Math.min(startPos.y, endPos.y);
    const maxY = Math.max(startPos.y, endPos.y);

    return this.getAllEnemies().filter(
      (enemy) =>
        enemy.x >= minX && enemy.x <= maxX && enemy.y >= minY && enemy.y <= maxY
    );
  }

  // Get enemy at specific position
  public getEnemyAtPosition(pos: Position): Enemy | null {
    return (
      this.getAllEnemies().find(
        (enemy) => enemy.x === pos.x && enemy.y === pos.y
      ) || null
    );
  }

  // Debug information
  public getDebugInfo(): any {
    return {
      totalEnemies: this.enemies.size,
      enemiesByType: Object.fromEntries(
        Object.values(EnemyType).map((type) => [
          type,
          this.getEnemiesByType(type).length,
        ])
      ),
      activeEffects: this.destroyEffects.length,
    };
  }
}
