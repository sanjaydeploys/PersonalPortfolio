document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('aws-canvas');
  const ctx = canvas.getContext('2d');
  let mouse = { x: null, y: null };
  let nodes = [];
  let connections = [];

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Node class (AWS services)
  class Node {
    constructor(name, x, y, icon) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.icon = new Image();
      this.icon.src = icon;
      this.size = 40;
      this.baseX = x;
      this.baseY = y;
    }

    draw() {
      ctx.drawImage(this.icon, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
      ctx.fillStyle = 'rgba(255, 153, 0, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x, this.y + this.size / 2 + 15);
    }

    update() {
      // Repel or attract based on mouse proximity
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        const force = (100 - distance) / 100;
        this.x += (dx / distance) * force * 5;
        this.y += (dy / distance) * force * 5;
      } else {
        // Return to base position
        this.x += (this.baseX - this.x) * 0.05;
        this.y += (this.baseY - this.y) * 0.05;
      }
    }
  }

  // Connection class
  class Connection {
    constructor(from, to) {
      this.from = from;
      this.to = to;
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.from.x, this.from.y);
      ctx.lineTo(this.to.x, this.to.y);
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.3 + Math.random() * 0.2})`; // Flickering cyan
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Initialize nodes (AWS services)
  const nodeData = [
    { name: 'Lambda', x: canvas.width * 0.3, y: canvas.height * 0.3, icon: 'https://cdn.svgporn.com/logos/aws-lambda.svg' },
    { name: 'API Gateway', x: canvas.width * 0.5, y: canvas.height * 0.2, icon: 'https://cdn.svgporn.com/logos/aws-api-gateway.svg' },
    { name: 'S3', x: canvas.width * 0.7, y: canvas.height * 0.4, icon: 'https://cdn.svgporn.com/logos/aws-s3.svg' },
    { name: 'DynamoDB', x: canvas.width * 0.4, y: canvas.height * 0.5, icon: 'https://cdn.svgporn.com/logos/aws-dynamodb.svg' },
  ];

  nodes = nodeData.map((data) => new Node(data.name, data.x, data.y, data.icon));

  // Initialize connections
  connections = [
    new Connection(nodes[0], nodes[1]), // Lambda -> API Gateway
    new Connection(nodes[1], nodes[2]), // API Gateway -> S3
    new Connection(nodes[0], nodes[3]), // Lambda -> DynamoDB
    new Connection(nodes[2], nodes[3]), // S3 -> DynamoDB
  ];

  // Handle mouse movement
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Animate
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach((node) => {
      node.update();
      node.draw();
    });
    connections.forEach((conn) => conn.draw());
    requestAnimationFrame(animate);
  };
  animate();
});
