// Decides 3D canvas vs static poster. Kept tiny and three-free so it can sit in the initial bundle.
import { prefersReducedMotion } from './media';

type Env = { webgl: boolean; reducedMotion: boolean; deviceMemory?: number; cores?: number; saveData?: boolean };

export const shouldRender3D = (e: Env): boolean =>
  e.webgl && !e.reducedMotion && !e.saveData && (e.deviceMemory ?? 8) >= 4 && (e.cores ?? 8) >= 4;

/** Browser-only. */
export function detect3DEnv(): Env {
  let webgl = false;
  try { const gl = document.createElement('canvas').getContext('webgl2'); webgl = !!gl; gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch { /* no WebGL */ }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return { webgl, reducedMotion: prefersReducedMotion(), deviceMemory: nav.deviceMemory, cores: nav.hardwareConcurrency, saveData: nav.connection?.saveData };
}
