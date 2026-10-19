import { getCollection } from 'astro:content';
import { site } from '../data/site';

function xFallback(title: string, excerpt: string) {
  const text = `${title}\n\n${excerpt}`;
  return text.length <= 220 ? text : `${text.slice(0, 217).trimEnd()}…`;
}

export async function GET() {
  const posts = (
    await getCollection(
      'insights',
      ({ data }) => data.status === 'published' && data.date <= new Date() && data.social?.enabled !== false,
    )
  ).sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  const payload = posts.map((post) => {
    const url = `${site.url}/insights/${post.id}/`;
    const campaign = encodeURIComponent(post.id);
    return {
      slug: post.id,
      title: post.data.title,
      url,
      linkedin:
        post.data.social?.linkedin ||
        `${post.data.title}\n\n${post.data.excerpt}\n\nA practical note from the systems side.`,
      linkedinUrl: `${url}?utm_source=linkedin&utm_medium=social&utm_campaign=${campaign}`,
      x: post.data.social?.x || xFallback(post.data.title, post.data.excerpt),
      xUrl: `${url}?utm_source=x&utm_medium=social&utm_campaign=${campaign}`,
    };
  });
  return Response.json(
    { posts: payload },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  );
}
