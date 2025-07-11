// Updated awsDataFlow.js
const AWSFlow = {
  particles: [],
  running: false,
  currentProject: 'lic',
  particleTypes: {
    dns: { size: 4, color: '#00ccff', speed: 0.015 },
    http: { size: 6, color: '#ff9900', speed: 0.02 },
    cert: { size: 3, color: '#66cc66', speed: 0.01 },
    event: { size: 5, color: '#ff3366', speed: 0.018 },
    db: { size: 5, color: '#3366cc', speed: 0.017 },
    log: { size: 4, color: '#cc33cc', speed: 0.012 },
    message: { size: 4, color: '#ffcc00', speed: 0.015 },
    auth: { size: 4, color: '#ff6666', speed: 0.016 },
    api: { size: 5, color: '#33cccc', speed: 0.014 },
    deploy: { size: 4, color: '#66ff66', speed: 0.013 },
    signaling: { size: 5, color: '#cc66cc', speed: 0.015 },
    webrtc: { size: 6, color: '#ff33ff', speed: 0.02 },
    stream: { size: 8, color: '#33ffcc', speed: 0.025 }
  },

  drawParticles(ctx, scale, offsetX, offsetY) {
    if (!this.running) return;
    this.particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;
      const x = (p.start.x + (p.end.x - p.start.x) * p.progress) * scale + offsetX;
      const y = (p.start.y + (p.end.y - p.start.y) * p.progress) * scale + offsetY;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(p.progress * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
  },

  startFlow() {
    this.running = true;
  },

  stopFlow() {
    this.running = false;
  },

  isAnimating() {
    return this.running;
  },

  setProject(project) {
    this.currentProject = project;
    const { services, connections } = AWSArchitecture.architectures[project];
    this.particles = [];
    connections.forEach(conn => {
      const from = services.find(s => s.id === conn.from);
      const to = services.find(s => s.id === conn.to);
      if (from && to) {
        const particleConfig = this.particleTypes[conn.dataType] || { size: 4, color: 'orange', speed: 0.01 };
        for (let i = 0; i < 8; i++) {
          this.particles.push({
            start: { x: from.x, y: from.y },
            end: { x: to.x, y: to.y },
            progress: Math.random(),
            speed: particleConfig.speed + Math.random() * 0.005,
            color: particleConfig.color,
            size: particleConfig.size
          });
        }
      }
    });
  }
};

window.AWSFlow = AWSFlow;
