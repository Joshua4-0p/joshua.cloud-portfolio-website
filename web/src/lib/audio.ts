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
let lastHover = -Infinity, lastSwell = -Infinity; // throttles, on the context clock
let clave: ReturnType<typeof setInterval> | null = null;

/** Son clave 3-2: sixteenth-note step indices over a 16-step bar. */
export const CLAVE_3_2: readonly number[] = [0, 3, 6, 10, 12];
const STEP = 60 / 90 / 4; // one sixteenth at 90 BPM

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
function noise(c: AudioContext, dur: number, fade = true) {
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (fade ? 1 - i / len : 1);
  return buf;
}

function knock(c: AudioContext, at: number, centre = 1200, dur = 0.03, peak = 0.5) {
  const src = c.createBufferSource();
  src.buffer = noise(c, dur);
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
  isSupported: () => !!ctx || !!getCtor(),
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
    else audio.stopClave();
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
  /** Very quiet high wood tick, at most one per 80 ms. */
  hover() {
    if (!on) return;
    const c = ensure();
    if (!c || c.currentTime - lastHover < 0.08) return;
    lastHover = c.currentTime;
    voice(c, 2400, c.currentTime + 0.005, { attack: 0.002, decay: 0.035, peak: 0.04 });
  },
  /** Soft low tap. */
  click() {
    if (!on) return;
    const c = ensure();
    if (!c) return;
    voice(c, 180, c.currentTime + 0.005, { bend: 0.9, attack: 0.005, decay: 0.12, peak: 0.35 });
  },
  /** "Running water": 400 ms band-passed noise sweeping 800 → 2400 Hz. At most one per 1.5 s. */
  swell() {
    if (!on) return;
    const c = ensure();
    if (!c || c.currentTime - lastSwell < 1.5) return;
    lastSwell = c.currentTime;
    const t = c.currentTime + 0.01, dur = 0.4;
    const src = c.createBufferSource();
    src.buffer = noise(c, dur, false);
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(800, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.08, t + dur * 0.4);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(master!);
    src.start(t);
    src.stop(t + dur + 0.02);
  },
  /** Son clave 3-2 at 90 BPM: woodblock on the clave steps, a low drum on beat 1. Look-ahead scheduled. */
  startClave() {
    if (!on || clave) return;
    const c = ensure();
    if (!c) return;
    let step = 0, at = c.currentTime + 0.1;
    const tick = () => {
      if (at < c.currentTime) at = c.currentTime + 0.05; // timers throttled in a background tab: skip, don't burst
      while (at < c.currentTime + 0.2) {
        if (CLAVE_3_2.includes(step)) voice(c, 1000, at, { attack: 0.003, decay: 0.07, peak: 0.22 });
        if (step === 0) voice(c, 110, at, { bend: 0.85, attack: 0.006, decay: 0.3, peak: 0.4 });
        step = (step + 1) % 16;
        at += STEP;
      }
    };
    tick();
    clave = setInterval(tick, 50);
  },
  stopClave() {
    if (clave) clearInterval(clave);
    clave = null;
  },
};

/** Tests only: inject a fake context (null resets). */
export function __setContextForTest(fake: AudioContext | null) {
  audio.stopClave();
  ctx = fake;
  master = fake ? fake.createGain() : null;
  if (fake && master) master.connect(fake.destination);
  lastHover = lastSwell = -Infinity;
}
