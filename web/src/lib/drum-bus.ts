// Tiny event bus: the drum UI emits; telegraph (Task 7) and 3D scene (Task 8) listen.
import type { Decoded, Tone } from './drum-engine';

// `seq` ties a delivery to the card (decode) that caused it, so a late reply can't land on a newer card.
export type DecodedEvent = Decoded & { seq: number };
// `emailed`: the owner's inbox is rate-limited (≤ 1 email/min, SNS filter policy); SQS gets every message.
type Delivered = { seq: number; messageId: string; count: number; emailed?: boolean };

function channel<T>() {
  const subs = new Set<(v: T) => void>();
  return {
    emit: (v: T) => subs.forEach((cb) => { try { cb(v); } catch (e) { console.error(e); } }),
    on: (cb: (v: T) => void) => { subs.add(cb); return () => { subs.delete(cb); }; },
  };
}

const hits = channel<Tone>();
const decodes = channel<DecodedEvent>();
const deliveries = channel<Delivered>();
const requests = channel<Tone>();

export const emitHit = hits.emit;
export const onHit = hits.on;
export const emitDecoded = decodes.emit;
export const onDecoded = decodes.on;
export const emitDelivered = deliveries.emit;
export const onDelivered = deliveries.on;
/** Input: a 3D lip click asks DrumSection to play, so it counts exactly once, like a pad hit. */
export const requestHit = requests.emit;
export const onRequestHit = requests.on;
