/**
 * leetree-force-curve.js
 * - Force-directed layout vanilla JS
 * - Curved animated SVG arrows (cubic Bezier)
 * - Node drag, pan, zoom, search, legend, cluster highlighting
 *
 * Drop this file in /scripts/ and include it after the HTML.
 *
 * Notes: The simulation uses O(n^2) repulsion. Reasonable for ~100 nodes.
 * For many hundreds of nodes, we can switch to Barnes-Hut quadtrees or WebWorker offload.
 */

(function () {
  // ---------- Config ----------
  const CLUSTERS = [
    { id:'sum', label:'Sum & Pair', color:'#ff7b7b' },
    { id:'twoPointers', label:'Two Pointers', color:'#b6ff7b' },
    { id:'window', label:'Sliding Window', color:'#7bd1ff' },
    { id:'prefix', label:'Prefix & Subarray', color:'#ffd47b' },
    { id:'back', label:'Backtracking', color:'#cba6ff' },
    { id:'binary', label:'Binary Search', color:'#7bffd9' },
    { id:'dp', label:'Dynamic Programming', color:'#ffb6e0' },
    { id:'graph', label:'Graph', color:'#8fd6ff' }
  ];

  // Representative problems (add or remove as you like)
  const PROBLEMS = [
    // Sum & Pair
    { id:'two-sum', title:'Two Sum (LC1)', sub:'Hash map / indices', url:'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster:'sum' },
    { id:'two-sum-ii', title:'Two Sum II (LC167)', sub:'Sorted two-pointer', url:'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster:'sum' },
    { id:'four-sum', title:'4Sum (LC18)', sub:'k-sum expand', url:'#', cluster:'sum' },

    // Two-pointers family
    { id:'3sum', title:'3Sum (LC15)', sub:'Two-pointer after sort', url:'https://sanjay-patidar.vercel.app/three-sum', cluster:'twoPointers' },
    { id:'3closest', title:'3Sum Closest (LC16)', sub:'closest target', url:'https://sanjay-patidar.vercel.app/three-sum-closest', cluster:'twoPointers' },

    // Sliding Window
    { id:'anagram', title:'Find All Anagrams (LC438)', sub:'Fixed window', url:'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster:'window' },
    { id:'min-window', title:'Minimum Window (LC76)', sub:'Variable window', url:'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster:'window' },
    { id:'longest-substring', title:'Longest Substring (LC3)', sub:'Sliding-window unique', url:'#', cluster:'window' },

    // Prefix / Subarray
    { id:'subarray-sum-k', title:'Subarray Sum Equals K (LC560)', sub:'Prefix + map', url:'#', cluster:'prefix' },
    { id:'prefix-sum', title:'Prefix Sum Techniques', sub:'Cum-sum usage', url:'#', cluster:'prefix' },

    // Backtracking
    { id:'perm', title:'Permutations (LC46)', sub:'Recursive trees', url:'#', cluster:'back' },
    { id:'comb-phone', title:'Letter Combinations (LC17)', sub:'Backtracking / combos', url:'#', cluster:'back' },
    { id:'subsets', title:'Subsets (LC78)', sub:'Decision tree', url:'#', cluster:'back' },

    // Binary Search
    { id:'binary-search', title:'Binary Search (LC33)', sub:'Search basics', url:'#', cluster:'binary' },
    { id:'search-answer', title:'Search-on-Answer (LC875)', sub:'Search by feasibility', url:'#', cluster:'binary' },

    // DP
    { id:'climb', title:'Climbing Stairs (LC70)', sub:'1D DP', url:'#', cluster:'dp' },
    { id:'house-robber', title:'House Robber (LC198)', sub:'1D DP', url:'#', cluster:'dp' },
    { id:'lis', title:'LIS (LC300)', sub:'Sequence DP', url:'#', cluster:'dp' },

    // Graph
    { id:'islands', title:'Number of Islands (LC200)', sub:'Grid BFS/DFS', url:'#', cluster:'graph' },
    { id:'word-ladder', title:'Word Ladder (LC127)', sub:'BFS levels', url:'#', cluster:'graph' },
    { id:'clone-graph', title:'Clone Graph (LC133)', sub:'Graph traversal', url:'#', cluster:'graph' }
  ];

  // Build nodes + edges: root -> hubs -> problems. Also add some cross-links to showcase flow
  const nodes = [];
  const edges = [];

  // root node
  nodes.push({ id:'root', title:'DSA / Patterns', sub:'Start here', type:'root', cluster:null });

  // hubs
  CLUSTERS.forEach(c => {
    nodes.push({ id:'hub-'+c.id, title:c.label, sub:'pattern hub', type:'hub', cluster:c.id });
    edges.push(['root','hub-'+c.id]);
  });

  // problems -> nodes & edges hub->problem
  PROBLEMS.forEach(p => {
    nodes.push({ id:p.id, title:p.title, sub:p.sub, url:p.url || '#', type:'leaf', cluster:p.cluster });
    edges.push(['hub-'+p.cluster, p.id]);
  });

  // add some cross-links (illustrate progression flows)
  edges.push(['hub-sum','hub-twoPointers']);
  edges.push(['hub-twoPointers','hub-window']);
  edges.push(['hub-window','hub-prefix']);
  edges.push(['hub-prefix','hub-dp']);
  edges.push(['hub-back','hub-binary']);
  edges.push(['hub-graph','hub-dp']); // graph -> dp cross link

  // ----------------- DOM refs -----------------
  const svg = document.getElementById('map-svg');
  const container = document.getElementById('map-nodes');
  const stage = document.getElementById('map-stage');
  const legendEl = document.getElementById('map-legend');
  const searchInput = document.getElementById('node-search');

  // maps
  const nodeMap = {}; // id -> node object (with position, velocity, el)
  nodes.forEach(n => { nodeMap[n.id] = Object.assign({}, n); });

  // simulation params (tweak if needed)
  const REPULSION = 120000;   // repulsion strength
  const SPRING_LEN = 180;     // natural length for edges
  const SPRING_STRENGTH = 0.012; // spring stiffness
  const DAMPING = 0.85;       // velocity damping
  const CENTERING = 0.0025;   // small force to keep graph centered
  let running = true;         // toggle layout
  let animationFrameId = null;

  // initialize positions randomly in a band (left-to-right)
  function randomInitPositions() {
    const W = 1400; const H = 700;
    for (let id in nodeMap) {
      const n = nodeMap[id];
      n.x = Math.random() * W;
      n.y = Math.random() * H;
      n.vx = 0; n.vy = 0;
      n.fx = 0; n.fy = 0;
    }
  }

  // create DOM nodes
  function renderNodes() {
    container.innerHTML = '';
    nodes.forEach(n => {
      const obj = nodeMap[n.id];
      const el = document.createElement('a');
      el.className = 'node-box ' + (n.type === 'root' ? 'root-node' : (n.type==='hub' ? 'hub-node' : 'leaf-node'));
      el.dataset.id = n.id;
      el.href = n.url || '#';
      el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
      el.innerHTML = `<span class="cluster-accent"></span><span class="node-title">${n.title}</span><span class="node-sub">${n.sub||''}</span>`;
      // initial placement; will be moved by simulation
      el.style.left = (n.x || 0) + 'px';
      el.style.top = (n.y || 0) + 'px';
      el.classList.add('node-float');
      container.appendChild(el);
      obj.el = el;

      // node drag to fix position
      makeDraggable(el, obj);

      // hover interactions
      el.addEventListener('mouseenter', (e)=> { highlightConnections(n.id, true); showTooltip(e, n); });
      el.addEventListener('mouseleave', ()=> { highlightConnections(n.id, false); hideTooltip(); });
      el.addEventListener('click', (ev)=> { /* default: follow link */ });
    });
    // set cluster accent colors
    nodes.forEach(n => {
      const accent = nodeMap[n.id].el.querySelector('.cluster-accent');
      const col = n.cluster ? CLUSTERS.find(c=>c.id===n.cluster).color : '#ffffff';
      accent.style.background = col;
      accent.style.boxShadow = `0 8px 24px ${hexToRgba(col, 0.12)}`;
    });
  }

  // add SVG defs (arrow marker)
  function createDefs() {
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
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

  // draw all edges as curved paths
  function drawEdges() {
    // remove old edges but keep defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if(defs) svg.appendChild(defs);

    edges.forEach(([fromId,toId]) => {
      const f = nodeMap[fromId];
      const t = nodeMap[toId];
      if(!f || !t || !f.el || !t.el) return;
      const rect = container.getBoundingClientRect();
      const a = f.el.getBoundingClientRect();
      const b = t.el.getBoundingClientRect();
      const x1 = a.left - rect.left + a.width/2;
      const y1 = a.top - rect.top + a.height/2;
      const x2 = b.left - rect.left + b.width/2;
      const y2 = b.top - rect.top + b.height/2;
      const dx = x2 - x1;
      const lift = Math.max(60, Math.abs(dx) * 0.18);
      const cx1 = x1 + dx * 0.28;
      const cy1 = y1 - lift;
      const cx2 = x1 + dx * 0.72;
      const cy2 = y2 - lift * 0.6;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
      path.setAttribute('class','flow-line flow-anim');
      path.setAttribute('marker-end','url(#arrowhead)');
      path.dataset.from = fromId;
      path.dataset.to = toId;
      svg.appendChild(path);
    });
  }

  // highlight edges & dim other nodes on hover
  function highlightConnections(id, on) {
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(p.dataset.from === id || p.dataset.to === id) {
        p.classList.toggle('flow-highlight', on);
        p.style.opacity = on ? '1' : '';
      } else {
        p.style.opacity = on ? '0.14' : '';
      }
    });
    // dim other nodes
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      if(on && n.id !== id) n.el.style.opacity = '0.6';
      else n.el.style.opacity = '';
    });
  }

  // tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);
  function showTooltip(e, n) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<strong>${escapeHtml(n.title)}</strong>
      <div style="font-size:12px;opacity:0.9;margin-top:6px;">${escapeHtml(n.sub||'')}</div>
      <div style="font-size:11px;opacity:0.8;margin-top:6px;">${n.url && n.url!=='#' ? 'Open link' : 'Placeholder'}</div>`;
    const r = e.target.getBoundingClientRect();
    tooltip.style.left = Math.max(12, r.left + window.scrollX + 12) + 'px';
    tooltip.style.top = Math.max(12, r.top + window.scrollY - 8) + 'px';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }

  // ---------- Force simulation ----------
  function stepSimulation() {
    // reset force accumulators
    for (let id in nodeMap) {
      const n = nodeMap[id];
      n.fx = 0; n.fy = 0;
    }

    // repulsive forces (Coulomb-like) — O(n^2)
    const ids = Object.keys(nodeMap);
    for (let i=0;i<ids.length;i++) {
      const ni = nodeMap[ids[i]];
      for (let j=i+1;j<ids.length;j++) {
        const nj = nodeMap[ids[j]];
        const dx = ni.x - nj.x;
        const dy = ni.y - nj.y;
        let dist2 = dx*dx + dy*dy;
        if(dist2 < 1) dist2 = 1;
        const dist = Math.sqrt(dist2);
        const force = REPULSION / dist2; // inversely proportional to distance squared
        const ux = dx / dist;
        const uy = dy / dist;
        ni.fx += ux * force;
        ni.fy += uy * force;
        nj.fx -= ux * force;
        nj.fy -= uy * force;
      }
    }

    // attractive forces along edges (Hooke's law)
    edges.forEach(([aId,bId]) => {
      const a = nodeMap[aId];
      const b = nodeMap[bId];
      if(!a || !b) return;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const delta = dist - SPRING_LEN;
      const nx = dx / dist;
      const ny = dy / dist;
      const f = SPRING_STRENGTH * delta;
      // apply to nodes
      a.fx += nx * f;
      a.fy += ny * f;
      b.fx -= nx * f;
      b.fy -= ny * f;
    });

    // centering small force (pull towards stage center)
    const stageRect = stage.getBoundingClientRect();
    const centerX = (stageRect.width)/2;
    const centerY = (stageRect.height)/2;
    for (let id in nodeMap) {
      const n = nodeMap[id];
      // small centering force proportional to displacement from center-of-stage
      n.fx += (centerX - n.x) * CENTERING;
      n.fy += (centerY - n.y) * CENTERING;
    }

    // integrate: semi-implicit Euler
    for (let id in nodeMap) {
      const n = nodeMap[id];
      // skip pinned nodes (if dragging) — check element dataset
      if(n._pinned) { n.vx = 0; n.vy = 0; continue; }
      // velocity
      n.vx = (n.vx + n.fx) * DAMPING;
      n.vy = (n.vy + n.fy) * DAMPING;
      // update position
      n.x += n.vx * 0.016; // timestep factor
      n.y += n.vy * 0.016;
    }
  }

  // update DOM positions & edges
  function renderFrame() {
    for (let id in nodeMap) {
      const n = nodeMap[id];
      if(!n.el) continue;
      n.el.style.left = (n.x) + 'px';
      n.el.style.top = (n.y) + 'px';
    }
    drawEdges();
  }

  // run simulation loop
  function runLoop() {
    if(running) {
      stepSimulation();
      renderFrame();
    }
    animationFrameId = requestAnimationFrame(runLoop);
  }

  // start simulation
  function startSimulation() {
    if(animationFrameId) cancelAnimationFrame(animationFrameId);
    running = true;
    runLoop();
  }
  function stopSimulation() {
    running = false;
  }

  // toggles
  document.getElementById('relax-toggle').addEventListener('click', ()=> {
    running = !running;
    document.getElementById('relax-toggle').textContent = running ? 'Pause Layout' : 'Resume Layout';
  });

  // Node drag to fix positions (mousedown on node)
  function makeDraggable(el, nodeObj) {
    let isDown = false, startX=0, startY=0, origX=0, origY=0;
    el.addEventListener('mousedown', (e)=> {
      isDown = true;
      nodeObj._pinned = true; // pinned during drag
      startX = e.pageX; startY = e.pageY;
      origX = nodeObj.x; origY = nodeObj.y;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e)=> {
      if(!isDown) return;
      const dx = e.pageX - startX;
      const dy = e.pageY - startY;
      nodeObj.x = origX + dx;
      nodeObj.y = origY + dy;
      nodeObj.vx = 0; nodeObj.vy = 0;
    });
    window.addEventListener('mouseup', ()=> {
      if(isDown) {
        isDown = false; nodeObj._pinned = false;
      }
    });
  }

  // highlight cluster via legend click
  function renderLegend() {
    legendEl.innerHTML = '';
    CLUSTERS.forEach(c => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div'); sw.className='legend-swatch'; sw.style.background = c.color;
      const label = document.createElement('div'); label.textContent = c.label;
      item.appendChild(sw); item.appendChild(label);
      item.addEventListener('click', ()=> toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }
  let activeCluster = null;
  function toggleCluster(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    Object.values(nodeMap).forEach(n => {
      if(!n.el) return;
      if(!n.cluster && n.type!=='root') n.el.style.opacity = activeCluster ? '0.22' : '';
      else if(activeCluster && n.cluster !== clusterId && n.type!=='root') n.el.style.opacity = '0.22';
      else n.el.style.opacity = '';
    });
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(!activeCluster) { p.style.opacity = ''; p.style.stroke=''; return; }
      const from = p.dataset.from, to = p.dataset.to;
      const f = nodeMap[from], t = nodeMap[to];
      if((f && f.cluster === clusterId) || (t && t.cluster === clusterId)) {
        p.style.opacity = '1'; p.style.stroke = '';
      } else {
        p.style.opacity = '0.06';
      }
    });
  }

  // search & center (simple autocomplete)
  function initSearch() {
    const flat = nodes.map(n => ({ id: n.id, title: n.title, sub: n.sub||'' }));
    let currentFocus = -1;
    searchInput.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      closeList();
      if(!val) return;
      const list = document.createElement('div'); list.id='autocomplete-list'; list.className='autocomplete-items';
      this.parentNode.appendChild(list);
      const matches = flat.filter(item => item.title.toLowerCase().includes(val) || (item.sub||'').toLowerCase().includes(val));
      matches.slice(0,8).forEach(m => {
        const itemEl = document.createElement('div');
        itemEl.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">${escapeHtml(m.sub||'')}</div>`;
        itemEl.addEventListener('click', ()=> { searchInput.value = m.title; closeList(); focusNode(m.id); });
        list.appendChild(itemEl);
      });
    });
    searchInput.addEventListener('keydown', (e)=> {
      const list = document.getElementById('autocomplete-list'); if(!list) return;
      const items = list.getElementsByTagName('div');
      if(e.key==='ArrowDown') { currentFocus++; addActive(items); e.preventDefault(); }
      else if(e.key==='ArrowUp') { currentFocus--; addActive(items); e.preventDefault(); }
      else if(e.key==='Enter') { e.preventDefault(); if(currentFocus > -1 && items[currentFocus]) items[currentFocus].click(); }
    });
    function addActive(items) { if(!items) return; removeActive(items); if(currentFocus>=items.length) currentFocus=0; if(currentFocus<0) currentFocus=items.length-1; items[currentFocus].classList.add('autocomplete-active'); }
    function removeActive(items) { for(let it of items) it.classList.remove('autocomplete-active'); }
    function closeList(el) { const items = document.getElementsByClassName('autocomplete-items'); while(items.length) items[0].parentNode.removeChild(items[0]); currentFocus=-1; }
    document.addEventListener('click', ()=> closeList());
  }

  // center & zoom to node
  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if(!n || !n.el) return;
    const rect = n.el.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    const cx = (rect.left - parentRect.left) + rect.width/2;
    const cy = (rect.top - parentRect.top) + rect.height/2;
    // zoom in a little and center
    const targetScale = Math.min(1.05, Math.max(0.6, 0.95));
    setScale(targetScale);
    stage.scrollTo({ left: Math.max(0, cx * targetScale - stage.clientWidth/2), top: Math.max(0, cy * targetScale - stage.clientHeight/2), behavior:'smooth' });
    highlightConnections(nodeId, true);
    setTimeout(()=> highlightConnections(nodeId, false), 1400);
  }

  // zoom control
  let scale = 1;
  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale})`;
    svg.style.transform = `scale(${scale})`;
  }
  document.getElementById('zoom-in').addEventListener('click', ()=> setScale(Math.min(1.6, scale + 0.12)));
  document.getElementById('zoom-out').addEventListener('click', ()=> setScale(Math.max(0.5, scale - 0.12)));
  document.getElementById('reset-view').addEventListener('click', ()=> { setScale(1); stage.scrollLeft=0; stage.scrollTop=0; });

  // pan/drag the stage
  (function enableStagePan() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e)=> {
      if(e.target.closest('.node-box')) return;
      isDown=true; stage.classList.add('dragging');
      startX = e.pageX - stage.offsetLeft; startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft; scrollTop = stage.scrollTop;
      e.preventDefault();
    });
    window.addEventListener('mouseup', ()=> { isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e)=> {
      if(!isDown) return;
      const x = e.pageX - stage.offsetLeft; const y = e.pageY - stage.offsetTop;
      stage.scrollLeft = scrollLeft + (startX - x); stage.scrollTop = scrollTop + (startY - y);
    });
    stage.addEventListener('wheel', (e)=> { if(e.ctrlKey || e.metaKey) return; stage.scrollLeft += e.deltaY; e.preventDefault(); }, { passive:false });
  })();

  // draw everything and start
  function boot() {
    randomInitPositions();
    renderNodes();
    createDefs();
    drawEdges();
    renderLegend();
    initSearch();
    startSimulation();
    // re-draw edges on window resize to adapt to layout
    window.addEventListener('resize', ()=> { drawEdges(); });
  }

  // render legend
  function renderLegend() {
    legendEl.innerHTML = '';
    CLUSTERS.forEach(c => {
      const item = document.createElement('div'); item.className='legend-item';
      const sw = document.createElement('div'); sw.className='legend-swatch'; sw.style.background = c.color;
      const label = document.createElement('div'); label.textContent = c.label;
      item.appendChild(sw); item.appendChild(label);
      item.addEventListener('click', ()=> toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }

  // toggle cluster highlight
  function toggleCluster(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    Object.values(nodeMap).forEach(n => { if(!n.el) return; if(!n.cluster && n.type!=='root') n.el.style.opacity = activeCluster ? '0.22' : ''; else if(activeCluster && n.cluster !== clusterId && n.type!=='root') n.el.style.opacity = '0.22'; else n.el.style.opacity = ''; });
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(!activeCluster) { p.style.opacity = ''; p.style.stroke = ''; return; }
      const f = nodeMap[p.dataset.from], t = nodeMap[p.dataset.to];
      if((f && f.cluster===clusterId) || (t && t.cluster===clusterId)) { p.style.opacity='1'; p.style.stroke=''; } else { p.style.opacity='0.06'; }
    });
  }

  // utility: hex to rgba
  function hexToRgba(hex, a=1){ const h = hex.replace('#',''); const bi = parseInt(h,16); const r=(bi>>16)&255,g=(bi>>8)&255,b=bi&255; return `rgba(${r},${g},${b},${a})`; }
  function escapeHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  // autocomplete & search wrapper
  function initSearch(){
    const flat = nodes.map(n=>({id:n.id,title:n.title,sub:n.sub||''}));
    let currentFocus=-1;
    searchInput.addEventListener('input', function(){
      const val = this.value.trim().toLowerCase(); closeAll(); if(!val) return;
      const wrap = document.createElement('div'); wrap.id='autocomplete-list'; wrap.className='autocomplete-items'; this.parentNode.appendChild(wrap);
      const matches = flat.filter(x=> x.title.toLowerCase().includes(val) || (x.sub||'').toLowerCase().includes(val));
      matches.slice(0,10).forEach(m=>{
        const el = document.createElement('div'); el.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">${escapeHtml(m.sub||'')}</div>`; el.addEventListener('click', ()=> { searchInput.value = m.title; closeAll(); focusNode(m.id); }); wrap.appendChild(el);
      });
    });
    searchInput.addEventListener('keydown', function(e){
      const list = document.getElementById('autocomplete-list'); if(!list) return;
      const items = list.getElementsByTagName('div'); if(e.key==='ArrowDown'){ currentFocus++; addActive(items); e.preventDefault(); } else if(e.key==='ArrowUp'){ currentFocus--; addActive(items); e.preventDefault(); } else if(e.key==='Enter'){ e.preventDefault(); if(currentFocus> -1 && items[currentFocus]) items[currentFocus].click(); }
    });
    function addActive(items){ if(!items) return; removeActive(items); if(currentFocus >= items.length) currentFocus=0; if(currentFocus <0) currentFocus = items.length-1; items[currentFocus].classList.add('autocomplete-active'); }
    function removeActive(items){ for(let it of items) it.classList.remove('autocomplete-active'); }
    function closeAll(){ const old = document.getElementsByClassName('autocomplete-items'); while(old.length) old[0].parentNode.removeChild(old[0]); currentFocus=-1; }
    document.addEventListener('click', ()=> closeAll());
  }

  // center + zoom to node
  function focusNode(id){
    const n = nodeMap[id]; if(!n || !n.el) return;
    const r = n.el.getBoundingClientRect(); const parentRect = container.getBoundingClientRect();
    const cx = (r.left - parentRect.left) + r.width/2; const cy = (r.top - parentRect.top) + r.height/2;
    const targetScale = Math.min(1.05, Math.max(0.7, 0.95)); setScale(targetScale);
    stage.scrollTo({ left: Math.max(0, cx*targetScale - stage.clientWidth/2), top: Math.max(0, cy*targetScale - stage.clientHeight/2), behavior:'smooth' });
    highlightConnections(id, true); setTimeout(()=> highlightConnections(id,false), 1800);
  }

  // stage pan already implemented; implement drawEdges call periodically to animate stroke
  // trigger drawEdges periodically
  function drawEdges() {
    // Clear paths (keep defs)
    const defs = svg.querySelector('defs'); svg.innerHTML=''; if(defs) svg.appendChild(defs);

    const rect = container.getBoundingClientRect();
    edges.forEach(([fromId,toId])=>{
      const f = nodeMap[fromId], t = nodeMap[toId];
      if(!f || !t || !f.el || !t.el) return;
      const a = f.el.getBoundingClientRect(), b = t.el.getBoundingClientRect();
      const x1 = a.left - rect.left + a.width/2, y1 = a.top - rect.top + a.height/2;
      const x2 = b.left - rect.left + b.width/2, y2 = b.top - rect.top + b.height/2;
      const dx = x2 - x1;
      const lift = Math.max(50, Math.abs(dx)*0.18);
      const cx1 = x1 + dx*0.28; const cy1 = y1 - lift;
      const cx2 = x1 + dx*0.72; const cy2 = y2 - lift*0.6;
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
      path.setAttribute('class','flow-line flow-anim');
      path.setAttribute('marker-end','url(#arrowhead)');
      path.dataset.from = fromId; path.dataset.to = toId;
      svg.appendChild(path);
    });
  }

  // run everything: init DOM + sim
  function init() {
    // initial random positions in band
    randomInitPositions();
    renderNodes();
    createDefs();
    drawEdges();
    renderLegend();
    initSearch();
    startSimulation();
  }

  // start/stop sim
  function startSimulation(){ if(animationFrameId) cancelAnimationFrame(animationFrameId); running = true; loop(); }
  function loop(){
    if(running) { stepSimulation(); renderFrame(); }
    animationFrameId = requestAnimationFrame(loop);
  }
  function stopSimulation(){ running = false; }

  // render frame positions + edges
  function renderFrame(){
    for (let id in nodeMap) { const n = nodeMap[id]; if(!n.el) continue; n.el.style.left = n.x + 'px'; n.el.style.top = n.y + 'px'; }
    drawEdges();
  }

  // small helpers
  function makeDefs(){ const defs = document.createElementNS('http://www.w3.org/2000/svg','defs'); const marker = document.createElementNS('http://www.w3.org/2000/svg','marker'); marker.setAttribute('id','arrowhead'); marker.setAttribute('viewBox','0 0 10 10'); marker.setAttribute('refX','10'); marker.setAttribute('refY','5'); marker.setAttribute('markerUnits','strokeWidth'); marker.setAttribute('markerWidth','8'); marker.setAttribute('markerHeight','8'); marker.setAttribute('orient','auto'); const path = document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d','M 0 0 L 10 5 L 0 10 z'); path.setAttribute('fill','rgba(255,255,255,0.18)'); marker.appendChild(path); defs.appendChild(marker); svg.appendChild(defs); }
  function createDefs(){ while(svg.firstChild) svg.removeChild(svg.firstChild); makeDefs(); }

  // kick-off: create legend & UI wiring
  function renderLegend(){
    legendEl.innerHTML = '';
    CLUSTERS.forEach(c => {
      const item = document.createElement('div'); item.className='legend-item';
      const sw = document.createElement('div'); sw.className='legend-swatch'; sw.style.background = c.color;
      const l = document.createElement('div'); l.textContent = c.label;
      item.appendChild(sw); item.appendChild(l);
      item.addEventListener('click', ()=> toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }

  // simple helpers used earlier (hexToRgba etc)
  function hexToRgba(hex,a=1){ const h=hex.replace('#',''); const bi=parseInt(h,16); const r=(bi>>16)&255,g=(bi>>8)&255,b=bi&255; return `rgba(${r},${g},${b},${a})`; }
  function escapeHtml(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  // run
  init();

  // Expose API for adding nodes / focusing from console
  window.LeetreeForce = {
    focusNode: function(id){ focusNode(id); },
    addProblem: function(p){ PROBLEMS.push(p); nodes.push({ id:p.id, title:p.title, sub:p.sub, url:p.url, type:'leaf', cluster:p.cluster }); edges.push(['hub-'+p.cluster,p.id]); nodeMap[p.id] = Object.assign({}, p); nodeMap[p.id].x = Math.random()*1000; nodeMap[p.id].y = Math.random()*600; renderNodes(); createDefs(); drawEdges(); },
    pause: function(){ running=false; },
    resume: function(){ running=true; }
  };

})();
