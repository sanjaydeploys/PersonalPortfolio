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
          this.progress = Math.random();
          this.speed = speed;
          this.color = 'rgba(255, 153, 0, 0.8)';
          this.status = 'active';
        }
        update() {
          this.progress += this.speed;
          if (this.progress >= 1) {
            this.progress = 0;
            this.status = Math.random() > 0.9 ? 'error' : 'active';
          }
          this.x = this.from.x + (this.to.x - this.from.x) * this.progress;
          this.y = this.from.y + (this.to.y - this.from.y) * this.progress;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = this.status === 'error' ? 'rgba(255, 0, 0, 0.8)' : this.color;
          ctx.fill();
          if (this.status === 'error') {
            ctx.beginPath();
            ctx.moveTo(this.x - 5, this.y - 5);
            ctx.lineTo(this.x + 5, this.y + 5);
            ctx.moveTo(this.x + 5, this.y - 5);
            ctx.lineTo(this.x - 5, this.y + 5);
            ctx.strokeStyle = 'red';
            ctx.stroke();
          }
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
        const { services, connections } = window.AWSArchitecture.architectures[currentProject];
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
          const { services, connections } = window.AWSArchitecture.architectures[project];
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
