import { HopwayGame } from "../core";
import { InputState } from "../../../core/coreTypes";
import { GameEvent } from "./GameEvent";
// import { v4 as uuidv4 } from 'uuid'; // Using a simpler ID generator for now

let nextEventId = 0;
function generateUniqueEventId(): string {
  return `event_${nextEventId++}`;
}

interface EffectZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RegisteredEvent {
  eventType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory: (...args: any[]) => GameEvent; // Function to create an instance of the event
  probability: number; // Chance to trigger per check (0.0 to 1.0)
  cooldownTicks: number; // Minimum ticks between triggers of this event type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factoryArgs?: any[]; // Optional arguments to pass to the event factory
}

export class EventManager {
  private activeEvents: GameEvent[] = [];
  private registeredEventTypes: RegisteredEvent[] = [];
  private eventCooldowns: Map<string, number> = new Map();
  private effectZones: Map<string, { zones: EffectZone[]; type: string }> =
    new Map();
  private game: HopwayGame;
  private lastEventCheckTick: number = 0;
  private readonly eventCheckInterval: number = 5; // Check to trigger new event every N ticks

  constructor(game: HopwayGame) {
    this.game = game;
    nextEventId = 0;
  }

  /**
   * Calculate the maximum number of concurrent events based on game time.
   * Assumes 60 ticks per second (60 FPS).
   * 1st minute: max 1 event
   * 2nd minute: max 2 events
   * ... up to 5th minute: max 5 events
   * After 5 minutes: stays at max 5 events
   */
  private getMaxConcurrentEvents(): number {
    const ticksPerSecond = 60;
    const ticksPerMinute = ticksPerSecond * 60;
    const currentMinute =
      Math.floor(this.game.gameTickCounter / ticksPerMinute) + 1;
    return Math.min(currentMinute, 5);
  }

  /**
   * Registers a type of event that can be triggered in the game.
   */
  public registerEventType(
    eventType: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    factory: (...args: any[]) => GameEvent,
    probability: number,
    cooldownTicks: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    factoryArgs?: any[]
  ): void {
    const registration: RegisteredEvent = {
      eventType,
      factory,
      probability,
      cooldownTicks,
      factoryArgs,
    };

    if (
      this.registeredEventTypes.some(
        (e) => e.eventType === registration.eventType
      )
    ) {
      console.warn(
        `Event type "${registration.eventType}" is already registered. Skipping.`
      );
      return;
    }
    this.registeredEventTypes.push(registration);
    console.log(
      `EventManager: Registered event type "${registration.eventType}"`
    );
    this.eventCooldowns.set(registration.eventType, 0); // Initialize cooldown
  }

  public update(inputState: InputState): void {
    const eventsToKeep: GameEvent[] = [];

    // Update all active events
    for (const event of this.activeEvents) {
      if (!event.isActive) continue;

      event.update(this.game, inputState);
      event.elapsedTicks++;

      if (event.isFinished()) {
        console.log(
          `EventManager: Event "${event.type}" (ID: ${event.id}) finished.`
        );
        event.end(this.game);
        event.isActive = false; // Mark for removal

        // Set the cooldown to start from the current tick
        const registration = this.registeredEventTypes.find(
          (r) => r.eventType === event.type
        );
        if (registration) {
          this.eventCooldowns.set(
            registration.eventType,
            this.game.gameTickCounter + registration.cooldownTicks
          );
        }
      } else {
        eventsToKeep.push(event);
      }
    }
    this.activeEvents = eventsToKeep;

    // Try to trigger a new event periodically
    if (
      this.game.gameTickCounter - this.lastEventCheckTick >
      this.eventCheckInterval
    ) {
      this.tryToTriggerEvent();
      this.lastEventCheckTick = this.game.gameTickCounter;
    }
  }

  private getRegisteredEventType(
    eventType: string
  ): RegisteredEvent | undefined {
    return this.registeredEventTypes.find((e) => e.eventType === eventType);
  }

  private tryToTriggerEvent(): void {
    // Check if we've reached the maximum concurrent events limit
    const maxConcurrentEvents = this.getMaxConcurrentEvents();
    const currentActiveEvents = this.activeEvents.filter(
      (e) => e.isActive
    ).length;

    if (currentActiveEvents >= maxConcurrentEvents) {
      return; // Already at maximum concurrent events for current time
    }

    const availableEvents = this.registeredEventTypes.filter((reg) => {
      // Check if an event of this type is already active
      const isTypeActive = this.activeEvents.some(
        (event) => event.isActive && event.type === reg.eventType
      );
      if (isTypeActive) {
        return false;
      }

      const cooldownFinishTick = this.eventCooldowns.get(reg.eventType) || 0;
      return this.game.gameTickCounter >= cooldownFinishTick;
    });

    if (availableEvents.length === 0) {
      return; // All event types are on cooldown
    }

    // Simple probability check for now
    for (const registration of availableEvents) {
      if (Math.random() < registration.probability) {
        console.log(
          `EventManager: Triggering new event "${registration.eventType}" (${
            currentActiveEvents + 1
          }/${maxConcurrentEvents} concurrent events)`
        );
        const newEvent = registration.factory(
          ...(registration.factoryArgs || [])
        );
        (newEvent as any).id = generateUniqueEventId();
        (newEvent as any).type = registration.eventType;

        newEvent.start(this.game);
        if (newEvent.isActive) {
          this.activeEvents.push(newEvent);
        }
        // Not setting cooldown here, but after event ENDS
        break; // Trigger only one event per check
      }
    }
  }

  public drawActiveEvents(): void {
    for (const event of this.activeEvents) {
      if (event.isActive && event.draw) {
        event.draw(this.game);
      }
    }
  }

  public getActiveEventMessage(): string | null {
    // Iterate backwards to find the newest event with a message
    for (let i = this.activeEvents.length - 1; i >= 0; i--) {
      const event = this.activeEvents[i];
      if (event.isActive && event.getDisplayMessage) {
        const message = event.getDisplayMessage();
        if (message) {
          return message;
        }
      }
    }
    return null;
  }

  reset(): void {
    console.log("EventManager: Resetting active events and cooldowns.");
    for (const event of this.activeEvents) {
      if (event.isActive) {
        event.end(this.game);
      }
    }
    this.activeEvents = [];
    this.eventCooldowns.clear();
    this.effectZones.clear();
    for (const regEvent of this.registeredEventTypes) {
      this.eventCooldowns.set(regEvent.eventType, 0);
    }
    this.lastEventCheckTick = 0;
    nextEventId = 0; // Reset global event ID counter
  }

  public forceStartEvent(eventType: string): void {
    const registration = this.getRegisteredEventType(eventType);
    if (!registration) {
      console.warn(
        `EventManager: Event type "${eventType}" is not registered.`
      );
      return;
    }

    // Check if an event of this type is already active
    const isTypeActive = this.activeEvents.some(
      (event) => event.isActive && event.type === eventType
    );
    if (isTypeActive) {
      console.warn(
        `EventManager: Event type "${eventType}" is already active.`
      );
      return;
    }

    console.log(
      `EventManager: Force-triggering event "${registration.eventType}"`
    );
    const newEvent = registration.factory(...(registration.factoryArgs || []));
    (newEvent as any).id = generateUniqueEventId();
    (newEvent as any).type = registration.eventType;

    newEvent.start(this.game);
    if (newEvent.isActive) {
      this.activeEvents.push(newEvent);
    }
  }

  public manuallyTriggerEvent(event: GameEvent): void {
    // This is intended for debugging and simulation scripting
    (event as any).id = generateUniqueEventId();
    (event as any).type = event.type || "MANUAL_EVENT"; // Ensure type is set
    event.start(this.game);
  }

  forceEndEvent(eventType?: string): void {
    const eventsToEnd = eventType
      ? this.activeEvents.filter(
          (event) => event.type === eventType && event.isActive
        )
      : [...this.activeEvents.filter((event) => event.isActive)];

    for (const event of eventsToEnd) {
      console.log(
        `EventManager: Forcefully ending event "${event.type}" (ID: ${event.id}).`
      );
      event.end(this.game);
      event.isActive = false;
    }
  }

  public getActiveEventByType(eventType: string): GameEvent | undefined {
    return this.activeEvents.find(
      (event) => event.type === eventType && event.isActive
    );
  }

  // --- Effect Zone Management ---

  public registerEffectZones(
    ownerId: string,
    type: string,
    zones: EffectZone[]
  ): void {
    this.effectZones.set(ownerId, { zones, type });
  }

  public unregisterEffectZones(ownerId: string): void {
    this.effectZones.delete(ownerId);
  }

  public getEffectAt(x: number, y: number): string | null {
    const checkX = Math.floor(x);
    const checkY = Math.floor(y);

    for (const [, { zones, type }] of this.effectZones) {
      for (const zone of zones) {
        if (
          checkX >= zone.x &&
          checkX < zone.x + zone.width &&
          checkY >= zone.y &&
          checkY < zone.y + zone.height
        ) {
          return type;
        }
      }
    }
    return null;
  }

  public getActiveEvents(): GameEvent[] {
    return this.activeEvents;
  }
}
