/** SVG/canvas-native port of Kokonut UI Background Paths. MIT; see vendor/kokonutui.LICENSE.txt. */
import { motionAllowed } from './motion-state';
export function startRibbon(root: HTMLElement, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = 0,
    height = 0,
    time = 40,
    last = 0,
    raf = 0,
    visible = true;
  const pointer = { x: 0, y: 0, amount: 0, on: false };
  const layers = [
    { width: 0.65, opacity: 0.1, phase: 0.6, pace: 0.7, part: 0.45 },
    { width: 0.85, opacity: 0.16, phase: 0.3, pace: 0.85, part: 0.75 },
    { width: 1.1, opacity: 0.22, phase: 0, pace: 1, part: 1 },
  ];
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#65a4ff';
    ctx.lineCap = 'round';
    const band = Math.min(height, width * 1.1);
    for (const layer of layers) {
      ctx.lineWidth = layer.width;
      for (let i = 0; i < 6; i++) {
        const s = i / 5 - 0.5;
        const points: Array<[number, number]> = [];
        for (let k = 0; k <= 32; k++) {
          const u = -0.06 + (k / 32) * 1.12;
          const x = u * width;
          const t = time * layer.pace;
          const center =
            height * 0.51 -
            0.14 * (x - width / 2) +
            band * 0.1 * Math.sin(Math.PI * 2 * (0.75 * u + 0.1) + layer.phase + t * 0.35);
          const turn = 0.22 + 0.09 * Math.sin(t * 0.21 + layer.phase);
          const breathe = 0.3 * Math.sin(t * 0.5 + s * 4 + layer.phase);
          let y =
            center +
            s * band * 1.1 * Math.cos(Math.PI * (u - turn) + s * (0.6 + breathe) + layer.phase);
          if (pointer.amount > 0.001) {
            const dx = x - pointer.x,
              dy = y - pointer.y;
            const falloff = Math.exp(-(dx * dx + dy * dy) / (150 * 150));
            y += (dy / (Math.abs(dy) + 24)) * falloff * 56 * layer.part * pointer.amount;
          }
          points.push([x, y]);
        }
        ctx.globalAlpha = layer.opacity * (0.45 + 0.55 * (1 - Math.abs(s) * 2));
        ctx.beginPath();
        ctx.moveTo(...points[0]);
        for (let k = 1; k < points.length - 1; k++) {
          const p = points[k],
            next = points[k + 1];
          ctx.quadraticCurveTo(p[0], p[1], (p[0] + next[0]) / 2, (p[1] + next[1]) / 2);
        }
        ctx.lineTo(...points[points.length - 1]);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  };
  const loop = (now: number) => {
    raf = 0;
    if (!visible || document.hidden || !motionAllowed()) {
      draw();
      return;
    }
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    time += dt * 0.35;
    pointer.amount += ((pointer.on ? 1 : 0) - pointer.amount) * 0.08;
    draw();
    raf = requestAnimationFrame(loop);
  };
  const play = () => {
    if (!raf && visible && !document.hidden && motionAllowed()) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
    play();
  };
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
  }).observe(root);
  root.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.on = true;
    play();
  });
  root.addEventListener('pointerleave', () => (pointer.on = false));
  addEventListener('sm:motionchange', () => {
    if (!motionAllowed()) {
      cancelAnimationFrame(raf);
      raf = 0;
      pointer.on = false;
      pointer.amount = 0;
      draw();
    } else play();
  });
  document.addEventListener('visibilitychange', play);
  resize();
}
