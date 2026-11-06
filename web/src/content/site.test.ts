import { DRUM_MESSAGES, SECRET_PHRASE, profile, projects, achievements } from './site';
test('exactly 8 drum messages, each ≤140 chars, no placeholders', () => {
  expect(DRUM_MESSAGES).toHaveLength(8);
  for (const m of DRUM_MESSAGES) { expect(m.length).toBeLessThanOrEqual(140); expect(m).not.toMatch(/TODO|TBD|\[|lorem/i); }
});
test('pinned copy', () => {
  expect(profile.hint).toBe('The drum has a message for you — tap it');
  expect(profile.tagline).toBe('Before SNS, there was the drum.');
  expect(SECRET_PHRASE).toBe('LLHL');
});
test('six projects in plan.md order; DocuSmart has no repo link', () => {
  expect(projects.map(p => p.slug)).toEqual(['his','dailyreport-ai','afripay','docusmart','apache-nagios','talking-drum']);
  expect(projects.find(p => p.slug === 'docusmart')!.links).toEqual([]);
});
test('AC11: About story does not pre-empt the drum messages (guitar, drawing)', () => {
  expect(profile.aboutStory).not.toMatch(/guitar|manga|cartoon|Level 300/i);
});
test('no invented AfriPay role', () => { expect(projects.find(p => p.slug === 'afripay')!.role).not.toMatch(/full-stack developer/i); });
test('AWS certification listed first', () => { expect(achievements[0].name).toBe('AWS Certified Cloud Practitioner'); });
