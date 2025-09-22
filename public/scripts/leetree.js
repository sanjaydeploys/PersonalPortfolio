/* leetree-advanced.js
   - Auto-populates map with clusters & problems
   - Auto-layout (root -> clusters -> problems)
   - SVG curved arrows with animated stroke
   - Cluster color-coding + legend + filter highlight
   - Search & center + zoom
   - Drag-to-pan + wheel scroll mapping
   - Hover tooltips & highlight of edges
   - API: Leetree.addNode / addEdge / fit
   Comments are inline to guide future edits.
*/

(function () {
  /* -----------------------------
     CONFIG: clusters & problems
     Each cluster has id, label, color.
     Each problem node has id, label, subtitle, url, cluster.
  -------------------------------*/
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

  // Problems (representative set) — add more as you want.
  const problems = [
    // SUM & PAIR
    { id:'two-sum', title:'Two Sum', sub:'LC1 — Hash map', url:'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster:'sum' },
    { id:'two-sum-ii', title:'Two Sum II', sub:'LC167 — Sorted two-pointer', url:'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster:'sum' },
    { id:'3sum', title:'3Sum', sub:'LC15 — k-sum family', url:'https://sanjay-patidar.vercel.app/three-sum', cluster:'twoPointers' },
    { id:'3closest', title:'3Sum Closest', sub:'LC16 — closest target', url:'https://sanjay-patidar.vercel.app/three-sum-closest', cluster:'twoPointers' },

    // SLIDING WINDOW
    { id:'anagram', title:'Find All Anagrams', sub:'LC438 — Fixed window', url:'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster:'window' },
    { id:'min-window', title:'Minimum Window', sub:'LC76 — Variable window', url:'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster:'window' },

    // PREFIX / SUBARRAY
    { id:'prefix-sum', title:'Prefix Sum', sub:'LC560 variants', url:'#', cluster:'prefix' },
    { id:'subarray-sum', title:'Subarray Sum K', sub:'LC560 / LC525', url:'#', cluster:'prefix' },

    // BACKTRACKING
    { id:'perm', title:'Permutations', sub:'LC46', url:'#', cluster:'backtracking' },
    { id:'comb-phone', title:'Letter Combinations', sub:'LC17', url:'#', cluster:'backtracking' },
    { id:'subsets', title:'Subsets', sub:'LC78', url:'#', cluster:'backtracking' },

    // BINARY SEARCH
    { id:'search-rotated', title:'Search in Rotated', sub:'LC33', url:'#', cluster:'binary' },
    { id:'koko', title:'Search-on-Answer', sub:'LC875', url:'#', cluster:'binary' },

    // DP
    { id:'climb', title:'Climbing Stairs', sub:'LC70 — 1D DP', url:'#', cluster:'dp' },
    { id:'house-robber', title:'House Robber', sub:'LC198', url:'#', cluster:'dp' },
    { id:'lis', title:'LIS', sub:'LC300', url:'#', cluster:'dp' },

    // GRAPH
    { id:'islands', title:'Number of Islands', sub:'LC200', url:'#', cluster:'graph' },
    { id:'wordladder', title:'Word Ladder', sub:'LC127', url:'#', cluster:'graph' },
    { id:'clone-graph', title:'Clone Graph', sub:'LC133', url:'#', cluster:'graph' }
  ];

  /* -----------------------------
     Derived node list and edge set:
     root -> cluster hubs -> problem nodes
  -------------------------------*/
  const nodes = []; // will contain {id, title, subtitle, url, type, cluster}
  const edges = []; // [fromId, toId]

  // root
  nodes.push({ id:'root', title:'DSA / Patterns', sub:'Start here', url:'#', type:'root', cluster:null });

  // cluster hubs as intermediate nodes
  clusters.forEach(c => {
    nodes.push({ id: 'hub-'+c.id, title: c.label, sub:'pattern hub', url:'#', type:'hub', cluster:c.id });
    edges.push(['root', 'hub-'+c.id]);
  });

  // problem nodes attached to cluster hubs
  problems.forEach(p => {
    nodes.push({ id: p.id, title: p.title, sub: p.sub, url: p.url, type:'leaf', cluster: p.cluster });
    // find hub node id
    edges.push(['hub-'+p.cluster, p.id]);
  });

  /* -----------------------------
     Elements and state
  -------------------------------*/
  const svg = document.getElementById('map-svg');
  const container = document.getElementById('map-nodes');
  const stage = document.getElementById('map-stage');
  const legendEl = document.getElementById('map-legend');
  const searchInput = document.getElementById('node-search');

  // Map id -> object
  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = Object.assign({}, n));

  /* -----------------------------
     Layout algorithm:
     - level 0: root at left-center (x0,y0)
     - level 1: cluster hubs arranged radially/fan to the right of root
     - level 2: problem nodes fan out below each hub
     We'll compute approximate positions and then compact.
  -------------------------------*/
  function layoutCompute() {
    // base positions
    const x0 = 60;
    const y0 = 120;
    nodeMap['root'].x = x0;
    nodeMap['root'].y = y0;

    // level 1: hubs — arrange in two rows to the right (to make tree compact)
    const hubs = clusters.map(c => 'hub-'+c.id);
    const hubCount = hubs.length;
    const colX = x0 + 320; // hubs start to the right of root
    const hubSpacingY = 110;
    const hubStartY = y0 - ((hubCount-1)/2)*hubSpacingY;
    hubs.forEach((hid, idx) => {
      const hy = hubStartY + idx*hubSpacingY;
      nodeMap[hid].x = colX;
      nodeMap[hid].y = hy;
    });

    // level 2: problems per cluster — fan out horizontally around hub
    const clusterGroups = {};
    nodes.forEach(n => {
      if(n.type === 'leaf') {
        clusterGroups[n.cluster] = clusterGroups[n.cluster] || [];
        clusterGroups[n.cluster].push(n);
      }
    });

    // placement: for each cluster, place nodes in a semi-circle/fan to the right and slightly below hub
    Object.keys(clusterGroups).forEach(clusterId => {
      const hubId = 'hub-'+clusterId;
      const hub = nodeMap[hubId];
      const problemsArr = clusterGroups[clusterId];
      const count = problemsArr.length;
      const startX = hub.x + 220;
      const startY = hub.y - Math.floor(count/2)*90;
      problemsArr.forEach((p, i) => {
        nodeMap[p.id].x = startX + (i % 6) * 190;
        nodeMap[p.id].y = startY + Math.floor(i/6)*110;
      });
    });
  }

  /* -----------------------------
     Render nodes into DOM (absolute positioned anchors)
  -------------------------------*/
  function renderNodes() {
    container.innerHTML = '';
    // create node elements
    nodes.forEach(n => {
      const el = document.createElement('a');
      el.href = n.url || '#';
      el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
      el.className = 'node-box ' + (n.type === 'root' ? 'root-node' : (n.type === 'hub' ? 'intermediate-node' : 'leaf-node'));
      el.dataset.id = n.id;
      el.setAttribute('role','link');
      el.setAttribute('aria-label', n.title + ' — ' + (n.sub||''));
      // cluster accent
      const accent = document.createElement('span');
      accent.className = 'cluster-accent';
      const clusterColor = n.cluster ? (clusters.find(c=>c.id===n.cluster).color) : '#ffffff';
      accent.style.background = clusterColor;
      accent.style.boxShadow = `0 6px 18px ${hexToRgba(clusterColor, 0.12)}`;
      // content
      const t = document.createElement('span');
      t.className = 'node-title';
      t.textContent = n.title;
      const s = document.createElement('span');
      s.className = 'node-sub';
      s.textContent = n.sub || '';
      el.appendChild(accent);
      el.appendChild(t);
      el.appendChild(s);

      // position based on layout
      const pos = nodeMap[n.id];
      const left = (typeof pos.x === 'number') ? pos.x : 200;
      const top = (typeof pos.y === 'number') ? pos.y : 120;
      el.style.left = left + 'px';
      el.style.top = top + 'px';

      // floating animation for hubs & leaf nodes
      el.classList.add('node-float');

      // hover interactions
      el.addEventListener('mouseenter', (e)=> {
        highlightConnections(n.id, true);
        showTooltip(e, n);
      });
      el.addEventListener('mouseleave', ()=> {
        highlightConnections(n.id, false);
        hideTooltip();
      });

      container.appendChild(el);
      nodeMap[n.id].el = el;
    });
  }

  /* -----------------------------
     Draw curved edges as SVG paths + arrowheads
  -------------------------------*/
  function setupSvgDefs() {
    // clear
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    // arrow marker
    const marker = document.createElementNS('http://www.w3.org/2000/svg','marker');
    marker.setAttribute('id','arrowhead-ll');
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

  function drawEdges() {
    // remove old edges
    // remove everything except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if(defs) svg.appendChild(defs);

    edges.forEach(([fromId,toId]) => {
      const f = nodeMap[fromId];
      const t = nodeMap[toId];
      if(!f || !t || !f.el || !t.el) return;
      // compute positions using element bounding boxes
      const a = f.el.getBoundingClientRect();
      const b = t.el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      const x1 = a.left - parentRect.left + (a.width/2);
      const y1 = a.top - parentRect.top + (a.height/2);
      const x2 = b.left - parentRect.left + (b.width/2);
      const y2 = b.top - parentRect.top + (b.height/2);
      const dx = x2 - x1;
      // controls
      const lift = Math.max(60, Math.abs(dx)*0.16);
      const cx1 = x1 + dx*0.28;
      const cy1 = y1 - lift;
      const cx2 = x1 + dx*0.72;
      const cy2 = y2 - lift*0.6;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
      path.setAttribute('class','flow-line flow-anim');
      path.setAttribute('marker-end','url(#arrowhead-ll)');
      path.dataset.from = fromId;
      path.dataset.to = toId;
      svg.appendChild(path);
    });
  }

  /* -----------------------------
     Highlight edges connected to a node
  -------------------------------*/
  function highlightConnections(nodeId, on) {
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(p.dataset.from === nodeId || p.dataset.to === nodeId) {
        p.classList.toggle('flow-highlight', on);
        p.style.opacity = on ? '1' : '';
      } else {
        if(on) p.style.opacity = '0.12';
        else p.style.opacity = '';
      }
    });
    // fade other nodes slightly on hover
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      if(on && n.id !== nodeId) n.el.style.opacity = '0.6';
      else n.el.style.opacity = '';
    });
  }

  /* -----------------------------
     Tooltip helpers
  -------------------------------*/
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);
  function showTooltip(e, n) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<strong>${escapeHtml(n.title)}</strong>
      <div style="font-size:12px;opacity:0.9;margin-top:6px;">${escapeHtml(n.sub || '')}</div>
      <div style="font-size:11px;opacity:0.8;margin-top:6px;">${n.url && n.url!=='#' ? 'Open link' : 'Placeholder'}</div>`;
    const rect = e.target.getBoundingClientRect();
    // position intelligently (avoid going offscreen)
    const left = Math.max(12, rect.left + window.scrollX + 12);
    const top = Math.max(12, rect.top + window.scrollY - 8);
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }

  /* -----------------------------
     Utility: hex to rgba
  -------------------------------*/
  function hexToRgba(hex, alpha=1) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  function escapeHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* -----------------------------
     Canvas fit: compute bounding box of all nodes and size svg/container, center into stage
  -------------------------------*/
  function fitCanvas(padding=80) {
    // compute bounding box using element positions
    let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return; // skip unrendered
      const r = n.el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      const left = r.left - parentRect.left;
      const top = r.top - parentRect.top;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + r.width);
      maxY = Math.max(maxY, top + r.height);
    });
    if(minX === Infinity) { // fallback
      minX = 0; minY = 0; maxX = 1200; maxY = 800;
    }
    const width = Math.ceil((maxX - minX) + padding*2);
    const height = Math.ceil((maxY - minY) + padding*2);
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // apply offset so nodes are padded in canvas
    const offsetX = padding - minX;
    const offsetY = padding - minY;
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      const left = parseFloat(n.el.style.left || 0);
      const top = parseFloat(n.el.style.top || 0);
      n.el.style.left = (left + offsetX) + 'px';
      n.el.style.top = (top + offsetY) + 'px';
    });

    // redraw edges
    drawEdges();

    // fit to stage: scale down if too large
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScale = Math.min(1, (stageW - 60) / width, (stageH - 60) / height);
    setScale(fitScale);
    // center
    stage.scrollLeft = (width*fitScale - stageW)/2;
    stage.scrollTop = (height*fitScale - stageH)/2;
  }

  // scale transform
  let scale = 1;
  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale})`;
    svg.style.transform = `scale(${scale})`;
  }

  /* -----------------------------
     Drag to pan / wheel to horizontal scroll
  -------------------------------*/
  (function enableDragPan() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e) => {
      // if clicked over a node link, don't start panning to allow clicks
      if(e.target.closest('.node-box')) return;
      isDown = true;
      stage.classList.add('dragging');
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
    });
    window.addEventListener('mouseup', ()=> { isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e)=> {
      if(!isDown) return;
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      const walkX = (startX - x);
      const walkY = (startY - y);
      stage.scrollLeft = scrollLeft + walkX;
      stage.scrollTop = scrollTop + walkY;
    });
    // wheel → horizontal pan
    stage.addEventListener('wheel', (e)=> {
      if(e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive:false });
  })();

  /* -----------------------------
     Search control: simple autocomplete + center on select
  -------------------------------*/
  function initSearch() {
    const flat = nodes.map(n => ({ id: n.id, title: n.title, sub: n.sub }));
    let currentFocus = -1;
    searchInput.addEventListener('input', function () {
      const val = this.value.trim().toLowerCase();
      closeAllLists();
      if(!val) return;
      const list = document.createElement('div');
      list.setAttribute('id','autocomplete-list');
      list.setAttribute('class','autocomplete-items');
      this.parentNode.appendChild(list);
      const matches = flat.filter(item => item.title.toLowerCase().includes(val) || (item.sub||'').toLowerCase().includes(val));
      matches.slice(0,8).forEach(m => {
        const itemEl = document.createElement('div');
        itemEl.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">${escapeHtml(m.sub||'')}</div>`;
        itemEl.addEventListener('click', ()=> {
          searchInput.value = m.title;
          closeAllLists();
          focusNode(m.id);
        });
        list.appendChild(itemEl);
      });
    });

    searchInput.addEventListener('keydown', function (e) {
      const list = document.getElementById('autocomplete-list');
      if(!list) return;
      const items = list.getElementsByTagName('div');
      if(e.key === 'ArrowDown') { currentFocus++; addActive(items); e.preventDefault(); }
      else if(e.key === 'ArrowUp') { currentFocus--; addActive(items); e.preventDefault(); }
      else if(e.key === 'Enter') { e.preventDefault(); if(currentFocus > -1 && items[currentFocus]) items[currentFocus].click(); }
    });

    function addActive(items) {
      if(!items) return;
      removeActive(items);
      if(currentFocus >= items.length) currentFocus = 0;
      if(currentFocus < 0) currentFocus = items.length - 1;
      items[currentFocus].classList.add('autocomplete-active');
    }
    function removeActive(items) { for(let it of items) it.classList.remove('autocomplete-active'); }

    function closeAllLists(elmnt) {
      const items = document.getElementsByClassName('autocomplete-items');
      for(let i=0;i<items.length;i++) if (elmnt != items[i] && elmnt != searchInput) items[i].parentNode.removeChild(items[i]);
      currentFocus = -1;
    }
    document.addEventListener('click', (e)=> closeAllLists(e.target));
  }

  // center & zoom to node
  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if(!n || !n.el) return;
    // compute bounding box & center
    const rect = n.el.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    // center coordinates in container space
    const cx = (rect.left - parentRect.left) + rect.width/2;
    const cy = (rect.top - parentRect.top) + rect.height/2;
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    // compute position after scaling
    const targetScale = Math.min(1.05, Math.max(0.7, 1.0));
    setScale(targetScale);
    // scroll so that target is centered
    const scrollLeft = Math.max(0, cx*targetScale - stageW/2);
    const scrollTop = Math.max(0, cy*targetScale - stageH/2);
    stage.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
    // highlight path briefly
    highlightConnections(nodeId, true);
    setTimeout(()=> highlightConnections(nodeId, false), 1800);
  }

  /* -----------------------------
     Legend: render cluster swatches + click to highlight cluster
  -------------------------------*/
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
      item.addEventListener('click', ()=> toggleClusterHighlight(c.id));
      legendEl.appendChild(item);
    });
  }
  let activeCluster = null;
  function toggleClusterHighlight(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    // fade nodes not in cluster
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      if(!n.cluster && n.type !== 'root') n.el.style.opacity = activeCluster ? '0.24' : '';
      else if(activeCluster && n.cluster !== clusterId && n.type !== 'root') n.el.style.opacity = '0.24';
      else n.el.style.opacity = '';
    });
    // fade edges
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(!activeCluster) { p.style.opacity = ''; return; }
      const from = p.dataset.from, to = p.dataset.to;
      const f = nodeMap[from], t = nodeMap[to];
      // if either end belongs to cluster, highlight; else fade
      if((f && f.cluster === clusterId) || (t && t.cluster === clusterId)) {
        p.style.opacity = '1';
        p.style.stroke = '';
      } else {
        p.style.opacity = '0.08';
      }
    });
  }

  /* -----------------------------
     Wire UI controls (zoom, reset)
  -------------------------------*/
  function wireControls() {
    document.getElementById('zoom-in').addEventListener('click', ()=> setScale(Math.min(1.6, scale + 0.12)));
    document.getElementById('zoom-out').addEventListener('click', ()=> setScale(Math.max(0.5, scale - 0.12)));
    document.getElementById('reset-view').addEventListener('click', ()=> {
      setScale(1);
      stage.scrollLeft = 0; stage.scrollTop = 0;
      // un-fade nodes
      Object.values(nodeMap).forEach(n=> { if(n.el) n.el.style.opacity = ''; });
      const paths = svg.querySelectorAll('path.flow-line'); paths.forEach(p=> p.style.opacity='');
      activeCluster = null;
    });
  }

  /* -----------------------------
     Boot: compute layout, render, fit and wire events
  -------------------------------*/
  function boot() {
    layoutCompute();
    renderNodes();
    setupSvgDefs();
    drawEdges();
    renderLegend();
    initSearch();
    wireControls();
    fitCanvas(90);

    // animate edges by toggling class (already set by CSS .flow-anim)
    // highlight when hovering over any node (handled per node)
    // redrawing edges on window resize
    window.addEventListener('resize', ()=> { drawEdges(); fitCanvas(90); });
  }

  // expose programmatic API
  window.Leetree = {
    nodes, edges,
    addProblem: function (problem) { problems.push(problem); nodes.push({ id:problem.id, title:problem.title, sub:problem.sub, url:problem.url, type:'leaf', cluster:problem.cluster }); edges.push(['hub-'+problem.cluster, problem.id]); nodeMap[problem.id] = { id:problem.id, title:problem.title, sub:problem.sub, url:problem.url, type:'leaf', cluster:problem.cluster }; layoutCompute(); renderNodes(); drawEdges(); fitCanvas(90); },
    focusNode: focusNode,
    fit: ()=> fitCanvas(90)
  };

  // kick off
  boot();

})();
