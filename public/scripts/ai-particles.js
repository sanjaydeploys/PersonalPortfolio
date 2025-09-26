// ai-particles.js
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ai-particles-bg');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Connect nearby particles
      particles.forEach(other => {
        const dist = Math.hypot(p.x - other.x, p.y - other.y);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(0,229,255,${1 - dist / 120})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
});
