const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
if (import.meta.env.PUBLIC_QA_AUDIT === 'true') import('./qa');
let motionPaused = false;
try {
  motionPaused = localStorage.getItem('sm-motion') === 'paused';
} catch {}
root.classList.toggle('motion-paused', motionPaused);
const motionButton = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
function updateMotion() {
  if (motionButton) {
    motionButton.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
    motionButton.setAttribute('aria-pressed', String(motionPaused));
  }
}
updateMotion();
motionButton?.addEventListener('click', () => {
  motionPaused = !motionPaused;
  root.classList.toggle('motion-paused', motionPaused);
  try {
    localStorage.setItem('sm-motion', motionPaused ? 'paused' : 'active');
  } catch {}
  updateMotion();
  window.dispatchEvent(new CustomEvent('sm:motionchange'));
});
reduced.addEventListener('change', () => window.dispatchEvent(new CustomEvent('sm:motionchange')));
import('./experience');
const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
    toggle.focus();
  }
});
// UTM and referrer persist within this tab only; no cookies or third-party identifier.
export function attribution() {
  const q = new URLSearchParams(location.search);
  let prior: Record<string, string> = {};
  try {
    prior = JSON.parse(sessionStorage.getItem('sm-attribution') || '{}');
  } catch {}
  const fresh: Record<string, string> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    const value = q.get(key);
    if (value) fresh[key] = value.slice(0, 200);
  }
  const stored = {
    ...prior,
    ...fresh,
    landing_page: prior.landing_page || location.pathname,
    referrer: prior.referrer || document.referrer.slice(0, 500),
  };
  try {
    sessionStorage.setItem('sm-attribution', JSON.stringify(stored));
  } catch {}
  return {
    ...stored,
    page: location.pathname,
    cta: q.get('cta') || 'Direct contact',
    source: q.get('source') || 'Website',
    campaign: q.get('campaign') || fresh.utm_campaign || prior.utm_campaign || '',
    submitted_at: new Date().toISOString(),
  };
}
attribution();
export function track(name: string, details: Record<string, string> = {}) {
  if (
    navigator.doNotTrack === '1' ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
  )
    return;
  try {
    if (localStorage.getItem('sm-analytics') === 'off') return;
  } catch {}
  window.dispatchEvent(
    new CustomEvent('sm:analytics', { detail: { name, ...details, page: location.pathname } }),
  );
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, page: location.pathname }),
    keepalive: true,
  }).catch(() => {});
}
track('page_view');
if (location.pathname.startsWith('/work/') && location.pathname !== '/work/')
  track('case_study_view');
document
  .querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]')
  .forEach((a) => a.addEventListener('click', () => track('email_click')));
document
  .querySelectorAll<HTMLAnchorElement>('[data-track]')
  .forEach((a) => a.addEventListener('click', () => track(a.dataset.track || 'link_click')));
const dialog = document.querySelector<HTMLDialogElement>('#website-dialog');
let opener: HTMLElement | null = null;
document.querySelectorAll<HTMLButtonElement>('[data-modal-open]').forEach((button) =>
  button.addEventListener('click', () => {
    opener = button;
    dialog?.showModal();
    track('website_cta_click');
  }),
);
document.querySelector('[data-modal-close]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const b = dialog.getBoundingClientRect();
    if (
      event.clientX < b.left ||
      event.clientX > b.right ||
      event.clientY < b.top ||
      event.clientY > b.bottom
    )
      dialog.close();
  }
});
dialog?.addEventListener('close', () => opener?.focus());
const nudge = document.querySelector<HTMLElement>('.website-nudge');
const trigger = document.querySelector('[data-nudge-trigger]');
let dismissed = false;
try {
  dismissed = sessionStorage.getItem('sm-nudge-dismissed') === 'yes';
} catch {}
if (trigger && nudge && !dismissed && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        nudge.hidden = false;
        observer.disconnect();
      }
    },
    { threshold: 0.2 },
  );
  observer.observe(trigger);
}
document.querySelector('.nudge-close')?.addEventListener('click', () => {
  if (nudge) nudge.hidden = true;
  try {
    sessionStorage.setItem('sm-nudge-dismissed', 'yes');
  } catch {}
});
document.querySelectorAll<HTMLButtonElement>('.tech-node').forEach((button) =>
  button.addEventListener('click', () => {
    document
      .querySelectorAll('.tech-node')
      .forEach((node) => node.setAttribute('aria-pressed', 'false'));
    button.setAttribute('aria-pressed', 'true');
    const name = document.querySelector('[data-tech-name]'),
      category = document.querySelector('[data-tech-category]'),
      desc = document.querySelector('[data-tech-description]'),
      link = document.querySelector<HTMLAnchorElement>('[data-tech-link]');
    if (name) name.textContent = button.textContent?.trim() + '.';
    if (category) category.textContent = button.dataset.category || '';
    if (desc) desc.textContent = button.dataset.description || '';
    if (link) link.href = `/services/${button.dataset.service}/`;
  }),
);
document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((button) =>
  button.addEventListener('click', () => {
    document
      .querySelectorAll('[data-filter]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    document.querySelectorAll<HTMLElement>('[data-category]').forEach((card) => {
      if (card.classList.contains('blog-card'))
        card.hidden =
          button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter;
    });
  }),
);
document.querySelector('[data-copy-link]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  try {
    await navigator.clipboard.writeText(location.origin + location.pathname);
    button.textContent = 'Link copied';
  } catch {
    button.textContent = 'Copy this page’s address from the address bar';
  }
});
