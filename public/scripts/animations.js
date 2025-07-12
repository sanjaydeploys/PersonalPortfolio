document.addEventListener('DOMContentLoaded', () => {
  // Initialize 3D tilt animation on impact cards
const tiltCards = document.querySelectorAll('.impact-item.animate-3d-tilt');
if (tiltCards.length > 0 && window.VanillaTilt) {
  VanillaTilt.init(tiltCards, {
    max: 10,
    speed: 400,
    glare: true,
    'max-glare': 0.2,
    scale: 1.05,
    perspective: 1000
  });
}

  // Matrix background animation
  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00E5FF';
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, i) => {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * fontSize;
      ctx.fillText(text, x, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }

  setInterval(drawMatrix, 50);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops.length = Math.floor(canvas.width / fontSize);
    drops.fill(1);
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.section, .card, .faq-item, .tech-item, .impact-item').forEach((el) => {
    observer.observe(el);
  });
});
