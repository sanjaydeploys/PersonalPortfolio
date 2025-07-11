const AWSArchitecture = {
  architectures: {
    lic: {
      services: [
        { id: 'apiGateway', name: 'API Gateway', x:100, y:100, type:'gateway' },
        { id: 'lambda', name: 'Lambda', x:300, y:100, type:'compute' },
        { id: 'dynamodb', name: 'DynamoDB', x:500, y:100, type:'database' },
        { id: 's3', name: 'S3', x:500, y:300, type:'storage' },
        { id: 'cloudfront', name: 'CloudFront', x:100, y:300, type:'cdn' },
        { id: 'sns', name: 'SNS', x:300, y:400, type:'messaging' },
        { id: 'cloudwatch', name: 'CloudWatch', x:300, y:200, type:'monitoring' }
      ],
      connections: [
        { from:'apiGateway', to:'lambda', label:'Request' },
        { from:'lambda', to:'dynamodb', label:'Data' },
        { from:'lambda', to:'s3', label:'Assets' },
        { from:'cloudfront', to:'s3', label:'Delivery' },
        { from:'lambda', to:'sns', label:'Notify' },
        { from:'lambda', to:'cloudwatch', label:'Monitor' }
      ]
    },
    zedemy: { /* same pattern */ },
    eventease: { /* same pattern */ },
    connectnow: { /* same pattern */ }
  },

  canvas:null,
  ctx:null,
  tooltip:null,
  icons:{},
  currentProject:'lic',
  scale:1, offsetX:0, offsetY:0,
  isDragging:false, lastX:0, lastY:0,
  animationId:null,

  init(canvasId, tooltipId){
    this.canvas = document.getElementById(canvasId)
    this.tooltip = document.getElementById(tooltipId)
    if(!this.canvas||!this.tooltip) return console.error('Missing elements')
    this.ctx = this.canvas.getContext('2d')
    this.loadIcons()
    this.resizeCanvas()
    this.attachEvents()
    this.animate()
    if(window.AWSFlow?.setProject) window.AWSFlow.setProject(this.currentProject)
  },

  loadIcons(){
    const mapping = {
      apiGateway:'ApiGateway.svg',
      lambda:'Lambda.svg',
      dynamodb:'DynamoDb.svg',
      s3:'S3.svg',
      cloudfront:'CloudFront.svg',
      sns:'SimpleNotificationService.svg',
      cloudwatch:'CloudWatch.svg',
      cognito:'Cognito.svg'
    }
    for(const [id,file] of Object.entries(mapping)){
      const img=new Image()
      img.onload = ()=> this.render()
      img.src=`https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/LIGHT/${file}`
      this.icons[id]=img
    }
  },

  attachEvents(){
    this.canvas.addEventListener('wheel',e=>{
      e.preventDefault()
      this.scale = Math.min(3, Math.max(0.5, this.scale * (e.deltaY<0 ? 1.1 : 0.9)))
      this.render()
    })
    this.canvas.addEventListener('mousedown',e=>{
      this.isDragging=true
      this.lastX=e.clientX; this.lastY=e.clientY
    })
    this.canvas.addEventListener('mousemove',e=>{
      if(this.isDragging){
        this.offsetX += e.clientX - this.lastX
        this.offsetY += e.clientY - this.lastY
        this.lastX=e.clientX; this.lastY=e.clientY
        this.render()
      }
      this.handleTooltip(e)
    })
    this.canvas.addEventListener('mouseup',()=>this.isDragging=false)
    this.canvas.addEventListener('mouseleave',()=>{
      this.isDragging=false
      this.tooltip.style.display='none'
    })
  },

  render(){
    const { width, height } = this.canvas
    this.ctx.clearRect(0,0,width,height)
    this.ctx.fillStyle='#1a1a2e'
    this.ctx.fillRect(0,0,width,height)

    const {services,connections} = this.architectures[this.currentProject]

    // draw connections
    connections.forEach(conn=>{
      const from = services.find(s=>s.id===conn.from)
      const to = services.find(s=>s.id===conn.to)
      if(!from||!to) return
      const fx=from.x*this.scale+this.offsetX
      const fy=from.y*this.scale+this.offsetY
      const tx=to.x*this.scale+this.offsetX
      const ty=to.y*this.scale+this.offsetY
      this.ctx.strokeStyle='rgba(255,153,0,0.7)'; this.ctx.lineWidth=2
      this.ctx.beginPath()
      this.ctx.moveTo(fx,fy)
      this.ctx.lineTo(tx,ty)
      this.ctx.stroke()
      const midX=(fx+tx)/2, midY=(fy+ty)/2 - 10
      this.ctx.fillStyle='#fff'; this.ctx.font='12px sans-serif'
      this.ctx.fillText(conn.label, midX, midY)
    })

    // draw services
    services.forEach(svc=>{
      this.renderService(svc)
    })
  },

  renderService(s, highlight=false){
    const x=s.x*this.scale+this.offsetX
    const y=s.y*this.scale+this.offsetY
    this.ctx.save()
    this.ctx.translate(x,y)
    const img = this.icons[s.id]
    if(img?.complete){
      this.ctx.drawImage(img, -25, -25, 50,50)
    } else {
      this.ctx.beginPath()
      this.ctx.arc(0,0,25,0,2*Math.PI)
      this.ctx.fillStyle='gray'
      this.ctx.fill()
    }
    this.ctx.restore()
  },

  handleTooltip(e){
    const rect=this.canvas.getBoundingClientRect()
    const mx=(e.clientX-rect.left - this.offsetX)/this.scale
    const my=(e.clientY-rect.top - this.offsetY)/this.scale
    const svc=this.architectures[this.currentProject]
                  .services.find(s=> Math.hypot(mx-s.x,my-s.y)<30)
    if(svc){
      const html = window.AWSTooltip.getServiceDetails(svc.id)
      if(html){
        this.tooltip.innerHTML=html
        this.tooltip.style.display='block'
        this.tooltip.style.left=`${e.clientX+10}px`
        this.tooltip.style.top=`${e.clientY-10}px`
      }
    } else {
      this.tooltip.style.display='none'
    }
  },

  resizeCanvas(){
    this.canvas.width=this.canvas.offsetWidth
    this.canvas.height=this.canvas.offsetHeight
    this.render()
  },

  animate(){
    this.render()
    window.AWSFlow?.drawParticles?.()
    this.animationId=requestAnimationFrame(()=>this.animate())
  },

  setProject(p){
    if(!this.architectures[p]) return
    this.currentProject=p
    this.scale=1; this.offsetX=0; this.offsetY=0
    this.render()
    window.AWSFlow?.setProject?.(p)
  }
}

window.AWSArchitecture = AWSArchitecture
if (document.readyState==='loading') {
  document.addEventListener('DOMContentLoaded', ()=>AWSArchitecture.init('aws-canvas','aws-tooltip'))
} else {
  AWSArchitecture.init('aws-canvas','aws-tooltip')
}
