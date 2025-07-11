const AWSFlow = {
  particles: [],
  running: false,
  currentProject: 'lic',

  drawParticles(ctx, scale, offsetX, offsetY) {
    if (!this.running) return;
    this.particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress >= 1) p.progress = 0;
      const x = (p.start.x + (p.end.x - p.start.x) * p.progress) * scale + offsetX;
      const y = (p.start.y + (p.end.y - p.start.y) * p.progress) * scale + offsetY;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  },

  startFlow() { this.running = true; },
  stopFlow() { this.running = false; },
  isAnimating() { return this.running; },

  setProject(project) {
    this.currentProject = project;
    const { services, connections } = AWSArchitecture.architectures[project];
    this.particles = [];
    connections.forEach(conn => {
      const from = services.find(s => s.id === conn.from);
      const to = services.find(s => s.id === conn.to);
      if (from && to) {
        for (let i = 0; i < 5; i++) {
          this.particles.push({
            start: { x: from.x, y: from.y },
            end: { x: to.x, y: to.y },
            progress: Math.random(),
            speed: 0.01 + Math.random() * 0.01,
            color: 'orange'
          });
        }
      }
    });
  }
};

window.AWSFlow = AWSFlow;
