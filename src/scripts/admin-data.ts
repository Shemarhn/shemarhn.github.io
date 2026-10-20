export {};

const message = document.querySelector<HTMLElement>('[data-data-message]')!;
const inquiries = document.querySelector<HTMLElement>('#inquiry-list')!;
const references = document.querySelector<HTMLElement>('#reference-delete-list')!;

async function api(path: string, method = 'GET') {
  const response = await fetch(path, {
    method,
    headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' },
  });
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data.error || 'Request failed'));
  return data;
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function removeButton(label: string, path: string, detail: string) {
  const button = element('button', label, 'button secondary');
  button.type = 'button';
  button.addEventListener('click', async () => {
    if (!window.confirm(`Remove ${detail} from the website database?`)) return;
    button.disabled = true;
    try {
      await api(path, 'DELETE');
      message.textContent = `${detail} removed from the website database.`;
      await load();
    } catch (error) {
      message.textContent = (error as Error).message;
      button.disabled = false;
    }
  });
  return button;
}

async function load() {
  message.textContent = 'Loading private website records…';
  try {
    const [inquiryData, referenceData] = await Promise.all([
      api('/api/admin/inquiries'),
      api('/api/admin/testimonials'),
    ]);
    inquiries.replaceChildren();
    for (const row of inquiryData.inquiries as Record<string, unknown>[]) {
      const payload = row.payload as Record<string, unknown>;
      const card = element('article', undefined, 'admin-entry');
      card.append(
        element('p', String(row.created_at || ''), 'admin-status'),
        element('h2', `${payload.name || 'Unnamed'} / ${payload.company || 'Independent'}`),
        element('p', `${payload.email || ''} · ${payload.service || ''}`),
        element('p', `Delivery: ${row.delivery || 'No delivery state'}`, 'small muted'),
      );
      card.append(removeButton('Remove website copy', `/api/admin/inquiries/${row.id}`, `inquiry ${row.id}`));
      inquiries.append(card);
    }
    if (!(inquiryData.inquiries as unknown[]).length) inquiries.append(element('p', 'No website inquiries stored.'));

    references.replaceChildren();
    for (const row of referenceData.testimonials as Record<string, unknown>[]) {
      const card = element('article', undefined, 'admin-entry');
      card.append(
        element('p', String(row.status || ''), 'admin-status'),
        element('h2', `${row.name || 'Unnamed'} / ${row.company || 'Independent'}`),
        element('p', `${row.email || 'No email'} · ${row.service || ''}`),
      );
      card.append(removeButton('Remove reference copy', `/api/admin/testimonials/${row.id}`, `reference ${row.id}`));
      references.append(card);
    }
    if (!(referenceData.testimonials as unknown[]).length) references.append(element('p', 'No reference submissions stored.'));
    message.textContent = 'Private website records loaded.';
  } catch (error) {
    message.textContent = (error as Error).message;
  }
}

document.querySelector('[data-data-refresh]')?.addEventListener('click', () => void load());
void load();
