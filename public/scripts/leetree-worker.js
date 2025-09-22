/* leetree-worker.js - Updated to full force-directed layout for web structure */

self.addEventListener('message', (ev) => {
  const data = ev.data;
  if(!data) return;
  if(data.type === 'init') {
    self.postMessage({ type:'inited' });
    return;
  }
  if(data.type === 'layout') {
    const arr = data.nodes.map(n => ({ id:n.id, x:n.x, y:n.y }));
    const edgs = data.edges.map(e => ({ source: e.source, target: e.target }));
    const REPULSION_STRENGTH = 12000;
    const ATTRACTION_STRENGTH = 0.04;
    const IDEAL_EDGE_LENGTH = 140;
    const DAMPING = 0.85;
    const ITER = 350; // Increased for better convergence
    const velocities = arr.map(() => ({ vx: 0, vy: 0 }));

    for (let iter = 0; iter < ITER; iter++) {
      // Repulsion
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const a = arr[i], b = arr[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          let force = REPULSION_STRENGTH / (dist * dist);
          let fx = (dx / dist) * force;
          let fy = (dy / dist) * force;
          velocities[i].vx += fx;
          velocities[i].vy += fy;
          velocities[j].vx -= fx;
          velocities[j].vy -= fy;
        }
      }

      // Attraction
      edgs.forEach((e) => {
        const ai = arr.findIndex((n) => n.id === e.source);
        const bi = arr.findIndex((n) => n.id === e.target);
        if (ai < 0 || bi < 0) return;
        const a = arr[ai], b = arr[bi];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        let force = (dist - IDEAL_EDGE_LENGTH) * ATTRACTION_STRENGTH;
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;
        velocities[ai].vx -= fx;
        velocities[ai].vy -= fy;
        velocities[bi].vx += fx;
        velocities[bi].vy += fy;
      });

      // Update positions with damping
      arr.forEach((n, i) => {
        n.x += velocities[i].vx * DAMPING;
        n.y += velocities[i].vy * DAMPING;
        velocities[i].vx *= DAMPING;
        velocities[i].vy *= DAMPING;
      });
    }

    // Final collision resolve
    const NODE_W = 200, NODE_H = 72;
    for(let iter=0; iter<50; iter++) { // Extra collision pass
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

    self.postMessage({ type:'layout', nodes: arr });
  }
});
