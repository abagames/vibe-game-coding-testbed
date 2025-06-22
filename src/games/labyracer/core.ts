import {
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  BaseGameOptions,
} from "../../core/coreTypes.js";
import {
  BaseGameState,
  createBaseGame,
  drawText,
  drawCenteredText,
  addScore,
  loseLife,
  triggerGameOver,
  isGameOver,
  clearVirtualScreen,
  renderStandardUI,
  playSoundEffect,
  playMml,
  getHighScore,
} from "../../core/baseGame.js";

const MOVEMENT_INTERVAL = 8;

const AUDIO_PATTERNS = {
  FLAG_COLLECT: "@coin@s128 v60 l16 o6 c e",
  SPECIAL_FLAG_COLLECT: [
    "@synth@s456 v80 l16 o6 c e g >c e g >c<",
    "@synth@s789 v50 l8 o5 c g c g",
  ],
  SPECIAL_FLAG_SPAWN: [
    "@synth@s123 v70 l16 o6 g a b >c d d e e<",
    "@synth@s456 v50 l8 o4 c e g c e g",
    "@hit@d@s789 v40 l16 o4 c r c r c",
  ],
  SMOKE_ACTIVATED: "@hit@s33 v80 l16 o4 c>c<c>c<c>c<",
  ENEMY_SMOKE_HIT: "@hit@s46 v80 l16 o5 c d e f g f e d c",
  ENEMY_COLLISION: "@hit@s55 v70 l16 o5 c c+ d d+ e",
  ENEMY_SPAWN_WARNING: "@synth@s65 v50 l16 o5 c+ r c+ r c+ r",
  ENEMY_DESTRUCTION_BONUS: "@laser@s99 v60 l16 o3 a8 r a a",
  MAZE_TRANSITION_START: [
    "@synth@s111 v60 l16 o4 c g >c< g c",
    "@hit@d@s223 v60 l16 o4 c r c r c r",
  ],
  FUEL_WARNING: "@synth@s555 v70 l16 o5 c+ r c+ r c+ r c+ r",
  FUEL_CRITICAL: "@laser@s666 v60 l16 o6 c r",
  EXTRA_LIFE_JINGLE: [
    "@synth@s775 v80 l16 o5 c e g >c e g >c<",
    "@synth@s886 v70 l8 o4 c g c",
  ],
  FUEL_REFILL: "@synth@s999 v40 l16 o5 c d e f g a b >c<",
} as const;

type Position = {
  x: number;
  y: number;
};

type Enemy = {
  x: number;
  y: number;
  direction: number; // 0=up, 1=right, 2=down, 3=left
  movementCounter: number;
  id: number;
  previousDirection: number;
  stuckCounter: number;
  isSpawning: boolean;
  spawnTimer: number;
  blinkState: boolean;
  isStunned: boolean;
  stunnedTimer: number;
  stunnedRotationDirection: number; // 0=clockwise, 1=counterclockwise
  originalDirection: number;
  isFrozen: boolean;
};

type ScoreDisplay = {
  x: number;
  y: number;
  score: number;
  timer: number;
};

export type LabyracerOptions = BaseGameOptions & {
  movementInterval?: number;
  enemyCount?: number;
};

export type LabyracerState = BaseGameState & {
  playerX: number;
  playerY: number;
  movementFrameCounter: number;
  movementInterval: number;
  maze: boolean[][];
  mazeWidth: number;
  mazeHeight: number;
  direction: number; // 0=up, 1=right, 2=down, 3=left
  flags: Position[];
  specialFlags: Position[];
  hasCollectedAllLeftFlags: boolean;
  hasCollectedAllRightFlags: boolean;
  enemies: Enemy[];
  nextEnemyId: number;
  smokeTrailActive: boolean;
  smokeTrailRemainingMoves: number;
  smokeTrails: Array<{ x: number; y: number; timer: number }>;
  mazeTransitionActive: boolean;
  transitionLineX: number;
  transitionDirection: "left" | "right";
  transitionTimer: number;
  previousInputState: InputState;
  destructionBonusCounter: number;
  scoreDisplays: ScoreDisplay[];
  difficulty: number;
  enemyAppearanceCount: number;
  rocks: Position[];
  fuel: number;
  maxFuel: number;
  fuelConsumptionMove: number;
  fuelConsumptionSmoke: number;
  fuelRefillAmount: number;
  isMissAnimation: boolean;
  missAnimationTimer: number;
  missAnimationFrame: number;
  explosionX: number;
  explosionY: number;
  initialPlayerX: number;
  initialPlayerY: number;
  lastVerticalMovement: number; // 0=up, 2=down, -1=none
  lastHorizontalMovement: number; // 1=right, 3=left, -1=none
  nextLifeThreshold: number;
  lifeThresholdIndex: number;
};

export function createLabyracerState(
  options: LabyracerOptions = {}
): LabyracerState {
  const { movementInterval = MOVEMENT_INTERVAL, ...baseOptions } = options;

  const baseState = createBaseGame({
    ...baseOptions,
    initialLives: 3,
  });

  const mazeWidth = VIRTUAL_SCREEN_WIDTH - 2;
  const mazeHeight = VIRTUAL_SCREEN_HEIGHT - 4;

  const playerX = 1;
  const playerY = 2;

  return {
    ...baseState,
    playerX,
    playerY,
    movementFrameCounter: 0,
    movementInterval,
    maze: [],
    mazeWidth,
    mazeHeight,
    direction: 0,
    flags: [],
    specialFlags: [],
    hasCollectedAllLeftFlags: false,
    hasCollectedAllRightFlags: false,
    enemies: [],
    nextEnemyId: 0,
    smokeTrailActive: false,
    smokeTrailRemainingMoves: 0,
    smokeTrails: [],
    mazeTransitionActive: false,
    transitionLineX: 0,
    transitionDirection: "left",
    transitionTimer: 0,
    previousInputState: {},
    destructionBonusCounter: 0,
    scoreDisplays: [],
    difficulty: 0,
    enemyAppearanceCount: 0,
    rocks: [],
    fuel: 100,
    maxFuel: 100,
    fuelConsumptionMove: 0.25,
    fuelConsumptionSmoke: 3,
    fuelRefillAmount: 50,
    isMissAnimation: false,
    missAnimationTimer: 0,
    missAnimationFrame: 0,
    explosionX: 0,
    explosionY: 0,
    initialPlayerX: playerX,
    initialPlayerY: playerY,
    lastVerticalMovement: -1,
    lastHorizontalMovement: -1,
    nextLifeThreshold: 1000,
    lifeThresholdIndex: 0,
  };
}

function generateSymmetricMaze(width: number, height: number): boolean[][] {
  const maze: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(true));

  const halfWidth = Math.floor(width / 2);
  const leftHalf = generateMazeHalf(halfWidth, height);
  const finalLeftHalf = removeDeadEnds(leftHalf);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < halfWidth; x++) {
      maze[y][x] = finalLeftHalf[y][x];
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < halfWidth; x++) {
      const mirrorX = width - 1 - x;
      maze[y][mirrorX] = maze[y][x];
    }
  }

  if (width % 2 === 1) {
    const centerX = Math.floor(width / 2);
    for (let y = 1; y < height - 1; y += 2) {
      maze[y][centerX] = false;
    }
  }
  return maze;
}

function generateMazeHalf(width: number, height: number): boolean[][] {
  const maze: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(true));

  const visited: boolean[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(false));

  function carve(x: number, y: number) {
    visited[y][x] = true;
    maze[y][x] = false;

    const directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
        maze[y + dy / 2][x + dx / 2] = false;
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);
  return maze;
}

function removeDeadEnds(maze: boolean[][]): boolean[][] {
  const height = maze.length;
  const width = maze[0].length;
  const newMaze = maze.map((row) => [...row]);
  const halfWidth = Math.floor(width / 2);

  function isDeadEnd(x: number, y: number): boolean {
    if (newMaze[y][x]) return false;

    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    let passageCount = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (!newMaze[ny][nx]) {
          passageCount++;
        }
      }
    }

    return passageCount <= 1 || (passageCount === 2 && Math.random() < 0.2);
  }

  function resolveDeadEnd(x: number, y: number): void {
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];

    const shuffledDirections = directions.sort(() => Math.random());

    for (const [dx, dy] of shuffledDirections) {
      const nx = x + dx;
      const ny = y + dy;
      const nx2 = nx + dx;
      const ny2 = ny + dy;

      if (nx2 >= 0 && nx2 < width && ny2 >= 0 && ny2 < height) {
        if (newMaze[ny][nx] && !newMaze[ny2][nx2]) {
          newMaze[ny][nx] = false;
          return;
        }
      }
    }
  }

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (isDeadEnd(x, y)) {
        resolveDeadEnd(x, y);
      }
    }
  }
  return newMaze;
}

function generateSymmetricFlags(
  maze: boolean[][],
  width: number,
  height: number
): Position[] {
  const leftFlags = generateHalfFlags(maze, width, height, "left");

  const rightFlags: Position[] = [];
  for (const leftFlag of leftFlags) {
    const mirrorX = width - leftFlag.x - 1;
    rightFlags.push({ x: mirrorX, y: leftFlag.y });
  }

  return [...leftFlags, ...rightFlags];
}

function generateHalfFlags(
  maze: boolean[][],
  width: number,
  height: number,
  side: "left" | "right"
): Position[] {
  const flags: Position[] = [];
  const halfWidth = Math.floor(width / 2);
  const flagCount = 3;

  const startX = side === "left" ? 0 : halfWidth + 2;
  const endX = side === "left" ? halfWidth - 2 : width;

  const passagePositions: Position[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = startX; x < endX; x += 2) {
      if (!maze[y][x]) {
        passagePositions.push({ x, y });
      }
    }
  }

  const validPositions = passagePositions.filter(
    (pos) => Math.abs(pos.x - 0) + Math.abs(pos.y - 0) > 3
  );

  const shuffled = validPositions.sort(() => Math.random() - 0.5);
  const selectedPositions = shuffled.slice(
    0,
    Math.min(flagCount, shuffled.length)
  );

  for (const pos of selectedPositions) {
    flags.push({ x: pos.x, y: pos.y });
  }

  return flags;
}

function generateSpecialFlag(
  maze: boolean[][],
  width: number,
  height: number,
  side: "left" | "right",
  existingFlags: Position[] = []
): Position | null {
  const halfWidth = Math.floor(width / 2);

  const startX = side === "left" ? 0 : halfWidth + 2;
  const endX = side === "left" ? halfWidth - 2 : width;

  const passagePositions: Position[] = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = startX; x < endX; x += 2) {
      if (!maze[y][x]) {
        passagePositions.push({ x, y });
      }
    }
  }

  const availablePositions = passagePositions.filter(
    (pos) => !existingFlags.some((flag) => flag.x === pos.x && flag.y === pos.y)
  );

  const centerY = Math.floor(height / 2);
  const validPositions = availablePositions
    .filter((pos) => Math.abs(pos.y - centerY) < height / 3)
    .sort(() => Math.random() - 0.5);

  if (validPositions.length > 0) {
    const selectedPos = validPositions[0];
    return { x: selectedPos.x, y: selectedPos.y };
  }

  return null;
}

function generateRocks(
  maze: boolean[][],
  width: number,
  height: number,
  difficulty: number
): Position[] {
  const rocks: Position[] = [];
  const rockCount = Math.floor(difficulty);

  if (rockCount <= 0) {
    return rocks;
  }

  const wallPositions: Position[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if ((y % 2 === 0 && x % 2 === 0) || (y % 2 === 1 && x % 2 === 1)) {
        continue;
      }
      if (maze[y][x]) {
        if (
          (y > 0 && y < height - 1 && maze[y - 1][x] && maze[y + 1][x]) ||
          (x > 0 && x < width - 1 && maze[y][x - 1] && maze[y][x + 1])
        ) {
          wallPositions.push({ x, y });
        }
      }
    }
  }

  const shuffledWalls = wallPositions.sort(() => Math.random() - 0.5);
  const selectedPositions = shuffledWalls.slice(
    0,
    Math.min(rockCount, shuffledWalls.length)
  );

  for (const pos of selectedPositions) {
    rocks.push({ x: pos.x, y: pos.y });
    maze[pos.y][pos.x] = false;
  }

  return rocks;
}

function spawnEnemiesNearFlag(
  state: LabyracerState,
  flagX: number,
  flagY: number,
  count: number
): LabyracerState {
  if (count <= 0) {
    return state;
  }

  const spawnRadius = 3;
  const potentialPositions: Position[] = [];

  for (let dy = -spawnRadius; dy <= spawnRadius; dy++) {
    for (let dx = -spawnRadius; dx <= spawnRadius; dx++) {
      const checkX = flagX + dx;
      const checkY = flagY + dy;

      if (
        checkX >= 0 &&
        checkX < state.mazeWidth &&
        checkY >= 0 &&
        checkY < state.mazeHeight
      ) {
        if (!state.maze[checkY][checkX]) {
          const hasRock = state.rocks.some(
            (rock) => rock.x === checkX && rock.y === checkY
          );

          if (!hasRock) {
            const playerMazeX = state.playerX - 1;
            const playerMazeY = state.playerY - 2;
            const distanceFromPlayer =
              Math.abs(checkX - playerMazeX) + Math.abs(checkY - playerMazeY);

            if (distanceFromPlayer >= 2) {
              potentialPositions.push({ x: checkX, y: checkY });
            }
          }
        }
      }
    }
  }

  if (potentialPositions.length === 0) {
    return state;
  }

  let newState = state;
  const newEnemies: Enemy[] = [];

  for (let i = 0; i < count; i++) {
    const selectedPos =
      potentialPositions[Math.floor(Math.random() * potentialPositions.length)];

    const initialDirection = Math.floor(Math.random() * 4);
    const newEnemy: Enemy = {
      x: selectedPos.x + 1,
      y: selectedPos.y + 2,
      direction: initialDirection,
      movementCounter: 0,
      id: newState.nextEnemyId + i,
      previousDirection: initialDirection,
      stuckCounter: 0,
      isSpawning: true,
      spawnTimer: Math.floor(Math.random() * 30) + i * 15,
      blinkState: true,
      isStunned: false,
      stunnedTimer: 0,
      stunnedRotationDirection: Math.floor(Math.random() * 2),
      originalDirection: initialDirection,
      isFrozen: false,
    };

    newEnemies.push(newEnemy);
  }

  const finalState = {
    ...newState,
    enemies: [...newState.enemies, ...newEnemies],
    nextEnemyId: newState.nextEnemyId + count,
  };

  if (count > 0) {
    playMml(finalState, AUDIO_PATTERNS.ENEMY_SPAWN_WARNING);
  }

  return finalState;
}

function regenerateHalf(
  state: LabyracerState,
  side: "left" | "right"
): LabyracerState {
  const maze = state.maze.map((row) => [...row]);
  const halfWidth = Math.floor(state.mazeWidth / 2);

  if (side === "left") {
    const newLeftHalf = generateMazeHalf(halfWidth, state.mazeHeight);
    const finalLeftHalfMaze = removeDeadEnds(newLeftHalf);
    for (let y = 0; y < state.mazeHeight; y++) {
      for (let x = 0; x < halfWidth; x++) {
        maze[y][x] = finalLeftHalfMaze[y][x];
      }
    }

    const rightFlags = state.flags.filter((flag) => flag.x >= halfWidth);
    const leftFlags = generateHalfFlags(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      "left"
    );
    const newFlags = [...leftFlags, ...rightFlags];

    for (const flag of state.specialFlags) {
      maze[flag.y][flag.x] = false;
    }
    const newRocks = generateRocks(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      state.difficulty
    );

    return {
      ...state,
      maze,
      flags: newFlags,
      specialFlags: state.specialFlags,
      hasCollectedAllLeftFlags: false,
      rocks: newRocks,
    };
  } else {
    const newLeftHalf = generateMazeHalf(halfWidth, state.mazeHeight);
    const finalLeftHalfMaze = removeDeadEnds(newLeftHalf);
    for (let y = 0; y < state.mazeHeight; y++) {
      for (let x = 0; x < halfWidth; x++) {
        const mirrorX = state.mazeWidth - 1 - x;
        maze[y][mirrorX] = finalLeftHalfMaze[y][x];
      }
    }

    const leftFlags = state.flags.filter((flag) => flag.x < halfWidth);
    const rightFlags = generateHalfFlags(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      "right"
    );
    const newFlags = [...leftFlags, ...rightFlags];

    for (const flag of state.specialFlags) {
      maze[flag.y][flag.x] = false;
    }
    const newRocks = generateRocks(
      maze,
      state.mazeWidth,
      state.mazeHeight,
      state.difficulty
    );

    return {
      ...state,
      maze,
      flags: newFlags,
      specialFlags: state.specialFlags,
      hasCollectedAllRightFlags: false,
      rocks: newRocks,
    };
  }
}

export function initializeLabyracer(state: LabyracerState): LabyracerState {
  const playerX = 1;
  const playerY = 2;

  let newState: LabyracerState = {
    ...state,
    score: 0,
    lives: 3,
    gameOverState: false,
    playerX,
    playerY,
    movementFrameCounter: 0,
    direction: 1,
    nextEnemyId: 0,
    smokeTrailActive: false,
    smokeTrailRemainingMoves: 0,
    smokeTrails: [],
    mazeTransitionActive: false,
    transitionLineX: 0,
    transitionDirection: "left",
    transitionTimer: 0,
    previousInputState: {
      action1: true,
      action2: true,
    },
    destructionBonusCounter: 0,
    scoreDisplays: [],
    difficulty: 0,
    enemyAppearanceCount: 1,
    rocks: [],
    fuel: 100,
    maxFuel: 100,
    fuelConsumptionMove: 0.2,
    fuelConsumptionSmoke: 5,
    fuelRefillAmount: 50,
    nextLifeThreshold: 1000,
    lifeThresholdIndex: 0,
  };

  let maze = generateSymmetricMaze(newState.mazeWidth, newState.mazeHeight);

  const flags = generateSymmetricFlags(
    maze,
    newState.mazeWidth,
    newState.mazeHeight
  );

  const rocks = generateRocks(
    maze,
    newState.mazeWidth,
    newState.mazeHeight,
    newState.difficulty
  );

  const enemies: Enemy[] = [];

  const isTestMode_Active = false;
  if (isTestMode_Active) {
  }
  const finalState = {
    ...newState,
    maze,
    flags,
    specialFlags: [],
    hasCollectedAllLeftFlags: false,
    hasCollectedAllRightFlags: false,
    enemies,
    rocks,
  };

  return finalState;
}

function drawMaze(state: LabyracerState): LabyracerState {
  let newState = state;

  const offsetX = 1;
  const offsetY = 2;

  const visibilityRadius = 5;
  const playerMazeX = state.playerX - offsetX;
  const playerMazeY = state.playerY - offsetY;

  for (let y = 0; y < state.mazeHeight; y++) {
    for (let x = 0; x < state.mazeWidth; x++) {
      const distanceX = Math.abs(x - playerMazeX);
      const distanceY = Math.abs(y - playerMazeY);
      if (distanceX <= visibilityRadius && distanceY <= visibilityRadius) {
        const char = state.maze[y][x] ? "O" : " ";
        const color = state.maze[y][x] ? "light_cyan" : "black";

        newState = drawText(newState, char, x + offsetX, y + offsetY, {
          entityType: state.maze[y][x] ? "wall" : "path",
          isPassable: !state.maze[y][x],
          color: color,
        }) as LabyracerState;
      }
    }
  }

  return newState;
}

function drawBorderWalls(state: LabyracerState): LabyracerState {
  let newState = state;

  const wallChar = "#";
  const wallAttributes = {
    entityType: "wall",
    isPassable: false,
    color: "light_green",
  } as const;

  const visibilityRadius = 5;

  for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
    const distanceX = Math.abs(x - state.playerX);
    const distanceY1 = Math.abs(1 - state.playerY);
    const distanceY2 = Math.abs(VIRTUAL_SCREEN_HEIGHT - 2 - state.playerY);
    if (distanceX <= visibilityRadius && distanceY1 <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        x,
        1,
        wallAttributes
      ) as LabyracerState;
    }
    if (distanceX <= visibilityRadius && distanceY2 <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        x,
        VIRTUAL_SCREEN_HEIGHT - 2,
        wallAttributes
      ) as LabyracerState;
    }
  }

  for (let y = 2; y < VIRTUAL_SCREEN_HEIGHT - 2; y++) {
    const distanceX1 = Math.abs(0 - state.playerX);
    const distanceX2 = Math.abs(VIRTUAL_SCREEN_WIDTH - 1 - state.playerX);
    const distanceY = Math.abs(y - state.playerY);
    if (distanceX1 <= visibilityRadius && distanceY <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        0,
        y,
        wallAttributes
      ) as LabyracerState;
    }
    if (distanceX2 <= visibilityRadius && distanceY <= visibilityRadius) {
      newState = drawText(
        newState,
        wallChar,
        VIRTUAL_SCREEN_WIDTH - 1,
        y,
        wallAttributes
      ) as LabyracerState;
    }
  }

  return newState;
}

function drawFlags(state: LabyracerState): LabyracerState {
  let newState = state;

  for (const flag of newState.flags) {
    newState = drawText(newState, "F", flag.x + 1, flag.y + 2, {
      color: "yellow",
    }) as LabyracerState;
  }

  return newState;
}

function drawSpecialFlag(state: LabyracerState): LabyracerState {
  let newState = state;

  for (const specialFlag of state.specialFlags) {
    newState = drawText(newState, "S", specialFlag.x + 1, specialFlag.y + 2, {
      entityType: "special_flag",
      isPassable: true,
      color: "cyan",
    }) as LabyracerState;
  }

  return newState;
}

function drawRocks(state: LabyracerState): LabyracerState {
  let newState = state;

  const visibilityRadius = 5;

  for (const rock of state.rocks) {
    const rockScreenX = rock.x + 1;
    const rockScreenY = rock.y + 2;
    const distanceX = Math.abs(rockScreenX - state.playerX);
    const distanceY = Math.abs(rockScreenY - state.playerY);
    if (distanceX <= visibilityRadius && distanceY <= visibilityRadius) {
      newState = drawText(newState, "*", rockScreenX, rockScreenY, {
        entityType: "rock",
        isPassable: false,
        color: "red",
      }) as LabyracerState;
    }
  }
  return newState;
}

function drawPlayer(state: LabyracerState): LabyracerState {
  if (state.isMissAnimation) {
    return drawExplosionEffect(state);
  }

  const directionChars = ["^", ">", "v", "<"];
  const playerChar = directionChars[state.direction];

  return drawText(state, playerChar, state.playerX, state.playerY, {
    entityType: "player",
    isPassable: true,
    color: "cyan",
  }) as LabyracerState;
}

function drawEnemies(state: LabyracerState): LabyracerState {
  let newState = state;

  const directionChars = ["^", ">", "v", "<"];

  for (const enemy of state.enemies) {
    if (enemy.isFrozen) {
      newState = drawText(newState, "X", enemy.x, enemy.y, {
        entityType: "enemy_frozen",
        isPassable: true,
        color: "light_red",
      }) as LabyracerState;
      continue;
    }

    if (enemy.isSpawning) {
      const shouldShow = Math.floor(enemy.spawnTimer / 8) % 2 === 0;

      if (shouldShow) {
        const enemyChar = directionChars[enemy.direction];
        newState = drawText(newState, enemyChar, enemy.x, enemy.y, {
          entityType: "enemy_spawning",
          isPassable: true,
          color: "red",
        }) as LabyracerState;
      }
    } else if (enemy.isStunned) {
      const shouldShow = Math.floor(enemy.stunnedTimer / 8) % 2 === 0;

      if (shouldShow) {
        const enemyChar = directionChars[enemy.direction];
        newState = drawText(newState, enemyChar, enemy.x, enemy.y, {
          entityType: "enemy_stunned",
          isPassable: true,
          color: "red",
        }) as LabyracerState;
      }
    } else {
      const enemyChar = directionChars[enemy.direction];
      newState = drawText(newState, enemyChar, enemy.x, enemy.y, {
        entityType: "enemy",
        isPassable: true,
        color: "red",
      }) as LabyracerState;
    }
  }

  return newState;
}

function drawSmokeTrails(state: LabyracerState): LabyracerState {
  let newState = state;

  const visibilityRadius = 5;

  for (const smoke of state.smokeTrails) {
    const distanceX = Math.abs(smoke.x - state.playerX);
    const distanceY = Math.abs(smoke.y - state.playerY);

    if (distanceX <= visibilityRadius && distanceY <= visibilityRadius) {
      if (smoke.timer > 40) {
        newState = drawText(newState, "*", smoke.x, smoke.y, {
          entityType: "smoke_heavy",
          isPassable: true,
          color: "white",
        }) as LabyracerState;
      } else if (smoke.timer > 20) {
        newState = drawText(newState, ".", smoke.x, smoke.y, {
          entityType: "smoke_medium",
          isPassable: true,
          color: "white",
        }) as LabyracerState;
      } else {
        newState = drawText(newState, "o", smoke.x, smoke.y, {
          entityType: "smoke_light",
          isPassable: true,
          color: "white",
        }) as LabyracerState;
      }
    }
  }

  return newState;
}

function drawTransitionLine(state: LabyracerState): LabyracerState {
  if (!state.mazeTransitionActive) {
    return state;
  }

  let newState = state;

  for (let y = 2; y < VIRTUAL_SCREEN_HEIGHT - 2; y++) {
    newState = drawText(newState, "|", state.transitionLineX, y, {
      entityType: "transition_line",
      isPassable: true,
      color: "yellow",
    }) as LabyracerState;
  }

  return newState;
}

function drawFuelMeter(state: LabyracerState): LabyracerState {
  let newState = state;

  const meterY = VIRTUAL_SCREEN_HEIGHT - 1;
  const meterStartX = 2;
  const meterWidth = 20;
  const labelText = "FUEL:";

  newState = drawText(newState, labelText, 0, meterY, {
    color: "white",
  }) as LabyracerState;
  newState = drawText(newState, "[", meterStartX - 1, meterY, {
    color: "white",
  }) as LabyracerState;
  newState = drawText(newState, "]", meterStartX + meterWidth, meterY, {
    color: "white",
  }) as LabyracerState;

  const fuelRatio = Math.max(0, state.fuel) / state.maxFuel;
  const filledWidth = Math.floor(fuelRatio * meterWidth);
  for (let x = 0; x < meterWidth; x++) {
    let char = " ";
    let color: "light_black" | "green" | "yellow" | "red" = "light_black";

    if (x < filledWidth) {
      char = "=";
      if (fuelRatio > 0.6) {
        color = "green";
      } else if (fuelRatio > 0.3) {
        color = "yellow";
      } else {
        color = "red";
      }
    }

    newState = drawText(newState, char, meterStartX + x, meterY, {
      color: color,
    }) as LabyracerState;
  }

  const fuelText = `${Math.max(0, Math.floor(state.fuel))}`;
  newState = drawText(
    newState,
    fuelText,
    meterStartX + meterWidth + 2,
    meterY,
    {
      color: "white",
    }
  ) as LabyracerState;

  if (state.fuel <= 0) {
    newState = drawText(
      newState,
      "LOW SPEED!",
      meterStartX + meterWidth + 6,
      meterY,
      {
        color: "red",
      }
    ) as LabyracerState;
  }

  return newState;
}

function isValidMove(state: LabyracerState, x: number, y: number): boolean {
  if (
    x <= 0 ||
    x >= VIRTUAL_SCREEN_WIDTH - 1 ||
    y <= 1 ||
    y >= VIRTUAL_SCREEN_HEIGHT - 2
  ) {
    return false;
  }

  if (y < 2) {
    return false;
  }

  const mazeX = x - 1;
  const mazeY = y - 2;

  if (
    mazeX < 0 ||
    mazeX >= state.mazeWidth ||
    mazeY < 0 ||
    mazeY >= state.mazeHeight
  ) {
    return false;
  }
  if (state.maze[mazeY][mazeX]) {
    return false;
  }

  return true;
}

function isValidMoveForEnemy(
  state: LabyracerState,
  x: number,
  y: number
): boolean {
  if (!isValidMove(state, x, y)) {
    return false;
  }
  const mazeX = x - 1;
  const mazeY = y - 2;
  const hasRock = state.rocks.some(
    (rock) => rock.x === mazeX && rock.y === mazeY
  );
  if (hasRock) {
    return false;
  }

  return true;
}

function getNextPosition(
  x: number,
  y: number,
  direction: number
): { x: number; y: number } {
  switch (direction) {
    case 0:
      return { x, y: y - 1 };
    case 1:
      return { x: x + 1, y };
    case 2:
      return { x, y: y + 1 };
    case 3:
      return { x: x - 1, y };
    default:
      return { x, y };
  }
}

function rotateClockwise(direction: number): number {
  return (direction + 1) % 4;
}

function rotateCounterclockwise(direction: number): number {
  return (direction + 3) % 4;
}

function reverseDirection(direction: number): number {
  return (direction + 2) % 4;
}

function getTryDirectionsBasedOnLastMovement(
  currentDirection: number,
  lastVerticalMovement: number,
  lastHorizontalMovement: number
): number[] {
  const directions: number[] = [];

  if (currentDirection === 1 || currentDirection === 3) {
    if (lastVerticalMovement === 0) {
      directions.push(0);
    } else if (lastVerticalMovement === 2) {
      directions.push(2);
    }

    if (lastVerticalMovement !== 0) directions.push(0);
    if (lastVerticalMovement !== 2) directions.push(2);

    directions.push(reverseDirection(currentDirection));
  } else if (currentDirection === 0 || currentDirection === 2) {
    if (lastHorizontalMovement === 1) {
      directions.push(1);
    } else if (lastHorizontalMovement === 3) {
      directions.push(3);
    }

    if (lastHorizontalMovement !== 1) directions.push(1);
    if (lastHorizontalMovement !== 3) directions.push(3);

    directions.push(reverseDirection(currentDirection));
  }

  return [...new Set(directions)];
}

function updateDirectionFromInput(
  currentDirection: number,
  inputState: InputState,
  playerX: number,
  playerY: number,
  gameState: LabyracerState
): number {
  let newDirection = currentDirection;

  if (inputState.up) {
    newDirection = 0;
  } else if (inputState.down) {
    newDirection = 2;
  } else if (inputState.right) {
    newDirection = 1;
  } else if (inputState.left) {
    newDirection = 3;
  }

  if (newDirection !== currentDirection) {
    const nextPos = getNextPosition(playerX, playerY, newDirection);
    if (isValidMove(gameState, nextPos.x, nextPos.y)) {
      return newDirection;
    } else {
      return currentDirection;
    }
  }

  return currentDirection;
}

function updateMovementHistory(
  state: LabyracerState,
  direction: number
): LabyracerState {
  let newState = { ...state };

  if (direction === 0 || direction === 2) {
    newState.lastVerticalMovement = direction;
  } else if (direction === 1 || direction === 3) {
    newState.lastHorizontalMovement = direction;
  }

  return newState;
}

function getOppositeDirection(direction: number): number {
  return (direction + 2) % 4;
}

function checkEnemySmokeCollision(
  enemy: Enemy,
  state: LabyracerState
): boolean {
  return state.smokeTrails.some(
    (smoke) => smoke.x === enemy.x && smoke.y === enemy.y
  );
}

function checkEnemyEnemyCollision(
  enemy: Enemy,
  otherEnemies: Enemy[]
): boolean {
  return otherEnemies.some(
    (other) =>
      other.id !== enemy.id &&
      other.x === enemy.x &&
      other.y === enemy.y &&
      !other.isSpawning &&
      !other.isStunned
  );
}

function stunEnemy(enemy: Enemy): Enemy {
  return {
    ...enemy,
    isStunned: true,
    stunnedTimer: 0,
    originalDirection: enemy.direction,
    stunnedRotationDirection: Math.floor(Math.random() * 2),
  };
}

function updateEnemyAI(enemy: Enemy, state: LabyracerState): Enemy {
  if (enemy.isSpawning) {
    return enemy;
  }

  const dx = state.playerX - enemy.x;
  const dy = state.playerY - enemy.y;

  const oppositeDirection = getOppositeDirection(enemy.previousDirection);

  let targetDirection = enemy.direction;

  if (Math.abs(dx) > Math.abs(dy)) {
    targetDirection = dx > 0 ? 1 : 3;
  } else {
    targetDirection = dy > 0 ? 2 : 0;
  }
  if (targetDirection !== oppositeDirection) {
    const nextPos = getNextPosition(enemy.x, enemy.y, targetDirection);
    if (isValidMoveForEnemy(state, nextPos.x, nextPos.y)) {
      return {
        ...enemy,
        direction: targetDirection,
        x: nextPos.x,
        y: nextPos.y,
        previousDirection: targetDirection,
        stuckCounter: 0,
      };
    }
  }

  if (enemy.direction !== oppositeDirection) {
    const currentPos = getNextPosition(enemy.x, enemy.y, enemy.direction);
    if (isValidMoveForEnemy(state, currentPos.x, currentPos.y)) {
      return {
        ...enemy,
        x: currentPos.x,
        y: currentPos.y,
        previousDirection: enemy.direction,
        stuckCounter: 0,
      };
    }
  }

  const allDirections = [0, 1, 2, 3];
  const nonBackwardDirections = allDirections.filter(
    (dir) =>
      dir !== oppositeDirection &&
      dir !== targetDirection &&
      dir !== enemy.direction
  );

  // 引き返し以外の方向をランダムに試行
  const shuffledDirections = nonBackwardDirections.sort(
    () => Math.random() - 0.5
  );

  for (const dir of shuffledDirections) {
    const tryPos = getNextPosition(enemy.x, enemy.y, dir);
    if (isValidMoveForEnemy(state, tryPos.x, tryPos.y)) {
      return {
        ...enemy,
        direction: dir,
        x: tryPos.x,
        y: tryPos.y,
        previousDirection: dir,
        stuckCounter: 0,
      };
    }
  }

  const newStuckCounter = enemy.stuckCounter + 1;

  if (newStuckCounter > 3) {
    const backwardPos = getNextPosition(enemy.x, enemy.y, oppositeDirection);
    if (isValidMoveForEnemy(state, backwardPos.x, backwardPos.y)) {
      return {
        ...enemy,
        direction: oppositeDirection,
        x: backwardPos.x,
        y: backwardPos.y,
        previousDirection: oppositeDirection,
        stuckCounter: 0,
      };
    }
  }

  return {
    ...enemy,
    stuckCounter: newStuckCounter,
  };
}

function startMissAnimation(state: LabyracerState): LabyracerState {
  const newState = {
    ...state,
    isMissAnimation: true,
    missAnimationTimer: 90,
    missAnimationFrame: 0,
    explosionX: state.playerX,
    explosionY: state.playerY,
  };

  playSoundEffect(newState, "explosion", state.playerX + state.playerY);

  return newState;
}
function updateMissAnimation(state: LabyracerState): LabyracerState {
  if (!state.isMissAnimation) {
    return state;
  }

  let newState = { ...state };

  newState.missAnimationTimer = Math.max(0, newState.missAnimationTimer - 1);
  newState.missAnimationFrame = newState.missAnimationFrame + 1;

  if (newState.missAnimationTimer <= 0) {
    newState = loseLife(newState) as LabyracerState;

    newState = {
      ...newState,
      playerX: newState.initialPlayerX,
      playerY: newState.initialPlayerY,
      direction: 0,
      enemies: [],
      nextEnemyId: 0,
      smokeTrails: [],
      smokeTrailActive: false,
      smokeTrailRemainingMoves: 0,
      fuel: newState.maxFuel,
      isMissAnimation: false,
      missAnimationTimer: 0,
      missAnimationFrame: 0,
    };
  }

  return newState;
}
function drawExplosionEffect(state: LabyracerState): LabyracerState {
  let newState = state;

  const animationPhase = Math.floor(state.missAnimationFrame / 6);
  const centerX = state.explosionX;
  const centerY = state.explosionY;

  switch (animationPhase % 4) {
    case 0:
      newState = drawText(newState, "*", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "red",
      }) as LabyracerState;
      break;

    case 1:
      newState = drawText(newState, "*", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "yellow",
      }) as LabyracerState;

      const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];

      for (const dir of directions) {
        const x = centerX + dir.x;
        const y = centerY + dir.y;
        if (x >= 0 && x < 40 && y >= 0 && y < 25) {
          newState = drawText(newState, "+", x, y, {
            entityType: "explosion",
            isPassable: true,
            color: "yellow",
          }) as LabyracerState;
        }
      }
      break;

    case 2:
      newState = drawText(newState, "X", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "white",
      }) as LabyracerState;

      const allDirections = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const dir of allDirections) {
        const x = centerX + dir.x;
        const y = centerY + dir.y;
        if (x >= 0 && x < 40 && y >= 0 && y < 25) {
          newState = drawText(newState, "o", x, y, {
            entityType: "explosion",
            isPassable: true,
            color: "white",
          }) as LabyracerState;
        }
      }
      break;

    case 3:
      newState = drawText(newState, ".", centerX, centerY, {
        entityType: "explosion",
        isPassable: true,
        color: "light_black",
      }) as LabyracerState;

      const smokeDirections = [
        { x: -1, y: -1 },
        { x: 0, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      for (const dir of smokeDirections) {
        const x = centerX + dir.x;
        const y = centerY + dir.y;
        if (x >= 0 && x < 40 && y >= 0 && y < 25) {
          newState = drawText(newState, ".", x, y, {
            entityType: "explosion",
            isPassable: true,
            color: "light_black",
          }) as LabyracerState;
        }
      }
      break;
  }

  return newState;
}

function updateEnemies(state: LabyracerState): LabyracerState {
  let newState = state;

  if (state.isMissAnimation) {
    return newState;
  }

  const updatedEnemies = state.enemies.map((enemy) => {
    if (enemy.isFrozen) {
      return enemy;
    }

    if (enemy.isSpawning) {
      const newSpawnTimer = enemy.spawnTimer + 1;
      const spawnDuration = 120;

      if (newSpawnTimer >= spawnDuration) {
        return {
          ...enemy,
          isSpawning: false,
          spawnTimer: 0,
          blinkState: false,
          movementCounter: 0,
        };
      } else {
        return {
          ...enemy,
          spawnTimer: newSpawnTimer,
          blinkState: Math.floor(newSpawnTimer / 8) % 2 === 0,
        };
      }
    }

    if (enemy.isStunned) {
      const newStunnedTimer = enemy.stunnedTimer + 1;
      const stunDuration = 180;

      if (newStunnedTimer >= stunDuration) {
        const reverseDirection = getOppositeDirection(enemy.originalDirection);
        const nextPos = getNextPosition(enemy.x, enemy.y, reverseDirection);
        let newX = enemy.x;
        let newY = enemy.y;

        if (isValidMoveForEnemy(newState, nextPos.x, nextPos.y)) {
          newX = nextPos.x;
          newY = nextPos.y;
        }

        return {
          ...enemy,
          isStunned: false,
          stunnedTimer: 0,
          direction: reverseDirection,
          previousDirection: reverseDirection,
          movementCounter: 0,
          x: newX,
          y: newY,
        };
      } else {
        let newDirection = enemy.direction;

        if (newStunnedTimer % 15 === 0) {
          if (enemy.stunnedRotationDirection === 0) {
            newDirection = rotateClockwise(enemy.direction);
          } else {
            newDirection = rotateCounterclockwise(enemy.direction);
          }
        }

        return {
          ...enemy,
          stunnedTimer: newStunnedTimer,
          direction: newDirection,
          blinkState: Math.floor(newStunnedTimer / 8) % 2 === 0,
        };
      }
    }

    if (checkEnemySmokeCollision(enemy, newState)) {
      newState = {
        ...newState,
        smokeTrails: newState.smokeTrails.filter(
          (smoke) => !(smoke.x === enemy.x && smoke.y === enemy.y)
        ),
      };

      playMml(newState, AUDIO_PATTERNS.ENEMY_SMOKE_HIT);
      return stunEnemy(enemy);
    }

    if (checkEnemyEnemyCollision(enemy, state.enemies)) {
      playMml(newState, AUDIO_PATTERNS.ENEMY_COLLISION);
      return stunEnemy(enemy);
    }

    const updatedEnemy = {
      ...enemy,
      movementCounter: enemy.movementCounter + 1,
    };

    if (updatedEnemy.movementCounter >= state.movementInterval + 2) {
      updatedEnemy.movementCounter = 0;
      return updateEnemyAI(updatedEnemy, newState);
    }

    return updatedEnemy;
  });

  return {
    ...newState,
    enemies: updatedEnemies,
  };
}

function checkPlayerEnemyCollision(state: LabyracerState): LabyracerState {
  if (state.isMissAnimation) {
    return state;
  }

  for (const enemy of state.enemies) {
    if (enemy.isSpawning || enemy.isStunned || enemy.isFrozen) {
      continue;
    }

    if (enemy.x === state.playerX && enemy.y === state.playerY) {
      return startMissAnimation(state);
    }
  }
  return state;
}

function checkPlayerRockCollision(state: LabyracerState): LabyracerState {
  if (state.isMissAnimation) {
    return state;
  }

  const playerMazeX = state.playerX - 1;
  const playerMazeY = state.playerY - 2;

  const hasRockCollision = state.rocks.some(
    (rock) => rock.x === playerMazeX && rock.y === playerMazeY
  );

  if (hasRockCollision) {
    return startMissAnimation(state);
  }

  return state;
}
function checkFlagCollection(state: LabyracerState): LabyracerState {
  const playerMazeX = state.playerX - 1;
  const playerMazeY = state.playerY - 2;

  const specialFlagIndex = state.specialFlags.findIndex(
    (flag) => flag.x === playerMazeX && flag.y === playerMazeY
  );

  if (specialFlagIndex !== -1) {
    const newSpecialFlags = [...state.specialFlags];
    const collectedSpecialFlag = newSpecialFlags.splice(specialFlagIndex, 1)[0];

    let newState = addScore(state, 30) as LabyracerState;
    newState = { ...newState, specialFlags: newSpecialFlags };

    playMml(newState, [...AUDIO_PATTERNS.SPECIAL_FLAG_COLLECT]);

    const newFuel = Math.min(
      newState.fuel + newState.fuelRefillAmount,
      newState.maxFuel
    );
    newState = { ...newState, fuel: newFuel };

    playMml(newState, AUDIO_PATTERNS.FUEL_REFILL);

    const halfWidth = Math.floor(state.mazeWidth / 2);
    if (collectedSpecialFlag.x >= halfWidth) {
      newState = startMazeTransition(newState, "left");
      newState = freezeEnemiesOnSide(newState, "left");
      newState = regenerateHalf(newState, "left");
    } else {
      newState = startMazeTransition(newState, "right");
      newState = freezeEnemiesOnSide(newState, "right");
      newState = regenerateHalf(newState, "right");
    }

    return newState;
  }

  const flagIndex = state.flags.findIndex(
    (flag) => flag.x === playerMazeX && flag.y === playerMazeY
  );

  if (flagIndex !== -1) {
    const newFlags = [...state.flags];
    const collectedFlag = newFlags.splice(flagIndex, 1)[0];

    let newState = addScore(state, 10) as LabyracerState;
    newState = { ...newState, flags: newFlags };

    playMml(newState, AUDIO_PATTERNS.FLAG_COLLECT);

    let currentEnemyAppearanceCount = newState.enemyAppearanceCount;
    if (newState.enemies.length === 0) {
      currentEnemyAppearanceCount = 1;
    }

    const newEnemyAppearanceCount =
      currentEnemyAppearanceCount + Math.sqrt(newState.difficulty);

    const enemiesToSpawn = Math.floor(newEnemyAppearanceCount);
    const remainingCount = newEnemyAppearanceCount - enemiesToSpawn;

    if (enemiesToSpawn > 0) {
      newState = spawnEnemiesNearFlag(
        newState,
        collectedFlag.x,
        collectedFlag.y,
        enemiesToSpawn
      );
    }

    newState = {
      ...newState,
      enemyAppearanceCount: remainingCount,
    };
    const halfWidth = Math.floor(state.mazeWidth / 2);
    const leftFlags = newFlags.filter((flag) => flag.x < halfWidth);
    const rightFlags = newFlags.filter((flag) => flag.x >= halfWidth);

    if (leftFlags.length === 0 && !state.hasCollectedAllLeftFlags) {
      const specialFlag = generateSpecialFlag(
        state.maze,
        state.mazeWidth,
        state.mazeHeight,
        "right",
        [...newFlags, ...state.specialFlags]
      );
      const newSpecialFlags = specialFlag
        ? [...state.specialFlags, specialFlag]
        : state.specialFlags;
      newState = {
        ...newState,
        specialFlags: newSpecialFlags,
        hasCollectedAllLeftFlags: true,
      };

      if (specialFlag) {
        playMml(newState, [...AUDIO_PATTERNS.SPECIAL_FLAG_SPAWN]);
      }
    } else if (rightFlags.length === 0 && !state.hasCollectedAllRightFlags) {
      const specialFlag = generateSpecialFlag(
        state.maze,
        state.mazeWidth,
        state.mazeHeight,
        "left",
        [...newFlags, ...state.specialFlags]
      );
      const newSpecialFlags = specialFlag
        ? [...state.specialFlags, specialFlag]
        : state.specialFlags;
      newState = {
        ...newState,
        specialFlags: newSpecialFlags,
        hasCollectedAllRightFlags: true,
      };

      if (specialFlag) {
        playMml(newState, [...AUDIO_PATTERNS.SPECIAL_FLAG_SPAWN]);
      }
    }

    return newState;
  }

  return state;
}

function updateSmokeTrails(state: LabyracerState): LabyracerState {
  const visibilityRadius = 5;

  const updatedSmokeTrails = state.smokeTrails
    .map((smoke) => ({
      ...smoke,
      timer: Math.max(smoke.timer - 1, 1),
    }))
    .filter((smoke) => {
      const distanceX = Math.abs(smoke.x - state.playerX);
      const distanceY = Math.abs(smoke.y - state.playerY);

      return distanceX <= visibilityRadius && distanceY <= visibilityRadius;
    });

  return {
    ...state,
    smokeTrails: updatedSmokeTrails,
  };
}

function addSmokeTrail(
  state: LabyracerState,
  x: number,
  y: number
): LabyracerState {
  const newSmoke = { x, y, timer: 60 };

  return {
    ...state,
    smokeTrails: [...state.smokeTrails, newSmoke],
  };
}
function startMazeTransition(
  state: LabyracerState,
  direction: "left" | "right"
): LabyracerState {
  const centerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);

  const newState = {
    ...state,
    mazeTransitionActive: true,
    transitionLineX: centerX,
    transitionDirection: direction,
    transitionTimer: 0,
    destructionBonusCounter: 0,
  };

  playMml(newState, [...AUDIO_PATTERNS.MAZE_TRANSITION_START]);

  return newState;
}
function freezeEnemiesOnSide(
  state: LabyracerState,
  side: "left" | "right"
): LabyracerState {
  const halfWidth = Math.floor(state.mazeWidth / 2);
  const centerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);

  const updatedEnemies = state.enemies.map((enemy) => {
    const enemyIsOnTargetSide =
      side === "left" ? enemy.x < centerX : enemy.x > centerX;

    if (enemyIsOnTargetSide) {
      return { ...enemy, isFrozen: true };
    }
    return enemy;
  });

  return {
    ...state,
    enemies: updatedEnemies,
  };
}

function updateMazeTransition(state: LabyracerState): LabyracerState {
  if (!state.mazeTransitionActive) {
    return state;
  }

  const newTimer = state.transitionTimer + 1;
  const animationDuration = 30;

  if (newTimer >= animationDuration) {
    const updatedEnemies = state.enemies.filter((enemy) => !enemy.isFrozen);

    return {
      ...state,
      mazeTransitionActive: false,
      transitionTimer: 0,
      enemies: updatedEnemies,
      destructionBonusCounter: 0,
    };
  }

  const centerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
  const progress = newTimer / animationDuration;

  let newLineX = centerX;

  if (state.transitionDirection === "left") {
    const targetX = 1;
    newLineX = Math.floor(centerX - (centerX - targetX) * progress);
  } else {
    const targetX = VIRTUAL_SCREEN_WIDTH - 2;
    newLineX = Math.floor(centerX + (targetX - centerX) * progress);
  }

  let newState = state;
  let newDestructionBonusCounter = state.destructionBonusCounter;

  const updatedEnemies = state.enemies.filter((enemy) => {
    if (!enemy.isFrozen) return true;

    let shouldDestroy = false;
    if (state.transitionDirection === "left") {
      shouldDestroy = enemy.x >= newLineX;
    } else {
      shouldDestroy = enemy.x <= newLineX;
    }

    if (shouldDestroy) {
      const bonus = calculateDestructionBonus(newDestructionBonusCounter);
      newState = addScore(newState, bonus) as LabyracerState;
      newState = addScoreDisplay(newState, enemy.x, enemy.y, bonus);

      playMml(newState, AUDIO_PATTERNS.ENEMY_DESTRUCTION_BONUS);

      newDestructionBonusCounter++;
      return false;
    }

    return true;
  });

  return {
    ...newState,
    transitionLineX: newLineX,
    transitionTimer: newTimer,
    enemies: updatedEnemies,
    destructionBonusCounter: newDestructionBonusCounter,
  };
}

function drawScoreDisplays(state: LabyracerState): LabyracerState {
  let newState = state;

  for (const scoreDisplay of state.scoreDisplays) {
    const scoreText = `+${scoreDisplay.score}`;
    newState = drawText(newState, scoreText, scoreDisplay.x, scoreDisplay.y, {
      entityType: "score_display",
      isPassable: true,
      color: "yellow",
    }) as LabyracerState;
  }

  return newState;
}

function updateScoreDisplays(state: LabyracerState): LabyracerState {
  const updatedScoreDisplays = state.scoreDisplays
    .map((display) => ({
      ...display,
      timer: display.timer - 1,
    }))
    .filter((display) => display.timer > 0);

  return {
    ...state,
    scoreDisplays: updatedScoreDisplays,
  };
}

function calculateDestructionBonus(bonusCounter: number): number {
  const bonusScores = [100, 200, 400, 800, 1600, 3200, 6400, 9890];

  if (bonusCounter >= bonusScores.length) {
    return 9890;
  }

  return bonusScores[bonusCounter];
}

function addScoreDisplay(
  state: LabyracerState,
  x: number,
  y: number,
  score: number
): LabyracerState {
  const newScoreDisplay: ScoreDisplay = {
    x,
    y,
    score,
    timer: 120,
  };

  return {
    ...state,
    scoreDisplays: [...state.scoreDisplays, newScoreDisplay],
  };
}

function updateDifficulty(state: LabyracerState): LabyracerState {
  const framesPerMinute = 3600;
  const newDifficulty = state.difficulty + 1 / framesPerMinute;
  return {
    ...state,
    difficulty: newDifficulty,
  };
}

function getFibonacciLifeThreshold(index: number): number {
  const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

  if (index >= fibonacciSequence.length) {
    return fibonacciSequence[fibonacciSequence.length - 1] * 1000;
  }

  return fibonacciSequence[index] * 1000;
}

function checkLifeIncrease(state: LabyracerState): LabyracerState {
  const MAX_LIVES = 5;

  if (state.lives >= MAX_LIVES) {
    return state;
  }

  if (state.score >= state.nextLifeThreshold) {
    const newLives = Math.min(state.lives + 1, MAX_LIVES);
    const nextIndex = state.lifeThresholdIndex + 1;
    const nextThreshold = getFibonacciLifeThreshold(nextIndex);

    const newState = {
      ...state,
      lives: newLives,
      nextLifeThreshold: nextThreshold,
      lifeThresholdIndex: nextIndex,
    };

    playMml(newState, [...AUDIO_PATTERNS.EXTRA_LIFE_JINGLE]);

    return newState;
  }

  return state;
}

function renderLivesAsCarIcons(state: LabyracerState): LabyracerState {
  const MAX_LIVES = 5;
  const remainingLives = Math.min(state.lives - 1, MAX_LIVES - 1);

  if (remainingLives > 0) {
    const livesStartX = Math.floor(
      (VIRTUAL_SCREEN_WIDTH - remainingLives * 2) / 2
    );
    let newState = state;
    for (let i = 0; i < remainingLives; i++) {
      newState = drawText(newState, ">", livesStartX + i * 2, 0, {
        color: "cyan",
      }) as LabyracerState;
    }
    return newState;
  }

  return state;
}
function renderLabyracerUI(state: LabyracerState): LabyracerState {
  let newState = state;

  const scoreText = `Score: ${state.score}`;
  newState = drawText(newState, scoreText, 1, 0, {
    color: "white",
  }) as LabyracerState;

  const highScore = getHighScore(state);
  const hiScoreText = `HI ${highScore}`;
  newState = drawText(
    newState,
    hiScoreText,
    VIRTUAL_SCREEN_WIDTH - hiScoreText.length - 1,
    0,
    { color: "yellow" }
  ) as LabyracerState;

  newState = drawText(newState, "R: Restart", 1, VIRTUAL_SCREEN_HEIGHT - 1, {
    color: "light_black",
  }) as LabyracerState;

  return newState;
}
function renderLabyracerGameOverScreen(state: LabyracerState): LabyracerState {
  const gameOverMessage = "Game Over!";
  const gameOverMessageY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2;
  const finalScoreY = gameOverMessageY + 1;

  let newState = state;

  newState = drawCenteredText(newState, gameOverMessage, gameOverMessageY, {
    color: "red",
  }) as LabyracerState;

  const scoreText = `Score: ${state.score}`;
  newState = drawCenteredText(newState, scoreText, finalScoreY, {
    color: "white",
  }) as LabyracerState;

  const highScore = Math.max(state.score, state.internalHighScore);
  if (highScore > 0) {
    const highScoreText = `High: ${highScore}`;
    const highScoreY = finalScoreY + 1;
    newState = drawCenteredText(newState, highScoreText, highScoreY, {
      color: "light_cyan",
    }) as LabyracerState;
  }

  return newState;
}

export function updateLabyracer(
  state: LabyracerState,
  inputState: InputState
): LabyracerState {
  if (isGameOver(state)) {
    let newState = clearVirtualScreen(state) as LabyracerState;
    newState = renderLabyracerGameOverScreen(newState);
    newState = renderLabyracerUI(newState);
    newState = renderLivesAsCarIcons(newState);
    return newState;
  }

  let newState = clearVirtualScreen(state) as LabyracerState;
  newState = updateDifficulty(newState);
  newState = checkLifeIncrease(newState);

  const isAction1JustPressed =
    inputState.action1 && !state.previousInputState.action1;
  const isAction2JustPressed =
    inputState.action2 && !state.previousInputState.action2;

  if (isAction1JustPressed || isAction2JustPressed) {
    if (newState.fuel >= newState.fuelConsumptionSmoke) {
      newState = {
        ...newState,
        smokeTrailActive: true,
        smokeTrailRemainingMoves: 3,
        fuel: newState.fuel - newState.fuelConsumptionSmoke,
      };

      playMml(newState, AUDIO_PATTERNS.SMOKE_ACTIVATED);
    }
  }

  newState = renderLabyracerUI(newState);
  newState = renderLivesAsCarIcons(newState);
  newState = drawBorderWalls(newState);
  newState = drawMaze(newState);
  newState = drawFlags(newState);
  newState = drawSpecialFlag(newState);
  newState = drawRocks(newState);
  newState = drawSmokeTrails(newState);
  newState = drawEnemies(newState);
  newState = updateEnemies(newState);
  newState = updateSmokeTrails(newState);
  newState = updateMissAnimation(newState);
  newState = updateScoreDisplays(newState);
  newState = updateMazeTransition(newState);
  newState = drawTransitionLine(newState);
  newState = drawScoreDisplays(newState);
  newState = drawFuelMeter(newState);

  if (!newState.isMissAnimation) {
    newState.movementFrameCounter++;

    const currentMovementInterval =
      newState.fuel <= 0
        ? newState.movementInterval * 2
        : newState.movementInterval;

    if (newState.movementFrameCounter >= currentMovementInterval) {
      newState.movementFrameCounter = 0;

      newState = {
        ...newState,
        direction: updateDirectionFromInput(
          newState.direction,
          inputState,
          newState.playerX,
          newState.playerY,
          newState
        ),
      };

      let nextPos = getNextPosition(
        newState.playerX,
        newState.playerY,
        newState.direction
      );

      if (!isValidMove(newState, nextPos.x, nextPos.y)) {
        const originalDirection = newState.direction;
        const tryDirections = getTryDirectionsBasedOnLastMovement(
          originalDirection,
          newState.lastVerticalMovement,
          newState.lastHorizontalMovement
        );

        for (const tryDirection of tryDirections) {
          const tryPos = getNextPosition(
            newState.playerX,
            newState.playerY,
            tryDirection
          );
          if (isValidMove(newState, tryPos.x, tryPos.y)) {
            newState = { ...newState, direction: tryDirection };
            nextPos = tryPos;
            break;
          }
        }
      }

      if (isValidMove(newState, nextPos.x, nextPos.y)) {
        if (
          newState.smokeTrailActive &&
          newState.smokeTrailRemainingMoves > 0
        ) {
          newState = addSmokeTrail(
            newState,
            newState.playerX,
            newState.playerY
          );
          newState = {
            ...newState,
            smokeTrailRemainingMoves: newState.smokeTrailRemainingMoves - 1,
          };

          if (newState.smokeTrailRemainingMoves <= 0) {
            newState = {
              ...newState,
              smokeTrailActive: false,
            };
          }
        }

        const newFuel = Math.max(
          0,
          newState.fuel - newState.fuelConsumptionMove
        );
        newState = {
          ...newState,
          playerX: nextPos.x,
          playerY: nextPos.y,
          fuel: newFuel,
        };

        newState = updateMovementHistory(newState, newState.direction);
        newState = checkFlagCollection(newState);
      }
    }
  }

  newState = checkPlayerEnemyCollision(newState);
  newState = checkPlayerRockCollision(newState);
  newState = drawPlayer(newState);

  if (!newState.isMissAnimation) {
    if (newState.fuel <= newState.maxFuel * 0.2 && newState.fuel > 0) {
      if (newState.movementFrameCounter % 120 === 0) {
        playMml(newState, AUDIO_PATTERNS.FUEL_WARNING);
      }
    } else if (newState.fuel <= 0) {
      if (newState.movementFrameCounter % 180 === 0) {
        playMml(newState, AUDIO_PATTERNS.FUEL_CRITICAL);
      }
    }
  }

  newState = {
    ...newState,
    previousInputState: inputState,
  };

  return newState;
}
export const labyracerOperations = {
  initializeGame: initializeLabyracer,
  updateGame: updateLabyracer,
};
