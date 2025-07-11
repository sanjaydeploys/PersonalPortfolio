const AWSCanvas = {
  architectures: {},
  icons: {},
  canvas: null,
  ctx: null,
  tooltip: null,
  scale: 1.0,
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

    if (!this.canvas || !this.ctx) {
      console.error('Canvas or context not available');
      return;
    }

    await this.loadIcons();
    this.defineArchitectures();
    this.setupEvents();
    this.resizeCanvas();
    this.animate();

    return {
      setProject: this.setProject.bind(this),
      highlightService: this.highlightService.bind(this),
    };
  },

  defineArchitectures() {
    this.architectures = {
      lic: {
        services: [
          { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'apigateway' },
          { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'lambda' },
          { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'dynamodb' },
          { id: 's3', name: 'S3', x: 500, y: 300, type: 's3' },
          { id: 'cloudfront', name: 'CloudFront', x: 100, y: 300, type: 'cloudfront' },
          { id: 'sns', name: 'SNS', x: 300, y: 400, type: 'sns' },
          { id: 'cloudwatch', name: 'CloudWatch', x: 300, y: 200, type: 'cloudwatch' },
        ],
        connections: [
          { from: 'apiGateway', to: 'lambda', label: 'Request' },
          { from: 'lambda', to: 'dynamodb', label: 'Data' },
          { from: 'lambda', to: 's3', label: 'Assets' },
          { from: 'cloudfront', to: 's3', label: 'Delivery' },
          { from: 'lambda', to: 'sns', label: 'Notify' },
          { from: 'lambda', to: 'cloudwatch', label: 'Monitor' },
        ]
      },
      zedemy: {
        services: [
          { id: 'cloudfront', name: 'CloudFront', x: 100, y: 100, type: 'cloudfront' },
          { id: 's3', name: 'S3', x: 300, y: 100, type: 's3' },
          { id: 'lambda', name: 'Lambda', x: 500, y: 100, type: 'lambda' },
          { id: 'apiGateway', name: 'API Gateway', x: 700, y: 100, type: 'apigateway' },
          { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 300, type: 'dynamodb' },
        ],
        connections: [
          { from: 'cloudfront', to: 's3', label: 'Delivery' },
          { from: 's3', to: 'lambda', label: 'Trigger' },
          { from: 'lambda', to: 'apiGateway', label: 'Route' },
          { from: 'apiGateway', to: 'dynamodb', label: 'Store' },
        ]
      },
      eventease: {
        services: [
          { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'apigateway' },
          { id: 'lambdaAuth', name: 'Lambda Auth', x: 300, y: 100, type: 'lambda' },
          { id: 'lambdaEvent', name: 'Lambda Event', x: 500, y: 100, type: 'lambda' },
          { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 100, type: 'dynamodb' },
          { id: 'cognito', name: 'Cognito', x: 100, y: 300, type: 'cognito' },
        ],
        connections: [
          { from: 'apiGateway', to: 'lambdaAuth', label: 'Auth' },
          { from: 'apiGateway', to: 'lambdaEvent', label: 'Event' },
          { from: 'lambdaEvent', to: 'dynamodb', label: 'Data' },
          { from: 'cognito', to: 'apiGateway', label: 'Auth Flow' },
        ]
      },
      connectnow: {
        services: [
          { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'apigateway' },
          { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'lambda' },
          { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'dynamodb' },
        ],
        connections: [
          { from: 'apiGateway', to: 'lambda', label: 'WebSocket' },
          { from: 'lambda', to: 'dynamodb', label: 'Session' },
        ]
      }
    };
  },

  async loadIcons() {
    const types = ['apigateway', 'lambda', 'dynamodb', 's3', 'cloudfront', 'sns', 'cloudwatch', 'cognito'];
    const baseUrl = 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_';

    for (const type of types) {
      const name = type === 'apigateway' ? 'API-Gateway' : type.charAt(0).toUpperCase() + type.slice(1);
      const img = new Image();
      img.src = `${baseUrl}${name}_64.svg`;
      await new Promise((res) => (img.onload = res));
      this.icons[type] = img;
    }
  },

  setupEvents() {
    window.addEventListener('resize', this.resizeCanvas.bind(this));

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.scale *= e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.5, Math.min(2.5, this.scale));
      this.render();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    this.canvas.addEventListener('mouseup', () => (this.isDragging = false));
    this.canvas.addEventListener('mouseleave', () => (this.isDragging = false));

    this.canvas.addEventListener('mousemove', (e) => {
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
      this.scale = 1.0;
      this.render();
      if (window.AWSFlow && window.AWSFlow.setProject) {
        window.AWSFlow.setProject(project);
      }
    } else {
      console.error('Invalid project:', project);
    }
  },

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const { services, connections } = this.architectures[this.currentProject];

    // Draw connections
    connections.forEach(({ from, to, label }) => {
      const a = services.find(s => s.id === from);
      const b = services.find(s => s.id === to);
      if (a && b) {
        ctx.beginPath();
        ctx.moveTo(a.x * this.scale + this.offsetX, a.y * this.scale + this.offsetY);
        ctx.lineTo(b.x * this.scale + this.offsetX, b.y * this.scale + this.offsetY);
        ctx.strokeStyle = 'rgba(255,153,0,0.7)';
        ctx.lineWidth = 2 / this.scale;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.fillText(label, (a.x + b.x) / 2 * this.scale + this.offsetX, (a.y + b.y) / 2 * this.scale + this.offsetY - 10);
      }
    });

    // Draw services
    services.forEach(s => {
      const img = this.icons[s.type];
      if (img) {
        ctx.drawImage(img, s.x * this.scale + this.offsetX - 32, s.y * this.scale + this.offsetY - 32, 64, 64);
        ctx.fillStyle = 'white';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(s.name, s.x * this.scale + this.offsetX, s.y * this.scale + this.offsetY + 40);
      }
    });
  },

  handleTooltip(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.scale;
    const y = (e.clientY - rect.top - this.offsetY) / this.scale;

    const { services } = this.architectures[this.currentProject];
    const hovered = services.find(s => Math.hypot(s.x - x, s.y - y) < 32);
    if (hovered) {
      if (window.AWSTooltip && window.AWSTooltip.show) {
        window.AWSTooltip.show(hovered, e.pageX, e.pageY);
      }
    } else {
      if (window.AWSTooltip && window.AWSTooltip.hide) {
        window.AWSTooltip.hide();
      }
    }
  },

  animate() {
    this.render();
    if (window.AWSFlow && window.AWSFlow.drawParticles) {
      window.AWSFlow.drawParticles();
    }
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  },

  highlightService(id) {
    this.render(); // re-render ensures highlighting happens in AWSFlow/tooltip instead
  }
};

window.AWSArchitecture = AWSCanvas;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AWSCanvas.init('aws-canvas', 'aws-tooltip');
  });
} else {
  AWSCanvas.init('aws-canvas', 'aws-tooltip');
}
