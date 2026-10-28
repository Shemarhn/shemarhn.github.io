// Apply the saved global motion preference before the first layout.
try {
  document.documentElement.classList.toggle(
    'motion-paused',
    localStorage.getItem('sm-motion') === 'paused',
  );
} catch {}
