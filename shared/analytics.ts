export const events = [
  'page_view',
  'contact_submission',
  'website_cta_click',
  'email_click',
  'case_study_view',
  'case_study_click',
  'service_conversion',
  'blog_conversion',
  'contact_cta_click',
  'service_cta_click',
  'pricing_cta_click',
  'pricing_link_click',
  'case_study_cta_click',
  'blog_cta_click',
  'booking_click',
  'testimonial_submission',
] as const;

export function searchChannel(
  referrer: string,
  medium = '',
  source = '',
  paidClick = false,
): 'google' | 'bing' | '' {
  // Explicit paid/campaign attribution takes precedence over a search referrer.
  if (paidClick || (medium && medium.toLowerCase() !== 'organic')) return '';
  if (medium.toLowerCase() === 'organic') {
    if (source.toLowerCase() === 'google') return 'google';
    if (source.toLowerCase() === 'bing') return 'bing';
  }
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (/^(www\.)?google\.(com|ca|co\.uk|com\.jm|de|fr|ie|es|it|nl)$/.test(host)) return 'google';
    if (host === 'bing.com' || host === 'www.bing.com') return 'bing';
  } catch {}
  return '';
}

export function validEvent(name: string) {
  return events.some(
    (event) =>
      name === event || name === `google_organic_${event}` || name === `bing_organic_${event}`,
  );
}

export function measurementAllowed(dnt: string | null, gpc = false, optedOut = false) {
  return dnt !== '1' && !gpc && !optedOut;
}

// Coarse, first-touch inquiry context. Empty legacy channels stay unknown rather
// than being retrospectively counted as direct traffic.
export function trafficChannel(referrer: string, origin: string, params: URLSearchParams) {
  const medium = (params.get('utm_medium') || '').toLowerCase();
  const source = params.get('utm_source') || '';
  const paid = params.has('gclid') || params.has('msclkid');
  if (paid || /^(cpc|ppc|paid|paidsearch|paid_search|display|paid_social)$/.test(medium))
    return 'paid';
  const search = searchChannel(referrer, medium, source, paid);
  if (search) return search;
  if (medium || source) return 'campaign';
  if (!referrer) return 'direct';
  try {
    return new URL(referrer).origin === origin ? 'direct' : 'referral';
  } catch {
    return 'unknown';
  }
}

export function firstTouch(
  prior: unknown,
  page: string,
  referrer: string,
  origin: string,
  params: URLSearchParams,
): Record<string, string> {
  if (prior && typeof prior === 'object' && !Array.isArray(prior)) {
    const record = prior as Record<string, unknown>;
    if (typeof record.landing_page === 'string' && record.landing_page) {
      const stored: Record<string, string> = {};
      for (const key of [
        'landing_page',
        'referrer',
        'traffic_channel',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
      ]) {
        if (typeof record[key] === 'string') stored[key] = record[key] as string;
      }
      stored.traffic_channel ||= 'unknown';
      return stored;
    }
  }
  const stored: Record<string, string> = {
    landing_page: page,
    referrer: referrer.slice(0, 500),
    traffic_channel: trafficChannel(referrer, origin, params),
  };
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const value = params.get(key);
    if (value) stored[key] = value.slice(0, 200);
  }
  return stored;
}
