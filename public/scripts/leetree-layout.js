window.Leetree = window.Leetree || {};
window.LeetreeLayout = (function () {
  const nodes = window.Leetree.nodes || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const PADDING = window.Leetree.PADDING || (window.innerWidth < 768 ? 10 : 15);
  const NODE_W = window.Leetree.NODE_W || (window.innerWidth < 768 ? 80 : 150);
  const NODE_H = window.Leetree.NODE_H || (window.innerWidth < 768 ? 32 : 56);
  const isMobile = window.Leetree.isMobile || window.innerWidth < 768;
  let worker = window.Leetree.worker;
  let workerEnabled = window.Leetree.workerEnabled;

  function computeGuidedPositions() {
    if (!nodeMap['root'] || !window.Leetree.clusters || nodes.length === 0) {
      console.error('computeGuidedPositions: nodeMap, clusters, or nodes not initialized');
      return;
    }

    const rootX = PADDING, rootY = PADDING;
    nodeMap['root'].x = rootX;
    nodeMap['root'].y = rootY;

    const clusters = window.Leetree.clusters;
    const hubIds = clusters.map((c) => 'hub-' + c.id);
    const hubSpacing = isMobile ? 80 : 120;
    let currentY = rootY + hubSpacing;
    hubIds.forEach((hid) => {
      if (!nodeMap[hid]) {
        console.warn(`Hub node ${hid} not found in nodeMap`);
        return;
      }
      nodeMap[hid].x = rootX + (isMobile ? 160 : 300);
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
      if (!hub) {
        console.warn(`Hub hub-${clusterId} not found for subhub group`);
        return;
      }
      const list = subhubGroups[clusterId];
      const cols = Math.max(1, Math.ceil(Math.sqrt(list.length)));
      const rows = Math.ceil(list.length / cols);
      const spacingX = isMobile ? 130 : 190;
      const spacingY = isMobile ? 55 : 85;
      let startY = hub.y - (rows - 1) * spacingY / 2;
      list.forEach((id, idx) => {
        if (!nodeMap[id]) {
          console.warn(`Subhub node ${id} not found in nodeMap`);
          return;
        }
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        nodeMap[id].x = hub.x + 130 + c * spacingX;
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
      if (!parent) {
        console.warn(`Parent node ${key} not found for leaf group`);
        return;
      }
      const list = group[key];
      const cols = Math.max(1, Math.ceil(Math.sqrt(list.length)));
      const rows = Math.ceil(list.length / cols);
      const leafSpacingX = isMobile ? 150 : 210;
      const leafSpacingY = isMobile ? 45 : 75;
      let startY = parent.y - (rows - 1) * leafSpacingY / 2;
      list.forEach((id, idx) => {
        if (!nodeMap[id]) {
          console.warn(`Leaf node ${id} not found in nodeMap`);
          return;
        }
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        nodeMap[id].x = parent.x + 150 + c * leafSpacingX;
        nodeMap[id].y = startY + r * leafSpacingY;
      });
    });
  }

  function resolveCollisionsAndLayout(doneCb) {
    const payload = {
      nodes: nodes.map((n) => ({ id: n.id, x: n.x, y: n.y })),
      nodeW: NODE_W + 8,
      nodeH: NODE_H + 8
    };
    if (workerEnabled && worker) {
      worker.postMessage({ type: 'layout', ...payload });
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
      const arr = payload.nodes;
      deterministicResolve(arr, payload.nodeW, payload.nodeH);
      arr.forEach((p) => {
        if (nodeMap[p.id]) {
          nodeMap[p.id].x = p.x;
          nodeMap[p.id].y = p.y;
        }
      });
      if (doneCb) doneCb();
    }
  }

  function deterministicResolve(arr, nodeW, nodeH) {
    const iters = 400;
    for (let it = 0; it < iters; it++) {
      let moved = false;
      arr.sort((a, b) => a.x - b.x || a.y - b.y);
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        for (let j = i + 1; j < arr.length; j++) {
          const b = arr[j];
          const overlapX = Math.min(a.x + nodeW, b.x + nodeW) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + nodeH, b.y + nodeH) - Math.max(a.y, b.y);
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
  }

  return {
    computeGuidedPositions,
    resolveCollisionsAndLayout,
    deterministicResolve
  };
})();
