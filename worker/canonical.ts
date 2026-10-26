import type { Env } from './types.ts';

// Keep staging/local traffic isolated. Production aliases have one public destination.
export function canonicalRedirect(request: Request, env: Env): Response | undefined {
  const url = new URL(request.url);
  if (
    env.APP_ENV !== 'production' ||
    !['shemarmarks.com', 'www.shemarmarks.com', 'shemar-marks.shemarmarks.workers.dev'].includes(
      url.hostname,
    )
  )
    return;
  const original = url.href;
  url.protocol = 'https:';
  url.hostname = 'shemarmarks.com';
  url.port = '';
  if (['GET', 'HEAD'].includes(request.method) && !url.pathname.startsWith('/api/')) {
    if (url.pathname.endsWith('/index.html')) url.pathname = url.pathname.slice(0, -10);
    if (!url.pathname.endsWith('/') && !url.pathname.split('/').pop()!.includes('.'))
      url.pathname += '/';
  }
  if (url.href !== original)
    return Response.redirect(url.href, ['GET', 'HEAD'].includes(request.method) ? 301 : 308);
}
