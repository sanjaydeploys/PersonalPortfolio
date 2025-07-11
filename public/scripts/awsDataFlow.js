const AWSFlow = {
  particles: [],
  running: false,
  currentProject: 'lic',
  particleTypes: {
    dns: { size: 4, color: '#00ccff', speed: 0.015, spawnRate: 500 },
    http: { size: 6, color: '#ff9900', speed: 0.02, spawnRate: 300 },
    cert: { size: 3, color: '#66cc66', speed: 0.01, spawnRate: 1000 },
    event: { size: 5, color: '#ff3366', speed: 0.018, spawnRate: 400 },
    db: { size: 5, color: '#3366cc', speed: 0.017, spawnRate: 350 },
    log: { size: 4, color: '#cc33cc', speed: 0.012, spawnRate: 600 },
    message: { size: 4, color: '#ffcc00', speed: 0.015, spawnRate: 500 },
    auth: { size: 4, color: '#ff6666', speed: 0.016, spawnRate: 450 },
    api: { size: 5, color: '#33cccc', speed: 0.014, spawnRate: 400 },
    deploy: { size: 4, color: '#66ff66', speed: 0.013, spawnRate: 700 },
    signaling: { size: 5, color: '#cc66cc', speed: 0.015, spawnRate: 500 },
    webrtc: { size: 6, color: '#ff33ff', speed: 0.02, spawnRate: 300 },
    stream: { size: 8, color: '#33ffcc', speed: 0.025, spawnRate: 200 }
  },
  lastSpawnTimes: {},

  drawParticles(ctx, scale, offsetX, offsetY) {
    if (!this.running) return;

    const now = Date.now();
    this.particles = this.particles.filter(p => p.progress < 1);
    this.particles.forEach(p => {
      p.progress += p.speed;
      const x = (p.start.x + (p.end.x - p.start.x) * p.progress) * scale + offsetX;
      const y = (p.start.y + (p.end.y - p.start.y) * p.progress) * scale + offsetY;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(p.progress * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Spawn new particles based on connection spawn rates
    const { connections, services } = window.AWSArchitecture.architectures[this.currentProject];
    connections.forEach(conn => {
      const from = services.find(s => s.id === conn.from);
      const to = services.find(s => s.id === conn.to);
      if (from && to) {
        const particleConfig = this.particleTypes[conn.dataType] || { size: 4, color: 'orange', speed: 0.01, spawnRate: 500 };
        const lastSpawn = this.lastSpawnTimes[conn.from + '-' + conn.to] || 0;
        if (now - lastSpawn > particleConfig.spawnRate) {
          this.particles.push({
            start: { x: from.x, y: from.y },
            end: { x: to.x, y: to.y },
            progress: 0,
            speed: particleConfig.speed,
            color: particleConfig.color,
            size: particleConfig.size
          });
          this.lastSpawnTimes[conn.from + '-' + conn.to] = now;
        }
      }
    });
  },

  startFlow() {
    this.running = true;
    this.lastSpawnTimes = {};
    this.particles = [];
  },

  stopFlow() {
    this.running = false;
    this.particles = [];
  },

  isAnimating() {
    return this.running;
  },

  setProject(project) {
    if (!window.AWSArchitecture || !window.AWSArchitecture.architectures[project]) {
      console.warn(`[AWSFlow] Project ${project} or AWSArchitecture not found.`);
      return;
    }
    this.currentProject = project;
    this.lastSpawnTimes = {};
    this.particles = [];
    if (this.running) {
      this.startFlow();
    }
  },

  updateParticles() {
    if (!window.AWSArchitecture || !window.AWSArchitecture.architectures[this.currentProject]) return;
    const { services } = window.AWSArchitecture.architectures[this.currentProject];
    this.particles.forEach(p => {
      const from = services.find(s => s.id === p.connectionFrom);
      const to = services.find(s => s.id === p.connectionTo);
      if (from && to) {
        p.start = { x: from.x, y: from.y };
        p.end = { x: to.x, y: to.y };
      }
    });
  }
};

window.AWSFlow = AWSFlow;
