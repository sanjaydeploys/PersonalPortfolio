// leetree.js  (vanilla JS)
// Responsible for rendering nodes & flow lines, pan/drag, zoom, tooltips, arrow animations
(function () {
  // CONFIG: nodes and edges. Add more nodes here programmatically.
  // Each node: id, x, y (canvas coords), title, subtitle, url, type (root/intermediate/leaf)
  const nodes = [
    { id: 'root', x: 1600, y: 60, title: 'DSA / Patterns', subtitle: 'Start here', url: '#', type: 'root' },

    // SUM & PAIR branch
    { id: 'sum', x: 1200, y: 220, title: 'SUM & PAIR', subtitle: 'Two-sum family', url: '#', type: 'intermediate' },
    { id: 'two1', x: 1000, y: 380, title: 'Two Sum (LC1)', subtitle: 'Hash map / indices', url: 'https://sanjay-patidar.vercel.app/two-sum-pattern', type: 'leaf' },
    { id: 'two2', x: 1200, y: 380, title: 'Two Sum II (LC167)', subtitle: 'Two-pointers (sorted)', url: 'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', type: 'leaf' },
    { id: '3sum', x: 1400, y: 380, title: '3Sum (LC15)', subtitle: 'k-sum family', url: 'https://sanjay-patidar.vercel.app/three-sum', type: 'leaf' },
    { id: '3closest', x: 1600, y: 520, title: '3Sum Closest (LC16)', subtitle: 'closest target', url: 'https://sanjay-patidar.vercel.app/three-sum-closest', type: 'leaf' },

    // Sliding window branch
    { id: 'window', x: 2000, y: 220, title: 'SLIDING WINDOW', subtitle: 'Fixed & variable', url: '#', type: 'intermediate' },
    { id: 'anagram', x: 1880, y: 380, title: 'Anagrams (LC438)', subtitle: 'Fixed window', url: 'https://sanjay-patidar.vercel.app/find-all-anagrams', type: 'leaf' },
    { id: 'minwindow', x: 2120, y: 380, title: 'Min Window (LC76)', subtitle: 'Variable window', url: 'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', type: 'leaf' },

    // Prefix
    { id: 'prefix', x: 2400, y: 220, title: 'PREFIX SUM', subtitle: 'Prefix & subarray', url: '#', type: 'intermediate' },
    { id: 'pref1', x: 2320, y: 380, title: 'Prefix Sum (LC560)', subtitle: 'Cum sum maps', url:'#', type:'leaf' },

    // Backtracking
    { id: 'back', x: 800, y: 220, title: 'BACKTRACKING', subtitle: 'Permutations/combos', url: '#', type: 'intermediate' },
    { id: 'perm', x: 680, y: 380, title: 'Permutations (LC46)', subtitle: 'Recursive tree', url:'#', type:'leaf' },
    { id: 'subs', x: 920, y: 380, title: 'Subsets (LC78)', subtitle: 'Decision tree', url:'#', type:'leaf' },

    // DP branch
    { id: 'dp', x: 2800, y: 220, title: 'DYNAMIC PROGRAMMING', subtitle:'1D/2D patterns', url:'#', type:'intermediate' },
    { id: 'dp1', x: 2720, y: 380, title: 'Climbing (LC70)', subtitle:'1D DP', url:'#', type:'leaf' },
    { id: 'dp2', x: 2920, y: 380, title: 'House Robber (LC198)', subtitle:'1D DP', url:'#', type:'leaf' },

    // Graph branch
    { id: 'graph', x: 3200, y: 220, title: 'GRAPH', subtitle:'BFS/DFS basics', url:'#', type:'intermediate' },
    { id: 'islands', x: 3080, y: 380, title: 'Islands (LC200)', subtitle:'Grid BFS', url:'#', type:'leaf' },
    { id: 'ladder', x: 3320, y: 380, title: 'Word Ladder (LC127)', subtitle:'BFS levels', url:'#', type:'leaf' }
  ];

  // Edges: [fromId, toId, options]
  const edges = [
    ['root','sum'], ['root','window'], ['root','prefix'], ['root','back'], ['root','dp'], ['root','graph'],
    ['sum','two1'], ['sum','two2'], ['sum','3sum'],
    ['3sum','3closest'],
    ['window','anagram'], ['window','minwindow'],
    ['prefix','pref1'],
    ['back','perm'], ['back','subs'],
    ['dp','dp1'], ['dp','dp2'],
    ['graph','islands'], ['graph','ladder']
  ];

  // DOM refs
  const svg = document.getElementById('tree-svg');
  const container = document.getElementById('tree-nodes');
  const stage = document.getElementById('tree-stage');

  // create node elements
  const nodeMap = {};
  nodes.forEach(n => {
    const el = document.createElement('a');
    el.className = n.type === 'root' ? 'root-node' : (n.type === 'intermediate' ? 'intermediate-node' : 'leaf-node');
    el.href = n.url || '#';
    el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
    el.style.left = (n.x) + 'px';
    el.style.top = (n.y) + 'px';
    el.dataset.id = n.id;
    el.innerHTML = `<span class="node-title">${n.title}</span><span class="node-sub">${n.subtitle}</span>`;
    el.addEventListener('mouseenter', (e) => showTooltip(e, n));
    el.addEventListener('mouseleave', hideTooltip);
    container.appendChild(el);
    nodeMap[n.id] = { node: n, el: el };
  });

  // draw edges as curved Bezier paths
  function drawEdges() {
    svg.innerHTML = ''; // clear
    edges.forEach(([fromId, toId]) => {
      const a = nodeMap[fromId].el.getBoundingClientRect();
      const b = nodeMap[toId].el.getBoundingClientRect();
      // coordinates relative to container
      const parentRect = container.getBoundingClientRect();
      const x1 = a.left - parentRect.left + (a.width/2);
      const y1 = a.top - parentRect.top + (a.height/2);
      const x2 = b.left - parentRect.left + (b.width/2);
      const y2 = b.top - parentRect.top + (b.height/2);

      // control points for smooth curve (angled diagonal look)
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cx1 = x1 + dx * 0.25;
      const cy1 = y1 - Math.max(80, Math.abs(dx)*0.12) ; // lift up
      const cx2 = x1 + dx * 0.75;
      const cy2 = y2 - Math.max(40, Math.abs(dx)*0.08);

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-line flow-anim');
      svg.appendChild(path);

      // arrowhead: small triangle marker
      const arrow = document.createElementNS('http://www.w3.org/2000/svg','path');
      const arrD = `M ${x2-8} ${y2-6} L ${x2} ${y2} L ${x2-8} ${y2+6}`;
      arrow.setAttribute('d', arrD);
      arrow.setAttribute('class', 'flow-arrow');
      svg.appendChild(arrow);
    });
  }

  // show tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);
  function showTooltip(e, n) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<strong>${n.title}</strong><div style="font-size:12px;opacity:0.9;margin-top:6px;">${n.subtitle}</div>
      <div style="margin-top:6px;font-size:11px;opacity:0.8;">Click to open: ${n.url && n.url!=='#' ? n.url : 'demo / placeholder'}</div>`;
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + window.scrollX + 12) + 'px';
    tooltip.style.top = (rect.top + window.scrollY - 8) + 'px';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }

  // pan/drag controls for tree-stage (click/drag to pan)
  (function enableDragPan() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e) => {
      isDown=true;
      stage.classList.add('dragging');
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      e.preventDefault();
    });
    window.addEventListener('mouseup', ()=>{ isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e)=> {
      if(!isDown) return;
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      const walkX = (startX - x);
      const walkY = (startY - y);
      stage.scrollLeft = scrollLeft + walkX;
      stage.scrollTop = scrollTop + walkY;
    });
    // wheel horizontal scroll
    stage.addEventListener('wheel', (e)=> {
      if(Math.abs(e.deltaX) > 0) return; // let normal horizontal scroll through
      if (e.shiftKey) { /* allow default */ }
      else { stage.scrollLeft += e.deltaY; e.preventDefault(); }
    }, { passive:false });
  })();

  // zoom controls (scale the node container & svg)
  let scale = 1;
  const MIN_SCALE = 0.6, MAX_SCALE = 1.6;
  document.getElementById('zoom-in').addEventListener('click', ()=> setScale(Math.min(MAX_SCALE, scale + 0.12)));
  document.getElementById('zoom-out').addEventListener('click', ()=> setScale(Math.max(MIN_SCALE, scale - 0.12)));
  document.getElementById('reset-view').addEventListener('click', ()=> { setScale(1); stage.scrollLeft = 0; stage.scrollTop = 0; });

  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale}) translateZ(0)`;
    svg.style.transform = `scale(${scale}) translateZ(0)`;
  }

  // initial draw after DOM layout
  function doLayout() {
    // set svg size to cover nodes bounding box
    svg.setAttribute('width', container.style.width || '4000');
    svg.setAttribute('height', container.style.height || '1600');
    drawEdges();
  }

  // redraw when window resizes (recompute positions)
  window.addEventListener('resize', () => { drawEdges(); });

  // initial
  doLayout();

  // expose a function to add nodes/edges programmatically if you want
  window.Leetree = {
    addNode: function(n) { nodes.push(n); /* create element + redraw */ },
    addEdge: function(e) { edges.push(e); drawEdges(); }
  };

})();
