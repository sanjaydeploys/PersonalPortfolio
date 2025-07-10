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
      let selectedProject = 'lic';

      class Particle {
        constructor(from, to, speed, project, direction) {
          this.from = from;
          this.to = to;
          this.project = project;
          this.progress = 0;
          this.speed = speed;
          this.x = from.x;
          this.y = from.y;
          this.direction = direction || 'right';
        }
        update() {
          this.progress += this.speed;
          if (this.progress >= 1) this.progress = 0;
          const dx = this.to.x - this.from.x;
          const dy = this.to.y - this.from.y;
          this.x = this.from.x + dx * this.progress;
          this.y = this.from.y + dy * this.progress;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = this.project === 'lic' ? 'rgba(0, 255, 0, 0.8)' : this.project === 'zedemy' ? 'rgba(255, 165, 0, 0.8)' : this.project === 'eventease' ? 'rgba(0, 0, 255, 0.8)' : 'rgba(255, 0, 0, 0.8)';
          ctx.fill();

          // Draw directional tail
          if (this.progress > 0 && this.progress < 0.9) {
            const tailX = this.x - (this.to.x - this.from.x) * this.speed * 10;
            const tailY = this.y - (this.to.y - this.from.y) * this.speed * 10;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
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
              const particleCount = selectedProject === 'connectnow' ? 5 : 3; // More particles for ConnectNow due to P2P
              for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(from, to, 0.01 + Math.random() * 0.02, selectedProject, conn.direction));
              }
            }
          }
        });
        console.log(`[AWSDataFlow] Created ${particles.length} particles`);
      };

      const drawParticles = () => {
        if (isAnimating) {
          console.log('[AWSDataFlow] Drawing particles');
          particles.forEach(particle => {
            particle.update();
            particle.draw();
          });
        }
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
