// glitch.js
document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('hero-title');

  function glitchOnce() {
    const randX = Math.floor(Math.random() * 8 - 4) + 'px';
    const randY = Math.floor(Math.random() * 8 - 4) + 'px';
    const randScale = 1 + (Math.random() * 0.04 - 0.02);

    title.style.setProperty('--glitch-x', randX);
    title.style.setProperty('--glitch-y', randY);
    title.style.setProperty('--glitch-scale', randScale);

    setTimeout(() => {
      title.style.setProperty('--glitch-x', '0px');
      title.style.setProperty('--glitch-y', '0px');
      title.style.setProperty('--glitch-scale', '1');
    }, 80);
  }

  function startGlitching() {
    setInterval(() => {
      if (Math.random() < 0.3) glitchOnce();
    }, 250);
  }

  startGlitching();
});
