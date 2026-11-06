// Fail the build if never-publish data appears in src/ or out/.
// Generic patterns only; exact strings come from the untracked .pii-local.txt (one per line).
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const patterns = [
  // Cameroon mobile. Not inside a longer digit run, and not after a float's dot ("0.6…" / "*.6…" in minified three.js),
  // but a dot after a letter ("Tel.6…") still counts: JS can't have letter-dot-digit, so that's prose.
  /(?<!\d)(?<!(?:^|[^A-Za-z])\.)(?:(?:\+|00)?237[\s-]?)?6\d{8}(?!\d)/,
  /\b\d{2}\/\d{2}\/(19|20)\d{2}\b/,
  /CGPA/i,
  /date of birth|place of birth|whatsapp\s*(?:number|no\b|n°|:|\+|\d)/i, // drum message 8 names the WhatsApp group (not a number)
  /\b[A-Z0-9]{18,}\b/,
];
// Self-check of the phone pattern: fails loudly if an edit makes it miss a number or flag a float.
for (const t of ['00237677123456', '+237 677123456', '+237677123456', '677123456', 'Tel.677123456', '"677123456"'])
  assert.match(t, patterns[0], `phone pattern misses ${t}`);
for (const t of ['0.677123456', 'x*.677123456', '.677123456', '1.00237677123456', '9677123456', '6771234567'])
  assert.doesNotMatch(t, patterns[0], `phone pattern flags non-phone ${t}`);

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
