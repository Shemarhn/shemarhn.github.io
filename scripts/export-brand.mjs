import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { renderMonogram } from '../src/brand/monogram.ts';
await mkdir('public/assets', { recursive: true });
const svg = renderMonogram('sm', false);
await writeFile('public/assets/sm-monogram.svg', svg);
await writeFile('public/assets/sm-outline.svg', renderMonogram('sm-outline', false, true));
for (const size of [64, 180]) {
  await sharp(Buffer.from(svg))
    .resize(size, size, { fit: 'contain', background: '#0b1f3b' })
    .png()
    .toFile(`public/assets/${size === 64 ? 'favicon' : 'apple-touch-icon'}.png`);
}
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 500"><rect width="1500" height="500" fill="#080f1c"/><g transform="translate(0 0) scale(.42)">${svg.replace(/<svg[^>]*>|<\/svg>/g, '')}</g><text x="530" y="250" fill="#f1f3f6" font-family="Arial,sans-serif" font-size="85" font-weight="600" letter-spacing="-4">shemarmarks<tspan fill="#4d8dff">.com</tspan></text><text x="535" y="320" fill="#a6afbe" font-family="Arial,sans-serif" font-size="18" letter-spacing="5">CLOUD · LINUX · AUTOMATION</text></svg>`;
await writeFile('brand/sm-wordmark.svg', wordmark);
await writeFile('brand/sm-monogram.svg', svg);
await writeFile('brand/sm-outline.svg', renderMonogram('brand-outline', false, true));
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><radialGradient id="bg"><stop stop-color="#163b72"/><stop offset="1" stop-color="#080f1c"/></radialGradient></defs><rect width="1200" height="630" fill="#080f1c"/><ellipse cx="1010" cy="310" rx="430" ry="450" fill="url(#bg)"/><path d="M60 70H1140M60 550H1140" stroke="#2b3d58"/><text x="65" y="135" fill="#a8b9d2" font-family="Arial" font-size="15" letter-spacing="3">SHEMAR MARKS / INDEPENDENT CONSULTANT</text><text x="60" y="285" fill="#f1f3f6" font-family="Arial" font-size="85" letter-spacing="-5">Infrastructure.</text><text x="60" y="385" fill="#4d8dff" font-family="Arial" font-size="85" letter-spacing="-5">Built to hold.</text><text x="65" y="470" fill="#a6afbe" font-family="Arial" font-size="18">CLOUD INFRASTRUCTURE · LINUX · AUTOMATION</text><text x="65" y="593" fill="#a6afbe" font-family="Arial" font-size="15">shemarmarks.com</text></svg>`;
const mark = await sharp(Buffer.from(svg)).resize(365, 365).png().toBuffer();
await sharp(Buffer.from(social))
  .composite([{ input: mark, left: 805, top: 155 }])
  .png()
  .toFile('public/assets/social-preview.png');
console.log('Vector identity and social assets exported.');
