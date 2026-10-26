// Included only by an explicit QA build. The normal production build eliminates this import.
import axe from 'axe-core';
const root = document.documentElement;
for (const type of ['largest-contentful-paint', 'paint']) {
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint')
          root.dataset.smLcp = String(entry.startTime);
        if (entry.name === 'first-contentful-paint') root.dataset.smFcp = String(entry.startTime);
      }
    }).observe({ type, buffered: true });
  } catch {}
}
let cls = 0;
try {
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as (PerformanceEntry & {
      hadRecentInput: boolean;
      value: number;
    })[]) {
      if (!entry.hadRecentInput) cls += entry.value;
    }
    root.dataset.smCls = String(cls);
  }).observe({ type: 'layout-shift', buffered: true });
} catch {}
async function audit() {
  await document.fonts.ready;
  root.classList.add('qa-auditing');
  const result = await axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] },
  });
  root.dataset.smAudit = JSON.stringify({
    url: location.pathname,
    viewport: { width: innerWidth, height: innerHeight },
    overflow: document.documentElement.scrollWidth > innerWidth,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    })),
    passes: result.passes.length,
  });
  root.classList.remove('qa-auditing');
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  root.dataset.smLoad = JSON.stringify({
    responseStart: nav.responseStart,
    domContentLoaded: nav.domContentLoadedEventEnd,
    transferSize: nav.transferSize,
  });
}
if (document.readyState === 'complete') audit();
else addEventListener('load', audit, { once: true });
