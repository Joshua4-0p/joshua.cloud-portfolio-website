// localStorage can throw (Safari private mode, blocked site data). Every access is guarded; failures mean "session only".
const DECODED = 'td.decoded';
const SOUND = 'td.sound';

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* session only */ }
}

export function loadDecoded(): number[] {
  try {
    const v = JSON.parse(read(DECODED) ?? '[]');
    if (!Array.isArray(v)) return [];
    return [...new Set(v.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 8))];
  } catch {
    return [];
  }
}
export const saveDecoded = (d: number[]) => write(DECODED, JSON.stringify(d));
export const loadSound = () => read(SOUND) === 'true';
export const saveSound = (on: boolean) => write(SOUND, String(on));
/** True once the visitor has ever chosen on/off (so the first drum hit must not override an explicit "off"). */
export const hasSoundPref = () => read(SOUND) !== null;
