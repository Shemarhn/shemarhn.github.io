import { getCollection } from 'astro:content';
import { site, services, projects } from '../data/site';
export async function GET() {
  const posts = await getCollection(
    'insights',
    ({ data }) => data.status === 'published' && data.date <= new Date(),
  );
  const paths = [
    '/',
    '/services/',
    '/work/',
    '/about/',
    '/pricing/',
    '/contact/',
    '/references/',
    '/insights/',
    '/privacy/',
    ...services.map((s) => `/services/${s.slug}/`),
    ...projects.map((p) => `/work/${p.slug}/`),
    ...posts.map((p) => `/insights/${p.id}/`),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${site.url}${path}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml;charset=utf-8' } },
  );
}
