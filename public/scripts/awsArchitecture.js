const AWSArchitecture = {
  architectures: {
    lic: {
      services: [
        { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' },
        { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'compute' },
        { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'database' },
        { id: 's3', name: 'S3', x: 500, y: 300, type: 'storage' },
        { id: 'cloudfront', name: 'CloudFront', x: 100, y: 300, type: 'cdn' },
        { id: 'sns', name: 'SNS', x: 300, y: 400, type: 'messaging' },
        { id: 'cloudwatch', name: 'CloudWatch', x: 300, y: 200, type: 'monitoring' }
      ],
      connections: [
        { from: 'apiGateway', to: 'lambda', label: 'Request' },
        { from: 'lambda', to: 'dynamodb', label: 'Data' },
        { from: 'lambda', to: 's3', label: 'Assets' },
        { from: 'cloudfront', to: 's3', label: 'Delivery' },
        { from: 'lambda', to: 'sns', label: 'Notify' },
        { from: 'lambda', to: 'cloudwatch', label: 'Monitor' }
      ]
    },
    zedemy: {
      services: [
        { id: 'cloudfront', name: 'CloudFront', x: 100, y: 100, type: 'cdn' },
        { id: 's3', name: 'S3', x: 300, y: 100, type: 'storage' },
        { id: 'lambda', name: 'Lambda', x: 500, y: 100, type: 'compute' },
        { id: 'apiGateway', name: 'API Gateway', x: 700, y: 100, type: 'gateway' },
        { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 300, type: 'database' }
      ],
      connections: [
        { from: 'cloudfront', to: 's3', label: 'Delivery' },
        { from: 's3', to: 'lambda', label: 'Trigger' },
        { from: 'lambda', to: 'apiGateway', label: 'Route' },
        { from: 'apiGateway', to: 'dynamodb', label: 'Store' }
      ]
    },
    eventease: {
      services: [
        { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' },
        { id: 'lambdaAuth', name: 'Lambda Auth', x: 300, y: 100, type: 'compute' },
        { id: 'lambdaEvent', name: 'Lambda Event', x: 500, y: 100, type: 'compute' },
        { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 100, type: 'database' },
        { id: 'cognito', name: 'Cognito', x: 100, y: 300, type: 'auth' }
      ],
      connections: [
        { from: 'apiGateway', to: 'lambdaAuth', label: 'Auth' },
        { from: 'apiGateway', to: 'lambdaEvent', label: 'Event' },
        { from: 'lambdaEvent', to: 'dynamodb', label: 'Data' },
        { from: 'cognito', to: 'apiGateway', label: 'Auth Flow' }
      ]
    },
    connectnow: {
      services: [
        { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' },
        { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'compute' },
        { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'database' }
      ],
      connections: [
        { from: 'apiGateway', to: 'lambda', label: 'WebSocket' },
        { from: 'lambda', to: 'dynamodb', label: 'Session' }
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

  getServiceColor(type) {
    return {
      gateway: '#1E90FF',
      compute: '#32CD32',
      database: '#FFD700',
      storage: '#FF4500',
      cdn: '#BA55D3',
      messaging: '#FF69B4',
      monitoring: '#4682B4',
      auth: '#6A5ACD'
    }[type] || '#808080';
  },

  renderService(service, highlight = false) {
    const x = service.x * this.scale + this.offsetX;
    const y = service.y * this.scale + this.offsetY;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    this.ctx.fillStyle = highlight ? 'yellow' : this.getServiceColor(service.type);
    this.ctx.fill();
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(service.name, 0, 40);
    this.ctx.restore();
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
