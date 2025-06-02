import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  Enemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  GhostEnemy,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class GhostEnemyManager extends BaseEnemyManager {
  private readonly GHOST_CONFIG = {
    displayChar: "?",
    color: "light_blue" as cglColor,
    phaseColor: "light_black" as cglColor,
    warningColor: "yellow" as cglColor,
    baseScore: 270,
    moveInterval: 12,
    phaseChance: 0.2, // 20% chance to phase
    phaseDuration: 30, // Phase duration (0.5 seconds)
    phaseCooldown: 60, // Phase cooldown (1 second)
    phaseWarningDuration: 15, // Phase warning time (0.25 seconds)
    blinkDuration: 120,
    threatLevel: ThreatLevel.EXTREME,
    spawnWeight: 8,
    maxCount: 2,
    overlapResolutionAttempts: 5, // Overlap resolution attempts
    learningObjective: "Respond to uncertainty and acquire adaptive strategies",
    counterStrategies: [
      "Observe phasing timing to find patterns",
      "Focus on other enemies during phasing",
      "Deal with ghosts last for a sure approach",
      "Aim to surround ghosts as phasing ends",
    ],
  };

  public createEnemy(
    type: EnemyType,
    position: Position,
    options: { isBlinking?: boolean } = {}
  ): GhostEnemy | null {
    if (type !== EnemyType.GHOST) {
      return null;
    }

    const blinkDuration = options.isBlinking
      ? this.GHOST_CONFIG.blinkDuration
      : 0;

    const ghost: GhostEnemy = {
      id: this.generateEnemyId("ghost"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: options.isBlinking || false,
      blinkDuration: blinkDuration,
      maxBlinkDuration: blinkDuration,
      type: EnemyType.GHOST,
      baseScore: this.GHOST_CONFIG.baseScore,
      moveInterval: this.GHOST_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.GHOST_CONFIG.threatLevel,
      playerLearningHints: this.GHOST_CONFIG.counterStrategies,
      isPhasing: false,
      phaseTimer: 0,
      phaseChance: this.GHOST_CONFIG.phaseChance,
      phaseCooldown: 0,
      phaseWarningTimer: 0,
    };

    return ghost;
  }

  public updateEnemyLogic(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.GHOST) {
      return;
    }

    const ghost = enemy as GhostEnemy;

    // Update phase warning timer
    if (ghost.phaseWarningTimer > 0) {
      ghost.phaseWarningTimer--;
      if (ghost.phaseWarningTimer === 0) {
        // Warning ended, start phasing
        this.startPhasing(ghost);
      }
      return;
    }

    if (ghost.isPhasing) {
      ghost.phaseTimer--;
      if (ghost.phaseTimer <= 0) {
        this.endPhasing(ghost, gameState);
      }
      return;
    }

    if (ghost.phaseCooldown > 0) {
      ghost.phaseCooldown--;
    }

    if (
      ghost.phaseCooldown === 0 &&
      Math.random() < ghost.phaseChance &&
      !ghost.isBlinking
    ) {
      this.triggerPhaseWarning(ghost);
    }

    if (Math.random() < 0.3) {
      ghost.direction = Math.floor(Math.random() * 4);
    }
  }

  private triggerPhaseWarning(ghost: GhostEnemy): void {
    ghost.phaseWarningTimer = this.GHOST_CONFIG.phaseWarningDuration;
  }

  private startPhasing(ghost: GhostEnemy): void {
    ghost.isPhasing = true;
    ghost.phaseTimer = this.GHOST_CONFIG.phaseDuration;
    ghost.phaseCooldown = this.GHOST_CONFIG.phaseCooldown;
  }

  private endPhasing(ghost: GhostEnemy, gameState: GameState): void {
    ghost.isPhasing = false;
    ghost.phaseTimer = 0;

    // Processing if overlapping with other objects at the end of phasing
    if (this.isPositionOccupied(ghost, gameState)) {
      this.resolveOverlap(ghost, gameState);
    }
  }

  private isPositionOccupied(ghost: GhostEnemy, gameState: GameState): boolean {
    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === ghost.x && segment.y === ghost.y
    );
    if (hasSnake) return true;

    // Overlap check with other enemies (non-blinking enemies other than self)
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) =>
        enemy.id !== ghost.id &&
        !enemy.isBlinking &&
        enemy.x === ghost.x &&
        enemy.y === ghost.y
    );
    if (hasOtherEnemy) return true;

    return false;
  }

  private resolveOverlap(ghost: GhostEnemy, gameState: GameState): void {
    const attempts = this.GHOST_CONFIG.overlapResolutionAttempts;

    for (let i = 0; i < attempts; i++) {
      // Check surrounding 8 directions + current position
      const offsets = [
        { x: 0, y: 0 }, // Current position
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const offset of offsets) {
        const newPos = {
          x: ghost.x + offset.x,
          y: ghost.y + offset.y,
        };

        if (this.isValidPositionForPhaseEnd(newPos, gameState, ghost)) {
          ghost.x = newPos.x;
          ghost.y = newPos.y;
          return;
        }
      }

      const randomPos = this.findRandomValidPosition(gameState, ghost);
      if (randomPos) {
        ghost.x = randomPos.x;
        ghost.y = randomPos.y;
        return;
      }
    }

    // If unresolvable, forcibly move to a safe position
    console.warn(
      `Ghost ${ghost.id} overlap resolution failed, moving to safe position`
    );
    const safePos = this.findSafePosition(gameState);
    if (safePos) {
      ghost.x = safePos.x;
      ghost.y = safePos.y;
    }
  }

  private isValidPositionForPhaseEnd(
    pos: Position,
    gameState: GameState,
    ghost: GhostEnemy
  ): boolean {
    if (pos.x < 1 || pos.x >= 39 || pos.y < 2 || pos.y >= 24) {
      return false;
    }

    const hasSnake = gameState.snakeSegments.some(
      (segment) => segment.x === pos.x && segment.y === pos.y
    );
    if (hasSnake) return false;

    // Overlap check with other enemies (other than self)
    const hasOtherEnemy = this.getAllEnemies().some(
      (enemy) =>
        enemy.id !== ghost.id &&
        !enemy.isBlinking &&
        enemy.x === pos.x &&
        enemy.y === pos.y
    );
    if (hasOtherEnemy) return false;

    return true;
  }

  private findRandomValidPosition(
    gameState: GameState,
    ghost: GhostEnemy
  ): Position | null {
    for (let attempt = 0; attempt < 20; attempt++) {
      const pos = {
        x: Math.floor(Math.random() * 38) + 1,
        y: Math.floor(Math.random() * 22) + 2,
      };

      if (this.isValidPositionForPhaseEnd(pos, gameState, ghost)) {
        return pos;
      }
    }
    return null;
  }

  private findSafePosition(gameState: GameState): Position | null {
    // Search for a safe position from the corners of the screen
    const corners = [
      { x: 1, y: 2 },
      { x: 38, y: 2 },
      { x: 1, y: 23 },
      { x: 38, y: 23 },
    ];

    for (const corner of corners) {
      if (this.isValidPosition(corner, gameState)) {
        return corner;
      }
    }

    return { x: 20, y: 12 }; // As a last resort, the center
  }

  protected moveEnemy(enemy: Enemy, gameState: GameState): void {
    if (enemy.type !== EnemyType.GHOST) {
      return;
    }

    const ghost = enemy as GhostEnemy;

    // If in phase warning, don't move
    if (ghost.phaseWarningTimer > 0) {
      return;
    }

    // Normal movement processing
    const newPos = this.calculateNewPosition(ghost);

    if (ghost.isPhasing) {
      // When phasing, pass through walls
      if (this.isValidPositionForPhasing(newPos)) {
        ghost.x = newPos.x;
        ghost.y = newPos.y;
      } else {
        // If hitting a wall, turn around
        ghost.direction = Math.floor(Math.random() * 4);
      }
    } else {
      // In normal state, use normal collision detection
      if (this.isValidPosition(newPos, gameState)) {
        ghost.x = newPos.x;
        ghost.y = newPos.y;
      } else {
        ghost.direction = Math.floor(Math.random() * 4);
      }
    }
  }

  private isValidPositionForPhasing(pos: Position): boolean {
    // When phasing, only check walls
    return pos.x >= 1 && pos.x < 39 && pos.y >= 2 && pos.y < 24;
  }

  public getEnemyDisplayInfo(enemy: Enemy): {
    char: string;
    attributes: CellAttributes;
  } {
    if (enemy.type !== EnemyType.GHOST) {
      return { char: "?", attributes: {} };
    }

    const ghost = enemy as GhostEnemy;
    let char = this.GHOST_CONFIG.displayChar;
    let color = this.GHOST_CONFIG.color;

    // Phase warning
    if (ghost.phaseWarningTimer > 0) {
      color = this.GHOST_CONFIG.warningColor;
      // Flashing effect
      if (Math.floor(ghost.phaseWarningTimer / 3) % 2 === 0) {
        char = "!";
      }
    }
    // Phasing
    else if (ghost.isPhasing) {
      color = this.GHOST_CONFIG.phaseColor;
      char = "?"; // 無形化状態の表示
    }
    // Blinking (when appearing)
    else if (ghost.isBlinking) {
      color = this.GHOST_CONFIG.phaseColor;
      char = "o";
    }

    return {
      char,
      attributes: {
        color,
        isPassable: ghost.isBlinking || ghost.isPhasing,
      },
    };
  }

  // Spawn related methods
  public spawnGhost(
    position: Position,
    isBlinking: boolean = true
  ): string | null {
    const ghost = this.createEnemy(EnemyType.GHOST, position, { isBlinking });
    if (ghost) {
      this.addEnemy(ghost);
      return ghost.id;
    }
    return null;
  }

  public getGhostCount(): number {
    return this.getEnemiesByType(EnemyType.GHOST).length;
  }

  public getAllGhosts(): GhostEnemy[] {
    return this.getEnemiesByType(EnemyType.GHOST) as GhostEnemy[];
  }

  // Adjust difficulty
  public adjustGhostDifficulty(difficultyMultiplier: number): void {
    const ghosts = this.getAllGhosts();
    for (const ghost of ghosts) {
      // Adjust phase chance
      ghost.phaseChance = Math.min(
        this.GHOST_CONFIG.phaseChance * difficultyMultiplier,
        0.4 // Maximum 40%
      );

      // Adjust movement speed
      ghost.moveInterval = Math.max(
        Math.floor(this.GHOST_CONFIG.moveInterval / difficultyMultiplier),
        6 // Minimum 6 frame interval
      );
    }
  }

  // Get metrics
  public getGhostMetrics(): {
    averagePhaseFrequency: number;
    phaseSuccessRate: number;
    explosionSurvivalRate: number;
    overlapResolutions: number;
  } {
    const ghosts = this.getAllGhosts();
    if (ghosts.length === 0) {
      return {
        averagePhaseFrequency: 0,
        phaseSuccessRate: 0,
        explosionSurvivalRate: 0,
        overlapResolutions: 0,
      };
    }

    const totalPhaseChance = ghosts.reduce(
      (sum, ghost) => sum + ghost.phaseChance,
      0
    );
    const averagePhaseFrequency = totalPhaseChance / ghosts.length;

    return {
      averagePhaseFrequency,
      phaseSuccessRate: 0.85,
      explosionSurvivalRate: 0,
      overlapResolutions: 0,
    };
  }

  // Debug information
  public getGhostDebugInfo(): any {
    const ghosts = this.getAllGhosts();
    return {
      count: ghosts.length,
      config: this.GHOST_CONFIG,
      ghosts: ghosts.map((ghost) => ({
        id: ghost.id,
        position: { x: ghost.x, y: ghost.y },
        isPhasing: ghost.isPhasing,
        phaseTimer: ghost.phaseTimer,
        phaseCooldown: ghost.phaseCooldown,
        phaseWarningTimer: ghost.phaseWarningTimer,
        phaseChance: ghost.phaseChance,
        isBlinking: ghost.isBlinking,
        blinkDuration: ghost.blinkDuration,
      })),
      metrics: this.getGhostMetrics(),
    };
  }

  public getConfig() {
    return this.GHOST_CONFIG;
  }
}
