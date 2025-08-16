document.addEventListener('DOMContentLoaded', () => {
  // --- General IntersectionObserver for Sections ---
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('animate');
          if (el.classList.contains('who-i-am')) {
            el.classList.add('fade-left');
          } else if (el.classList.contains('faqs')) {
            el.classList.add('fade-zoom');
          } else if (el.classList.contains('chatbot-section')) {
            el.classList.add('fade-up');
          }
          sectionObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '50px' }
  );

  // Observe all sections explicitly
  document.querySelectorAll('.section, .who-i-am, .faqs, .chatbot-section').forEach((el) => {
    sectionObserver.observe(el);
  });

  // Fallback to ensure visibility if observer fails
  setTimeout(() => {
    document.querySelectorAll('.section, .who-i-am, .faqs, .chatbot-section').forEach((el) => {
      if (!el.classList.contains('animate')) {
        el.classList.add('animate');
      }
    });
  }, 1000);

  // --- FAQ Items Observer ---
  const faqObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate', 'fade-zoom');
          faqObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.faq-item').forEach((el) => faqObserver.observe(el));

  // --- CTA Button Observer ---
  const ctaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const button = entry.target;
          button.classList.add('drop-init');
          setTimeout(() => {
            button.classList.add('drop-in');
          }, 100);
          ctaObserver.unobserve(button);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.cta-button').forEach((btn) => ctaObserver.observe(btn));

  // --- Matrix Background (if canvas exists) ---
  const canvas = document.getElementById('matrix-bg');
  if (canvas) {
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
  }
});

// Define animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .fade-left {
    animation: fadeLeft 0.6s ease forwards;
  }
  .fade-zoom {
    animation: fadeZoom 0.6s ease forwards;
  }
  .fade-up {
    animation: fadeUp 0.6s ease forwards;
  }
  .drop-init {
    opacity: 0;
    transform: translateY(20px);
  }
  .drop-in {
    animation: dropIn 0.5s ease forwards;
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeZoom {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
