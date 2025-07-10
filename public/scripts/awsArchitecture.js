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
          let dataFlow = null;
          let currentProject = 'lic';

          const architectures = {
            lic: {
              services: [
                { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-api-gateway.svg', type: 'gateway' },
                { id: 'lambda1', name: 'Lambda (CRM)', x: 300, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-lambda.svg', type: 'compute' },
                { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-dynamodb.svg', type: 'database' },
                { id: 's3', name: 'S3', x: 500, y: 300, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-s3.svg', type: 'storage' },
                { id: 'cloudfront', name: 'CloudFront', x: 100, y: 300, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cloudfront.svg', type: 'cdn' },
                { id: 'sns', name: 'SNS', x: 300, y: 400, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-sns.svg', type: 'messaging' },
                { id: 'cloudwatch', name: 'CloudWatch', x: 300, y: 200, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cloudwatch.svg', type: 'monitoring' }
              ],
              connections: [
                { from: 'apiGateway', to: 'lambda1', label: 'HTTP Request' },
                { from: 'lambda1', to: 'dynamodb', label: 'Read/Write' },
                { from: 'lambda1', to: 's3', label: 'Store Assets' },
                { from: 'cloudfront', to: 's3', label: 'Content Delivery' },
                { from: 'lambda1', to: 'sns', label: 'Notifications' },
                { from: 'lambda1', to: 'cloudwatch', label: 'Metrics' }
              ]
            },
            zedemy: {
              services: [
                { id: 'cloudfront', name: 'CloudFront', x: 100, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cloudfront.svg', type: 'cdn' },
                { id: 's3', name: 'S3', x: 300, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-s3.svg', type: 'storage' },
                { id: 'lambda1', name: 'Lambda', x: 500, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-lambda.svg', type: 'compute' },
                { id: 'apiGateway', name: 'API Gateway', x: 700, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-api-gateway.svg', type: 'gateway' },
                { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 300, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-dynamodb.svg', type: 'database' }
              ],
              connections: [
                { from: 'cloudfront', to: 's3', label: 'Content Delivery' },
                { from: 's3', to: 'lambda1', label: 'Trigger' },
                { from: 'lambda1', to: 'apiGateway', label: 'API Route' },
                { from: 'apiGateway', to: 'dynamodb', label: 'Data Store' }
              ]
            },
            eventease: {
              services: [
                { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-api-gateway.svg', type: 'gateway' },
                { id: 'lambda1', name: 'Lambda (Auth)', x: 300, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-lambda.svg', type: 'compute' },
                { id: 'lambda2', name: 'Lambda (Event)', x: 500, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-lambda.svg', type: 'compute' },
                { id: 'dynamodb', name: 'DynamoDB', x: 700, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-dynamodb.svg', type: 'database' },
                { id: 'cognito', name: 'Cognito', x: 100, y: 300, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cognito.svg', type: 'auth' }
              ],
              connections: [
                { from: 'apiGateway', to: 'lambda1', label: 'Auth' },
                { from: 'apiGateway', to: 'lambda2', label: 'Event CRUD' },
                { from: 'lambda2', to: 'dynamodb', label: 'Data Store' },
                { from: 'cognito', to: 'apiGateway', label: 'Auth Flow' }
              ]
            },
            connectnow: {
              services: [
                { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-api-gateway.svg', type: 'gateway' },
                { id: 'lambda1', name: 'Lambda', x: 300, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-lambda.svg', type: 'compute' },
                { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-dynamodb.svg', type: 'database' }
              ],
              connections: [
                { from: 'apiGateway', to: 'lambda1', label: 'WebSocket' },
                { from: 'lambda1', to: 'dynamodb', label: 'Session Data' }
              ]
            }
          };

          const loadIcons = async (services) => {
            console.log('[AWSArchitecture] Loading service icons...');
            for (const service of services) {
              try {
                const img = new Image();
                img.src = service.icon;
                service.img = img;
                await new Promise((resolve, reject) => {
                  img.onload = () => resolve();
                  img.onerror = () => { service.img = null; resolve(); };
                });
              } catch (error) {
                console.error(`[AWSArchitecture] Error loading icon for ${service.name}:`, error);
                service.img = null;
              }
            }
            console.log('[AWSArchitecture] Icon loading complete');
          };

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
                  const midX = (from.x + to.x) / 2;
                  const midY = (from.y + to.y) / 2 - 10;
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                  ctx.font = '12px sans-serif';
                  ctx.fillText(conn.label, midX, midY);
                }
              });
              services.forEach(service => {
                ctx.save();
                ctx.translate(service.x, service.y);
                if (service.img) {
                  ctx.drawImage(service.img, -25, -25, 50, 50);
                } else {
                  ctx.fillStyle = 'rgba(255, 153, 0, 0.8)';
                  ctx.fillRect(-25, -25, 50, 50);
                  ctx.fillStyle = 'white';
                  ctx.font = '10px sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText(service.name, 0, 0);
                }
                ctx.fillStyle = 'white';
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(service.name, 0, 40);
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
              } else if (!dataFlow && window.AWSDataFlow) {
                dataFlow = window.AWSDataFlow.init(canvas, architectures[currentProject].services, architectures[currentProject].connections);
                if (dataFlow && typeof dataFlow.start === 'function') {
                  dataFlow.start();
                  console.log('[AWSArchitecture] DataFlow initialized and started');
                }
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
              loadIcons(architectures[project].services).then(() => {
                resizeCanvas();
                if (dataFlow && typeof dataFlow.setProject === 'function') {
                  dataFlow.setProject(project);
                }
                draw();
                console.log(`[AWSArchitecture] Switched to project: ${project}`);
              });
            } else {
              console.error(`[AWSArchitecture] Invalid project: ${project}`);
            }
          };

          await loadIcons(architectures[currentProject].services);
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);
          if (window.AWSTooltip) {
            window.AWSTooltip.init(canvas, architectures[currentProject].services, tooltip);
          }
          animate();
          return { setProject, stop: () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); } };
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
