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
    const hubSpacing = isMobile ? 60 : 100;
    let currentY = rootY + hubSpacing;
    hubIds.forEach((hid) => {
      if (!nodeMap[hid]) {
        console.warn(`Hub node ${hid} not found in nodeMap`);
        return;
      }
      nodeMap[hid].x = rootX + (isMobile ? 140 : 280);
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
      const spacingX = isMobile ? 110 : 170;
      const spacingY = isMobile ? 45 : 75;
      let startY = hub.y - (rows - 1) * spacingY / 2;
      list.forEach((id, idx) => {
        if (!nodeMap[id]) {
          console.warn(`Subhub node ${id} not found in nodeMap`);
          return;
        }
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        nodeMap[id].x = hub.x + 110 + c * spacingX;
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
      const leafSpacingX = isMobile ? 130 : 190;
      const leafSpacingY = isMobile ? 35 : 65;
      let startY = parent.y - (rows - 1) * leafSpacingY / 2;
      list.forEach((id, idx) => {
        if (!nodeMap[id]) {
          console.warn(`Leaf node ${id} not found in nodeMap`);
          return;
        }
        const c = idx % cols;
        const r = Math.floor(idx / cols);
        nodeMap[id].x = parent.x + 130 + c * leafSpacingX;
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
    const NODE_W_LOCAL = NODE_W + 8;
    const NODE_H_LOCAL = NODE_H + 8;
    const iters = 400;
    for (let it = 0; it < iters; it++) {
      let moved = false;
      arr.sort((a, b) => a.x - b.x || a.y - b.y);
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        for (let j = i + 1; j < arr.length; j++) {
          const b = arr[j];
          if (a.x + NODE_W_LOCAL <= b.x || b.x + NODE_W_LOCAL <= a.x || a.y + NODE_H_LOCAL <= b.y || b.y + NODE_H_LOCAL <= a.y) continue;
          const overlapX = Math.min(Math.abs(a.x + NODE_W_LOCAL - b.x), Math.abs(b.x + NODE_W_LOCAL - a.x));
          const overlapY = Math.min(Math.abs(a.y + NODE_H_LOCAL - b.y), Math.abs(b.y + NODE_H_LOCAL - a.y));
          const push = Math.min(overlapX, overlapY) / 2 + 4;
          if (overlapX < overlapY) {
            if (a.x < b.x) {
              a.x -= push / 2;
              b.x += push / 2;
            } else {
              a.x += push / 2;
              b.x -= push / 2;
            }
          } else {
            if (a.y < b.y) {
              a.y -= push / 2;
              b.y += push / 2;
            } else {
              a.y += push / 2;
              b.y -= push / 2;
            }
          }
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
