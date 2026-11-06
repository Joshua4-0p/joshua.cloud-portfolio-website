'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { DRUM_MESSAGES } from '@/content/site';
import { enterStage, exitStage, hit, initialState, type Decoded, type DrumState, type Tone } from '@/lib/drum-engine';
import { emitDecoded, emitDelivered, emitHit, onDelivered, onRequestHit } from '@/lib/drum-bus';
import { getCount, sendPhrase } from '@/lib/telegraph';
import { loadDecoded, saveDecoded } from '@/lib/storage';
import { audio } from '@/lib/audio';
import SoundPill, { soundOnFirstHit, useRestoreSound } from '../SoundPill';
import DrumCanvas from '../three/DrumCanvas';
import Pads from './Pads';
import MessageCard from './MessageCard';
import MessageList from './MessageList';
import { AllMessages, DrumHeading } from './DrumIntro';

const TOTAL = DRUM_MESSAGES.length;
const noop = () => () => {};
const Delivery = ({ messageId, count }: { messageId: string; count: number }) => (
  <p className="mt-5 border-t border-bone/10 pt-4 font-mono text-xs text-signal">Delivered via Amazon SNS · msg {messageId.slice(0, 4)}… · rhythm #{count}</p>
);

export default function DrumSection({ initialMode = 'normal' }: { initialMode?: 'normal' | 'stage' }) {
  const [state, setState] = useState<DrumState>(() => initialState());
  const stateRef = useRef(state);
  const [card, setCard] = useState<{ d: Decoded; key: number } | null>(null);
  const [announce, setAnnounce] = useState('');
  const [delivery, setDelivery] = useState<Record<number, { messageId: string; count: number }>>({});
  const [total, setTotal] = useState<number | null>(null);
  const seqRef = useRef(0);
  const stageAnnounced = useRef(false);
  const [showList, setShowList] = useState(false);
  const padRefs = useRef<Record<Tone, HTMLButtonElement | null>>({ L: null, H: null });
  const fromUrl = useRef(false);
  const prevStage = useRef(false);
  const hitTimers = useRef<Record<Tone, number>>({ L: 0, H: 0 });
  const idleTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(idleTimer.current), []);
  const soundSupported = useSyncExternalStore(noop, audio.isSupported, () => true);
  useRestoreSound();

  useEffect(() => {
    let live = true;
    getCount().then((n) => { if (live && n !== null) setTotal((t) => Math.max(t ?? 0, n)); });
    const off = onDelivered((d) => { setDelivery((m) => ({ ...m, [d.seq]: d })); setTotal((t) => Math.max(t ?? 0, d.count)); });
    return () => { live = false; off(); };
  }, []);

  const commit = useCallback((s: DrumState) => { stateRef.current = s; setState(s); }, []);

  // After hydration: restore progress from storage and apply ?mode= deep links.
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode') ?? (initialMode === 'stage' ? 'stage' : null);
    let s = initialState(loadDecoded());
    // Stage from the URL shows all 8 via `shown`; `decoded` stays real so only real decodes are saved.
    if (mode === 'stage') { s = { ...s, stageUnlocked: true, stage: true }; fromUrl.current = true; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage/URL, which only exist after hydration
    commit(s);
    if (mode === 'stage' || mode === 'drum') requestAnimationFrame(() => document.getElementById('drum')?.scrollIntoView({ behavior: 'instant' }));
  }, [commit, initialMode]);

  // Stage Mode lives on <html> so the whole page can warm up.
  useEffect(() => {
    const html = document.documentElement;
    if (state.stage) html.dataset.stage = 'on';
    else delete html.dataset.stage;
    if (prevStage.current === state.stage) return;
    prevStage.current = state.stage;
    if (fromUrl.current) { fromUrl.current = false; return; } // no announcement for the ?mode=stage load
    if (stageAnnounced.current) { stageAnnounced.current = false; return; } // the secret phrase already announced both
    setAnnounce(state.stage ? 'Stage Mode on — all 8 messages are in "Read the messages".' : 'Stage Mode off.');
  }, [state.stage]);

  const exit = useCallback(() => {
    if (!stateRef.current.stage) return;
    commit(exitStage(stateRef.current));
    if (new URLSearchParams(location.search).has('mode')) history.replaceState(null, '', location.pathname + location.hash);
  }, [commit]);

  // Any nav link leaves Stage Mode.
  useEffect(() => {
    const onClick = (e: MouseEvent) => { if ((e.target as Element).closest?.('[data-nav-link]')) exit(); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [exit]);

  const onHit = useCallback((tone: Tone) => {
    const pad = padRefs.current[tone];
    if (pad) {
      pad.classList.remove('is-hit');
      void pad.offsetWidth; // restart the hit animation in the same frame
      pad.classList.add('is-hit');
      window.clearTimeout(hitTimers.current[tone]);
      hitTimers.current[tone] = window.setTimeout(() => pad.classList.remove('is-hit'), 180);
    }
    soundOnFirstHit();
    audio.drum(tone);
    emitHit(tone);

    const wasStage = stateRef.current.stage;
    const r = hit(stateRef.current, tone, performance.now());
    commit(r.state);
    // Clear a stale partial phrase once the engine's 2 s idle reset would drop it anyway (display only).
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      if (stateRef.current.phrase.length) commit({ ...stateRef.current, phrase: [] });
    }, 2000);
    if (r.decoded) {
      const d = r.decoded;
      saveDecoded(r.state.decoded);
      const seq = ++seqRef.current;
      setCard({ d, key: seq });
      const msg = `Message ${d.index + 1} of ${TOTAL}: ${DRUM_MESSAGES[d.index]}`;
      const entersStage = r.state.stage && !wasStage;
      stageAnnounced.current = entersStage;
      setAnnounce(entersStage ? `${msg} Stage Mode on — all 8 messages are in "Read the messages".` : msg);
      audio.chime();
      emitDecoded({ ...d, seq });
      // Fire and forget: the drum has already decoded; a failed or slow API just means no delivery line.
      void sendPhrase(d.phrase).then((res) => { if (res) emitDelivered({ seq, ...res }); });
    }
  }, [commit]);

  useEffect(() => onRequestHit(onHit), [onHit]); // 3D lip clicks take the exact pad path

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { exit(); return; }
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    const k = e.key.toLowerCase();
    if (k === 'f' || k === 'j') { e.preventDefault(); onHit(k === 'f' ? 'L' : 'H'); }
  };

  // Keep keyboard focus inside the section after a click, so F/J work (Safari doesn't focus buttons on click).
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(document.activeElement)) e.currentTarget.focus({ preventScroll: true });
  };

  const shown = state.stage ? [...Array(TOTAL).keys()] : state.decoded;

  return (
    <section id="drum" tabIndex={-1} aria-labelledby="drum-title" onKeyDown={onKeyDown} onPointerDown={onPointerDown} className="drum-stage outline-none relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div className="relative mx-auto max-w-[1600px]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <DrumHeading />
            <noscript>
              <p className="mt-6 max-w-xl text-[15px] text-bone/80">The drum needs JavaScript to play. All eight messages are listed below as text.</p>
            </noscript>
            <p className="mt-6 hidden max-w-md font-mono text-xs leading-relaxed text-ash md:block">
              Tap the pads, or focus the drum and press F (low) and J (high). Four beats make a phrase.
            </p>
          </div>

          <div className="text-center lg:col-span-7">
            <DrumCanvas variant="stage" className="mx-auto w-full max-w-[760px]" />

            <Pads onHit={onHit} padRefs={padRefs} />

            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="font-mono text-[11px] tracking-[0.25em] text-ash">BEATS</p>
              <p className="relative flex h-8 w-[8.25rem] items-center gap-3 text-2xl leading-none text-copper-hi">
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`h-6 w-6 shrink-0 rounded-full border border-dashed border-bone/25 ${i < state.phrase.length ? 'opacity-0' : ''}`} />
                  ))}
                </span>
                <span data-testid="notation" className="relative flex gap-3 tracking-normal">
                  {state.phrase.map((t, i) => <span key={i} className="w-6 text-center">{t === 'L' ? '●' : '○'}</span>)}
                </span>
              </p>
              <p className="font-mono text-sm text-bone">{state.decoded.length} / {TOTAL} messages decoded</p>
            </div>

            <div aria-live="polite" aria-atomic="true" className="sr-only">{announce}</div>

            <div className="mt-8 min-h-8">
              {card && <MessageCard key={card.key} decoded={card.d} first={card.d.index === 0} delivery={delivery[card.key] ? <Delivery {...delivery[card.key]} /> : undefined} />}
              {total !== null && <p className="mt-4 font-mono text-xs text-signal">{total} rhythms have crossed the cloud</p>}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                aria-expanded={showList}
                aria-controls="drum-message-list"
                onClick={() => setShowList((v) => !v)}
                className="rounded-full border border-bone/30 px-5 py-2.5 text-sm transition-colors hover:border-copper hover:text-copper-hi"
              >
                {showList ? 'Hide the messages' : 'Read the messages'}
              </button>
              {(state.stageUnlocked || state.stage) && (
                <button
                  type="button"
                  aria-pressed={state.stage}
                  onClick={() => (state.stage ? exit() : commit(enterStage(stateRef.current)))}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-copper-hi ${state.stage ? 'bg-bone' : 'bg-copper'}`}
                >
                  {state.stage ? '✕ Back to the quiet site' : 'Enter Stage Mode'}
                </button>
              )}
            </div>
            <p className="mt-5 flex justify-center font-mono text-xs text-ash"><SoundPill variant="inline" /></p>
            {!soundSupported && <p className="mt-4 font-mono text-xs text-ash">Sound not supported in this browser — the drum still works silently.</p>}
            {showList && <MessageList id="drum-message-list" indices={shown} />}
          </div>
        </div>
        <AllMessages />
      </div>
    </section>
  );
}
