document.addEventListener('DOMContentLoaded', () => {
  // --- Tilt animation remains unchanged ---
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
  // Hero animations
  const heroText = document.querySelector('.hero-text');
  const heroImage = document.querySelector('.hero-image');
  const ctaButtons = document.querySelectorAll('.cta-button');

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        heroText.classList.add('fade-zoom-up');
        heroImage.classList.add('fade-zoom-up');
        ctaButtons.forEach((btn, i) => {
          setTimeout(() => {
            btn.classList.add('cta-slide-up');
          }, i * 150);
        });
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (heroText && heroImage) {
    heroObserver.observe(heroText);
  }

  // About Section Animation
  const aboutHeading = document.querySelector('#who-i-am-title');
  const aboutParas = document.querySelectorAll('#who-i-am p');

  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutHeading.classList.add('slide-left');
        aboutParas.forEach((p, i) => {
          setTimeout(() => {
            p.classList.add('fade-up');
          }, i * 200);
        });
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (aboutHeading) {
    aboutObserver.observe(aboutHeading);
  }

  // --- Matrix Background Animation ---
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

  // --- Improved Intersection Observer ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Delay animation for stagger effect
          setTimeout(() => {
            el.classList.add('animate');

            // Optional: Add extra class for different effects
            if (el.classList.contains('card')) {
              el.classList.add('slide-left');
            } else if (el.classList.contains('faq-item')) {
              el.classList.add('fade-zoom');
            } else if (el.classList.contains('tech-item')) {
              el.classList.add('flip-in');
            } else {
              el.classList.add('fade-up');
            }
          }, index * 100); // stagger delay

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.section, .card, .faq-item, .tech-item, .impact-item').forEach((el) => {
    observer.observe(el);
  });
});
