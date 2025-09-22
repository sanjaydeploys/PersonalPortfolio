/* leetree-worker.js - Updated to enhanced deterministic resolve, no full force for organization */

self.addEventListener('message', (ev) => {
  const data = ev.data;
  if(!data) return;
  if(data.type === 'init') {
    self.postMessage({ type:'inited' });
    return;
  }
  if(data.type === 'layout') {
    const arr = data.nodes.map(n => ({ id:n.id, x:n.x, y:n.y }));
    const NODE_W_LOCAL = 200 + 20;
    const NODE_H_LOCAL = 72 + 20;
    const iters = 500;
    const directions = [[1,0], [0,1], [-1,0], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]];
    for (let it = 0; it < iters; it++) {
      let moved = false;
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        for (let j = i + 1; j < arr.length; j++) {
          const b = arr[j];
          if (a.x + NODE_W_LOCAL <= b.x || b.x + NODE_W_LOCAL <= a.x || a.y + NODE_H_LOCAL <= b.y || b.y + NODE_H_LOCAL <= a.y) continue;
          const overlapX = Math.min(a.x + NODE_W_LOCAL, b.x + NODE_W_LOCAL) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + NODE_H_LOCAL, b.y + NODE_H_LOCAL) - Math.max(a.y, b.y);
          if (overlapX <= 0 || overlapY <= 0) continue;
          const push = Math.min(overlapX, overlapY) / 2 + 8;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const dirIdx = Math.floor(Math.random() * directions.length);
          const [dirX, dirY] = directions[dirIdx];
          a.x += (dx / dist + dirX * 0.2) * push;
          a.y += (dy / dist + dirY * 0.2) * push;
          b.x -= (dx / dist + dirX * 0.2) * push;
          b.y -= (dy / dist + dirY * 0.2) * push;
          moved = true;
        }
      }
      if (!moved) break;
    }
    self.postMessage({ type:'layout', nodes: arr });
  }
});
