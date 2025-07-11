const AWSTooltip = {
  serviceDetails: {
    cloudflareDNS: { title: 'Cloudflare DNS', description: 'Global DNS resolution service for fast and secure domain lookups', useCases: ['Domain Resolution', 'DDoS Protection'], metrics: ['Requests/s', 'Latency'], config: ['TTL', 'Security'] },
    cloudFront: { title: 'CloudFront', description: 'AWS Content Delivery Network for low-latency content delivery', useCases: ['Static Content Delivery', 'Edge Caching'], metrics: ['Cache Hit Rate', 'Bandwidth'], config: ['Edge Locations', 'SSL'] },
    s3: { title: 'S3', description: 'Scalable object storage for hosting static assets', useCases: ['Static Hosting', 'Data Backup'], metrics: ['Storage Used', 'Requests'], config: ['Versioning', 'Encryption'] },
    apiGateway: { title: 'API Gateway', description: 'Managed API endpoint service for routing and scaling', useCases: ['API Routing', 'Rate Limiting'], metrics: ['API Calls', 'Latency'], config: ['Throttling', 'Caching'] },
    lambda: { title: 'Lambda', description: 'Serverless compute platform for event-driven processing', useCases: ['Event Processing', 'Microservices'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    mongodb: { title: 'MongoDB Atlas', description: 'Managed NoSQL database for flexible data storage', useCases: ['Document Storage', 'Real-time Analytics'], metrics: ['Queries', 'Connections'], config: ['Replica Set', 'Sharding'] },
    cloudwatch: { title: 'CloudWatch', description: 'Monitoring and observability for system metrics and logs', useCases: ['Log Analysis', 'Metrics Collection'], metrics: ['Logs', 'Metrics'], config: ['Retention', 'Alarms'] },
    certManager: { title: 'AWS Cert Manager', description: 'SSL/TLS certificate management for secure connections', useCases: ['SSL Termination', 'Auto-renewal'], metrics: ['Certs Issued', 'Renewals'], config: ['Auto Renew', 'Domains'] },
    emailService: { title: 'Email Service', description: 'Reliable email delivery for notifications', useCases: ['Notifications', 'Marketing'], metrics: ['Emails Sent', 'Delivery Rate'], config: ['SMTP', 'DKIM'] },
    vercel: { title: 'Vercel', description: 'Frontend deployment platform with SSR support', useCases: ['SSR Hosting', 'Static Sites'], metrics: ['Page Loads', 'Latency'], config: ['SSR', 'Domains'] },
    dynamoDB: { title: 'DynamoDB', description: 'NoSQL database for high-throughput applications', useCases: ['Key-Value Storage', 'High Throughput'], metrics: ['Reads', 'Writes'], config: ['Auto Scaling', 'Global Tables'] },
    codeEditor: { title: 'Code Editor Module', description: 'In-browser code editor for interactive learning', useCases: ['Interactive Coding', 'Learning'], metrics: ['Active Users', 'Sessions'], config: ['Language', 'Themes'] },
    certService: { title: 'Certificate Service', description: 'Issues digital certificates for course completion', useCases: ['Course Completion', 'Verification'], metrics: ['Certs Issued', 'Renewals'], config: ['Auto Issue', 'Templates'] },
    lambdaEvent: { title: 'Lambda - Events', description: 'Functions for managing event data', useCases: ['CRUD Operations', 'Event Workflows'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    lambdaAuth: { title: 'Lambda - Auth', description: 'Functions for user authentication', useCases: ['JWT Validation', 'User Sessions'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    lambdaCalendar: { title: 'Lambda - Calendar', description: 'Functions for calendar synchronization', useCases: ['Event Sync', 'Scheduling'], metrics: ['Invocations', 'Duration'], config: ['Memory', 'Timeout'] },
    googleCalendar: { title: 'Google Calendar API', description: 'API for calendar event integration', useCases: ['Event Sync', 'Scheduling'], metrics: ['API Calls', 'Latency'], config: ['OAuth', 'Scopes'] },
    github: { title: 'GitHub CI/CD', description: 'Continuous integration and deployment pipeline', useCases: ['Automated Builds', 'Deployments'], metrics: ['Deployments', 'Builds'], config: ['Auto Deploy', 'Workflows'] },
    socketServer: { title: 'Socket.IO Server', description: 'Real-time communication server for WebRTC signaling', useCases: ['Signaling', 'Chat'], metrics: ['Connections', 'Messages'], config: ['Port', 'Protocol'] },
    webrtcP2P: { title: 'WebRTC P2P Layer', description: 'Peer-to-peer media streaming for video calls', useCases: ['Video Calls', 'Streaming'], metrics: ['Streams', 'Bandwidth'], config: ['ICE Servers', 'Codecs'] }
  },

  getServiceDetails(serviceId, project) {
    if (!window.AWSArchitecture || !window.AWSArchitecture.architectures[project]) {
      console.warn('[AWSTooltip] AWSArchitecture or project not found:', project);
      return null;
    }
    const service = window.AWSArchitecture.architectures[project].services.find(s => s.id === serviceId);
    if (!service || !this.serviceDetails[serviceId]) {
      console.warn('[AWSTooltip] Service or details not found:', serviceId);
      return null;
    }
    const details = this.serviceDetails[serviceId];
    return `
      <div class="tooltip-title">${details.title}</div>
      <div class="tooltip-content">
        <p><strong>Description:</strong> ${details.description}</p>
        <p><strong>Use Cases:</strong></p>
        <ul>
          ${details.useCases.map(uc => `<li>${uc}</li>`).join('')}
        </ul>
        <p><strong>Metrics:</strong></p>
        <ul>
          ${Object.entries(service.metrics || {}).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}
        </ul>
        <p><strong>Config:</strong></p>
        <ul>
          ${Object.entries(service.config || {}).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}
        </ul>
      </div>
    `;
  }
};

window.AWSTooltip = AWSTooltip;
