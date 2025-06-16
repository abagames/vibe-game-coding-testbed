import {
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
  BaseGameOptions,
} from "../../core/coreTypes.js";
import {
  drawText,
  drawCenteredText,
  renderStandardUI,
  renderGameOverScreen,
  clearVirtualScreen,
  playBgm,
  stopBgm,
  isGameOver,
  getScore,
  getLives,
  getHighScore,
} from "../../core/baseGame.js";
import {
  DefaultGameState,
  createDefaultGameState,
  initializeDefaultGame,
  updateDefaultGame,
} from "./core.js";

// Game flow state constants
const GAME_FLOW_STATE_TITLE = 0;
const GAME_FLOW_STATE_PLAYING = 1;
const GAME_FLOW_STATE_GAME_OVER = 2;

export type DefaultGameManagerState = DefaultGameState & {
  gameFlowState: number;
  titleAnimationTimer: number;
  blinkTimer: number;
  showStartMessage: boolean;
  gameOverTimer: number;
  lastScore: number;
  demoPlayTimer: number;
  isDemoMode: boolean;
};

export type DefaultGameManagerOptions = BaseGameOptions & {
  movementInterval?: number;
  obstacleCount?: number;
  itemCount?: number;
  startInPlayingState?: boolean;
};

const GAME_OVER_SCREEN_DURATION = 300;
const GAME_OVER_INPUT_DELAY = 60;
const BLINK_INTERVAL_FRAMES = 30;

export function createDefaultGameManagerState(
  options: DefaultGameManagerOptions = {}
): DefaultGameManagerState {
  const { startInPlayingState = false, ...gameOptions } = options;

  const baseGameState = createDefaultGameState({
    ...gameOptions,
    gameName: "Default Game",
  });

  const initialFlowState = startInPlayingState
    ? GAME_FLOW_STATE_PLAYING
    : GAME_FLOW_STATE_TITLE;

  return {
    ...baseGameState,
    gameFlowState: initialFlowState,
    titleAnimationTimer: 0,
    blinkTimer: 0,
    showStartMessage: true,
    gameOverTimer: 0,
    lastScore: 0,
    demoPlayTimer: 0,
    isDemoMode: false,
  };
}

export function initializeGameManager(
  state: DefaultGameManagerState
): DefaultGameManagerState {
  let newState = initializeDefaultGame(state) as DefaultGameManagerState;

  newState = {
    ...newState,
    gameFlowState: GAME_FLOW_STATE_TITLE,
    titleAnimationTimer: 0,
    blinkTimer: 0,
    showStartMessage: true,
    gameOverTimer: 0,
    lastScore: 0,
    demoPlayTimer: 0,
    isDemoMode: false,
  };

  return newState;
}

function updateTitleScreen(
  state: DefaultGameManagerState,
  inputState: InputState
): DefaultGameManagerState {
  if (
    inputState.action1 ||
    inputState.action2 ||
    inputState.space ||
    inputState.enter
  ) {
    return startGameFromTitle(state);
  }

  let newState = { ...state };

  newState.titleAnimationTimer++;
  newState.blinkTimer++;

  if (newState.blinkTimer >= BLINK_INTERVAL_FRAMES) {
    newState.showStartMessage = !newState.showStartMessage;
    newState.blinkTimer = 0;
  }

  if (!newState.isDemoMode) {
    newState.isDemoMode = true;
    newState.demoPlayTimer = 0;
    newState = initializeDefaultGame(newState) as DefaultGameManagerState;
  }

  if (newState.isDemoMode) {
    newState.demoPlayTimer++;

    const demoInput: InputState = {
      up: newState.demoPlayTimer % 120 === 0,
      down: newState.demoPlayTimer % 160 === 0,
      left: newState.demoPlayTimer % 140 === 0,
      right: newState.demoPlayTimer % 180 === 0,
      action1: false,
      action2: false,
      space: false,
      enter: false,
      r: false,
    };

    newState = updateDefaultGame(
      newState,
      demoInput
    ) as DefaultGameManagerState;

    if (isGameOver(newState)) {
      newState = initializeDefaultGame(newState) as DefaultGameManagerState;
      newState.isDemoMode = true;
      newState.demoPlayTimer = 0;
    }
  }

  return newState;
}

function updateGameOverScreen(
  state: DefaultGameManagerState,
  inputState: InputState
): DefaultGameManagerState {
  let newState = { ...state };
  newState.gameOverTimer--;

  const inputDelayExpired =
    GAME_OVER_SCREEN_DURATION - newState.gameOverTimer >= GAME_OVER_INPUT_DELAY;

  if (
    inputDelayExpired &&
    (inputState.action1 ||
      inputState.action2 ||
      inputState.space ||
      inputState.enter)
  ) {
    return startGameFromTitle(state);
  }

  if (newState.gameOverTimer <= 0) {
    newState.gameFlowState = GAME_FLOW_STATE_TITLE;
    newState = resetTitleAnimationStates(newState);
    newState = initializeGameManager(newState);
  }

  return newState;
}

function startGameFromTitle(
  state: DefaultGameManagerState
): DefaultGameManagerState {
  let newState = initializeDefaultGame(state) as DefaultGameManagerState;
  newState.gameFlowState = GAME_FLOW_STATE_PLAYING;
  newState.isDemoMode = false;

  playBgm(newState);

  return newState;
}

function resetTitleAnimationStates(
  state: DefaultGameManagerState
): DefaultGameManagerState {
  return {
    ...state,
    titleAnimationTimer: 0,
    blinkTimer: 0,
    showStartMessage: true,
    demoPlayTimer: 0,
    isDemoMode: false,
  };
}

export function updateGameManager(
  state: DefaultGameManagerState,
  inputState: InputState
): DefaultGameManagerState {
  let newState = clearVirtualScreen(state) as DefaultGameManagerState;

  newState = {
    ...newState,
    gameTickCounter: newState.gameTickCounter + 1,
  };

  if (inputState.r && newState.gameFlowState !== GAME_FLOW_STATE_TITLE) {
    return initializeGameManager(newState);
  }

  switch (newState.gameFlowState) {
    case GAME_FLOW_STATE_TITLE:
      newState = updateTitleScreen(newState, inputState);
      break;

    case GAME_FLOW_STATE_PLAYING:
      newState = updateDefaultGame(
        newState,
        inputState
      ) as DefaultGameManagerState;

      if (isGameOver(newState)) {
        newState.lastScore = getScore(newState);
        newState.gameFlowState = GAME_FLOW_STATE_GAME_OVER;
        newState.gameOverTimer = GAME_OVER_SCREEN_DURATION;
        stopBgm(newState);
      }
      break;

    case GAME_FLOW_STATE_GAME_OVER:
      newState = updateGameOverScreen(newState, inputState);
      break;
  }

  newState = renderGameManager(newState);

  return newState;
}

export function renderGameManager(
  state: DefaultGameManagerState
): DefaultGameManagerState {
  let newState = state;

  switch (state.gameFlowState) {
    case GAME_FLOW_STATE_TITLE:
      newState = renderTitleScreen(newState);
      break;

    case GAME_FLOW_STATE_PLAYING:
      newState = renderStandardUI(newState) as DefaultGameManagerState;
      break;

    case GAME_FLOW_STATE_GAME_OVER:
      newState = renderGameOverScreen(newState) as DefaultGameManagerState;
      break;
  }

  return newState;
}

function renderTitleScreen(
  state: DefaultGameManagerState
): DefaultGameManagerState {
  let newState = state;

  const titleText = "DEFAULT GAME";
  const titleY = 3;
  newState = drawCenteredText(newState, titleText, titleY, {
    color: "cyan",
  }) as DefaultGameManagerState;

  const subtitleLine1 = "Collect all items ($)";
  const subtitleLine2 = "and avoid obstacles (*)";
  const subtitleY1 = 5;
  const subtitleY2 = 6;
  newState = drawCenteredText(newState, subtitleLine1, subtitleY1, {
    color: "white",
  }) as DefaultGameManagerState;
  newState = drawCenteredText(newState, subtitleLine2, subtitleY2, {
    color: "white",
  }) as DefaultGameManagerState;

  const lastScoreText = `SCORE ${state.lastScore}`;
  newState = drawText(newState, lastScoreText, 1, 0, {
    color: "white",
  }) as DefaultGameManagerState;

  const highScoreText = `HI ${getHighScore(state)}`;
  newState = drawText(
    newState,
    highScoreText,
    VIRTUAL_SCREEN_WIDTH - highScoreText.length - 1,
    0,
    { color: "yellow" }
  ) as DefaultGameManagerState;

  if (state.showStartMessage) {
    const startText = "Press SPACE/Z/X to Start";
    const startY = VIRTUAL_SCREEN_HEIGHT - 3;
    newState = drawCenteredText(newState, startText, startY, {
      color: "yellow",
    }) as DefaultGameManagerState;
  }

  const controlsText = "Arrow Keys: Move • R: Restart";
  const controlsY = VIRTUAL_SCREEN_HEIGHT - 2;
  newState = drawCenteredText(newState, controlsText, controlsY, {
    color: "light_black",
  }) as DefaultGameManagerState;

  return newState;
}

export function isGameManagerOver(state: DefaultGameManagerState): boolean {
  return state.gameFlowState === GAME_FLOW_STATE_GAME_OVER || isGameOver(state);
}

export function getGameManagerScore(state: DefaultGameManagerState): number {
  return getScore(state);
}

export function getGameManagerLives(state: DefaultGameManagerState): number {
  return getLives(state);
}

export function getCurrentFlowState(state: DefaultGameManagerState): number {
  return state.gameFlowState;
}

export const defaultGameManagerOperations = {
  initializeGame: initializeGameManager,
  updateGame: updateGameManager,
};
