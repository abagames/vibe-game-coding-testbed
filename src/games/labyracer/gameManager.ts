import {
  InputState,
  VIRTUAL_SCREEN_WIDTH,
  VIRTUAL_SCREEN_HEIGHT,
} from "../../core/coreTypes.js";
import {
  drawText,
  drawCenteredText,
  clearVirtualScreen,
  playBgm,
  stopBgm,
  isGameOver,
  getScore,
  getLives,
  getHighScore,
} from "../../core/baseGame.js";
import { drawLargeText } from "../../utils/largeTextHelper.js";
import {
  LabyracerState,
  LabyracerOptions,
  createLabyracerState,
  initializeLabyracer,
  updateLabyracer,
} from "./core.js";

const GAME_FLOW_STATE_TITLE = 0;
const GAME_FLOW_STATE_DEMO = 1;
const GAME_FLOW_STATE_PLAYING = 2;
const GAME_FLOW_STATE_GAME_OVER = 3;

const GAME_OVER_SCREEN_DURATION = 300;
const GAME_OVER_INPUT_DELAY = 60;
const BLINK_INTERVAL_FRAMES = 30;
const TITLE_TO_DEMO_DELAY_FRAMES = 1800;
const DEMO_PLAY_DURATION_FRAMES = 900;
const DEMO_AI_INPUT_COOLDOWN_FRAMES = 20;

const TITLE_PHASE_INITIAL_DISPLAY = 0;
const TITLE_PHASE_MOVING_UP = 1;
const TITLE_PHASE_DEMONSTRATION = 2;
const TITLE_PHASE_WAITING_FOR_DEMO = 3;

const TITLE_INITIAL_Y = 12;
const TITLE_FINAL_Y = 4;
const TITLE_MOVE_DURATION = 120;
const DEMONSTRATION_START_DELAY = 60;
const POST_DEMO_WAIT_TIME = 180;

const DEMO_PHASE_DURATION = 120;
const DEMO_PASSAGE_Y = 16;
const DEMO_PASSAGE_START_X = 8;
const DEMO_PASSAGE_END_X = 32;
const DEMO_CAR_INITIAL_X = 10;
const DEMO_FLAG_X = 28;
const DEMO_ENEMY_X = 30;
const DEMO_SPECIAL_FLAG_X = 12;

const DEMO_PHASE_SHOW_PASSAGE = 0;
const DEMO_PHASE_MOVE_TO_FLAG = 1;
const DEMO_PHASE_COLLECT_FLAG = 2;
const DEMO_PHASE_ENEMY_SPAWN = 3;
const DEMO_PHASE_SPECIAL_FLAG_SPAWN = 4;
const DEMO_PHASE_MOVE_TO_SPECIAL_FLAG = 5;
const DEMO_PHASE_COLLECT_SPECIAL_FLAG = 6;
const DEMO_PHASE_MAZE_TRANSITION = 7;
const DEMO_PHASE_SCORE_EFFECT = 8;
const DEMO_PHASE_RESET = 9;

export type LabyracerManagerState = LabyracerState & {
  gameFlowState: number;
  titleAnimationTimer: number;
  blinkTimer: number;
  showStartMessage: boolean;
  gameOverTimer: number;
  lastScore: number;
  demoPlayTimer: number;
  titleToDemoTimer: number;
  demoCurrentInput: InputState;
  demoInputCooldown: number;
  gameTickCounter: number;
  titlePhase: number;
  titleY: number;
  titleMoveTimer: number;
  postDemoWaitTimer: number;
  demonstrationPhase: number;
  demonstrationTimer: number;
  demoCarX: number;
  demoCarDirection: number;
  demoFlagVisible: boolean;
  demoEnemyVisible: boolean;
  demoEnemyX: number;
  demoEnemyDirection: number;
  demoSpecialFlagVisible: boolean;
  demoTransitionActive: boolean;
  demoTransitionLineX: number;
  demoScoreEffectVisible: boolean;
  demoScoreEffectTimer: number;
  demoScoreEffectX: number;
  demoScoreEffectY: number;
  demoSmokeTrails: Array<{ x: number; timer: number }>;
  demoSmokeCount: number;
  demoEnemyStunned: boolean;
  demoEnemyStunnedTimer: number;
  demoEnemyStunnedDirection: number;
  demonstrationCompleted: boolean;
};

export type LabyracerManagerOptions = LabyracerOptions & {
  startInPlayingState?: boolean;
};

export function createLabyracerManagerState(
  options: LabyracerManagerOptions = {}
): LabyracerManagerState {
  const { startInPlayingState = false, ...gameOptions } = options;

  let baseGameState = createLabyracerState({
    ...gameOptions,
    gameName: "Labyracer",
  });

  if (startInPlayingState) {
    baseGameState = initializeLabyracer(baseGameState);
  }

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
    isDemoPlay: false,
    titleToDemoTimer: 0,
    demoCurrentInput: {
      action1: false,
      action2: false,
      space: false,
      enter: false,
    },
    demoInputCooldown: 0,
    gameTickCounter: 0,
    titlePhase: TITLE_PHASE_INITIAL_DISPLAY,
    titleY: TITLE_INITIAL_Y,
    titleMoveTimer: 0,
    postDemoWaitTimer: 0,
    demonstrationPhase: DEMO_PHASE_SHOW_PASSAGE,
    demonstrationTimer: 0,
    demoCarX: DEMO_CAR_INITIAL_X,
    demoCarDirection: 1,
    demoFlagVisible: true,
    demoEnemyVisible: false,
    demoEnemyX: DEMO_ENEMY_X,
    demoEnemyDirection: 1,
    demoSpecialFlagVisible: false,
    demoTransitionActive: false,
    demoTransitionLineX: 0,
    demoScoreEffectVisible: false,
    demoScoreEffectTimer: 0,
    demoScoreEffectX: 0,
    demoScoreEffectY: 0,
    demoSmokeTrails: [],
    demoSmokeCount: 0,
    demoEnemyStunned: false,
    demoEnemyStunnedTimer: 0,
    demoEnemyStunnedDirection: 1,
    demonstrationCompleted: false,
  };
}

export function initializeGameManager(
  state: LabyracerManagerState
): LabyracerManagerState {
  const newState = {
    ...state,
    gameFlowState: GAME_FLOW_STATE_TITLE,
    titleAnimationTimer: 0,
    blinkTimer: 0,
    showStartMessage: true,
    gameOverTimer: 0,

    demoPlayTimer: 0,
    isDemoPlay: false,
    titleToDemoTimer: 0,
    demoCurrentInput: {
      action1: false,
      action2: false,
      space: false,
      enter: false,
    },
    demoInputCooldown: 0,
    gameTickCounter: 0,
    titlePhase: TITLE_PHASE_INITIAL_DISPLAY,
    titleY: TITLE_INITIAL_Y,
    titleMoveTimer: 0,
    postDemoWaitTimer: 0,
    demonstrationPhase: DEMO_PHASE_SHOW_PASSAGE,
    demonstrationTimer: 0,
    demoCarX: DEMO_CAR_INITIAL_X,
    demoCarDirection: 1,
    demoFlagVisible: true,
    demoEnemyVisible: false,
    demoEnemyX: DEMO_ENEMY_X,
    demoEnemyDirection: 1,
    demoSpecialFlagVisible: false,
    demoTransitionActive: false,
    demoTransitionLineX: 0,
    demoScoreEffectVisible: false,
    demoScoreEffectTimer: 0,
    demoScoreEffectX: 0,
    demoScoreEffectY: 0,
    demoSmokeTrails: [],
    demoSmokeCount: 0,
    demoEnemyStunned: false,
    demoEnemyStunnedTimer: 0,
    demoEnemyStunnedDirection: 1,
    demonstrationCompleted: false,
  };

  return newState;
}

function updateTitleScreen(
  state: LabyracerManagerState,
  inputState: InputState
): LabyracerManagerState {
  if (
    inputState.action1 ||
    inputState.action2 ||
    inputState.space ||
    inputState.enter
  ) {
    return startGame(state);
  }

  let newState = { ...state };

  newState.titleAnimationTimer++;
  newState.blinkTimer++;

  if (newState.blinkTimer >= BLINK_INTERVAL_FRAMES) {
    newState.showStartMessage = !newState.showStartMessage;
    newState.blinkTimer = 0;
  }

  switch (newState.titlePhase) {
    case TITLE_PHASE_INITIAL_DISPLAY:
      if (newState.titleAnimationTimer >= 60) {
        newState.titlePhase = TITLE_PHASE_MOVING_UP;
        newState.titleMoveTimer = 0;
      }
      break;

    case TITLE_PHASE_MOVING_UP:
      newState.titleMoveTimer++;
      const progress = Math.min(
        newState.titleMoveTimer / TITLE_MOVE_DURATION,
        1
      );
      newState.titleY = Math.floor(
        TITLE_INITIAL_Y - (TITLE_INITIAL_Y - TITLE_FINAL_Y) * progress
      );

      if (newState.titleMoveTimer >= TITLE_MOVE_DURATION) {
        newState.titlePhase = TITLE_PHASE_DEMONSTRATION;
        newState.titleY = TITLE_FINAL_Y;
        newState.demonstrationTimer = -DEMONSTRATION_START_DELAY;
      }
      break;

    case TITLE_PHASE_DEMONSTRATION:
      newState = updateDemonstration(newState);

      if (newState.demonstrationCompleted) {
        newState.titlePhase = TITLE_PHASE_WAITING_FOR_DEMO;
        newState.postDemoWaitTimer = 0;
      }
      break;

    case TITLE_PHASE_WAITING_FOR_DEMO:
      newState.postDemoWaitTimer++;
      if (newState.postDemoWaitTimer >= POST_DEMO_WAIT_TIME) {
        newState.gameFlowState = GAME_FLOW_STATE_DEMO;
        newState.isDemoPlay = true;
        newState = initializeLabyracer(newState) as LabyracerManagerState;
        newState.demoPlayTimer = 0;
        newState.demoCurrentInput = { right: true }; // Start demo moving right
        newState.demoInputCooldown = DEMO_AI_INPUT_COOLDOWN_FRAMES;
      }
      break;
  }

  return newState;
}

function updateGameOverScreen(
  state: LabyracerManagerState,
  inputState: InputState
): LabyracerManagerState {
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
    return startGame(state);
  }

  if (newState.gameOverTimer <= 0) {
    newState.gameFlowState = GAME_FLOW_STATE_TITLE;
    newState = resetTitleAnimationStates(newState);
    newState = initializeGameManager(newState);
  }

  return newState;
}

function startGame(state: LabyracerManagerState): LabyracerManagerState {
  let newState = initializeLabyracer(state) as LabyracerManagerState;
  newState.gameFlowState = GAME_FLOW_STATE_PLAYING;
  newState.isDemoPlay = false;
  playBgm(newState);
  return newState;
}

function resetTitleAnimationStates(
  state: LabyracerManagerState
): LabyracerManagerState {
  return {
    ...state,
    titleAnimationTimer: 0,
    blinkTimer: 0,
    showStartMessage: true,
    demoPlayTimer: 0,
    isDemoPlay: false,
    titleToDemoTimer: 0,
    demoCurrentInput: {
      action1: false,
      action2: false,
      space: false,
      enter: false,
    },
    demoInputCooldown: 0,
    titlePhase: TITLE_PHASE_INITIAL_DISPLAY,
    titleY: TITLE_INITIAL_Y,
    titleMoveTimer: 0,
    postDemoWaitTimer: 0,
    demonstrationPhase: DEMO_PHASE_SHOW_PASSAGE,
    demonstrationTimer: 0,
    demoCarX: DEMO_CAR_INITIAL_X,
    demoCarDirection: 1,
    demoFlagVisible: true,
    demoEnemyVisible: false,
    demoEnemyX: DEMO_ENEMY_X,
    demoEnemyDirection: 1,
    demoSpecialFlagVisible: false,
    demoTransitionActive: false,
    demoTransitionLineX: 0,
    demoScoreEffectVisible: false,
    demoScoreEffectTimer: 0,
    demoScoreEffectX: 0,
    demoScoreEffectY: 0,
    demoSmokeTrails: [],
    demoSmokeCount: 0,
    demoEnemyStunned: false,
    demoEnemyStunnedTimer: 0,
    demoEnemyStunnedDirection: 1,
    demonstrationCompleted: false,
  };
}

function updateDemoScreen(
  state: LabyracerManagerState,
  inputState: InputState
): LabyracerManagerState {
  // Allow player to interrupt demo and start game
  if (
    inputState.action1 ||
    inputState.action2 ||
    inputState.space ||
    inputState.enter
  ) {
    return startGame(state);
  }

  let newState = { ...state };

  newState.demoPlayTimer++;
  newState.demoInputCooldown--;

  // Simple AI: Change direction randomly every cooldown period
  if (newState.demoInputCooldown <= 0) {
    newState.demoInputCooldown = DEMO_AI_INPUT_COOLDOWN_FRAMES;

    // Generate random demo input
    const directions = ["up", "down", "left", "right"] as const;
    const randomDirection =
      directions[Math.floor(Math.random() * directions.length)];

    // Clear previous input and set new direction
    newState.demoCurrentInput = {
      up: randomDirection === "up",
      down: randomDirection === "down",
      left: randomDirection === "left",
      right: randomDirection === "right",
      action1: Math.random() < 0.1, // Occasionally use smoke
      action2: false,
      space: false,
      enter: false,
      r: false,
    };
  }

  // Update the game with demo input
  newState = updateLabyracer(
    newState,
    newState.demoCurrentInput
  ) as LabyracerManagerState;

  // Check for demo timeout or game over
  if (
    isGameOver(newState) ||
    newState.demoPlayTimer > DEMO_PLAY_DURATION_FRAMES
  ) {
    // Return to title screen
    newState.gameFlowState = GAME_FLOW_STATE_TITLE;
    newState.isDemoPlay = false;
    newState = resetTitleAnimationStates(newState);
  }

  return newState;
}

export function updateGameManager(
  state: LabyracerManagerState,
  inputState: InputState
): LabyracerManagerState {
  let newState = { ...state };

  newState = {
    ...newState,
    gameTickCounter: newState.gameTickCounter + 1,
  };

  switch (newState.gameFlowState) {
    case GAME_FLOW_STATE_TITLE:
      let titleState = clearVirtualScreen(newState) as LabyracerManagerState;
      titleState = updateTitleScreen(titleState, inputState);
      titleState = renderTitleScreen(titleState);
      return titleState;

    case GAME_FLOW_STATE_DEMO:
      let demoState = updateDemoScreen(newState, inputState);
      // Render demo screen with blinking "GAME OVER" overlay
      demoState = renderDemoScreen(demoState);
      return demoState;

    case GAME_FLOW_STATE_PLAYING:
      newState = updateLabyracer(newState, inputState) as LabyracerManagerState;

      if (isGameOver(newState)) {
        newState.lastScore = getScore(newState);
        newState.gameFlowState = GAME_FLOW_STATE_GAME_OVER;
        newState.gameOverTimer = GAME_OVER_SCREEN_DURATION;
        stopBgm(newState);
      }
      return newState;

    case GAME_FLOW_STATE_GAME_OVER:
      let gameOverState = clearVirtualScreen(newState) as LabyracerManagerState;
      gameOverState = updateGameOverScreen(gameOverState, inputState);
      gameOverState = renderLabyracerManagerGameOverScreen(gameOverState);
      return gameOverState;

    default:
      return newState;
  }
}

export function renderGameManager(
  state: LabyracerManagerState
): LabyracerManagerState {
  let newState = state;

  switch (state.gameFlowState) {
    case GAME_FLOW_STATE_TITLE:
      newState = renderTitleScreen(newState);
      break;

    case GAME_FLOW_STATE_PLAYING:
      break;

    case GAME_FLOW_STATE_GAME_OVER:
      newState = renderLabyracerManagerGameOverScreen(newState);
      break;
  }

  return newState;
}

function renderTitleScreen(
  state: LabyracerManagerState
): LabyracerManagerState {
  let newState = state;

  const titleText = "LABYRACER";
  const titleStartX = Math.floor(
    (VIRTUAL_SCREEN_WIDTH - titleText.length * 4) / 2
  );
  const drawTextHelper = (
    text: string,
    x: number,
    y: number,
    attributes?: any
  ) => {
    newState = drawText(
      newState,
      text,
      x,
      y,
      attributes
    ) as LabyracerManagerState;
  };

  drawLargeText(drawTextHelper, titleText, titleStartX, state.titleY, "O", {
    color: "cyan",
  });

  if (state.titlePhase >= TITLE_PHASE_DEMONSTRATION) {
    const subtitleLine1 = "Navigate the maze and collect flags";
    const subtitleLine2 = "Use smoke to stun enemies";
    const subtitleY1 = state.titleY + 8;
    const subtitleY2 = state.titleY + 9;
    newState = drawCenteredText(newState, subtitleLine1, subtitleY1, {
      color: "white",
    }) as LabyracerManagerState;
    newState = drawCenteredText(newState, subtitleLine2, subtitleY2, {
      color: "white",
    }) as LabyracerManagerState;

    if (state.demonstrationTimer >= 0) {
      newState = renderDemonstration(newState);
    }
  }

  const lastScoreText = `SCORE ${state.lastScore}`;
  newState = drawText(newState, lastScoreText, 1, 0, {
    color: "white",
  }) as LabyracerManagerState;
  const highScoreText = `HI ${getHighScore(state)}`;
  newState = drawText(
    newState,
    highScoreText,
    VIRTUAL_SCREEN_WIDTH - highScoreText.length - 1,
    0,
    { color: "yellow" }
  ) as LabyracerManagerState;

  if (state.showStartMessage) {
    const startText = "Press SPACE/Z/X to Start";
    const startY = VIRTUAL_SCREEN_HEIGHT - 3;
    newState = drawCenteredText(newState, startText, startY, {
      color: "yellow",
    }) as LabyracerManagerState;
  }

  const controlsText = "Arrow Keys: Move  Space/Z/X: Smoke";
  const controlsY = VIRTUAL_SCREEN_HEIGHT - 2;
  newState = drawCenteredText(newState, controlsText, controlsY, {
    color: "light_black",
  }) as LabyracerManagerState;

  return newState;
}

export function isGameManagerOver(state: LabyracerManagerState): boolean {
  return state.gameFlowState === GAME_FLOW_STATE_GAME_OVER || isGameOver(state);
}

export function getGameManagerScore(state: LabyracerManagerState): number {
  return getScore(state);
}

export function getGameManagerLives(state: LabyracerManagerState): number {
  return getLives(state);
}

export function getCurrentFlowState(state: LabyracerManagerState): number {
  return state.gameFlowState;
}

function renderLabyracerManagerGameOverScreen(
  state: LabyracerManagerState
): LabyracerManagerState {
  const gameOverMessage = "Game Over!";
  const gameOverMessageY = Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2;
  const finalScoreY = gameOverMessageY + 1;

  let newState = state;

  newState = drawCenteredText(newState, gameOverMessage, gameOverMessageY, {
    color: "red",
  }) as LabyracerManagerState;

  const scoreText = `Score: ${state.score}`;
  newState = drawCenteredText(newState, scoreText, finalScoreY, {
    color: "white",
  }) as LabyracerManagerState;
  const highScore = getHighScore(state);
  if (highScore > 0) {
    const highScoreText = `High: ${highScore}`;
    const highScoreY = finalScoreY + 1;
    newState = drawCenteredText(newState, highScoreText, highScoreY, {
      color: "light_cyan",
    }) as LabyracerManagerState;
  }

  return newState;
}

export const labyracerManagerOperations = {
  initializeGame: initializeGameManager,
  updateGame: updateGameManager,
};

function renderDemoScreen(state: LabyracerManagerState): LabyracerManagerState {
  let newState = state;

  // Display blinking "GAME OVER" in the center during demo
  const shouldShowGameOver = Math.floor(newState.demoPlayTimer / 30) % 2 === 0; // Blink every 30 frames (0.5 seconds)

  if (shouldShowGameOver) {
    const gameOverText = "GAME OVER";
    newState = drawCenteredText(
      newState,
      gameOverText,
      Math.floor(VIRTUAL_SCREEN_HEIGHT / 2) - 2,
      { color: "red" }
    ) as LabyracerManagerState;
  }

  // Display demo instruction at the bottom
  const demoText = "DEMO - Press SPACE/Z/X to Play";
  newState = drawCenteredText(newState, demoText, VIRTUAL_SCREEN_HEIGHT - 3, {
    color: "yellow",
  }) as LabyracerManagerState;

  return newState;
}

function renderDemonstration(
  state: LabyracerManagerState
): LabyracerManagerState {
  let newState = state;

  // 横長の通路を描画
  for (let x = DEMO_PASSAGE_START_X; x <= DEMO_PASSAGE_END_X; x++) {
    // 通路の上下の壁
    newState = drawText(newState, "O", x, DEMO_PASSAGE_Y - 1, {
      color: "light_cyan",
    }) as LabyracerManagerState;
    newState = drawText(newState, "O", x, DEMO_PASSAGE_Y + 1, {
      color: "light_cyan",
    }) as LabyracerManagerState;

    // 通路の内部（空間）
    newState = drawText(newState, " ", x, DEMO_PASSAGE_Y, {
      color: "black",
    }) as LabyracerManagerState;
  }

  // 通路の左右の壁
  newState = drawText(
    newState,
    "O",
    DEMO_PASSAGE_START_X - 1,
    DEMO_PASSAGE_Y - 1,
    {
      color: "light_cyan",
    }
  ) as LabyracerManagerState;
  newState = drawText(newState, "O", DEMO_PASSAGE_START_X - 1, DEMO_PASSAGE_Y, {
    color: "light_cyan",
  }) as LabyracerManagerState;
  newState = drawText(
    newState,
    "O",
    DEMO_PASSAGE_START_X - 1,
    DEMO_PASSAGE_Y + 1,
    {
      color: "light_cyan",
    }
  ) as LabyracerManagerState;

  newState = drawText(
    newState,
    "O",
    DEMO_PASSAGE_END_X + 1,
    DEMO_PASSAGE_Y - 1,
    {
      color: "light_cyan",
    }
  ) as LabyracerManagerState;
  newState = drawText(newState, "O", DEMO_PASSAGE_END_X + 1, DEMO_PASSAGE_Y, {
    color: "light_cyan",
  }) as LabyracerManagerState;
  newState = drawText(
    newState,
    "O",
    DEMO_PASSAGE_END_X + 1,
    DEMO_PASSAGE_Y + 1,
    {
      color: "light_cyan",
    }
  ) as LabyracerManagerState;

  const carChar = state.demoCarDirection === 1 ? ">" : "<";
  newState = drawText(newState, carChar, state.demoCarX, DEMO_PASSAGE_Y, {
    color: "cyan",
  }) as LabyracerManagerState;
  if (state.demoFlagVisible) {
    newState = drawText(newState, "F", DEMO_FLAG_X, DEMO_PASSAGE_Y, {
      color: "yellow",
    }) as LabyracerManagerState;
  }

  if (state.demoEnemyVisible) {
    let shouldShowEnemy = true;

    if (shouldShowEnemy) {
      const enemyChar =
        state.demoEnemyDirection === 1
          ? ">"
          : state.demoEnemyDirection === 3
          ? "<"
          : state.demoEnemyDirection === 0
          ? "^"
          : "v";
      newState = drawText(
        newState,
        enemyChar,
        state.demoEnemyX,
        DEMO_PASSAGE_Y,
        {
          color: "red",
        }
      ) as LabyracerManagerState;
    }
  }

  for (const smoke of state.demoSmokeTrails) {
    let smokeChar = "*";
    let smokeColor: "white" | "light_black" = "white";

    if (smoke.timer > 40) {
      smokeChar = "*";
      smokeColor = "white";
    } else if (smoke.timer > 20) {
      smokeChar = "o";
      smokeColor = "white";
    } else {
      smokeChar = ".";
      smokeColor = "light_black";
    }

    newState = drawText(newState, smokeChar, smoke.x, DEMO_PASSAGE_Y, {
      color: smokeColor,
    }) as LabyracerManagerState;
  }

  if (state.demoSpecialFlagVisible) {
    newState = drawText(newState, "S", DEMO_SPECIAL_FLAG_X, DEMO_PASSAGE_Y, {
      color: "cyan",
    }) as LabyracerManagerState;
  }

  if (state.demoTransitionActive) {
    for (let y = DEMO_PASSAGE_Y - 1; y <= DEMO_PASSAGE_Y + 1; y++) {
      newState = drawText(newState, "|", state.demoTransitionLineX, y, {
        color: "yellow",
      }) as LabyracerManagerState;
    }
  }

  if (state.demoScoreEffectVisible) {
    newState = drawText(
      newState,
      "+100",
      state.demoScoreEffectX,
      state.demoScoreEffectY,
      {
        color: "yellow",
      }
    ) as LabyracerManagerState;
  }

  return newState;
}

function updateDemonstration(
  state: LabyracerManagerState
): LabyracerManagerState {
  let newState = { ...state };

  newState.demonstrationTimer++;

  switch (newState.demonstrationPhase) {
    case DEMO_PHASE_SHOW_PASSAGE:
      if (newState.demonstrationTimer >= DEMO_PHASE_DURATION) {
        newState.demonstrationPhase = DEMO_PHASE_MOVE_TO_FLAG;
        newState.demonstrationTimer = 0;
      }
      break;

    case DEMO_PHASE_MOVE_TO_FLAG:
      if (newState.demonstrationTimer % 8 === 0) {
        if (newState.demoCarX < DEMO_FLAG_X - 1) {
          newState.demoCarX++;
        } else {
          newState.demonstrationPhase = DEMO_PHASE_COLLECT_FLAG;
          newState.demonstrationTimer = 0;
        }
      }
      break;

    case DEMO_PHASE_COLLECT_FLAG:
      newState.demoFlagVisible = false;
      if (newState.demonstrationTimer >= 30) {
        newState.demonstrationPhase = DEMO_PHASE_ENEMY_SPAWN;
        newState.demonstrationTimer = 0;
      }
      break;

    case DEMO_PHASE_ENEMY_SPAWN:
      newState.demoEnemyVisible = true;
      if (newState.demonstrationTimer >= 60) {
        newState.demonstrationPhase = DEMO_PHASE_SPECIAL_FLAG_SPAWN;
        newState.demonstrationTimer = 0;
      }
      if (
        newState.demonstrationTimer > 30 &&
        newState.demonstrationTimer % 12 === 0
      ) {
        if (newState.demoEnemyX > newState.demoCarX + 2) {
          newState.demoEnemyX--;
          newState.demoEnemyDirection = 3;
        }
      }
      break;

    case DEMO_PHASE_SPECIAL_FLAG_SPAWN:
      newState.demoSpecialFlagVisible = true;
      if (newState.demonstrationTimer >= 60) {
        newState.demonstrationPhase = DEMO_PHASE_MOVE_TO_SPECIAL_FLAG;
        newState.demonstrationTimer = 0;
      }
      if (newState.demonstrationTimer % 12 === 0) {
        if (newState.demoEnemyX > newState.demoCarX + 2) {
          newState.demoEnemyX--;
          newState.demoEnemyDirection = 3;
        } else if (newState.demoEnemyX < newState.demoCarX - 2) {
          newState.demoEnemyX++;
          newState.demoEnemyDirection = 1;
        }
      }
      break;

    case DEMO_PHASE_MOVE_TO_SPECIAL_FLAG:
      if (newState.demonstrationTimer % 8 === 0) {
        if (newState.demoCarX > DEMO_SPECIAL_FLAG_X + 1) {
          if (newState.demoSmokeCount < 3) {
            newState.demoSmokeTrails.push({
              x: newState.demoCarX,
              timer: 60,
            });
            newState.demoSmokeCount++;
          }
          newState.demoCarX--;
          newState.demoCarDirection = 3;
        } else {
          newState.demonstrationPhase = DEMO_PHASE_COLLECT_SPECIAL_FLAG;
          newState.demonstrationTimer = 0;
        }
      }

      newState.demoSmokeTrails = newState.demoSmokeTrails
        .map((smoke) => ({ ...smoke, timer: smoke.timer - 1 }))
        .filter((smoke) => smoke.timer > 0);

      if (
        !newState.demoEnemyStunned &&
        newState.demonstrationTimer % 15 === 0
      ) {
        if (newState.demoEnemyX > newState.demoCarX + 2) {
          const nextEnemyX = newState.demoEnemyX - 1;
          const hitSmoke = newState.demoSmokeTrails.some(
            (smoke) => smoke.x === nextEnemyX
          );

          if (hitSmoke) {
            newState.demoEnemyStunned = true;
            newState.demoEnemyStunnedTimer = 0;
            newState.demoEnemyStunnedDirection = Math.random() > 0.5 ? 1 : -1;
            newState.demoSmokeTrails = newState.demoSmokeTrails.filter(
              (smoke) => smoke.x !== nextEnemyX
            );
          } else {
            newState.demoEnemyX--;
            newState.demoEnemyDirection = 3;
          }
        } else if (newState.demoEnemyX < newState.demoCarX - 2) {
          newState.demoEnemyX++;
          newState.demoEnemyDirection = 1;
        }
      }

      if (newState.demoEnemyStunned) {
        newState.demoEnemyStunnedTimer++;

        if (newState.demoEnemyStunnedTimer % 10 === 0) {
          if (newState.demoEnemyStunnedDirection > 0) {
            newState.demoEnemyDirection = (newState.demoEnemyDirection + 1) % 4;
          } else {
            newState.demoEnemyDirection = (newState.demoEnemyDirection + 3) % 4;
          }
        }

        if (newState.demoEnemyStunnedTimer >= 120) {
          newState.demoEnemyStunned = false;
          newState.demoEnemyStunnedTimer = 0;
          newState.demoEnemyDirection = 3;
        }
      }
      break;

    case DEMO_PHASE_COLLECT_SPECIAL_FLAG:
      newState.demoSpecialFlagVisible = false;
      if (newState.demonstrationTimer >= 30) {
        newState.demonstrationPhase = DEMO_PHASE_MAZE_TRANSITION;
        newState.demonstrationTimer = 0;
        newState.demoTransitionActive = true;
        newState.demoTransitionLineX = 20;
      }
      break;

    case DEMO_PHASE_MAZE_TRANSITION:
      if (newState.demonstrationTimer < 45) {
        const progress = newState.demonstrationTimer / 45;
        const startX = 20;
        const endX = DEMO_PASSAGE_END_X;
        newState.demoTransitionLineX = Math.floor(
          startX + (endX - startX) * progress
        );

        if (
          newState.demoTransitionLineX >= newState.demoEnemyX &&
          newState.demoEnemyVisible
        ) {
          newState.demoScoreEffectX = newState.demoEnemyX;
          newState.demoScoreEffectY = DEMO_PASSAGE_Y;
          newState.demoEnemyVisible = false;
          newState.demoScoreEffectVisible = true;
          newState.demoScoreEffectTimer = 0;
        }
      } else {
        newState.demoTransitionActive = false;
        newState.demonstrationPhase = DEMO_PHASE_SCORE_EFFECT;
        newState.demonstrationTimer = 0;
      }
      break;

    case DEMO_PHASE_SCORE_EFFECT:
      newState.demoScoreEffectTimer++;
      if (newState.demonstrationTimer >= 120) {
        newState.demonstrationPhase = DEMO_PHASE_RESET;
        newState.demonstrationTimer = 0;
      }
      break;

    case DEMO_PHASE_RESET:
      if (newState.demonstrationTimer >= 60) {
        newState.demonstrationCompleted = true;
      }
      break;
  }

  return newState;
}
