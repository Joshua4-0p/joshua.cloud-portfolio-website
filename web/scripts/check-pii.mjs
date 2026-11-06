// Fail the build if never-publish data appears in src/ or out/.
// Generic patterns only; exact strings come from the untracked .pii-local.txt (one per line).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const patterns = [
  /(?<![\d.])(?:\+?237[\s-]?)?6\d{8}(?!\d)/, // not inside longer digit runs / float constants (minified three.js)
  /\b\d{2}\/\d{2}\/(19|20)\d{2}\b/,
  /CGPA/i,
  /date of birth|place of birth|whatsapp\s*(?:number|no\b|n°|:|\+|\d)/i, // drum message 8 names the WhatsApp group (not a number)
  /\b[A-Z0-9]{18,}\b/,
];
const local = path.join(root, '.pii-local.txt');
const exact = existsSync(local)
  ? readFileSync(local, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean)
  : [];

const TEXT = /\.(tsx?|jsx?|mjs|css|html?|json|txt|xml|md|svg|webmanifest)$/i;
const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (TEXT.test(name)) scan(p);
  }
}
function scan(file) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    // Hashed asset names and base64 blobs are long uppercase-ish tokens; only test lines of sane length for the ID pattern.
    for (const re of patterns) {
      if (re === patterns[4] && line.length > 2000) continue;
      const m = line.match(re);
      if (m) hits.push(`${path.relative(root, file)}:${i + 1}  ${re}  "${m[0]}"`);
    }
    for (const s of exact) if (line.includes(s)) hits.push(`${path.relative(root, file)}:${i + 1}  [local exact string]`);
  });
}
for (const d of ['src', 'out']) if (existsSync(path.join(root, d))) walk(path.join(root, d));

if (hits.length) {
  console.error(`PII check FAILED (${hits.length} hit(s)):\n` + hits.join('\n'));
  process.exit(1);
}
console.log(`PII check passed (${exact.length} local exact strings, ${patterns.length} patterns).`);
