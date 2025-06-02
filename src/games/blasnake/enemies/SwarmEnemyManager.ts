import { BaseEnemyManager } from "./BaseEnemyManager.js";
import {
  SwarmEnemy,
  EnemyType,
  Position,
  Direction,
  GameState,
  ThreatLevel,
} from "./types.js";
import { CellAttributes, cglColor } from "../../../core/coreTypes.js";

export class SwarmEnemyManager extends BaseEnemyManager {
  private readonly SWARM_CONFIG: {
    leaderChar: string;
    followerChar: string;
    leaderColor: cglColor;
    followerColor: cglColor;
    baseScore: number;
    followerScore: number;
    groupDestroyBonus: number;
    moveInterval: number;
    followerMoveInterval: number;
    maxSwarmSize: number;
    threatLevel: ThreatLevel;
  } = {
    leaderChar: "S",
    followerChar: "s",
    leaderColor: "green",
    followerColor: "light_green",
    baseScore: 360, // Leader only
    followerScore: 0, // Followers have no individual score
    groupDestroyBonus: 200, // Bonus for destroying the entire swarm
    moveInterval: 48, // Leader
    followerMoveInterval: 20,
    maxSwarmSize: 5, // Changed to leader + 4 followers
    threatLevel: ThreatLevel.HIGH,
  };

  private swarmGroups: Map<string, SwarmEnemy[]> = new Map();

  public createEnemy(type: EnemyType, position: Position): SwarmEnemy | null {
    if (type !== EnemyType.SWARM) {
      return null;
    }

    return this.spawnSwarmGroup(position);
  }

  public updateEnemyLogic(enemy: SwarmEnemy, gameState: GameState): void {
    // Update blinking effect
    this.updateBlinking(enemy);

    if (enemy.isLeader) {
      this.updateLeader(enemy, gameState);
    } else {
      this.updateFollower(enemy, gameState);
    }
  }

  public getEnemyDisplayInfo(enemy: SwarmEnemy): {
    char: string;
    attributes: CellAttributes;
  } {
    const baseChar = enemy.isLeader
      ? this.SWARM_CONFIG.leaderChar
      : this.SWARM_CONFIG.followerChar;
    const baseColor = enemy.isLeader
      ? this.SWARM_CONFIG.leaderColor
      : this.SWARM_CONFIG.followerColor;

    // Blinking display (spawn effect)
    if (enemy.isBlinking) {
      const blinkPhase =
        Math.floor((enemy.maxBlinkDuration - enemy.blinkDuration) / 5) % 2;

      if (blinkPhase === 0) {
        return {
          char: baseChar,
          attributes: {
            entityType: "enemy_blinking",
            isPassable: true,
            color: baseColor,
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
    }

    // Normal display
    return {
      char: baseChar,
      attributes: {
        entityType: "enemy",
        color: baseColor,
        isPassable: false,
      },
    };
  }

  public spawnSwarmGroup(leaderPosition: Position): SwarmEnemy | null {
    const swarmId = this.generateSwarmId();
    const swarmSize = 5; // Fixed to leader + 4 followers

    const leader = this.createSwarmLeader(leaderPosition, swarmId, swarmSize);
    if (!leader) {
      console.warn(
        `Failed to create swarm leader at (${leaderPosition.x}, ${leaderPosition.y})`
      );
      return null;
    }

    // Create 4 followers
    const followers = this.createSwarmFollowers(leader, 4);

    // At least 1 follower is required
    if (followers.length === 0) {
      console.warn(
        `Failed to create any followers for swarm at (${leaderPosition.x}, ${leaderPosition.y})`
      );
      return null;
    }

    // Register swarm group
    const swarmGroup = [leader, ...followers];
    this.swarmGroups.set(swarmId, swarmGroup);

    // Add all members to enemy list
    for (const member of swarmGroup) {
      this.addEnemy(member);
    }

    console.log(
      `🐝 Swarm spawned: Leader at (${leaderPosition.x}, ${leaderPosition.y}), ${followers.length} followers`
    );

    return leader;
  }

  private createSwarmLeader(
    position: Position,
    swarmId: string,
    swarmSize: number
  ): SwarmEnemy | null {
    const leader: SwarmEnemy = {
      id: this.generateEnemyId("swarm"),
      x: position.x,
      y: position.y,
      direction: Math.floor(Math.random() * 4),
      moveCounter: 0,
      isBlinking: true,
      blinkDuration: 120,
      maxBlinkDuration: 120,
      type: EnemyType.SWARM,
      baseScore: this.SWARM_CONFIG.baseScore,
      moveInterval: this.SWARM_CONFIG.moveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.SWARM_CONFIG.threatLevel,
      playerLearningHints: [
        "Defeating the leader destroys the entire swarm",
        "Surrounding the entire swarm yields high score",
      ],

      // Swarm-specific properties
      swarmSize,
      isLeader: true,
      leaderPosition: null,
      leaderId: null,
      formationOffset: { x: 0, y: 0 },
      swarmId,
      leadershipScore: 1.0,
      cohesionStrength: 1.0,
      formationType: "diamond",
      maxDistanceFromLeader: 0,
      followDelay: 0,
      lastLeaderPosition: null,
      separationTimer: 0,
      reunionTimer: 0,
      isSeparated: false,
      isReuniting: false,
    };

    return leader;
  }

  private createSwarmFollowers(
    leader: SwarmEnemy,
    followerCount: number
  ): SwarmEnemy[] {
    const followers: SwarmEnemy[] = [];
    const offsets = [
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 }, // Right
      { x: 0, y: -1 }, // Up
    ];

    for (let i = 0; i < followerCount && i < offsets.length; i++) {
      const offset = offsets[i];
      const followerPosition = {
        x: leader.x + offset.x,
        y: leader.y + offset.y,
      };

      // Boundary check
      if (
        followerPosition.x >= 1 &&
        followerPosition.x < 39 &&
        followerPosition.y >= 2 &&
        followerPosition.y < 24
      ) {
        const follower = this.createSwarmFollower(
          leader,
          offset,
          followerPosition
        );
        followers.push(follower);
      }
    }

    return followers;
  }

  private createSwarmFollower(
    leader: SwarmEnemy,
    formationOffset: Position,
    position: Position
  ): SwarmEnemy {
    const follower: SwarmEnemy = {
      id: this.generateEnemyId("swarm"),
      x: position.x,
      y: position.y,
      direction: leader.direction,
      moveCounter: 0,
      isBlinking: true,
      blinkDuration: 120,
      maxBlinkDuration: 120,
      type: EnemyType.SWARM,
      baseScore: this.SWARM_CONFIG.followerScore,
      moveInterval: this.SWARM_CONFIG.followerMoveInterval,
      specialTimer: 0,
      isDestroyed: false,
      spawnTime: Date.now(),
      threatLevel: this.SWARM_CONFIG.threatLevel,
      playerLearningHints: [
        "Surrounding the swarm does not destroy it",
        "Destroying the leader destroys the entire swarm",
      ],

      // Swarm-specific properties
      swarmSize: leader.swarmSize,
      isLeader: false,
      leaderPosition: { x: leader.x, y: leader.y },
      leaderId: leader.id,
      formationOffset,
      swarmId: leader.swarmId,
      leadershipScore: 0,
      cohesionStrength: 0.8,
      formationType: "diamond",
      maxDistanceFromLeader: 4,
      followDelay: 8,
      lastLeaderPosition: { x: leader.x, y: leader.y },
      separationTimer: 0,
      reunionTimer: 0,
      isSeparated: false,
      isReuniting: false,
    };

    return follower;
  }

  private updateLeader(leader: SwarmEnemy, gameState: GameState): void {
    // Blinking effect, do not move
    if (leader.isBlinking) {
      return;
    }

    // Check followers' state
    const followers = this.getSwarmFollowers(leader.swarmId);
    const separatedFollowers = followers.filter((f) => f.isSeparated);

    // Check if followers are chasing the player
    const chasingFollowers = followers.filter((f) => {
      const distanceToPlayer = this.calculateDistance(
        f,
        gameState.playerPosition
      );
      return distanceToPlayer <= 30;
    });

    // If separated followers exist, wait
    if (separatedFollowers.length > 0) {
      // Slow down movement and wait for followers
      if (Math.random() < 0.05) {
        // 1/3 probability to move
        leader.direction = Math.floor(Math.random() * 4);
      }
      return;
    }

    // Check distance to player
    const playerDistance = this.calculateDistance(
      leader,
      gameState.playerPosition
    );

    // If followers are chasing the player, leader supports
    if (chasingFollowers.length > 0) {
      // Position to trap the player
      this.supportFollowers(leader, gameState.playerPosition, chasingFollowers);
      return;
    }

    // If player is close, avoid
    if (playerDistance <= 5) {
      this.avoidPlayer(leader, gameState.playerPosition);
      return;
    }

    // Normal random movement (15% chance to change direction)
    if (Math.random() < 0.15) {
      leader.direction = Math.floor(Math.random() * 4);
    }
  }

  private avoidPlayer(leader: SwarmEnemy, playerPosition: Position): void {
    // Choose direction to move away from player
    const deltaX = leader.x - playerPosition.x;
    const deltaY = leader.y - playerPosition.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Move away from player in X-axis
      leader.direction = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      // Move away from player in Y-axis
      leader.direction = deltaY > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private chasePlayer(follower: SwarmEnemy, playerPosition: Position): void {
    // Move towards player
    const deltaX = playerPosition.x - follower.x;
    const deltaY = playerPosition.y - follower.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Move towards player in X-axis
      follower.direction = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      // Move towards player in Y-axis
      follower.direction = deltaY > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private supportFollowers(
    leader: SwarmEnemy,
    playerPosition: Position,
    chasingFollowers: SwarmEnemy[]
  ): void {
    // If followers are chasing the player, leader takes a strategic position
    if (chasingFollowers.length === 0) return;

    // Get the closest chasing follower
    const closestChaser = chasingFollowers.reduce((closest, current) => {
      const closestDist = this.calculateDistance(closest, playerPosition);
      const currentDist = this.calculateDistance(current, playerPosition);
      return currentDist < closestDist ? current : closest;
    });

    // Calculate the position to trap the player
    const chaserToPlayer = {
      x: playerPosition.x - closestChaser.x,
      y: playerPosition.y - closestChaser.y,
    };

    // Leader circles around the player
    const targetX = playerPosition.x - chaserToPlayer.x;
    const targetY = playerPosition.y - chaserToPlayer.y;

    // Move towards the target position
    if (leader.x < targetX) {
      leader.direction = Direction.RIGHT;
    } else if (leader.x > targetX) {
      leader.direction = Direction.LEFT;
    } else if (leader.y < targetY) {
      leader.direction = Direction.DOWN;
    } else if (leader.y > targetY) {
      leader.direction = Direction.UP;
    } else {
      // If already in a good position, wait
      if (Math.random() < 0.1) {
        leader.direction = Math.floor(Math.random() * 4);
      }
    }
  }

  private updateFollower(follower: SwarmEnemy, gameState: GameState): void {
    // Blinking effect, do not move
    if (follower.isBlinking) {
      return;
    }

    // Find leader
    const leader = this.findLeaderById(follower.leaderId);
    if (!leader) {
      // If leader not found, independent behavior
      this.convertToIndependentBehavior(follower);
      return;
    }

    // Check distance to player
    const distanceToPlayer = this.calculateDistance(
      follower,
      gameState.playerPosition
    );
    const distanceToLeader = this.calculateDistance(follower, leader);

    // If player is close (within 30 cells), pursue
    if (distanceToPlayer <= 30) {
      this.chasePlayer(follower, gameState.playerPosition);
      // During pursuit, reset separation timer (player pursuit priority)
      follower.separationTimer = 0;
      return;
    }

    // If player is far away, move back to leader
    // Manage separation state
    if (distanceToLeader > follower.maxDistanceFromLeader) {
      follower.separationTimer++;
      if (follower.separationTimer > 180) {
        // 3 seconds to separated state
        follower.isSeparated = true;
      }
    } else {
      follower.separationTimer = 0;
      follower.isSeparated = false;
    }

    // If separated, try to reunite
    if (follower.isSeparated) {
      this.handleSeparatedFollower(follower, leader);
      return;
    }

    // Normal following logic (move back to leader)
    const targetPosition = {
      x: leader.x + follower.formationOffset.x,
      y: leader.y + follower.formationOffset.y,
    };

    // Move towards the target position
    if (follower.x < targetPosition.x) {
      follower.direction = Direction.RIGHT;
    } else if (follower.x > targetPosition.x) {
      follower.direction = Direction.LEFT;
    } else if (follower.y < targetPosition.y) {
      follower.direction = Direction.DOWN;
    } else if (follower.y > targetPosition.y) {
      follower.direction = Direction.UP;
    }
  }

  private findLeaderById(leaderId: string | null): SwarmEnemy | null {
    if (!leaderId) return null;

    const enemy = this.getEnemy(leaderId);
    return enemy &&
      enemy.type === EnemyType.SWARM &&
      (enemy as SwarmEnemy).isLeader
      ? (enemy as SwarmEnemy)
      : null;
  }

  public removeEnemy(enemyId: string): void {
    const enemy = this.getEnemy(enemyId) as SwarmEnemy;
    if (!enemy) return;

    if (enemy.isLeader) {
      // If leader is deleted, process the entire swarm
      this.handleLeaderDestruction(enemy);
    } else {
      // If follower is deleted
      this.handleFollowerDestruction(enemy);
    }

    super.removeEnemy(enemyId);
  }

  private handleLeaderDestruction(leader: SwarmEnemy): void {
    const followers = this.getSwarmFollowers(leader.swarmId);

    // Destroy all followers at once
    for (const follower of followers) {
      super.removeEnemy(follower.id);
    }

    // Delete swarm group
    this.swarmGroups.delete(leader.swarmId);

    console.log(
      `🐝 Swarm Leader destroyed! Chain reaction: ${followers.length} followers destroyed`
    );
  }

  private handleFollowerDestruction(follower: SwarmEnemy): void {
    // Remove from swarm group
    const swarmGroup = this.swarmGroups.get(follower.swarmId);
    if (swarmGroup) {
      const index = swarmGroup.findIndex((member) => member.id === follower.id);
      if (index !== -1) {
        swarmGroup.splice(index, 1);
      }
    }
  }

  private getSwarmFollowers(swarmId: string): SwarmEnemy[] {
    const swarmGroup = this.swarmGroups.get(swarmId);
    if (!swarmGroup) return [];

    return swarmGroup.filter((member) => !member.isLeader);
  }

  private generateSwarmId(): string {
    return `swarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  private convertToIndependentBehavior(follower: SwarmEnemy): void {
    // Make follower behave independently (random movement)
    if (Math.random() < 0.3) {
      follower.direction = Math.floor(Math.random() * 4);
    }

    // If separated for a long time, remove from swarm
    follower.reunionTimer++;
    if (follower.reunionTimer > 600) {
      // 10 seconds
      this.handleFollowerDestruction(follower);
    }
  }

  private handleSeparatedFollower(
    follower: SwarmEnemy,
    leader: SwarmEnemy
  ): void {
    follower.reunionTimer++;

    // Try to reunite (every 1 second)
    if (follower.reunionTimer % 60 === 0) {
      const distanceToLeader = this.calculateDistance(follower, leader);
      if (distanceToLeader <= 8) {
        // Reunion range
        follower.isSeparated = false;
        follower.isReuniting = true;
        follower.reunionTimer = 0;
        return;
      }
    }

    // Independent behavior
    if (follower.reunionTimer > 300) {
      // 5 seconds passed, fully independent
      this.convertToIndependentBehavior(follower);
    } else {
      // Move towards leader
      if (follower.x < leader.x) {
        follower.direction = Direction.RIGHT;
      } else if (follower.x > leader.x) {
        follower.direction = Direction.LEFT;
      } else if (follower.y < leader.y) {
        follower.direction = Direction.DOWN;
      } else if (follower.y > leader.y) {
        follower.direction = Direction.UP;
      }
    }
  }
}
