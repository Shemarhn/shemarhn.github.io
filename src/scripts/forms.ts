import { attribution, track } from './site';
type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
    smTurnstileReady?: () => void;
  }
}
const forms = document.querySelectorAll<HTMLFormElement>('#inquiry-form,#testimonial-form');
const widgets = new WeakMap<HTMLFormElement, string>();
let turnstileRequested = false;
function renderChallenges() {
  forms.forEach((form) => {
    const el = form.querySelector<HTMLElement>('[data-turnstile]');
    if (el && form.dataset.turnstileKey && window.turnstile && !widgets.has(form)) {
      widgets.set(
        form,
        window.turnstile.render(el, {
          sitekey: form.dataset.turnstileKey,
          theme: 'dark',
          action: form.id === 'inquiry-form' ? 'inquiry' : 'testimonial',
        }),
      );
    }
  });
}
window.smTurnstileReady = renderChallenges;
forms.forEach((form) => {
  const params = new URLSearchParams(location.search);
  if (form.id === 'inquiry-form') {
    const select = form.querySelector<HTMLSelectElement>('[name=service]');
    const raw = params.get('service') || '';
    const aliases: Record<string, string> = {
      'Linux & Systems': 'Linux / Systems',
      'Workflow Automation': 'Automation',
      'Workflow automation': 'Automation',
      'Backup & Disaster Recovery': 'Backup / Disaster Recovery',
      'DevOps & Infrastructure as Code': 'DevOps / IaC',
      'Maintenance & Support': 'Maintenance',
      'Agency & MSP Partnership': 'Agency / MSP Partnership',
      'Website projects': 'Website Development',
      'Infrastructure assessment': 'Cloud Infrastructure',
      'Documentation review': 'Infrastructure Documentation',
      'Cloud & Linux engineering': 'Linux / Systems',
      'Ongoing maintenance': 'Maintenance',
    };
    if (select) {
      const desired = aliases[raw] || raw;
      if ([...select.options].some((o) => o.value === desired)) select.value = desired;
    }
  }
  if (form.dataset.turnstileKey && !turnstileRequested) {
    turnstileRequested = true;
    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=smTurnstileReady&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.append(script);
  }
  const requestId = crypto.randomUUID();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const message = form.querySelector<HTMLElement>('.form-message')!;
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    button.disabled = true;
    message.textContent = 'Sending securely…';
    message.dataset.error = 'false';
    const data = new FormData(form);
    const payload: Record<string, unknown> = Object.fromEntries(data.entries());
    payload.metadata = attribution();
    payload.requestId = requestId;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };
      if (!response.ok || !result.ok)
        throw new Error(result.error || 'Your message could not be saved. Please try again.');
      track(form.id === 'inquiry-form' ? 'contact_submission' : 'testimonial_submission', {
        service: String(payload.service || ''),
      });
      const origin = attribution();
      if (origin.cta === 'Service page') track('service_conversion');
      if (origin.cta === 'Insight article') track('blog_conversion');
      if (form.id === 'inquiry-form') location.assign('/thank-you/');
      else {
        form.reset();
        message.textContent =
          'Thank you. Your reference has been saved for review. It will only appear publicly after approval and with your permission.';
        button.hidden = true;
      }
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : 'Unable to send. Please email hello@shemarmarks.com.';
      message.dataset.error = 'true';
      if (window.turnstile) window.turnstile.reset(widgets.get(form));
      button.disabled = false;
    }
  });
});
