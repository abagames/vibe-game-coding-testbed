import { AudioService, SoundEffectType } from "../core/coreTypes.js";

// Node.js audio service functions (no-op implementations)
export function playSoundEffect(sound: SoundEffectType, seed?: number): void {
  // No-op for Node.js environment
}

export function playMml(mml: string | string[]): void {
  // No-op for Node.js environment
}

export function startPlayingBgm(): void {
  // No-op for Node.js environment
}

export function stopPlayingBgm(): void {
  // No-op for Node.js environment
}

// Create Node.js audio service object
export function createNodeAudioService(): AudioService {
  return {
    playSoundEffect,
    playMml,
    startPlayingBgm,
    stopPlayingBgm,
  };
}
