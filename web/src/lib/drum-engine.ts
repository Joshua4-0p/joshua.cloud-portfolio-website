// Pure phrase/decode state machine for the Talking Drum. No DOM, no timers: callers pass `now`.
import { DRUM_MESSAGES, SECRET_PHRASE } from '@/content/site';

export type Tone = 'L' | 'H';

export interface DrumState {
  phrase: Tone[];
  decoded: number[];
  nextIndex: number;
  lastHitAt: number;
  stageUnlocked: boolean;
  stage: boolean;
}

export interface Decoded { index: number; phrase: string; secret: boolean; replay: boolean }

const TOTAL = DRUM_MESSAGES.length;
const PHRASE_LENGTH = 4;
const IDLE_RESET_MS = 2000;
const UNLOCK_AFTER = 3;

export function initialState(decoded: number[] = []): DrumState {
  const missing = [...Array(TOTAL).keys()].find((i) => !decoded.includes(i));
  return {
    phrase: [],
    decoded: [...decoded],
    nextIndex: missing ?? 0,
    lastHitAt: -Infinity,
    stageUnlocked: decoded.length >= UNLOCK_AFTER,
    stage: false,
  };
}

export function hit(s: DrumState, tone: Tone, now: number): { state: DrumState; decoded?: Decoded } {
  const base = now - s.lastHitAt > IDLE_RESET_MS ? [] : s.phrase;
  const phrase = [...base, tone];
  if (phrase.length < PHRASE_LENGTH) return { state: { ...s, phrase, lastHitAt: now } };

  const str = phrase.join('');
  const index = s.nextIndex;
  const replay = s.decoded.includes(index);
  const secret = str === SECRET_PHRASE;
  const decoded = replay ? s.decoded : [...s.decoded, index];
  return {
    state: {
      phrase: [],
      decoded,
      nextIndex: (index + 1) % TOTAL,
      lastHitAt: now,
      stageUnlocked: s.stageUnlocked || secret || decoded.length >= UNLOCK_AFTER,
      stage: s.stage || secret,
    },
    decoded: { index, phrase: str, secret, replay },
  };
}

export const enterStage = (s: DrumState): DrumState => (s.stageUnlocked ? { ...s, stage: true } : s);
export const exitStage = (s: DrumState): DrumState => ({ ...s, stage: false });
export const revealAll = (s: DrumState): DrumState => ({
  ...s,
  decoded: [...Array(TOTAL).keys()],
  stageUnlocked: true,
  stage: true,
});

export const toNotation = (phrase: string) => phrase.replace(/L/g, '●').replace(/H/g, '○');
