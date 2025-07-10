try {
  console.log('[AWSArchitecture] Script loaded and parsed');

  const AWSArchitecture = {
    init(canvasId = 'aws-canvas', tooltipId = 'aws-tooltip') {
      console.log(`[AWSArchitecture] Attempting initialization with canvasId: ${canvasId}, tooltipId: ${tooltipId}`);

      const showFallback = () => {
        const fallback = document.getElementById('aws-fallback');
        if (fallback) {
          fallback.style.display = 'block';
          console.log('[AWSArchitecture] Displaying fallback message');
        }
      };

      const getElements = (attempt = 1, maxAttempts = 10) => {
        console.log(`[AWSArchitecture] Checking for elements, attempt ${attempt}/${maxAttempts}`);
        const canvas = document.getElementById(canvasId);
        const tooltip = document.getElementById(tooltipId);
        if (canvas && tooltip) {
          return { canvas, tooltip };
        }
        if (attempt >= maxAttempts) {
          console.error(`[AWSArchitecture] Failed to find canvas or tooltip after ${maxAttempts} attempts`);
          showFallback();
          return null;
        }
        return new Promise(resolve => setTimeout(() => resolve(getElements(attempt + 1, maxAttempts)), 500));
      };

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

      const start = async () => {
        try {
          console.log('[AWSArchitecture] Starting initialization');
          const elements = await getElements();
          if (!elements) return;

          const { canvas, tooltip } = elements;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('[AWSArchitecture] Failed to get 2D context for canvas');
            showFallback();
            return;
          }
          console.log('[AWSArchitecture] Canvas context acquired');

          let animationFrameId = null;
          let currentProject = 'lic';
          let dataFlow = null;

          const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth || 800;
            canvas.height = canvas.offsetHeight || 400;
            architectures[currentProject].services.forEach(service => {
              service.x = (service.x / 800) * canvas.width;
              service.y = (service.y / 400) * canvas.height;
            });
            console.log(`[AWSArchitecture] Canvas resized to ${canvas.width}x${canvas.height}`);
            draw();
          };

          const draw = () => {
            try {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = 'rgba(26, 26, 46, 1)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              const { services, connections } = architectures[currentProject];
              connections.forEach(conn => {
                const from = services.find(s => s.id === conn.from);
                const to = services.find(s => s.id === conn.to);
                if (from && to) {
                  ctx.beginPath();
                  ctx.moveTo(from.x, from.y);
                  ctx.lineTo(to.x, to.y);
                  ctx.strokeStyle = 'rgba(255, 153, 0, 0.8)';
                  ctx.lineWidth = 2;
                  ctx.stroke();

                  // Draw directional arrow
                  const angle = Math.atan2(to.y - from.y, to.x - from.x);
                  const arrowSize = 10;
                  ctx.beginPath();
                  ctx.moveTo(to.x - arrowSize * Math.cos(angle - Math.PI / 6), to.y - arrowSize * Math.sin(angle - Math.PI / 6));
                  ctx.lineTo(to.x, to.y);
                  ctx.lineTo(to.x - arrowSize * Math.cos(angle + Math.PI / 6), to.y - arrowSize * Math.sin(angle + Math.PI / 6));
                  ctx.fillStyle = 'rgba(255, 153, 0, 0.8)';
                  ctx.fill();

                  const midX = (from.x + to.x) / 2;
                  const midY = (from.y + to.y) / 2;
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                  ctx.font = '12px sans-serif';
                  ctx.fillText(conn.label, midX, midY - 10);
                }
              });
              services.forEach(service => {
                ctx.save();
                ctx.translate(service.x, service.y);
                ctx.fillStyle = service.type === 'frontend' ? 'rgba(0, 128, 0, 0.8)' : service.type === 'database' ? 'rgba(0, 0, 128, 0.8)' : 'rgba(128, 0, 0, 0.8)';
                ctx.fillRect(-25, -25, 50, 50);
                ctx.fillStyle = 'white';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(service.name, 0, 0);
                ctx.restore();
              });
              console.log('[AWSArchitecture] Architecture drawn');
            } catch (error) {
              console.error('[AWSArchitecture] Draw error:', error);
              showFallback();
            }
          };

          const animate = () => {
            try {
              draw();
              if (dataFlow && typeof dataFlow.isAnimating === 'function' && dataFlow.isAnimating()) {
                dataFlow.drawParticles();
                console.log('[AWSArchitecture] Particles drawn');
              } else {
                console.log('[AWSArchitecture] No animation (not animating)');
              }
              animationFrameId = requestAnimationFrame(animate);
              console.log('[AWSArchitecture] Animation frame requested');
            } catch (error) {
              console.error('[AWSArchitecture] Animation error:', error);
              showFallback();
            }
          };

          const setProject = (project) => {
            if (architectures[project]) {
              currentProject = project;
              resizeCanvas();
              if (dataFlow && typeof dataFlow.setProject === 'function') {
                dataFlow.setProject(project);
              }
              console.log(`[AWSArchitecture] Switched to project: ${project}`);
            }
          };

          console.log('[AWSArchitecture] Starting async initialization');
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);
          if (window.AWSTooltip) {
            window.AWSTooltip.init(canvas, architectures[currentProject].services, tooltip);
            console.log('[AWSArchitecture] AWSTooltip initialized');
          }
          animate();
          console.log('[AWSArchitecture] Animation loop started');

          return { stop: () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resizeCanvas); }, setProject };
        } catch (error) {
          console.error('[AWSArchitecture] Initialization error:', error);
          showFallback();
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }

      return { init };
    }
  };

  window.AWSArchitecture = AWSArchitecture;
  console.log('[AWSArchitecture] Initializing immediately');
  AWSArchitecture.init();
} catch (error) {
  console.error('[AWSArchitecture] Script-level error:', error);
  const fallback = document.getElementById('aws-fallback');
  if (fallback) fallback.style.display = 'block';
}
