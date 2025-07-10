const AWSTooltip = {
  init(canvas, services, tooltipElement) {
    const serviceDetails = {
      apiGateway: {
        title: 'API Gateway',
        description: 'Manages HTTP requests and routes them to Lambda functions.',
        useCases: ['RESTful APIs', 'WebSocket APIs', 'Rate limiting']
      },
      lambda1: {
        title: 'Lambda (CRM)',
        description: 'Executes serverless compute tasks for CRM logic.',
        useCases: ['Data processing', 'Event-driven logic', 'Microservices']
      },
      dynamodb: {
        title: 'DynamoDB',
        description: 'NoSQL database for high-speed data storage and retrieval.',
        useCases: ['User data', 'Session management', 'Real-time analytics']
      },
      s3: {
        title: 'S3',
        description: 'Object storage for static assets and backups.',
        useCases: ['Static websites', 'Media storage', 'Data archiving']
      },
      cloudfront: {
        title: 'CloudFront',
        description: 'CDN for low-latency content delivery.',
        useCases: ['Website acceleration', 'Global content distribution', 'Edge caching']
      },
      sns: {
        title: 'SNS',
        description: 'Pub/sub messaging for notifications.',
        useCases: ['Email alerts', 'SMS notifications', 'Push notifications']
      },
      sqs: {
        title: 'SQS',
        description: 'Message queue for decoupling services.',
        useCases: ['Task queuing', 'Event buffering', 'Asynchronous processing']
      },
      cloudwatch: {
        title: 'CloudWatch',
        description: 'Monitoring and logging for AWS resources.',
        useCases: ['Performance tracking', 'Error logging', 'Alarms']
      },
      stepFunctions: {
        title: 'Step Functions',
        description: 'Orchestrates serverless workflows.',
        useCases: ['Workflow automation', 'State management', 'Task coordination']
      },
      cognito: {
        title: 'Cognito',
        description: 'User authentication and authorization.',
        useCases: ['User sign-up', 'Sign-in', 'Access control']
      }
    };

    const showTooltip = (service, x, y) => {
      const details = serviceDetails[service.id];
      if (!details) return;
      tooltipElement.innerHTML = `
        <div class="tooltip-title">${details.title}</div>
        <div class="tooltip-content">
          <p>${details.description}</p>
          <ul>
            ${details.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
          </ul>
        </div>
      `;
      tooltipElement.style.left = `${x + 20}px`;
      tooltipElement.style.top = `${y - 20}px`;
      tooltipElement.classList.add('show');
    };

    const hideTooltip = () => {
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
        if (Math.sqrt(dx * dx + dy * dy) < 25) {
          foundService = service;
        }
      });
      if (foundService) {
        showTooltip(foundService, x, y);
      } else {
        hideTooltip();
      }
    });

    canvas.addEventListener('mouseout', hideTooltip);
  }
};

window.AWSTooltip = AWSTooltip;
