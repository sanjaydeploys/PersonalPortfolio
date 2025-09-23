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
    window.LeetreeRender.renderNodes(true);
    window.LeetreeRender.setupSvgDefs();
    window.LeetreeLayout.resolveCollisionsAndLayout(() => {
      nodes.forEach((n) => {
        if (!n.el) return;
        n.el.style.left = (n.x || 0) + 'px';
        n.el.style.top = (n.y || 0) + 'px';
      });
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

  window.Leetree.toggleWorker = function(enable) {
    const useWorker = document.getElementById('use-worker');
    if (useWorker) useWorker.click();
  };

  start();
})();
