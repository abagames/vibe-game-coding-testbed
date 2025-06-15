import { AudioService, SoundEffectType } from "../core/coreTypes.js";
import {
  playSoundEffect as playSoundEffectFromHelper,
  playMml as playMmlFromHelper,
  startPlayingBgm as startPlayingBgmFromHelper,
  stopPlayingBgm as stopPlayingBgmFromHelper,
} from "./browserHelper.js";

// Browser audio service functions
export function playSoundEffect(sound: SoundEffectType, seed?: number): void {
  playSoundEffectFromHelper(sound, seed);
}

export function playMml(mml: string | string[]): void {
  if (typeof mml === "string") {
    playMmlFromHelper([mml]);
  } else {
    playMmlFromHelper(mml);
  }
}

export function startPlayingBgm(): void {
  startPlayingBgmFromHelper();
}

export function stopPlayingBgm(): void {
  stopPlayingBgmFromHelper();
}

// Create browser audio service object
export function createBrowserAudioService(): AudioService {
  return {
    playSoundEffect,
    playMml,
    startPlayingBgm,
    stopPlayingBgm,
  };
}
