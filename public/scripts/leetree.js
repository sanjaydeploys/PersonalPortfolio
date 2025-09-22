/* leetree-force.js
   Advanced interactive LeetCode map with:
   - cluster hubs + many problem nodes (auto-populated)
   - guided initial hierarchical placement + force-directed relaxation
   - animated curved SVG arrows (draw-once growth + continuous flow)
   - responsive canvas fit, drag-to-pan, wheel horizontal scroll, zoom
   - search & focus, legend cluster filters
   - accessible minimal attributes
   Save as /scripts/leetree-force.js and include near </body>
*/

/* eslint-disable no-console */
(function () {
  /* ----------------------
     Configuration: clusters + problems
     Add or remove problems here. Keep 'id' unique.
     ---------------------- */
  const clusters = [
    { id: 'sum', label: 'Sum & Pair', color: '#ff7b7b' },
    { id: 'window', label: 'Sliding Window', color: '#7bd1ff' },
    { id: 'prefix', label: 'Prefix / Subarray', color: '#ffd47b' },
    { id: 'twoPointers', label: 'Two Pointers / k-sum', color: '#b6ff7b' },
    { id: 'backtracking', label: 'Backtracking', color: '#cba6ff' },
    { id: 'binary', label: 'Binary Search', color: '#7bffd9' },
    { id: 'dp', label: 'Dynamic Programming', color: '#ffb6e0' },
    { id: 'graph', label: 'Graph', color: '#8fd6ff' }
  ];

  // Representative, reasonably-large problem list (feel free to extend)
  const problems = [
    // SUM & PAIR
    { id:'two-sum', title:'Two Sum', sub:'LC1 — Hash map', url:'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster:'sum' },
    { id:'two-sum-ii', title:'Two Sum II', sub:'LC167 — Two-pointer sorted', url:'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster:'sum' },
    { id:'two-sum-iv', title:'Two Sum IV (BST)', sub:'BST variant', url:'#', cluster:'sum' },
    { id:'3sum', title:'3Sum', sub:'LC15 — k-sum', url:'https://sanjay-patidar.vercel.app/three-sum', cluster:'twoPointers' },
    { id:'3closest', title:'3Sum Closest', sub:'LC16 — closest target', url:'https://sanjay-patidar.vercel.app/three-sum-closest', cluster:'twoPointers' },
    { id:'4sum', title:'4Sum', sub:'LC18 — k-sum extension', url:'#', cluster:'twoPointers' },

    // SLIDING WINDOW
    { id:'anagram', title:'Find All Anagrams', sub:'LC438 — fixed-window', url:'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster:'window' },
    { id:'min-window', title:'Minimum Window', sub:'LC76 — variable window', url:'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster:'window' },
    { id:'sliding-max', title:'Sliding Window Max', sub:'LC239 — monotonic deque', url:'#', cluster:'window' },

    // PREFIX / SUBARRAY
    { id:'subarray-sum-k', title:'Subarray Sum K', sub:'LC560 variant', url:'#', cluster:'prefix' },
    { id:'prefix-sum', title:'Prefix Sum', sub:'prefix-sum techniques', url:'#', cluster:'prefix' },

    // BACKTRACKING
    { id:'perm', title:'Permutations', sub:'LC46', url:'#', cluster:'backtracking' },
    { id:'comb-phone', title:'Letter Combinations', sub:'LC17', url:'#', cluster:'backtracking' },
    { id:'subsets', title:'Subsets', sub:'LC78', url:'#', cluster:'backtracking' },
    { id:'combination-sum', title:'Combination Sum', sub:'LC39', url:'#', cluster:'backtracking' },

    // BINARY SEARCH
    { id:'binary-search', title:'Binary Search', sub:'classic / LC33', url:'#', cluster:'binary' },
    { id:'search-on-answer', title:'Search on Answer', sub:'LC875', url:'#', cluster:'binary' },

    // DP
    { id:'climb', title:'Climbing Stairs', sub:'LC70 1D DP', url:'#', cluster:'dp' },
    { id:'house-robber', title:'House Robber', sub:'LC198', url:'#', cluster:'dp' },
    { id:'lis', title:'LIS', sub:'LC300', url:'#', cluster:'dp' },
    { id:'coin-change', title:'Coin Change', sub:'LC322', url:'#', cluster:'dp' },

    // GRAPH
    { id:'islands', title:'Number of Islands', sub:'LC200', url:'#', cluster:'graph' },
    { id:'wordladder', title:'Word Ladder', sub:'LC127', url:'#', cluster:'graph' },
    { id:'clone-graph', title:'Clone Graph', sub:'LC133', url:'#', cluster:'graph' },
    { id:'provinces', title:'Number of Provinces', sub:'LC547', url:'#', cluster:'graph' }
  ];

  /* -------------------------
     Derived node / edge arrays for the UI
  -------------------------*/
  const nodes = []; // will be populated: root + hub nodes + problem nodes
  const edges = []; // directed pairs [fromId, toId]

  // create root node
  nodes.push({ id:'root', title:'DSA / Patterns', sub:'Start here', type:'root', cluster:null });

  // create cluster hub nodes and link root->hub
  clusters.forEach(c => {
    const hubId = 'hub-'+c.id;
    nodes.push({ id: hubId, title: c.label, sub:'pattern hub', type:'hub', cluster:c.id });
    edges.push(['root', hubId]);
  });

  // create problem nodes and hub->problem edges
  problems.forEach(p => {
    nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url, type:'leaf', cluster: p.cluster });
    edges.push(['hub-'+p.cluster, p.id]);
  });

  /* -------------------------
     DOM references
  -------------------------*/
  const svg = document.getElementById('map-svg');
  const container = document.getElementById('map-nodes');
  const stage = document.getElementById('map-stage');
  const legendEl = document.getElementById('map-legend');
  const searchInput = document.getElementById('map-search');

  // maps for quick lookup
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = Object.assign({}, n); });

  /* -------------------------
     Layout params & force simulation params
  -------------------------*/
  const NODE_W = 200;   // used for bounding calculations
  const NODE_H = 72;

  // force simulation constants (tunable)
  const REPULSION = 82000; // repulsive constant
  const STIFFNESS = 0.06; // spring stiffness for edges
  const IDEAL_EDGE = 260; // desired edge length
  const DAMPING = 0.85;   // velocity damping
  const CENTER_FORCE = 0.06; // pulls nodes toward guided position (keeps clustering)
  const MAX_ITER = 2000;  // safety cap on iterations (we actually animate continuously)

  // container size margins
  const PADDING = 80;

  /* -------------------------
     Helper: pick cluster hub ids for layout guidance
  -------------------------*/
  const hubIds = clusters.map(c => 'hub-'+c.id);

  /* -------------------------
     Guided hierarchical placement:
     Compute initial guided "target" positions to keep readable hierarchy,
     then allow force-directed relaxation that respects those targets with center force.
  -------------------------*/
  function computeGuidedPositions() {
    // root at left-center
    const x0 = 60;
    const y0 = 120;
    nodeMap['root'].x = x0;
    nodeMap['root'].y = y0;

    // place hubs in two columns vertically to the right of root
    const hubCount = hubIds.length;
    const colX = x0 + 320;
    const hubSpacing = 110;
    const startY = y0 - ((hubCount - 1) / 2) * hubSpacing;
    hubIds.forEach((hid, idx) => {
      nodeMap[hid].x = colX;
      nodeMap[hid].y = startY + idx * hubSpacing;
    });

    // place problem nodes around their hub in a fan to the right (grid)
    const clusterGroups = {};
    nodes.forEach(n => {
      if(n.type === 'leaf') {
        clusterGroups[n.cluster] = clusterGroups[n.cluster] || [];
        clusterGroups[n.cluster].push(n.id);
      }
    });

    Object.keys(clusterGroups).forEach(clusterId => {
      const hubId = 'hub-' + clusterId;
      const hub = nodeMap[hubId];
      const list = clusterGroups[clusterId];
      // layout grid to the right of the hub
      const cols = Math.max(1, Math.ceil(list.length / 4));
      list.forEach((nid, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        nodeMap[nid].x = hub.x + 180 + c * 190;
        nodeMap[nid].y = hub.y - (Math.min(3, list.length)-1)/2 * 90 + r * 110;
      });
    });

    // for any remaining nodes (shouldn't be), place them to the right
    nodes.forEach(n => {
      if(typeof nodeMap[n.id].x !== 'number') nodeMap[n.id].x = x0 + 600;
      if(typeof nodeMap[n.id].y !== 'number') nodeMap[n.id].y = y0 + 60;
    });

    // initialize velocities
    nodes.forEach(n => {
      nodeMap[n.id].vx = 0;
      nodeMap[n.id].vy = 0;
    });
  }

  /* -------------------------
     Render nodes into DOM
  -------------------------*/
  function renderNodes() {
    container.innerHTML = '';
    nodes.forEach(n => {
      const el = document.createElement('a');
      el.className = 'node-box ' + (n.type === 'root' ? 'root-node' : (n.type === 'hub' ? 'intermediate-node' : 'leaf-node'));
      el.href = n.url || '#';
      el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
      el.dataset.id = n.id;
      el.setAttribute('role','link');
      el.setAttribute('aria-label', n.title + ' — ' + (n.sub||''));

      // cluster accent
      const accent = document.createElement('span');
      accent.className = 'cluster-accent';
      const clusterColor = n.cluster ? (clusters.find(c => c.id === n.cluster).color) : '#ffffff';
      accent.style.background = clusterColor;
      accent.style.boxShadow = `0 8px 28px ${hexToRgba(clusterColor, 0.10)}`;
      el.appendChild(accent);

      const titleEl = document.createElement('span');
      titleEl.className = 'node-title';
      titleEl.textContent = n.title;
      const subEl = document.createElement('span');
      subEl.className = 'node-sub';
      subEl.textContent = n.sub || '';
      el.appendChild(titleEl);
      el.appendChild(subEl);

      // position using guided pos (yet to be offset to padding)
      const pos = nodeMap[n.id];
      el.style.left = (pos.x || 0) + 'px';
      el.style.top = (pos.y || 0) + 'px';

      // hover interactions
      el.addEventListener('mouseenter', (e) => {
        highlightNodeAndEdges(n.id, true);
        showTooltip(e, n);
      });
      el.addEventListener('mouseleave', () => {
        highlightNodeAndEdges(n.id, false);
        hideTooltip();
      });

      container.appendChild(el);
      nodeMap[n.id].el = el;
    });
  }

  /* -------------------------
     Create SVG defs for arrowheads
  -------------------------*/
  function setupSvgDefs() {
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg','marker');
    marker.setAttribute('id','arrowhead');
    marker.setAttribute('viewBox','0 0 10 10');
    marker.setAttribute('refX','10');
    marker.setAttribute('refY','5');
    marker.setAttribute('markerUnits','strokeWidth');
    marker.setAttribute('markerWidth','8');
    marker.setAttribute('markerHeight','8');
    marker.setAttribute('orient','auto');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M 0 0 L 10 5 L 0 10 z');
    path.setAttribute('fill','rgba(255,255,255,0.18)');
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }

  /* -------------------------
     Draw or update edges (curved cubic Bezier)
     We'll draw paths into svg (one path per edge).
     Edges are updated every frame while layout animates.
  -------------------------*/
  function drawEdges(initialDraw=false) {
    // Remove existing paths except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if(defs) svg.appendChild(defs);

    edges.forEach(([fromId,toId]) => {
      const f = nodeMap[fromId];
      const t = nodeMap[toId];
      if(!f || !t || !f.el || !t.el) return;

      // compute center points from element bounding boxes (use left/top)
      const aRect = f.el.getBoundingClientRect();
      const bRect = t.el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      const x1 = aRect.left - parentRect.left + aRect.width / 2;
      const y1 = aRect.top - parentRect.top + aRect.height / 2;
      const x2 = bRect.left - parentRect.left + bRect.width / 2;
      const y2 = bRect.top - parentRect.top + bRect.height / 2;

      const dx = x2 - x1;
      const lift = Math.max(60, Math.abs(dx) * 0.16);
      const cx1 = x1 + dx * 0.28;
      const cy1 = y1 - lift;
      const cx2 = x1 + dx * 0.72;
      const cy2 = y2 - lift * 0.6;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-line');
      path.setAttribute('marker-end', 'url(#arrowhead)');
      path.dataset.from = fromId;
      path.dataset.to = toId;
      // initial draw animation: compute length and animate dashoffset to 0
      svg.appendChild(path);

      // set dash geometry for continuous subtle motion + initial growth
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      // start fully dashed for growth
      if(initialDraw) {
        path.style.strokeDashoffset = length;
        // small timeout to allow DOM attach
        (function (p, len) {
          requestAnimationFrame(()=> {
            p.classList.add('path-draw');
            p.style.transition = 'stroke-dashoffset 900ms ease-out';
            p.style.strokeDashoffset = 0;
            // after draw, add a slow dash animation to imply flow
            setTimeout(()=> {
              p.style.transition = '';
              p.classList.add('flow-anim');
            }, 920);
          });
        })(path, length);
      } else {
        // normal frame: keep flow animation
        path.classList.add('flow-anim');
      }
    });
  }

  /* -------------------------
     Force simulation: simple repulsion + spring + guided center
     We'll run iterative simulation using requestAnimationFrame to animate the nodes.
     Uses O(n^2) repulsion: OK for up to few hundred nodes.
  -------------------------*/
  let simRunning = false;
  function stepSimulation() {
    let moved = false;
    // repulsive forces between all pairs
    for(let i=0;i<nodes.length;i++) {
      const ni = nodeMap[nodes[i].id];
      if(!ni) continue;
      let fx = 0, fy = 0;
      for(let j=0;j<nodes.length;j++) {
        if(i === j) continue;
        const nj = nodeMap[nodes[j].id];
        if(!nj) continue;
        let dx = (ni.x || 0) - (nj.x || 0);
        let dy = (ni.y || 0) - (nj.y || 0);
        let dist2 = dx*dx + dy*dy;
        if(dist2 < 0.0001) { dx = (Math.random() - 0.5) * 0.1; dy = (Math.random() - 0.5) * 0.1; dist2 = dx*dx + dy*dy; }
        const dist = Math.sqrt(dist2);
        // repulsive force magnitude ~ k^2 / dist (approx)
        const force = REPULSION / dist2;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }
      // spring attractions along edges (only outgoing/incoming edges considered)
      // find all neighbors connected by edge
      edges.forEach(([u,v]) => {
        if(u === ni.id || v === ni.id) {
          const otherId = (u === ni.id) ? v : u;
          const nj = nodeMap[otherId];
          let dx = (nj.x || 0) - (ni.x || 0);
          let dy = (nj.y || 0) - (ni.y || 0);
          const dist = Math.max(1, Math.sqrt(dx*dx + dy*dy));
          const desired = IDEAL_EDGE;
          const spring = STIFFNESS * (dist - desired);
          // add spring force toward neighbor
          fx += (dx / dist) * spring;
          fy += (dy / dist) * spring;
        }
      });
      // guided center: small pull toward guided target (computed earlier)
      const guideX = (ni.xGuided !== undefined) ? ni.xGuided : (ni.x || 0);
      const guideY = (ni.yGuided !== undefined) ? ni.yGuided : (ni.y || 0);
      const gx = guideX - (ni.x || 0);
      const gy = guideY - (ni.y || 0);
      fx += gx * CENTER_FORCE;
      fy += gy * CENTER_FORCE;

      // integrate: velocity update
      ni.vx = (ni.vx || 0) * DAMPING + fx * 0.00012;
      ni.vy = (ni.vy || 0) * DAMPING + fy * 0.00012;

      // clamp velocities to avoid explosion
      const maxV = 80;
      if (ni.vx > maxV) ni.vx = maxV;
      if (ni.vx < -maxV) ni.vx = -maxV;
      if (ni.vy > maxV) ni.vy = maxV;
      if (ni.vy < -maxV) ni.vy = -maxV;

      // update positions
      const nx = (ni.x || 0) + ni.vx;
      const ny = (ni.y || 0) + ni.vy;
      // small threshold check
      if(Math.abs(nx - ni.x) > 0.02 || Math.abs(ny - ni.y) > 0.02) moved = true;
      ni.x = nx;
      ni.y = ny;
    }

    // update DOM elements positions and redraw edges
    nodes.forEach(n => {
      const el = nodeMap[n.id].el;
      if(el) {
        el.style.left = (nodeMap[n.id].x || 0) + 'px';
        el.style.top = (nodeMap[n.id].y || 0) + 'px';
      }
    });

    // update edges on each frame (so arrows always follow)
    drawEdges(false);

    // continue sim while moving
    if(moved) {
      simRunning = true;
      requestAnimationFrame(stepSimulation);
    } else {
      simRunning = false;
      // when stable, re-run small growth pulse if desired
      setTimeout(()=> { // small idle pulse for flow effect
        const paths = svg.querySelectorAll('path.flow-line');
        paths.forEach(p => {
          p.classList.remove('flow-anim');
          void p.offsetWidth;
          p.classList.add('flow-anim');
        });
      }, 700);
    }
  }

  /* -------------------------
     Fit canvas: compute bounding box of nodes, size container + svg, and offset nodes by padding
  -------------------------*/
  function fitCanvas(padding = PADDING) {
    // compute min/max using node coords (raw layout positions)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      const p = nodeMap[n.id];
      if(!p) return;
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x + NODE_W);
      maxY = Math.max(maxY, p.y + NODE_H);
    });
    if(minX === Infinity) { minX = 0; minY = 0; maxX = 1200; maxY = 800; }
    const width = Math.ceil((maxX - minX) + padding*2);
    const height = Math.ceil((maxY - minY) + padding*2);

    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // offset nodes by padding - minX/minY
    const offsetX = padding - minX;
    const offsetY = padding - minY;
    nodes.forEach(n => {
      const p = nodeMap[n.id];
      p.x += offsetX;
      p.y += offsetY;
      const el = p.el;
      if(el) {
        el.style.left = (p.x) + 'px';
        el.style.top = (p.y) + 'px';
      }
    });

    // initial draw of edges with initial growth
    drawEdges(true);

    // scale to fit viewport if large
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScale = Math.min(1, (stageW - 40) / width, (stageH - 40) / height);
    setScale(fitScale);

    // center
    stage.scrollLeft = Math.max(0, (width * fitScale - stageW) / 2);
    stage.scrollTop = Math.max(0, (height * fitScale - stageH) / 2);
  }

  /* -------------------------
     Highlight helpers
  -------------------------*/
  function highlightNodeAndEdges(nodeId, on) {
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(p.dataset.from === nodeId || p.dataset.to === nodeId) {
        p.classList.toggle('flow-highlight', on);
        p.style.opacity = on ? '1' : '';
      } else {
        p.style.opacity = on ? '0.12' : '';
      }
    });
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      n.el.style.opacity = on && n.id !== nodeId ? '0.6' : '';
    });
  }

  /* -------------------------
     Tooltip logic
  -------------------------*/
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);
  function showTooltip(e, n) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<strong>${escapeHtml(n.title)}</strong><div style="margin-top:6px;font-size:12px;opacity:0.92;">${escapeHtml(n.sub||'')}</div><div style="margin-top:8px;font-size:11px;opacity:0.78;">${n.url && n.url!=='#' ? 'Open link' : 'placeholder'}</div>`;
    const rect = e.target.getBoundingClientRect();
    const left = Math.max(6, rect.left + window.scrollX + 12);
    const top = Math.max(6, rect.top + window.scrollY - 8);
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }

  /* -------------------------
     Search (autocomplete) and focus center
  -------------------------*/
  function initSearch() {
    const flat = nodes.map(n => ({ id: n.id, title: n.title, sub: nodeMap[n.id].sub || '' }));
    let currentFocus = -1;

    searchInput.addEventListener('input', function () {
      const val = this.value.trim().toLowerCase();
      closeLists();
      if(!val) return;
      const list = document.createElement('div');
      list.className = 'autocomplete-items';
      list.style.position = 'absolute';
      list.style.zIndex = 9999;
      list.style.background = 'rgba(0,0,0,0.8)';
      list.style.border = '1px solid rgba(255,255,255,0.06)';
      list.style.marginTop = '6px';
      list.style.width = this.clientWidth + 'px';
      this.parentNode.appendChild(list);

      const matches = flat.filter(item => item.title.toLowerCase().includes(val) || (item.sub||'').toLowerCase().includes(val));
      matches.slice(0,10).forEach(m => {
        const itemEl = document.createElement('div');
        itemEl.style.padding = '8px';
        itemEl.style.cursor = 'pointer';
        itemEl.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">${escapeHtml(m.sub||'')}</div>`;
        itemEl.addEventListener('click', () => {
          searchInput.value = m.title;
          closeLists();
          focusNode(m.id);
        });
        list.appendChild(itemEl);
      });
    });

    searchInput.addEventListener('keydown', function (e) {
      const list = this.parentNode.querySelector('.autocomplete-items');
      if(!list) return;
      const items = list.getElementsByTagName('div');
      if(e.key === 'ArrowDown') { currentFocus++; addActive(items); e.preventDefault(); }
      else if(e.key === 'ArrowUp') { currentFocus--; addActive(items); e.preventDefault(); }
      else if(e.key === 'Enter') { e.preventDefault(); if(currentFocus > -1 && items[currentFocus]) items[currentFocus].click(); }
    });

    function addActive(items) { if(!items) return; removeActive(items); if(currentFocus >= items.length) currentFocus = 0; if(currentFocus < 0) currentFocus = items.length - 1; items[currentFocus].classList.add('autocomplete-active'); }
    function removeActive(items) { for(let it of items) it.classList.remove('autocomplete-active'); }
    function closeLists(elmnt) { const lists = document.getElementsByClassName('autocomplete-items'); for(let i=0;i<lists.length;i++) if(elmnt != lists[i] && elmnt != searchInput) lists[i].parentNode.removeChild(lists[i]); currentFocus = -1; }
    document.addEventListener('click', (e)=> closeLists(e.target));
  }

  // center and zoom to node
  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if(!n || !n.el) return;
    // compute center relative to container
    const r = n.el.getBoundingClientRect();
    const parent = container.getBoundingClientRect();
    const cx = (r.left - parent.left) + r.width / 2;
    const cy = (r.top - parent.top) + r.height / 2;
    // scale
    const targetScale = Math.min(1.1, Math.max(0.7, 1.0));
    setScale(targetScale);
    // scroll to center
    const left = Math.max(0, cx * targetScale - stage.clientWidth / 2);
    const top = Math.max(0, cy * targetScale - stage.clientHeight / 2);
    stage.scrollTo({ left, top, behavior: 'smooth' });
    // short highlight
    highlightNodeAndEdges(nodeId, true);
    setTimeout(()=> highlightNodeAndEdges(nodeId, false), 1500);
  }

  /* -------------------------
     Legend: render clusters and enable cluster filter
  -------------------------*/
  let activeClusterFilter = null;
  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach(c => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = c.color;
      const label = document.createElement('div');
      label.textContent = c.label;
      item.appendChild(sw);
      item.appendChild(label);
      item.addEventListener('click', ()=> toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }
  function toggleCluster(clusterId) {
    activeClusterFilter = activeClusterFilter === clusterId ? null : clusterId;
    // fade nodes/edges not in the cluster
    nodes.forEach(n => {
      const el = nodeMap[n.id].el;
      if(!el) return;
      if(activeClusterFilter && n.type !== 'root' && n.cluster !== activeClusterFilter) el.style.opacity = '0.28';
      else el.style.opacity = '';
    });
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(!activeClusterFilter) { p.style.opacity = ''; return; }
      const from = p.dataset.from, to = p.dataset.to;
      const pa = nodeMap[from], pb = nodeMap[to];
      if((pa && pa.cluster === activeClusterFilter) || (pb && pb.cluster === activeClusterFilter)) {
        p.style.opacity = '1';
        p.style.stroke = '';
      } else p.style.opacity = '0.06';
    });
  }

  /* -------------------------
     Utility functions
  -------------------------*/
  function hexToRgba(hex, alpha=1) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  function escapeHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* -------------------------
     Pan / Drag + wheel handling
  -------------------------*/
  (function enablePanDrag() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e) => {
      if(e.target.closest('.node-box')) return; // allow node clicks
      isDown = true;
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      stage.classList.add('dragging');
      e.preventDefault();
    });
    window.addEventListener('mouseup', ()=> { isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      const walkX = (startX - x);
      const walkY = (startY - y);
      stage.scrollLeft = scrollLeft + walkX;
      stage.scrollTop = scrollTop + walkY;
    });
    // wheel -> horizontal pan
    stage.addEventListener('wheel', (e)=> {
      if(e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive:false });
  })();

  /* -------------------------
     Controls: zoom in/out/reset wiring
  -------------------------*/
  let scale = 1;
  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale})`;
    svg.style.transform = `scale(${scale})`;
  }
  document.getElementById('map-zoom-in').addEventListener('click', ()=> setScale(Math.min(1.6, scale + 0.12)));
  document.getElementById('map-zoom-out').addEventListener('click', ()=> setScale(Math.max(0.5, scale - 0.12)));
  document.getElementById('map-reset').addEventListener('click', ()=> {
    setScale(1);
    stage.scrollLeft = 0; stage.scrollTop = 0;
    // clear cluster filter
    activeClusterFilter = null;
    nodes.forEach(n => { if(nodeMap[n.id].el) nodeMap[n.id].el.style.opacity = ''; });
    const paths = svg.querySelectorAll('path.flow-line'); paths.forEach(p => p.style.opacity = '');
  });

  /* -------------------------
     Main boot sequence
  -------------------------*/
  function boot() {
    // compute guided positions (will be stored on nodeMap.*.xGuided and yGuided)
    computeGuidedPositions();
    // copy guided positions into xGuided/yGuided for center force
    nodes.forEach(n => {
      nodeMap[n.id].xGuided = nodeMap[n.id].x;
      nodeMap[n.id].yGuided = nodeMap[n.id].y;
    });

    // render nodes and svg defs
    renderNodes();
    setupSvgDefs();

    // Now fit canvas (sizes and offsets) and initial draw
    fitCanvas(100);

    // start force simulation for a warm animated settle
    if(!simRunning) requestAnimationFrame(stepSimulation);

    // render legend & search
    renderLegend();
    initSearch();

    // on resize, refit and redraw edges
    window.addEventListener('resize', ()=> { drawEdges(false); fitCanvas(100); });
  }

  // run boot
  boot();

  /* -------------------------
     Expose API for adding problem nodes later
  -------------------------*/
  window.Leetree = {
    focusNode,
    addProblem: function (p) {
      // p: { id, title, sub, url, cluster }
      if(nodeMap[p.id]) return;
      nodes.push({ id: p.id, title:p.title, sub:p.sub, url:p.url, type:'leaf', cluster:p.cluster });
      nodeMap[p.id] = { id:p.id, title:p.title, sub:p.sub, url:p.url, type:'leaf', cluster:p.cluster, x: nodeMap['root'].x + 600, y: nodeMap['root'].y + 200 };
      edges.push(['hub-'+p.cluster, p.id]);
      renderNodes();
      drawEdges(true);
      fitCanvas(90);
      if(!simRunning) requestAnimationFrame(stepSimulation);
    },
    fit: function() { fitCanvas(100); }
  };

  // Create legend and search init functions here to avoid hoisting issues
  function renderLegend() { /* function declared earlier — kept for readability */ }
  function initSearch() { /* function declared earlier — kept for readability */ }

  // small helper duplicates re-declared to avoid function hoisting confusion in this combined block
  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach(c => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = c.color;
      const label = document.createElement('div');
      label.textContent = c.label;
      item.appendChild(sw);
      item.appendChild(label);
      item.addEventListener('click', ()=> toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }
  function initSearch() { /* already defined earlier; for brevity we rebind earlier listener */ }

  /* -------------------------
     Small helpers repeated for closure safety
  -------------------------*/
  function focusNode(id) {
    if(!nodeMap[id] || !nodeMap[id].el) return;
    const rect = nodeMap[id].el.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    const cx = (rect.left - parentRect.left) + rect.width/2;
    const cy = (rect.top - parentRect.top) + rect.height/2;
    setScale(1.02);
    stage.scrollTo({ left: Math.max(0, cx*scale - stage.clientWidth/2), top: Math.max(0, cy*scale - stage.clientHeight/2), behavior:'smooth' });
    highlightNodeAndEdges(id, true);
    setTimeout(()=> highlightNodeAndEdges(id, false), 1800);
  }
  function highlightNodeAndEdges(nodeId, on) { highlightNodeAndEdgesInner(nodeId, on); }
  function highlightNodeAndEdgesInner(nodeId, on) {
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(p.dataset.from === nodeId || p.dataset.to === nodeId) {
        p.classList.toggle('flow-highlight', on);
        p.style.opacity = on ? '1' : '';
      } else {
        p.style.opacity = on ? '0.12' : '';
      }
    });
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      n.el.style.opacity = on && n.id !== nodeId ? '0.6' : '';
    });
  }
  function escapeHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function hexToRgba(hex, a) { const h = hex.replace('#',''); const bi = parseInt(h,16); return `rgba(${(bi>>16)&255},${(bi>>8)&255},${bi&255},${a})`; }

  // end of script
})();
