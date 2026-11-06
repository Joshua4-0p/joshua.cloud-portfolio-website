// Tiny event bus: the drum UI emits; telegraph (Task 7) and 3D scene (Task 8) listen.
import type { Decoded, Tone } from './drum-engine';

type Delivered = { messageId: string; count: number };

function channel<T>() {
  const subs = new Set<(v: T) => void>();
  return {
    emit: (v: T) => subs.forEach((cb) => { try { cb(v); } catch (e) { console.error(e); } }),
    on: (cb: (v: T) => void) => { subs.add(cb); return () => { subs.delete(cb); }; },
  };
}

const hits = channel<Tone>();
const decodes = channel<Decoded>();
const deliveries = channel<Delivered>();

export const emitHit = hits.emit;
export const onHit = hits.on;
export const emitDecoded = decodes.emit;
export const onDecoded = decodes.on;
export const emitDelivered = deliveries.emit;
export const onDelivered = deliveries.on;
