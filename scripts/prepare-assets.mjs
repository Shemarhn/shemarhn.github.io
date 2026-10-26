// One-time import from the user's supplied images and preserved legacy checkout.
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const dest = resolve('public/assets');
await mkdir(dest, { recursive: true });
const source = process.argv[2];
const legacy = process.argv[3];
if (!source || !legacy) throw Error('Provide monogram image path and legacy assets directory.');
const meta = await sharp(source).metadata();
console.log({ width: meta.width, height: meta.height, hasAlpha: meta.hasAlpha });
await sharp(source)
  .trim()
  .resize(640, 640, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 88 })
  .toFile(resolve(dest, 'monogram.webp'));
await sharp(source)
  .trim()
  .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 90 })
  .toFile(resolve(dest, 'monogram-small.webp'));
await sharp(source)
  .trim()
  .resize(64, 64, { fit: 'contain', background: '#0b1f3b' })
  .png()
  .toFile(resolve(dest, 'favicon.png'));
await sharp(source)
  .trim()
  .resize(180, 180, { fit: 'contain', background: '#0b1f3b' })
  .png()
  .toFile(resolve(dest, 'apple-touch-icon.png'));
await copyFile(resolve(legacy, 'shemar-marks-420.webp'), resolve(dest, 'shemar-marks.webp'));
await copyFile(resolve(legacy, 'recovered-app-960.webp'), resolve(dest, 'northstar-recovery.webp'));
const svg = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g"><stop stop-color="#193f76"/><stop offset="1" stop-color="#080f1c"/></radialGradient></defs><rect width="1200" height="630" fill="#080f1c"/><circle cx="970" cy="310" r="380" fill="url(#g)"/><path d="M70 75H1130M70 550H1130" stroke="#30415a"/><text x="75" y="132" fill="#8fa5c4" font-family="Arial" font-size="14" letter-spacing="3">SHEMAR MARKS / INDEPENDENT CONSULTANT</text><text x="70" y="280" fill="#f1f3f6" font-family="Arial" font-size="82" letter-spacing="-4">Infrastructure.</text><text x="70" y="375" fill="#4d8dff" font-family="Arial" font-size="82" letter-spacing="-4">Built to hold.</text><text x="75" y="468" fill="#a6afbe" font-family="Arial" font-size="19">CLOUD INFRASTRUCTURE · LINUX · AUTOMATION</text><text x="75" y="590" fill="#a6afbe" font-family="Arial" font-size="15">shemarmarks.com</text></svg>`,
);
const mark = await sharp(source)
  .trim()
  .resize(320, 320, { fit: 'inside' })
  .linear(1.35, 0)
  .png()
  .toBuffer();
await sharp(svg)
  .composite([{ input: mark, left: 835, top: 160, blend: 'screen' }])
  .png()
  .toFile(resolve(dest, 'social-preview.png'));
