export type cglColor =
  | "black"
  | "white"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "purple"
  | "cyan"
  | "light_black"
  | "light_red"
  | "light_green"
  | "light_blue"
  | "light_yellow"
  | "light_purple"
  | "light_cyan";

export interface CellAttributes {
  color?: cglColor;
  backgroundColor?: cglColor;
  entityType?: string; // e.g., 'player', 'wall', 'item', 'enemy'
  entityId?: string; // Unique ID for an entity instance
  isPassable?: boolean; // For collision detection
  blink?: boolean; // Add blink property for flashing text/effects
  // Add other attributes as needed
}

export interface CellInfo {
  char: string;
  attributes: CellAttributes;
}

export interface InputState {
  up?: boolean;
  down?: boolean;
  left?: boolean;
  right?: boolean;
  action1?: boolean; // Generic action button 1 (X, Slash, Space)
  action2?: boolean; // Generic action button 2 (Z, Period, Enter)
  enter?: boolean;
  space?: boolean;
  escape?: boolean;
  r?: boolean;
  period?: boolean;
  slash?: boolean;
  // Add other input states as needed
}

// Represents the 40x25 grid
export type GridData = CellInfo[][];

export const VIRTUAL_SCREEN_WIDTH = 40;
export const VIRTUAL_SCREEN_HEIGHT = 25;

export type SoundEffectType =
  | "coin"
  | "laser"
  | "explosion"
  | "powerUp"
  | "hit"
  | "jump"
  | "select"
  | "random"
  | "click"
  | "synth"
  | "tone";
// NOTE: This is a placeholder. Actual values should match crisp-game-lib's SoundEffectType

export interface BaseGameOptions {
  initialLives?: number; // Default: 3
  isDemoPlay?: boolean; // Default: false. If true, disables sound and other features for automated testing or demonstration.
  audioService?: AudioService; // Optional audio service for sound and music
  audioQuantize?: number; // Optional audio quantize value for sound and music

  // High score related options
  gameName?: string; // Name of the game, used for high score storage key
  enableHighScoreStorage?: boolean; // Default: false. If true, enables localStorage for high scores.
  isBrowserEnvironment?: boolean; // Default: false. Must be true to enable localStorage.
}

export type AudioService = {
  playSoundEffect(sound: SoundEffectType, seed?: number): void;
  playMml(mml: string | string[]): void;
  startPlayingBgm(): void;
  stopPlayingBgm(): void;
};

export type GameCore = {
  initializeGame(): void;
  update(inputState: InputState): void;
  getVirtualScreenData(): GridData;
  getScore(): number;
  getLives(): number;
  isGameOver(): boolean;
  drawText(
    text: string,
    x: number,
    y: number,
    attributes?: CellAttributes
  ): void;
  getCellInfo(x: number, y: number): CellInfo | null;
};
