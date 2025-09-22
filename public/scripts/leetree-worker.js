// leetree-worker.js - Worker for layout computations

self.addEventListener('message', (ev) => {
  const data = ev.data;
  if (!data) return;
  if (data.type === 'init') {
    self.postMessage({ type: 'inited' });
    return;
  }
  if (data.type === 'layout') {
    const arr = data.nodes.map((n) => ({ id: n.id, x: n.x, y: n.y }));
    const NODE_W_LOCAL = 180 + 20;
    const NODE_H_LOCAL = 68 + 20;
    const iters = 400;
    for (let it = 0; it < iters; it++) {
      let moved = false;
      arr.sort((a, b) => a.x - b.x || a.y - b.y);
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
          const verticalBias = 1.5;
          a.x += (dx / dist) * push * (Math.abs(dx) > Math.abs(dy) ? 1 : verticalBias);
          a.y += (dy / dist) * push * (Math.abs(dy) > Math.abs(dx) ? 1 : verticalBias);
          b.x -= (dx / dist) * push * (Math.abs(dx) > Math.abs(dy) ? 1 : verticalBias);
          b.y -= (dy / dist) * push * (Math.abs(dy) > Math.abs(dx) ? 1 : verticalBias);
          moved = true;
        }
      }
      if (!moved) break;
    }
    arr.sort((a, b) => a.x - b.x || a.y - b.y);
    self.postMessage({ type: 'layout', nodes: arr });
  }
});
