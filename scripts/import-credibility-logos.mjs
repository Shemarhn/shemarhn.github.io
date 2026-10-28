// Original artwork only. URLs observed on official sites in the built-in browser.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const sources = [
  [
    'guardsman-beryllium',
    'Guardsman / Beryllium',
    'https://goberyllium.com/',
    'https://goberyllium.com/wp-content/uploads/2025/05/Guardsman-Beryllium-horizontal-02-2048x578.webp',
    'webp',
    'dark',
  ],
  [
    'wisynco',
    'Wisynco',
    'https://wisynco.com/',
    'https://wisynco.com/wp-content/uploads/2022/04/Wisynco-logo-small-web.png',
    'webp',
    'light',
  ],
  [
    'vmware',
    'VMware',
    'https://www.vmware.com/',
    'https://www.vmware.com/media/blt8c9a8aaca0ffd4ac/blt5a3e185aed7848a3/65fac63dd3267616e27e7051/vmware-logo-grey.svg',
    'svg',
    'light',
  ],
  [
    'proxmox',
    'Proxmox',
    'https://proxmox.com/en/about/company-details/media-kit',
    'https://proxmox.com/images/proxmox/Proxmox_logo_standard_hex_400px.png',
    'webp',
    'light',
  ],
  [
    'microsoft',
    'Microsoft',
    'https://www.microsoft.com/',
    'https://uhf.microsoft.com/images/microsoft/RE1Mu3b.png',
    'webp',
    'light',
  ],
  [
    'aws',
    'Amazon Web Services',
    'https://github.com/devicons/devicon',
    'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    'svg',
    'light',
  ],
  [
    'wildix',
    'Wildix',
    'https://www.wildix.com/',
    'https://cdn-ildhjpd.nitrocdn.com/fpdESKkbMwiyLfmwbIpFEHCVRYPgtkHa/assets/images/optimized/rev-5091a97/www.wildix.com/wp-content/uploads/2021/09/Wildix-logo-white.webp',
    'webp',
    'dark',
  ],
  [
    'odoo',
    'Odoo',
    'https://www.odoo.com/page/brand-assets',
    'https://odoocdn.com/openerp_website/static/src/img/assets/svg/odoo_logo.svg',
    'svg',
    'light',
  ],
  [
    'zoho',
    'Zoho',
    'https://www.zoho.com/branding/',
    'https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg',
    'svg',
    'light',
  ],
  [
    'lenovo',
    'Lenovo',
    'https://www.lenovo.com/us/en/',
    'https://p3-ofp.static.pub/fes/cms/2023/03/22/8hjmcte754uauw07ypikjkjtx0m5ib450914.svg',
    'svg',
    'light',
  ],
  [
    'proxcenter',
    'ProxCenter',
    'https://www.proxcenter.io/',
    'https://www.proxcenter.io/images/proxcenter-logo-dark.svg',
    'svg',
    'dark',
  ],
];
await mkdir('public/assets/previous-work', { recursive: true });
const manifest = await Promise.all(
  sources.map(async ([id, name, page, source, format, tone]) => {
    let raw;
    if (id === 'aws') raw = await readFile('public/assets/technologies/aws.svg');
    else {
      const response = await fetch(source, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw Error(`${name}: ${response.status}`);
      raw = Buffer.from(await response.arrayBuffer());
    }
    // Resize raster sources without altering the mark or its aspect ratio; preserve SVG paths.
    const output =
      format === 'svg'
        ? raw
        : await sharp(raw)
            .resize({ width: 600, height: 180, fit: 'inside', withoutEnlargement: true })
            .webp({ lossless: true })
            .toBuffer();
    if (
      format === 'svg' &&
      (!raw.toString().includes('<svg') ||
        /<script|<foreignObject|onload=|href="https?:/i.test(raw.toString()))
    )
      throw Error(`${name}: unsafe or invalid SVG`);
    const dimensions = await sharp(output).metadata();
    const file = `/assets/previous-work/${id}.${format}`;
    await writeFile(`public${file}`, output);
    return {
      id,
      name,
      file,
      tone,
      width: dimensions.width,
      height: dimensions.height,
      page,
      source,
      sourceType:
        id === 'aws' ? 'Devicon (MIT; original AWS wordmark)' : 'Official website / brand resource',
      bytes: output.length,
      sha256: createHash('sha256').update(output).digest('hex'),
      retrieved: '2026-10-27',
    };
  }),
);
await writeFile('vendor/previous-work-logos.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(
  JSON.stringify(
    manifest.map(({ name, bytes, width, height }) => ({ name, bytes, width, height })),
    null,
    2,
  ),
);
