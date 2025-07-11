const AWSFlow = {
  init(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationState = { isRunning: false };

    class Particle {
      constructor(from, to, speed) {
        this.start = { x: from.x, y: from.y };
        this.end = { x: to.x, y: to.y };
        this.progress = Math.random();
        this.speed = speed;
        this.color = 'rgba(255, 153, 0, 0.7)';
      }
      update() {
        this.progress += this.speed;
        if (this.progress >= 1) this.progress = 0;
        this.x = this.start.x + (this.end.x - this.start.x) * this.progress;
        this.y = this.start.y + (this.end.y - this.start.y) * this.progress;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    let currentProject = 'lic';
    const generateParticles = (services, connections) => {
      particles = [];
      const counts = { lic: 5, zedemy: 4, eventease: 6, connectnow: 3 };
      const count = counts[currentProject] || 5;
      connections.forEach(conn => {
        const from = services.find(s => s.id === conn.from);
        const to = services.find(s => s.id === conn.to);
        if (from && to) {
          for (let i = 0; i < count; i++) {
            particles.push(new Particle(from, to, 0.005 + Math.random() * 0.01));
          }
        }
      });
    };

    if (window.AWSCanvas) {
      const { services, connections } = window.AWSCanvas.architectures[currentProject];
      generateParticles(services, connections);
    } else {
      console.error('AWSCanvas not ready');
      return null;
    }

    const drawParticles = () => {
      if (animationState.isRunning && window.AWSCanvas) {
        particles.forEach(p => p.update() && p.draw());
      }
    };

    const startFlow = () => {
      if (!animationState.isRunning) {
        animationState.isRunning = true;
        console.log('Flow simulation started');
      }
    };

    const stopFlow = () => {
      if (animationState.isRunning) {
        animationState.isRunning = false;
        console.log('Flow simulation stopped');
      }
    };

    const setProject = (project) => {
      if (window.AWSCanvas && window.AWSCanvas.architectures[project]) {
        currentProject = project;
        generateParticles(window.AWSCanvas.architectures[project].services, window.AWSCanvas.architectures[project].connections);
      } else {
        console.error('Project switch failed:', project);
      }
    };

    const getState = () => animationState.isRunning;

    return { startFlow, stopFlow, drawParticles, setProject, getState };
  }
};

window.AWSFlow = AWSFlow;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.AWSFlow.init('aws-canvas');
  });
} else {
  window.AWSFlow.init('aws-canvas');
}
