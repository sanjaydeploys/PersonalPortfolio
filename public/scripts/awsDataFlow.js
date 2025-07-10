try {
  console.log('[AWSDataFlow] Script loaded and parsed');

  const AWSDataFlow = {
    init(canvas, services, connections) {
      console.log('[AWSDataFlow] Initializing with canvas:', !!canvas, 'services:', Array.isArray(services), 'connections:', Array.isArray(connections));
      if (!canvas || !canvas.getContext) {
        console.error('[AWSDataFlow] Invalid canvas:', canvas);
        return { start: () => {}, stop: () => {}, setProject: () => {}, drawParticles: () => {}, isAnimating: () => false };
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('[AWSDataFlow] Failed to get canvas context');
        return { start: () => {}, stop: () => {}, setProject: () => {}, drawParticles: () => {}, isAnimating: () => false };
      }
      console.log('[AWSDataFlow] Canvas context acquired');

      if (!Array.isArray(services) || !Array.isArray(connections) || services.length === 0 || connections.length === 0) {
        console.error('[AWSDataFlow] Invalid services or connections data:', { services, connections });
        return { start: () => {}, stop: () => {}, setProject: () => {}, drawParticles: () => {}, isAnimating: () => false };
      }

      let particles = [];
      let isAnimating = false;
      let selectedProject = 'all';

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

      const createParticles = () => {
        console.log(`[AWSDataFlow] Creating particles for project: ${selectedProject}`);
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
        console.log(`[AWSDataFlow] Created ${particles.length} particles`);
      };

      const drawParticles = () => {
        console.log('[AWSDataFlow] Drawing particles');
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
      };

      const startAnimation = () => {
        console.log('[AWSDataFlow] Starting animation');
        isAnimating = true;
        createParticles();
      };
      const stopAnimation = () => {
        console.log('[AWSDataFlow] Stopping animation');
        isAnimating = false;
      };
      const setProject = (project) => {
        console.log(`[AWSDataFlow] Setting project filter to: ${project}`);
        selectedProject = project;
        createParticles();
      };

      return { start: startAnimation, stop: stopAnimation, setProject, drawParticles, isAnimating: () => isAnimating };
    }
  };

  window.AWSDataFlow = AWSDataFlow;
} catch (error) {
  console.error('[AWSDataFlow] Script-level error:', error);
}
