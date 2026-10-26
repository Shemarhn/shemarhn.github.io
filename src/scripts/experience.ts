import { animate, inView, scroll } from 'motion';
import { motionAllowed } from './motion-state';
const root = document.documentElement;
// Content is visible until the motion module has loaded successfully.
document.querySelectorAll<HTMLElement>('.reveal').forEach((el, index) => {
  if (!motionAllowed()) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  inView(
    el,
    () => {
      el.classList.add('visible');
      if (!motionAllowed()) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        return;
      }
      animate(
        el,
        { opacity: [0, 1], y: [32, 0] },
        { duration: 0.8, delay: Math.min((index % 3) * 0.06, 0.12), ease: [0.22, 1, 0.36, 1] },
      );
    },
    { amount: 0.12 },
  );
});
addEventListener('sm:motionchange', () => {
  if (!motionAllowed())
    document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
});
const finePointer = matchMedia('(pointer:fine)');
document.querySelectorAll<HTMLElement>('.button,.nav-cta,.monogram-replay').forEach((button) => {
  let bounds: DOMRect | null = null;
  let control: ReturnType<typeof animate> | undefined;
  button.addEventListener('pointerenter', () => {
    bounds = button.getBoundingClientRect();
  });
  button.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || !motionAllowed() || !bounds) return;
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12,
      y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
    control?.stop();
    control = animate(button, { x, y }, { type: 'spring', stiffness: 240, damping: 22, mass: 0.4 });
  });
  button.addEventListener('pointerleave', () => {
    control?.stop();
    control = animate(
      button,
      { x: 0, y: 0 },
      { duration: motionAllowed() ? 0.5 : 0, ease: [0.22, 1, 0.36, 1] },
    );
    bounds = null;
  });
});
document.querySelectorAll<HTMLElement>('.project-art').forEach((art) => {
  const card = art.closest('a');
  if (!card) return;
  let control: ReturnType<typeof animate> | undefined;
  card.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || !motionAllowed()) return;
    const e = event as PointerEvent;
    const box = card.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5,
      y = (e.clientY - box.top) / box.height - 0.5;
    art.style.setProperty('--spot-x', `${(x + 0.5) * 100}%`);
    art.style.setProperty('--spot-y', `${(y + 0.5) * 100}%`);
    control?.stop();
    control = animate(art, { rotateX: -y * 4, rotateY: x * 5 }, { duration: 0.35 });
  });
  card.addEventListener('pointerleave', () => {
    control?.stop();
    animate(art, { rotateX: 0, rotateY: 0 }, { duration: motionAllowed() ? 0.65 : 0 });
  });
});
const hero = document.querySelector<HTMLElement>('[data-sm-hero]');
if (hero) {
  import('./ribbon').then(({ startRibbon }) => {
    const canvas = hero.querySelector<HTMLCanvasElement>('[data-ribbon]');
    if (canvas) startRibbon(hero, canvas);
  });
  const frame = hero.querySelector<HTMLElement>('[data-logo-tilt]')!;
  let tilt: ReturnType<typeof animate> | undefined;
  hero.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || !motionAllowed()) return;
    const box = hero.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5,
      y = (event.clientY - box.top) / box.height - 0.5;
    hero.style.setProperty('--light-x', `${(x + 0.5) * 100}%`);
    hero.style.setProperty('--light-y', `${(y + 0.5) * 100}%`);
    tilt?.stop();
    tilt = animate(
      frame,
      { rotateX: -y * 12, rotateY: x * 16 },
      { type: 'spring', stiffness: 90, damping: 22 },
    );
  });
  hero.addEventListener('pointerleave', () => {
    tilt?.stop();
    tilt = animate(frame, { rotateX: 0, rotateY: 0 }, { duration: motionAllowed() ? 1 : 0 });
  });
  let assembly:
    { pause: () => unknown; resume: () => unknown; complete: () => unknown } | undefined;
  const assemble = async () => {
    if (!motionAllowed()) return;
    const { createTimeline, stagger, svg } = await import('animejs');
    const facets = hero.querySelectorAll<SVGGElement>('[data-sm-facet]');
    const nodes = hero.querySelectorAll<SVGCircleElement>('[data-sm-node]');
    assembly?.complete();
    const tl = createTimeline({
      defaults: { ease: 'outExpo' },
      onComplete: () => hero.classList.add('assembled'),
    });
    facets.forEach((facet, i) => tl.add(facet, {
      translateX: [i % 2 ? -80 : 80, 0],
      translateY: [(i - 3) * 35, 0],
      opacity: [0, 1], duration: 1600,
    }, i * 65));
    tl.add(
        svg.createDrawable(hero.querySelectorAll('[data-sm-orbit]')),
        { draw: ['0 0', '0 1'], duration: 1100, delay: stagger(110) },
        700,
      )
      .add(nodes, { scale: [0, 1], opacity: [0, 1], duration: 850, delay: stagger(160) }, 1050);
    assembly = tl;
  };
  void assemble();
  hero.querySelector('[data-logo-replay]')?.addEventListener('click', () => void assemble());
  addEventListener('sm:motionchange', () => {
    if (!motionAllowed()) {
      assembly?.complete();
      tilt?.stop();
      frame.style.transform = 'none';
    }
  });
  const visual = hero.querySelector<HTMLElement>('.hero-logo-frame');
  if (visual && motionAllowed()) {
    scroll(
      (progress) => {
        if (motionAllowed()) visual.style.setProperty('--scroll-lift', `${progress * 50}px`);
      },
      { target: hero, offset: ['start start', 'end start'] },
    );
  }
}
if (document.querySelector('[data-stack-carousel]')) import('./stack-carousel');
root.classList.add('experience-ready');
