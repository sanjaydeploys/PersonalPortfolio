const AWSArchitecture = {
  init(canvasId, tooltipId, controls) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById(tooltipId);
    let animationFrameId = null;

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

    // Connections between services (for data flow)
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
      for (const service of services) {
        const img = new Image();
        img.src = service.icon;
        service.img = img;
        await new Promise(resolve => img.onload = resolve);
      }
    };

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    };

    // Draw services and connections
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw connections
      connections.forEach(conn => {
        const from = services.find(s => s.id === conn.from);
        const to = services.find(s => s.id === conn.to);
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.strokeStyle = 'rgba(255, 153, 0, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Draw label
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '12px sans-serif';
          ctx.fillText(conn.label, midX, midY - 5);
        }
      });
      // Draw services
      services.forEach(service => {
        ctx.save();
        ctx.translate(service.x, service.y);
        ctx.drawImage(service.img, -25, -25, 50, 50);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(service.name, 0, 40);
        ctx.restore();
      });
    };

    // Initialize
    const init = async () => {
      await loadIcons();
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      controls.init(services, connections, draw);
      AWSDataFlow.init(canvas, services, connections);
      AWSTooltip.init(canvas, services, tooltip);
    };

    init();

    return {
      stop: () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
      }
    };
  }
};

window.AWSArchitecture = AWSArchitecture;
