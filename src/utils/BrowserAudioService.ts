import { AudioService, SoundEffectType } from "../core/coreTypes.js";
import {
  playSoundEffect as playSoundEffectFromHelper,
  playMml as playMmlFromHelper,
  startPlayingBgm as startPlayingBgmFromHelper,
  stopPlayingBgm as stopPlayingBgmFromHelper,
} from "./browserHelper.js";

export class BrowserAudioService implements AudioService {
  playSoundEffect(sound: SoundEffectType, seed?: number): void {
    playSoundEffectFromHelper(sound, seed);
  }

  playMml(mml: string | string[]): void {
    if (typeof mml === "string") {
      playMmlFromHelper([mml]);
    } else {
      playMmlFromHelper(mml);
    }
  }

  startPlayingBgm(): void {
    startPlayingBgmFromHelper();
  }

  stopPlayingBgm(): void {
    stopPlayingBgmFromHelper();
  }
}
