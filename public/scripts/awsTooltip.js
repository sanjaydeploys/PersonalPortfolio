const AWSTooltip = {
  serviceDetails: {
    cloudflareDNS: { title: 'Cloudflare DNS', description: 'Global DNS resolution service', useCases: ['Domain Resolution', 'DDoS Protection'], metrics: ['Requests/s', 'Latency'], config: ['TTL', 'Security'] },
    cloudFront: { title: 'CloudFront', description: 'Content Delivery Network', useCases: ['Static Content Delivery', 'Edge Caching'], metrics: ['Cache Hit Rate', 'Bandwidth'], config: ['Edge Locations', 'SSL'] },
    s3: { title: 'S3', description: 'Scalable object storage', useCases: ['Static Hosting', 'Data Backup'], metrics: ['Storage Used', 'Requests'], config: ['Versioning', 'Encryption'] },
    apiGateway: { title: 'API Gateway', description: 'Managed API endpoint service', useCases: ['API Routing', 'Rate Limiting'], metrics: ['API Calls', 'Latency'], config: ['Throttling', 'Caching'] },
    lambda: { title: 'Lambda', description: 'Serverless compute platform', useCases: ['Event Processing', 'Microservices'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    mongodb: { title: 'MongoDB Atlas', description: 'Managed NoSQL database', useCases: ['Document Storage', 'Real-time Analytics'], metrics: ['Queries', 'Connections'], config: ['Replica Set', 'Sharding'] },
    cloudwatch: { title: 'CloudWatch', description: 'Monitoring and observability', useCases: ['Log Analysis', 'Metrics Collection'], metrics: ['Logs', 'Metrics'], config: ['Retention', 'Alarms'] },
    certManager: { title: 'AWS Cert Manager', description: 'SSL/TLS certificate management', useCases: ['SSL Termination', 'Auto-renewal'], metrics: ['Certs Issued', 'Renewals'], config: ['Auto Renew', 'Domains'] },
    emailService: { title: 'Email Service', description: 'Email delivery service', useCases: ['Notifications', 'Marketing'], metrics: ['Emails Sent', 'Delivery Rate'], config: ['SMTP', 'DKIM'] },
    vercel: { title: 'Vercel', description: 'Frontend deployment platform', useCases: ['SSR Hosting', 'Static Sites'], metrics: ['Page Loads', 'Latency'], config: ['SSR', 'Domains'] },
    dynamoDB: { title: 'DynamoDB', description: 'NoSQL database service', useCases: ['Key-Value Storage', 'High Throughput'], metrics: ['Reads', 'Writes'], config: ['Auto Scaling', 'Global Tables'] },
    codeEditor: { title: 'Code Editor Module', description: 'In-browser code editor', useCases: ['Interactive Coding', 'Learning'], metrics: ['Active Users', 'Sessions'], config: ['Language', 'Themes'] },
    certService: { title: 'Certificate Service', description: 'Digital certificate issuance', useCases: ['Course Completion', 'Verification'], metrics: ['Certs Issued', 'Renewals'], config: ['Auto Issue', 'Templates'] },
    lambdaEvent: { title: 'Lambda - Events', description: 'Event management functions', useCases: ['CRUD Operations', 'Event Workflows'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    lambdaAuth: { title: 'Lambda - Auth', description: 'Authentication functions', useCases: ['JWT Validation', 'User Sessions'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    lambdaCalendar: { title: 'Lambda - Calendar', description: 'Calendar sync functions', useCases: ['Event Sync', 'Scheduling'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    googleCalendar: { title: 'Google Calendar API', description: 'Calendar integration API', useCases: ['Event Sync', 'Scheduling'], metrics: ['API Calls', 'Latency'], config: ['OAuth', 'Scopes'] },
    github: { title: 'GitHub CI/CD', description: 'Continuous integration/deployment', useCases: ['Automated Builds', 'Deployments'], metrics: ['Deployments', 'Builds'], config: ['Auto Deploy', 'Workflows'] },
    socketServer: { title: 'Socket.IO Server', description: 'Real-time communication server', useCases: ['Signaling', 'Chat'], metrics: ['Connections', 'Messages'], config: ['Port', 'Protocol'] },
    webrtcP2P: { title: 'WebRTC P2P Layer', description: 'Peer-to-peer media streaming', useCases: ['Video Calls', 'Streaming'], metrics: ['Streams', 'Bandwidth'], config: ['ICE Servers', 'Codecs'] }
  },

  init(canvas, tooltip) {
    if (!canvas || !tooltip) {
      console.error('[AWSTooltip] Canvas or tooltip element not found.');
      return;
    }
    // Move event listeners to AWSArchitecture to avoid duplication
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
  },

  handleHover(e, canvas, tooltip) {
    if (!window.AWSArchitecture || !window.AWSArchitecture.architectures) {
      console.warn('[AWSTooltip] AWSArchitecture not available.');
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - window.AWSArchitecture.offsetX) / window.AWSArchitecture.scale;
    const y = (e.clientY - rect.top - window.AWSArchitecture.offsetY) / window.AWSArchitecture.scale;
    const { services } = window.AWSArchitecture.architectures[window.AWSArchitecture.currentProject];
    const foundService = services.find(service => Math.hypot(x - service.x, y - service.y) < 30);

    if (foundService && this.serviceDetails[foundService.id]) {
      const tooltipHTML = this.getServiceDetails(foundService.id, window.AWSArchitecture.currentProject);
      if (tooltipHTML) {
        tooltip.innerHTML = tooltipHTML;
        let tooltipX = e.clientX + 15;
        let tooltipY = e.clientY - 15;
        if (tooltipX + 300 > rect.right) tooltipX = e.clientX - 330;
        if (tooltipY < rect.top) tooltipY = e.clientY + 30;
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
        tooltip.style.display = 'block';
        if (window.AWSArchitecture && typeof window.AWSArchitecture.renderService === 'function') {
          window.AWSArchitecture.renderService(foundService, true);
        }
      } else {
        tooltip.style.display = 'none';
      }
    } else {
      tooltip.style.display = 'none';
    }
  },

  getServiceDetails(serviceId, project) {
    if (!window.AWSArchitecture || !window.AWSArchitecture.architectures[project]) {
      console.warn('[AWSTooltip] AWSArchitecture or project not found.');
      return null;
    }
    const service = window.AWSArchitecture.architectures[project].services.find(s => s.id === serviceId);
    if (!service || !this.serviceDetails[serviceId]) return null;
    const details = this.serviceDetails[serviceId];
    return `
      <div style="background: rgba(0,0,0,0.9); color: white; padding: 10px; border-radius: 5px 5px 0 0;">
        ${details.title}
      </div>
      <div style="background: rgba(255,255,255,0.95); padding: 12px; border-radius: 0 0 5px 5px; max-width: 300px;">
        <p><strong>Description:</strong> ${details.description}</p>
        <p><strong>Use Cases:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          ${details.useCases.map(uc => `<li>${uc}</li>`).join('')}
        </ul>
        <p><strong>Metrics:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          ${Object.entries(service.metrics || {}).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}
        </ul>
        <p><strong>Config:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          ${Object.entries(service.config || {}).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}
        </ul>
      </div>
    `;
  }
};

window.AWSTooltip = AWSTooltip;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('aws-canvas');
    const tooltip = document.getElementById('aws-tooltip');
    if (canvas && tooltip) {
      AWSTooltip.init(canvas, tooltip);
    } else {
      console.error('[AWSTooltip] aws-canvas or aws-tooltip element not found.');
    }
  });
} else {
  const canvas = document.getElementById('aws-canvas');
  const tooltip = document.getElementById('aws-tooltip');
  if (canvas && tooltip) {
    AWSTooltip.init(canvas, tooltip);
  } else {
    console.error('[AWSTooltip] aws-canvas or aws-tooltip element not found.');
  }
}
