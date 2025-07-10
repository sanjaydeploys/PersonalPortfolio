try {
  console.log('[AWSTooltip] Script loaded and parsed');

  const AWSTooltip = {
    init(canvas, services, tooltipElement) {
      console.log('[AWSTooltip] Initializing');
      if (!canvas || !tooltipElement) {
        console.error('[AWSTooltip] Canvas or tooltip element not found');
        return;
      }

      const serviceDetails = {
        apiGateway: { title: 'API Gateway', description: 'Manages API requests.', useCases: ['Routing', 'Throttling', 'Monitoring'] },
        lambda1: { title: 'Lambda', description: 'Serverless compute.', useCases: ['Event Processing', 'Automation', 'Scaling'] },
        dynamodb: { title: 'DynamoDB', description: 'NoSQL database.', useCases: ['High Performance', 'Scalability', 'Key-Value'] },
        s3: { title: 'S3', description: 'Object storage.', useCases: ['Static Hosting', 'Backup', 'Data Lake'] },
        cloudfront: { title: 'CloudFront', description: 'Content delivery.', useCases: ['CDN', 'Caching', 'Edge Computing'] },
        sns: { title: 'SNS', description: 'Messaging service.', useCases: ['Notifications', 'Email', 'SMS'] },
        cloudwatch: { title: 'CloudWatch', description: 'Monitoring tool.', useCases: ['Logs', 'Metrics', 'Alarms'] },
        cognito: { title: 'Cognito', description: 'User authentication.', useCases: ['Sign-in', 'Sign-up', 'Sync'] }
      };

      const showTooltip = (service, x, y) => {
        const details = serviceDetails[service.id];
        if (!details) return;
        tooltipElement.innerHTML = `
          <div style="background: rgba(0,0,0,0.9); color: white; padding: 8px; border-radius: 5px 5px 0 0;">${details.title}</div>
          <div style="background: rgba(255,255,255,0.95); padding: 12px; border-radius: 0 0 5px 5px;">
            <p style="margin: 0 0 10px;">${details.description}</p>
            <ul style="margin: 0; padding-left: 20px;">${details.useCases.map(uc => `<li>${uc}</li>`).join('')}</ul>
          </div>
        `;
        const rect = canvas.getBoundingClientRect();
        let tooltipX = x + 25 - rect.left;
        let tooltipY = y - 10 - rect.top;
        if (tooltipX + 300 > canvas.width) tooltipX -= 325;
        if (tooltipY < 0) tooltipY += 20;
        tooltipElement.style.left = `${tooltipX}px`;
        tooltipElement.style.top = `${tooltipY}px`;
        tooltipElement.style.display = 'block';
      };

      const hideTooltip = () => { tooltipElement.style.display = 'none'; };

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        let foundService = null;
        services.forEach(service => {
          const dx = x - service.x;
          const dy = y - service.y;
          if (Math.sqrt(dx * dx + dy * dy) < 30) foundService = service;
        });
        foundService ? showTooltip(foundService, x, y) : hideTooltip();
      });

      canvas.addEventListener('mouseout', hideTooltip);
    }
  };

  window.AWSTooltip = AWSTooltip;
} catch (error) {
  console.error('[AWSTooltip] Script-level error:', error);
}
