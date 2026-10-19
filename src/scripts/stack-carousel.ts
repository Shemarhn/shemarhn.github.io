import { animate } from 'motion';
import { motionAllowed } from './motion-state';
const root = document.querySelector<HTMLElement>('[data-stack-carousel]')!;
const viewport = root.querySelector<HTMLElement>('[data-stack-viewport]')!,
  ring = root.querySelector<HTMLElement>('[data-stack-ring]')!;
const all = [...root.querySelectorAll<HTMLButtonElement>('[data-stack-card]')];
let cards = all,
  index = 0,
  cursor = 0,
  angle = 0,
  paused = false,
  visible = false,
  hovered = false,
  dragging = false,
  suppressClick = false;
let control: ReturnType<typeof animate> | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
const getRadius = () =>
  Math.max(innerWidth < 760 ? 340 : 590, cards.length * (innerWidth < 760 ? 34 : 43));
function render(value = angle) {
  angle = value;
  ring.style.transform = `translateZ(-${getRadius()}px) rotateY(${value}deg)`;
}
function position() {
  const step = 360 / cards.length;
  cards.forEach((card, i) => {
    card.style.transform = `rotateY(${i * step}deg) translateZ(${getRadius()}px)`;
  });
  render();
}
function announce() {
  const card = cards[index];
  if (!card) return;
  all.forEach((c) => {
    const selected = c === card;
    c.setAttribute('aria-hidden', String(!selected));
    c.setAttribute('aria-pressed', String(selected));
    c.tabIndex = selected ? 0 : -1;
    c.classList.toggle('active', selected);
  });
  root.querySelector('[data-stack-name]')!.textContent = `${card.dataset.name}.`;
  root.querySelector('[data-stack-category]')!.textContent = card.dataset.category || '';
  root.querySelector('[data-stack-description]')!.textContent = card.dataset.description || '';
  (root.querySelector('[data-stack-link]') as HTMLAnchorElement).href =
    `/services/${card.dataset.service}/`;
  root.querySelector('[data-stack-count]')!.textContent =
    `${String(index + 1).padStart(2, '0')} / ${cards.length}`;
  all.forEach((c) => {
    const i = cards.indexOf(c);
    if (i < 0) return;
    const distance = Math.min(
      (i - index + cards.length) % cards.length,
      (index - i + cards.length) % cards.length,
    );
    c.style.opacity =
      distance > 4 ? '0' : distance === 0 ? '1' : String(Math.max(0.2, 1 - distance * 0.18));
    c.style.pointerEvents = distance > 3 ? 'none' : 'auto';
  });
}
function go(next: number, user = false) {
  if (!cards.length) return;
  const moveFocus = all.includes(document.activeElement as HTMLButtonElement);
  cursor = next;
  index = ((next % cards.length) + cards.length) % cards.length;
  const target = (-next * 360) / cards.length;
  control?.stop();
  if (motionAllowed()) {
    control = animate(angle, target, {
      type: 'spring',
      stiffness: 72,
      damping: 21,
      mass: 0.8,
      onUpdate: (value) => render(value),
    });
  } else render(target);
  announce();
  if (moveFocus) cards[index].focus({ preventScroll: true });
  if (user) resetTimer();
}
function canAutoPlay() {
  return (
    visible &&
    !document.hidden &&
    !paused &&
    !hovered &&
    !dragging &&
    motionAllowed() &&
    !root.contains(document.activeElement)
  );
}
function resetTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    if (canAutoPlay()) go(cursor + 1);
  }, 5500);
}
function filter(category: string) {
  control?.stop();
  cards = all.filter((card) => category === 'All' || card.dataset.category === category);
  all.forEach((card) => (card.hidden = !cards.includes(card)));
  cursor = 0;
  index = 0;
  angle = 0;
  position();
  announce();
  resetTimer();
}
root.querySelectorAll<HTMLButtonElement>('[data-stack-filter]').forEach((button) => {
  button.disabled = false;
  button.addEventListener('click', () => {
    root
      .querySelectorAll('[data-stack-filter]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    filter(button.dataset.stackFilter || 'All');
  });
});
root.querySelector('[data-stack-prev]')?.addEventListener('click', () => go(cursor - 1, true));
root.querySelector('[data-stack-next]')?.addEventListener('click', () => go(cursor + 1, true));
const pause = root.querySelector<HTMLButtonElement>('[data-stack-pause]')!;
pause.addEventListener('click', () => {
  paused = !paused;
  pause.setAttribute('aria-pressed', String(paused));
  pause.textContent = paused ? 'Resume rotation' : 'Pause rotation';
  resetTimer();
});
all.forEach((card) =>
  card.addEventListener('click', () => {
    if (suppressClick) return;
    const target = cards.indexOf(card);
    if (target < 0) return;
    let delta = target - index;
    if (delta > cards.length / 2) delta -= cards.length;
    if (delta < -cards.length / 2) delta += cards.length;
    go(cursor + delta, true);
  }),
);
viewport.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    go(cursor + (event.key === 'ArrowRight' ? 1 : -1), true);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    go(0, true);
  }
  if (event.key === 'End') {
    event.preventDefault();
    go(cards.length - 1, true);
  }
});
let startX = 0,
  startY = 0,
  startAngle = 0;
viewport.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  startX = event.clientX;
  startY = event.clientY;
  startAngle = angle;
  suppressClick = false;
  dragging = false;
});
viewport.addEventListener('pointermove', (event) => {
  if (!(event.buttons & 1)) return;
  const dx = event.clientX - startX,
    dy = event.clientY - startY;
  if (!dragging && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    dragging = true;
    suppressClick = true;
    control?.stop();
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('dragging');
  }
  if (dragging) render(startAngle + dx * 0.22);
});
const endDrag = () => {
  if (dragging) {
    dragging = false;
    viewport.classList.remove('dragging');
    go(Math.round(-angle / (360 / cards.length)), true);
    setTimeout(() => (suppressClick = false), 0);
  }
};
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('pointerenter', () => (hovered = true));
viewport.addEventListener('pointerleave', () => (hovered = false));
new IntersectionObserver(
  ([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resetTimer();
    else if (timer) clearInterval(timer);
  },
  { threshold: 0.15 },
).observe(root);
new ResizeObserver(position).observe(viewport);
document.addEventListener('visibilitychange', resetTimer);
addEventListener('sm:motionchange', () => {
  control?.stop();
  go(cursor);
  resetTimer();
});
const indexToggle = root.querySelector<HTMLButtonElement>('[data-stack-index-toggle]')!,
  indexPanel = root.querySelector<HTMLElement>('#stack-index')!;
indexToggle.addEventListener('click', () => {
  indexPanel.hidden = !indexPanel.hidden;
  indexToggle.setAttribute('aria-expanded', String(!indexPanel.hidden));
  indexToggle.innerHTML = indexPanel.hidden
    ? 'View all <span aria-hidden="true">↗</span>'
    : 'Close index <span aria-hidden="true">×</span>';
});
root.querySelectorAll<HTMLButtonElement>('[data-stack-pick]').forEach((button) =>
  button.addEventListener('click', () => {
    const card = all.find((c) => c.dataset.stackCard === button.dataset.stackPick)!;
    if (!cards.includes(card)) {
      root
        .querySelectorAll('[data-stack-filter]')
        .forEach((b) =>
          b.setAttribute('aria-pressed', String((b as HTMLElement).dataset.stackFilter === 'All')),
        );
      filter('All');
    }
    go(cards.indexOf(card), true);
  }),
);
root.classList.add('stack-ready');
filter('All');
