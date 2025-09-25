// leetree-core.js
(function () {
  window.Leetree = window.Leetree || {};
  window.Leetree.initialized = false;

  const isMobile = window.innerWidth < 768;

  // === CLUSTERS (expanded set) ===
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
    { id: 'unionfind', label: 'Union-Find', color: '#ff7bd9' },
    { id: 'tree', label: 'Binary Trees', color: '#ffa67b' },
    { id: 'string', label: 'String Patterns', color: '#7bfffa' },
    { id: 'matrix', label: 'Matrix Problems', color: '#ff7baf' },
    { id: 'math', label: 'Math / Number Theory', color: '#aaff7b' }
  ];

  // === PROBLEMS (expanded set with variety) ===
  const problems = [
    // sum & pairs
    { id: 'two-sum', title: 'Two Sum', sub: 'LC1 — Hash map', url: 'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster: 'sum' },
    { id: 'two-sum-ii', title: 'Two Sum II', sub: 'LC167 — Sorted two-pointer', url: 'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster: 'sum' },
    { id: '4sum-ii', title: '4Sum II', sub: 'LC454 — Hash map extension', url: '#', cluster: 'sum' },

    // two pointers
    { id: '3sum', title: '3Sum', sub: 'LC15 — k-sum', url: 'https://sanjay-patidar.vercel.app/three-sum', cluster: 'twoPointers' },
    { id: '3closest', title: '3Sum Closest', sub: 'LC16 — closest target', url: 'https://sanjay-patidar.vercel.app/three-sum-closest', cluster: 'twoPointers' },
    { id: '4sum', title: '4Sum', sub: 'LC18 — k-sum extension', url: '#', cluster: 'twoPointers' },
    { id: 'container-water', title: 'Container With Most Water', sub: 'LC11 — Two pointers', url: '#', cluster: 'twoPointers' },
    { id: 'trapping-rain', title: 'Trapping Rain Water', sub: 'LC42 — Monotonic stack / two pointers', url: '#', cluster: 'twoPointers' },

    // sliding window
    { id: 'anagram', title: 'Find All Anagrams', sub: 'LC438 — Fixed window', url: 'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster: 'window' },
    { id: 'min-window', title: 'Minimum Window', sub: 'LC76 — Variable window', url: 'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster: 'window' },
    { id: 'sliding-max', title: 'Sliding Window Max', sub: 'LC239 — Monotonic', url: '#', cluster: 'window' },
    { id: 'longest-no-repeat', title: 'Longest Substring Without Repeating', sub: 'LC3 — Variable window', url: '#', cluster: 'window' },
    { id: 'max-consecutive', title: 'Max Consecutive Ones', sub: 'LC1004 — Sliding window', url: '#', cluster: 'window' },

    // prefix / subarray
    { id: 'subarray-sum-k', title: 'Subarray Sum K', sub: 'LC560', url: '#', cluster: 'prefix' },
    { id: 'prefix-sum', title: 'Prefix Sum Techniques', sub: 'prefix-sum', url: '#', cluster: 'prefix' },
    { id: 'continuous-subarray', title: 'Continuous Subarray Sum', sub: 'LC523 — Prefix mod', url: '#', cluster: 'prefix' },
    { id: 'product-except-self', title: 'Product of Array Except Self', sub: 'LC238 — Prefix product', url: '#', cluster: 'prefix' },

    // backtracking
    { id: 'perm', title: 'Permutations', sub: 'LC46', url: '#', cluster: 'backtracking' },
    { id: 'comb-phone', title: 'Letter Combinations', sub: 'LC17', url: '#', cluster: 'backtracking' },
    { id: 'subsets', title: 'Subsets', sub: 'LC78 — Backtracking', url: '#', cluster: 'backtracking' },
    { id: 'word-search', title: 'Word Search', sub: 'LC79 — Backtracking DFS', url: '#', cluster: 'backtracking' },

    // binary search
    { id: 'binary-search', title: 'Binary Search', sub: 'LC33', url: '#', cluster: 'binary' },
    { id: 'search-answer', title: 'Search on Answer', sub: 'LC875', url: '#', cluster: 'binary' },
    { id: 'min-rotated', title: 'Find Minimum in Rotated Sorted Array', sub: 'LC153 — Binary search', url: '#', cluster: 'binary' },

    // dynamic programming
    { id: 'climb', title: 'Climbing Stairs', sub: 'LC70', url: '#', cluster: 'dp', subcluster: 'dp-1d' },
    { id: 'house-robber', title: 'House Robber', sub: 'LC198', url: '#', cluster: 'dp', subcluster: 'dp-1d' },
    { id: 'lis', title: 'Longest Increasing Subsequence', sub: 'LC300 — DP', url: '#', cluster: 'dp', subcluster: 'dp-1d' },
    { id: 'coin-change', title: 'Coin Change', sub: 'LC322 — Unbounded knapsack', url: '#', cluster: 'dp', subcluster: 'dp-2d' },
    { id: 'edit-distance', title: 'Edit Distance', sub: 'LC72 — DP on strings', url: '#', cluster: 'dp', subcluster: 'dp-2d' },
    { id: 'maximal-square', title: 'Maximal Square', sub: 'LC221 — 2D DP', url: '#', cluster: 'dp', subcluster: 'dp-2d' },

    // graph
    { id: 'islands', title: 'Number of Islands', sub: 'LC200', url: '#', cluster: 'graph' },
    { id: 'wordladder', title: 'Word Ladder', sub: 'LC127', url: '#', cluster: 'graph' },
    { id: 'course-schedule', title: 'Course Schedule', sub: 'LC207 — Topo sort', url: '#', cluster: 'graph' },
    { id: 'rotten-oranges', title: 'Rotten Oranges', sub: 'LC994 — BFS', url: '#', cluster: 'graph' },

    // greedy
    { id: 'jump-game', title: 'Jump Game', sub: 'LC55 — Greedy', url: '#', cluster: 'greedy' },
    { id: 'gas-station', title: 'Gas Station', sub: 'LC134 — Greedy', url: '#', cluster: 'greedy' },

    // heap
    { id: 'kth-largest', title: 'Kth Largest Element', sub: 'LC215 — Heap', url: '#', cluster: 'heap' },
    { id: 'merge-k-lists', title: 'Merge K Sorted Lists', sub: 'LC23 — Priority queue', url: '#', cluster: 'heap' },

    // trie
    { id: 'word-dictionary', title: 'Implement Trie', sub: 'LC208 — Trie', url: '#', cluster: 'trie' },
    { id: 'longest-word', title: 'Longest Word in Dictionary', sub: 'LC720 — Trie', url: '#', cluster: 'trie' },

    // union-find
    { id: 'provinces', title: 'Number of Provinces', sub: 'LC547 — Union-Find', url: '#', cluster: 'unionfind' },
    { id: 'redundant-connection', title: 'Redundant Connection', sub: 'LC684 — Union-Find cycle', url: '#', cluster: 'unionfind' },

    // tree
    { id: 'max-depth', title: 'Maximum Depth of Binary Tree', sub: 'LC104', url: '#', cluster: 'tree' },
    { id: 'path-sum', title: 'Path Sum', sub: 'LC112', url: '#', cluster: 'tree' },
    { id: 'lowest-common-ancestor', title: 'Lowest Common Ancestor', sub: 'LC236', url: '#', cluster: 'tree' },

    // string
    { id: 'palindrome-partition', title: 'Palindrome Partitioning', sub: 'LC131', url: '#', cluster: 'string' },
    { id: 'longest-palindrome', title: 'Longest Palindromic Substring', sub: 'LC5', url: '#', cluster: 'string' },
    { id: 'regex-match', title: 'Regular Expression Matching', sub: 'LC10', url: '#', cluster: 'string' },

    // matrix
    { id: 'spiral-matrix', title: 'Spiral Matrix', sub: 'LC54', url: '#', cluster: 'matrix' },
    { id: 'rotate-image', title: 'Rotate Image', sub: 'LC48', url: '#', cluster: 'matrix' },
    { id: 'set-matrix-zeroes', title: 'Set Matrix Zeroes', sub: 'LC73', url: '#', cluster: 'matrix' },

    // math
    { id: 'happy-number', title: 'Happy Number', sub: 'LC202', url: '#', cluster: 'math' },
    { id: 'powx-n', title: 'Pow(x, n)', sub: 'LC50', url: '#', cluster: 'math' },
    { id: 'gcd', title: 'Greatest Common Divisor', sub: 'Euclid algo', url: '#', cluster: 'math' }
  ];

  problems.sort((a, b) => a.title.localeCompare(b.title));

  // === GRAPH BUILDING ===
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

    // root node
    nodes.push({ id: 'root', title: 'DSA / Patterns', sub: 'Start here', url: '#', type: 'root', cluster: null });

    // hubs
    clusters.forEach((c) => {
      nodes.push({ id: 'hub-' + c.id, title: c.label, sub: 'pattern hub', url: '#', type: 'hub', cluster: c.id });
      edges.push(['root', 'hub-' + c.id]);
    });

    // subhubs
    const subhubs = [
      { id: 'dp-1d', title: '1D DP', sub: 'Linear sequences', url: '#', type: 'subhub', cluster: 'dp' },
      { id: 'dp-2d', title: '2D DP', sub: 'Matrices / Multi-var', url: '#', type: 'subhub', cluster: 'dp' },
      { id: 'graph-bfs', title: 'BFS Patterns', sub: 'Level order', url: '#', type: 'subhub', cluster: 'graph' },
      { id: 'graph-dfs', title: 'DFS Patterns', sub: 'Recursion', url: '#', type: 'subhub', cluster: 'graph' },
      { id: 'backtrack-comb', title: 'Combinations', sub: 'Choices', url: '#', type: 'subhub', cluster: 'backtracking' },
      { id: 'backtrack-perm', title: 'Permutations', sub: 'Swaps', url: '#', type: 'subhub', cluster: 'backtracking' },
      { id: 'tree-traversals', title: 'Tree Traversals', sub: 'DFS / BFS', url: '#', type: 'subhub', cluster: 'tree' },
      { id: 'string-search', title: 'String Search', sub: 'KMP, Rabin-Karp', url: '#', type: 'subhub', cluster: 'string' }
    ];
    subhubs.forEach((sh) => {
      nodes.push(sh);
      edges.push(['hub-' + sh.cluster, sh.id]);
    });

    // problems
    problems.forEach((p) => {
      nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url || '#', type: 'leaf', cluster: p.cluster, subcluster: p.subcluster });
      const target = p.subcluster ? p.subcluster : 'hub-' + p.cluster;
      edges.push([target, p.id]);
    });

    // creative cross connections
    edges.push(['sliding-max', 'prefix-sum']);
    edges.push(['trapping-rain', 'sliding-max']);
    edges.push(['word-search', 'graph-dfs']);
    edges.push(['wordladder', 'graph-bfs']);
    edges.push(['merge-k-lists', 'kth-largest']);
    edges.push(['3sum', 'two-sum']);
    edges.push(['coin-change', 'climb']);
    edges.push(['edit-distance', 'longest-palindrome']);
    edges.push(['regex-match', 'string-search']);
    edges.push(['rotate-image', 'spiral-matrix']);
    edges.push(['set-matrix-zeroes', 'maximal-square']);
    edges.push(['path-sum', 'lowest-common-ancestor']);
    edges.push(['powx-n', 'binary-search']);
    edges.push(['happy-number', 'gcd']);

    nodes.forEach((n) => { nodeMap[n.id] = n; });

    window.Leetree.initialized = true;
  }

  // === BOOTSTRAP ===
  function boot() {
    if (!window.Leetree.initialized) {
      console.error('boot: Graph not initialized');
      return;
    }
    window.LeetreeLayout.computeGuidedPositions();
    window.LeetreeLayout.resolveCollisionsAndLayout(() => {
      window.LeetreeRender.renderNodes(true);
      window.LeetreeRender.setupSvgDefs();
      window.LeetreeRender.drawEdges(true);
      window.LeetreeUtils.fitCanvas(PADDING);
    });
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

  // add problem dynamically
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



window.Leetree = window.Leetree || {};
window.LeetreeLayout = (function () {
  const nodes = window.Leetree.nodes || [];
  const edges = window.Leetree.edges || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const isMobile = window.Leetree.isMobile;

  function computeGuidedPositions() {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    // Extremely tight column widths to eliminate left-side gap
    const columnWidths = [viewWidth * 0.05, viewWidth * 0.2, viewWidth * 0.75];
    const hubRowSpacing = isMobile ? 20 : 40;
    const subhubSpacing = isMobile ? 12 : 25;
    const leafSpacing = isMobile ? 10 : 20;
    const margin = isMobile ? 2 : 5;

    // Reset positions
    nodes.forEach(n => { n.x = undefined; n.y = undefined; });

    // Column 1: Root centered vertically, as close to left edge as possible
    const root = nodeMap['root'];
    if (!root) return;
    root.x = margin; // Minimal margin to eliminate left-side gap
    root.y = viewHeight / 2; // Center vertically

    // Column 2: Hubs - Spread evenly around vertical center, constrained to viewport
    const hubs = nodes.filter(n => n.type === 'hub');
    const hubCount = Math.max(1, hubs.length);
    const maxHubHeight = viewHeight - 2 * margin - window.Leetree.NODE_H;
    const hubSpacing = Math.min(hubRowSpacing, maxHubHeight / Math.max(1, hubCount - 1));
    hubs.forEach((h, i) => {
      h.x = columnWidths[0] + columnWidths[1] / 2;
      h.y = root.y + (i - (hubCount - 1) / 2) * hubSpacing;
      // Constrain within viewport
      h.y = Math.max(margin, Math.min(h.y, viewHeight - margin - window.Leetree.NODE_H));
    });

    // Build children map (from edges)
    const childrenMap = {};
    edges.forEach(([from, to]) => {
      if (!childrenMap[from]) childrenMap[from] = [];
      childrenMap[from].push(to);
    });

    // Column 2+: Subhubs - Position to the right of hubs, centered vertically around parent
    const subhubs = nodes.filter(n => n.type === 'subhub');
    subhubs.forEach(sh => {
      const parent = nodeMap['hub-' + sh.cluster];
      if (!parent) {
        sh.x = columnWidths[0] + columnWidths[1] / 2 + subhubSpacing;
        sh.y = root.y;
        return;
      }
      const siblings = subhubs.filter(s => s.cluster === sh.cluster);
      const idx = siblings.findIndex(s => s.id === sh.id);
      const siblingCount = siblings.length || 1;
      const idxNorm = idx - (siblingCount - 1) / 2;
      sh.x = Math.min(parent.x + subhubSpacing, viewWidth - margin - window.Leetree.NODE_W);
      sh.y = parent.y + idxNorm * Math.max(5, subhubSpacing * 0.2);
      // Constrain within viewport
      sh.y = Math.max(margin, Math.min(sh.y, viewHeight - margin - window.Leetree.NODE_H));
    });

    // Column 3: Leaves - Compact grid placement centered around parent
    function placeChildren(parentId) {
      const parent = nodeMap[parentId];
      if (!parent) return;
      const children = (childrenMap[parentId] || []).filter(c => nodeMap[c] && nodeMap[c].type === 'leaf');
      if (!children.length) return;
      const cols = Math.min(5, Math.ceil(Math.sqrt(children.length))); // Up to 5 columns for maximum compactness
      const rows = Math.ceil(children.length / cols);
      const colSpacing = Math.min((viewWidth - columnWidths[0] - columnWidths[1] - 2 * margin) / cols, columnWidths[2] / (cols + 1));
      const rowSpacing = Math.min(leafSpacing, (viewHeight - 2 * margin - window.Leetree.NODE_H) / (rows + 1));
      const startX = columnWidths[0] + columnWidths[1] + margin;
      const blockHeight = rows * rowSpacing;
      const startY = parent.y - blockHeight / 2 + rowSpacing / 2;
      children.forEach((childId, i) => {
        const child = nodeMap[childId];
        if (!child) return;
        if (child.x !== undefined) return;
        const col = i % cols;
        const row = Math.floor(i / cols);
        child.x = Math.min(startX + (col + 0.5) * colSpacing, viewWidth - margin - window.Leetree.NODE_W);
        child.y = startY + row * rowSpacing;
        // Constrain within viewport
        child.y = Math.max(margin, Math.min(child.y, viewHeight - margin - window.Leetree.NODE_H));
      });
    }

    // Place leaves for hubs and subhubs
    nodes.filter(n => n.type === 'hub' || n.type === 'subhub').forEach(p => placeChildren(p.id));

    // Handle cross-edges and unpositioned leaves
    edges.forEach(([from, to]) => {
      const child = nodeMap[to];
      if (!child || child.x !== undefined || child.type !== 'leaf') return;
      const parent = nodeMap[from] || nodeMap['hub-' + (child.cluster || '')] || root;
      const randXRange = columnWidths[2] * 0.05;
      child.x = Math.min(parent.x + margin + columnWidths[1] * 0.08 + (Math.random() - 0.5) * randXRange, viewWidth - margin - window.Leetree.NODE_W);
      child.y = parent.y + (Math.random() - 0.5) * leafSpacing;
      // Constrain within viewport
      child.y = Math.max(margin, Math.min(child.y, viewHeight - margin - window.Leetree.NODE_H));
    });

    // Ensure all nodes have positions
    nodes.forEach(n => {
      if (n.x === undefined || n.y === undefined) {
        n.x = columnWidths[0] + columnWidths[1] / 2;
        n.y = root.y;
        n.x = Math.max(margin, Math.min(n.x, viewWidth - margin - window.Leetree.NODE_W));
        n.y = Math.max(margin, Math.min(n.y, viewHeight - margin - window.Leetree.NODE_H));
      }
    });

    // Compress layout if it exceeds viewport bounds
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if (typeof n.x === 'number' && typeof n.y === 'number') {
        minX = Math.min(minX, n.x);
        maxX = Math.max(maxX, n.x + window.Leetree.NODE_W);
        minY = Math.min(minY, n.y);
        maxY = Math.max(maxY, n.y + window.Leetree.NODE_H);
      }
    });
    const layoutWidth = maxX - minX;
    const layoutHeight = maxY - minY;
    const maxWidth = viewWidth - 2 * margin;
    const maxHeight = viewHeight - 2 * margin;
    if (layoutWidth > maxWidth || layoutHeight > maxHeight) {
      const scaleX = maxWidth / layoutWidth;
      const scaleY = maxHeight / layoutHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      nodes.forEach(n => {
        if (typeof n.x === 'number' && typeof n.y === 'number') {
          n.x = margin + (n.x - minX) * scale;
          n.y = margin + (n.y - minY) * scale;
        }
      });
    }
  }

  function resolveCollisionsAndLayout(callback) {
    const nodeW = window.Leetree.NODE_W * 1.01; // Minimal padding for tightest fit
    const nodeH = window.Leetree.NODE_H * 1.01;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const margin = isMobile ? 2 : 5;
    const arr = nodes.map(n => ({ id: n.id, x: n.x || 0, y: n.y || 0 }));

    if (window.Leetree.workerEnabled && window.Leetree.worker) {
      window.Leetree.worker.postMessage({ type: 'layout', nodes: arr, nodeW, nodeH });
      window.Leetree.worker.onmessage = (ev) => {
        if (ev.data.type === 'layout') {
          ev.data.nodes.forEach(pos => {
            const n = nodeMap[pos.id];
            if (n) {
              n.x = Math.max(margin, Math.min(pos.x, viewWidth - margin - nodeW));
              n.y = Math.max(margin, Math.min(pos.y, viewHeight - margin - nodeH));
            }
          });
          callback();
        }
      };
    } else {
      const iters = 100; // Minimal iterations for performance
      for (let it = 0; it < iters; it++) {
        let moved = false;
        arr.sort((a, b) => a.x - b.x || a.y - b.y);
        for (let i = 0; i < arr.length; i++) {
          const a = arr[i];
          for (let j = i + 1; j < arr.length; j++) {
            const b = arr[j];
            if (b.x - a.x > nodeW * 1.1) break; // Very tight break condition
            const overlapX = Math.min(a.x + nodeW, b.x + nodeW) - Math.max(a.x, b.x);
            const overlapY = Math.min(a.y + nodeH, b.y + nodeH) - Math.max(a.y, b.y);
            if (overlapX > 0 && overlapY > 0) {
              const push = Math.min(overlapX, overlapY) / 2 + 1;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const bias = Math.abs(dy) > Math.abs(dx) ? 1.02 : 1;
              a.x -= (dx / dist) * push * bias;
              a.y -= (dy / dist) * push * bias;
              b.x += (dx / dist) * push * bias;
              b.y += (dy / dist) * push * bias;
              // Constrain within viewport
              a.x = Math.max(margin, Math.min(a.x, viewWidth - margin - nodeW));
              a.y = Math.max(margin, Math.min(a.y, viewHeight - margin - nodeH));
              b.x = Math.max(margin, Math.min(b.x, viewWidth - margin - nodeW));
              b.y = Math.max(margin, Math.min(b.y, viewHeight - margin - nodeH));
              moved = true;
            }
          }
        }
        if (!moved) break;
      }
      arr.forEach(pos => {
        const n = nodeMap[pos.id];
        if (n) {
          n.x = Math.max(margin, Math.min(pos.x, viewWidth - margin - nodeW));
          n.y = Math.max(margin, Math.min(pos.y, viewHeight - margin - nodeH));
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

      el.style.left = (n.x || 0) + 'px';
      el.style.top = (n.y || 0) + 'px';

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
      const curveFactor = dist * 0.12;
      const perpX = -dy / dist * curveFactor;
      const perpY = dx / dist * curveFactor;
      const cx1 = x1 + dx * 0.35 + perpX * 0.55;
      const cy1 = y1 + dy * 0.35 + perpY * 0.55;
      const cx2 = x1 + dx * 0.65 + perpX * 0.45;
      const cy2 = y1 + dy * 0.65 + perpY * 0.45;
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
    const fitScaleW = stageW / width;
    const fitScaleH = stageH / height;
    const fitScale = Math.min(fitScaleW, fitScaleH);
    setScale(fitScale);
    stage.scrollLeft = 0;
    stage.scrollTop = 0;
  }

  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if (!n || !n.el) return;
    const cx = n.x + (n.el.offsetWidth || window.Leetree.NODE_W) / 2;
    const cy = n.y + (n.el.offsetHeight || window.Leetree.NODE_H) / 2;
    setScale(Math.min(1.2, Math.max(0.6, 0.9)));
    stage.scrollTo({ left: Math.max(0, cx * window.Leetree.scale - stage.clientWidth / 2), top: Math.max(0, cy * window.Leetree.scale - stage.clientHeight / 2), behavior: window.Leetree.animationsEnabled ? 'smooth' : 'auto' });
    let pairs = [];
    if (n.type === 'hub' || n.type === 'subhub') {
      pairs = getSubtreeEdges(nodeId);
    } else {
      const path = findPathTo(nodeId);
      for (let i = 0; i < path.length - 1; i++) {
        pairs.push([path[i], path[i+1]]);
      }
    }
    highlightPath(pairs, 1400, true);
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

  function getSubtreeEdges(nodeId) {
    const subtreeEdges = [];
    const stack = [nodeId];
    const visited = new Set();
    while (stack.length) {
      const current = stack.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      edges.forEach(([from, to]) => {
        if (from === current) {
          subtreeEdges.push([from, to]);
          stack.push(to);
        } else if (to === current) {
          subtreeEdges.push([to, from]);
          stack.push(from);
        }
      });
    }
    // Include path from root to nodeId
    const rootPath = findPathTo(nodeId);
    for (let i = 0; i < rootPath.length - 1; i++) {
      subtreeEdges.push([rootPath[i], rootPath[i+1]]);
    }
    return subtreeEdges;
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
    const toggleAnimations = document.getElementById('toggle-animations');
    const useWorker = document.getElementById('use-worker');

    if (!zoomIn || !zoomOut || !toggleAnimations || !useWorker) {
      console.warn('setupControlListeners: One or more control buttons not found');
      return;
    }

    zoomIn.addEventListener('click', () => setScale(Math.min(1.6, window.Leetree.scale + 0.12)));
    zoomOut.addEventListener('click', () => setScale(Math.max(0.5, window.Leetree.scale - 0.12)));
    toggleAnimations.addEventListener('click', () => {
      window.Leetree.animationsEnabled = !window.Leetree.animationsEnabled;
      toggleAnimations.textContent = `Anim: ${window.Leetree.animationsEnabled ? 'ON' : 'OFF'}`;
      window.dispatchEvent(new Event('leetree:toggleAnimations'));
      window.LeetreeRender.renderNodes(false);
      window.LeetreeRender.drawEdges(false);
      window.LeetreeUtils.fitCanvas(PADDING);
    });
    useWorker.addEventListener('click', () => {
      if (!window.Worker) { alert('Web Worker not supported in this browser.'); return; }
      window.Leetree.workerEnabled = !window.Leetree.workerEnabled;
      useWorker.textContent = `Worker: ${window.Leetree.workerEnabled ? 'ON' : 'OFF'}`;
      if (window.Leetree.workerEnabled) {
        window.Leetree.worker = new Worker('/public/scripts/leetree-worker.js');
        window.Leetree.worker.postMessage({ type: 'init' });
      } else if (window.Leetree.worker) {
        window.Leetree.worker.terminate();
        window.Leetree.worker = null;
      }
    });
  }

  function setScale(s) {
    window.Leetree.scale = s;
    container.style.transform = `scale(${s})`;
    svg.style.transform = `scale(${s})`;
    window.LeetreeRender.drawEdges(false);
  }

  (function enablePan() {
    let isDown = false, startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;
    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('.node-box')) return;
      isDown = true;
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      stage.classList.add('dragging');
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
      stage.classList.remove('dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      stage.scrollLeft = scrollLeft + (startX - x);
      stage.scrollTop = scrollTop + (startY - y);
    });
    stage.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  })();

  if (window.Leetree.isMobile) {
    let initialDistance = 0;
    let initialScale = 1;
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialScale = window.Leetree.scale;
      }
    }, { passive: false });
    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        setScale(Math.max(0.5, Math.min(1.6, initialScale * (distance / initialDistance))));
      }
    }, { passive: false });
  }

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function hexToRgba(hex, a = 1) {
    const h = hex.replace('#', '');
    const bi = parseInt(h, 16);
    return 'rgba(' + ((bi >> 16) & 255) + ',' + ((bi >> 8) & 255) + ',' + (bi & 255) + ',' + a + ')';
  }

  return {
    highlightPath,
    showTooltip,
    hideTooltip,
    fitCanvas,
    focusNode,
    findPathTo,
    toggleCluster,
    initSearch,
    enableNodeDrag,
    escapeHtml,
    hexToRgba,
    setupControlListeners
  };
})();

// leetree-worker.js
self.addEventListener('message', (ev) => {
  const data = ev.data;
  if (!data) return;
  if (data.type === 'init') {
    self.postMessage({ type: 'inited' });
    return;
  }
  if (data.type === 'layout') {
    const arr = data.nodes;
    const nodeW = data.nodeW;
    const nodeH = data.nodeH;
    const iters = 250;
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
            const push = Math.min(overlapX, overlapY) / 2 + 5;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const bias = Math.abs(dy) > Math.abs(dx) ? 1.2 : 1;
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
    self.postMessage({ type: 'layout', nodes: arr });
  }
});
