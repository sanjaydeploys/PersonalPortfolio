const AWSDataFlow = {
  init(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isAnimating = false;

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
      }
    }

    let currentProject = 'lic';
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
    createParticles(window.AWSArchitecture.architectures[currentProject].services, window.AWSArchitecture.architectures[currentProject].connections);

    const drawParticles = () => {
      if (isAnimating && window.AWSArchitecture && window.AWSArchitecture.architectures) {
        particles.forEach(particle => particle.update() && particle.draw());
      }
    };

    const start = () => {
      isAnimating = true;
      console.log('[AWSDataFlow] Simulation started');
    };

    const stop = () => {
      isAnimating = false;
      console.log('[AWSDataFlow] Simulation paused');
    };

    const setProject = (project) => {
      if (window.AWSArchitecture && window.AWSArchitecture.architectures[project]) {
        currentProject = project;
        createParticles(window.AWSArchitecture.architectures[project].services, window.AWSArchitecture.architectures[project].connections);
      }
    };

    return { start, stop, drawParticles, setProject, isAnimating: () => isAnimating };
  }
};

window.AWSDataFlow = AWSDataFlow;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.AWSDataFlow.init(document.getElementById('aws-canvas'));
  });
} else {
  window.AWSDataFlow.init(document.getElementById('aws-canvas'));
}
