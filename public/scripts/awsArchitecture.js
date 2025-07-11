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
  icons: {},
  currentProject: 'lic',
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
  lastX: 0,
  lastY: 0,

  init(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    this.tooltip = document.getElementById(tooltipId);
    if (!this.canvas || !this.tooltip) {
      console.error("Canvas or tooltip not found");
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    this.loadIcons();
    this.attachEvents();
    this.resizeCanvas();
    this.animate();
    if (window.AWSFlow?.setProject) AWSFlow.setProject(this.currentProject);
  },

  loadIcons() {
    const mapping = {
      apiGateway: 'ApiGateway.svg',
      lambda: 'Lambda.svg',
      dynamodb: 'DynamoDb.svg',
      s3: 'S3.svg',
      cloudfront: 'CloudFront.svg',
      sns: 'SimpleNotificationService.svg',
      cloudwatch: 'CloudWatch.svg',
      cognito: 'Cognito.svg'
    };
    for (let id in mapping) {
      const img = new Image();
      img.src = `https://raw.githubusercontent.com/aws-icons/constructs/main/Icons/${mapping[id]}`;
      this.icons[id] = img;
    }
  },

  attachEvents() {
    const c = this.canvas;
    c.addEventListener('wheel', e => {
      e.preventDefault();
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.5, Math.min(2.5, this.scale));
      this.render();
    });
    c.addEventListener('mousedown', e => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });
    c.addEventListener('mousemove', e => {
      if (this.isDragging) {
        this.offsetX += e.clientX - this.lastX;
        this.offsetY += e.clientY - this.lastY;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.render();
      }
      this.handleTooltip(e);
    });
    c.addEventListener('mouseup', () => this.isDragging = false);
    c.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.tooltip.style.display = 'none';
    });
  },

  setProject(proj) {
    if (!this.architectures[proj]) return console.warn("Unknown project", proj);
    this.currentProject = proj;
    this.scale = 1;
    this.offsetX = this.offsetY = 0;
    this.render();
    if (window.AWSFlow?.setProject) AWSFlow.setProject(proj);
  },

  renderService(service, highlight = false) {
    const x = service.x * this.scale + this.offsetX;
    const y = service.y * this.scale + this.offsetY;
    const size = 50;

    const img = this.icons[service.id];
    if (img && img.complete) {
      this.ctx.drawImage(img, x - size/2, y - size/2, size, size);
      if (highlight) {
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x - size/2, y - size/2, size, size);
      }
    } else {
      // fallback circle
      this.ctx.beginPath();
      this.ctx.arc(x, y, size/2, 0, 2*Math.PI);
      this.ctx.fillStyle = highlight ? 'yellow' : this.getServiceColor(service.type);
      this.ctx.fill();
    }

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(service.name, x, y + size/1.2);
  },

  renderConnection(from, to, label) {
    const fx = from.x * this.scale + this.offsetX;
    const fy = from.y * this.scale + this.offsetY;
    const tx = to.x * this.scale + this.offsetX;
    const ty = to.y * this.scale + this.offsetY;
    this.ctx.beginPath();
    this.ctx.moveTo(fx, fy);
    this.ctx.lineTo(tx, ty);
    this.ctx.strokeStyle = 'rgba(255,153,0,0.7)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    const mx = (fx + tx)/2;
    const my = (fy + ty)/2 - 10;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(label, mx, my);
  },

  render() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, width, height);
    const { services, connections } = this.architectures[this.currentProject];

    connections.forEach(c => {
      const from = services.find(s => s.id === c.from);
      const to = services.find(s => s.id === c.to);
      if (from && to) this.renderConnection(from, to, c.label);
    });
    services.forEach(s => this.renderService(s));
  },

  animate() {
    this.render();
    if (window.AWSFlow?.drawParticles) AWSFlow.drawParticles(this.ctx, this.scale, this.offsetX, this.offsetY);
    requestAnimationFrame(() => this.animate());
  },

  handleTooltip(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;
    const { services } = this.architectures[this.currentProject];
    const hovered = services.find(s => Math.hypot(s.x - x, s.y - y) < 30);
    if (hovered) {
      const html = AWSTooltip.getServiceDetails(hovered.id);
      if (html) {
        this.tooltip.innerHTML = html;
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${e.clientX + 10}px`;
        this.tooltip.style.top = `${e.clientY - 10}px`;
        this.render();
        this.renderService(hovered, true);
      }
    } else {
      this.tooltip.style.display = 'none';
      this.render();
    }
  },

  getServiceColor(type) {
    return {
      gateway: '#1E90FF', compute: '#32CD32', database: '#FFD700',
      storage: '#FF4500', cdn: '#BA55D3', messaging: '#FF69B4',
      monitoring: '#4682B4', auth: '#6A5ACD'
    }[type] || '#808080';
  },

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth || 800;
    this.canvas.height = this.canvas.offsetHeight || 400;
    this.render();
  }
};

window.AWSArchitecture = AWSArchitecture;
document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', () => AWSArchitecture.init('aws-canvas','aws-tooltip'))
  : AWSArchitecture.init('aws-canvas','aws-tooltip');
