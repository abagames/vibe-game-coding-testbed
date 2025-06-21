import {
  CellAttributes,
  CellInfo,
  GridData,
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  AudioService,
  SoundEffectType,
  BaseGameOptions,
} from "./coreTypes.js";

const EMPTY_CELL: CellInfo = Object.freeze({ char: " ", attributes: {} });

export type BaseGameState = {
  virtualScreen: GridData;
  score: number;
  lives: number;
  gameOverState: boolean;
  initialLives: number;
  isDemoPlay: boolean;
  audioService?: AudioService;
  gameTickCounter: number;

  // High score options
  gameName?: string;
  enableHighScoreStorage: boolean;
  isBrowserEnvironment: boolean;
  internalHighScore: number;
};

export type GameOperations = {
  initializeGame: (state: BaseGameState) => BaseGameState;
  updateGame: (state: BaseGameState, inputState: InputState) => BaseGameState;
};

export function createBaseGame(options: BaseGameOptions = {}): BaseGameState {
  const {
    initialLives = 3,
    isDemoPlay = false,
    audioService,
    gameName,
    enableHighScoreStorage = false,
    isBrowserEnvironment = false,
  } = options;

  const state: BaseGameState = {
    virtualScreen: initializeVirtualScreen(),
    score: 0,
    lives: initialLives,
    gameOverState: false,
    initialLives,
    isDemoPlay,
    audioService,
    gameTickCounter: 0,
    gameName,
    enableHighScoreStorage,
    isBrowserEnvironment,
    internalHighScore: 0,
  };

  return state;
}

function initializeVirtualScreen(): GridData {
  const screen: GridData = [];
  for (let y = 0; y < VIRTUAL_SCREEN_HEIGHT; y++) {
    const row: CellInfo[] = [];
    for (let x = 0; x < VIRTUAL_SCREEN_WIDTH; x++) {
      row.push(EMPTY_CELL);
    }
    screen.push(row);
  }
  return screen;
}

export function clearVirtualScreen(state: BaseGameState): BaseGameState {
  const newScreen = state.virtualScreen.map((row) => row.map(() => EMPTY_CELL));
  return {
    ...state,
    virtualScreen: newScreen,
  };
}

export function drawText(
  state: BaseGameState,
  text: string,
  _x: number,
  _y: number,
  attributes?: CellAttributes
): BaseGameState {
  const x = Math.floor(_x);
  const y = Math.floor(_y);

  if (y < 0 || y >= VIRTUAL_SCREEN_HEIGHT) {
    return state;
  }

  const newScreen = [...state.virtualScreen];
  const targetRow = [...newScreen[y]];

  let modified = false;
  for (let i = 0; i < text.length; i++) {
    const currentX = x + i;
    if (currentX < 0 || currentX >= VIRTUAL_SCREEN_WIDTH) {
      continue;
    }
    targetRow[currentX] = {
      char: text[i],
      attributes: { ...attributes },
    };
    modified = true;
  }

  if (!modified) {
    return state;
  }

  newScreen[y] = targetRow;

  return {
    ...state,
    virtualScreen: newScreen,
  };
}

export function drawCenteredText(
  state: BaseGameState,
  text: string,
  y: number,
  attributes?: CellAttributes
): BaseGameState {
  const startX = Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - text.length / 2);
  return drawText(state, text, startX, y, attributes);
}

export type TextDrawCommand = {
  text: string;
  x: number;
  y: number;
  attributes?: CellAttributes;
};

export function drawTextBatch(
  state: BaseGameState,
  commands: TextDrawCommand[]
): BaseGameState {
  if (commands.length === 0) {
    return state;
  }

  const modifiedRows = new Set<number>();
  const validCommands: TextDrawCommand[] = [];

  for (const cmd of commands) {
    const y = Math.floor(cmd.y);
    if (y >= 0 && y < VIRTUAL_SCREEN_HEIGHT) {
      modifiedRows.add(y);
      validCommands.push({ ...cmd, y });
    }
  }

  if (validCommands.length === 0) {
    return state;
  }

  const newScreen = [...state.virtualScreen];
  const copiedRows = new Map<number, CellInfo[]>();

  for (const rowIndex of modifiedRows) {
    copiedRows.set(rowIndex, [...newScreen[rowIndex]]);
  }

  for (const cmd of validCommands) {
    const x = Math.floor(cmd.x);
    const y = cmd.y;
    const row = copiedRows.get(y)!;

    for (let i = 0; i < cmd.text.length; i++) {
      const currentX = x + i;
      if (currentX >= 0 && currentX < VIRTUAL_SCREEN_WIDTH) {
        row[currentX] = {
          char: cmd.text[i],
          attributes: { ...cmd.attributes },
        };
      }
    }
  }

  for (const [rowIndex, row] of copiedRows) {
    newScreen[rowIndex] = row;
  }

  return {
    ...state,
    virtualScreen: newScreen,
  };
}

export function renderStandardUI(state: BaseGameState): BaseGameState {
  return drawTextBatch(state, [
    {
      text: `Score: ${state.score}`,
      x: 1,
      y: 0,
      attributes: { color: "white" },
    },
    {
      text: `Lives: ${state.lives}`,
      x: 31,
      y: 0,
      attributes: { color: "white" },
    },
    {
      text: "R: Restart",
      x: 1,
      y: VIRTUAL_SCREEN_HEIGHT - 1,
      attributes: { color: "light_black" },
    },
  ]);
}

export function renderGameOverScreen(state: BaseGameState): BaseGameState {
  const gameOverMessage = "Game Over!";
  const gameOverMessageY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2;
  const finalScoreY = gameOverMessageY + 1;
  const highScore = getHighScore(state);

  const drawCommands: TextDrawCommand[] = [
    {
      text: gameOverMessage,
      x: Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - gameOverMessage.length / 2),
      y: gameOverMessageY,
      attributes: { color: "red" },
    },
    {
      text: `Score: ${state.score}`,
      x: Math.floor(
        VIRTUAL_SCREEN_WIDTH / 2 - `Score: ${state.score}`.length / 2
      ),
      y: finalScoreY,
      attributes: { color: "white" },
    },
  ];

  if (highScore > 0) {
    const highScoreText = `High: ${highScore}`;
    const highScoreY = finalScoreY + 1;
    drawCommands.push({
      text: highScoreText,
      x: Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - highScoreText.length / 2),
      y: highScoreY,
      attributes: { color: "light_cyan" },
    });
  }

  const restartPromptY =
    highScore > 0
      ? Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) + 2
      : Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) + 1;
  const restartText = "Press R to restart";
  drawCommands.push({
    text: restartText,
    x: Math.floor(VIRTUAL_SCREEN_WIDTH / 2 - restartText.length / 2),
    y: restartPromptY,
    attributes: { color: "white" },
  });

  return drawTextBatch(state, drawCommands);
}

export function getCellInfo(
  state: BaseGameState,
  x: number,
  y: number
): CellInfo | null {
  if (
    x < 0 ||
    x >= VIRTUAL_SCREEN_WIDTH ||
    y < 0 ||
    y >= VIRTUAL_SCREEN_HEIGHT
  ) {
    return null;
  }
  return state.virtualScreen[y][x];
}

export function addScore(state: BaseGameState, value: number): BaseGameState {
  const newScore = state.score + value;
  return {
    ...state,
    score: newScore,
    internalHighScore: Math.max(state.internalHighScore, newScore),
  };
}

export function loseLife(state: BaseGameState): BaseGameState {
  const newLives = state.lives - 1;
  const newState = {
    ...state,
    lives: newLives,
  };

  if (newLives <= 0) {
    return triggerGameOver({ ...newState, lives: 0 });
  }

  return newState;
}

export function gainLife(
  state: BaseGameState,
  count: number = 1
): BaseGameState {
  if (count <= 0) return state;

  const newLives = state.lives + count;
  console.log(
    `BaseGame: Gained ${count} life/lives. Current lives: ${newLives}`
  );

  return {
    ...state,
    lives: newLives,
  };
}

export function triggerGameOver(state: BaseGameState): BaseGameState {
  const newState = {
    ...state,
    gameOverState: true,
  };

  // High score storage is now handled by browserHelper
  return newState;
}

export function setIsDemoPlay(
  state: BaseGameState,
  isDemo: boolean
): BaseGameState {
  return {
    ...state,
    isDemoPlay: isDemo,
  };
}

export function playSoundEffect(
  state: BaseGameState,
  sound: SoundEffectType,
  seed?: number
): void {
  if (!state.isDemoPlay && state.audioService) {
    state.audioService.playSoundEffect(sound, seed);
  }
}

export function playMml(state: BaseGameState, mml: string | string[]): void {
  if (!state.isDemoPlay && state.audioService) {
    state.audioService.playMml(mml);
  }
}

export function playBgm(state: BaseGameState): void {
  if (!state.isDemoPlay && state.audioService) {
    state.audioService.startPlayingBgm();
  }
}

export function stopBgm(state: BaseGameState): void {
  if (!state.isDemoPlay && state.audioService) {
    state.audioService.stopPlayingBgm();
  }
}

// High score localStorage operations moved to browserHelper.ts

export function getHighScore(state: BaseGameState): number {
  return state.internalHighScore;
}

export function getScore(state: BaseGameState): number {
  return state.score;
}

export function getLives(state: BaseGameState): number {
  return state.lives;
}

export function isGameOver(state: BaseGameState): boolean {
  return state.gameOverState;
}

export function getVirtualScreenData(state: BaseGameState): GridData {
  return state.virtualScreen;
}

export function updateBaseGame(
  state: BaseGameState,
  inputState: InputState,
  operations: GameOperations
): BaseGameState {
  let newState = {
    ...state,
    gameTickCounter: state.gameTickCounter + 1,
  };

  if (isGameOver(newState) && inputState.r) {
    newState = operations.initializeGame(newState);
  }

  newState = clearVirtualScreen(newState);
  if (!isGameOver(newState)) {
    newState = operations.updateGame(newState, inputState);
  } else {
    newState = renderGameOverScreen(newState);
  }

  newState = renderStandardUI(newState);
  return newState;
}
