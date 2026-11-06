// Drum Telegraph client. Never throws; any failure resolves to null so the UI just omits the AWS line.
type Opts = { base?: string; timeoutMs?: number; fetchImpl?: typeof fetch };

async function call(path: string, init: RequestInit, o: Opts): Promise<Record<string, unknown> | null> {
  const base = (o.base ?? process.env.NEXT_PUBLIC_DRUM_API ?? '').replace(/\/$/, '');
  if (!base) return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), o.timeoutMs ?? 3000);
  try {
    const res = await (o.fetchImpl ?? fetch)(`${base}${path}`, { ...init, signal: ctl.signal });
    if (!res.ok) return null;
    const body: unknown = await res.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function sendPhrase(phrase: string, o: Opts = {}): Promise<{ count: number; messageId: string } | null> {
  const b = await call('/drum', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phrase }) }, o);
  return b && typeof b.count === 'number' && typeof b.messageId === 'string' ? { count: b.count, messageId: b.messageId } : null;
}

export async function getCount(o: Opts = {}): Promise<number | null> {
  const b = await call('/drum', { method: 'GET' }, o);
  return b && typeof b.count === 'number' ? b.count : null;
}
