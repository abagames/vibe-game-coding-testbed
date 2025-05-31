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
    baseScore: 360, // リーダーのみ
    followerScore: 0, // 仲間は個別スコアなし
    groupDestroyBonus: 200, // 群れ全体破壊ボーナス
    moveInterval: 48, // リーダー
    followerMoveInterval: 20,
    maxSwarmSize: 5, // リーダー + 4体の仲間に変更
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
    // 点滅エフェクトの更新
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

    // 点滅中の表示（出現時エフェクト）
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
        // 非表示フェーズ
        return {
          char: " ",
          attributes: {
            entityType: "empty",
            isPassable: true,
          },
        };
      }
    }

    // 通常表示
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
    const swarmSize = 5; // リーダー + 4体の仲間に固定

    // リーダーを作成
    const leader = this.createSwarmLeader(leaderPosition, swarmId, swarmSize);
    if (!leader) {
      console.warn(
        `Failed to create swarm leader at (${leaderPosition.x}, ${leaderPosition.y})`
      );
      return null;
    }

    // 仲間を4体作成
    const followers = this.createSwarmFollowers(leader, 4);

    // 最低1体の仲間が必要
    if (followers.length === 0) {
      console.warn(
        `Failed to create any followers for swarm at (${leaderPosition.x}, ${leaderPosition.y})`
      );
      return null;
    }

    // 群れグループに登録
    const swarmGroup = [leader, ...followers];
    this.swarmGroups.set(swarmId, swarmGroup);

    // 全メンバーを敵リストに追加
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
        "リーダーを撃破すると群れ全体が破壊される",
        "群れ全体を囲い込むと高得点",
      ],

      // スワーム固有プロパティ
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
      { x: -1, y: 0 }, // 左
      { x: 1, y: 0 }, // 右
      { x: 0, y: -1 }, // 上
    ];

    for (let i = 0; i < followerCount && i < offsets.length; i++) {
      const offset = offsets[i];
      const followerPosition = {
        x: leader.x + offset.x,
        y: leader.y + offset.y,
      };

      // 境界チェック
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
        "仲間は囲んでも破壊できない",
        "リーダーを破壊すると仲間も一緒に破壊される",
      ],

      // スワーム固有プロパティ
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
    // 点滅中は移動しない
    if (leader.isBlinking) {
      return;
    }

    // 仲間の状態をチェック
    const followers = this.getSwarmFollowers(leader.swarmId);
    const separatedFollowers = followers.filter((f) => f.isSeparated);

    // 仲間がプレイヤーを追跡中かチェック
    const chasingFollowers = followers.filter((f) => {
      const distanceToPlayer = this.calculateDistance(
        f,
        gameState.playerPosition
      );
      return distanceToPlayer <= 30;
    });

    // 分離した仲間がいる場合は待機
    if (separatedFollowers.length > 0) {
      // 移動速度を下げて仲間を待つ
      if (Math.random() < 0.05) {
        // 通常の1/3の確率で移動
        leader.direction = Math.floor(Math.random() * 4);
      }
      return;
    }

    // プレイヤーとの距離をチェック
    const playerDistance = this.calculateDistance(
      leader,
      gameState.playerPosition
    );

    // 仲間がプレイヤーを追跡中の場合、リーダーは支援行動
    if (chasingFollowers.length > 0) {
      // プレイヤーを挟み撃ちするような位置取り
      this.supportFollowers(leader, gameState.playerPosition, chasingFollowers);
      return;
    }

    // プレイヤーが近い場合は回避行動
    if (playerDistance <= 5) {
      this.avoidPlayer(leader, gameState.playerPosition);
      return;
    }

    // 通常のランダム移動（方向転換確率15%）
    if (Math.random() < 0.15) {
      leader.direction = Math.floor(Math.random() * 4);
    }
  }

  private avoidPlayer(leader: SwarmEnemy, playerPosition: Position): void {
    // プレイヤーから離れる方向を選択
    const deltaX = leader.x - playerPosition.x;
    const deltaY = leader.y - playerPosition.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // X軸方向に逃げる
      leader.direction = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      // Y軸方向に逃げる
      leader.direction = deltaY > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private chasePlayer(follower: SwarmEnemy, playerPosition: Position): void {
    // プレイヤーに向かって移動
    const deltaX = playerPosition.x - follower.x;
    const deltaY = playerPosition.y - follower.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // X軸方向に追跡
      follower.direction = deltaX > 0 ? Direction.RIGHT : Direction.LEFT;
    } else {
      // Y軸方向に追跡
      follower.direction = deltaY > 0 ? Direction.DOWN : Direction.UP;
    }
  }

  private supportFollowers(
    leader: SwarmEnemy,
    playerPosition: Position,
    chasingFollowers: SwarmEnemy[]
  ): void {
    // 仲間がプレイヤーを追跡中の場合、リーダーは戦略的な位置取りを行う
    if (chasingFollowers.length === 0) return;

    // 最も近い追跡中の仲間を取得
    const closestChaser = chasingFollowers.reduce((closest, current) => {
      const closestDist = this.calculateDistance(closest, playerPosition);
      const currentDist = this.calculateDistance(current, playerPosition);
      return currentDist < closestDist ? current : closest;
    });

    // プレイヤーと仲間の位置関係から、挟み撃ち位置を計算
    const chaserToPlayer = {
      x: playerPosition.x - closestChaser.x,
      y: playerPosition.y - closestChaser.y,
    };

    // リーダーはプレイヤーの反対側に回り込む
    const targetX = playerPosition.x - chaserToPlayer.x;
    const targetY = playerPosition.y - chaserToPlayer.y;

    // 目標位置への移動
    if (leader.x < targetX) {
      leader.direction = Direction.RIGHT;
    } else if (leader.x > targetX) {
      leader.direction = Direction.LEFT;
    } else if (leader.y < targetY) {
      leader.direction = Direction.DOWN;
    } else if (leader.y > targetY) {
      leader.direction = Direction.UP;
    } else {
      // 既に良い位置にいる場合は待機
      if (Math.random() < 0.1) {
        leader.direction = Math.floor(Math.random() * 4);
      }
    }
  }

  private updateFollower(follower: SwarmEnemy, gameState: GameState): void {
    // 点滅中は移動しない
    if (follower.isBlinking) {
      return;
    }

    // リーダーを探す
    const leader = this.findLeaderById(follower.leaderId);
    if (!leader) {
      // リーダーが見つからない場合は独立行動
      this.convertToIndependentBehavior(follower);
      return;
    }

    // プレイヤーとの距離をチェック
    const distanceToPlayer = this.calculateDistance(
      follower,
      gameState.playerPosition
    );
    const distanceToLeader = this.calculateDistance(follower, leader);

    // プレイヤーが近い場合（30マス以内）は追跡行動
    if (distanceToPlayer <= 30) {
      this.chasePlayer(follower, gameState.playerPosition);
      // 追跡中は分離タイマーをリセット（プレイヤー追跡を優先）
      follower.separationTimer = 0;
      return;
    }

    // プレイヤーが離れている場合はリーダーの元に戻る
    // 分離状態の管理
    if (distanceToLeader > follower.maxDistanceFromLeader) {
      follower.separationTimer++;
      if (follower.separationTimer > 180) {
        // 3秒で分離状態
        follower.isSeparated = true;
      }
    } else {
      follower.separationTimer = 0;
      follower.isSeparated = false;
    }

    // 分離状態の場合は再結合を試行
    if (follower.isSeparated) {
      this.handleSeparatedFollower(follower, leader);
      return;
    }

    // 通常の追従ロジック（リーダーの元に戻る）
    const targetPosition = {
      x: leader.x + follower.formationOffset.x,
      y: leader.y + follower.formationOffset.y,
    };

    // 目標位置への移動
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
      // リーダーが削除される場合、群れ全体を処理
      this.handleLeaderDestruction(enemy);
    } else {
      // 仲間が削除される場合
      this.handleFollowerDestruction(enemy);
    }

    super.removeEnemy(enemyId);
  }

  private handleLeaderDestruction(leader: SwarmEnemy): void {
    const followers = this.getSwarmFollowers(leader.swarmId);

    // 全仲間を同時破壊
    for (const follower of followers) {
      super.removeEnemy(follower.id);
    }

    // 群れグループを削除
    this.swarmGroups.delete(leader.swarmId);

    console.log(
      `🐝 Swarm Leader destroyed! Chain reaction: ${followers.length} followers destroyed`
    );
  }

  private handleFollowerDestruction(follower: SwarmEnemy): void {
    // 群れグループから除外
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
    // 仲間を独立した敵として行動させる（ランダム移動）
    if (Math.random() < 0.3) {
      follower.direction = Math.floor(Math.random() * 4);
    }

    // 長時間分離している場合は群れから除外
    follower.reunionTimer++;
    if (follower.reunionTimer > 600) {
      // 10秒
      this.handleFollowerDestruction(follower);
    }
  }

  private handleSeparatedFollower(
    follower: SwarmEnemy,
    leader: SwarmEnemy
  ): void {
    follower.reunionTimer++;

    // 再結合試行（1秒ごと）
    if (follower.reunionTimer % 60 === 0) {
      const distanceToLeader = this.calculateDistance(follower, leader);
      if (distanceToLeader <= 8) {
        // 再結合範囲
        follower.isSeparated = false;
        follower.isReuniting = true;
        follower.reunionTimer = 0;
        return;
      }
    }

    // 独立行動
    if (follower.reunionTimer > 300) {
      // 5秒経過で完全独立
      this.convertToIndependentBehavior(follower);
    } else {
      // リーダーに向かって移動
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
