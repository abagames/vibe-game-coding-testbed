import { InputState, cglColor } from "../../../core/coreTypes";
import { HopwayGame } from "../core";

/**
 * Defines the contract for all special game events in Hopway.
 */
export interface GameEvent {
  /** A unique identifier for this specific instance of the event. */
  id: string;
  /** A string indicating the type of event (e.g., "TRAFFIC_JAM", "EMERGENCY_VEHICLE"). */
  type: string;
  /** Flag indicating if the event is currently active and influencing the game. */
  isActive: boolean;
  /** The total duration of the event in game ticks. Can be Infinity for indefinite events. */
  durationTicks?: number;
  /** The number of game ticks this event has been active. */
  elapsedTicks: number;

  /**
   * Called once when the event starts.
   * Use this to initialize the event's effects on the game state.
   * @param game The HopwayGame instance.
   */
  start(game: HopwayGame): void;

  /**
   * Called every game tick while the event is active.
   * Use this to update the event's state and ongoing effects.
   * @param game The HopwayGame instance.
   * @param inputState The current input state (rarely used by events directly, but available).
   */
  update(game: HopwayGame, inputState: InputState): void;

  /**
   * Called once when the event ends (either by duration or explicit termination).
   * Use this to clean up any changes made by the event and restore normal game state.
   * @param game The HopwayGame instance.
   */
  end(game: HopwayGame): void;

  /**
   * Checks if the event has completed its lifecycle (e.g., duration expired).
   * @returns True if the event is finished, false otherwise.
   */
  isFinished(): boolean;

  /**
   * Optional method for events that need to draw custom visual elements on the screen.
   * This is called by the EventManager after the main game elements are drawn.
   * @param game The HopwayGame instance, providing drawing context.
   */
  draw?(game: HopwayGame): void;

  /**
   * Optional method for events that should display a persistent message in the UI.
   * The message from the most recently started, active event will be shown.
   * @returns A string to display, or null if no message should be shown.
   */
  getDisplayMessage?(): string | null;
}
