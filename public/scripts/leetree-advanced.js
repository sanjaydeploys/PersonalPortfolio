(function () {
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

  problems.sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });

  const svg = document.getElementById('map-svg');
  const container = document.getElementById('map-nodes');
  const stage = document.getElementById('map-stage');
  const legendEl = document.getElementById('map-legend');
  const searchInput = document.getElementById('node-search');
  const problemButtons = document.getElementById('problem-buttons');
  const useWorkerBtn = document.getElementById('use-worker');
  const autoLayoutBtn = document.getElementById('auto-layout');
  const toggleAnimBtn = document.getElementById('toggle-animations');

  const nodes = [];
  const edges = [];
  const nodeMap = {};
  let scale = 1;
  let worker = null;
  let workerEnabled = false;
  let animationsEnabled = true;

  const NODE_W = isMobile ? 100 : 180;
  const NODE_H = isMobile ? 40 : 68;
  const PADDING = isMobile ? 15 : 80;

  function buildGraph() {
    nodes.length = 0;
    edges.length = 0;
    nodes.push({ id: 'root', title: 'DSA / Patterns', sub: 'Start here', url: '#', type: 'root', cluster: null });

    clusters.forEach(function(c) {
      nodes.push({ id: 'hub-' + c.id, title: c.label, sub: 'pattern hub', url: '#', type: 'hub', cluster: c.id });
      edges.push(['root', 'hub-' + c.id]);
    });

    // Add sub-hubs for deeper layers (example for dp, graph, backtracking)
    const subhubs = [
      { id: 'dp-1d', title: '1D DP', sub: 'Linear sequences', url: '#', type: 'subhub', cluster: 'dp' },
      { id: 'dp-2d', title: '2D DP', sub: 'Matrices / Multi-var', url: '#', type: 'subhub', cluster: 'dp' },
      { id: 'graph-bfs', title: 'BFS Patterns', sub: 'Level order', url: '#', type: 'subhub', cluster: 'graph' },
      { id: 'graph-dfs', title: 'DFS Patterns', sub: 'Recursion', url: '#', type: 'subhub', cluster: 'graph' },
      { id: 'backtrack-comb', title: 'Combinations', sub: 'Choices', url: '#', type: 'subhub', cluster: 'backtracking' },
      { id: 'backtrack-perm', title: 'Permutations', sub: 'Swaps', url: '#', type: 'subhub', cluster: 'backtracking' }
    ];
    subhubs.forEach(function(sh) {
      nodes.push(sh);
      edges.push(['hub-' + sh.cluster, sh.id]);
    });

    problems.forEach(function(p) {
      nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url || '#', type: 'leaf', cluster: p.cluster, subcluster: p.subcluster });
      const target = p.subcluster ? p.subcluster : 'hub-' + p.cluster;
      edges.push([target, p.id]);
    });

    // Add cross-connections for web-like structure (related problems across clusters)
    edges.push(['sliding-max', 'prefix-sum']); // Monotonic queue relation
    edges.push(['trapping-rain', 'sliding-max']); // Stack/monotonic
    edges.push(['word-search', 'graph-dfs']); // Backtracking as DFS
    edges.push(['wordladder', 'graph-bfs']); // Word ladder BFS
    edges.push(['merge-k-lists', 'kth-largest']); // Heap relations
    edges.push(['3sum', 'two-sum']); // Sum family
    edges.push(['coin-change', 'climb']); // DP progression

    nodes.forEach(function(n) {
      nodeMap[n.id] = n;
    });
  }

  function computeGuidedPositions() {
    // Improved for organization: arrange in grid for scalability
    const gridCols = Math.ceil(Math.sqrt(clusters.length));
    const gridSpacingX = isMobile ? 300 : 500;
    const gridSpacingY = isMobile ? 200 : 300;
    const rootX = PADDING + (gridCols * gridSpacingX) / 2;
    const rootY = PADDING;
    nodeMap['root'].x = rootX;
    nodeMap['root'].y = rootY;

    const hubIds = clusters.map(function(c) { return 'hub-' + c.id; });
    hubIds.forEach(function(hid, idx) {
      const col = idx % gridCols;
      const row = Math.floor(idx / gridCols);
      nodeMap[hid].x = PADDING + col * gridSpacingX + (isMobile ? 100 : 200);
      nodeMap[hid].y = rootY + gridSpacingY + row * gridSpacingY;
    });

    // Position sub-hubs in a mini-grid around hub
    const subhubGroups = {};
    nodes.forEach(function(n) {
      if (n.type === 'subhub') {
        if (!subhubGroups[n.cluster]) subhubGroups[n.cluster] = [];
        subhubGroups[n.cluster].push(n.id);
      }
    });
    Object.keys(subhubGroups).forEach(function(clusterId) {
      const hub = nodeMap['hub-' + clusterId];
      const list = subhubGroups[clusterId];
      const subCols = Math.ceil(Math.sqrt(list.length));
      const subSpacingX = isMobile ? 150 : 250;
      const subSpacingY = isMobile ? 100 : 150;
      const startX = hub.x + 100;
      const startY = hub.y + 50;
      list.forEach(function(id, idx) {
        const col = idx % subCols;
        const row = Math.floor(idx / subCols);
        nodeMap[id].x = startX + col * subSpacingX;
        nodeMap[id].y = startY + row * subSpacingY;
      });
    });

    // Position leaves in dynamic grid based on count for scalability
    const group = {};
    nodes.forEach(function(n) {
      if (n.type === 'leaf') {
        const key = n.subcluster || 'hub-' + n.cluster;
        if (!group[key]) group[key] = [];
        group[key].push(n.id);
      }
    });
    Object.keys(group).forEach(function(key) {
      const parent = nodeMap[key];
      const list = group[key];
      const leafCount = list.length;
      const cols = Math.max(1, Math.ceil(Math.sqrt(leafCount)));
      const rows = Math.ceil(leafCount / cols);
      const leafSpacingX = isMobile ? 160 : Math.max(220, 220 + (leafCount > 10 ? (leafCount / 10) * 20 : 0)); // Dynamic spacing
      const leafSpacingY = isMobile ? 50 : Math.max(90, 90 + (leafCount > 10 ? (leafCount / 10) * 10 : 0));
      const totalWidth = (cols - 1) * leafSpacingX;
      let startX = parent.x + 100 - totalWidth / 2;
      let startY = parent.y + (parent.type === 'hub' ? gridSpacingY / 2 : subSpacingY) - (rows * leafSpacingY) / 2;
      list.forEach(function(id, idx) {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        nodeMap[id].x = startX + col * leafSpacingX;
        nodeMap[id].y = startY + row * leafSpacingY;
      });
    });
  }

  function resolveCollisionsAndLayout(doneCb) {
    const payload = nodes.map(function(n) { return { id: n.id, x: n.x, y: n.y }; });
    if (workerEnabled && worker) {
      worker.postMessage({ type: 'layout', nodes: payload });
      const onmsg = function(ev) {
        if (ev.data && ev.data.type === 'layout') {
          ev.data.nodes.forEach(function(p) {
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
      enhancedDeterministicResolve(payload);
      payload.forEach(function(p) {
        if (nodeMap[p.id]) {
          nodeMap[p.id].x = p.x;
          nodeMap[p.id].y = p.y;
        }
      });
      if (doneCb) doneCb();
    }
  }

  function enhancedDeterministicResolve(arr) {
    const NODE_W_LOCAL = NODE_W + 20; // Increased buffer
    const NODE_H_LOCAL = NODE_H + 20;
    const iters = 500; // More iterations for better resolution
    const directions = [[1,0], [0,1], [-1,0], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]; // Multi-directional push
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
          const dirIdx = Math.floor(Math.random() * directions.length); // Slight randomness in direction to avoid stuck
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
  }

  function renderNodes() {
    container.innerHTML = '';
    nodes.forEach(function(n, idx) {
      const el = document.createElement('a');
      el.className = 'node-box ' + (n.type === 'root' ? 'root-node' : (n.type === 'hub' || n.type === 'subhub' ? 'intermediate-node' : 'leaf-node'));
      el.href = n.url || '#';
      el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
      el.dataset.id = n.id;
      el.setAttribute('role', 'link');
      el.setAttribute('aria-label', n.title + ' — ' + (n.sub || ''));

      const accent = document.createElement('span');
      accent.className = 'cluster-accent';
      accent.style.background = n.cluster ? (clusters.find(function(c) { return c.id === n.cluster; }).color) : '#fff';
      accent.style.boxShadow = '0 6px 18px ' + hexToRgba(accent.style.background, 0.12);
      el.appendChild(accent);

      const t = document.createElement('span');
      t.className = 'node-title';
      t.textContent = n.title;
      const s = document.createElement('span');
      s.className = 'node-sub';
      s.textContent = n.sub || '';
      el.appendChild(t);
      el.appendChild(s);

      el.addEventListener('mouseenter', function(e) { highlightPath(findPathTo(n.id), 0, true); showTooltip(e, n); });
      el.addEventListener('mouseleave', function() { highlightPath(findPathTo(n.id), 0, false); hideTooltip(); });
      el.addEventListener('touchstart', function(e) { e.preventDefault(); highlightPath(findPathTo(n.id), 0, true); showTooltip(e, n); });
      el.addEventListener('touchend', function() { highlightPath(findPathTo(n.id), 0, false); hideTooltip(); });
      el.addEventListener('click', function(ev) {
        if (!n.url || n.url === '#') {
          ev.preventDefault();
          focusNode(n.id);
        }
      });

      enableNodeDrag(el, n);

      container.appendChild(el);
      n.el = el;

      // Advanced entry animation
      if (animationsEnabled) {
        el.style.opacity = 0;
        el.style.transform = 'scale(0.8) translateY(20px)';
        setTimeout(() => {
          el.classList.add('node-enter');
          el.style.opacity = 1;
          el.style.transform = 'scale(1) translateY(0)';
        }, idx * 20);
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
    mpath.setAttribute('fill', 'rgba(255,255,255,0.18)');
    marker.appendChild(mpath);
    defs.appendChild(marker);

    svg.appendChild(defs);
  }

  function drawEdges(initial) {
    initial = initial || false;
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) svg.appendChild(defs);

    edges.forEach(function([from, to], idx) {
      const f = nodeMap[from], t = nodeMap[to];
      if (!f || !t || !f.el || !t.el) return;
      const parentRect = container.getBoundingClientRect();
      const aRect = f.el.getBoundingClientRect();
      const bRect = t.el.getBoundingClientRect();
      let x1 = aRect.left - parentRect.left + aRect.width / 2;
      let y1 = aRect.top - parentRect.top + aRect.height / 2;
      let x2 = bRect.left - parentRect.left + bRect.width / 2;
      let y2 = bRect.top - parentRect.top + bRect.height / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDx > absDy) {
        x1 = dx > 0 ? aRect.right - parentRect.left : aRect.left - parentRect.left;
        x2 = dx > 0 ? bRect.left - parentRect.left : bRect.right - parentRect.left;
      } else {
        y1 = dy > 0 ? aRect.bottom - parentRect.top : aRect.top - parentRect.top;
        y2 = dy > 0 ? bRect.top - parentRect.top : bRect.bottom - parentRect.top;
      }

      const dist = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) || 1;
      const lift = Math.max(20, dist * 0.15); // Reduced lift for less curve in long distances
      const perpX = - (y2 - y1) / dist * lift;
      const perpY = (x2 - x1) / dist * lift;
      const cx1 = x1 + (x2 - x1) * 0.3 + perpX * 0.6;
      const cy1 = y1 + (y2 - y1) * 0.3 + perpY * 0.6;
      const cx2 = x1 + (x2 - x1) * 0.7 + perpX * 0.4;
      const cy2 = y1 + (y2 - y1) * 0.7 + perpY * 0.4;
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

      if (animationsEnabled) {
        if (initial) {
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          requestAnimationFrame(function() {
            path.classList.add('path-draw-advanced');
            path.style.strokeDashoffset = '0';
            setTimeout(function() { path.classList.remove('path-draw-advanced'); path.classList.add('flow-anim-advanced'); }, 1200);
          });
        } else {
          path.classList.add('flow-anim-advanced');
        }
      } else {
        path.classList.add('flow-anim');
      }
    });
  }

  function highlightPath(path, duration, on) {
    duration = duration || 0;
    on = on || true;
    if (path.length < 2) return;
    const clusterColor = nodeMap[path[path.length - 1]].cluster ? clusters.find(function(c) { return c.id === nodeMap[path[path.length - 1]].cluster; }).color : '#fff';
    const pairs = [];
    for (let i = 0; i < path.length - 1; i++) pairs.push([path[i], path[i + 1]]);
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach(function(p) {
      const from = p.dataset.from, to = p.dataset.to;
      const match = pairs.some(function(pair) { return (pair[0] === from && pair[1] === to) || (pair[0] === to && pair[1] === from); });
      if (match) {
        if (on) p.classList.add('flow-highlight-advanced');
        else p.classList.remove('flow-highlight-advanced');
        p.style.stroke = on ? clusterColor : '';
        p.style.opacity = on ? '1' : '';
        if (on && animationsEnabled) p.classList.add('path-pulse-advanced');
        else p.classList.remove('path-pulse-advanced');
      } else {
        p.style.opacity = on ? '0.1' : '';
      }
    });
    if (duration > 0) {
      setTimeout(function() {
        svgpaths.forEach(function(p) { p.classList.remove('flow-highlight-advanced'); p.style.stroke = ''; p.style.opacity = ''; p.classList.remove('path-pulse-advanced'); });
      }, duration);
    }
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);
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
    if (animationsEnabled) tooltip.classList.add('tooltip-fade-in');
  }
  function hideTooltip() { 
    tooltip.style.display = 'none'; 
    tooltip.classList.remove('tooltip-fade-in');
  }

  function fitCanvas(padding) {
    padding = padding || PADDING * 2; // Increased padding for larger graphs
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(function(n) {
      if (!n.el) return;
      const left = n.x || parseFloat(n.el.style.left || 0);
      const top = n.y || parseFloat(n.el.style.top || 0);
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + (n.el.offsetWidth || NODE_W));
      maxY = Math.max(maxY, top + (n.el.offsetHeight || NODE_H));
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
    nodes.forEach(function(n) {
      if (!n.el) return;
      n.x = (n.x || parseFloat(n.el.style.left || 0)) + offsetX;
      n.y = (n.y || parseFloat(n.el.style.top || 0)) + offsetY;
      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
    });

    drawEdges(false);

    const headerHeight = document.querySelector('.map-header')?.offsetHeight || 60;
    stage.style.height = (window.innerHeight - headerHeight - 80) + 'px';

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScaleW = (stageW - 10) / width;
    const fitScaleH = (stageH - 10) / height;
    const fitScale = Math.min(1, fitScaleW, fitScaleH) * 0.8; // Slightly zoom out for large graphs
    setScale(fitScale);
    stage.scrollLeft = Math.max(0, (width * fitScale - stageW) / 2);
    stage.scrollTop = Math.max(0, (height * fitScale - stageH) / 2);
  }

  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if (!n || !n.el) return;
    const cx = n.x + (n.el.offsetWidth || NODE_W) / 2;
    const cy = n.y + (n.el.offsetHeight || NODE_H) / 2;
    setScale(Math.min(1.12, Math.max(0.7, 1.0)));
    stage.scrollTo({ left: Math.max(0, cx * scale - stage.clientWidth / 2), top: Math.max(0, cy * scale - stage.clientHeight / 2), behavior: 'smooth' });
    highlightPath(findPathTo(nodeId), 1400);
    if (animationsEnabled) n.el.classList.add('node-focus-pulse');
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

  let activeCluster = null;
  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach(function(c) {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = c.color;
      const label = document.createElement('div');
      label.textContent = c.label;
      item.appendChild(sw);
      item.appendChild(label);
      item.addEventListener('click', function() { toggleCluster(c.id); });
      legendEl.appendChild(item);
    });
  }
  function toggleCluster(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    nodes.forEach(function(n) {
      if (!n.el) return;
      if (activeCluster && n.type !== 'root' && n.cluster !== activeCluster) n.el.style.opacity = '0.24';
      else n.el.style.opacity = '';
    });
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach(function(p) {
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
    const flat = nodes.map(function(n) { return { id: n.id, title: n.title, sub: n.sub }; });
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
      const matches = flat.filter(function(it) { return it.title.toLowerCase().includes(val) || (it.sub || '').toLowerCase().includes(val); });
      matches.slice(0, 10).forEach(function(m) {
        const item = document.createElement('div');
        item.innerHTML = '<strong>' + escapeHtml(m.title) + '</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">' + escapeHtml(m.sub || '') + '</div>';
        item.addEventListener('click', function() { searchInput.value = m.title; closeAllLists(); focusNode(m.id); });
        list.appendChild(item);
      });
    });
    searchInput.addEventListener('keydown', function(e) {
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
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target)) closeAllLists();
    });
    function closeAllLists() {
      const items = document.getElementsByClassName('autocomplete-items');
      for (let i = items.length - 1; i >= 0; i--) items[i].parentNode.removeChild(items[i]);
    }
  }

  function renderProblemButtons() {
    problemButtons.innerHTML = '';
    problems.forEach(function(p) {
      const btn = document.createElement('button');
      btn.textContent = p.title;
      btn.title = p.sub || '';
      btn.addEventListener('click', function() { focusNode(p.id); });
      problemButtons.appendChild(btn);
    });
  }

  function enableNodeDrag(el, n) {
    let isDragging = false;
    let startX, startY;
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      startX = (e.clientX || e.touches[0].clientX) / scale - n.x;
      startY = (e.clientY || e.touches[0].clientY) / scale - n.y;
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      n.x = (e.clientX || e.touches[0].clientX) / scale - startX;
      n.y = (e.clientY || e.touches[0].clientY) / scale - startY;
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      drawEdges(false);
    }

    function endDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
      resolveCollisionsAndLayout(() => {
        fitCanvas(PADDING);
      });
    }
  }

  if (isMobile) {
    let initialDistance = 0;
    let initialScale = 1;
    stage.addEventListener('touchstart', function(e) {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialScale = scale;
      }
    }, { passive: false });
    stage.addEventListener('touchmove', function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        setScale(Math.max(0.4, Math.min(2.0, initialScale * (distance / initialDistance)))); // Wider zoom range
      }
    }, { passive: false });
  }

  (function enablePan() {
    let isDown = false, startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;
    stage.addEventListener('mousedown', function(e) {
      if (e.target.closest('.node-box')) return;
      isDown = true;
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      stage.classList.add('dragging');
    });
    window.addEventListener('mouseup', function() {
      isDown = false;
      stage.classList.remove('dragging');
    });
    window.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      stage.scrollLeft = scrollLeft + (startX - x);
      stage.scrollTop = scrollTop + (startY - y);
    });
    stage.addEventListener('wheel', function(e) {
      if (e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  })();

  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale})`;
    svg.style.transform = `scale(${scale})`;
    drawEdges(false);
  }

  document.getElementById('zoom-in').addEventListener('click', function() { setScale(Math.min(2.0, scale + 0.12)); });
  document.getElementById('zoom-out').addEventListener('click', function() { setScale(Math.max(0.4, scale - 0.12)); });
  document.getElementById('reset-view').addEventListener('click', function() {
    setScale(1);
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
    nodes.forEach(function(n) { if (n.el) n.el.style.opacity = ''; });
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(function(p) { p.style.opacity = ''; });
    activeCluster = null;
    computeGuidedPositions();
    resolveCollisionsAndLayout(function() {
      fitCanvas(PADDING);
      drawEdges(false);
    });
  });

  useWorkerBtn.addEventListener('click', function() {
    if (!window.Worker) { alert('Web Worker not supported in this browser.'); return; }
    if (workerEnabled) {
      workerEnabled = false;
      useWorkerBtn.textContent = 'Use Worker';
      if (worker) { worker.terminate(); worker = null; }
    } else {
      try {
        worker = new Worker('/scripts/leetree-worker.js');
        workerEnabled = true;
        useWorkerBtn.textContent = 'Worker ON';
        worker.postMessage({ type: 'init' });
      } catch (err) {
        console.error('Worker spawn failed', err);
        alert('Failed to start worker');
        workerEnabled = false;
        useWorkerBtn.textContent = 'Use Worker';
      }
    }
  });

  autoLayoutBtn.addEventListener('click', function() {
    computeGuidedPositions();
    resolveCollisionsAndLayout(function() {
      nodes.forEach(function(n) {
        if (!n.el) return;
        n.el.style.left = (n.x || 0) + 'px';
        n.el.style.top = (n.y || 0) + 'px';
      });
      drawEdges(false);
      fitCanvas(PADDING);
    });
  });

  toggleAnimBtn.addEventListener('click', function() {
    animationsEnabled = !animationsEnabled;
    toggleAnimBtn.textContent = animationsEnabled ? 'Animations ON' : 'Animations OFF';
    drawEdges(false);
  });

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }
  function hexToRgba(hex, a) {
    a = a || 1;
    const h = hex.replace('#', '');
    const bi = parseInt(h, 16);
    return 'rgba(' + ((bi >> 16) & 255) + ',' + ((bi >> 8) & 255) + ',' + (bi & 255) + ',' + a + ')';
  }

  function boot() {
    buildGraph();
    computeGuidedPositions();
    renderNodes();
    setupSvgDefs();
    resolveCollisionsAndLayout(function() {
      nodes.forEach(function(n) {
        if (!n.el) return;
        n.el.style.left = (n.x || 0) + 'px';
        n.el.style.top = (n.y || 0) + 'px';
      });
      drawEdges(true);
      fitCanvas(PADDING);
    });
    renderLegend();
    initSearch();
    renderProblemButtons();
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        computeGuidedPositions();
        resolveCollisionsAndLayout(function() {
          fitCanvas(PADDING);
          drawEdges(false);
        });
      }, 200);
    });
  }

  boot();

  window.Leetree = {
    focusNode: focusNode,
    addProblem: function(p) {
      problems.push(p);
      nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url || '#', type: 'leaf', cluster: p.cluster, subcluster: p.subcluster });
      const target = p.subcluster ? p.subcluster : 'hub-' + p.cluster;
      edges.push([target, p.id]);
      nodeMap[p.id] = nodes.find(function(n) { return n.id === p.id; });
      computeGuidedPositions();
      resolveCollisionsAndLayout(function() {
        renderNodes();
        setupSvgDefs();
        drawEdges(true);
        fitCanvas(PADDING);
        renderProblemButtons();
      });
    },
    toggleWorker: function(enable) { useWorkerBtn.click(); }
  };
})();
