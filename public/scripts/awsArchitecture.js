const AWSArchitecture = {

    const architectures = {
      lic: { services: [{ id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' }, { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'compute' }, { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'database' }, { id: 's3', name: 'S3', x: 500, y: 300, type: 'storage' }, { id: 'cloudfront', name: 'CloudFront', x: 100, y: 300, type: 'cdn' }, { id: 'sns', name: 'SNS', x: 300, y: 400, type: 'messaging' }, { id: 'cloudwatch', name: 'CloudWatch', x: 300, y: 200, type: 'monitoring' }], connections: [{ from: 'apiGateway', to: 'lambda', label: 'Request' }, { from: 'lambda', to: 'dynamodb', label: 'Data' }, { from: 'lambda', to: 's3', label: 'Assets' }, { from: 'cloudfront', to: 's3', label: 'Delivery' }, { from: 'lambda', to: 'sns', label: 'Notify' }, { from: 'lambda', to: 'cloudwatch', label: 'Monitor' }] },
      zedemy: { services: [{ id: 'cloudfront', name: 'CloudFront', x: 100, y: 100, type: 'cdn' }, { id: 's3', name: 'S3', x: 300, y: 100, type: 'storage' }, { id: 'lambda', name: 'Lambda', x: 500, y: 100, type: 'compute' }, { id: 'apiGateway', name: 'API Gateway', x: 700, y: 100, type: 'gateway' }, { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 300, type: 'database' }], connections: [{ from: 'cloudfront', to: 's3', label: 'Delivery' }, { from: 's3', to: 'lambda', label: 'Trigger' }, { from: 'lambda', to: 'apiGateway', label: 'Route' }, { from: 'apiGateway', to: 'dynamodb', label: 'Store' }] },
      eventease: { services: [{ id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' }, { id: 'lambdaAuth', name: 'Lambda Auth', x: 300, y: 100, type: 'compute' }, { id: 'lambdaEvent', name: 'Lambda Event', x: 500, y: 100, type: 'compute' }, { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 100, type: 'database' }, { id: 'cognito', name: 'Cognito', x: 100, y: 300, type: 'auth' }], connections: [{ from: 'apiGateway', to: 'lambdaAuth', label: 'Auth' }, { from: 'apiGateway', to: 'lambdaEvent', label: 'Event' }, { from: 'lambdaEvent', to: 'dynamodb', label: 'Data' }, { from: 'cognito', to: 'apiGateway', label: 'Auth Flow' }] },
      connectnow: { services: [{ id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' }, { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'compute' }, { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'database' }], connections: [{ from: 'apiGateway', to: 'lambda', label: 'WebSocket' }, { from: 'lambda', to: 'dynamodb', label: 'Session' }] }
    };

     currentProject: 'lic',
  canvas: null,
  ctx: null,
  tooltip: null,
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
  lastX: 0,
  lastY: 0,
  animationId: null,

  init(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById(tooltipId);
    if (!this.canvas || !this.ctx) return;

    this.resizeCanvas();
    this.attachEvents();
    this.animate();

    if (window.AWSFlow && window.AWSFlow.setProject)
      window.AWSFlow.setProject(this.currentProject);
  },

  setProject(project) {
    if (!this.architectures[project]) return;
    this.currentProject = project;
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1.0;
    this.resizeCanvas();
    if (window.AWSFlow && window.AWSFlow.setProject)
      window.AWSFlow.setProject(project);
  },

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.render();
  },

  attachEvents() {
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.5, Math.min(2, this.scale));
      this.render();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.offsetX += (e.clientX - this.lastX) / this.scale;
        this.offsetY += (e.clientY - this.lastY) / this.scale;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.render();
      }
    });

    this.canvas.addEventListener('mouseup', () => this.isDragging = false);
    this.canvas.addEventListener('mouseleave', () => this.isDragging = false);

    this.canvas.addEventListener('mousemove', this.handleTooltip.bind(this));
    this.canvas.addEventListener('mouseout', () => this.tooltip.style.display = 'none');
  },

  renderService(service, highlight = false) {
    const { x, y } = this.getTransformedPosition(service.x, service.y);
    const radius = 25;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = highlight ? 'rgba(255, 255, 0, 0.8)' : this.getServiceColor(service.type);
    this.ctx.fill();
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(service.name, 0, 40);
    this.ctx.restore();
  },

  renderConnection(from, to, label) {
    const fromPos = this.getTransformedPosition(from.x, from.y);
    const toPos = this.getTransformedPosition(to.x, to.y);

    this.ctx.beginPath();
    this.ctx.moveTo(fromPos.x, fromPos.y);
    this.ctx.lineTo(toPos.x, toPos.y);
    this.ctx.strokeStyle = 'orange';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    const midX = (fromPos.x + toPos.x) / 2;
    const midY = (fromPos.y + toPos.y) / 2;
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(label, midX, midY - 10);
  },

  getTransformedPosition(x, y) {
    return {
      x: x * this.scale + this.offsetX,
      y: y * this.scale + this.offsetY
    };
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
    if (window.AWSFlow && window.AWSFlow.drawParticles)
      window.AWSFlow.drawParticles(this.ctx, this.scale, this.offsetX, this.offsetY);
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  },

  handleTooltip(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;
    const { services } = this.architectures[this.currentProject];
    const hovered = services.find(s => Math.hypot(x - s.x, y - s.y) < 30);
    if (hovered) {
      const tooltipData = AWSTooltip.getServiceDetails(hovered.id);
      if (tooltipData) {
        this.tooltip.innerHTML = tooltipData;
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${e.clientX + 15}px`;
        this.tooltip.style.top = `${e.clientY - 10}px`;
      }
    } else {
      this.tooltip.style.display = 'none';
    }
  }
};

window.AWSArchitecture = AWSArchitecture;
document.addEventListener('DOMContentLoaded', () => {
  AWSArchitecture.init('aws-canvas', 'aws-tooltip');
});
