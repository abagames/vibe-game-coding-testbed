import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  SplitterEnemy,
  ThreatLevel,
} from "./types.js";
import { BaseEnemyManager, EnemyUpdateResult } from "./BaseEnemyManager.js";
import { cglColor, CellAttributes } from "../../../core/coreTypes.js";

export class SplitterEnemyManager extends BaseEnemyManager {
  private readonly SPLITTER_CONFIG: {
    displayChar: string;
    color: cglColor;
    baseScore: number;
    moveInterval: number;
    blinkDuration: number;
    threatLevel: ThreatLevel;
    maxSplits: number;
    childBlinkDuration: number;
    childScoreMultiplier: number;
    splitSearchRadius: number;
    splitWarningDuration: number;
  } = {
    displayChar: "S",
    color: "purple",
    baseScore: 80,
    moveInterval: 48,
    blinkDuration: 120,
    threatLevel: ThreatLevel.MEDIUM,
    maxSplits: 1, // Child enemies do not split
    childBlinkDuration: 60,
    childScoreMultiplier: 1,
    splitSearchRadius: 2,
    splitWarningDuration: 30, // Split warning time
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: {
      isBlinking?: boolean;
      isChild?: boolean;
      parentId?: string;
      splitCount?: number;
    } = {}
  ): SplitterEnemy | null {
    if (type !== EnemyType.SPLITTER) {
      return null;
    }

    const isChild = options.isChild || false;
    const splitCount = options.splitCount || 0;
    const blinkDuration = options.isBlinking
      ? isChild
        ? this.SPLITTER_CONFIG.childBlinkDuration
        : this.SPLITTER_CONFIG.blinkDuration
      : 0;

    const splitter: SplitterEnemy = {
      id: this.generateEnemyId("splitter"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.SPLITTER,
      baseScore: isChild
        ? Math.floor(
            this.SPLITTER_CONFIG.baseScore *
              this.SPLITTER_CONFIG.childScoreMultiplier
          )
        : this.SPLITTER_CONFIG.baseScore,
      moveInterval: this.SPLITTER_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.SPLITTER_CONFIG.threatLevel,
      playerLearningHints: [
        "Anticipate splits and surround them in a wide area",
        "Predict child enemy spawn locations and prepare",
        "Adjust split timing to create advantageous situations",
        "Consider positioning relative to other enemies when deciding destruction order",
      ],
      isChild: isChild,
      splitCount: splitCount,
      parentId: options.parentId || null,
      maxSplits: this.SPLITTER_CONFIG.maxSplits,
      splitWarningTimer: 0,
    };

    return splitter;
  }

  public spawnSplitter(
    position: Position,
    isBlinking: boolean = false,
    options: { isChild?: boolean; parentId?: string; splitCount?: number } = {}
  ): string | null {
    const splitter = this.createEnemy(EnemyType.SPLITTER, position, {
      isBlinking,
      ...options,
    });

    if (splitter) {
      this.addEnemy(splitter);
      return splitter.id;
    }

    return null;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SPLITTER) return;

    const splitter = enemy;

    // Update split warning timer
    if (splitter.splitWarningTimer > 0) {
      splitter.splitWarningTimer--;

      // If split warning ends, execute split
      if (splitter.splitWarningTimer === 0 && splitter.specialTimer === 1) {
        this.performSplit(splitter);
        // Destroy parent enemy
        splitter.isDestroyed = true;
      }
    }
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.SPLITTER) return;

    const splitter = enemy;

    // Random walk (30% chance to change direction)
    if (Math.random() < 0.3) {
      splitter.direction = Math.floor(Math.random() * 4);
    }

    const newPos = this.calculateNewPosition(splitter);
    if (this.isValidPosition(newPos, gameState)) {
      splitter.x = newPos.x;
      splitter.y = newPos.y;
    } else {
      splitter.direction = Math.floor(Math.random() * 4);
    }
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.SPLITTER) {
      return { char: "?", attributes: { color: "white" } };
    }

    const splitter = enemy;

    // Blinking display during split warning
    if (splitter.splitWarningTimer > 0) {
      const isFlashing = Math.floor(splitter.splitWarningTimer / 5) % 2 === 0;
      return {
        char: this.SPLITTER_CONFIG.displayChar,
        attributes: {
          color: isFlashing ? "light_purple" : this.SPLITTER_CONFIG.color,
          isPassable: splitter.isBlinking,
        },
      };
    }

    // Normal display
    return {
      char: this.SPLITTER_CONFIG.displayChar,
      attributes: {
        color: splitter.isBlinking
          ? "light_purple"
          : this.SPLITTER_CONFIG.color,
        isPassable: splitter.isBlinking,
      },
    };
  }

  // Split processing when splitter enemy is destroyed
  public destroyEnemy(
    id: string,
    score: number = 0,
    multiplier: number = 1
  ): boolean {
    const enemy = this.getEnemy(id);
    if (!enemy || enemy.type !== EnemyType.SPLITTER) {
      return false;
    }

    const splitter = enemy;

    // Start split warning
    if (!splitter.isChild && splitter.splitCount < splitter.maxSplits) {
      splitter.splitWarningTimer = this.SPLITTER_CONFIG.splitWarningDuration;
      // Set split flag (processed in updateEnemyLogic)
      splitter.specialTimer = 1; // Split standby state
      return false; // Not destroyed yet
    }

    // Normal destruction process for child enemies or already split enemies
    return super.destroyEnemy(id, score, multiplier);
  }

  private performSplit(parentSplitter: SplitterEnemy): void {
    const splitPositions = this.findSplitPositions(parentSplitter);

    if (splitPositions.length === 0) {
      console.log(
        `⚠️ No valid split positions found for splitter ${parentSplitter.id}`
      );
      return;
    }

    console.log(
      `💥 Splitter ${parentSplitter.id} splitting into ${splitPositions.length} children`
    );

    for (const position of splitPositions) {
      const childId = this.spawnSplitter(position, true, {
        isChild: true,
        parentId: parentSplitter.id,
        splitCount: parentSplitter.splitCount + 1,
      });

      if (childId) {
        console.log(
          `👶 Child splitter ${childId} spawned at (${position.x}, ${position.y})`
        );
      }
    }
  }

  private findSplitPositions(splitter: SplitterEnemy): Position[] {
    const positions: Position[] = [];
    const directions = [
      { x: 0, y: -1 }, // UP
      { x: 0, y: 1 }, // DOWN
      { x: -1, y: 0 }, // LEFT
      { x: 1, y: 0 }, // RIGHT
    ];

    for (const dir of directions) {
      const newPos: Position = {
        x: splitter.x + dir.x,
        y: splitter.y + dir.y,
      };

      // Basic boundary check
      if (newPos.x < 1 || newPos.x >= 39 || newPos.y < 2 || newPos.y >= 24) {
        continue;
      }

      // Check if this position is valid (simplified)
      if (this.isValidSplitPosition(newPos)) {
        positions.push(newPos);
      }
    }

    return positions;
  }

  private isValidSplitPosition(pos: Position): boolean {
    // Basic boundary check
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    // Check for overlap with other enemies (only non-blinking enemies)
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) => !enemy.isBlinking && enemy.x === pos.x && enemy.y === pos.y
    );

    return !hasOtherEnemy;
  }

  // Debug information
  public getDebugInfo(): any {
    const allEnemies = this.getEnemiesByType(EnemyType.SPLITTER);
    const splitters = allEnemies.filter(
      (enemy): enemy is SplitterEnemy => enemy.type === EnemyType.SPLITTER
    );

    return {
      type: "SPLITTER",
      count: splitters.length,
      children: splitters.filter((s) => s.isChild).length,
      parents: splitters.filter((s) => !s.isChild).length,
      warningTimers: splitters.map((s) => ({
        id: s.id,
        warningTimer: s.splitWarningTimer,
        isChild: s.isChild,
      })),
    };
  }
}
