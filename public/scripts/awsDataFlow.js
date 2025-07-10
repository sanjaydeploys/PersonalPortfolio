const AWSDataFlow = {
  init(canvas, services, connections, draw) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isAnimating = false;
    let selectedProject = 'all';

    // Particle class
    class Particle {
      constructor(from, to, speed, project) {
        this.from = from;
        this.to = to;
        this.project = project;
        this.progress = 0;
        this.speed = speed;
        this.x = from.x;
        this.y = from.y;
      }
      update() {
        this.progress += this.speed;
        if (this.progress >= 1) this.progress = 0;
        this.x = this.from.x + (this.to.x - this.from.x) * this.progress;
        this.y = this.from.y + (this.to.y - this.from.y) * this.progress;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.fill();
      }
    }

    // Create particles for a connection
    const createParticles = () => {
      particles = [];
      connections.forEach(conn => {
        if (selectedProject === 'all' || conn.project === selectedProject) {
          const from = services.find(s => s.id === conn.from);
          const to = services.find(s => s.id === conn.to);
          if (from && to) {
            for (let i = 0; i < 3; i++) {
              particles.push(new Particle(from, to, 0.01 + Math.random() * 0.02, conn.project));
            }
          }
        }
      });
    };

    // Animation loop
    const animate = () => {
      if (!isAnimating) return;
      draw(); // Draw base architecture
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };

    // Start/stop animation
    const startAnimation = () => {
      isAnimating = true;
      createParticles();
      animate();
    };
    const stopAnimation = () => {
      isAnimating = false;
    };

    // Update project filter
    const setProject = (project) => {
      selectedProject = project;
      createParticles();
    };

    return {
      start: startAnimation,
      stop: stopAnimation,
      setProject
    };
  }
};

window.AWSDataFlow = AWSDataFlow;
