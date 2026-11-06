import { audio, CLAVE_3_2, __setContextForTest } from './audio';

// A fake AudioContext: just enough graph surface for the voices, with the clock frozen at t = 0.
function fakeContext() {
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const node = () => ({ connect: vi.fn((n: unknown) => n), disconnect: vi.fn() });
  return {
    currentTime: 0,
    sampleRate: 48000,
    state: 'running',
    destination: node(),
    resume: vi.fn(() => Promise.resolve()),
    createGain: vi.fn(() => ({ ...node(), gain: param() })),
    createOscillator: vi.fn(() => ({ ...node(), type: 'sine', frequency: param(), start: vi.fn(), stop: vi.fn() })),
    createBiquadFilter: vi.fn(() => ({ ...node(), type: 'lowpass', frequency: param(), Q: param() })),
    createBuffer: vi.fn((_c: number, len: number) => ({ getChannelData: () => new Float32Array(len) })),
    createBufferSource: vi.fn(() => ({ ...node(), buffer: null, start: vi.fn(), stop: vi.fn() })),
  };
}

test('CLAVE_3_2 is the son-clave 3-2 pattern on a 16-step bar', () => {
  expect(CLAVE_3_2).toEqual([0, 3, 6, 10, 12]);
});

test('without Web Audio: unsupported, and every method is a silent no-op', () => {
  expect(window.AudioContext).toBeUndefined();
  expect(audio.isSupported()).toBe(false);
  audio.setOn(true);
  expect(audio.isOn()).toBe(false);
  expect(() => {
    audio.unlock(); audio.drum('L'); audio.chime(); audio.hover(); audio.click(); audio.swell(); audio.startClave(); audio.stopClave();
  }).not.toThrow();
});

test('hover twice within 80 ms schedules one voice', () => {
  const c = fakeContext();
  __setContextForTest(c as unknown as AudioContext);
  audio.setOn(true);
  audio.hover();
  audio.hover();
  expect(c.createOscillator).toHaveBeenCalledTimes(1);
  c.currentTime = 0.1;
  audio.hover();
  expect(c.createOscillator).toHaveBeenCalledTimes(2);
  audio.setOn(false);
  __setContextForTest(null);
});

test('nothing plays while sound is off', () => {
  const c = fakeContext();
  __setContextForTest(c as unknown as AudioContext);
  audio.setOn(false);
  audio.hover(); audio.click(); audio.swell(); audio.chime(); audio.drum('H'); audio.startClave();
  expect(c.createOscillator).not.toHaveBeenCalled();
  expect(c.createBufferSource).not.toHaveBeenCalled();
  __setContextForTest(null);
});
