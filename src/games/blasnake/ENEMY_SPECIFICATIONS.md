# Blasnake 敵仕様書

## 概要

Blasnake ゲームの 10 種類の敵タイプの詳細仕様。

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
  | MimicEnemy
  | SnakeEnemy // 変更: BomberEnemy → SnakeEnemy
  | WallCreeperEnemy
  | GhostEnemy
  | SwarmEnemy;

enum EnemyType {
  WANDERER = "wanderer",
  GUARD = "guard",
  CHASER = "chaser",
  SPLITTER = "splitter",
  SPEEDSTER = "speedster",
  MIMIC = "mimic",
  SNAKE = "snake", // 変更: BOMBER → SNAKE
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

- **表示文字**: `W` (通常時), `o` (点滅時)
- **色**: `red` (通常時), `light_red` (点滅時)
- **基本点数**: 100 点 (囲み爆発時)
- **移動速度**: 96 フレーム間隔
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
- **移動間隔**: 96 フレームごとに移動
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
- **得点**: 破壊された敵 1 体につき 基本点、複数の敵を巻き込むと倍率
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
  moveInterval: 96,
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
- **色**: `yellow` (通常時), `light_red` (警戒時)
- **基本点数**: 120 点 (調整: リスクに見合った報酬)
- **移動速度**: 通常の 1.5 倍遅い (144 フレーム間隔)
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
  alertColor: "light_red",
  baseScore: 120,
  moveInterval: 144,
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
  patrolRadius: 2, // 巡回半径（より密接な守護）
  maxDistanceFromFood: 3, // 最大距離（より厳格な守護）
  returnTimeout: 120, // 2秒（より早く反応）
  searchRadius: 8, // 食べ物検索範囲
  alertRadius: 3, // プレイヤー警戒範囲
  rushSpeedMultiplier: 6.0, // 食べ物に戻る時の速度倍率
};
```

### 行動仕様

- **出現**: 食べ物から半径 2-4 マス以内にランダム出現
- **移動パターン**: 食べ物を中心とした半径 2 マス以内を巡回
- **特殊能力**: 食べ物から 3 マス以上離れると 6 倍速で食べ物に向かって移動
- **プレイヤー反応**: プレイヤーが 3 マス以内に接近すると警戒状態になり色が `light_red` に変化
- **警戒システム**: 警戒レベルに応じて表示色が変化（視覚的フィードバック）
- **巡回速度**: 通常の巡回角度更新が 0.15 ラジアン/フレーム（より速い巡回）
- **エラーハンドリング**: 守る食べ物が消失した場合は新しい食べ物を探索

### プレイヤー学習要素

- **初回遭遇**: 「なぜこの敵は特定の場所にいるのか？」
- **理解段階**: 「食べ物を守っている」
- **戦略発展**: 「どうやって効率的に対処するか」
- **視覚的学習**: 警戒時の色変化（黄色 → 赤色）でプレイヤーとの距離関係を理解
- **行動パターン認識**: 巡回 → 警戒 → 急速帰還の行動サイクルを観察
- **タイミング戦術**: ガードが食べ物から離れた瞬間を狙う戦術の習得

---

## 3. チェイサータイプ敵 (Chaser Enemy)

### ゲームデザイン目的

**学習目標**: 逃走戦術と空間認識の向上
**プレイヤー体験**: 「追跡からの脱出」スリル

### 基本情報

- **表示文字**: `C`
- **色**: `light_cyan` (追跡を示す)
- **基本点数**: 220 点 (調整: 逃走の困難さを反映)
- **移動速度**: 通常より少し速い (10 フレーム間隔)
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
  stunDuration: 60,
  pathfindingInterval: 12,
  maxStuckFrames: 36,
  chaseRange: 15, // 追跡開始距離
  intensityDecayRate: 0.95, // 追跡強度減衰率
};
```

### 行動仕様

- **追跡対象**: スネークの頭部
- **移動パターン**: 最短距離でプレイヤーに向かって移動
- **特殊能力**: 壁や障害物にぶつかると一時的に動かなくなる (60 フレーム)
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
- **色**: `purple` (分裂を示す)
- **基本点数**: 80 点 (分裂後の子敵は 40 点ずつ)
- **移動速度**: 中程度 (48 フレーム間隔)
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
  color: "purple",
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
- **基本点数**: 300 点 (調整: 捕捉困難性を反映)
- **移動速度**: 通常の 2 倍速 (6 フレーム間隔)
- **脅威度**: HIGH (反応速度要求)

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
- **基本点数**: 130 点 (調整: 予測困難性を反映)
- **移動速度**: プレイヤーと同じ (8 フレーム間隔)
- **脅威度**: MEDIUM (高度な戦略要求)

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

## 7. スネークタイプ敵 (Snake Enemy)

### ゲームデザイン目的

**学習目標**: 複雑な移動パターンの理解と空間制御
**プレイヤー体験**: 「もう一匹のスネーク」との領域争い

### 基本情報

- **表示文字**: `S` (頭部), `s` (胴体)
- **色**: `yellow` (頭部), `light_yellow` (胴体)
- **基本点数**: 330 点 (頭部のみで判定、全体破壊)
- **移動速度**: プレイヤーより少し遅い (10 フレーム間隔)
- **脅威度**: HIGH (複雑な空間制御要求)

### 型定義

```typescript
interface SnakeEnemy extends BaseEnemy {
  type: EnemyType.SNAKE;
  body: Position[]; // 胴体セグメント配列 (頭部は[0])
  maxLength: number; // 最大長さ
  currentLength: number; // 現在の長さ
  growthRate: number; // 成長率 (フレーム/セグメント)
  lastGrowthTime: number; // 最後の成長時刻
  movementPattern: "patrol" | "chase" | "territorial"; // 移動パターン
  territoryCenter: Position; // 縄張りの中心
  territoryRadius: number; // 縄張りの半径
  pathHistory: Position[]; // 移動履歴
  selfCollisionCheck: boolean; // 自己衝突チェック
}

const SNAKE_CONFIG: EnemyConfig = {
  displayChar: "S", // 頭部
  bodyChar: "s", // 胴体
  color: "yellow",
  bodyColor: "light_yellow",
  baseScore: 330, // 全体スコア（頭部のみで判定）
  bodyScore: 0, // 胴体セグメントスコア（使用しない）
  moveInterval: 10,
  spawnWeight: 8,
  maxCount: 2,
  threatLevel: ThreatLevel.HIGH,
  learningObjective: "複雑な移動パターンを理解し、空間制御を習得する",
  counterStrategies: [
    "スネーク敵の頭部を狙って撃破する",
    "スネーク敵を自分の尻尾に衝突させる",
    "スネーク敵の移動パターンを読んで先回りする",
    "スネーク敵の縄張りを避けて安全な領域を確保する",
  ],
};

const SNAKE_BEHAVIOR_CONFIG = {
  initialLength: 3, // 初期長さ（頭部 + 胴体2つ）
  maxLength: 3, // 最大長さ（固定）
  growthInterval: 0, // 成長しない
  territoryRadius: 6, // 縄張り半径
  pathHistoryLength: 20, // 移動履歴保持数
  selfCollisionEnabled: true, // 自己衝突有効
  chaseActivationDistance: 8, // 追跡開始距離
  territorialReturnDistance: 10, // 縄張り復帰距離
  directionChangeChance: 0.2, // 方向転換確率
};
```

### 行動仕様

- **初期状態**: 3 セグメントの長さで出現（頭部 + 胴体 2 つ）
- **成長メカニクス**: 成長しない（胴体は 2 つで固定）
- **移動パターン**:
  - **巡回モード**: 縄張り内をランダムに移動
  - **追跡モード**: プレイヤーが 8 マス以内に接近すると追跡開始
  - **縄張りモード**: 縄張りから 10 マス以上離れると強制帰還
- **自己衝突**: 自分の胴体に衝突すると破壊される
- **プレイヤー衝突**: プレイヤーのスネークと衝突すると両方破壊

### 特殊ルール

- **頭部撃破**: 頭部のみ囲み爆発で破壊可能
- **全体破壊**: 頭部破壊時に全胴体セグメントも同時破壊、330 点獲得
- **空間占有**: 胴体セグメントは通行不可の障害物として機能
- **成長制限**: 最大長さに達すると成長停止
- **縄張り意識**: 他のスネーク敵との縄張り争いを避ける

### プレイヤー学習要素

- **複雑パターン認識**: 長い胴体を持つ敵の動きパターン理解
- **空間制御**: 限られた空間での効率的な移動
- **戦略的思考**: 頭部を狙う精密な囲み戦術
- **リスク管理**: 長い敵との衝突リスクの評価

---

## 8. ウォールクリーパータイプ敵 (Wall Creeper Enemy)

### ゲームデザイン目的

**学習目標**: 空間の有効活用と予測移動
**プレイヤー体験**: 「壁際の脅威」新しい空間認識

### 基本情報

- **表示文字**: `W`
- **色**: `light_black` (壁に同化)
- **基本点数**: 150 点 (調整: 予測可能性を考慮)
- **移動速度**: 通常と同じ (12 フレーム間隔)
- **脅威度**: MEDIUM (空間認識要求)

### 型定義

```typescript
interface WallCreeperEnemy extends BaseEnemy {
  type: EnemyType.WALL_CREEPER;
  currentBehaviorState: "in_wall" | "crossing_open_space"; // 現在の行動状態
  wallFollowCardinalDirection: Direction; // 壁沿い移動時の現在の方角
  targetCrossPosition: Position | null; // オープンスペース横断時の目標座標
  behaviorTimer: number; // 現在の行動状態のタイマー (壁内滞在時間、横断時間など)
  exitWallDecisionTimer: number; // 壁から離脱するタイミングを決定するタイマー
}

const WALL_CREEPER_CONFIG: EnemyConfig = {
  displayChar: "W",
  color: "light_black",
  baseScore: 160,
  moveInterval: 12, // 移動速度 (フレーム間隔)
  spawnWeight: 10,
  maxCount: 3,
  threatLevel: ThreatLevel.MEDIUM,
  learningObjective:
    "壁を利用した特異な移動パターンを理解し、予測対処能力を養う",
  counterStrategies: [
    "壁内移動のパターンと角での停止を予測する",
    "壁から出てオープンスペースを横断する瞬間を狙って攻撃する",
    "反対側の壁への進入地点を予測して待ち構える",
    "壁際から離れた安全な位置で対処する",
  ],
};

const WALL_CREEPER_BEHAVIOR_CONFIG = {
  minTimeInWall: 120, // 壁内を移動する最小フレーム数 (約2秒)
  maxTimeInWall: 300, // 壁内を移動する最大フレーム数 (約5秒)
  crossingSpeedMultiplier: 1.0, // オープンスペース横断時の速度倍率 (基本移動速度に対する)
  // wallSearchRadius and other previous irrelevant fields removed
};
```

### 特殊ルール

- **出現**: 壁セル（画面端のセル）のランダムな位置に出現します。
- **壁内移動**:
  - 出現後、壁に沿って一定方向に移動を開始します（例: 時計回りまたは反時計回りのように見えるが、実際には上下左右の基本方向で壁面を辿る）。
  - 壁の角に到達すると、壁に沿って進行方向を変えて移動を継続します。
- **壁横断行動**:
  - 壁内を `minTimeInWall` から `maxTimeInWall` の間でランダムに決定された時間移動した後、壁から離脱する判断を行います。
  - 現在位置から見て、フィールドの反対側の壁にある対応する座標（例: 左の壁 `x=0, y=Y` にいれば、右の壁 `x=WIDTH-1, y=Y`）を目標地点 `targetCrossPosition` とします。
  - `currentBehaviorState` を `"crossing_open_space"` に変更し、目標地点に向かってフィールド中央を直線的に横断します。移動速度は基本移動速度に `crossingSpeedMultiplier` を乗じたものになります。
- **壁への再進入**:
  - 目標地点の壁セルに到達すると、`currentBehaviorState` を `"in_wall"` に戻します。
  - 新しい壁面で再び壁内移動を開始し、必要に応じて進行方向を決定します。
- **繰り返し**: 上記の「壁内移動 → 壁横断行動 → 壁への再進入」のサイクルを繰り返します。
- **衝突特性**:
  - 壁内移動中 (`"in_wall"` 状態) は、ウォールクリーパー自体が壁の一部のように振る舞い、そのセルはプレイヤーにとって通行不可能な障害物となります。ウォールクリーパーの文字 `W` が壁の文字の代わりに表示されます。
  - オープンスペース横断中 (`"crossing_open_space"` 状態) は、他の敵と同様に扱われ、通常の衝突判定が適用されます。
- **破壊条件**: 囲み爆発によってのみ破壊可能です。

### プレイヤー学習要素

- **パターン予測**: 壁沿いの規則的な動き、角での停止、そして壁から離脱して反対側へ渡るタイミングの予測。
- **空間活用**: ウォールクリーパーが壁内を移動している間、その壁が一時的に異なる性質を持つことを理解し、戦略に活かす。
- **タイミング**: オープンスペースを横断している無防備な瞬間を捉える攻撃タイミングの習得。
- **危険エリア認識**: ウォールクリーパーが潜む壁際や、横断ルートとなりうる直線上の危険認識。

---

## 9. ゴーストタイプ敵 (Ghost Enemy)

### ゲームデザイン目的

**学習目標**: 不確実性への対応と適応的戦略
**プレイヤー体験**: 「予測不可能な脅威」緊張感の維持

### 基本情報

- **表示文字**: `?` (不定形を示す)
- **色**: 通常時 `blue`、無形化時 `light_black`
- **基本点数**: 270 点
- **移動速度**: 通常と同じ (12 フレーム間隔)
- **脅威度**: HIGH

### 型定義

```typescript
interface GhostEnemy extends BaseEnemy {
  type: EnemyType.GHOST;
  isPhasing: boolean; // 無形化状態
  phaseTimer: number; // 無形化残り時間
  phaseChance: number; // 無形化確率
  phaseCooldown: number; // 無形化クールダウン
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
  phaseColor: "light_black",
  overlapResolutionAttempts: 5,
  phaseWarningDuration: 15, // 無形化予告時間
};
```

### 特殊ルール

- 無形化時は胴体をすり抜ける
- 壁は常に通り抜け不可
- **無形化予告**: 無形化 0.5 秒前に視覚的警告
- 無形化終了時に他のオブジェクトと重複している場合は強制移動
- **エラーハンドリング**: 重複解決失敗時の安全な位置への移動

### プレイヤー学習要素

- **不確実性管理**: 予測困難な状況への対応
- **優先順位判断**: 複数の脅威の中での重要度判断
- **適応的戦略**: 状況に応じた戦術変更

---

## 10. スワームタイプ敵 (Swarm Enemy) - 詳細仕様

### ゲームデザイン目的

**学習目標**: 集団戦術と大局的判断、優先順位付けの習得
**プレイヤー体験**: 「数の脅威」圧倒的な存在感と戦略的思考の要求

### 基本情報

- **表示文字**: リーダー`S`、仲間`s`
- **色**: リーダー`green`、仲間`light_green`
- **基本点数**: リーダー 360 点、仲間は破壊不能
- **移動速度**: リーダー 48 フレーム間隔、仲間 16 フレーム間隔
- **脅威度**: HIGH (集団管理要求)

### 型定義

```typescript
interface SwarmEnemy extends BaseEnemy {
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

const SWARM_CONFIG: EnemyConfig = {
  displayChar: "S", // リーダー
  followerChar: "s", // 仲間
  color: "green", // リーダー
  followerColor: "light_green", // 仲間
  baseScore: 150, // リーダーのみ
  followerScore: 0, // 仲間は個別スコアなし
  groupDestroyBonus: 200, // 群れ全体破壊ボーナス
  moveInterval: 48, // リーダー
  followerMoveInterval: 24, // 仲間（より速い）
  spawnWeight: 12,
  maxCount: 2, // 最大2つの群れ
  maxSwarmSize: 4, // 1つの群れの最大サイズ（リーダー含む）
  threatLevel: ThreatLevel.HIGH,
  learningObjective: "集団戦術と大局的判断、優先順位付けを身につける",
  counterStrategies: [
    "リーダーを優先的に撃破して群れを無力化",
    "群れを分散させて個別に対処",
    "群れ全体を一度に囲い込んで高得点を狙う",
    "仲間を先に撃破してリーダーを孤立させる",
  ],
};

const SWARM_BEHAVIOR_CONFIG = {
  // 編隊設定
  formationTypes: ["diamond", "line", "circle", "v_formation"],
  defaultFormation: "diamond",
  formationTightness: 1.5, // 編隊の密集度

  // 追従設定
  maxDistanceFromLeader: 4, // リーダーからの最大距離
  followDelay: 8, // 追従遅延フレーム数
  cohesionStrength: 0.8, // 結束力

  // 分離・再結合設定
  separationThreshold: 6, // 分離判定距離
  separationTimeout: 180, // 3秒で分離状態
  reunionRange: 8, // 再結合範囲
  reunionTimeout: 300, // 5秒で再結合試行

  // 移動設定
  leaderMoveInterval: 48,
  followerMoveInterval: 24,
  leaderDirectionChangeChance: 0.15,
  followerCatchupSpeedMultiplier: 1.5, // 遅れた時の追いつき速度

  // スポーン設定
  spawnFormationRadius: 2, // スポーン時の編隊半径
  initialCohesionStrength: 1.0,
};
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

---

# レベルデザイン・スポーンシステム仕様（簡易版）

## 概要

Blasnake の敵スポーンシステムは、シンプルな段階的進行を基本とします：

1. **新敵導入** → 2. **混合戦闘** → 3. **次の新敵導入** のサイクル

## 基本設計理念

### シンプルな学習曲線

- 一度に 1 つの新しい敵タイプを導入
- 慣れたら 2-3 種類の混合戦闘
- 段階的に複雑さを増加

### 実装の簡潔性

- 複雑な条件分岐を避ける
- 時間ベースの単純な進行
- 予測可能な敵出現パターン

## 型定義システム

### 簡易スポーンシステム

```typescript
// シンプルなレベル定義
interface SimpleLevel {
  id: number;
  name: string;
  timeThreshold: number; // ゲーム開始時
  duration: number; // レベル持続時間（フレーム数）
  enemyTypes: EnemyType[]; // 出現する敵タイプ
  spawnPattern: SimpleSpawnPattern;
}

interface SimpleSpawnPattern {
  enemyType: EnemyType;
  count: number; // 同時出現数
  interval: number; // スポーン間隔（フレーム数）
  maxTotal: number; // 最大総数
}

// レベル進行管理
interface SimpleLevelManager {
  currentLevel: number;
  levels: SimpleLevel[];
  nextLevelScore: number;
}
```

## レベル進行システム

### レベル 1-20 の定義（全敵タイプ導入）

```typescript
const SIMPLE_LEVELS: SimpleLevel[] = [
  // レベル1: ワンダラー導入（簡単）
  {
    id: 1,
    name: "基本訓練",
    timeThreshold: 0, // ゲーム開始時
    duration: 20, // 20秒
    enemyTypes: [EnemyType.WANDERER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 3,
      interval: 600, // 10秒間隔
      maxTotal: 6, // 6匹に増加
    },
  },

  // レベル2: ガード導入（簡単）
  {
    id: 2,
    name: "守護者登場",
    timeThreshold: 20,
    duration: 20,
    enemyTypes: [EnemyType.GUARD],
    spawnPattern: {
      enemyType: EnemyType.GUARD,
      count: 1,
      interval: 900, // 15秒間隔
      maxTotal: 3, // 3匹に増加
    },
  },

  // レベル3: ワンダラー + ガード混合（標準的難易度に近づく）
  {
    id: 3,
    name: "混合戦闘I",
    timeThreshold: 40,
    duration: 20,
    enemyTypes: [EnemyType.WANDERER, EnemyType.GUARD],
    spawnPattern: {
      enemyType: EnemyType.WANDERER, // メイン
      count: 2,
      interval: 480, // 8秒間隔
      maxTotal: 7, // 7匹に増加（ワンダラー中心）
    },
  },

  // レベル4: チェイサー導入（標準的難易度）
  {
    id: 4,
    name: "追跡者登場",
    timeThreshold: 60,
    duration: 20,
    enemyTypes: [EnemyType.CHASER],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 1,
      interval: 720, // 12秒間隔
      maxTotal: 2, // 2匹に減少（強力な敵）
    },
  },

  // レベル5: ワンダラー + チェイサー混合（標準的難易度）
  {
    id: 5,
    name: "混合戦闘II",
    timeThreshold: 80,
    duration: 20,
    enemyTypes: [EnemyType.WANDERER, EnemyType.CHASER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 2,
      interval: 420, // 7秒間隔
      maxTotal: 8, // 8匹に増加
    },
  },

  // レベル6: スプリッター導入（標準的難易度）
  {
    id: 6,
    name: "分裂者登場",
    timeThreshold: 100,
    duration: 20,
    enemyTypes: [EnemyType.SPLITTER],
    spawnPattern: {
      enemyType: EnemyType.SPLITTER,
      count: 1,
      interval: 900, // 15秒間隔
      maxTotal: 3, // 3匹に増加
    },
  },

  // レベル7: 3種混合戦闘（標準的難易度を超える）
  {
    id: 7,
    name: "混合戦闘III",
    timeThreshold: 120,
    duration: 20,
    enemyTypes: [EnemyType.WANDERER, EnemyType.CHASER, EnemyType.SPLITTER],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 1,
      interval: 360, // 6秒間隔
      maxTotal: 10, // 10匹（標準的難易度）
    },
  },

  // レベル8: スピードスター導入（難易度上昇）
  {
    id: 8,
    name: "高速戦闘",
    timeThreshold: 140,
    duration: 20,
    enemyTypes: [EnemyType.SPEEDSTER],
    spawnPattern: {
      enemyType: EnemyType.SPEEDSTER,
      count: 1,
      interval: 1080, // 18秒間隔
      maxTotal: 2, // 2匹に減少（強力な敵）
    },
  },

  // レベル9: ミミック導入（難易度上昇）
  {
    id: 9,
    name: "模倣者登場",
    timeThreshold: 160,
    duration: 20,
    enemyTypes: [EnemyType.MIMIC],
    spawnPattern: {
      enemyType: EnemyType.MIMIC,
      count: 1,
      interval: 1200, // 20秒間隔
      maxTotal: 2, // 2匹に増加
    },
  },

  // レベル10: スネーク導入（難易度上昇）
  {
    id: 10,
    name: "スネーク登場",
    timeThreshold: 180,
    duration: 20,
    enemyTypes: [EnemyType.SNAKE],
    spawnPattern: {
      enemyType: EnemyType.SNAKE,
      count: 1,
      interval: 1500, // 25秒間隔
      maxTotal: 2, // 2匹に減少（強力な敵）
    },
  },

  // レベル11: ウォールクリーパー導入（難易度上昇）
  {
    id: 11,
    name: "壁這い登場",
    timeThreshold: 200,
    duration: 20,
    enemyTypes: [EnemyType.WALL_CREEPER],
    spawnPattern: {
      enemyType: EnemyType.WALL_CREEPER,
      count: 1,
      interval: 900, // 15秒間隔
      maxTotal: 4, // 4匹に増加
    },
  },

  // レベル12: ゴースト導入（難易度上昇）
  {
    id: 12,
    name: "幽霊登場",
    timeThreshold: 220,
    duration: 20,
    enemyTypes: [EnemyType.GHOST],
    spawnPattern: {
      enemyType: EnemyType.GHOST,
      count: 1,
      interval: 1800, // 30秒間隔
      maxTotal: 3, // 3匹に増加
    },
  },

  // レベル13: スワーム導入（難易度上昇）
  {
    id: 13,
    name: "群れ登場",
    timeThreshold: 240,
    duration: 20,
    enemyTypes: [EnemyType.SWARM],
    spawnPattern: {
      enemyType: EnemyType.SWARM,
      count: 4, // リーダー1 + 仲間3
      interval: 1200, // 20秒間隔
      maxTotal: 4, // 4匹に減少（強力な敵、1グループのみ）
    },
  },

  // レベル14-19: 高難易度混合戦闘
  {
    id: 14,
    name: "混合戦闘IV",
    timeThreshold: 260,
    duration: 20,
    enemyTypes: [EnemyType.CHASER, EnemyType.SPLITTER, EnemyType.SPEEDSTER],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 1,
      interval: 300, // 5秒間隔
      maxTotal: 10, // 10匹に減少（強力な敵が多いため）
    },
  },

  {
    id: 15,
    name: "混合戦闘V",
    timeThreshold: 280,
    duration: 20,
    enemyTypes: [EnemyType.MIMIC, EnemyType.SNAKE, EnemyType.WALL_CREEPER],
    spawnPattern: {
      enemyType: EnemyType.WALL_CREEPER,
      count: 1,
      interval: 360, // 6秒間隔
      maxTotal: 11, // 11匹に減少（スネークが強力なため）
    },
  },

  {
    id: 16,
    name: "混合戦闘VI",
    timeThreshold: 300,
    duration: 20,
    enemyTypes: [EnemyType.GHOST, EnemyType.SWARM, EnemyType.SPEEDSTER],
    spawnPattern: {
      enemyType: EnemyType.SPEEDSTER,
      count: 1,
      interval: 300, // 5秒間隔
      maxTotal: 10, // 10匹に減少（スピードスター・スワームが強力なため）
    },
  },

  {
    id: 17,
    name: "混合戦闘VII",
    timeThreshold: 320,
    duration: 20,
    enemyTypes: [
      EnemyType.WANDERER,
      EnemyType.CHASER,
      EnemyType.SPLITTER,
      EnemyType.MIMIC,
    ],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 1,
      interval: 240, // 4秒間隔
      maxTotal: 12, // 12匹に減少（チェイサーが強力なため）
    },
  },

  {
    id: 18,
    name: "混合戦闘VIII",
    timeThreshold: 340,
    duration: 20,
    enemyTypes: [
      EnemyType.SNAKE,
      EnemyType.WALL_CREEPER,
      EnemyType.GHOST,
      EnemyType.SWARM,
    ],
    spawnPattern: {
      enemyType: EnemyType.WALL_CREEPER,
      count: 1,
      interval: 240, // 4秒間隔
      maxTotal: 11, // 11匹に減少（スネーク・スワームが強力なため）
    },
  },

  {
    id: 19,
    name: "最終試練",
    timeThreshold: 360,
    duration: 20,
    enemyTypes: [
      EnemyType.CHASER,
      EnemyType.SPEEDSTER,
      EnemyType.MIMIC,
      EnemyType.SNAKE,
      EnemyType.GHOST,
    ],
    spawnPattern: {
      enemyType: EnemyType.CHASER,
      count: 1,
      interval: 180, // 3秒間隔
      maxTotal: 12, // 12匹に減少（強力な敵ばかりのため）
    },
  },

  {
    id: 20,
    name: "全敵統合",
    timeThreshold: 380,
    duration: 20,
    enemyTypes: [
      EnemyType.WANDERER,
      EnemyType.GUARD,
      EnemyType.CHASER,
      EnemyType.SPLITTER,
      EnemyType.SPEEDSTER,
      EnemyType.MIMIC,
      EnemyType.SNAKE,
      EnemyType.WALL_CREEPER,
      EnemyType.GHOST,
      EnemyType.SWARM,
    ],
    spawnPattern: {
      enemyType: EnemyType.WANDERER,
      count: 1,
      interval: 180, // 3秒間隔
      maxTotal: 15, // 15匹に減少（強力な敵も含むため）
    },
  },
];
```

## 実装クラス

### 拡張レベルマネージャー（ハイブリッドスポーンシステム）

```typescript
class SimpleLevelManager {
  private currentLevel: number = 1;
  private levels: SimpleLevel[] = SIMPLE_LEVELS;
  private gameStartTime: number;
  private isEndlessMode: boolean = false;
  private endlessMultiplier: number = 1.0;
  private lastEndlessLevelTime: number = 0;
  private currentEndlessLevel: SimpleLevel | null = null;

  constructor() {
    this.gameStartTime = Date.now();
  }

  public getCurrentLevel(): SimpleLevel {
    if (this.isEndlessMode && this.currentEndlessLevel) {
      return this.currentEndlessLevel;
    }
    return this.levels[this.currentLevel - 1];
  }

  public update(): boolean {
    const gameTimeSeconds = this.getGameTimeSeconds();

    if (!this.isEndlessMode) {
      // 通常レベル進行
      return this.checkLevelUp(gameTimeSeconds);
    } else {
      // エンドレスモード
      return this.updateEndlessMode(gameTimeSeconds);
    }
  }

  private checkLevelUp(gameTimeSeconds: number): boolean {
    const nextLevel = this.levels[this.currentLevel];

    if (nextLevel && gameTimeSeconds >= nextLevel.timeThreshold) {
      this.currentLevel++;
      console.log(`Level Up! Now at level ${this.currentLevel}`);
      return true;
    }

    // 全レベル完了後、エンドレスモード開始
    if (this.currentLevel > this.levels.length && !this.isEndlessMode) {
      this.startEndlessMode();
      return true;
    }

    return false;
  }

  private startEndlessMode(): void {
    this.isEndlessMode = true;
    this.endlessMultiplier = 1.0;
    this.lastEndlessLevelTime = this.getGameTimeSeconds();
    this.selectRandomEndlessLevel();
    console.log("🔄 Endless Mode Started!");
  }

  private updateEndlessMode(gameTimeSeconds: number): boolean {
    // 20秒ごとに新しいランダムレベル（30秒から20秒に変更）
    if (gameTimeSeconds - this.lastEndlessLevelTime >= 20) {
      this.endlessMultiplier += 0.2; // 20%ずつ難易度上昇
      this.lastEndlessLevelTime = gameTimeSeconds;
      this.selectRandomEndlessLevel();
      console.log(
        `🔄 Endless Level Change! Multiplier: ${this.endlessMultiplier.toFixed(
          1
        )}`
      );
      return true;
    }
    return false;
  }

  private selectRandomEndlessLevel(): void {
    // レベル3以降からランダム選択（基本敵のみのレベルを避ける）
    const availableLevels = this.levels.slice(2); // レベル3以降
    const randomIndex = Math.floor(Math.random() * availableLevels.length);
    const baseLevel = availableLevels[randomIndex];

    // エンドレス用に調整されたレベル
    this.currentEndlessLevel = {
      ...baseLevel,
      id: 999, // エンドレス識別用
      name: `${baseLevel.name} (Endless x${this.endlessMultiplier.toFixed(1)})`,
      timeThreshold: 0,
      duration: 30,
      spawnPattern: {
        ...baseLevel.spawnPattern,
        count: Math.floor(
          baseLevel.spawnPattern.count * this.endlessMultiplier
        ),
        maxTotal: Math.floor(
          baseLevel.spawnPattern.maxTotal * this.endlessMultiplier
        ),
        interval: Math.max(
          Math.floor(baseLevel.spawnPattern.interval / this.endlessMultiplier),
          60 // 最小1秒間隔
        ),
      },
    };
  }

  // ハイブリッドスポーンロジック：最小数維持 + レベル設計 + 動的間隔調整
  public shouldSpawnEnemy(
    enemyType: EnemyType,
    currentCount: number,
    totalEnemyCount: number,
    framesSinceLastSpawn: number
  ): SpawnDecision {
    const level = this.getCurrentLevel();

    // 1. このレベルで出現しない敵タイプはスキップ
    if (!level.enemyTypes.includes(enemyType)) {
      return { shouldSpawn: false, reason: "not_in_level" };
    }

    // 2. 緊急スポーン判定（現在のロジックを採用）
    const minEnemyCount = Math.max(
      2,
      Math.floor(level.spawnPattern.maxTotal * 0.4)
    );
    const isEmergencySpawn = totalEnemyCount < minEnemyCount;

    if (isEmergencySpawn) {
      // 緊急時は動的間隔でスポーン（難易度に応じて調整）
      const emergencyInterval = this.calculateEmergencyInterval();
      if (framesSinceLastSpawn >= emergencyInterval) {
        return {
          shouldSpawn: true,
          reason: "emergency_spawn",
          isEmergency: true,
          interval: emergencyInterval,
        };
      }
    }

    // 3. 通常スポーン判定
    // 最大数チェック（敵タイプ別の上限）
    if (currentCount >= level.spawnPattern.maxTotal) {
      return { shouldSpawn: false, reason: "max_count_reached" };
    }

    // スポーン間隔チェック（敵タイプ別の間隔 + 難易度調整）
    const adjustedInterval = this.calculateNormalInterval(
      level.spawnPattern.interval
    );
    if (framesSinceLastSpawn < adjustedInterval) {
      return { shouldSpawn: false, reason: "interval_not_met" };
    }

    return {
      shouldSpawn: true,
      reason: "normal_spawn",
      isEmergency: false,
      interval: adjustedInterval,
    };
  }

  // 緊急スポーン間隔の動的計算
  private calculateEmergencyInterval(): number {
    const baseEmergencyInterval = 180; // 基本3秒間隔

    if (this.isEndlessMode) {
      // エンドレスモードでは難易度倍率に応じて短縮
      const adjustedInterval = Math.max(
        Math.floor(baseEmergencyInterval / this.endlessMultiplier),
        60 // 最小1秒間隔
      );
      return adjustedInterval;
    } else {
      // 通常レベルでは段階的に短縮
      const levelDifficultyMultiplier = this.getLevelDifficultyMultiplier();
      const adjustedInterval = Math.max(
        Math.floor(baseEmergencyInterval / levelDifficultyMultiplier),
        90 // 最小1.5秒間隔（通常レベルでは緩やか）
      );
      return adjustedInterval;
    }
  }

  // 通常スポーン間隔の動的計算
  private calculateNormalInterval(baseInterval: number): number {
    if (this.isEndlessMode) {
      // エンドレスモードでは難易度倍率に応じて短縮
      const adjustedInterval = Math.max(
        Math.floor(baseInterval / this.endlessMultiplier),
        120 // 最小2秒間隔
      );
      return adjustedInterval;
    } else {
      // 通常レベルでは段階的に短縮
      const levelDifficultyMultiplier = this.getLevelDifficultyMultiplier();
      const adjustedInterval = Math.max(
        Math.floor(baseInterval / levelDifficultyMultiplier),
        180 // 最小3秒間隔（通常レベルでは緩やか）
      );
      return adjustedInterval;
    }
  }

  // レベル難易度倍率の計算
  private getLevelDifficultyMultiplier(): number {
    // レベル1-5: 1.0倍（基本）
    // レベル6-10: 1.1倍
    // レベル11-15: 1.2倍
    // レベル16-20: 1.3倍
    if (this.currentLevel <= 5) {
      return 1.0;
    } else if (this.currentLevel <= 10) {
      return 1.1;
    } else if (this.currentLevel <= 15) {
      return 1.2;
    } else {
      return 1.3;
    }
  }

  public getGameTimeSeconds(): number {
    return (Date.now() - this.gameStartTime) / 1000;
  }

  public isInEndlessMode(): boolean {
    return this.isEndlessMode;
  }

  public getEndlessMultiplier(): number {
    return this.endlessMultiplier;
  }

  // デバッグ用：現在のレベル状態を取得
  public getDebugInfo(): any {
    const level = this.getCurrentLevel();
    return {
      currentLevel: this.currentLevel,
      isEndlessMode: this.isEndlessMode,
      endlessMultiplier: this.endlessMultiplier,
      levelDifficultyMultiplier: this.getLevelDifficultyMultiplier(),
      gameTimeSeconds: this.getGameTimeSeconds(),
      levelName: level.name,
      levelEnemyTypes: level.enemyTypes,
      spawnPattern: level.spawnPattern,
      emergencyInterval: this.calculateEmergencyInterval(),
      normalInterval: this.calculateNormalInterval(level.spawnPattern.interval),
    };
  }
}

// スポーン判定結果の型定義
interface SpawnDecision {
  shouldSpawn: boolean;
  reason: string;
  isEmergency?: boolean;
  interval?: number; // 使用された間隔（デバッグ用）
}
```

### core.ts への統合（ハイブリッドシステム）

```typescript
// core.ts への追加実装例
class CoreGameLogic extends BaseGame {
  private levelManager: SimpleLevelManager;
  private lastSpawnTimes: Map<EnemyType, number> = new Map();
  private spawnTimer: number = 0; // 全体スポーンタイマー

  constructor(options: BlasnakeGameOptions = {}) {
    super(options);
    this.levelManager = new SimpleLevelManager();
    // 各敵タイプの最終スポーン時刻を初期化
    Object.values(EnemyType).forEach((type) => {
      this.lastSpawnTimes.set(type, 0);
    });
  }

  private updateEnemySpawning(): void {
    // レベル更新チェック（時間ベース）
    if (this.levelManager.update()) {
      const currentLevel = this.levelManager.getCurrentLevel();
      console.log(`Current Level: ${currentLevel.name}`);

      if (this.levelManager.isInEndlessMode()) {
        console.log(
          `Endless Multiplier: ${this.levelManager.getEndlessMultiplier()}`
        );
      }
    }

    const currentLevel = this.levelManager.getCurrentLevel();
    const currentFrame = this.getGameTime();
    const totalEnemyCount = this.getTotalEnemyCount();

    // 各敵タイプのスポーンチェック
    for (const enemyType of currentLevel.enemyTypes) {
      const currentCount = this.getEnemyCount(enemyType);
      const lastSpawnTime = this.lastSpawnTimes.get(enemyType) || 0;
      const framesSinceLastSpawn = currentFrame - lastSpawnTime;

      const spawnDecision = this.levelManager.shouldSpawnEnemy(
        enemyType,
        currentCount,
        totalEnemyCount,
        framesSinceLastSpawn
      );

      if (spawnDecision.shouldSpawn) {
        this.spawnEnemyOfType(enemyType);
        this.lastSpawnTimes.set(enemyType, currentFrame);

        // デバッグログ
        if (spawnDecision.isEmergency) {
          console.log(
            `🚨 Emergency spawn: ${enemyType} (total: ${totalEnemyCount})`
          );
        } else {
          console.log(
            `✨ Normal spawn: ${enemyType} (${spawnDecision.reason})`
          );
        }
      }
    }
  }

  private getTotalEnemyCount(): number {
    return this.enemies.length; // または this.enemySystem.getTotalEnemyCount()
  }

  private getEnemyCount(enemyType: EnemyType): number {
    return this.enemies.filter((enemy) => enemy.type === enemyType).length;
  }

  private spawnEnemyOfType(enemyType: EnemyType): void {
    const position = this.findValidSpawnPosition();
    if (position) {
      const enemy = this.createEnemyOfType(enemyType, position);
      this.enemies.push(enemy);
    }
  }

  // UI表示用のレベル情報取得
  public getCurrentLevelInfo(): string {
    const level = this.levelManager.getCurrentLevel();
    if (this.levelManager.isInEndlessMode()) {
      return `${level.name} (${this.levelManager
        .getEndlessMultiplier()
        .toFixed(1)}x)`;
    }
    return `Level ${level.id}: ${level.name}`;
  }

  // デバッグ用：スポーンシステムの状態表示
  public getSpawnDebugInfo(): any {
    const levelInfo = this.levelManager.getDebugInfo();
    const enemyCounts: { [key: string]: number } = {};

    Object.values(EnemyType).forEach((type) => {
      enemyCounts[type] = this.getEnemyCount(type);
    });

    return {
      ...levelInfo,
      totalEnemies: this.getTotalEnemyCount(),
      enemyCounts,
      lastSpawnTimes: Object.fromEntries(this.lastSpawnTimes),
    };
  }
}
```

## ハイブリッドスポーンシステムの特徴

### 🔄 最小数維持システム（現在のロジック採用）

```typescript
// 緊急スポーン判定
const minEnemyCount = Math.max(
  2,
  Math.floor(level.spawnPattern.maxTotal * 0.4)
);
const isEmergencySpawn = totalEnemyCount < minEnemyCount;

if (isEmergencySpawn) {
  // 緊急時は動的間隔でスポーン（難易度に応じて調整）
  const emergencyInterval = this.calculateEmergencyInterval();
  if (framesSinceLastSpawn >= emergencyInterval) {
    return { shouldSpawn: true, reason: "emergency_spawn", isEmergency: true };
  }
}
```

### 🎯 レベル設計による制御

- 各レベルで出現する敵タイプを制限
- 敵タイプ別の最大数と間隔を設定
- 時間ベースのレベル進行

### ⚖️ 動的間隔調整システム

#### 1. **レベル難易度倍率**

```typescript
// レベル進行に応じた段階的難易度上昇
private getLevelDifficultyMultiplier(): number {
  if (this.currentLevel <= 5) return 1.0;      // レベル1-5: 基本
  else if (this.currentLevel <= 10) return 1.1; // レベル6-10: 10%高速化
  else if (this.currentLevel <= 15) return 1.2; // レベル11-15: 20%高速化
  else return 1.3;                              // レベル16-20: 30%高速化
}
```

#### 2. **緊急スポーン間隔の調整**

```typescript
// 基本3秒間隔から動的に調整
private calculateEmergencyInterval(): number {
  const baseEmergencyInterval = 180; // 基本3秒間隔

  if (this.isEndlessMode) {
    // エンドレス: 1.0x → 1.2x → 1.4x... に応じて短縮
    return Math.max(
      Math.floor(baseEmergencyInterval / this.endlessMultiplier),
      60 // 最小1秒間隔
    );
  } else {
    // 通常レベル: 段階的に短縮
    return Math.max(
      Math.floor(baseEmergencyInterval / this.getLevelDifficultyMultiplier()),
      90 // 最小1.5秒間隔（通常レベルでは緩やか）
    );
  }
}
```

#### 3. **通常スポーン間隔の調整**

```typescript
// レベル設計の基本間隔から動的に調整
private calculateNormalInterval(baseInterval: number): number {
  if (this.isEndlessMode) {
    // エンドレス: より積極的な短縮
    return Math.max(
      Math.floor(baseInterval / this.endlessMultiplier),
      120 // 最小2秒間隔
    );
  } else {
    // 通常レベル: 緩やかな短縮
    return Math.max(
      Math.floor(baseInterval / this.getLevelDifficultyMultiplier()),
      180 // 最小3秒間隔
    );
  }
}
```

### 📊 間隔調整の具体例

#### レベル 3（ワンダラー + ガード混合）

```
基本設定:
- maxTotal: 4, minEnemyCount: 2
- baseInterval: 480フレーム（8秒）
- baseEmergencyInterval: 180フレーム（3秒）

レベル3での調整（難易度倍率1.0）:
- 通常間隔: 480フレーム（8秒） ← 変化なし
- 緊急間隔: 180フレーム（3秒） ← 変化なし

レベル8での調整（難易度倍率1.1）:
- 通常間隔: 436フレーム（7.3秒） ← 10%短縮
- 緊急間隔: 164フレーム（2.7秒） ← 10%短縮

レベル18での調整（難易度倍率1.3）:
- 通常間隔: 369フレーム（6.2秒） ← 30%短縮
- 緊急間隔: 138フレーム（2.3秒） ← 30%短縮
```

#### エンドレスモード（倍率 2.0 の場合）

```
基本設定:
- baseInterval: 480フレーム（8秒）
- baseEmergencyInterval: 180フレーム（3秒）

エンドレス倍率2.0での調整:
- 通常間隔: 240フレーム（4秒） ← 50%短縮
- 緊急間隔: 90フレーム（1.5秒） ← 50%短縮

エンドレス倍率3.0での調整:
- 通常間隔: 160フレーム（2.7秒） ← 67%短縮
- 緊急間隔: 60フレーム（1秒） ← 最小値に到達
```

### ⚖️ バランス調整

1. **最小敵数**: レベルの最大数の 40%を下回ると緊急スポーン
2. **緊急間隔**: 動的調整（1.5 秒〜3 秒）
3. **通常間隔**: 動的調整（レベル設計基準から段階的短縮）
4. **最大数制限**: 敵タイプ別の上限を維持
5. **最小間隔制限**:
   - 通常レベル: 緊急 1.5 秒、通常 3 秒
   - エンドレス: 緊急 1 秒、通常 2 秒

### 🎮 プレイヤー体験の向上

#### 段階的な難易度上昇

- **レベル 1-5**: 基本的な学習期間（間隔変化なし）
- **レベル 6-10**: 軽微な難易度上昇（10%高速化）
- **レベル 11-15**: 中程度の難易度上昇（20%高速化）
- **レベル 16-20**: 高難易度（30%高速化）
- **エンドレス**: 継続的な難易度上昇（20%ずつ増加）

#### 適応的な挑戦

- **敵を効率的に破壊**: 緊急スポーンで適切な圧力維持
- **レベル進行**: 自動的な難易度上昇で飽きを防止
- **エンドレスモード**: 無限の挑戦と成長機会
