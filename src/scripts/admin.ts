const message = document.querySelector<HTMLElement>('[data-admin-message]')!;
const list = document.querySelector('#admin-list')!;
function el<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) {
  const e = document.createElement(tag);
  if (text) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
async function api(path: string, method = 'GET', body?: unknown) {
  const r = await fetch(`/api/admin${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await r.json()) as Record<string, unknown>;
  if (!r.ok) throw Error(String(data.error || 'Request failed'));
  return data;
}
async function load() {
  message.textContent = 'Loading…';
  try {
    const data = await api('/testimonials');
    list.replaceChildren();
    for (const t of data.testimonials as Record<string, unknown>[]) {
      const card = el('article', undefined, 'admin-entry');
      card.append(
        el('p', String(t.status), 'admin-status'),
        el('h2', `${t.name} / ${t.company || 'Independent'}`),
        el('p', `${t.email || 'No email'} · ${t.service}`),
        el('blockquote', String(t.quote)),
      );
      const perms = el(
        'p',
        `Identity consent: ${t.identity_consent ? 'yes' : 'no'} · Value consent: ${t.value_consent ? 'yes' : 'no'} · Owner value authorization: ${t.owner_value_authorized ? 'yes' : 'no'} · Entered by: ${t.source}`,
      );
      perms.className = 'small muted';
      card.append(perms);
      if (t.project_value)
        card.append(el('p', `PRIVATE project value: ${t.project_value}`, 'small'));
      const controls = el('div', undefined, 'form-grid');
      const quoteField = el('div', undefined, 'field full');
      const quoteLabel = el('label', 'Quote (changes require client agreement)');
      const quote = el('textarea');
      quote.value = String(t.quote);
      quote.id = `quote-${t.id}`;
      quoteLabel.htmlFor = quote.id;
      quote.maxLength = 4000;
      quoteField.append(quoteLabel, quote);
      controls.append(quoteField);
      const field = el('div', undefined, 'field');
      const label = el('label', 'Related case study');
      const select = el('select');
      select.id = `case-${t.id}`;
      label.htmlFor = select.id;
      for (const value of ['', 'northstar', 'cedarfield', 'harborlight']) {
        const opt = el('option', value || 'None');
        opt.value = value;
        select.append(opt);
      }
      select.value = String(t.case_study || '');
      field.append(label, select);
      controls.append(field);
      const notesField = el('div', undefined, 'field');
      const notesLabel = el('label', 'Internal moderation note');
      const notes = el('input');
      notes.id = `note-${t.id}`;
      notes.maxLength = 1000;
      notesLabel.htmlFor = notes.id;
      notes.value = String(t.moderation_note || '');
      notesField.append(notesLabel, notes);
      controls.append(notesField);
      card.append(controls);
      const verifyLabel = el('label', undefined, 'checkbox');
      const verified = el('input');
      verified.type = 'checkbox';
      verified.checked = Boolean(t.verified);
      verifyLabel.append(
        verified,
        document.createTextNode('I have verified the client relationship.'),
      );
      const valueLabel = el('label', undefined, 'checkbox');
      const showValue = el('input');
      showValue.type = 'checkbox';
      showValue.checked = Boolean(t.show_value);
      valueLabel.append(
        showValue,
        document.createTextNode(
          'Approve public value display (requires consent or owner authorization).',
        ),
      );
      card.append(verifyLabel, valueLabel);
      const actions = el('div', undefined, 'admin-actions');
      for (const status of ['pending', 'approved', 'rejected', 'needs_changes']) {
        const b = el(
          'button',
          status === 'approved' ? 'Approve & publish' : status.replace('_', ' '),
          'button secondary',
        );
        b.type = 'button';
        b.addEventListener('click', async () => {
          b.disabled = true;
          try {
            await api(`/testimonials/${t.id}`, 'PATCH', {
              status,
              quote: quote.value,
              case_study: select.value,
              show_value: showValue.checked,
              verified: verified.checked,
              moderation_note: notes.value,
            });
            await load();
            message.textContent = 'Review saved.';
          } catch (error) {
            message.textContent = (error as Error).message;
            b.disabled = false;
          }
        });
        actions.append(b);
      }
      card.append(actions);
      list.append(card);
    }
    message.textContent = (data.testimonials as unknown[]).length
      ? 'Submissions loaded.'
      : 'No references have been submitted yet.';
  } catch (error) {
    message.textContent = (error as Error).message;
  }
}
document.querySelector('[data-admin-refresh]')?.addEventListener('click', load);
document.querySelector('[data-admin-new]')?.addEventListener('click', () => {
  const e = document.querySelector<HTMLElement>('#admin-editor')!;
  e.hidden = !e.hidden;
});
document
  .querySelector<HTMLFormElement>('#admin-create')
  ?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const b = form.querySelector<HTMLButtonElement>('[type=submit]')!;
    b.disabled = true;
    try {
      await api('/testimonials', 'POST', Object.fromEntries(new FormData(form)));
      form.reset();
      await load();
      message.textContent = 'Owner-entered reference saved as pending.';
    } catch (error) {
      message.textContent = (error as Error).message;
    } finally {
      b.disabled = false;
    }
  });
load();
const deliveryList = document.querySelector('#delivery-list');
async function loadDeliveries() {
  if (!deliveryList) return;
  try {
    const data = await api('/deliveries');
    deliveryList.replaceChildren();
    for (const job of data.deliveries as Record<string, unknown>[]) {
      const card = el('article', undefined, 'admin-entry');
      card.append(
        el('p', `${job.kind} / ${job.status}`, 'admin-status'),
        el('p', String(job.id), 'mono'),
        el('p', `${job.attempts} attempts · ${job.last_error || 'No recorded error'}`, 'small'),
      );
      if (job.status === 'failed') {
        const retry = el('button', 'Retry after investigation', 'button secondary');
        retry.addEventListener('click', async () => {
          retry.disabled = true;
          try {
            await api(`/deliveries/${job.id}/retry`, 'POST', {});
            await loadDeliveries();
          } catch (error) {
            message.textContent = (error as Error).message;
            retry.disabled = false;
          }
        });
        card.append(retry);
      }
      deliveryList.append(card);
    }
    if (!(data.deliveries as unknown[]).length)
      deliveryList.append(el('p', 'No delivery jobs yet.'));
  } catch (error) {
    deliveryList.textContent = (error as Error).message;
  }
}
document.querySelector('[data-deliveries-refresh]')?.addEventListener('click', loadDeliveries);
loadDeliveries();
