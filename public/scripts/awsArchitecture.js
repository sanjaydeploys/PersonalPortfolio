const AWSArchitecture = {
  icons: {},
  architectures: {},
  canvas: null,
  ctx: null,
  tooltip: null,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  currentProject: 'lic',
  isDragging: false,
  lastX: 0,
  lastY: 0,
  animationId: null,

  async init(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById(tooltipId);
    if (!this.canvas || !this.ctx || !this.tooltip) {
      console.error('Missing DOM elements.');
      return;
    }

    await this.loadIcons();
    this.defineArchitectures();
    this.attachEvents();
    this.resizeCanvas();
    this.animate();

    if (window.AWSFlow?.setProject) window.AWSFlow.setProject(this.currentProject);
    window.AWSArchitecture = this;
  },

  async loadIcons() {
    const types = {
      apiGateway: 'API-Gateway',
      lambda: 'Lambda',
      lambdaAuth: 'Lambda',
      lambdaEvent: 'Lambda',
      dynamodb: 'DynamoDB',
      s3: 'S3',
      cloudfront: 'CloudFront',
      sns: 'SNS',
      cloudwatch: 'CloudWatch',
      cognito: 'Cognito'
    };
    const base = 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_';
    for (const [key, name] of Object.entries(types)) {
      const img = new Image();
      img.src = `${base}${name}_64.svg`;
      await new Promise(r => (img.onload = r));
      this.icons[key] = img;
    }
  },

  defineArchitectures() {
    const make = (services, connections) => ({ services, connections });
    this.architectures = {
      lic: make(
        [
          { id: 'apiGateway', x: 100, y: 100, type: 'apiGateway' },
          { id: 'lambda', x: 300, y: 100, type: 'lambda' },
          { id: 'dynamodb', x: 500, y: 100, type: 'dynamodb' },
          { id: 's3', x: 500, y: 300, type: 's3' },
          { id: 'cloudfront', x: 100, y: 300, type: 'cloudfront' },
          { id: 'sns', x: 300, y: 400, type: 'sns' },
          { id: 'cloudwatch', x: 300, y: 200, type: 'cloudwatch' }
        ],
        [
          { from: 'apiGateway', to: 'lambda', label: 'Request' },
          { from: 'lambda', to: 'dynamodb', label: 'Data' },
          { from: 'lambda', to: 's3', label: 'Assets' },
          { from: 'cloudfront', to: 's3', label: 'Delivery' },
          { from: 'lambda', to: 'sns', label: 'Notify' },
          { from: 'lambda', to: 'cloudwatch', label: 'Monitor' }
        ]
      ),
      zedemy: make(
        [
          { id: 'cloudfront', x: 100, y: 100, type: 'cloudfront' },
          { id: 's3', x: 300, y: 100, type: 's3' },
          { id: 'lambda', x: 500, y: 100, type: 'lambda' },
          { id: 'apiGateway', x: 700, y: 100, type: 'apiGateway' },
          { id: 'dynamodb', x: 700, y: 300, type: 'dynamodb' }
        ],
        [
          { from: 'cloudfront', to: 's3', label: 'Delivery' },
          { from: 's3', to: 'lambda', label: 'Trigger' },
          { from: 'lambda', to: 'apiGateway', label: 'Route' },
          { from: 'apiGateway', to: 'dynamodb', label: 'Store' }
        ]
      ),
      eventease: make(
        [
          { id: 'apiGateway', x: 100, y: 100, type: 'apiGateway' },
          { id: 'lambdaAuth', x: 300, y: 100, type: 'lambdaAuth' },
          { id: 'lambdaEvent', x: 500, y: 100, type: 'lambdaEvent' },
          { id: 'dynamodb', x: 700, y: 100, type: 'dynamodb' },
          { id: 'cognito', x: 100, y: 300, type: 'cognito' }
        ],
        [
          { from: 'apiGateway', to: 'lambdaAuth', label: 'Auth' },
          { from: 'apiGateway', to: 'lambdaEvent', label: 'Event' },
          { from: 'lambdaEvent', to: 'dynamodb', label: 'Data' },
          { from: 'cognito', to: 'apiGateway', label: 'Auth Flow' }
        ]
      ),
      connectnow: make(
        [
          { id: 'apiGateway', x: 100, y: 100, type: 'apiGateway' },
          { id: 'lambda', x: 300, y: 100, type: 'lambda' },
          { id: 'dynamodb', x: 500, y: 100, type: 'dynamodb' }
        ],
        [
          { from: 'apiGateway', to: 'lambda', label: 'WebSocket' },
          { from: 'lambda', to: 'dynamodb', label: 'Session' }
        ]
      )
    };
  },

  attachEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());
    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.5, Math.min(2.5, this.scale));
      this.render();
    });

    this.canvas.addEventListener('mousedown', e => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    this.canvas.addEventListener('mouseup', () => this.isDragging = false);
    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.tooltip.style.display = 'none';
    });

    this.canvas.addEventListener('mousemove', e => {
      if (this.isDragging) {
        this.offsetX += (e.clientX - this.lastX) / this.scale;
        this.offsetY += (e.clientY - this.lastY) / this.scale;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.render();
      } else {
        this.handleTooltip(e);
      }
    });
  },

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.render();
  },

  setProject(project) {
    if (this.architectures[project]) {
      this.currentProject = project;
      this.offsetX = 0;
      this.offsetY = 0;
      this.scale = 1;
      this.render();
      if (window.AWSFlow?.setProject) window.AWSFlow.setProject(project);
    }
  },

  render() {
    const { services, connections } = this.architectures[this.currentProject];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    connections.forEach(conn => {
      const from = services.find(s => s.id === conn.from);
      const to = services.find(s => s.id === conn.to);
      if (from && to) {
        this.ctx.strokeStyle = 'rgba(255,153,0,0.7)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(from.x * this.scale + this.offsetX, from.y * this.scale + this.offsetY);
        this.ctx.lineTo(to.x * this.scale + this.offsetX, to.y * this.scale + this.offsetY);
        this.ctx.stroke();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px sans-serif';
        this.ctx.fillText(
          conn.label,
          ((from.x + to.x) / 2) * this.scale + this.offsetX,
          ((from.y + to.y) / 2) * this.scale + this.offsetY - 10
        );
      }
    });

    services.forEach(s => {
      const img = this.icons[s.type];
      if (img) {
        this.ctx.drawImage(img, s.x * this.scale + this.offsetX - 32, s.y * this.scale + this.offsetY - 32, 64, 64);
      }
    });
  },

  handleTooltip(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;

    const services = this.architectures[this.currentProject].services;
    const service = services.find(s => {
      const dx = x - s.x;
      const dy = y - s.y;
      return dx * dx + dy * dy <= 30 * 30;
    });

    if (service && this.icons[service.type]) {
      this.tooltip.style.display = 'block';
      this.tooltip.innerHTML = `<strong>${service.type}</strong>`;
      this.tooltip.style.left = `${e.clientX + 15}px`;
      this.tooltip.style.top = `${e.clientY + 15}px`;
    } else {
      this.tooltip.style.display = 'none';
    }
  },

  animate() {
    this.render();
    if (window.AWSFlow?.drawParticles) {
      window.AWSFlow.drawParticles();
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AWSArchitecture.init('aws-canvas', 'aws-tooltip'));
} else {
  AWSArchitecture.init('aws-canvas', 'aws-tooltip');
}
