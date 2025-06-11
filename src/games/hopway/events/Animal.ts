import { cglColor } from "../../../core/coreTypes";

export interface Animal {
  id: number;
  type: "DEER" | "TURTLE";
  x: number;
  y: number;
  char: string;
  color: cglColor;
  speed: number;
  ticksUntilNextMove: number;
  direction: 1 | -1;
  isSpooked: boolean;
}
