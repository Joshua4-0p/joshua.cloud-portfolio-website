import { loadDecoded, saveDecoded, loadSound, saveSound } from './storage';

afterEach(() => { vi.unstubAllGlobals(); });

test('storage helpers swallow exceptions', () => {
  const boom = () => { throw new Error('SecurityError'); };
  vi.stubGlobal('localStorage', { getItem: boom, setItem: boom, removeItem: boom });
  expect(loadDecoded()).toEqual([]);
  expect(() => saveDecoded([1])).not.toThrow();
  expect(loadSound()).toBe(false);
  expect(() => saveSound(true)).not.toThrow();
});

test('invalid JSON or out-of-range values fall back to defaults', () => {
  localStorage.setItem('td.decoded', '{not json');
  expect(loadDecoded()).toEqual([]);
  localStorage.setItem('td.decoded', JSON.stringify([1, 1, 9, -1, 'x', 3]));
  expect(loadDecoded()).toEqual([1, 3]);
});

test('round-trips decoded and sound', () => {
  saveDecoded([0, 2]); expect(loadDecoded()).toEqual([0, 2]);
  saveSound(true); expect(loadSound()).toBe(true);
  saveSound(false); expect(loadSound()).toBe(false);
});
