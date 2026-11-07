// Export optimised WebP copies of the owner's photos from ../assets (never committed) into public/images.
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, '../../assets');
const out = path.resolve(here, '../public/images');
mkdirSync(out, { recursive: true });

const map = {
  'speaker-green-suit.png': 'speaker',
  'flyer-unbreakable-cloud-2026-10-31.jpg': 'flyer',
  'PXL_20260117_130945347.MP.jpg': 'odc-talk-1',
  'PXL_20260117_130948486.MP.jpg': 'odc-talk-2',
  'IMG-20260117-WA0016.jpg': 'odc-talk-3',
  'IMG_3145.jpg': 'community-day-2026',
  'IMG-20260727-WA0030.jpg': 'community-day-booth',
};

for (const [file, name] of Object.entries(map)) {
  // Rotate once into a buffer so the crop uses the upright dimensions.
  const upright = await sharp(path.join(src, file)).rotate().toBuffer();
  let base = sharp(upright);
  if (name === 'flyer') {
    const { width, height } = await base.metadata();
    base = sharp(upright).extract({ left: 0, top: 0, width, height: Math.round(height * 0.78) }); // drop QR/register bar
  }
  const cropped = await base.toBuffer();
  for (const w of [640, 1280]) {
    const dest = path.join(out, `${name}-${w}.webp`);
    await sharp(cropped).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
    const kb = statSync(dest).size / 1024;
    console.log(`${name}-${w}.webp ${kb.toFixed(0)} KB${kb > 250 ? '  <-- OVER 250 KB' : ''}`);
  }
}
