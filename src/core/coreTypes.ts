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
  | "light_white"
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
  action1?: boolean; // Generic action button
  // Add other input states as needed
}

// Represents the 40x25 grid
export type GridData = CellInfo[][];

export const VIRTUAL_SCREEN_WIDTH = 40;
export const VIRTUAL_SCREEN_HEIGHT = 25;

export interface GameCore {
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
}
