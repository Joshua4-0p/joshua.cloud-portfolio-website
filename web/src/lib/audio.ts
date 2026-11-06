// Web Audio synth (singleton). Fully synthesised, no files. One AudioContext, created lazily inside a user gesture.
// Every voice goes through one master gain (0.25). Nothing plays while sound is off.
import type { Tone } from './drum-engine';

type Ctor = typeof AudioContext;
const getCtor = (): Ctor | undefined =>
  typeof window === 'undefined'
    ? undefined
    : window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let on = false;
let chosen = false; // the visitor used the sound toggle this session
const subs = new Set<() => void>();

function ensure(): AudioContext | null {
  if (!ctx) {
    const C = getCtor();
    if (!C) return null;
    try {
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.25;
      master.connect(ctx.destination);
    } catch {
      ctx = null;
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
  return ctx;
}

/** A soft sine "wood" voice with a click-free envelope. */
function voice(c: AudioContext, freq: number, at: number, opts: { bend?: number; attack?: number; decay?: number; peak?: number } = {}) {
  const { bend = 1, attack = 0.004, decay = 0.3, peak = 1 } = opts;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, at);
  if (bend !== 1) osc.frequency.exponentialRampToValueAtTime(freq * bend, at + 0.12);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  osc.connect(g).connect(master!);
  osc.start(at);
  osc.stop(at + attack + decay + 0.05);
}

/** Short band-passed noise transient: the knock of wood. */
function knock(c: AudioContext, at: number, centre = 1200, dur = 0.03, peak = 0.5) {
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = centre;
  bp.Q.value = 2;
  const g = c.createGain();
  g.gain.setValueAtTime(peak, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(bp).connect(g).connect(master!);
  src.start(at);
}

export const audio = {
  isSupported: () => !!getCtor(),
  isOn: () => on,
  subscribe(cb: () => void) { subs.add(cb); return () => { subs.delete(cb); }; },
  wasChosen: () => chosen,
  /** Call from click/pointerup/touchend: those count as user activation on mobile, pointerdown does not. */
  unlock() {
    if (!on || !ctx) return;
    void ctx.resume().catch(() => {});
  },
  setOn(next: boolean, byUser = false) {
    if (byUser) chosen = true;
    on = next && audio.isSupported();
    if (on) ensure(); // called from a click/tap handler, so creating/resuming here is allowed
    subs.forEach((cb) => cb());
  },
  drum(tone: Tone) {
    if (!on) return;
    const c = ensure();
    if (!c) return;
    const t = c.currentTime + 0.005;
    voice(c, tone === 'L' ? 110 : 165, t, { bend: 0.85, attack: 0.004, decay: 0.3 });
    knock(c, t);
  },
  chime() {
    if (!on) return;
    const c = ensure();
    if (!c) return;
    const t = c.currentTime + 0.01;
    voice(c, 660, t, { attack: 0.006, decay: 0.35, peak: 0.45 });
    voice(c, 880, t + 0.09, { attack: 0.006, decay: 0.45, peak: 0.4 });
  },
  // Filled in Task 9 (sound design pass).
  click() {},
  hover() {},
  swell() {},
  startClave() {},
  stopClave() {},
};
