try {
  console.log('[AWSDataFlow] Script loaded and parsed');

  const AWSDataFlow = {
    init(canvas) {
      console.log('[AWSDataFlow] Initializing');
      if (!canvas || !canvas.getContext) {
        console.error('[AWSDataFlow] Invalid canvas');
        return { start: () => {}, stop: () => {}, setProject: () => {}, drawParticles: () => {}, isAnimating: () => false };
      }

      const ctx = canvas.getContext('2d');
      let particles = [];
      let isAnimating = false;
      let currentProject = 'lic';

      class Particle {
        constructor(from, to, speed) {
          this.from = { x: from.x, y: from.y };
          this.to = { x: to.x, y: to.y };
          this.progress = 0;
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

      const createParticles = (services, connections) => {
        particles = [];
        const particleCount = { lic: 5, zedemy: 4, eventease: 6, connectnow: 3 }[currentProject] || 5;
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
        if (isAnimating) particles.forEach(particle => particle.update() && particle.draw());
      };

      const start = () => {
        isAnimating = true;
        const { services, connections } = window.AWSArchitecture.init().architectures[currentProject];
        createParticles(services, connections);
        console.log('[AWSDataFlow] Simulation started');
      };

      const stop = () => {
        isAnimating = false;
        console.log('[AWSDataFlow] Simulation paused');
      };

      const setProject = (project) => {
        currentProject = project;
        if (isAnimating) {
          const { services, connections } = window.AWSArchitecture.init().architectures[project];
          createParticles(services, connections);
        }
      };

      return { start, stop, setProject, drawParticles, isAnimating: () => isAnimating };
    }
  };

  window.AWSDataFlow = AWSDataFlow;
} catch (error) {
  console.error('[AWSDataFlow] Script-level error:', error);
}
