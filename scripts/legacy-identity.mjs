// Check URL hosts, not repository names that happen to contain the retired host.
export function hasLegacyIdentity(html) {
  if (/shemarmarks\.tech@gmail\.com/i.test(html)) return true;
  let legacyURL = false;
  const text = html.replace(/(?:https?:)?\/\/[^\s"'<>]+/gi, (candidate) => {
    try {
      const url = new URL(candidate.replace(/[),;\]}]+$/g, ''), 'https://shemarmarks.com');
      const host = url.hostname.toLowerCase().replace(/\.$/, '');
      if (host === 'shemarhn.github.io' || host === 'www.shemarhn.github.io') legacyURL = true;
    } catch {}
    return '';
  });
  // Preserve detection of a displayed bare retired address, without mistaking
  // the same string inside a legitimate URL's path or query for its hostname.
  return (
    legacyURL || /(^|[\s"'<>=(])(?:www\.)?shemarhn\.github\.io(?=$|[\s"'<>)/?#:.,;])/i.test(text)
  );
}
