// /leetree-layout.js (new dedicated script for layout logic)
window.Leetree = window.Leetree || {};
window.LeetreeLayout = (function () {
  const nodes = window.Leetree.nodes || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const clusters = window.Leetree.clusters || [];
  const PADDING = window.Leetree.PADDING;
  const isMobile = () => window.Leetree.isMobile;
  const worker = () => window.Leetree.worker;
  const workerEnabled = () => window.Leetree.workerEnabled;

  function computeGuidedPositions() {
    const root = nodes.find(n => n.id === 'root');
    if (root) {
      root.x = isMobile() ? 100 : 400;
      root.y = 50;
    }

    const hubNodes = nodes.filter(n => n.type === 'hub');
    const cols = isMobile() ? 2 : 4;
    const hubSpacingX = isMobile() ? 180 : 240;
    const hubSpacingY = 140;
    hubNodes.forEach((hub, i) => {
      hub.x = (i % cols) * hubSpacingX + 50;
      hub.y = Math.floor(i / cols) * hubSpacingY + 200;
    });

    const subhubs = nodes.filter(n => n.type === 'subhub');
    subhubs.forEach(sh => {
      const hub = nodeMap['hub-' + sh.cluster];
      if (hub) {
        sh.x = hub.x + Math.random() * 100 - 50;
        sh.y = hub.y + 120 + Math.random() * 40;
      }
    });

    const leaves = nodes.filter(n => n.type === 'leaf');
    leaves.forEach(leaf => {
      const targetId = leaf.subcluster || 'hub-' + leaf.cluster;
      const target = nodeMap[targetId];
      if (target) {
        leaf.x = target.x + Math.random() * 200 - 100;
        leaf.y = target.y + 120 + Math.random() * 80;
      }
    });
  }

  function resolveCollisionsAndLayout(callback) {
    nodes.forEach(n => {
      if (n.el) {
        n.w = n.el.offsetWidth;
        n.h = n.el.offsetHeight;
      } else {
        n.w = window.Leetree.NODE_W;
        n.h = window.Leetree.NODE_H;
      }
    });

    const nodeData = nodes.map(n => ({ id: n.id, x: n.x || 0, y: n.y || 0, w: n.w, h: n.h }));

    if (workerEnabled() && worker()) {
      worker().postMessage({ type: 'layout', nodes: nodeData });
      worker().onmessage = (e) => {
        if (e.data.type === 'layout') {
          e.data.nodes.forEach(pos => {
            const n = nodeMap[pos.id];
            if (n) {
              n.x = pos.x;
              n.y = pos.y;
            }
          });
          callback();
        }
      };
    } else {
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
      nodeData.forEach(pos => {
        const n = nodeMap[pos.id];
        if (n) {
          n.x = pos.x;
          n.y = pos.y;
        }
      });
      callback();
    }
  }

  return {
    computeGuidedPositions,
    resolveCollisionsAndLayout
  };
})();
