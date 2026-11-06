import { hit, initialState, revealAll, toNotation, type DrumState, type Tone } from './drum-engine';

const play = (s: DrumState, tones: string, t0 = 0) => { let r: ReturnType<typeof hit> | undefined; [...tones].forEach((c, i) => { r = hit(r?.state ?? s, c as Tone, t0 + i * 200); }); return r!; };
test('4 hits decode message 0 then 1, in order', () => {
  const a = play(initialState(), 'LHLH'); expect(a.decoded).toMatchObject({ index: 0, phrase: 'LHLH', secret: false, replay: false });
  const b = play(a.state, 'HHHH', 2000); expect(b.decoded!.index).toBe(1);
});
test('partial phrase resets after 2 s idle', () => {
  let r = hit(initialState(), 'L', 0); r = hit(r.state, 'L', 100);
  r = hit(r.state, 'H', 2201); expect(r.state.phrase).toEqual(['H']);
});
test('secret phrase LLHL unlocks and enters stage', () => {
  const r = play(initialState(), 'LLHL'); expect(r.decoded!.secret).toBe(true); expect(r.state.stage).toBe(true);
});
test('stage unlocks after 3 decodes', () => {
  let s = initialState(); for (let i = 0; i < 3; i++) s = play(s, 'HLHH', i * 3000).state;
  expect(s.stageUnlocked).toBe(true); expect(s.stage).toBe(false);
});
test('after 8 decodes the next phrase replays message 0', () => {
  let s = initialState(); for (let i = 0; i < 8; i++) s = play(s, 'HHLH', i * 3000).state;
  const r = play(s, 'HHLH', 99999); expect(r.decoded).toMatchObject({ index: 0, replay: true }); expect(r.state.decoded).toHaveLength(8);
});
test('revealAll shows everything in stage', () => { const s = revealAll(initialState()); expect(s.decoded).toHaveLength(8); expect(s.stage).toBe(true); });
test('toNotation', () => expect(toNotation('LLHL')).toBe('●●○●'));
test('initialState resumes after persisted decodes', () => {
  const s = initialState([0, 1, 2]); expect(s.nextIndex).toBe(3); expect(s.stageUnlocked).toBe(true);
  expect(initialState([0, 1, 2, 3, 4, 5, 6, 7]).nextIndex).toBe(0);
});
