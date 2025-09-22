// leetree-layout.js - Layout computations, positioning, and worker handling

window.Leetree = window.Leetree || {};
window.LeetreeLayout = (function () {
  const nodes = window.Leetree.nodes || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const PADDING = window.Leetree.PADDING;
  const NODE_W = window.Leetree.NODE_W;
  const NODE_H = window.Leetree.NODE_H;
  const isMobile = window.Leetree.isMobile;
  let worker = window.Leetree.worker;
  let workerEnabled = window.Leetree.workerEnabled;

  function computeGuidedPositions() {
    const rootX = PADDING, rootY = PADDING + 30;
    nodeMap['root'].x = rootX;
    nodeMap['root'].y = rootY;

    const clusters = window.Leetree.clusters;
    const hubIds = clusters.map((c) => 'hub-' + c.id);
    const hubSpacing = isMobile ? 80 : 120;
    let currentY = rootY + hubSpacing;
    hubIds.forEach((hid) => {
      nodeMap[hid].x = rootX + (isMobile ? 200 : 350);
      nodeMap[hid].y = currentY;
      currentY += hubSpacing;
    });

    const subhubGroups = {};
    nodes.forEach((n) => {
      if (n.type === 'subhub') {
        if (!subhubGroups[n.cluster]) subhubGroups[n.cluster] = [];
        subhubGroups[n.cluster].push(n.id);
      }
    });
    Object.keys(subhubGroups).forEach((clusterId) => {
      const hub = nodeMap['hub-' + clusterId];
      const list = subhubGroups[clusterId];
      const cols = Math.max(1, Math.ceil(Math.sqrt(list.length)));
      const rows = Math.ceil(list.length / cols);
      const spacingX = isMobile ? 140 : 220;
      const spacingY = isMobile ? 60 : 90;
      let startY = hub.y - (rows - 1) * spacingY / 2;
      list.forEach((id, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        nodeMap[id].x = hub.x + 140 + c * spacingX;
        nodeMap[id].y = startY + r * spacingY;
      });
    });

    const group = {};
    nodes.forEach((n) => {
      if (n.type === 'leaf') {
        const key = n.subcluster || 'hub-' + n.cluster;
        if (!group[key]) group[key] = [];
        group[key].push(n.id);
      }
    });
    Object.keys(group).forEach((key) => {
      const parent = nodeMap[key];
      const list = group[key];
      const cols = Math.max(1, Math.ceil(Math.sqrt(list.length)));
      const rows = Math.ceil(list.length / cols);
      const leafSpacingX = isMobile ? 160 : 240;
      const leafSpacingY = isMobile ? 50 : 80;
      let startY = parent.y - (rows - 1) * leafSpacingY / 2;
      list.forEach((id, idx) => {
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        nodeMap[id].x = parent.x + 160 + c * leafSpacingX;
        nodeMap[id].y = startY + r * leafSpacingY;
      });
    });
  }

  function resolveCollisionsAndLayout(doneCb) {
    const payload = nodes.map((n) => ({ id: n.id, x: n.x, y: n.y }));
    if (workerEnabled && worker) {
      worker.postMessage({ type: 'layout', nodes: payload });
      const onmsg = (ev) => {
        if (ev.data && ev.data.type === 'layout') {
          ev.data.nodes.forEach((p) => {
            if (nodeMap[p.id]) {
              nodeMap[p.id].x = p.x;
              nodeMap[p.id].y = p.y;
            }
          });
          worker.removeEventListener('message', onmsg);
          if (doneCb) doneCb();
        }
      };
      worker.addEventListener('message', onmsg);
    } else {
      deterministicResolve(payload);
      payload.forEach((p) => {
        if (nodeMap[p.id]) {
          nodeMap[p.id].x = p.x;
          nodeMap[p.id].y = p.y;
        }
      });
      if (doneCb) doneCb();
    }
  }

  function deterministicResolve(arr) {
    const NODE_W_LOCAL = NODE_W + 20;
    const NODE_H_LOCAL = NODE_H + 20;
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
  }

  return {
    computeGuidedPositions,
    resolveCollisionsAndLayout
  };
})();
