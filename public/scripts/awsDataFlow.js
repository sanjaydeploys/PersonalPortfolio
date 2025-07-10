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
          this.from = { x: from.x, y: from.y };
          this.to = { x: to.x, y: to.y };
          this.project = project;
          this.progress = Math.random();
          this.speed = speed;
          this.direction = direction || 'right';
          this.color = this.getColor();
          this.size = 4 + Math.random() * 2;
        }
        getColor() {
          return this.project === 'lic' ? 'rgba(0, 255, 0, 0.8)' : this.project === 'zedemy' ? 'rgba(255, 165, 0, 0.8)' : this.project === 'eventease' ? 'rgba(0, 0, 255, 0.8)' : 'rgba(255, 0, 0, 0.8)';
        }
        update() {
          this.progress += this.speed;
          if (this.progress >= 1) this.progress = 0;
          this.x = this.from.x + (this.to.x - this.from.x) * this.progress;
          this.y = this.from.y + (this.to.y - this.from.y) * this.progress;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * (1 + Math.sin(Date.now() / 200) * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();

          if (this.progress > 0 && this.progress < 0.9) {
            const tailLength = 15;
            const tailX = this.x - (this.to.x - this.from.x) * this.speed * tailLength;
            const tailY = this.y - (this.to.y - this.from.y) * this.speed * tailLength;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      const createParticles = () => {
        console.log(`[AWSDataFlow] Creating particles for project: ${selectedProject}`);
        particles = [];
        const particleCount = { lic: 3, zedemy: 4, eventease: 5, connectnow: 6 }[selectedProject] || 3;
        connections.forEach(conn => {
          if (selectedProject === 'all' || conn.project === selectedProject) {
            const from = services.find(s => s.id === conn.from);
            const to = services.find(s => s.id === conn.to);
            if (from && to) {
              for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(from, to, 0.005 + Math.random() * 0.01, selectedProject, conn.direction));
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
