try {
  console.log('[AWSArchitecture] Script loaded and parsed');

  const AWSArchitecture = {
    init(canvasId = 'aws-canvas', tooltipId = 'aws-tooltip', controlsId = 'aws-controls') {
      console.log(`[AWSArchitecture] Attempting initialization with canvasId: ${canvasId}, tooltipId: ${tooltipId}, controlsId: ${controlsId}`);

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
        const controls = document.getElementById(controlsId);
        if (canvas && tooltip && controls) {
          return { canvas, tooltip, controls };
        }
        if (attempt >= maxAttempts) {
          console.error(`[AWSArchitecture] Failed to find elements after ${maxAttempts} attempts`);
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

          const { canvas, tooltip, controls } = elements;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error('[AWSArchitecture] Failed to get 2D context for canvas');
            showFallback();
            return;
          }
          console.log('[AWSArchitecture] Canvas context acquired');

          let animationFrameId = null;
          let isAnimating = false;
          let currentProject = 'lic';
          let particles = [];

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
                img.crossOrigin = 'anonymous'; // Attempt to handle CORS
                img.src = service.icon;
                service.img = await new Promise((resolve, reject) => {
                  img.onload = () => resolve(img);
                  img.onerror = () => {
                    console.error(`[AWSArchitecture] Failed to load icon for ${service.name}, using fallback`);
                    resolve(null);
                  };
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
              if (isAnimating) {
                particles.forEach(particle => {
                  particle.update();
                  particle.draw();
                });
              }
              console.log('[AWSArchitecture] Architecture drawn');
            } catch (error) {
              console.error('[AWSArchitecture] Draw error:', error);
              showFallback();
            }
          };

          class Particle {
            constructor(from, to, speed) {
              this.from = { x: from.x, y: from.y };
              this.to = { x: to.x, y: to.y };
              this.progress = Math.random();
              this.speed = speed;
              this.color = 'rgba(255, 153, 0, 0.8)';
            }
            update() {
              this.progress += this.speed;
              if (this.progress >= 1) this.progress = 0;
              this.x = this.from.x + (this.to.x - this.from.x) * this.progress;
              this.y = this.from.y + (this.to.y - this.from.y) * this.progress;
            }
            draw() {
              ctx.beginPath();
              ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
              ctx.fillStyle = this.color;
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(this.x - 10 * (1 - this.progress), this.y - 10 * (1 - this.progress));
              ctx.lineTo(this.x, this.y);
              ctx.strokeStyle = this.color;
              ctx.stroke();
            }
          }

          const createParticles = () => {
            particles = [];
            const particleCount = { lic: 5, zedemy: 4, eventease: 6, connectnow: 3 }[currentProject] || 5;
            const { connections } = architectures[currentProject];
            connections.forEach(conn => {
              const from = architectures[currentProject].services.find(s => s.id === conn.from);
              const to = architectures[currentProject].services.find(s => s.id === conn.to);
              if (from && to) {
                for (let i = 0; i < particleCount; i++) {
                  particles.push(new Particle(from, to, 0.005 + Math.random() * 0.01));
                }
              }
            });
          };

          const animate = () => {
            try {
              draw();
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
                createParticles();
                draw();
                console.log(`[AWSArchitecture] Switched to project: ${project}`);
              });
            } else {
              console.error(`[AWSArchitecture] Invalid project: ${project}`);
            }
          };

          const toggleSimulation = (start) => {
            if (start && !isAnimating) {
              isAnimating = true;
              createParticles();
              console.log('[AWSArchitecture] Simulation started');
            } else if (!start && isAnimating) {
              isAnimating = false;
              console.log('[AWSArchitecture] Simulation paused');
            }
          };

          await loadIcons(architectures[currentProject].services);
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);

          // Tooltip functionality
          const serviceDetails = {
            apiGateway: { title: 'API Gateway', description: 'Manages API requests.', useCases: ['Routing', 'Throttling', 'Monitoring'] },
            lambda1: { title: 'Lambda', description: 'Serverless compute.', useCases: ['Event Processing', 'Automation', 'Scaling'] },
            dynamodb: { title: 'DynamoDB', description: 'NoSQL database.', useCases: ['High Performance', 'Scalability', 'Key-Value'] },
            s3: { title: 'S3', description: 'Object storage.', useCases: ['Static Hosting', 'Backup', 'Data Lake'] },
            cloudfront: { title: 'CloudFront', description: 'Content delivery.', useCases: ['CDN', 'Caching', 'Edge Computing'] },
            sns: { title: 'SNS', description: 'Messaging service.', useCases: ['Notifications', 'Email', 'SMS'] },
            cloudwatch: { title: 'CloudWatch', description: 'Monitoring tool.', useCases: ['Logs', 'Metrics', 'Alarms'] },
            cognito: { title: 'Cognito', description: 'User authentication.', useCases: ['Sign-in', 'Sign-up', 'Sync'] },
            lambda2: { title: 'Lambda', description: 'Serverless compute.', useCases: ['Event Processing', 'Automation', 'Scaling'] }
          };
          canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            let foundService = null;
            architectures[currentProject].services.forEach(service => {
              const dx = x - service.x;
              const dy = y - service.y;
              if (Math.sqrt(dx * dx + dy * dy) < 30) foundService = service;
            });
            if (foundService && serviceDetails[foundService.id]) {
              tooltip.innerHTML = `
                <div style="background: rgba(0,0,0,0.9); color: white; padding: 8px; border-radius: 5px 5px 0 0;">${serviceDetails[foundService.id].title}</div>
                <div style="background: rgba(255,255,255,0.95); padding: 12px; border-radius: 0 0 5px 5px;">
                  <p style="margin: 0 0 10px;">${serviceDetails[foundService.id].description}</p>
                  <ul style="margin: 0; padding-left: 20px;">${serviceDetails[foundService.id].useCases.map(uc => `<li>${uc}</li>`).join('')}</ul>
                </div>
              `;
              let tooltipX = x + 25;
              let tooltipY = y - 10;
              if (tooltipX + 300 > canvas.width) tooltipX -= 325;
              if (tooltipY < 0) tooltipY += 20;
              tooltip.style.left = `${tooltipX}px`;
              tooltip.style.top = `${tooltipY}px`;
              tooltip.style.display = 'block';
            } else {
              tooltip.style.display = 'none';
            }
          });
          canvas.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });

          // Controls functionality
          const playBtn = controls.querySelector('#play-simulation-btn');
          const pauseBtn = controls.querySelector('#pause-simulation-btn');
          const projectSelect = controls.querySelector('#project-select');
          if (playBtn && pauseBtn && projectSelect) {
            playBtn.addEventListener('click', () => toggleSimulation(true));
            pauseBtn.addEventListener('click', () => toggleSimulation(false));
            projectSelect.addEventListener('change', (e) => setProject(e.target.value));
            pauseBtn.disabled = true;
            console.log('[AWSArchitecture] Controls initialized');
          } else {
            console.error('[AWSArchitecture] Control elements not found');
          }

          animate();
          console.log('[AWSArchitecture] Animation loop started');
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
