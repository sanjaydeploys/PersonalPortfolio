// leetree-core.js
(function () {
  window.Leetree = window.Leetree || {};
  window.Leetree.initialized = false;

  const isMobile = window.innerWidth < 768;

  const clusters = [
    { id: 'sum', label: 'Sum & Pair', color: '#ff7b7b' },
    { id: 'window', label: 'Sliding Window', color: '#7bd1ff' },
    { id: 'prefix', label: 'Prefix / Subarray', color: '#ffd47b' },
    { id: 'twoPointers', label: 'Two Pointers / k-sum', color: '#b6ff7b' },
    { id: 'backtracking', label: 'Backtracking', color: '#cba6ff' },
    { id: 'binary', label: 'Binary Search', color: '#7bffd9' },
    { id: 'dp', label: 'Dynamic Programming', color: '#ffb6e0' },
    { id: 'graph', label: 'Graph', color: '#8fd6ff' },
    { id: 'greedy', label: 'Greedy', color: '#ffab7b' },
    { id: 'heap', label: 'Heap / PQ', color: '#7bffab' },
    { id: 'trie', label: 'Trie', color: '#ab7bff' },
    { id: 'unionfind', label: 'Union-Find', color: '#ff7bd9' }
  ];

  const problems = [
    { id: 'two-sum', title: 'Two Sum', sub: 'LC1 — Hash map', url: 'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster: 'sum' },
    { id: 'two-sum-ii', title: 'Two Sum II', sub: 'LC167 — Sorted two-pointer', url: 'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster: 'sum' },
    { id: '4sum-ii', title: '4Sum II', sub: 'LC454 — Hash map extension', url: '#', cluster: 'sum' },
    { id: '3sum', title: '3Sum', sub: 'LC15 — k-sum', url: 'https://sanjay-patidar.vercel.app/three-sum', cluster: 'twoPointers' },
    { id: '3closest', title: '3Sum Closest', sub: 'LC16 — closest target', url: 'https://sanjay-patidar.vercel.app/three-sum-closest', cluster: 'twoPointers' },
    { id: '4sum', title: '4Sum', sub: 'LC18 — k-sum extension', url: '#', cluster: 'twoPointers' },
    { id: 'container-water', title: 'Container With Most Water', sub: 'LC11 — Two pointers', url: '#', cluster: 'twoPointers' },
    { id: 'trapping-rain', title: 'Trapping Rain Water', sub: 'LC42 — Monotonic stack / two pointers', url: '#', cluster: 'twoPointers' },
    { id: 'anagram', title: 'Find All Anagrams', sub: 'LC438 — Fixed window', url: 'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster: 'window' },
    { id: 'min-window', title: 'Minimum Window', sub: 'LC76 — Variable window', url: 'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster: 'window' },
    { id: 'sliding-max', title: 'Sliding Window Max', sub: 'LC239 — Monotonic', url: '#', cluster: 'window' },
    { id: 'longest-no-repeat', title: 'Longest Substring Without Repeating', sub: 'LC3 — Variable window', url: '#', cluster: 'window' },
    { id: 'max-consecutive', title: 'Max Consecutive Ones', sub: 'LC1004 — Sliding window', url: '#', cluster: 'window' },
    { id: 'subarray-sum-k', title: 'Subarray Sum K', sub: 'LC560', url: '#', cluster: 'prefix' },
    { id: 'prefix-sum', title: 'Prefix Sum Techniques', sub: 'prefix-sum', url: '#', cluster: 'prefix' },
    { id: 'continuous-subarray', title: 'Continuous Subarray Sum', sub: 'LC523 — Prefix mod', url: '#', cluster: 'prefix' },
    { id: 'product-except-self', title: 'Product of Array Except Self', sub: 'LC238 — Prefix product', url: '#', cluster: 'prefix' },
    { id: 'perm', title: 'Permutations', sub: 'LC46', url: '#', cluster: 'backtracking' },
    { id: 'comb-phone', title: 'Letter Combinations', sub: 'LC17', url: '#', cluster: 'backtracking' },
    { id: 'subsets', title: 'Subsets', sub: 'LC78 — Backtracking', url: '#', cluster: 'backtracking' },
    { id: 'word-search', title: 'Word Search', sub: 'LC79 — Backtracking DFS', url: '#', cluster: 'backtracking' },
    { id: 'binary-search', title: 'Binary Search', sub: 'LC33', url: '#', cluster: 'binary' },
    { id: 'search-answer', title: 'Search on Answer', sub: 'LC875', url: '#', cluster: 'binary' },
    { id: 'min-rotated', title: 'Find Minimum in Rotated Sorted Array', sub: 'LC153 — Binary search', url: '#', cluster: 'binary' },
    { id: 'climb', title: 'Climbing Stairs', sub: 'LC70', url: '#', cluster: 'dp', subcluster: 'dp-1d' },
    { id: 'house-robber', title: 'House Robber', sub: 'LC198', url: '#', cluster: 'dp', subcluster: 'dp-1d' },
    { id: 'lis', title: 'Longest Increasing Subsequence', sub: 'LC300 — DP', url: '#', cluster: 'dp', subcluster: 'dp-1d' },
    { id: 'coin-change', title: 'Coin Change', sub: 'LC322 — Unbounded knapsack', url: '#', cluster: 'dp', subcluster: 'dp-2d' },
    { id: 'islands', title: 'Number of Islands', sub: 'LC200', url: '#', cluster: 'graph' },
    { id: 'wordladder', title: 'Word Ladder', sub: 'LC127', url: '#', cluster: 'graph' },
    { id: 'course-schedule', title: 'Course Schedule', sub: 'LC207 — Topo sort', url: '#', cluster: 'graph' },
    { id: 'rotten-oranges', title: 'Rotten Oranges', sub: 'LC994 — BFS', url: '#', cluster: 'graph' },
    { id: 'jump-game', title: 'Jump Game', sub: 'LC55 — Greedy', url: '#', cluster: 'greedy' },
    { id: 'gas-station', title: 'Gas Station', sub: 'LC134 — Greedy', url: '#', cluster: 'greedy' },
    { id: 'kth-largest', title: 'Kth Largest Element', sub: 'LC215 — Heap', url: '#', cluster: 'heap' },
    { id: 'merge-k-lists', title: 'Merge K Sorted Lists', sub: 'LC23 — Priority queue', url: '#', cluster: 'heap' },
    { id: 'word-dictionary', title: 'Implement Trie', sub: 'LC208 — Trie', url: '#', cluster: 'trie' },
    { id: 'longest-word', title: 'Longest Word in Dictionary', sub: 'LC720 — Trie', url: '#', cluster: 'trie' },
    { id: 'provinces', title: 'Number of Provinces', sub: 'LC547 — Union-Find', url: '#', cluster: 'unionfind' },
    { id: 'redundant-connection', title: 'Redundant Connection', sub: 'LC684 — Union-Find cycle', url: '#', cluster: 'unionfind' }
  ];

  problems.sort((a, b) => a.title.localeCompare(b.title));

  const nodes = [];
  const edges = [];
  const nodeMap = {};
  let scale = 1;
  let worker = null;
  let workerEnabled = false;
  let animationsEnabled = true;

  const NODE_W = isMobile ? 80 : 150;
  const NODE_H = isMobile ? 32 : 56;
  const PADDING = isMobile ? 10 : 15;

  function buildGraph() {
    nodes.length = 0;
    edges.length = 0;
    nodes.push({ id: 'root', title: 'DSA / Patterns', sub: 'Start here', url: '#', type: 'root', cluster: null });

    clusters.forEach((c) => {
      nodes.push({ id: 'hub-' + c.id, title: c.label, sub: 'pattern hub', url: '#', type: 'hub', cluster: c.id });
      edges.push(['root', 'hub-' + c.id]);
    });

    const subhubs = [
      { id: 'dp-1d', title: '1D DP', sub: 'Linear sequences', url: '#', type: 'subhub', cluster: 'dp' },
      { id: 'dp-2d', title: '2D DP', sub: 'Matrices / Multi-var', url: '#', type: 'subhub', cluster: 'dp' },
      { id: 'graph-bfs', title: 'BFS Patterns', sub: 'Level order', url: '#', type: 'subhub', cluster: 'graph' },
      { id: 'graph-dfs', title: 'DFS Patterns', sub: 'Recursion', url: '#', type: 'subhub', cluster: 'graph' },
      { id: 'backtrack-comb', title: 'Combinations', sub: 'Choices', url: '#', type: 'subhub', cluster: 'backtracking' },
      { id: 'backtrack-perm', title: 'Permutations', sub: 'Swaps', url: '#', type: 'subhub', cluster: 'backtracking' }
    ];
    subhubs.forEach((sh) => {
      nodes.push(sh);
      edges.push(['hub-' + sh.cluster, sh.id]);
    });

    problems.forEach((p) => {
      nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url || '#', type: 'leaf', cluster: p.cluster, subcluster: p.subcluster });
      const target = p.subcluster ? p.subcluster : 'hub-' + p.cluster;
      edges.push([target, p.id]);
    });

    edges.push(['sliding-max', 'prefix-sum']);
    edges.push(['trapping-rain', 'sliding-max']);
    edges.push(['word-search', 'graph-dfs']);
    edges.push(['wordladder', 'graph-bfs']);
    edges.push(['merge-k-lists', 'kth-largest']);
    edges.push(['3sum', 'two-sum']);
    edges.push(['coin-change', 'climb']);

    nodes.forEach((n) => {
      nodeMap[n.id] = n;
    });

    window.Leetree.initialized = true;
  }

  function boot() {
    if (!window.Leetree.initialized) {
      console.error('boot: Graph not initialized');
      return;
    }
    window.LeetreeLayout.computeGuidedPositions();
    window.LeetreeLayout.resolveCollisionsAndLayout(() => {
      nodes.forEach((n) => {
        if (!n.el) return;
        n.el.style.left = (n.x || 0) + 'px';
        n.el.style.top = (n.y || 0) + 'px';
      });
      window.LeetreeRender.drawEdges(true);
      window.LeetreeUtils.fitCanvas(PADDING);
    });
    window.LeetreeRender.renderNodes(true);
    window.LeetreeRender.setupSvgDefs();
    window.LeetreeRender.renderLegend();
    window.LeetreeUtils.initSearch();
    window.LeetreeRender.renderProblemButtons();
    window.LeetreeUtils.setupControlListeners();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        window.LeetreeLayout.computeGuidedPositions();
        window.LeetreeLayout.resolveCollisionsAndLayout(() => {
          window.LeetreeUtils.fitCanvas(PADDING);
          window.LeetreeRender.drawEdges(false);
        });
      }, 200);
    });
  }

  function checkDependencies() {
    return window.LeetreeLayout && window.LeetreeRender && window.LeetreeUtils;
  }

  function start() {
    buildGraph();
    window.Leetree.nodes = nodes;
    window.Leetree.edges = edges;
    window.Leetree.nodeMap = nodeMap;
    window.Leetree.clusters = clusters;
    window.Leetree.problems = problems;
    window.Leetree.scale = scale;
    window.Leetree.worker = worker;
    window.Leetree.workerEnabled = workerEnabled;
    window.Leetree.animationsEnabled = animationsEnabled;
    window.Leetree.NODE_W = NODE_W;
    window.Leetree.NODE_H = NODE_H;
    window.Leetree.PADDING = PADDING;
    window.Leetree.isMobile = isMobile;

    if (checkDependencies()) {
      boot();
    } else {
      setTimeout(start, 50);
    }
  }

  window.Leetree.addProblem = function(p) {
    problems.push(p);
    nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url || '#', type: 'leaf', cluster: p.cluster, subcluster: p.subcluster });
    const target = p.subcluster ? p.subcluster : 'hub-' + p.cluster;
    edges.push([target, p.id]);
    nodeMap[p.id] = nodes.find((n) => n.id === p.id);
    window.LeetreeLayout.computeGuidedPositions();
    window.LeetreeLayout.resolveCollisionsAndLayout(() => {
      window.LeetreeRender.renderNodes(true);
      window.LeetreeRender.setupSvgDefs();
      window.LeetreeRender.drawEdges(true);
      window.LeetreeUtils.fitCanvas(PADDING);
      window.LeetreeRender.renderProblemButtons();
    });
  };

  start();
})();

// leetree-layout.js
window.Leetree = window.Leetree || {};
window.LeetreeLayout = (function () {
  const nodes = window.Leetree.nodes || [];
  const edges = window.Leetree.edges || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const isMobile = window.Leetree.isMobile;

  function computeGuidedPositions() {
    const viewWidth = window.innerWidth * (isMobile ? 1.2 : 0.9);
    const viewHeight = window.innerHeight * (isMobile ? 1.5 : 0.8);
    const rootRadius = isMobile ? 120 : 250;
    const hubRadius = Math.min(viewWidth / 5, isMobile ? 180 : 350);
    const subhubRadius = Math.min(viewWidth / 8, isMobile ? 120 : 220);
    const leafRadius = Math.min(viewWidth / 10, isMobile ? 100 : 180);

    // Reset positions
    nodes.forEach(n => { n.x = undefined; n.y = undefined; });

    // Place root at center-top
    const root = nodeMap['root'];
    root.x = viewWidth / 2;
    root.y = rootRadius;

    // Place hubs in a semi-circle below root
    const hubs = nodes.filter(n => n.type === 'hub');
    const hubAngleStart = -Math.PI / 1.5;
    const hubAngleEnd = Math.PI / 1.5;
    hubs.forEach((h, i) => {
      const angle = hubAngleStart + (hubAngleEnd - hubAngleStart) * (i / (hubs.length - 1 || 1));
      h.x = root.x + Math.cos(angle) * hubRadius;
      h.y = root.y + Math.sin(angle) * hubRadius + 100; // Slight downward offset
    });

    // Build children map for hierarchical placement
    const childrenMap = {};
    edges.forEach(([from, to]) => {
      if (!childrenMap[from]) childrenMap[from] = [];
      childrenMap[from].push(to);
    });

    // Place subhubs and leaves hierarchically
    function placeChildren(parentId, radius, angleSpread = Math.PI * 1.2, angleOffset = -Math.PI / 1.5) {
      const parent = nodeMap[parentId];
      const children = childrenMap[parentId] || [];
      const angleStep = angleSpread / (children.length || 1);
      children.forEach((childId, i) => {
        const child = nodeMap[childId];
        if (child.x !== undefined) return; // Skip if already placed (for cross-edges)
        const angle = angleOffset + angleStep * i;
        child.x = parent.x + Math.cos(angle) * radius;
        child.y = parent.y + Math.sin(angle) * radius;
        // Recurse for sub-children
        placeChildren(childId, leafRadius, Math.PI * 0.8, angle - Math.PI / 2);
      });
    }

    // Place from hubs
    hubs.forEach(h => placeChildren(h.id, subhubRadius));

    // Handle cross-edges by averaging positions or slight adjustments if needed
    edges.forEach(([from, to]) => {
      const child = nodeMap[to];
      if (child.x === undefined) {
        // For cross-links, place near from if not placed
        const parent = nodeMap[from];
        child.x = parent.x + (Math.random() - 0.5) * 50;
        child.y = parent.y + leafRadius + (Math.random() - 0.5) * 50;
      }
    });
  }

  function resolveCollisionsAndLayout(callback) {
    const nodeW = window.Leetree.NODE_W * 1.1; // Padding for collision
    const nodeH = window.Leetree.NODE_H * 1.1;
    const arr = nodes.map(n => ({ id: n.id, x: n.x || 0, y: n.y || 0 }));

    if (window.Leetree.workerEnabled && window.Leetree.worker) {
      window.Leetree.worker.postMessage({ type: 'layout', nodes: arr, nodeW, nodeH });
      window.Leetree.worker.onmessage = (ev) => {
        if (ev.data.type === 'layout') {
          ev.data.nodes.forEach(pos => {
            const n = nodeMap[pos.id];
            n.x = pos.x;
            n.y = pos.y;
          });
          callback();
        }
      };
    } else {
      const iters = 500;
      for (let it = 0; it < iters; it++) {
        let moved = false;
        arr.sort((a, b) => a.x - b.x || a.y - b.y);
        for (let i = 0; i < arr.length; i++) {
          const a = arr[i];
          for (let j = i + 1; j < arr.length; j++) {
            const b = arr[j];
            if (b.x - a.x > nodeW * 2) break;
            const overlapX = Math.min(a.x + nodeW, b.x + nodeW) - Math.max(a.x, b.x);
            const overlapY = Math.min(a.y + nodeH, b.y + nodeH) - Math.max(a.y, b.y);
            if (overlapX > 0 && overlapY > 0) {
              const push = Math.min(overlapX, overlapY) / 2 + 6;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const bias = Math.abs(dy) > Math.abs(dx) ? 1.4 : 1; // Prefer vertical separation
              a.x -= (dx / dist) * push * bias;
              a.y -= (dy / dist) * push * bias;
              b.x += (dx / dist) * push * bias;
              b.y += (dy / dist) * push * bias;
              moved = true;
            }
          }
        }
        if (!moved) break;
      }
      arr.forEach(pos => {
        const n = nodeMap[pos.id];
        n.x = pos.x;
        n.y = pos.y;
      });
      callback();
    }
  }

  return {
    computeGuidedPositions,
    resolveCollisionsAndLayout
  };
})();

// leetree-render.js
window.Leetree = window.Leetree || {};
window.LeetreeRender = (function () {
  const nodes = window.Leetree.nodes || [];
  const edges = window.Leetree.edges || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const clusters = window.Leetree.clusters || [];
  const svg = document.getElementById('map-svg');
  const container = document.getElementById('map-nodes');
  const legendEl = document.getElementById('map-legend');
  const problemButtons = document.getElementById('problem-buttons');

  function renderNodes(isInitial = false) {
    container.innerHTML = '';
    nodes.forEach((n, idx) => {
      const el = document.createElement('a');
      el.className = 'node-box ' + (n.type === 'root' ? 'root-node' : (n.type === 'hub' || n.type === 'subhub' ? 'intermediate-node' : 'leaf-node'));
      el.href = n.url || '#';
      el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
      el.dataset.id = n.id;
      el.setAttribute('role', 'link');
      el.setAttribute('aria-label', n.title + ' — ' + (n.sub || ''));

      const accent = document.createElement('span');
      accent.className = 'cluster-accent';
      accent.style.background = n.cluster ? clusters.find((c) => c.id === n.cluster).color : '#fff';
      accent.style.boxShadow = '0 6px 18px ' + window.LeetreeUtils.hexToRgba(accent.style.background, 0.12);
      el.appendChild(accent);

      const t = document.createElement('span');
      t.className = 'node-title';
      t.textContent = n.title;
      const s = document.createElement('span');
      s.className = 'node-sub';
      s.textContent = n.sub || '';
      el.appendChild(t);
      el.appendChild(s);

      el.addEventListener('mouseenter', (e) => { window.LeetreeUtils.highlightPath(window.LeetreeUtils.findPathTo(n.id), 0, true); window.LeetreeUtils.showTooltip(e, n); });
      el.addEventListener('mouseleave', () => { window.LeetreeUtils.highlightPath(window.LeetreeUtils.findPathTo(n.id), 0, false); window.LeetreeUtils.hideTooltip(); });
      el.addEventListener('touchstart', (e) => { e.preventDefault(); window.LeetreeUtils.highlightPath(window.LeetreeUtils.findPathTo(n.id), 0, true); window.LeetreeUtils.showTooltip(e, n); });
      el.addEventListener('touchend', () => { window.LeetreeUtils.highlightPath(window.LeetreeUtils.findPathTo(n.id), 0, false); window.LeetreeUtils.hideTooltip(); });
      el.addEventListener('click', (ev) => {
        if (!n.url || n.url === '#') {
          ev.preventDefault();
          window.LeetreeUtils.focusNode(n.id);
        }
      });

      window.LeetreeUtils.enableNodeDrag(el, n);

      container.appendChild(el);
      n.el = el;

      if (isInitial && window.Leetree.animationsEnabled) {
        el.style.opacity = 0;
        el.style.transform = 'scale(0.8) translateY(20px) rotateX(-10deg)';
        setTimeout(() => {
          el.classList.add('node-enter');
          el.style.opacity = 1;
          el.style.transform = 'scale(1) translateY(0) rotateX(0)';
        }, idx * 20);
      } else if (!window.Leetree.animationsEnabled) {
        el.style.transition = 'none';
        setTimeout(() => el.style.transition = '', 100);
      }
    });
  }

  function setupSvgDefs() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');

    const filt = document.createElementNS(ns, 'filter');
    filt.setAttribute('id', 'map-glow');
    filt.setAttribute('x', '-50%');
    filt.setAttribute('y', '-50%');
    filt.setAttribute('width', '200%');
    filt.setAttribute('height', '200%');
    const fe = document.createElementNS(ns, 'feGaussianBlur');
    fe.setAttribute('stdDeviation', '4.0');
    fe.setAttribute('result', 'coloredBlur');
    filt.appendChild(fe);
    const merge = document.createElementNS(ns, 'feMerge');
    const m1 = document.createElementNS(ns, 'feMergeNode');
    m1.setAttribute('in', 'coloredBlur');
    const m2 = document.createElementNS(ns, 'feMergeNode');
    m2.setAttribute('in', 'SourceGraphic');
    merge.appendChild(m1);
    merge.appendChild(m2);
    filt.appendChild(merge);
    defs.appendChild(filt);

    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id', 'map-arrow');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerUnits', 'strokeWidth');
    marker.setAttribute('markerWidth', '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('orient', 'auto');
    const mpath = document.createElementNS(ns, 'path');
    mpath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    mpath.setAttribute('fill', 'rgba(255,255,255,0.4)');
    marker.appendChild(mpath);
    defs.appendChild(marker);

    svg.appendChild(defs);
  }

  function drawEdges(initial = false) {
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) svg.appendChild(defs);

    edges.forEach(([from, to], idx) => {
      const f = nodeMap[from], t = nodeMap[to];
      if (!f || !t || !f.el || !t.el) return;
      const w1 = f.el.offsetWidth || window.Leetree.NODE_W;
      const h1 = f.el.offsetHeight || window.Leetree.NODE_H;
      const w2 = t.el.offsetWidth || window.Leetree.NODE_W;
      const h2 = t.el.offsetHeight || window.Leetree.NODE_H;
      let x1 = f.x + w1 / 2;
      let y1 = f.y + h1 / 2;
      let x2 = t.x + w2 / 2;
      let y2 = t.y + h2 / 2;

      // Improved side attachment
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      const side1 = getSideOffset(angle, w1 / 2, h1 / 2);
      const side2 = getSideOffset(angle + Math.PI, w2 / 2, h2 / 2);
      x1 += side1.x;
      y1 += side1.y;
      x2 += side2.x;
      y2 += side2.y;

      const dist = Math.hypot(dx, dy) || 1;
      const curveFactor = dist * 0.15;
      const perpX = -dy / dist * curveFactor;
      const perpY = dx / dist * curveFactor;
      const cx1 = x1 + dx * 0.3 + perpX * 0.6;
      const cy1 = y1 + dy * 0.3 + perpY * 0.6;
      const cx2 = x1 + dx * 0.7 + perpX * 0.4;
      const cy2 = y1 + dy * 0.7 + perpY * 0.4;
      const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-line');
      if (f.type === 'hub' || t.type === 'hub' || f.type === 'subhub' || t.type === 'subhub') path.classList.add('flow-glow');
      path.setAttribute('marker-end', 'url(#map-arrow)');
      path.dataset.from = from;
      path.dataset.to = to;
      path.dataset.cluster = f.cluster || t.cluster;
      svg.appendChild(path);

      const enabled = window.Leetree.animationsEnabled;
      const cluster = path.dataset.cluster;
      const color = cluster ? clusters.find((c) => c.id === cluster).color : '#ffffff';
      if (enabled) {
        if (initial) {
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          requestAnimationFrame(() => {
            path.classList.add('path-draw-advanced');
            path.style.strokeDashoffset = '0';
            setTimeout(() => { path.classList.remove('path-draw-advanced'); path.classList.add('flow-anim-advanced'); }, 1200);
          });
        } else {
          path.classList.add('flow-anim-advanced');
        }
      } else {
        path.style.stroke = window.LeetreeUtils.hexToRgba(color, 0.3);
        path.style.transition = 'stroke 160ms, opacity 160ms, stroke-width 160ms';
      }
    });
  }

  function getSideOffset(angle, halfW, halfH) {
    angle = (angle + 2 * Math.PI) % (2 * Math.PI);
    if (angle < Math.PI / 4 || angle >= 7 * Math.PI / 4) return { x: halfW, y: 0 }; // right
    if (angle < 3 * Math.PI / 4) return { x: 0, y: halfH }; // bottom
    if (angle < 5 * Math.PI / 4) return { x: -halfW, y: 0 }; // left
    return { x: 0, y: -halfH }; // top
  }

  function toggleEdgeAnimations() {
    const paths = svg.querySelectorAll('path.flow-line');
    const enabled = window.Leetree.animationsEnabled;
    paths.forEach((path) => {
      path.classList.remove('path-draw-advanced', 'flow-anim-advanced', 'flow-anim', 'path-pulse-advanced');
      path.style.stroke = '';
      path.style.strokeDasharray = '';
      path.style.strokeDashoffset = '';
      path.style.animation = '';
      path.style.transition = enabled ? '' : 'stroke 160ms, opacity 160ms, stroke-width 160ms';
      if (enabled) {
        path.classList.add('flow-anim-advanced');
      } else {
        const cluster = path.dataset.cluster;
        const color = cluster ? clusters.find((c) => c.id === cluster).color : '#ffffff';
        path.style.stroke = window.LeetreeUtils.hexToRgba(color, 0.3);
      }
    });
  }

  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach((c) => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = c.color;
      const label = document.createElement('div');
      label.textContent = c.label;
      item.appendChild(sw);
      item.appendChild(label);
      item.addEventListener('click', () => window.LeetreeUtils.toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }

  function renderProblemButtons() {
    problemButtons.innerHTML = '';
    window.Leetree.problems.forEach((p) => {
      const btn = document.createElement('button');
      btn.textContent = p.title;
      btn.title = p.sub || '';
      btn.addEventListener('click', () => window.LeetreeUtils.focusNode(p.id));
      problemButtons.appendChild(btn);
    });
  }

  window.addEventListener('leetree:toggleAnimations', () => {
    toggleEdgeAnimations();
  });

  return {
    renderNodes,
    setupSvgDefs,
    drawEdges,
    toggleEdgeAnimations,
    renderLegend,
    renderProblemButtons
  };
})();

// leetree-utils.js
window.Leetree = window.Leetree || {};
window.LeetreeUtils = (function () {
  const nodes = window.Leetree.nodes || [];
  const edges = window.Leetree.edges || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const clusters = window.Leetree.clusters || [];
  const stage = document.getElementById('map-stage');
  const container = document.getElementById('map-nodes');
  const svg = document.getElementById('map-svg');
  const searchInput = document.getElementById('node-search');
  const PADDING = window.Leetree.PADDING || (window.innerWidth < 768 ? 10 : 15);
  let activeCluster = null;
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);

  function highlightPath(path, duration = 0, on = true) {
    if (path.length < 2) return;
    const clusterColor = nodeMap[path[path.length - 1]].cluster ? clusters.find((c) => c.id === nodeMap[path[path.length - 1]].cluster).color : '#fff';
    const pairs = [];
    for (let i = 0; i < path.length - 1; i++) pairs.push([path[i], path[i + 1]]);
    const svgpaths = svg.querySelectorAll('path.flow-line');
    const enabled = window.Leetree.animationsEnabled;
    svgpaths.forEach((p) => {
      const from = p.dataset.from, to = p.dataset.to;
      const match = pairs.some((pair) => (pair[0] === from && pair[1] === to) || (pair[0] === to && pair[1] === from));
      const pathCluster = p.dataset.cluster;
      const pathColor = pathCluster ? clusters.find((c) => c.id === pathCluster).color : '#ffffff';
      if (match) {
        if (on) {
          p.classList.add(enabled ? 'flow-highlight-advanced' : 'flow-highlight');
          p.style.stroke = enabled ? clusterColor : pathColor;
          p.style.opacity = '1';
          if (enabled) p.classList.add('path-pulse-advanced');
        } else {
          p.classList.remove('flow-highlight-advanced', 'flow-highlight', 'path-pulse-advanced');
          p.style.stroke = enabled ? '' : window.LeetreeUtils.hexToRgba(pathColor, 0.3);
          p.style.opacity = '';
        }
      } else if (on) {
        p.style.opacity = '0.2';
        if (!enabled) p.style.stroke = window.LeetreeUtils.hexToRgba(pathColor, 0.12);
      } else {
        p.style.opacity = '';
        if (!enabled) p.style.stroke = window.LeetreeUtils.hexToRgba(pathColor, 0.3);
      }
    });
    if (duration > 0) {
      setTimeout(() => {
        svgpaths.forEach((p) => { p.classList.remove('flow-highlight-advanced', 'path-pulse-advanced'); p.style.stroke = enabled ? '' : window.LeetreeUtils.hexToRgba(p.dataset.cluster ? clusters.find(c => c.id === p.dataset.cluster).color : '#fff', 0.3); p.style.opacity = ''; });
      }, duration);
    }
  }

  function showTooltip(e, n) {
    let desc = n.sub || 'No description';
    if (n.type === 'leaf') desc += '<br>Click to view solution';
    tooltip.innerHTML = '<strong>' + escapeHtml(n.title) + '</strong><div style="margin-top:6px;font-size:12px;opacity:0.9">' + escapeHtml(desc) + '</div>';
    tooltip.style.display = 'block';
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = rect.left + window.pageXOffset + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + window.pageYOffset + 8;
    if (left < 0) left = 0;
    if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width;
    if (top + tooltipRect.height > window.innerHeight + window.pageYOffset) top = rect.top + window.pageYOffset - tooltipRect.height - 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    if (window.Leetree.animationsEnabled) tooltip.classList.add('tooltip-fade-in');
    else tooltip.style.opacity = 1;
  }

  function hideTooltip() {
    tooltip.style.display = 'none';
    tooltip.classList.remove('tooltip-fade-in');
    tooltip.style.opacity = 0;
  }

  function fitCanvas(padding = PADDING) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      if (!n.el) return;
      const left = n.x || 0;
      const top = n.y || 0;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + (n.el.offsetWidth || window.Leetree.NODE_W));
      maxY = Math.max(maxY, top + (n.el.offsetHeight || window.Leetree.NODE_H));
    });
    if (minX === Infinity) { minX = 0; minY = 0; maxX = 800; maxY = 600; }
    const width = Math.ceil(maxX - minX + padding * 2);
    const height = Math.ceil(maxY - minY + padding * 2);
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const offsetX = padding - minX;
    const offsetY = padding - minY;
    nodes.forEach((n) => {
      if (!n.el) return;
      n.x = (n.x || 0) + offsetX;
      n.y = (n.y || 0) + offsetY;
      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
    });

    window.LeetreeRender.drawEdges(false);

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScaleW = (stageW - 20) / width;
    const fitScaleH = (stageH - 20) / height;
    const fitScale = Math.min(1, Math.min(fitScaleW, fitScaleH));
    setScale(fitScale);
    const centroidX = (minX + maxX) / 2 * fitScale;
    const centroidY = (minY + maxY) / 2 * fitScale;
    stage.scrollLeft = Math.max(0, centroidX - stageW / 2 + offsetX * fitScale);
    stage.scrollTop = Math.max(0, centroidY - stageH / 2 + offsetY * fitScale);
  }

  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if (!n || !n.el) return;
    const cx = n.x + (n.el.offsetWidth || window.Leetree.NODE_W) / 2;
    const cy = n.y + (n.el.offsetHeight || window.Leetree.NODE_H) / 2;
    setScale(Math.min(1.2, Math.max(0.6, 0.9)));
    stage.scrollTo({ left: Math.max(0, cx * window.Leetree.scale - stage.clientWidth / 2), top: Math.max(0, cy * window.Leetree.scale - stage.clientHeight / 2), behavior: window.Leetree.animationsEnabled ? 'smooth' : 'auto' });
    highlightPath(findPathTo(nodeId), 1400);
    if (window.Leetree.animationsEnabled) n.el.classList.add('node-focus-pulse');
    setTimeout(() => n.el.classList.remove('node-focus-pulse'), 1400);
  }

  function findPathTo(nodeId) {
    const visited = new Set();
    const queue = [{ id: 'root', path: ['root'] }];
    while (queue.length) {
      const { id, path } = queue.shift();
      if (id === nodeId) return path;
      if (visited.has(id)) continue;
      visited.add(id);
      edges.forEach(([from, to]) => {
        if (from === id) queue.push({ id: to, path: [...path, to] });
        if (to === id) queue.push({ id: from, path: [...path, from] });
      });
    }
    return [];
  }

  function toggleCluster(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    nodes.forEach((n) => {
      if (!n.el) return;
      if (activeCluster && n.type !== 'root' && n.cluster !== activeCluster) n.el.style.opacity = '0.24';
      else n.el.style.opacity = '';
    });
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach((p) => {
      if (!activeCluster) { p.style.opacity = ''; return; }
      const from = p.dataset.from, to = p.dataset.to;
      const f = nodeMap[from], t = nodeMap[to];
      if ((f && f.cluster === activeCluster) || (t && t.cluster === activeCluster)) {
        p.style.opacity = '1';
        p.style.stroke = '';
      } else {
        p.style.opacity = '0.06';
      }
    });
  }

  function initSearch() {
    if (!searchInput) {
      console.warn('initSearch: #node-search element not found');
      return;
    }
    const flat = nodes.map((n) => ({ id: n.id, title: n.title, sub: n.sub }));
    let currentFocus = -1;
    searchInput.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      closeAllLists();
      if (!val) return;
      const list = document.createElement('div');
      list.className = 'autocomplete-items';
      document.body.appendChild(list);
      const inputRect = this.getBoundingClientRect();
      list.style.position = 'absolute';
      list.style.left = inputRect.left + 'px';
      list.style.top = (inputRect.bottom + window.pageYOffset) + 'px';
      list.style.width = inputRect.width + 'px';
      list.style.zIndex = '1000';
      const matches = flat.filter((it) => it.title.toLowerCase().includes(val) || (it.sub || '').toLowerCase().includes(val));
      matches.slice(0, 10).forEach((m) => {
        const item = document.createElement('div');
        item.innerHTML = '<strong>' + escapeHtml(m.title) + '</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">' + escapeHtml(m.sub || '') + '</div>';
        item.addEventListener('click', () => { searchInput.value = m.title; closeAllLists(); focusNode(m.id); });
        list.appendChild(item);
      });
    });
    searchInput.addEventListener('keydown', (e) => {
      const list = document.querySelector('.autocomplete-items');
      if (!list) return;
      const items = list.getElementsByTagName('div');
      if (e.key === 'ArrowDown') { currentFocus++; addActive(items); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { currentFocus--; addActive(items); e.preventDefault(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (currentFocus > -1 && items[currentFocus]) items[currentFocus].click(); }
      function addActive(items) {
        if (!items) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('autocomplete-active');
      }
      function removeActive(items) {
        for (let it of items) it.classList.remove('autocomplete-active');
      }
    });
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target)) closeAllLists();
    });
    function closeAllLists() {
      const items = document.getElementsByClassName('autocomplete-items');
      for (let i = items.length - 1; i >= 0; i--) items[i].parentNode.removeChild(items[i]);
    }
  }

  function enableNodeDrag(el, n) {
    let isDragging = false;
    let startX, startY;
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      startX = (e.clientX || e.touches[0].clientX) / window.Leetree.scale - n.x;
      startY = (e.clientY || e.touches[0].clientY) / window.Leetree.scale - n.y;
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      n.x = (e.clientX || e.touches[0].clientX) / window.Leetree.scale - startX;
      n.y = (e.clientY || e.touches[0].clientY) / window.Leetree.scale - startY;
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      window.LeetreeRender.drawEdges(false);
    }

    function endDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
      window.LeetreeUtils.fitCanvas(PADDING);
    }
  }

  function setupControlListeners() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetView = document.getElementById('reset-view');
    const toggleAnimations = document.getElementById('toggle-animations');
    const useWorker = document.getElementById('use-worker');

    if (!zoomIn || !zoomOut || !resetView || !toggleAnimations || !useWorker) {
      console.warn('setupControlListeners: One or more control buttons not found');
      return;
    }

    zoomIn.addEventListener('click',
