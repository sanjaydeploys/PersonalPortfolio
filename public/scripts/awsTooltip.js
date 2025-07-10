try {
  console.log('[AWSTooltip] Script loaded and parsed');

  const AWSTooltip = {
    init(canvas, services, tooltipElement) {
      console.log('[AWSTooltip] Initializing');
      if (!canvas || !tooltipElement) {
        console.error('[AWSTooltip] Canvas or tooltip element not found:', { canvas, tooltipElement });
        return;
      }

      const serviceDetails = {
        reactFrontend: { title: 'React Frontend', description: 'Dynamic UI layer.', useCases: ['Interactive Design', 'SEO Optimization', 'Form Submission'] },
        cloudFront: { title: 'CDN (CloudFront)', description: 'Global content delivery.', useCases: ['Fast Loading', 'Caching', 'Scalability'] },
        cloudflareDNS: { title: 'DNS (Cloudflare)', description: 'Domain management.', useCases: ['Routing', 'Security', 'Performance'] },
        lambda: { title: 'Lambda', description: 'Serverless compute.', useCases: ['Event Processing', 'API Logic', 'Scalability'] },
        apiGateway: { title: 'API Gateway', description: 'API management.', useCases: ['Routing', 'Rate Limiting', 'Monitoring'] },
        mongoDB: { title: 'MongoDB Atlas', description: 'NoSQL database.', useCases: ['Flexible Storage', 'High Availability', 'Scalability'] },
        sslCert: { title: 'SSL Certificate', description: 'Security layer.', useCases: ['Encryption', 'Trust', 'Compliance'] },
        emailService: { title: 'Email Service (SES)', description: 'Notification system.', useCases: ['Alerts', 'Confirmations', 'Marketing'] },
        cloudWatch: { title: 'CloudWatch', description: 'Monitoring solution.', useCases: ['Logging', 'Metrics', 'Alarms'] },
        dynamodb: { title: 'DynamoDB', description: 'NoSQL database.', useCases: ['High Performance', 'Scalable Storage', 'Key-Value Access'] },
        codeEditor: { title: 'Code Editor', description: 'In-browser coding.', useCases: ['Learning', 'Development', 'Testing'] },
        certificateService: { title: 'Certificate Service', description: 'Certification generation.', useCases: ['Verification', 'Download', 'Tracking'] },
        vercelRewrites: { title: 'Vercel Rewrites', description: 'Routing layer.', useCases: ['API Proxy', 'SEO', 'Custom Paths'] },
        lambdaAuth: { title: 'Lambda (Auth)', description: 'Authentication logic.', useCases: ['Login', 'JWT Management', 'Security'] },
        lambdaEvent: { title: 'Lambda (Event)', description: 'Event management.', useCases: ['CRUD Operations', 'Scheduling', 'Workflows'] },
        lambdaCalendar: { title: 'Lambda (Calendar)', description: 'Calendar sync.', useCases: ['Integration', 'Synchronization', 'Automation'] },
        googleCalendar: { title: 'Google Calendar API', description: 'External calendar.', useCases: ['Scheduling', 'Sync', 'Collaboration'] },
        githubCICD: { title: 'GitHub → Vercel CI/CD', description: 'Deployment pipeline.', useCases: ['Automation', 'Testing', 'Deployment'] },
        socketServer: { title: 'Socket.IO Server', description: 'Real-time signaling.', useCases: ['Chat', 'Video Calls', 'Data Push'] },
        webrtc: { title: 'WebRTC (P2P)', description: 'Peer-to-peer communication.', useCases: ['Video', 'Audio', 'File Sharing'] }
      };

      const showTooltip = (service, x, y) => {
        console.log(`[AWSTooltip] Showing tooltip for ${service.name} at (${x}, ${y})`);
        const details = serviceDetails[service.id];
        if (!details) {
          console.warn(`[AWSTooltip] No details found for service: ${service.id}`);
          return;
        }
        tooltipElement.innerHTML = `
          <div class="tooltip-title" style="background: rgba(0, 0, 0, 0.8); color: white; padding: 5px; border-radius: 5px 5px 0 0;">${details.title}</div>
          <div class="tooltip-content" style="background: rgba(255, 255, 255, 0.95); padding: 10px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            <p style="margin: 0 0 10px;">${details.description}</p>
            <ul style="margin: 0; padding-left: 20px;">${details.useCases.map(useCase => `<li style="margin-bottom: 5px;">${useCase}</li>`).join('')}</ul>
          </div>
        `;
        const canvasRect = canvas.getBoundingClientRect();
        let tooltipX = x + 20;
        let tooltipY = y - 20;
        if (tooltipX + 300 > canvasRect.width) tooltipX = x - 320;
        if (tooltipY < 0) tooltipY = y + 20;
        tooltipElement.style.left = `${tooltipX}px`;
        tooltipElement.style.top = `${tooltipY}px`;
        tooltipElement.style.display = 'block';
        tooltipElement.classList.add('show');
      };

      const hideTooltip = () => {
        console.log('[AWSTooltip] Hiding tooltip');
        tooltipElement.style.display = 'none';
        tooltipElement.classList.remove('show');
      };

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
      console.log('[AWSTooltip] Event listeners added');
    }
  };

  window.AWSTooltip = AWSTooltip;
} catch (error) {
  console.error('[AWSTooltip] Script-level error:', error);
}
