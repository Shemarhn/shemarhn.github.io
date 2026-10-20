export const motionAllowed = () =>
  !matchMedia('(prefers-reduced-motion: reduce)').matches &&
  !document.documentElement.classList.contains('motion-paused');
