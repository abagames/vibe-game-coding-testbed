import { AudioService, SoundEffectType } from "../core/coreTypes.js";

export class NodeAudioService implements AudioService {
  playSoundEffect(sound: SoundEffectType, seed?: number): void {
    // No-op for Node.js environment
  }

  playMml(mml: string | string[]): void {
    // No-op for Node.js environment
  }

  startPlayingBgm(): void {
    // No-op for Node.js environment
  }

  stopPlayingBgm(): void {
    // No-op for Node.js environment
  }
}
