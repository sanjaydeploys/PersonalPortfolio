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
      perspective: 1000,
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

  // --- General IntersectionObserver ---
  const generalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('animate');

        if (el.classList.contains('card')) el.classList.add('slide-left');
        else if (el.classList.contains('faq-item')) el.classList.add('fade-zoom');
        else if (el.classList.contains('tech-item')) el.classList.add('flip-in');
        else if (el.classList.contains('hero-section')) el.classList.add('fade-parallax');
        else if (el.classList.contains('hero-title')) el.classList.add('fade-glitch');
        else if (el.classList.contains('hero-img')) el.classList.add('zoom-rotate');
        else if (el.id === 'who-i-am') el.classList.add('fade-left');

        generalObserver.unobserve(el);
      });
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll(
    '.section, .card, .faq-item, .tech-item, .impact-item, .hero-section, .hero-title, .hero-img, #who-i-am'
  ).forEach((el) => generalObserver.observe(el));

  // --- Separate CTA Button Observer (Robust, No Parent Dependency) ---
  const ctaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const button = entry.target;
        button.classList.add('drop-init');

        // Trigger drop-in after slight delay
        setTimeout(() => {
          button.classList.add('drop-in');
        }, 100); // Slight delay after init

        ctaObserver.unobserve(button);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.cta-button').forEach((btn) => {
    ctaObserver.observe(btn);
  });
});
