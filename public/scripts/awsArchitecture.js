const AWSArchitecture = {
  init(canvasId = 'aws-canvas', tooltipId = 'aws-tooltip') {
    console.log(`[AWSArchitecture] Initializing with canvasId: ${canvasId}, tooltipId: ${tooltipId}`);

    const canvas = document.getElementById(canvasId);
    const tooltip = document.getElementById(tooltipId);
    if (!canvas || !tooltip || !canvas.getContext) {
      console.error('[AWSArchitecture] Required elements or context not found');
      document.getElementById('aws-fallback').style.display = 'block';
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId, dataFlow, currentProject = 'lic';

    const architectures = {
      lic: {
        services: [
          { id: 'reactFrontend', name: 'React Frontend (S3)', x: 100, y: 100, type: 'frontend' },
          { id: 'cloudFront', name: 'CDN (CloudFront)', x: 250, y: 100, type: 'cdn' },
          { id: 'cloudflareDNS', name: 'DNS (Cloudflare)', x: 400, y: 100, type: 'dns' },
          { id: 'lambda', name: 'Lambda', x: 100, y: 250, type: 'compute' },
          { id: 'apiGateway', name: 'API Gateway', x: 250, y: 250, type: 'gateway' },
          { id: 'mongoDB', name: 'MongoDB Atlas', x: 400, y: 250, type: 'database' },
          { id: 'sslCert', name: 'SSL Certificate', x: 250, y: 175, type: 'security' },
          { id: 'emailService', name: 'Email Service (SES)', x: 325, y: 325, type: 'messaging' },
          { id: 'cloudWatch', name: 'CloudWatch', x: 175, y: 325, type: 'monitoring' }
        ],
        connections: [
          { from: 'reactFrontend', to: 'cloudFront', label: 'Content Delivery', direction: 'right' },
          { from: 'cloudFront', to: 'cloudflareDNS', label: 'DNS Routing', direction: 'right' },
          { from: 'reactFrontend', to: 'lambda', label: 'Inquiry POST', direction: 'down' },
          { from: 'lambda', to: 'apiGateway', label: 'API Route', direction: 'right' },
          { from: 'apiGateway', to: 'mongoDB', label: 'Data Store', direction: 'right' },
          { from: 'sslCert', to: 'cloudFront', label: 'TLS', direction: 'down' },
          { from: 'lambda', to: 'emailService', label: 'Notification', direction: 'down-right' },
          { from: 'lambda', to: 'cloudWatch', label: 'Logs', direction: 'down-left' }
        ]
      },
      zedemy: {
        services: [
          { id: 'reactFrontend', name: 'React Frontend (Vercel)', x: 100, y: 100, type: 'frontend' },
          { id: 'lambda', name: 'Lambda', x: 250, y: 100, type: 'compute' },
          { id: 'apiGateway', name: 'API Gateway', x: 400, y: 100, type: 'gateway' },
          { id: 'dynamodb', name: 'DynamoDB', x: 550, y: 100, type: 'database' },
          { id: 'codeEditor', name: 'Code Editor', x: 100, y: 250, type: 'frontend' },
          { id: 'certificateService', name: 'Certificate Service', x: 250, y: 250, type: 'service' },
          { id: 'vercelRewrites', name: 'Vercel Rewrites', x: 400, y: 250, type: 'routing' }
        ],
        connections: [
          { from: 'reactFrontend', to: 'lambda', label: 'API Calls', direction: 'right' },
          { from: 'lambda', to: 'apiGateway', label: 'Trigger', direction: 'right' },
          { from: 'apiGateway', to: 'dynamodb', label: 'Data Ops', direction: 'right' },
          { from: 'reactFrontend', to: 'codeEditor', label: 'In-Browser', direction: 'down' },
          { from: 'lambda', to: 'certificateService', label: 'Generate', direction: 'down' },
          { from: 'certificateService', to: 'dynamodb', label: 'Store', direction: 'right' },
          { from: 'vercelRewrites', to: 'apiGateway', label: 'Route', direction: 'up' }
        ]
      },
      eventease: {
        services: [
          { id: 'reactApp', name: 'React App (Vercel)', x: 100, y: 100, type: 'frontend' },
          { id: 'apiGateway', name: 'API Gateway', x: 250, y: 100, type: 'gateway' },
          { id: 'lambdaAuth', name: 'Lambda (Auth)', x: 400, y: 100, type: 'compute' },
          { id: 'lambdaEvent', name: 'Lambda (Event)', x: 550, y: 100, type: 'compute' },
          { id: 'lambdaCalendar', name: 'Lambda (Calendar)', x: 700, y: 100, type: 'compute' },
          { id: 'mongoDB', name: 'MongoDB Atlas', x: 400, y: 250, type: 'database' },
          { id: 'googleCalendar', name: 'Google Calendar API', x: 700, y: 250, type: 'external' },
          { id: 'githubCICD', name: 'GitHub → Vercel CI/CD', x: 100, y: 250, type: 'devops' }
        ],
        connections: [
          { from: 'reactApp', to: 'apiGateway', label: 'API Requests', direction: 'right' },
          { from: 'apiGateway', to: 'lambdaAuth', label: 'Auth', direction: 'right' },
          { from: 'apiGateway', to: 'lambdaEvent', label: 'CRUD', direction: 'right' },
          { from: 'apiGateway', to: 'lambdaCalendar', label: 'Sync', direction: 'right' },
          { from: 'lambdaEvent', to: 'mongoDB', label: 'Data Store', direction: 'down' },
          { from: 'lambdaCalendar', to: 'googleCalendar', label: 'Sync', direction: 'down' },
          { from: 'githubCICD', to: 'reactApp', label: 'Deploy', direction: 'down-right' }
        ]
      },
      connectnow: {
        services: [
          { id: 'reactFrontend', name: 'React Frontend (Vercel)', x: 100, y: 100, type: 'frontend' },
          { id: 'socketServer', name: 'Socket.IO Server', x: 250, y: 100, type: 'backend' },
          { id: 'webrtc', name: 'WebRTC (P2P)', x: 400, y: 100, type: 'communication' },
          { id: 'mongoDB', name: 'MongoDB', x: 550, y: 100, type: 'database' }
        ],
        connections: [
          { from: 'reactFrontend', to: 'socketServer', label: 'Signaling', direction: 'right' },
          { from: 'socketServer', to: 'webrtc', label: 'Offer/Answer', direction: 'right' },
          { from: 'webrtc', to: 'reactFrontend', label: 'P2P Stream', direction: 'left' },
          { from: 'socketServer', to: 'mongoDB', label: 'User Data', direction: 'down-right' }
        ]
      }
    };

    const resizeCanvas = () => {
      const width = canvas.offsetWidth || 800;
      const height = canvas.offsetHeight || 400;
      canvas.width = width;
      canvas.height = height;
      architectures[currentProject].services.forEach(service => {
        service.x = (service.x / 800) * width;
        service.y = (service.y / 400) * height;
      });
      console.log(`[AWSArchitecture] Canvas resized to ${width}x${height}`);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(18, 18, 36, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const { services, connections } = architectures[currentProject];
      connections.forEach(conn => {
        const from = services.find(s => s.id === conn.from);
        const to = services.find(s => s.id === conn.to);
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = 'rgba(255, 204, 0, 0.9)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          const arrowSize = 12;
          ctx.beginPath();
          ctx.moveTo(to.x - arrowSize * Math.cos(angle - Math.PI / 6), to.y - arrowSize * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(to.x, to.y);
          ctx.lineTo(to.x - arrowSize * Math.cos(angle + Math.PI / 6), to.y - arrowSize * Math.sin(angle + Math.PI / 6));
          ctx.fillStyle = 'rgba(255, 204, 0, 0.9)';
          ctx.fill();
        }
      });
      services.forEach(service => {
        ctx.save();
        ctx.translate(service.x, service.y);
        const radius = 30;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = service.type === 'frontend' ? 'rgba(0, 150, 0, 0.7)' : service.type === 'database' ? 'rgba(0, 100, 150, 0.7)' : 'rgba(150, 0, 0, 0.7)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '12px "Segoe UI", sans-serif';
        const lines = service.name.split(' ');
        lines.forEach((line, i) => {
          ctx.fillText(line, 0, -5 + i * 15);
        });
        ctx.restore();
      });
      if (dataFlow && dataFlow.isAnimating()) {
        dataFlow.drawParticles();
      }
    };

    const animate = () => {
      draw();
      if (!dataFlow && window.AWSDataFlow) {
        dataFlow = window.AWSDataFlow.init(canvas, architectures[currentProject].services, architectures[currentProject].connections);
        if (dataFlow && typeof dataFlow.start === 'function') {
          dataFlow.start();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const setProject = (project) => {
      if (architectures[project]) {
        currentProject = project;
        resizeCanvas();
        if (dataFlow && typeof dataFlow.setProject === 'function') {
          dataFlow.setProject(project);
        }
        draw();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    if (window.AWSTooltip) {
      window.AWSTooltip.init(canvas, architectures[currentProject].services, tooltip);
    }
    animate();
    return { setProject };
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.AWSArchitecture = AWSArchitecture;
    AWSArchitecture.init();
  });
} else {
  window.AWSArchitecture = AWSArchitecture;
  AWSArchitecture.init();
}
