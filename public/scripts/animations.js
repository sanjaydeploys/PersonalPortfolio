document.addEventListener('DOMContentLoaded', () => {
  // --- VanillaTilt for Impact Cards ---
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

  // --- Matrix Background ---
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

  // --- Advanced Intersection Animations ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('animate');

          // Custom animation enhancements
          if (el.classList.contains('card')) el.classList.add('slide-left');
          else if (el.classList.contains('faq-item')) el.classList.add('fade-zoom');
          else if (el.classList.contains('tech-item')) el.classList.add('flip-in');
          else if (el.classList.contains('hero-section')) el.classList.add('fade-parallax');
          else if (el.classList.contains('hero-title')) el.classList.add('fade-glitch');
          else if (el.classList.contains('hero-img')) el.classList.add('zoom-rotate');
        else if (el.classList.contains('hero-cta')) {
  const buttons = el.querySelectorAll('.cta-button');
  buttons.forEach((btn, i) => {
    btn.classList.add('drop-init'); // apply initial position instantly
    setTimeout(() => {
      btn.classList.add('drop-in');
    }, i * 150); // slightly more delay for dramatic effect
  });
}

          } else if (el.id === 'who-i-am') el.classList.add('fade-left');

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.25 }
  );

  // Target sections
  document.querySelectorAll(
    '.section, .card, .faq-item, .tech-item, .impact-item, .hero-section, .hero-title, .hero-img, .hero-cta, #who-i-am'
  ).forEach((el) => observer.observe(el));
});
