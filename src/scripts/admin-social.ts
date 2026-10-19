export {};

const message = document.querySelector<HTMLElement>('[data-social-message]')!;
const mode = document.querySelector<HTMLElement>('[data-social-mode]')!;
const list = document.querySelector<HTMLElement>('#social-list')!;

async function api(path: string, method = 'GET', body?: unknown) {
  const response = await fetch(`/api/admin/social${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
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

async function save(id: string, status: string, content: string) {
  await api(`/${encodeURIComponent(id)}`, 'PATCH', { status, content });
}

async function load() {
  message.textContent = 'Loading social drafts…';
  try {
    const data = await api('');
    mode.textContent = `Publishing mode: ${String(data.mode || 'review')}. Review mode does not post without approval.`;
    list.replaceChildren();
    for (const post of data.posts as Record<string, unknown>[]) {
      const card = element('article', undefined, 'admin-entry');
      const heading = element('h2', `${String(post.platform).toUpperCase()} / ${post.article_slug}`);
      const status = element('p', String(post.status), 'admin-status');
      const link = element('a', String(post.article_url));
      link.href = String(post.article_url);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const field = element('div', undefined, 'field');
      const label = element('label', 'Platform copy');
      const textarea = element('textarea');
      textarea.value = String(post.content || '');
      textarea.maxLength = post.platform === 'x' ? 240 : 2800;
      textarea.rows = post.platform === 'x' ? 5 : 10;
      field.append(label, textarea);
      card.append(status, heading, link, field);
      if (post.last_error) card.append(element('p', `Last error: ${post.last_error}`, 'form-message'));
      if (post.provider_url) {
        const published = element('a', 'Open published post ↗', 'text-link');
        published.href = String(post.provider_url);
        published.target = '_blank';
        published.rel = 'noopener noreferrer';
        card.append(published);
      }
      const actions = element('div', undefined, 'admin-actions');
      if (post.status !== 'published') {
        const draft = element('button', 'Save draft', 'button secondary');
        draft.type = 'button';
        draft.addEventListener('click', async () => {
          draft.disabled = true;
          try {
            await save(String(post.id), 'draft', textarea.value);
            message.textContent = 'Draft saved.';
            await load();
          } catch (error) {
            message.textContent = (error as Error).message;
            draft.disabled = false;
          }
        });
        const approve = element('button', 'Approve', 'button secondary');
        approve.type = 'button';
        approve.addEventListener('click', async () => {
          approve.disabled = true;
          try {
            await save(String(post.id), 'approved', textarea.value);
            message.textContent = 'Approved. The scheduler can publish it.';
            await load();
          } catch (error) {
            message.textContent = (error as Error).message;
            approve.disabled = false;
          }
        });
        const publish = element('button', 'Publish now', 'button');
        publish.type = 'button';
        publish.addEventListener('click', async () => {
          publish.disabled = true;
          try {
            await save(String(post.id), 'approved', textarea.value);
            await api(`/${encodeURIComponent(String(post.id))}/publish`, 'POST', {});
            message.textContent = 'Publishing requested. Refresh shortly to confirm the provider result.';
            setTimeout(() => void load(), 1800);
          } catch (error) {
            message.textContent = (error as Error).message;
            publish.disabled = false;
          }
        });
        const skip = element('button', 'Skip', 'button secondary');
        skip.type = 'button';
        skip.addEventListener('click', async () => {
          skip.disabled = true;
          try {
            await save(String(post.id), 'skipped', textarea.value);
            await load();
          } catch (error) {
            message.textContent = (error as Error).message;
            skip.disabled = false;
          }
        });
        actions.append(draft, approve, publish, skip);
      }
      card.append(actions);
      list.append(card);
    }
    if (!(data.posts as unknown[]).length) list.append(element('p', 'No social drafts yet. Sync published articles first.'));
    message.textContent = 'Social queue loaded.';
  } catch (error) {
    message.textContent = (error as Error).message;
  }
}

document.querySelector('[data-social-refresh]')?.addEventListener('click', () => void load());
document.querySelector('[data-social-sync]')?.addEventListener('click', async () => {
  message.textContent = 'Syncing published articles…';
  try {
    await api('/sync', 'POST', {});
    await load();
    message.textContent = 'Published articles synced into the review queue.';
  } catch (error) {
    message.textContent = (error as Error).message;
  }
});
void load();
