import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  WandererEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class WandererEnemyManager extends BaseEnemyManager {
  private readonly WANDERER_CONFIG: {
    displayChar: string;
    color: cglColor;
    blinkingColor: cglColor;
    blinkingChar: string;
    moveInterval: number;
    directionChangeChance: number;
    blinkDuration: number;
    baseScore: number;
    threatLevel: ThreatLevel;
  } = {
    displayChar: "W",
    color: "red",
    blinkingColor: "light_red",
    blinkingChar: "o",
    moveInterval: 96,
    directionChangeChance: 0.3,
    blinkDuration: 120,
    baseScore: 100,
    threatLevel: ThreatLevel.LOW,
  };

  // Type guard function
  private isWandererEnemy(enemy: Enemy): enemy is WandererEnemy {
    return enemy.type === EnemyType.WANDERER;
  }

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): WandererEnemy | null {
    if (type !== EnemyType.WANDERER) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.WANDERER_CONFIG.blinkDuration
      : 0;

    const wanderer: WandererEnemy = {
      id: this.generateEnemyId("wanderer"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.WANDERER,
      baseScore: this.WANDERER_CONFIG.baseScore,
      moveInterval: this.WANDERER_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.WANDERER_CONFIG.threatLevel,
      playerLearningHints: [
        "Enclose and destroy Wanderer enemies",
        "Passable while blinking",
        "Difficult to predict due to random movement",
      ],
      directionChangeChance: this.WANDERER_CONFIG.directionChangeChance,
    };

    return wanderer;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (!this.isWandererEnemy(enemy)) {
      return;
    }

    // Wanderer specific logic
    // No special processing currently (only basic random movement).
    // Swarm behavior and learning functions can be added in the future.
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (!this.isWandererEnemy(enemy)) {
      return;
    }

    if (Math.random() < enemy.directionChangeChance) {
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

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (!this.isWandererEnemy(enemy)) {
      return { char: "?", attributes: { color: "white" } };
    }

    if (enemy.isBlinking) {
      // Display during blinking (toggle display every 5 frames)
      const blinkPhase =
        Math.floor((enemy.maxBlinkDuration - enemy.blinkDuration) / 5) % 2;

      if (blinkPhase === 0) {
        return {
          char: this.WANDERER_CONFIG.blinkingChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: this.WANDERER_CONFIG.blinkingColor,
          },
        };
      } else {
        // Hidden phase
        return {
          char: " ",
          attributes: {
            entityType: "empty",
            isPassable: true,
          },
        };
      }
    } else {
      // Normal display
      return {
        char: this.WANDERER_CONFIG.displayChar,
        attributes: {
          entityType: "enemy",
          isPassable: false,
          color: this.WANDERER_CONFIG.color,
        },
      };
    }
  }

  // Wanderer specific methods
  public spawnWanderer(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const wanderer = this.createEnemy(EnemyType.WANDERER, position, {
      isBlinking,
    });
    if (wanderer) {
      this.addEnemy(wanderer);
      return wanderer.id;
    }
    return null;
  }

  public getWandererCount(): number {
    return this.getEnemiesByType(EnemyType.WANDERER).length;
  }

  public getAllWanderers(): WandererEnemy[] {
    return this.getEnemiesByType(EnemyType.WANDERER).filter(
      this.isWandererEnemy.bind(this)
    );
  }

  // Debugging purpose
  public getWandererDebugInfo(): any {
    const wanderers = this.getAllWanderers();
    return {
      count: wanderers.length,
      blinking: wanderers.filter((w) => w.isBlinking).length,
      positions: wanderers.map((w) => ({
        id: w.id,
        x: w.x,
        y: w.y,
        blinking: w.isBlinking,
      })),
    };
  }
}
