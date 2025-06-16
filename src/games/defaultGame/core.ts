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
  addScore,
  loseLife,
  triggerGameOver,
  isGameOver,
  clearVirtualScreen,
  renderStandardUI,
  renderGameOverScreen,
} from "../../core/baseGame.js";

const PLAYER_MOVEMENT_INTERVAL = 3;

type Position = {
  x: number;
  y: number;
};

export type DefaultGameOptions = BaseGameOptions & {
  movementInterval?: number;
  obstacleCount?: number;
  itemCount?: number;
};
export type DefaultGameState = BaseGameState & {
  playerX: number;
  playerY: number;
  movementFrameCounter: number;
  movementInterval: number;
  obstacleCount: number;
  itemCount: number;
  obstacles: Position[];
  items: Position[];
};

export function createDefaultGameState(
  options: DefaultGameOptions = {}
): DefaultGameState {
  const {
    movementInterval = PLAYER_MOVEMENT_INTERVAL,
    obstacleCount = 20,
    itemCount = 10,
    ...baseOptions
  } = options;

  const baseState = createBaseGame(baseOptions);
  const playerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
  const playerY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

  return {
    ...baseState,
    playerX,
    playerY,
    movementFrameCounter: 0,
    movementInterval,
    obstacleCount,
    itemCount,
    obstacles: [],
    items: [],
  };
}

export function initializeDefaultGame(
  state: DefaultGameState
): DefaultGameState {
  const playerX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2);
  const playerY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2);

  let newState: DefaultGameState = {
    ...state,
    score: 0,
    lives: state.initialLives,
    gameOverState: false,
    gameTickCounter: 0,
    playerX,
    playerY,
    movementFrameCounter: 0,
    obstacles: [],
    items: [],
  };

  const obstacles: Position[] = [];
  for (let i = 0; i < state.obstacleCount; i++) {
    const x = Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1;
    const y = Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 2)) + 1;

    if (Math.abs(x - playerX) < 3 && Math.abs(y - playerY) < 3) {
      continue;
    }

    obstacles.push({ x, y });
  }

  const items: Position[] = [];
  for (let i = 0; i < state.itemCount; i++) {
    const x = Math.floor(Math.random() * (VIRTUAL_SCREEN_WIDTH - 2)) + 1;
    const y = Math.floor(Math.random() * (VIRTUAL_SCREEN_HEIGHT - 2)) + 1;

    const hasObstacle = obstacles.some((obs) => obs.x === x && obs.y === y);
    if (
      (Math.abs(x - playerX) < 2 && Math.abs(y - playerY) < 2) ||
      hasObstacle
    ) {
      continue;
    }

    items.push({ x, y });
  }

  return {
    ...newState,
    obstacles,
    items,
  };
}

function drawStaticElements(state: DefaultGameState): DefaultGameState {
  let newState = state;

  const wallChar = "#";
  const wallAttributes = {
    entityType: "wall",
    isPassable: false,
    color: "light_black",
  } as const;

  for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
    newState = drawText(
      newState,
      wallChar,
      x,
      0,
      wallAttributes
    ) as DefaultGameState;
    newState = drawText(
      newState,
      wallChar,
      x,
      VIRTUAL_SCREEN_HEIGHT - 1,
      wallAttributes
    ) as DefaultGameState;
  }
  for (let y = 1; y < VIRTUAL_SCREEN_HEIGHT - 1; y++) {
    newState = drawText(
      newState,
      wallChar,
      0,
      y,
      wallAttributes
    ) as DefaultGameState;
    newState = drawText(
      newState,
      wallChar,
      VIRTUAL_SCREEN_WIDTH - 1,
      y,
      wallAttributes
    ) as DefaultGameState;
  }

  for (const obstacle of state.obstacles) {
    newState = drawText(newState, "*", obstacle.x, obstacle.y, {
      entityType: "obstacle",
      isPassable: false,
      color: "red",
    }) as DefaultGameState;
  }

  for (const item of state.items) {
    newState = drawText(newState, "$", item.x, item.y, {
      entityType: "item",
      isPassable: true,
      color: "yellow",
    }) as DefaultGameState;
  }

  return newState;
}

function drawPlayer(state: DefaultGameState): DefaultGameState {
  return drawText(state, "@", state.playerX, state.playerY, {
    entityType: "player",
    isPassable: true,
    color: "yellow",
  }) as DefaultGameState;
}

function isPassable(x: number, y: number): boolean {
  if (
    x < 0 ||
    x >= VIRTUAL_SCREEN_WIDTH ||
    y < 0 ||
    y >= VIRTUAL_SCREEN_HEIGHT
  ) {
    return false;
  }

  if (
    x === 0 ||
    x === VIRTUAL_SCREEN_WIDTH - 1 ||
    y === 0 ||
    y === VIRTUAL_SCREEN_HEIGHT - 1
  ) {
    return false;
  }

  return true;
}

function checkObstacleCollision(
  state: DefaultGameState,
  x: number,
  y: number
): boolean {
  return state.obstacles.some(
    (obstacle: Position) => obstacle.x === x && obstacle.y === y
  );
}

function resetPlayerPosition(state: DefaultGameState): DefaultGameState {
  return {
    ...state,
    playerX: Math.floor(VIRTUAL_SCREEN_WIDTH / 2),
    playerY: Math.floor(VIRTUAL_SCREEN_HEIGHT / 2),
  };
}

function collectItem(
  state: DefaultGameState,
  x: number,
  y: number
): DefaultGameState {
  const itemIndex = state.items.findIndex(
    (item: Position) => item.x === x && item.y === y
  );
  if (itemIndex !== -1) {
    const newItems = [...state.items];
    newItems.splice(itemIndex, 1);
    const newState = addScore(state, 10);
    return {
      ...newState,
      items: newItems,
    } as DefaultGameState;
  }
  return state;
}

function loseLifeWithReset(state: DefaultGameState): DefaultGameState {
  const newState = loseLife(state) as DefaultGameState;
  if (!isGameOver(newState)) {
    return resetPlayerPosition(newState);
  }
  return newState;
}

export function updateDefaultGame(
  state: DefaultGameState,
  inputState: InputState
): DefaultGameState {
  // Clear screen at the beginning of each frame
  let newState = clearVirtualScreen(state) as DefaultGameState;

  // Handle game over state
  if (isGameOver(newState)) {
    // Check for restart input
    if (inputState.r) {
      newState = initializeDefaultGame(newState);
      // If we restarted, continue with normal game logic
      if (!isGameOver(newState)) {
        // Update movement counter for restarted game
        newState = {
          ...newState,
          movementFrameCounter: newState.movementFrameCounter + 1,
        };
        // Draw static elements and continue with game logic
        newState = drawStaticElements(newState);
      }
    } else {
      // Still game over, just render the game over screen
      newState = renderGameOverScreen(newState) as DefaultGameState;
      newState = renderStandardUI(newState) as DefaultGameState;
      return newState;
    }
  } else {
    // Update movement counter for normal gameplay
    newState = {
      ...newState,
      movementFrameCounter: newState.movementFrameCounter + 1,
    };
    // Draw static elements first
    newState = drawStaticElements(newState);
  }

  let newX = newState.playerX;
  let newY = newState.playerY;

  // Handle player movement
  if (newState.movementFrameCounter >= newState.movementInterval) {
    if (inputState.up) {
      newY--;
    } else if (inputState.down) {
      newY++;
    } else if (inputState.left) {
      newX--;
    } else if (inputState.right) {
      newX++;
    }

    if (isPassable(newX, newY)) {
      if (checkObstacleCollision(newState, newX, newY)) {
        newState = loseLifeWithReset(newState);
      } else {
        newState = collectItem(newState, newX, newY);
        newState = {
          ...newState,
          playerX: newX,
          playerY: newY,
        };
      }
    }
    newState = {
      ...newState,
      movementFrameCounter: 0,
    };
  }

  // Draw player
  newState = drawPlayer(newState);

  // Check win condition
  if (newState.items.length === 0) {
    newState = addScore(newState, 100) as DefaultGameState;
    newState = triggerGameOver(newState) as DefaultGameState;
  }

  // Render UI
  newState = renderStandardUI(newState) as DefaultGameState;

  return newState;
}

export const defaultGameOperations = {
  initializeGame: initializeDefaultGame,
  updateGame: updateDefaultGame,
};
