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
