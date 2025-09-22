/* leetree-worker.js remains the same */

self.addEventListener('message', (ev) => {
  const data = ev.data;
  if(!data) return;
  if(data.type === 'init') {
    self.postMessage({ type:'inited' });
    return;
  }
  if(data.type === 'layout') {
    const arr = data.nodes.map(n => ({ id:n.id, x:n.x, y:n.y }));
    const NODE_W = 200, NODE_H = 72;
    const ITER = 180;
    for(let iter=0; iter<ITER; iter++) {
      let moved = false;
      for(let i=0;i<arr.length;i++) {
        const a = arr[i];
        for(let j=i+1;j<arr.length;j++) {
          const b = arr[j];
          if(a.x + NODE_W <= b.x || b.x + NODE_W <= a.x || a.y + NODE_H <= b.y || b.y + NODE_H <= a.y) continue;
          const overlapX = Math.min(a.x + NODE_W, b.x + NODE_W) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + NODE_H, b.y + NODE_H) - Math.max(a.y, b.y);
          if(overlapX <= 0 || overlapY <= 0) continue;
          if(overlapX < overlapY) {
            const push = overlapX/2 + 6;
            if(a.x < b.x) { a.x -= push; b.x += push; } else { a.x += push; b.x -= push; }
          } else {
            const push = overlapY/2 + 6;
            if(a.y < b.y) { a.y -= push; b.y += push; } else { a.y += push; b.y -= push; }
          }
          moved = true;
        }
      }
      if(!moved) break;
    }
    for(let i=0;i<arr.length;i++){
      for(let j=i+1;j<arr.length;j++){
        const a=arr[i], b=arr[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist2 = dx*dx+dy*dy;
        if(dist2===0){ a.x += (Math.random()-0.5)*4; a.y += (Math.random()-0.5)*4; }
      }
    }
    self.postMessage({ type:'layout', nodes: arr });
  }
});
