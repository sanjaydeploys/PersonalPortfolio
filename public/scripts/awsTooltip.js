try {
  console.log('[AWSTooltip] Script loaded and parsed');

  const AWSTooltip = {
    init(canvas, tooltipId = 'aws-tooltip') {
      console.log('[AWSTooltip] Initializing');
      const canvas = document.getElementById(canvasId);
      const tooltip = document.getElementById(tooltipId);
      if (!canvas || !tooltip) {
        console.error('[AWSTooltip] Canvas or tooltip not found');
        return;
      }

      const serviceDetails = {
        apiGateway: { title: 'API Gateway', description: 'Handles API requests.', useCases: ['Routing', 'Throttling'] },
        lambda: { title: 'Lambda', description: 'Serverless compute.', useCases: ['Event Handling', 'Scaling'] },
        lambdaAuth: { title: 'Lambda Auth', description: 'Auth logic.', useCases: ['User Auth', 'Token'] },
        lambdaEvent: { title: 'Lambda Event', description: 'Event management.', useCases: ['CRUD', 'Workflow'] },
        dynamodb: { title: 'DynamoDB', description: 'NoSQL storage.', useCases: ['High Speed', 'Scalability'] },
        s3: { title: 'S3', description: 'Object storage.', useCases: ['Hosting', 'Backup'] },
        cloudfront: { title: 'CloudFront', description: 'Content delivery.', useCases: ['CDN', 'Caching'] },
        sns: { title: 'SNS', description: 'Messaging service.', useCases: ['Notifications', 'Email'] },
        cloudwatch: { title: 'CloudWatch', description: 'Monitoring.', useCases: ['Logs', 'Metrics'] },
        cognito: { title: 'Cognito', description: 'User auth.', useCases: ['Sign-in', 'Sync'] }
      };

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        let foundService = null;
        const { services } = window.AWSArchitecture.init().architectures[window.AWSControls.getCurrentProject() || 'lic'];
        services.forEach(service => {
          const dx = x - service.x;
          const dy = y - service.y;
          if (Math.sqrt(dx * dx + dy * dy) < 25) foundService = service;
        });
        if (foundService && serviceDetails[foundService.id]) {
          tooltip.innerHTML = `
            <div style="background: rgba(0,0,0,0.9); color: white; padding: 8px; border-radius: 5px 5px 0 0;">${serviceDetails[foundService.id].title}</div>
            <div style="background: rgba(255,255,255,0.95); padding: 12px; border-radius: 0 0 5px 5px;">
              <p>${serviceDetails[foundService.id].description}</p>
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

      canvas.addEventListener('mouseout', () => tooltip.style.display = 'none');
    }
  };

  window.AWSTooltip = AWSTooltip;
  console.log('[AWSTooltip] Initializing immediately');
  AWSTooltip.init();
} catch (error) {
  console.error('[AWSTooltip] Script-level error:', error);
}
