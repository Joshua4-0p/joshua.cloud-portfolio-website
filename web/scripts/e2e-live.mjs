// Runs the chromium e2e project against the live site: BASE_URL from env, else SITE_URL in docs/submission/urls.md.
// The fixtures still block the drum API, so no test can POST to it (each real POST can email the owner).
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const BASE_URL = process.env.BASE_URL || /^SITE_URL=(\S+)/m.exec(readFileSync(new URL('../../docs/submission/urls.md', import.meta.url), 'utf8'))[1];
console.log(`e2e against ${BASE_URL}`);
const r = spawnSync('npx', ['playwright', 'test', '--project=chromium', ...process.argv.slice(2)], { stdio: 'inherit', shell: true, env: { ...process.env, BASE_URL } });
process.exit(r.status ?? 1);
