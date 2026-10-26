import { getCollection } from 'astro:content';
import { site } from '../data/site';
const escape = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!,
  );
export async function GET() {
  const posts = (
    await getCollection(
      'insights',
      ({ data }) => data.status === 'published' && data.date <= new Date(),
    )
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Shemar Marks — Insights</title><link>${site.url}/insights/</link><description>Practical infrastructure, Linux, and automation notes.</description><language>en</language><atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${posts.map((p) => `<item><title>${escape(p.data.title)}</title><link>${site.url}/insights/${p.id}/</link><guid>${site.url}/insights/${p.id}/</guid><description>${escape(p.data.excerpt)}</description><pubDate>${p.data.date.toUTCString()}</pubDate></item>`).join('')}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml;charset=utf-8' } },
  );
}
