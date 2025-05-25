# Blasnake 敵仕様書

## 概要

Blasnake ゲームに実装予定の 10 種類の敵タイプの詳細仕様。
ゲームデザイン・レベルデザイン観点からの改善版。

## 設計理念

### プレイヤーエクスペリエンス重視

- **明確な学習曲線**: 各敵タイプが段階的にプレイヤーのスキルを向上させる
- **直感的な理解**: 視覚的・行動的特徴から敵の性質を即座に把握可能
- **戦略的深度**: 各敵への対策が複数存在し、プレイヤーの創造性を促進

### リスク・リワードバランス

- **難易度と報酬の相関**: 倒すのが困難な敵ほど高得点
- **戦略的価値**: 単純な撃破以外の価値（位置取り、タイミング等）を提供
- **プレイヤー選択**: 積極的攻略 vs 回避戦術の選択肢

## 型定義システム

### 基底型定義

```typescript
// 基本的な敵インターフェース
interface BaseEnemy {
  id: string; // ユニークID
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
  isDestroyed: boolean; // 破壊フラグ
  spawnTime: number; // 出現時刻
  threatLevel: ThreatLevel; // 脅威度
  playerLearningHints: string[]; // プレイヤー向けヒント
}

// 判別可能な共用体型による敵タイプ定義
type Enemy =
  | WandererEnemy
  | GuardEnemy
  | ChaserEnemy
  | SplitterEnemy
  | SpeedsterEnemy
  | MimicEnemy // SNAKE敵の代替
  | BomberEnemy
  | WallCreeperEnemy
  | GhostEnemy
  | SwarmEnemy;

enum EnemyType {
  WANDERER = "wanderer",
  GUARD = "guard",
  CHASER = "chaser",
  SPLITTER = "splitter",
  SPEEDSTER = "speedster",
  MIMIC = "mimic", // 変更: SNAKE → MIMIC
  BOMBER = "bomber",
  WALL_CREEPER = "wall_creeper",
  GHOST = "ghost",
  SWARM = "swarm",
}

enum ThreatLevel {
  LOW = 1, // 学習用・基本敵
  MEDIUM = 2, // 戦術的挑戦
  HIGH = 3, // 高度な戦略要求
  EXTREME = 4, // 最高難易度
}

// 設定可能なパラメータ
interface EnemyConfig {
  readonly displayChar: string;
  readonly color: string;
  readonly baseScore: number;
  readonly moveInterval: number;
  readonly spawnWeight: number;
  readonly maxCount: number; // 同時出現最大数
  readonly threatLevel: ThreatLevel;
  readonly learningObjective: string; // プレイヤーの学習目標
  readonly counterStrategies: string[]; // 対策方法
}
```

## 1. ワンダラータイプ敵 (Wanderer Enemy) - 現在実装済み

ランダム移動する敵タイプ。

### ゲームデザイン目的

**学習目標**: スネークの基本操作と囲み戦術の習得
**プレイヤー体験**: 「さまよう敵を囲んで破壊する」基本的な達成感

### 基本情報

- **表示文字**: `X` (通常時), `o` (点滅時)
- **色**: `red` (通常時), `light_red` (点滅時)
- **基本点数**: 100 点 (囲み爆発時)
- **移動速度**: 12 フレーム間隔
- **脅威度**: LOW (基本敵)

#### 型定義

```typescript
interface Enemy {
  x: number;
  y: number;
  direction: Direction;
  moveCounter: number;
  isBlinking: boolean;
  blinkDuration: number;
  maxBlinkDuration: number;
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}
```

#### 行動仕様

- **移動パターン**: ランダムウォーク（30%の確率で方向転換）
- **移動間隔**: 12 フレームごとに移動
- **衝突回避**: 壁、スネーク、他の敵との衝突を回避
- **点滅状態**: 出現時に 2 秒間点滅（通過可能状態）
- **破壊条件**: 囲み爆発によってのみ破壊可能

#### スポーンシステム

- **初期数**: 5 体
- **最小維持数**: 3 体
- **スポーン間隔**:
  - 通常時: 600 フレーム（10 秒）
  - 敵不足時: 180 フレーム（3 秒）
- **スポーン位置**: ランダム（有効位置のみ）
- **新規敵の状態**: 120 フレーム（2 秒）点滅

#### 破壊エフェクト

囲み爆発で破壊された際に専用の破壊エフェクトが表示される：

```typescript
interface EnemyDestroyEffect {
  x: number;
  y: number;
  duration: number;
  maxDuration: number;
  effectType: "destroy" | "blast";
}
```

- **エフェクト文字**: `#` → `%` → `&` → `~` → `-`
- **色変化**: `yellow` → `yellow` → `light_red` → `red` → `light_red`
- **持続時間**: 60 フレーム

#### 囲み爆発システム

- **発動条件**:
  - スネークの長さが 8 以上
  - 頭部が尻尾の 3 セグメント以内（2 マス以内）
  - 囲まれた領域が全体の 30%以下
- **爆発範囲**: 囲まれた領域全体
- **得点**: 破壊された敵 1 体につき 100 点
- **エフェクト**:
  - 領域爆発: `*` → `!` → `+` → `.`
  - 敵破壊: `#` → `%` → `&` → `~` → `-`

#### プレイヤー学習要素

- **基本移動**: スネークの基本操作
- **囲み戦術**: 敵を囲んで破壊する基本戦略
- **タイミング**: 囲み爆発の発動タイミング
- **空間認識**: 領域の大きさと形状の把握

#### 設定パラメータ

```typescript
const WANDERER_ENEMY_CONFIG = {
  displayChar: "X",
  blinkingChar: "o",
  color: "red",
  blinkingColor: "light_red",
  moveInterval: 12,
  directionChangeChance: 0.3,
  initialCount: 5,
  minCount: 3,
  spawnInterval: 600,
  fastSpawnInterval: 180,
  blinkDuration: 120,
  destroyScore: 100,
};
```

---

## 2. ガードタイプ敵 (Guard Enemy)

### ゲームデザイン目的

**学習目標**: 食べ物の戦略的価値とリソース管理の理解
**プレイヤー体験**: 「守られた宝を奪う」達成感

### 基本情報

- **表示文字**: `G`
- **色**: `yellow` (警戒色)
- **基本点数**: 120 点 (調整: リスクに見合った報酬)
- **移動速度**: 通常の 2 倍遅い (24 フレーム間隔)
- **脅威度**: LOW (学習用)

### 型定義

```typescript
interface GuardEnemy extends BaseEnemy {
  type: EnemyType.GUARD;
  guardTarget: Position | null; // 守っている食べ物の位置
  patrolRadius: number; // 巡回半径
  patrolAngle: number; // 現在の巡回角度
  returnToFoodTimer: number; // 食べ物に戻るタイマー
  alertLevel: number; // 警戒レベル (プレイヤー接近時)
}

const GUARD_CONFIG: EnemyConfig = {
  displayChar: "G",
  color: "yellow",
  baseScore: 120,
  moveInterval: 24,
  spawnWeight: 30,
  maxCount: 2,
  threatLevel: ThreatLevel.LOW,
  learningObjective: "食べ物の戦略的価値を理解し、リソース管理を学ぶ",
  counterStrategies: [
    "ガードから離れた食べ物を優先的に取る",
    "ガードが巡回で離れた隙を狙う",
    "ガードを囲んで撃破後に食べ物を安全に取る",
  ],
};

const GUARD_BEHAVIOR_CONFIG = {
  patrolRadius: 4,
  maxDistanceFromFood: 5,
  returnTimeout: 180, // 3秒
  searchRadius: 8, // 食べ物検索範囲
  alertRadius: 3, // プレイヤー警戒範囲
};
```

### 行動仕様

- **出現**: 食べ物から半径 3 マス以内にランダム出現
- **移動パターン**: 食べ物を中心とした半径 4 マス以内を巡回
- **特殊能力**: 食べ物から 5 マス以上離れると食べ物に向かって移動
- **プレイヤー反応**: プレイヤーが接近すると警戒状態になり移動速度が上昇
- **エラーハンドリング**: 守る食べ物が消失した場合は新しい食べ物を探索

### プレイヤー学習要素

- **初回遭遇**: 「なぜこの敵は特定の場所にいるのか？」
- **理解段階**: 「食べ物を守っている」
- **戦略発展**: 「どうやって効率的に対処するか」

---

## 3. チェイサータイプ敵 (Chaser Enemy)

### ゲームデザイン目的

**学習目標**: 逃走戦術と空間認識の向上
**プレイヤー体験**: 「追跡からの脱出」スリル

### 基本情報

- **表示文字**: `C`
- **色**: `light_red` (追跡を示す)
- **基本点数**: 180 点 (調整: 逃走の困難さを反映)
- **移動速度**: 通常より少し速い (8 フレーム間隔)
- **脅威度**: MEDIUM (戦術的挑戦)

### 型定義

```typescript
interface ChaserEnemy extends BaseEnemy {
  type: EnemyType.CHASER;
  chaseTarget: Position; // 追跡対象の位置
  stunDuration: number; // スタン残り時間
  lastValidDirection: Direction; // 最後の有効な方向
  pathfindingCooldown: number; // 経路探索クールダウン
  stuckCounter: number; // 行き詰まり検出
  chaseIntensity: number; // 追跡強度 (距離に応じて変化)
}

const CHASER_CONFIG: EnemyConfig = {
  displayChar: "C",
  color: "light_red",
  baseScore: 180,
  moveInterval: 8,
  spawnWeight: 20,
  maxCount: 3,
  threatLevel: ThreatLevel.MEDIUM,
  learningObjective: "逃走戦術と空間認識を向上させる",
  counterStrategies: [
    "壁や障害物を利用してチェイサーを行き詰まらせる",
    "他の敵を盾として利用する",
    "長い直線を避け、複雑な経路を選ぶ",
    "チェイサーを囲い込みエリアに誘導する",
  ],
};

const CHASER_BEHAVIOR_CONFIG = {
  stunDuration: 30,
  pathfindingInterval: 12,
  maxStuckFrames: 36,
  chaseRange: 15, // 追跡開始距離
  intensityDecayRate: 0.95, // 追跡強度減衰率
};
```

### 行動仕様

- **追跡対象**: スネークの頭部
- **移動パターン**: 最短距離でプレイヤーに向かって移動
- **特殊能力**: 壁や障害物にぶつかると一時的に通常敵の動きになる (30 フレーム)
- **追跡強度**: プレイヤーとの距離に応じて追跡の積極性が変化
- **エラーハンドリング**: 追跡対象が範囲外の場合はランダム移動に切り替え

### プレイヤー学習要素

- **緊急回避**: 即座の危険への対応
- **空間活用**: 地形を利用した戦術
- **予測行動**: チェイサーの動きを先読みした移動

---

## 4. スプリッタータイプ敵 (Splitter Enemy)

### ゲームデザイン目的

**学習目標**: 戦略的タイミングと結果予測
**プレイヤー体験**: 「一筋縄ではいかない」戦略的思考

### 基本情報

- **表示文字**: `S`
- **色**: `magenta` (分裂を示す)
- **基本点数**: 80 点 (分裂後の子敵は 40 点ずつ)
- **移動速度**: 通常と同じ (12 フレーム間隔)
- **脅威度**: MEDIUM (戦略的判断要求)

### 型定義

```typescript
interface SplitterEnemy extends BaseEnemy {
  type: EnemyType.SPLITTER;
  isChild: boolean; // 分裂後の子敵かどうか
  splitCount: number; // 分裂回数
  parentId: string | null; // 親敵のID
  maxSplits: number; // 最大分裂回数
  splitWarningTimer: number; // 分裂予告タイマー
}

const SPLITTER_CONFIG: EnemyConfig = {
  displayChar: "S",
  color: "magenta",
  baseScore: 80,
  moveInterval: 12,
  spawnWeight: 15,
  maxCount: 4,
  threatLevel: ThreatLevel.MEDIUM,
  learningObjective: "戦略的タイミングと結果予測を学ぶ",
  counterStrategies: [
    "分裂を見越して広いエリアで囲む",
    "子敵の出現位置を予測して対処",
    "分裂タイミングを調整して有利な状況を作る",
    "他の敵との位置関係を考慮して撃破順序を決める",
  ],
};

const SPLITTER_BEHAVIOR_CONFIG = {
  maxSplits: 1, // 子敵は分裂しない
  childBlinkDuration: 60,
  childScoreMultiplier: 0.5,
  splitSearchRadius: 2, // 分裂位置検索範囲
  splitWarningDuration: 30, // 分裂予告時間
};
```

### 分裂ロジック

- 親敵の上下左右に子敵を配置試行
- 配置不可能な場合は配置可能な方向のみに生成
- 子敵は分裂しない (splitCount > 0)
- **分裂予告**: 撃破 30 フレーム前に視覚的警告を表示
- **エラーハンドリング**: 分裂位置が全て無効な場合は分裂をスキップ

### プレイヤー学習要素

- **結果予測**: 行動の結果を事前に考える
- **リスク管理**: いつ攻撃し、いつ待つかの判断
- **空間計画**: 分裂後の状況を想定した位置取り

---

## 5. スピードスタータイプ敵 (Speedster Enemy)

### ゲームデザイン目的

**学習目標**: 反応速度と動的判断力の向上
**プレイヤー体験**: 「素早い敵への対応」緊張感

### 基本情報

- **表示文字**: `F` (Fast)
- **色**: `cyan` (高速を示す)
- **基本点数**: 220 点 (調整: 捕捉困難性を反映)
- **移動速度**: 通常の 2 倍速 (6 フレーム間隔)
- **脅威度**: MEDIUM (反応速度要求)

### 型定義

```typescript
interface SpeedsterEnemy extends BaseEnemy {
  type: EnemyType.SPEEDSTER;
  speedMultiplier: number; // 速度倍率
  directionChangeTimer: number; // 方向変更タイマー
  lastDirectionChange: number; // 最後の方向変更時刻
  boostCooldown: number; // ブースト使用後のクールダウン
  predictabilityCounter: number; // 予測可能性カウンター
}

const SPEEDSTER_CONFIG: EnemyConfig = {
  displayChar: "F",
  color: "cyan",
  baseScore: 220,
  moveInterval: 6,
  spawnWeight: 15,
  maxCount: 2,
  threatLevel: ThreatLevel.MEDIUM,
  learningObjective: "反応速度と動的判断力を向上させる",
  counterStrategies: [
    "スピードスターの動きパターンを観察して予測",
    "狭い場所に誘導して動きを制限",
    "他の敵と組み合わせて挟み撃ち",
    "壁際での反射を利用した囲い込み",
  ],
};

const SPEEDSTER_BEHAVIOR_CONFIG = {
  speedMultiplier: 2.0,
  directionChangeInterval: 10,
  directionChangeChance: 0.3,
  wallReflectionEnabled: true,
  predictabilityThreshold: 5, // 予測可能になるまでの移動回数
};
```

### プレイヤー学習要素

- **動的対応**: 素早く変化する状況への適応
- **パターン認識**: 高速移動中のパターン発見
- **先読み技術**: 敵の次の動きを予測

---

## 6. ミミックタイプ敵 (Mimic Enemy)

### ゲームデザイン目的

**学習目標**: 自己認識と行動パターンの客観視
**プレイヤー体験**: 「自分の動きが敵になる」新鮮な驚き

### 基本情報

- **表示文字**: `M` (Mirror)
- **色**: `light_cyan` (模倣を示す)
- **基本点数**: 280 点 (調整: 予測困難性を反映)
- **移動速度**: プレイヤーと同じ (8 フレーム間隔)
- **脅威度**: HIGH (高度な戦略要求)

### 型定義

```typescript
interface MimicEnemy extends BaseEnemy {
  type: EnemyType.MIMIC;
  mimicTarget: Position[]; // 模倣する軌跡
  mimicDelay: number; // 模倣の遅延フレーム数
  mimicAccuracy: number; // 模倣の精度 (0.0-1.0)
  recordingBuffer: Position[]; // プレイヤー軌跡記録
  maxRecordLength: number; // 最大記録長
}

const MIMIC_CONFIG: EnemyConfig = {
  displayChar: "M",
  color: "light_cyan",
  baseScore: 280,
  moveInterval: 8,
  spawnWeight: 12,
  maxCount: 1,
  threatLevel: ThreatLevel.HIGH,
  learningObjective: "自己の行動パターンを客観視し、戦略的思考を深める",
  counterStrategies: [
    "意図的に複雑な軌跡を描いてミミックを混乱させる",
    "急激な方向転換でミミックとの距離を作る",
    "ミミックの遅延を利用して罠に誘導",
    "直線的な動きを避け、予測困難な動きを心がける",
  ],
};

const MIMIC_BEHAVIOR_CONFIG = {
  mimicDelay: 45, // 1.5秒の遅延
  mimicAccuracy: 0.85, // 85%の精度
  maxRecordLength: 120, // 4秒分の軌跡
  accuracyDecayRate: 0.02, // 時間経過による精度低下
};
```

### 行動仕様

- **模倣対象**: プレイヤーの過去の移動軌跡
- **遅延模倣**: 1.5 秒遅れでプレイヤーの動きを再現
- **精度変動**: 時間経過と共に模倣精度が低下
- **学習効果**: プレイヤーの行動パターンを可視化

### プレイヤー学習要素

- **自己分析**: 自分の移動パターンの客観視
- **行動多様化**: パターン化した動きからの脱却
- **戦略的思考**: 敵の行動を逆利用する発想

---

## 7. ボマータイプ敵 (Bomber Enemy)

### ゲームデザイン目的

**学習目標**: 連鎖反応の理解と位置戦略
**プレイヤー体験**: 「爆発の連鎖」ダイナミックな展開

### 基本情報

- **表示文字**: `B`
- **色**: `yellow` (爆発警告色)
- **基本点数**: 250 点 (調整: リスクと連鎖ボーナスを考慮)
- **移動速度**: 通常より遅い (16 フレーム間隔)
- **脅威度**: HIGH (連鎖反応管理)

### 型定義

```typescript
interface BomberEnemy extends BaseEnemy {
  type: EnemyType.BOMBER;
  explosionRadius: number; // 爆発半径
  chainReactionTriggered: boolean; // 連鎖反応フラグ
  explosionDamage: number; // 爆発ダメージ
  explosionEffectDuration: number; // 爆発エフェクト継続時間
  explosionWarningTimer: number; // 爆発予告タイマー
}

const BOMBER_CONFIG: EnemyConfig = {
  displayChar: "B",
  color: "yellow",
  baseScore: 250,
  moveInterval: 16,
  spawnWeight: 10,
  maxCount: 2,
  threatLevel: ThreatLevel.HIGH,
  learningObjective: "連鎖反応を理解し、位置戦略を習得する",
  counterStrategies: [
    "ボマー同士の距離を考慮して撃破順序を決める",
    "連鎖反応を利用して効率的に敵を一掃",
    "爆発範囲外から安全に囲い込み",
    "他の敵をボマーの近くに誘導して巻き込む",
  ],
};

const BOMBER_BEHAVIOR_CONFIG = {
  explosionRadius: 1,
  explosionEffectDuration: 120,
  chainBonusMultiplier: 1.5,
  maxChainDepth: 3, // 無限連鎖防止
  explosionWarningDuration: 60, // 爆発予告時間
};
```

### 爆発エフェクト

- 120 フレーム継続の大型爆発エフェクト
- **爆発予告**: 撃破 1 秒前に視覚的警告を表示
- 連鎖時は追加ボーナス点 (1.5 倍)
- **エラーハンドリング**: 連鎖深度制限による無限ループ防止

### プレイヤー学習要素

- **連鎖計画**: 複数の敵を効率的に処理する戦略
- **リスク評価**: 爆発による利益と危険の天秤
- **位置戦略**: 爆発範囲を考慮した立ち回り

---

## 8. ウォールクリーパータイプ敵 (Wall Creeper Enemy)

### ゲームデザイン目的

**学習目標**: 空間の有効活用と予測移動
**プレイヤー体験**: 「壁際の脅威」新しい空間認識

### 基本情報

- **表示文字**: `W`
- **色**: `light_black` (壁に同化)
- **基本点数**: 160 点 (調整: 予測可能性を考慮)
- **移動速度**: 通常と同じ (12 フレーム間隔)
- **脅威度**: MEDIUM (空間認識要求)

### 型定義

```typescript
interface WallCreeperEnemy extends BaseEnemy {
  type: EnemyType.WALL_CREEPER;
  wallFollowDirection: "clockwise" | "counterclockwise";
  stuckCounter: number; // 行き詰まり検出用
  lastWallPosition: Position | null; // 最後の壁位置
  wallSearchRadius: number; // 壁検索範囲
  cornerPauseTimer: number; // 角での一時停止
}

const WALL_CREEPER_CONFIG: EnemyConfig = {
  displayChar: "W",
  color: "light_black",
  baseScore: 160,
  moveInterval: 12,
  spawnWeight: 10,
  maxCount: 3,
  threatLevel: ThreatLevel.MEDIUM,
  learningObjective: "空間の有効活用と予測移動を学ぶ",
  counterStrategies: [
    "ウォールクリーパーの移動パターンを予測",
    "角での一時停止を利用して囲い込み",
    "壁から離れた位置で安全に対処",
    "複数のクリーパーの動きを同時に管理",
  ],
};

const WALL_CREEPER_BEHAVIOR_CONFIG = {
  maxStuckFrames: 3,
  wallSearchRadius: 5,
  returnToWallTimeout: 60,
  preferredWallDistance: 1,
  cornerPauseDuration: 15, // 角での一時停止時間
};
```

### 特殊ルール

- 壁から離れると最短経路で壁に戻ろうとする
- 角に到達すると短時間停止（プレイヤーに予測機会を提供）
- **エラーハンドリング**: 壁が見つからない場合の通常移動へのフォールバック

### プレイヤー学習要素

- **パターン予測**: 規則的な動きの先読み
- **空間活用**: 壁際エリアの戦略的利用
- **タイミング**: 角での停止を利用した攻撃機会

---

## 9. ゴーストタイプ敵 (Ghost Enemy)

### ゲームデザイン目的

**学習目標**: 不確実性への対応と適応的戦略
**プレイヤー体験**: 「予測不可能な脅威」緊張感の維持

### 基本情報

- **表示文字**: `?` (不定形を示す)
- **色**: 通常時 `light_blue`、無形化時 `light_black`
- **基本点数**: 350 点 (調整: 最高難易度を反映)
- **移動速度**: 通常と同じ (12 フレーム間隔)
- **脅威度**: EXTREME (最高難易度)

### 型定義

```typescript
interface GhostEnemy extends BaseEnemy {
  type: EnemyType.GHOST;
  isPhasing: boolean; // 無形化状態
  phaseTimer: number; // 無形化残り時間
  phaseChance: number; // 無形化確率
  phaseCooldown: number; // 無形化クールダウン
  explosionResistance: number; // 爆発耐性
  phaseWarningTimer: number; // 無形化予告タイマー
}

const GHOST_CONFIG: EnemyConfig = {
  displayChar: "?",
  color: "light_blue",
  baseScore: 350,
  moveInterval: 12,
  spawnWeight: 8,
  maxCount: 2,
  threatLevel: ThreatLevel.EXTREME,
  learningObjective: "不確実性に対応し、適応的戦略を身につける",
  counterStrategies: [
    "無形化のタイミングを観察してパターンを見つける",
    "無形化中は他の敵に集中する",
    "ゴーストを最後に残して確実に対処",
    "無形化終了のタイミングを狙って囲い込み",
  ],
};

const GHOST_BEHAVIOR_CONFIG = {
  phaseChance: 0.2,
  phaseDuration: 30,
  phaseCooldown: 60,
  explosionResistance: 0.5,
  phaseColor: "light_black",
  overlapResolutionAttempts: 5,
  phaseWarningDuration: 15, // 無形化予告時間
};
```

### 特殊ルール

- 無形化中は爆発による破壊を 50%の確率で回避
- 壁は常に通り抜け不可
- **無形化予告**: 無形化 0.5 秒前に視覚的警告
- 無形化終了時に他のオブジェクトと重複している場合は強制移動
- **エラーハンドリング**: 重複解決失敗時の安全な位置への移動

### プレイヤー学習要素

- **不確実性管理**: 予測困難な状況への対応
- **優先順位判断**: 複数の脅威の中での重要度判断
- **適応的戦略**: 状況に応じた戦術変更

---

## 10. スワームタイプ敵 (Swarm Enemy)

### ゲームデザイン目的

**学習目標**: 集団戦術と大局的判断
**プレイヤー体験**: 「数の脅威」圧倒的な存在感

### 基本情報

- **表示文字**: `s` (群れを示す小文字)
- **色**: 単独時 `green`、群れ時 `light_green`
- **基本点数**: 40 点 (群れボーナス: +20 点/仲間)
- **移動速度**: 単独時 16 フレーム、群れ時 8 フレーム間隔
- **脅威度**: HIGH (集団管理要求)

### 型定義

```typescript
interface SwarmEnemy extends BaseEnemy {
  type: EnemyType.SWARM;
  swarmSize: number; // 周辺の仲間数
  isLeader: boolean; // 群れのリーダーかどうか
  leaderPosition: Position | null; // リーダーの位置
  formationOffset: Position; // 編隊内の相対位置
  swarmId: string; // 群れID
  leadershipScore: number; // リーダーシップスコア
  cohesionStrength: number; // 結束力
}

const SWARM_CONFIG: EnemyConfig = {
  displayChar: "s",
  color: "green",
  baseScore: 40,
  moveInterval: 16,
  spawnWeight: 20,
  maxCount: 8,
  threatLevel: ThreatLevel.HIGH,
  learningObjective: "集団戦術と大局的判断を身につける",
  counterStrategies: [
    "リーダーを優先的に撃破して群れを分散",
    "群れを分割して個別に対処",
    "群れ全体を一度に囲い込む大規模作戦",
    "群れの移動パターンを利用した誘導戦術",
  ],
};

const SWARM_BEHAVIOR_CONFIG = {
  swarmDetectionRadius: 2,
  swarmSpeedBonus: 0.5, // 群れ時の速度ボーナス
  leadershipThreshold: 2, // リーダーになる最小仲間数
  formationTightness: 1.5,
  swarmColor: "light_green",
  maxSwarmSize: 6,
  swarmBonusPerMember: 20,
};
```

### 群れメカニクス

- 最も多くの仲間に囲まれた個体が自動的にリーダーになる
- リーダーが破壊されると新しいリーダーを選出
- 孤立した個体は最寄りの群れに合流を試みる
- **群れボーナス**: 同時撃破時に追加得点
- **エラーハンドリング**: リーダー選出失敗時の分散処理

### プレイヤー学習要素

- **集団管理**: 複数の敵を同時に相手にする戦術
- **優先順位**: どの敵から先に対処するかの判断
- **大局観**: 全体の状況を把握した戦略立案

---

## プレイヤーフィードバックシステム

### 視覚的フィードバック

```typescript
interface VisualFeedback {
  enemyWarningSystem: boolean; // 敵出現予告
  threatLevelIndicator: boolean; // 脅威度表示
  strategyHints: boolean; // 戦略ヒント
  performanceMetrics: boolean; // パフォーマンス表示
}

interface AudioFeedback {
  enemySpawnSounds: Record<EnemyType, string>;
  warningAlerts: Record<ThreatLevel, string>;
  achievementSounds: string[];
}
```

### 学習支援機能

```typescript
interface LearningSupport {
  enemyBehaviorAnalysis: boolean; // 敵行動分析
  playerActionReplay: boolean; // プレイヤー行動再生
  strategyRecommendation: boolean; // 戦略推奨
  skillProgressTracking: boolean; // スキル進捗追跡
}
```

---

## エラーハンドリング戦略

### 共通エラーハンドリング

```typescript
class EnemyErrorHandler {
  private static readonly MAX_RECOVERY_ATTEMPTS = 3;
  private static readonly ERROR_LOG_LIMIT = 100;

  public static handleSpawnFailure(
    type: EnemyType,
    position: Position,
    attempt: number
  ): Position | null {
    if (attempt >= this.MAX_RECOVERY_ATTEMPTS) {
      console.warn(`Failed to spawn ${type} after ${attempt} attempts`);
      return null;
    }

    // 代替位置を探索
    const alternativePosition = this.findAlternativeSpawnPosition(position);
    if (alternativePosition) {
      return alternativePosition;
    }

    // 完全にランダムな位置を試行
    return this.findRandomValidPosition();
  }

  public static handleMovementFailure(enemy: Enemy): Direction | null {
    // 全方向を試行
    const directions = [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ];

    for (const direction of directions) {
      if (this.isValidMove(enemy, direction)) {
        return direction;
      }
    }

    // 移動不可能な場合
    console.warn(
      `Enemy ${enemy.id} is completely stuck at (${enemy.x}, ${enemy.y})`
    );
    return null;
  }

  public static handleAIFailure(enemy: Enemy, error: Error): Enemy {
    console.error(`AI failure for enemy ${enemy.id}:`, error);

    // セーフモードに切り替え
    return {
      ...enemy,
      // 基本的なランダム移動に戻す
      specialTimer: 0,
      // エラー状態をマーク
      metadata: {
        ...enemy.metadata,
        errorMode: true,
        lastError: error.message,
      },
    };
  }
}
```

---

## 品質保証

### テスト戦略

1. **単体テスト**: 各敵タイプの個別機能
2. **統合テスト**: 敵同士の相互作用
3. **パフォーマンステスト**: 大量敵出現時の動作
4. **バランステスト**: ゲームプレイの難易度調整
5. **ユーザビリティテスト**: プレイヤー体験の評価

### 継続的改善

- プレイテストによるフィードバック収集
- メトリクス分析による最適化
- プレイヤー行動データの分析
- バランス調整の継続的実施

この改善版仕様書により、プレイヤーエクスペリエンスを重視した、学習曲線が最適化された敵システムの実装が可能になります。
