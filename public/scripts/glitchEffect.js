// glitchEffect.js
document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('hero-title');

  const glitch = () => {
    const x = Math.floor(Math.random() * 6 - 3) + 'px';
    const y = Math.floor(Math.random() * 6 - 3) + 'px';

    title.style.setProperty('--x', x);
    title.style.setProperty('--y', y);

    setTimeout(() => {
      title.style.setProperty('--x', '0px');
      title.style.setProperty('--y', '0px');
    }, 80);
  };

  // Trigger glitch occasionally
  const startGlitch = () => {
    setInterval(() => {
      if (Math.random() < 0.3) glitch(); // ~30% chance to glitch every 400ms
    }, 400);
  };

  startGlitch();
});
