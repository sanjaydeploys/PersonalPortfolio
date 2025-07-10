const AWSDataFlow = {
  init(canvas, services, connections) {
    console.log('[AWSDataFlow] Initializing');
    if (!canvas || !canvas.getContext || !services || !connections) {
      console.error('[AWSDataFlow] Invalid initialization parameters');
      return { start: () => {}, stop: () => {}, setProject: () => {}, drawParticles: () => {}, isAnimating: () => false };
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    let isAnimating = false;
    let selectedProject = 'lic';

    class Particle {
      constructor(from, to, speed, project) {
        this.from = { x: from.x, y: from.y };
        this.to = { x: to.x, y: to.y };
        this.project = project;
        this.progress = Math.random();
        this.speed = speed;
        this.color = this.getColor();
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
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const createParticles = () => {
      particles = [];
      const particleCount = { lic: 3, zedemy: 4, eventease: 5, connectnow: 6 }[selectedProject] || 3;
      connections.forEach(conn => {
        const from = services.find(s => s.id === conn.from);
        const to = services.find(s => s.id === conn.to);
        if (from && to) {
          for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(from, to, 0.005 + Math.random() * 0.01, selectedProject));
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
    const setProject = (project) => { selectedProject = project; createParticles(); };

    return { start, stop, setProject, drawParticles, isAnimating: () => isAnimating };
  }
};

if (typeof window !== 'undefined') {
  window.AWSDataFlow = AWSDataFlow;
}
