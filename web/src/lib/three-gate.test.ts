import { shouldRender3D } from './three-gate';

const ok = { webgl: true, reducedMotion: false, deviceMemory: 8, cores: 8 };

describe('shouldRender3D', () => {
  it('renders on a capable device', () => expect(shouldRender3D(ok)).toBe(true));
  it('renders when memory/cores are unknown (Safari/Firefox)', () =>
    expect(shouldRender3D({ webgl: true, reducedMotion: false })).toBe(true));
  it.each([
    ['no WebGL', { ...ok, webgl: false }],
    ['reduced motion', { ...ok, reducedMotion: true }],
    ['Save-Data', { ...ok, saveData: true }],
    ['deviceMemory 2', { ...ok, deviceMemory: 2 }],
    ['2 cores', { ...ok, cores: 2 }],
  ])('falls back to the poster with %s', (_, env) => expect(shouldRender3D(env)).toBe(false));
});
