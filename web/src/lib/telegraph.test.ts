import { describe, it, expect, vi } from 'vitest';
import { sendPhrase, getCount } from './telegraph';

const base = 'https://api.example.com';
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status });

describe('sendPhrase', () => {
  it('parses {count,messageId} and posts JSON', async () => {
    const f = vi.fn().mockResolvedValue(json({ count: 42, messageId: 'abcd1234' }));
    expect(await sendPhrase('LLHL', { base, fetchImpl: f })).toEqual({ count: 42, messageId: 'abcd1234' });
    const [url, init] = f.mock.calls[0];
    expect(url).toBe(`${base}/drum`);
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"phrase":"LLHL"}');
    expect(init.headers['content-type']).toBe('application/json');
  });
  it('returns null on timeout', async () => {
    const f = vi.fn((_u: string, init: RequestInit) => new Promise((_r, rej) => init.signal!.addEventListener('abort', () => rej(new Error('abort')))));
    expect(await sendPhrase('LLHL', { base, timeoutMs: 50, fetchImpl: f as unknown as typeof fetch })).toBeNull();
  });
  it('returns null on HTTP 500, network error, bad JSON, wrong shape', async () => {
    expect(await sendPhrase('LLHL', { base, fetchImpl: async () => json({}, 500) })).toBeNull();
    expect(await sendPhrase('LLHL', { base, fetchImpl: async () => { throw new TypeError('net'); } })).toBeNull();
    expect(await sendPhrase('LLHL', { base, fetchImpl: async () => new Response('not json') })).toBeNull();
    expect(await sendPhrase('LLHL', { base, fetchImpl: async () => json({ count: 'x' }) })).toBeNull();
  });
  it('empty base returns null without fetching', async () => {
    const f = vi.fn();
    expect(await sendPhrase('LLHL', { base: '', fetchImpl: f })).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
});

describe('getCount', () => {
  it('parses count', async () => {
    expect(await getCount({ base, fetchImpl: async () => json({ count: 7 }) })).toBe(7);
  });
  it('null on failure or empty base', async () => {
    expect(await getCount({ base, fetchImpl: async () => json({}, 500) })).toBeNull();
    expect(await getCount({ base: '' })).toBeNull();
  });
});
