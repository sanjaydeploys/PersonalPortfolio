const AWSCanvas = {
  init(canvasId, tooltipId) {
    const canvas = document.getElementById(canvasId);
    const tooltip = document.getElementById(tooltipId);
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let currentProject = 'lic';
    let scale = 1.0;
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let offsetX = 0, offsetY = 0;

    const architectures = {
      lic: { services: [{ id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' }, { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'compute' }, { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'database' }, { id: 's3', name: 'S3', x: 500, y: 300, type: 'storage' }, { id: 'cloudfront', name: 'CloudFront', x: 100, y: 300, type: 'cdn' }, { id: 'sns', name: 'SNS', x: 300, y: 400, type: 'messaging' }, { id: 'cloudwatch', name: 'CloudWatch', x: 300, y: 200, type: 'monitoring' }], connections: [{ from: 'apiGateway', to: 'lambda', label: 'Request' }, { from: 'lambda', to: 'dynamodb', label: 'Data' }, { from: 'lambda', to: 's3', label: 'Assets' }, { from: 'cloudfront', to: 's3', label: 'Delivery' }, { from: 'lambda', to: 'sns', label: 'Notify' }, { from: 'lambda', to: 'cloudwatch', label: 'Monitor' }] },
      zedemy: { services: [{ id: 'cloudfront', name: 'CloudFront', x: 100, y: 100, type: 'cdn' }, { id: 's3', name: 'S3', x: 300, y: 100, type: 'storage' }, { id: 'lambda', name: 'Lambda', x: 500, y: 100, type: 'compute' }, { id: 'apiGateway', name: 'API Gateway', x: 700, y: 100, type: 'gateway' }, { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 300, type: 'database' }], connections: [{ from: 'cloudfront', to: 's3', label: 'Delivery' }, { from: 's3', to: 'lambda', label: 'Trigger' }, { from: 'lambda', to: 'apiGateway', label: 'Route' }, { from: 'apiGateway', to: 'dynamodb', label: 'Store' }] },
      eventease: { services: [{ id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' }, { id: 'lambdaAuth', name: 'Lambda Auth', x: 300, y: 100, type: 'compute' }, { id: 'lambdaEvent', name: 'Lambda Event', x: 500, y: 100, type: 'compute' }, { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 100, type: 'database' }, { id: 'cognito', name: 'Cognito', x: 100, y: 300, type: 'auth' }], connections: [{ from: 'apiGateway', to: 'lambdaAuth', label: 'Auth' }, { from: 'apiGateway', to: 'lambdaEvent', label: 'Event' }, { from: 'lambdaEvent', to: 'dynamodb', label: 'Data' }, { from: 'cognito', to: 'apiGateway', label: 'Auth Flow' }] },
      connectnow: { services: [{ id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, type: 'gateway' }, { id: 'lambda', name: 'Lambda', x: 300, y: 100, type: 'compute' }, { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, type: 'database' }], connections: [{ from: 'apiGateway', to: 'lambda', label: 'WebSocket' }, { from: 'lambda', to: 'dynamodb', label: 'Session' }] }
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth || 800;
      canvas.height = canvas.offsetHeight || 400;
      architectures[currentProject].services.forEach(service => {
        service.x = (service.x / 800) * canvas.width + offsetX;
        service.y = (service.y / 400) * canvas.height + offsetY;
      });
      render();
    };

    const renderService = (service, highlight = false) => {
      ctx.save();
      ctx.translate(service.x, service.y);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.arc(0, 0, 25, 0, Math.PI * 2);
      ctx.fillStyle = highlight ? 'rgba(255, 255, 0, 0.7)' : ({ gateway: '#1E90FF', compute: '#32CD32', database: '#FFD700', storage: '#FF4500', cdn: '#BA55D3', messaging: '#FF69B4', monitoring: '#4682B4', auth: '#6A5ACD' }[service.type] || '#808080');
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2 / scale;
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.font = `12px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(service.name, 0, 35 / scale);
      ctx.restore();
    };

    const renderConnection = (from, to, label) => {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = 'rgba(255, 153, 0, 0.7)';
      ctx.lineWidth = 2 / scale;
      ctx.stroke();
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 - 10 / scale;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = `12px sans-serif`;
      ctx.fillText(label, midX, midY);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const { services, connections } = architectures[currentProject];
      services.forEach(s => renderService(s));
      connections.forEach(conn => {
        const from = services.find(s => s.id === conn.from);
        const to = services.find(s => s.id === conn.to);
        if (from && to) renderConnection(from, to, conn.label);
      });
    };

    const animate = () => {
      render();
      if (window.AWSFlow && window.AWSFlow.drawParticles) {
        window.AWSFlow.drawParticles();
      }
      animationId = requestAnimationFrame(animate);
    };

    const setProject = (project) => {
      if (architectures[project]) {
        currentProject = project;
        offsetX = 0;
        offsetY = 0;
        scale = 1.0;
        resizeCanvas();
        if (window.AWSFlow && window.AWSFlow.setProject) {
          window.AWSFlow.setProject(project);
        }
      } else {
        console.error('Invalid project:', project);
      }
    };

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      scale *= e.deltaY < 0 ? 1.1 : 0.9;
      scale = Math.max(0.5, Math.min(2.0, scale));
      resizeCanvas();
    });

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        offsetX += (e.clientX - lastX) / scale;
        offsetY += (e.clientY - lastY) / scale;
        lastX = e.clientX;
        lastY = e.clientY;
        resizeCanvas();
      }
    });

    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    if (!canvas || !ctx) {
      console.error('Canvas setup failed');
      return;
    }

    resizeCanvas();
    animate();

    return { setProject, highlightService: (id) => {
      const service = architectures[currentProject].services.find(s => s.id === id);
      if (service) renderService(service, true);
    } };
  }
};

window.AWSCanvas = AWSCanvas;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.AWSCanvas.init('aws-canvas', 'aws-tooltip');
  });
} else {
  window.AWSCanvas.init('aws-canvas', 'aws-tooltip');
}
