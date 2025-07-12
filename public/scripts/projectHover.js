document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card, .impact-item');

  cards.forEach((card) => {
    const canvas = card.querySelector('.card-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = card.offsetWidth;
      canvas.height = card.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`; // Cyan-orange hues
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Handle mouse movement
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      // Create particles on hover
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    });

    // Clear particles when mouse leaves
    card.addEventListener('mouseleave', () => {
      particles = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.size > 0.2);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();
  });
});
