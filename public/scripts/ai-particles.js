document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ai-particles-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y, vx, vy, size, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }
    }

    const numParticles = 100;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const vx = (Math.random() - 0.5) * 2;
      const vy = (Math.random() - 0.5) * 2;
      const size = Math.random() * 2 + 1;
      const color = `rgba(0, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.5)`;
      particles.push(new Particle(x, y, vx, vy, size, color));
    }

    const connectThreshold = 120;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectThreshold) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / connectThreshold})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  const banner = document.querySelector('.hero-banner');
  if (banner) {
    let lastScroll = 0;
    let isRemoved = false;

    window.addEventListener('scroll', () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 50) {
        if (!isRemoved) {
          banner.classList.add('hide');
          setTimeout(() => {
            banner.remove();
            isRemoved = true;
          }, 500);
        }
      } else if (current <= 50 && isRemoved) {
        banner.classList.remove('hide');
        banner.classList.add('show');
        isRemoved = false;
      }

      lastScroll = current;
    });
  }

  const generalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('animate');

        if (el.classList.contains('hero-img')) el.classList.add('zoom-rotate');

        generalObserver.unobserve(el);
      });
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll('.hero-img').forEach((el) => generalObserver.observe(el));
});
