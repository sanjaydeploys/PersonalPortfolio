// /leetree-worker.js
self.addEventListener('message', (ev) => {
  const data = ev.data;
  if (!data) return;
  if (data.type === 'init') {
    self.postMessage({ type: 'inited' });
    return;
  }
  if (data.type === 'layout') {
    const nodeData = data.nodes;
    const iters = 400;
    for (let it = 0; it < iters; it++) {
      let moved = false;
      nodeData.sort((a, b) => a.x - b.x || a.y - b.y);
      for (let i = 0; i < nodeData.length; i++) {
        const a = nodeData[i];
        for (let j = i + 1; j < nodeData.length; j++) {
          const b = nodeData[j];
          const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (overlapX <= 0 || overlapY <= 0) continue;
          const push = Math.min(overlapX, overlapY) / 2 + 8;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const verticalBias = 1.5;
          const fx = (dx / dist) * push * (Math.abs(dx) > Math.abs(dy) ? 1 : verticalBias);
          const fy = (dy / dist) * push * (Math.abs(dy) > Math.abs(dx) ? 1 : verticalBias);
          a.x += fx;
          a.y += fy;
          b.x -= fx;
          b.y -= fy;
          moved = true;
        }
      }
      if (!moved) break;
    }
    self.postMessage({ type: 'layout', nodes: nodeData });
  }
});
