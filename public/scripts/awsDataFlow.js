try {
  console.log('[AWSDataFlow] Script loaded and parsed');

  const AWSDataFlow = {
    init(canvas, services, connections) {
      console.log('[AWSDataFlow] Initializing with services:', services.length, 'connections:', connections.length);
      if (!canvas || !canvas.getContext || !services || !connections) {
        console.error('[AWSDataFlow] Invalid initialization parameters');
        return { start: () => {}, stop: () => {}, setProject: () => {}, drawParticles: () => {}, isAnimating: () => false };
      }

      const ctx = canvas.getContext('2d');
      let particles = [];
      let isAnimating = false;
      let selectedProject = 'lic';

      class Particle {
        constructor(from, to, speed) {
          this.from = { x: from.x, y: from.y };
          this.to = { x: to.x, y: to.y };
          this.progress = Math.random();
          this.speed = speed;
          this.color = 'rgba(255, 153, 0, 0.8)';
        }
        update() {
          this.progress += this.speed;
          if (this.progress >= 1) this.progress = 0;
          this.x = this.from.x + (this.to.x - this.from.x) * this.progress;
          this.y = this.from.y + (this.to.y - this.from.y) * this.progress;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(this.x - 10 * (1 - this.progress), this.y - 10 * (1 - this.progress));
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = this.color;
          ctx.stroke();
        }
      }

      const createParticles = () => {
        particles = [];
        const particleCount = { lic: 5, zedemy: 4, eventease: 6, connectnow: 3 }[selectedProject] || 5;
        connections.forEach(conn => {
          const from = services.find(s => s.id === conn.from);
          const to = services.find(s => s.id === conn.to);
          if (from && to) {
            for (let i = 0; i < particleCount; i++) {
              particles.push(new Particle(from, to, 0.005 + Math.random() * 0.01));
            }
          }
        });
      };

      const drawParticles = () => {
        if (isAnimating) {
          particles.forEach(particle => {
            particle.update();
            particle.draw();
          });
        }
      };

      const start = () => {
        isAnimating = true;
        createParticles();
      };
      const stop = () => { isAnimating = false; };
      const setProject = (project) => {
        selectedProject = project;
        createParticles();
      };

      return { start, stop, setProject, drawParticles, isAnimating: () => isAnimating };
    }
  };

  window.AWSDataFlow = AWSDataFlow;
} catch (error) {
  console.error('[AWSDataFlow] Script-level error:', error);
}
