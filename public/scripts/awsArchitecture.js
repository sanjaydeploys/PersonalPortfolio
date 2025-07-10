try {
  console.log('[AWSArchitecture] Script loaded and parsed');

  const AWSArchitecture = {
    init(canvasId = 'aws-canvas', tooltipId = 'aws-tooltip') {
      console.log(`[AWSArchitecture] Attempting initialization with canvasId: ${canvasId}, tooltipId: ${tooltipId}`);

      // Show fallback message
      const showFallback = () => {
        const fallback = document.getElementById('aws-fallback');
        if (fallback) {
          fallback.style.display = 'block';
          console.log('[AWSArchitecture] Displaying fallback message');
        }
      };

      // Retry mechanism for DOM elements
      const getElements = (attempt = 1, maxAttempts = 10) => {
        console.log(`[AWSArchitecture] Checking for elements, attempt ${attempt}/${maxAttempts}`);
        const canvas = document.getElementById(canvasId);
        const tooltip = document.getElementById(tooltipId);
        if (canvas && tooltip) {
          console.log(`[AWSArchitecture] Found canvas and tooltip elements`);
          return { canvas, tooltip };
        }
        if (attempt >= maxAttempts) {
          console.error(`[AWSArchitecture] Failed to find canvas or tooltip after ${maxAttempts} attempts`);
          showFallback();
          return null;
        }
        return new Promise(resolve => setTimeout(() => resolve(getElements(attempt + 1, maxAttempts)), 500));
      };

      // Main initialization
      const start = async () => {
        try {
          console.log('[AWSArchitecture] Starting initialization');
          const elements = await getElements();
          if (!elements) {
            console.error('[AWSArchitecture] Aborting: Canvas or tooltip not found');
            showFallback();
            return;
          }
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

          // AWS Services Configuration
          const services = [
            { id: 'apiGateway', name: 'API Gateway', x: 100, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-api-gateway.svg', type: 'gateway' },
            { id: 'lambda1', name: 'Lambda (CRM)', x: 300, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-lambda.svg', type: 'compute' },
            { id: 'dynamodb', name: 'DynamoDB', x: 500, y: 100, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-dynamodb.svg', type: 'database' },
            { id: 's3', name: 'S3', x: 500, y: 300, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-s3.svg', type: 'storage' },
            { id: 'cloudfront', name: 'CloudFront', x: 100, y: 300, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cloudfront.svg', type: 'cdn' },
            { id: 'sns', name: 'SNS', x: 300, y: 400, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-sns.svg', type: 'messaging' },
            { id: 'sqs', name: 'SQS', x: 500, y: 400, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-sqs.svg', type: 'messaging' },
            { id: 'cloudwatch', name: 'CloudWatch', x: 300, y: 200, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cloudwatch.svg', type: 'monitoring' },
            { id: 'stepFunctions', name: 'Step Functions', x: 700, y: 200, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-step-functions.svg', type: 'workflow' },
            { id: 'cognito', name: 'Cognito', x: 100, y: 200, icon: 'https://d12uvtgcxr5qif.cloudfront.net/images/aws-cognito.svg', type: 'auth' }
          ];

          // Connections between services
          const connections = [
            { from: 'apiGateway', to: 'lambda1', project: 'lic', label: 'HTTP Request' },
            { from: 'lambda1', to: 'dynamodb', project: 'lic', label: 'Read/Write' },
            { from: 'lambda1', to: 's3', project: 'lic', label: 'Store Assets' },
            { from: 'cloudfront', to: 's3', project: 'zedemy', label: 'Content Delivery' },
            { from: 'apiGateway', to: 'sns', project: 'notifications', label: 'Publish' },
            { from: 'sns', to: 'sqs', project: 'notifications', label: 'Queue' },
            { from: 'sqs', to: 'lambda1', project: 'notifications', label: 'Process' },
            { from: 'lambda1', to: 'cloudwatch', project: 'all', label: 'Metrics' },
            { from: 'stepFunctions', to: 'lambda1', project: 'analytics', label: 'Orchestrate' },
            { from: 'cognito', to: 'apiGateway', project: 'all', label: 'Auth' }
          ];

          // Load service icons
          const loadIcons = async () => {
            console.log('[AWSArchitecture] Loading service icons...');
            for (const service of services) {
              try {
                const img = new Image();
                img.src = service.icon;
                service.img = img;
                await new Promise((resolve, reject) => {
                  img.onload = () => {
                    console.log(`[AWSArchitecture] Loaded icon for ${service.name}`);
                    resolve();
                  };
                  img.onerror = () => {
                    console.warn(`[AWSArchitecture] Failed to load icon for ${service.name}: ${service.icon}`);
                    service.img = null;
                    resolve();
                  };
                });
              } catch (error) {
                console.error(`[AWSArchitecture] Error loading icon for ${service.name}:`, error);
                service.img = null;
              }
            }
            console.log('[AWSArchitecture] Icon loading complete');
          };

          // Resize canvas
          const resizeCanvas = () => {
            console.log('[AWSArchitecture] Resizing canvas...');
            canvas.width = canvas.offsetWidth || 800;
            canvas.height = canvas.offsetHeight || 400;
            services.forEach(service => {
              service.x = (service.x / 1280) * canvas.width;
              service.y = (service.y / 600) * canvas.height;
            });
            console.log(`[AWSArchitecture] Canvas resized to ${canvas.width}x${canvas.height}`);
            draw();
          };

          // Draw services and connections
          const draw = () => {
            console.log('[AWSArchitecture] Drawing architecture...');
            try {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = 'rgba(26, 26, 46, 1)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
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
                  const midY = (from.y + to.y) / 2;
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                  ctx.font = '12px sans-serif';
                  ctx.fillText(conn.label, midX, midY - 10);
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

          // Animation loop
          const animate = () => {
            try {
              draw();
              if (dataFlow && typeof dataFlow.isAnimating === 'function' && dataFlow.isAnimating()) {
                dataFlow.drawParticles();
                console.log('[AWSArchitecture] Particles drawn');
              } else {
                console.log('[AWSArchitecture] No dataFlow or not animating');
              }
              animationFrameId = requestAnimationFrame(animate);
              console.log('[AWSArchitecture] Animation frame requested');
            } catch (error) {
              console.error('[AWSArchitecture] Animation error:', error);
              showFallback();
            }
          };

          // Reinitialize dataFlow if null
          const reinitializeDataFlow = async (attempt = 1, maxAttempts = 5) => {
            if (!dataFlow && window.AWSDataFlow && attempt <= maxAttempts) {
              console.log(`[AWSArchitecture] Reinitializing dataFlow, attempt ${attempt}/${maxAttempts}`);
              dataFlow = window.AWSDataFlow.init(canvas, services, connections);
              if (dataFlow) {
                console.log('[AWSArchitecture] DataFlow reinitialized successfully');
              } else {
                await new Promise(resolve => setTimeout(() => resolve(reinitializeDataFlow(attempt + 1, maxAttempts)), 500));
              }
            }
          };

          // Initialize
          console.log('[AWSArchitecture] Starting async initialization');
          await loadIcons();
          resizeCanvas();
          window.addEventListener('resize', () => {
            console.log('[AWSArchitecture] Window resized, triggering canvas resize');
            resizeCanvas();
          });
          if (window.AWSDataFlow) {
            dataFlow = window.AWSDataFlow.init(canvas, services, connections);
            console.log('[AWSArchitecture] AWSDataFlow initialized:', !!dataFlow);
            await reinitializeDataFlow();
          } else {
            console.error('[AWSArchitecture] AWSDataFlow not available');
          }
          if (window.AWSTooltip) {
            window.AWSTooltip.init(canvas, services, tooltip);
            console.log('[AWSArchitecture] AWSTooltip initialized');
          } else {
            console.error('[AWSArchitecture] AWSTooltip not available');
          }
          animate();
          console.log('[AWSArchitecture] Animation loop started');
        } catch (error) {
          console.error('[AWSArchitecture] Initialization error:', error);
          showFallback();
        }
      };

      // Start initialization
      console.log('[AWSArchitecture] Checking document ready state');
      if (document.readyState === 'loading') {
        console.log('[AWSArchitecture] Waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
          console.log('[AWSArchitecture] DOMContentLoaded fired');
          start();
        });
      } else {
        console.log('[AWSArchitecture] DOM already loaded, starting immediately');
        start();
      }

      return {
        stop: () => {
          console.log('[AWSArchitecture] Stopping');
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          window.removeEventListener('resize', resizeCanvas);
        },
        draw
      };
    }
  };

  window.AWSArchitecture = AWSArchitecture;
  console.log('[AWSArchitecture] Initializing immediately');
  AWSArchitecture.init(); // Call init immediately
} catch (error) {
  console.error('[AWSArchitecture] Script-level error:', error);
  const fallback = document.getElementById('aws-fallback');
  if (fallback) fallback.style.display = 'block';
}
