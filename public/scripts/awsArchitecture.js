const AWSArchitecture = (() => {
  let canvas, ctx, tooltip;
  let scale = 1, offsetX = 0, offsetY = 0;
  let isDragging = false, lastX = 0, lastY = 0;
  let currentProject = 'lic';
  let icons = {};
  let architectures = {};
  let animationId = null;

  const AWS_SVG_BASE = 'https://d1.awsstatic.com/webteam/architecture-icons/q1-2022/Arch_';

  const serviceMap = {
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

  const loadIcons = async () => {
    const promises = Object.entries(serviceMap).map(([key, name]) => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = `${AWS_SVG_BASE}${name}_64.svg`;
        img.onload = () => {
          icons[key] = img;
          resolve();
        };
      });
    });
    return Promise.all(promises);
  };

  const defineArchitectures = () => {
    architectures = {
      lic: {
        services: [
          { id: 'apiGateway', x: 100, y: 100, type: 'apiGateway' },
          { id: 'lambda', x: 300, y: 100, type: 'lambda' },
          { id: 'dynamodb', x: 500, y: 100, type: 'dynamodb' },
          { id: 's3', x: 500, y: 300, type: 's3' },
          { id: 'cloudfront', x: 100, y: 300, type: 'cloudfront' },
          { id: 'sns', x: 300, y: 400, type: 'sns' },
          { id: 'cloudwatch', x: 300, y: 200, type: 'cloudwatch' }
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
          { id: 'cloudfront', x: 100, y: 100, type: 'cloudfront' },
          { id: 's3', x: 300, y: 100, type: 's3' },
          { id: 'lambda', x: 500, y: 100, type: 'lambda' },
          { id: 'apiGateway', x: 700, y: 100, type: 'apiGateway' },
          { id: 'dynamodb', x: 700, y: 300, type: 'dynamodb' }
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
          { id: 'apiGateway', x: 100, y: 100, type: 'apiGateway' },
          { id: 'lambdaAuth', x: 300, y: 100, type: 'lambdaAuth' },
          { id: 'lambdaEvent', x: 500, y: 100, type: 'lambdaEvent' },
          { id: 'dynamodb', x: 700, y: 100, type: 'dynamodb' },
          { id: 'cognito', x: 100, y: 300, type: 'cognito' }
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
          { id: 'apiGateway', x: 100, y: 100, type: 'apiGateway' },
          { id: 'lambda', x: 300, y: 100, type: 'lambda' },
          { id: 'dynamodb', x: 500, y: 100, type: 'dynamodb' }
        ],
        connections: [
          { from: 'apiGateway', to: 'lambda', label: 'WebSocket' },
          { from: 'lambda', to: 'dynamodb', label: 'Session' }
        ]
      }
    };
  };

  const render = () => {
    const { services, connections } = architectures[currentProject];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Connections
    connections.forEach(conn => {
      const from = services.find(s => s.id === conn.from);
      const to = services.find(s => s.id === conn.to);
      if (from && to) {
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(from.x * scale + offsetX, from.y * scale + offsetY);
        ctx.lineTo(to.x * scale + offsetX, to.y * scale + offsetY);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText(
          conn.label,
          ((from.x + to.x) / 2) * scale + offsetX,
          ((from.y + to.y) / 2) * scale + offsetY - 10
        );
      }
    });

    // Services
    services.forEach(s => {
      const img = icons[s.type];
      if (img) {
        ctx.drawImage(img, s.x * scale + offsetX - 32, s.y * scale + offsetY - 32, 64, 64);
      }
    });
  };

  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    render();
  };

  const attachEvents = () => {
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      scale *= e.deltaY < 0 ? 1.1 : 0.9;
      scale = Math.max(0.5, Math.min(2.5, scale));
      render();
    });

    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);

    canvas.addEventListener('mousemove', e => {
      if (isDragging) {
        offsetX += (e.clientX - lastX);
        offsetY += (e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
        render();
      }
    });
  };

  const animate = () => {
    render();
    if (window.AWSFlow?.drawParticles) {
      window.AWSFlow.drawParticles();
    }
    animationId = requestAnimationFrame(animate);
  };

  const setProject = (project) => {
    if (architectures[project]) {
      currentProject = project;
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      render();
      if (window.AWSFlow?.setProject) window.AWSFlow.setProject(project);
    }
  };

  return {
    init: async (canvasId, tooltipId) => {
      canvas = document.getElementById(canvasId);
      ctx = canvas.getContext('2d');
      tooltip = document.getElementById(tooltipId);
      if (!canvas || !ctx) {
        console.error('[AWSArchitecture] Canvas or context not found.');
        return;
      }

      await loadIcons();
      defineArchitectures();
      attachEvents();
      resizeCanvas();
      animate();

      window.AWSArchitecture = { setProject };
    }
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    AWSArchitecture.init('aws-canvas', 'aws-tooltip');
  });
} else {
  AWSArchitecture.init('aws-canvas', 'aws-tooltip');
}
