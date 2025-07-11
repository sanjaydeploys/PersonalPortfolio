const AWSArchitecture = {
  architectures: {
    lic: {
      services: [
        { id: 'cloudflareDNS', name: 'Cloudflare DNS', x: 50, y: 150, type: 'dns', metrics: { requestsPerSec: 100, latency: '20ms' }, config: { ttl: 300 } },
        { id: 'cloudFront', name: 'CloudFront', x: 150, y: 150, type: 'cdn', metrics: { cacheHitRate: '85%', bandwidth: '10Gbps' }, config: { edgeLocations: 200 } },
        { id: 's3', name: 'S3 (React App)', x: 250, y: 150, type: 'storage', metrics: { storageUsed: '500GB', requests: 1000 }, config: { versioning: true } },
        { id: 'apiGateway', name: 'API Gateway', x: 350, y: 150, type: 'gateway', metrics: { apiCalls: 5000, latency: '50ms' }, config: { throttling: '1000/s' } },
        { id: 'lambda', name: 'Lambda', x: 450, y: 150, type: 'compute', metrics: { invocations: 2000, duration: '300ms' }, config: { memory: '512MB' } },
        { id: 'mongodb', name: 'MongoDB Atlas', x: 550, y: 150, type: 'database', metrics: { queries: 1000, connections: 50 }, config: { replicaSet: true } },
        { id: 'cloudwatch', name: 'CloudWatch', x: 450, y: 300, type: 'monitoring', metrics: { logs: 10000, metrics: 500 }, config: { retention: '30d' } },
        { id: 'certManager', name: 'AWS Cert Manager', x: 150, y: 50, type: 'ssl', metrics: { certsIssued: 10, renewals: 5 }, config: { autoRenew: true } },
        { id: 'emailService', name: 'Email Service', x: 550, y: 300, type: 'messaging', metrics: { emailsSent: 1000, deliveryRate: '98%' }, config: { smtp: true } }
      ],
      connections: [
        { from: 'cloudflareDNS', to: 'cloudFront', label: 'Route', dataType: 'dns', bandwidth: '1Mbps' },
        { from: 'cloudFront', to: 's3', label: 'Serve HTML/JS', dataType: 'http', bandwidth: '100Mbps' },
        { from: 'cloudFront', to: 'certManager', label: 'TLS Cert', dataType: 'cert', bandwidth: '10Kbps' },
        { from: 's3', to: 'apiGateway', label: 'Form Submit', dataType: 'http', bandwidth: '50Mbps' },
        { from: 'apiGateway', to: 'lambda', label: 'Invoke', dataType: 'event', bandwidth: '20Mbps' },
        { from: 'lambda', to: 'mongodb', label: 'Store Inquiry', dataType: 'db', bandwidth: '30Mbps' },
        { from: 'lambda', to: 'cloudwatch', label: 'Log Event', dataType: 'log', bandwidth: '5Mbps' },
        { from: 'lambda', to: 'emailService', label: 'Send Email', dataType: 'message', bandwidth: '10Mbps' }
      ]
    },
    zedemy: {
      services: [
        { id: 'vercel', name: 'Vercel (React App)', x: 100, y: 150, type: 'cdn', metrics: { pageLoads: 5000, latency: '30ms' }, config: { ssr: true } },
        { id: 'apiGateway', name: 'API Gateway', x: 250, y: 150, type: 'gateway', metrics: { apiCalls: 3000, latency: '40ms' }, config: { throttling: '500/s' } },
        { id: 'lambda', name: 'Lambda Functions', x: 400, y: 150, type: 'compute', metrics: { invocations: 1500, duration: '200ms' }, config: { memory: '256MB' } },
        { id: 'dynamoDB', name: 'DynamoDB', x: 550, y: 150, type: 'database', metrics: { reads: 2000, writes: 1000 }, config: { autoScaling: true } },
        { id: 'codeEditor', name: 'Code Editor Module', x: 100, y: 300, type: 'frontend', metrics: { activeUsers: 100, sessions: 500 }, config: { language: 'javascript' } },
        { id: 'certService', name: 'Certificate Service', x: 250, y: 300, type: 'messaging', metrics: { certsIssued: 50, renewals: 10 }, config: { autoIssue: true } }
      ],
      connections: [
        { from: 'vercel', to: 'apiGateway', label: 'API Call', dataType: 'http', bandwidth: '50Mbps' },
        { from: 'apiGateway', to: 'lambda', label: 'Invoke', dataType: 'event', bandwidth: '20Mbps' },
        { from: 'lambda', to: 'dynamoDB', label: 'Read/Write', dataType: 'db', bandwidth: '30Mbps' },
        { from: 'vercel', to: 'codeEditor', label: 'In-browser Editor', dataType: 'frontend', bandwidth: '10Mbps' },
        { from: 'lambda', to: 'certService', label: 'Issue Certificate', dataType: 'message', bandwidth: '5Mbps' }
      ]
    },
    eventease: {
      services: [
        { id: 'vercel', name: 'Vercel (React App)', x: 100, y: 100, type: 'cdn', metrics: { pageLoads: 3000, latency: '25ms' }, config: { ssr: true } },
        { id: 'apiGateway', name: 'API Gateway', x: 250, y: 100, type: 'gateway', metrics: { apiCalls: 4000, latency: '45ms' }, config: { throttling: '800/s' } },
        { id: 'lambdaEvent', name: 'Lambda - Events', x: 400, y: 100, type: 'compute', metrics: { invocations: 1000, duration: '250ms' }, config: { memory: '256MB' } },
        { id: 'lambdaAuth', name: 'Lambda - Auth', x: 400, y: 200, type: 'compute', metrics: { invocations: 800, duration: '200ms' }, config: { memory: '128MB' } },
        { id: 'lambdaCalendar', name: 'Lambda - Calendar', x: 400, y: 300, type: 'compute', metrics: { invocations: 600, duration: '300ms' }, config: { memory: '128MB' } },
        { id: 'mongoDB', name: 'MongoDB Atlas', x: 550, y: 200, type: 'database', metrics: { queries: 1500, connections: 30 }, config: { replicaSet: true } },
        { id: 'googleCalendar', name: 'Google Calendar API', x: 550, y: 300, type: 'api', metrics: { apiCalls: 500, latency: '100ms' }, config: { oauth: true } },
        { id: 'github', name: 'GitHub CI/CD', x: 100, y: 250, type: 'frontend', metrics: { deployments: 10, builds: 50 }, config: { autoDeploy: true } }
      ],
      connections: [
        { from: 'vercel', to: 'apiGateway', label: 'API Calls', dataType: 'http', bandwidth: '60Mbps' },
        { from: 'apiGateway', to: 'lambdaEvent', label: 'Event CRUD', dataType: 'event', bandwidth: '20Mbps' },
        { from: 'apiGateway', to: 'lambdaAuth', label: 'JWT Auth', dataType: 'auth', bandwidth: '15Mbps' },
        { from: 'apiGateway', to: 'lambdaCalendar', label: 'Sync Events', dataType: 'event', bandwidth: '10Mbps' },
        { from: 'lambdaEvent', to: 'mongoDB', label: 'Store Data', dataType: 'db', bandwidth: '30Mbps' },
        { from: 'lambdaAuth', to: 'mongoDB', label: 'Session/User', dataType: 'db', bandwidth: '20Mbps' },
        { from: 'lambdaCalendar', to: 'googleCalendar', label: 'Sync Calendar', dataType: 'api', bandwidth: '5Mbps' },
        { from: 'github', to: 'vercel', label: 'CI/CD Deploy', dataType: 'deploy', bandwidth: '10Mbps' }
      ]
    },
    connectnow: {
      services: [
        { id: 'vercel', name: 'Vercel (React + WebRTC)', x: 100, y: 150, type: 'cdn', metrics: { pageLoads: 2000, latency: '35ms' }, config: { webrtc: true } },
        { id: 'socketServer', name: 'Socket.IO Server', x: 300, y: 150, type: 'compute', metrics: { connections: 100, messages: 5000 }, config: { port: 3000 } },
        { id: 'mongoDB', name: 'MongoDB Atlas', x: 500, y: 150, type: 'database', metrics: { queries: 800, connections: 20 }, config: { replicaSet: true } },
        { id: 'webrtcP2P', name: 'WebRTC P2P Layer', x: 300, y: 300, type: 'p2p', metrics: { streams: 50, bandwidth: '50Mbps' }, config: { iceServers: true } }
      ],
      connections: [
        { from: 'vercel', to: 'socketServer', label: 'Signaling', dataType: 'signaling', bandwidth: '10Mbps' },
        { from: 'socketServer', to: 'webrtcP2P', label: 'Offer/Answer/ICE', dataType: 'webrtc', bandwidth: '5Mbps' },
        { from: 'webrtcP2P', to: 'webrtcP2P', label: 'Media Stream', dataType: 'stream', bandwidth: '100Mbps' },
        { from: 'socketServer', to: 'mongoDB', label: 'User Auth/Data', dataType: 'db', bandwidth: '20Mbps' }
      ]
    }
  },

  canvas: null,
  ctx: null,
  tooltip: null,
  currentProject: 'lic',
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
  lastX: 0,
  lastY: 0,
  animationId: null,
  selectedService: null,
  hoveredService: null,
  iconCache: {},

  awsIcons: {
    gateway: 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-07-11_e8c36c86-8791-4d61-a511-7315c120b47f.webp',
    compute: 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-07-11_6801b651-c8c8-48af-af0b-feca1c9727ad.webp',
    database: 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-07-11_5497c6b5-7c07-418d-ba90-4ce526d7b2c6.webp',
    storage: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_S3_64.svg',
    cdn: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_CloudFront_64.svg',
    messaging: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_SNS_64.svg',
    monitoring: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_CloudWatch_64.svg',
    auth: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Cognito_64.svg',
    dns: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Route-53_64.svg',
    ssl: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Certificate-Manager_64.svg',
    frontend: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Amplify_64.svg',
    api: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_API-Gateway_64.svg',
    p2p: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Connect_64.svg'
  },

  init(canvasId, tooltipId) {
    try {
      this.canvas = document.getElementById(canvasId);
      this.tooltip = document.getElementById(tooltipId);

      if (!this.canvas || !this.tooltip) {
        throw new Error('[AWSArchitecture] Canvas or tooltip element not found.');
      }

      this.ctx = this.canvas.getContext('2d');
      this.attachEvents();
      this.resizeCanvas();
      this.animate();
      if (window.AWSFlow && typeof window.AWSFlow.setProject === 'function') {
        window.AWSFlow.setProject(this.currentProject);
      }
    } catch (error) {
      console.error('[AWSArchitecture] Initialization failed:', error);
      const fallback = document.getElementById('aws-fallback');
      if (fallback) fallback.style.display = 'block';
    }
  },

  attachEvents() {
    const canvas = this.canvas;

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const oldScale = this.scale;
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.5, Math.min(3.0, this.scale));
      const mouseX = (e.clientX - this.offsetX) / oldScale;
      const mouseY = (e.clientY - this.offsetY) / oldScale;
      this.offsetX -= mouseX * (this.scale - oldScale);
      this.offsetY -= mouseY * (this.scale - oldScale);
      this.render();
    });

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - this.offsetX) / this.scale;
      const y = (e.clientY - rect.top - this.offsetY) / this.scale;
      const { services } = this.architectures[this.currentProject];
      this.selectedService = services.find(s => Math.hypot(x - s.x, y - s.y) < 30);
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - this.offsetX) / this.scale;
      const y = (e.clientY - rect.top - this.offsetY) / this.scale;
      const { services } = this.architectures[this.currentProject];
      const hovered = services.find(s => Math.hypot(x - s.x, y - s.y) < 30);

      if (hovered !== this.hoveredService) {
        this.hoveredService = hovered;
        console.log('[AWSArchitecture] Hover detected:', hovered ? hovered.id : 'none');
        if (hovered && window.AWSTooltip && typeof window.AWSTooltip.getServiceDetails === 'function') {
          const tooltipHTML = window.AWSTooltip.getServiceDetails(hovered.id, this.currentProject);
          if (tooltipHTML) {
            this.tooltip.innerHTML = tooltipHTML;
            let tooltipX = e.clientX + 15;
            let tooltipY = e.clientY - 15;
            if (tooltipX + 300 > rect.right) tooltipX = e.clientX - 330;
            if (tooltipY < rect.top) tooltipY = e.clientY + 30;
            this.tooltip.style.left = `${tooltipX}px`;
            this.tooltip.style.top = `${tooltipY}px`;
            this.tooltip.classList.add('show');
            console.log('[AWSArchitecture] Tooltip displayed at:', tooltipX, tooltipY);
          } else {
            this.tooltip.classList.remove('show');
            console.warn('[AWSArchitecture] No tooltip content for:', hovered.id);
          }
        } else {
          this.tooltip.classList.remove('show');
          console.log('[AWSArchitecture] No tooltip or AWSTooltip not available.');
        }
        this.render();
      }

      if (this.isDragging) {
        if (this.selectedService) {
          this.selectedService.x += (e.clientX - this.lastX) / this.scale;
          this.selectedService.y += (e.clientY - this.lastY) / this.scale;
          if (window.AWSFlow) window.AWSFlow.updateParticles();
        } else {
          this.offsetX += e.clientX - this.lastX;
          this.offsetY += e.clientY - this.lastY;
        }
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.render();
      }
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.selectedService = null;
    });

    canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.selectedService = null;
      this.hoveredService = null;
      this.tooltip.classList.remove('show');
      this.render();
    });

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - this.offsetX) / this.scale;
      const y = (e.clientY - rect.top - this.offsetY) / this.scale;
      const { services } = this.architectures[this.currentProject];
      const clicked = services.find(s => Math.hypot(x - s.x, y - s.y) < 30);
      if (clicked) {
        this.centerService(clicked);
      }
    });
  },

  centerService(service) {
    const rect = this.canvas.getBoundingClientRect();
    this.offsetX = (rect.width / 2 - service.x * this.scale);
    this.offsetY = (rect.height / 2 - service.y * this.scale);
    this.render();
  },

  setProject(project) {
    if (!this.architectures[project]) {
      console.warn(`[AWSArchitecture] Unknown project: ${project}`);
      return;
    }
    this.currentProject = project;
    this.scale = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.selectedService = null;
    this.hoveredService = null;
    this.tooltip.classList.remove('show');
    this.render();
    if (window.AWSFlow && typeof window.AWSFlow.setProject === 'function') {
      window.AWSFlow.setProject(project);
    }
  },

  renderService(service, highlight = false) {
    const x = service.x * this.scale + this.offsetX;
    const y = service.y * this.scale + this.offsetY;
    const iconSize = 50;
    const iconUrl = this.awsIcons[service.type];

    if (!iconUrl) return;

    this.ctx.save();
    if (highlight || service === this.selectedService || service === this.hoveredService) {
      this.ctx.shadowColor = 'rgba(255, 153, 0, 0.7)';
      this.ctx.shadowBlur = 10;
      const pulse = 1 + 0.05 * Math.sin(Date.now() / 200);
      this.ctx.scale(pulse, pulse);
      this.ctx.translate(x / pulse - x, y / pulse - y);
    }

    if (this.iconCache[iconUrl]) {
      this.ctx.drawImage(this.iconCache[iconUrl], x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
    } else {
      const img = new Image();
      img.src = iconUrl;
      img.onload = () => {
        this.iconCache[iconUrl] = img;
        this.ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
        this.render();
      };
      img.onerror = () => console.error(`[AWSArchitecture] Failed to load icon: ${iconUrl}`);
    }

    this.ctx.fillStyle = (highlight || service === this.selectedService || service === this.hoveredService) ? '#ff9900' : '#fff';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(service.name, x, y + iconSize / 2 + 20);
    this.ctx.restore();
  },

  renderConnection(from, to, label, dataType, bandwidth) {
    const fx = from.x * this.scale + this.offsetX;
    const fy = from.y * this.scale + this.offsetY;
    const tx = to.x * this.scale + this.offsetX;
    const ty = to.y * this.scale + this.offsetY;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(fx, fy);
    this.ctx.lineTo(tx, ty);
    this.ctx.strokeStyle = this.getConnectionColor(dataType);
    this.ctx.lineWidth = this.getConnectionWidth(bandwidth);
    this.ctx.shadowColor = this.getConnectionColor(dataType);
    this.ctx.shadowBlur = 5;
    this.ctx.stroke();

    const angle = Math.atan2(ty - fy, tx - fx);
    const arrowSize = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(tx - arrowSize * Math.cos(angle - Math.PI / 6), ty - arrowSize * Math.sin(angle - Math.PI / 6));
    this.ctx.lineTo(tx, ty);
    this.ctx.lineTo(tx - arrowSize * Math.cos(angle + Math.PI / 6), ty - arrowSize * Math.sin(angle + Math.PI / 6));
    this.ctx.fillStyle = this.getConnectionColor(dataType);
    this.ctx.fill();

    const midX = (fx + tx) / 2;
    const midY = (fy + ty) / 2 - 15;
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`${label} (${bandwidth})`, midX, midY);
    this.ctx.restore();
  },

  getConnectionColor(dataType) {
    const colors = {
      dns: '#00ccff',
      http: '#ff9900',
      cert: '#66cc66',
      event: '#ff3366',
      db: '#3366cc',
      log: '#cc33cc',
      message: '#ffcc00',
      auth: '#ff6666',
      api: '#33cccc',
      deploy: '#66ff66',
      signaling: '#cc66cc',
      webrtc: '#ff33ff',
      stream: '#33ffcc'
    };
    return colors[dataType] || '#ff9900';
  },

  getConnectionWidth(bandwidth) {
    const bandwidthValue = parseFloat(bandwidth) || 1;
    if (bandwidth.includes('Gbps')) return Math.min(8, bandwidthValue * 0.8);
    if (bandwidth.includes('Mbps')) return Math.min(6, bandwidthValue / 100);
    if (bandwidth.includes('Kbps')) return Math.min(4, bandwidthValue / 1000);
    return 2;
  },

  render() {
    try {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const { services, connections } = this.architectures[this.currentProject];
      connections.forEach(conn => {
        const from = services.find(s => s.id === conn.from);
        const to = services.find(s => s.id === conn.to);
        if (from && to) {
          this.renderConnection(from, to, conn.label, conn.dataType, conn.bandwidth);
        }
      });

      services.forEach(service => this.renderService(service, service === this.hoveredService));
    } catch (error) {
      console.error('[AWSArchitecture] Render failed:', error);
    }
  },

  animate() {
    this.render();
    if (window.AWSFlow && typeof window.AWSFlow.drawParticles === 'function') {
      window.AWSFlow.drawParticles(this.ctx, this.scale, this.offsetX, this.offsetY);
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth || 800;
    this.canvas.height = this.canvas.offsetHeight || 600;
    this.render();
  }
};

window.AWSArchitecture = AWSArchitecture;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AWSArchitecture.init('aws-canvas', 'aws-tooltip');
  });
} else {
  AWSArchitecture.init('aws-canvas', 'aws-tooltip');
}
