const AWSArchitecture = {
 architectures: {
  lic: {
    services: [
      { id: 'cloudflareDNS', name: 'Cloudflare DNS', x: 50, y: 150, type: 'dns' },
      { id: 'cloudFront', name: 'CloudFront', x: 150, y: 150, type: 'cdn' },
      { id: 's3', name: 'S3 (React App)', x: 250, y: 150, type: 'storage' },
      { id: 'apiGateway', name: 'API Gateway', x: 350, y: 150, type: 'gateway' },
      { id: 'lambda', name: 'Lambda', x: 450, y: 150, type: 'compute' },
      { id: 'mongodb', name: 'MongoDB Atlas', x: 550, y: 150, type: 'database' },
      { id: 'cloudwatch', name: 'CloudWatch', x: 450, y: 300, type: 'monitoring' },
      { id: 'certManager', name: 'AWS Cert Manager', x: 150, y: 50, type: 'ssl' },
      { id: 'emailService', name: 'Email Service', x: 550, y: 300, type: 'messaging' }
    ],
    connections: [
      { from: 'cloudflareDNS', to: 'cloudFront', label: 'Route' },
      { from: 'cloudFront', to: 's3', label: 'Serve HTML/JS' },
      { from: 'cloudFront', to: 'certManager', label: 'TLS Cert' },
      { from: 's3', to: 'apiGateway', label: 'Form Submit' },
      { from: 'apiGateway', to: 'lambda', label: 'Invoke' },
      { from: 'lambda', to: 'mongodb', label: 'Store Inquiry' },
      { from: 'lambda', to: 'cloudwatch', label: 'Log Event' },
      { from: 'lambda', to: 'emailService', label: 'Send Email' }
    ]
  },

  zedemy: {
    services: [
      { id: 'vercel', name: 'Vercel (React App)', x: 100, y: 150, type: 'cdn' },
      { id: 'apiGateway', name: 'API Gateway', x: 250, y: 150, type: 'gateway' },
      { id: 'lambda', name: 'Lambda Functions', x: 400, y: 150, type: 'compute' },
      { id: 'dynamoDB', name: 'DynamoDB', x: 550, y: 150, type: 'database' },
      { id: 'codeEditor', name: 'Code Editor Module', x: 100, y: 300, type: 'frontend' },
      { id: 'certService', name: 'Certificate Service', x: 250, y: 300, type: 'messaging' }
    ],
    connections: [
      { from: 'vercel', to: 'apiGateway', label: 'API Call' },
      { from: 'apiGateway', to: 'lambda', label: 'Invoke' },
      { from: 'lambda', to: 'dynamoDB', label: 'Read/Write' },
      { from: 'vercel', to: 'codeEditor', label: 'In-browser Editor' },
      { from: 'lambda', to: 'certService', label: 'Issue Certificate' }
    ]
  },

  eventease: {
    services: [
      { id: 'vercel', name: 'Vercel (React App)', x: 100, y: 100, type: 'cdn' },
      { id: 'apiGateway', name: 'API Gateway', x: 250, y: 100, type: 'gateway' },
      { id: 'lambdaEvent', name: 'Lambda - Events', x: 400, y: 100, type: 'compute' },
      { id: 'lambdaAuth', name: 'Lambda - Auth', x: 400, y: 200, type: 'compute' },
      { id: 'lambdaCalendar', name: 'Lambda - Calendar', x: 400, y: 300, type: 'compute' },
      { id: 'mongoDB', name: 'MongoDB Atlas', x: 550, y: 200, type: 'database' },
      { id: 'googleCalendar', name: 'Google Calendar API', x: 550, y: 300, type: 'api' },
      { id: 'github', name: 'GitHub CI/CD', x: 100, y: 250, type: 'frontend' }
    ],
    connections: [
      { from: 'vercel', to: 'apiGateway', label: 'API Calls' },
      { from: 'apiGateway', to: 'lambdaEvent', label: 'Event CRUD' },
      { from: 'apiGateway', to: 'lambdaAuth', label: 'JWT Auth' },
      { from: 'apiGateway', to: 'lambdaCalendar', label: 'Sync Events' },
      { from: 'lambdaEvent', to: 'mongoDB', label: 'Store Data' },
      { from: 'lambdaAuth', to: 'mongoDB', label: 'Session/User' },
      { from: 'lambdaCalendar', to: 'googleCalendar', label: 'Sync Calendar' },
      { from: 'github', to: 'vercel', label: 'CI/CD Deploy' }
    ]
  },

  connectnow: {
    services: [
      { id: 'vercel', name: 'Vercel (React + WebRTC)', x: 100, y: 150, type: 'cdn' },
      { id: 'socketServer', name: 'Socket.IO Server', x: 300, y: 150, type: 'compute' },
      { id: 'mongoDB', name: 'MongoDB Atlas', x: 500, y: 150, type: 'database' },
      { id: 'webrtcP2P', name: 'WebRTC P2P Layer', x: 300, y: 300, type: 'p2p' }
    ],
    connections: [
      { from: 'vercel', to: 'socketServer', label: 'Signaling' },
      { from: 'socketServer', to: 'webrtcP2P', label: 'Offer/Answer/ICE' },
      { from: 'webrtcP2P', to: 'webrtcP2P', label: 'Media Stream' },
      { from: 'socketServer', to: 'mongoDB', label: 'User Auth/Data' }
    ]
  }
}
,

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

  iconCache: {},

  awsIcons: {
    gateway: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_API-Gateway_64.svg',
    compute: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Lambda_64.svg',
    database: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_DynamoDB_64.svg',
    storage: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_S3_64.svg',
    cdn: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_CloudFront_64.svg',
    messaging: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_SNS_64.svg',
    monitoring: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_CloudWatch_64.svg',
    auth: 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_Cognito_64.svg'
  },

  init(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    this.tooltip = document.getElementById(tooltipId);

    if (!this.canvas || !this.tooltip) {
      console.error('[AWSArchitecture] Canvas or tooltip element not found.');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.attachEvents();
    this.resizeCanvas();
    this.animate();

    if (window.AWSFlow && typeof window.AWSFlow.setProject === 'function') {
      window.AWSFlow.setProject(this.currentProject);
    }
  },

  attachEvents() {
    const canvas = this.canvas;

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.5, Math.min(2.5, this.scale));
      this.render();
    });

    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.offsetX += (e.clientX - this.lastX);
        this.offsetY += (e.clientY - this.lastY);
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.render();
      }

      this.handleTooltip(e);
    });

    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.tooltip.style.display = 'none';
    });
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

    if (this.iconCache[iconUrl]) {
      this.ctx.drawImage(this.iconCache[iconUrl], x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
    } else {
      const img = new Image();
      img.src = iconUrl;
      img.onload = () => {
        this.iconCache[iconUrl] = img;
        this.ctx.drawImage(img, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
      };
    }

    this.ctx.fillStyle = highlight ? 'yellow' : '#fff';
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(service.name, x, y + iconSize / 2 + 15);
  },

  renderConnection(from, to, label) {
    const fx = from.x * this.scale + this.offsetX;
    const fy = from.y * this.scale + this.offsetY;
    const tx = to.x * this.scale + this.offsetX;
    const ty = to.y * this.scale + this.offsetY;

    this.ctx.beginPath();
    this.ctx.moveTo(fx, fy);
    this.ctx.lineTo(tx, ty);
    this.ctx.strokeStyle = 'rgba(255, 153, 0, 0.7)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    const midX = (fx + tx) / 2;
    const midY = (fy + ty) / 2 - 10;
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText(label, midX, midY);
  },

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const { services, connections } = this.architectures[this.currentProject];
    connections.forEach(conn => {
      const from = services.find(s => s.id === conn.from);
      const to = services.find(s => s.id === conn.to);
      if (from && to) this.renderConnection(from, to, conn.label);
    });

    services.forEach(service => this.renderService(service));
  },

  animate() {
    this.render();
    if (window.AWSFlow && typeof window.AWSFlow.drawParticles === 'function') {
      window.AWSFlow.drawParticles(this.ctx, this.scale, this.offsetX, this.offsetY);
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  },

  handleTooltip(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;

    const { services } = this.architectures[this.currentProject];
    const hovered = services.find(s => Math.hypot(x - s.x, y - s.y) < 30);

    if (hovered && window.AWSTooltip) {
      const tooltipHTML = AWSTooltip.getServiceDetails(hovered.id);
      if (tooltipHTML) {
        this.tooltip.innerHTML = tooltipHTML;
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${e.clientX + 10}px`;
        this.tooltip.style.top = `${e.clientY - 10}px`;
      }
    } else {
      this.tooltip.style.display = 'none';
    }
  },

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth || 800;
    this.canvas.height = this.canvas.offsetHeight || 400;
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
