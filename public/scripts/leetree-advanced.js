/* leetree-advanced.js - Robust updates:
   - Mobile: Single vertical column for hubs and leaves for tree structure. Increased row spacing, reduced widths.
   - Arrows: Enhanced Bezier with perpendicular lift for smoother curves. Precise start/end points (right of from, left of to for horizontal; adjust for vertical).
   - Tooltip: Fixed with e.currentTarget, preventDefault on touchstart to avoid unwanted focus.
   - Structured display: Root left, hubs in vertical succession right of root, leaves in vertical list right of hub for better organization.
   - Highlight on hover: Highlight full path from root to node using cluster color for stroke.
   - Robust arrows: drawEdges called on resize, drag end, and interval (every 500ms) if positions change.
   - Removed force layout and export to focus on robustness.
   - Added node drag redraw and fit.
   - Maintained all core functionalities intact.
*/

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
    { id: 'graph', label: 'Graph', color: '#8fd6ff' }
  ];

  const problems = [
    { id:'two-sum', title:'Two Sum', sub:'LC1 — Hash map', url:'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster:'sum' },
    { id:'two-sum-ii', title:'Two Sum II', sub:'LC167 — Sorted two-pointer', url:'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster:'sum' },
    { id:'3sum', title:'3Sum', sub:'LC15 — k-sum', url:'https://sanjay-patidar.vercel.app/three-sum', cluster:'twoPointers' },
    { id:'3closest', title:'3Sum Closest', sub:'LC16 — closest target', url:'https://sanjay-patidar.vercel.app/three-sum-closest', cluster:'twoPointers' },
    { id:'4sum', title:'4Sum', sub:'LC18 — k-sum extension', url:'#', cluster:'twoPointers' },
    { id:'anagram', title:'Find All Anagrams', sub:'LC438 — Fixed window', url:'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster:'window' },
    { id:'min-window', title:'Minimum Window', sub:'LC76 — Variable window', url:'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster:'window' },
    { id:'sliding-max', title:'Sliding Window Max', sub:'LC239 — Monotonic', url:'#', cluster:'window' },
    { id:'subarray-sum-k', title:'Subarray Sum K', sub:'LC560', url:'#', cluster:'prefix' },
    { id:'prefix-sum', title:'Prefix Sum Techniques', sub:'prefix-sum', url:'#', cluster:'prefix' },
    { id:'perm', title:'Permutations', sub:'LC46', url:'#', cluster:'backtracking' },
    { id:'comb-phone', title:'Letter Combinations', sub:'LC17', url:'#', cluster:'backtracking' },
    { id:'binary-search', title:'Binary Search', sub:'LC33', url:'#', cluster:'binary' },
    { id:'search-answer', title:'Search on Answer', sub:'LC875', url:'#', cluster:'binary' },
    { id:'climb', title:'Climbing Stairs', sub:'LC70', url:'#', cluster:'dp' },
    { id:'house-robber', title:'House Robber', sub:'LC198', url:'#', cluster:'dp' },
    { id:'islands', title:'Number of Islands', sub:'LC200', url:'#', cluster:'graph' },
    { id:'wordladder', title:'Word Ladder', sub:'LC127', url:'#', cluster:'graph' }
  ];

  // Sort problems for organization
  problems.sort((a, b) => a.title.localeCompare(b.title));

  const svg = document.getElementById('map-svg');
  const container = document.getElementById('map-nodes');
  const stage = document.getElementById('map-stage');
  const legendEl = document.getElementById('map-legend');
  const searchInput = document.getElementById('node-search');
  const problemButtons = document.getElementById('problem-buttons');
  const useWorkerBtn = document.getElementById('use-worker');

  const nodes = [];
  const edges = [];
  const nodeMap = {};
  let scale = 1;
  let worker = null;
  let workerEnabled = false;

  const NODE_W = isMobile ? 120 : 200;
  const NODE_H = isMobile ? 48 : 72;
  const PADDING = isMobile ? 24 : 96;

  function buildGraph() {
    nodes.length = 0; edges.length = 0;
    nodes.push({ id:'root', title:'DSA / Patterns', sub:'Start here', url:'#', type:'root', cluster:null });
    clusters.forEach(c => {
      nodes.push({ id:'hub-'+c.id, title:c.label, sub:'pattern hub', url:'#', type:'hub', cluster:c.id });
      edges.push(['root', 'hub-'+c.id]);
    });
    problems.forEach(p => {
      nodes.push({ id:p.id, title:p.title, sub:p.sub, url:p.url || '#', type:'leaf', cluster:p.cluster });
      edges.push(['hub-'+p.cluster, p.id]);
    });
    nodes.forEach(n => nodeMap[n.id] = n);
  }

  function computeGuidedPositions() {
    const rootX = PADDING, rootY = PADDING + 100;
    nodeMap['root'].x = rootX; nodeMap['root'].y = rootY;

    // Hubs in vertical succession right of root
    const hubIds = clusters.map(c => 'hub-'+c.id);
    const hubSpacing = isMobile ? 80 : 120;
    hubIds.forEach((hid, i) => {
      nodeMap[hid].x = rootX + (isMobile ? 240 : 320);
      nodeMap[hid].y = rootY + i * hubSpacing;
    });

    // Leaves in vertical list right of hub
    const group = {};
    nodes.forEach(n => { if(n.type === 'leaf') { group[n.cluster] = group[n.cluster] || []; group[n.cluster].push(n.id); } });
    Object.keys(group).forEach(clusterId => {
      const hub = nodeMap['hub-'+clusterId];
      const list = group[clusterId];
      const leafSpacing = isMobile ? 80 : 120;
      list.forEach((id, idx) => {
        nodeMap[id].x = hub.x + (isMobile ? 240 : 320);
        nodeMap[id].y = hub.y + idx * leafSpacing;
      });
    });
  }

  function resolveCollisionsAndLayout(doneCb) {
    const payload = nodes.map(n => ({ id:n.id, x:n.x, y:n.y }));
    if(workerEnabled && worker) {
      worker.postMessage({ type:'layout', nodes: payload });
      const onmsg = (ev) => {
        if(ev.data && ev.data.type === 'layout') {
          ev.data.nodes.forEach(p => { if(nodeMap[p.id]) { nodeMap[p.id].x = p.x; nodeMap[p.id].y = p.y; } });
          worker.removeEventListener('message', onmsg);
          doneCb && doneCb();
        }
      };
      worker.addEventListener('message', onmsg);
    } else {
      deterministicResolve(payload);
      payload.forEach(p => { if(nodeMap[p.id]) { nodeMap[p.id].x = p.x; nodeMap[p.id].y = p.y; }});
      doneCb && doneCb();
    }
  }

  function deterministicResolve(arr) {
    const NODE_W_LOCAL = NODE_W + 12, NODE_H_LOCAL = NODE_H + 12;
    const iters = 180;
    for(let it=0; it<iters; it++) {
      let moved = false;
      for(let i=0;i<arr.length;i++){
        const a = arr[i];
        for(let j=i+1;j<arr.length;j++){
          const b = arr[j];
          if(a.x + NODE_W_LOCAL <= b.x || b.x + NODE_W_LOCAL <= a.x || a.y + NODE_H_LOCAL <= b.y || b.y + NODE_H_LOCAL <= a.y) continue;
          const overlapX = Math.min(a.x + NODE_W_LOCAL, b.x + NODE_W_LOCAL) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + NODE_H_LOCAL, b.y + NODE_H_LOCAL) - Math.max(a.y, b.y);
          if(overlapX <=0 || overlapY <= 0) continue;
          const push = Math.min(overlapX, overlapY) / 2 + 6;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          a.x += (dx / dist) * push;
          a.y += (dy / dist) * push;
          b.x -= (dx / dist) * push;
          b.y -= (dy / dist) * push;
          moved = true;
        }
      }
      if(!moved) break;
    }
  }

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

      const accent = document.createElement('span');
      accent.className = 'cluster-accent';
      accent.style.background = n.cluster ? (clusters.find(c => c.id === n.cluster).color) : '#fff';
      accent.style.boxShadow = `0 6px 18px ${hexToRgba(accent.style.background, 0.12)}`;
      el.appendChild(accent);

      const t = document.createElement('span'); t.className='node-title'; t.textContent = n.title;
      const s = document.createElement('span'); s.className='node-sub'; s.textContent = n.sub || '';
      el.appendChild(t); el.appendChild(s);

      el.addEventListener('mouseenter', (e)=> { highlightPathConnections(n.id, true); showTooltip(e, n); });
      el.addEventListener('mouseleave', ()=> { highlightPathConnections(n.id, false); hideTooltip(); });
      el.addEventListener('touchstart', (e)=> { e.preventDefault(); highlightPathConnections(n.id, true); showTooltip(e, n); });
      el.addEventListener('touchend', (e)=> { highlightPathConnections(n.id, false); hideTooltip(); });
      el.addEventListener('click', (ev)=> {
        if(!n.url || n.url === '#') { ev.preventDefault(); focusNode(n.id); }
      });

      enableNodeDrag(el, n);

      container.appendChild(el);
      n.el = el;
    });
  }

  function setupSvgDefs() {
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');

    const filt = document.createElementNS(ns,'filter'); filt.setAttribute('id','map-glow'); filt.setAttribute('x','-50%'); filt.setAttribute('y','-50%'); filt.setAttribute('width','200%'); filt.setAttribute('height','200%');
    const fe = document.createElementNS(ns,'feGaussianBlur'); fe.setAttribute('stdDeviation','4.0'); fe.setAttribute('result','coloredBlur'); filt.appendChild(fe);
    const merge = document.createElementNS(ns,'feMerge'); const m1 = document.createElementNS(ns,'feMergeNode'); m1.setAttribute('in','coloredBlur'); const m2 = document.createElementNS(ns,'feMergeNode'); m2.setAttribute('in','SourceGraphic'); merge.appendChild(m1); merge.appendChild(m2); filt.appendChild(merge);
    defs.appendChild(filt);

    const marker = document.createElementNS(ns,'marker'); marker.setAttribute('id','map-arrow'); marker.setAttribute('viewBox','0 0 10 10'); marker.setAttribute('refX','10'); marker.setAttribute('refY','5'); marker.setAttribute('markerUnits','strokeWidth'); marker.setAttribute('markerWidth','6'); marker.setAttribute('markerHeight','6'); marker.setAttribute('orient','auto');
    const mpath = document.createElementNS(ns,'path'); mpath.setAttribute('d','M 0 0 L 10 5 L 0 10 z'); mpath.setAttribute('fill','rgba(255,255,255,0.18)'); marker.appendChild(mpath);
    defs.appendChild(marker);

    svg.appendChild(defs);
  }

  function drawEdges(initial = true) {
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if(defs) svg.appendChild(defs);

    edges.forEach(([from, to]) => {
      const f = nodeMap[from], t = nodeMap[to];
      if(!f || !t || !f.el || !t.el) return;
      const aRect = f.el.getBoundingClientRect();
      const bRect = t.el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      let x1 = aRect.right - parentRect.left - 10; // Right of from
      let y1 = aRect.top - parentRect.top + aRect.height / 2;
      let x2 = bRect.left - parentRect.left + 10; // Left of to
      let y2 = bRect.top - parentRect.top + bRect.height / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const normX = dx / dist;
      const normY = dy / dist;
      const perpX = -normY;
      const perpY = normX;
      const lift = Math.max(20, dist * 0.2);
      const cx1 = x1 + dx * 0.3 + perpX * lift * 0.6;
      const cy1 = y1 + dy * 0.3 + perpY * lift * 0.6;
      const cx2 = x1 + dx * 0.7 + perpX * lift * 0.4;
      const cy2 = y1 + dy * 0.7 + perpY * lift * 0.4;
      const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-line');
      if(f.type === 'hub' || t.type === 'hub') path.classList.add('flow-glow');
      path.setAttribute('marker-end', 'url(#map-arrow)');
      path.dataset.from = from; path.dataset.to = to;
      svg.appendChild(path);

      if(initial) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        requestAnimationFrame(()=> {
          path.classList.add('path-draw');
          path.style.strokeDashoffset = '0';
          setTimeout(()=> { path.classList.remove('path-draw'); path.classList.add('flow-anim'); }, 920);
        });
      } else {
        path.classList.add('flow-anim');
      }
    });
  }

  function highlightPathConnections(nodeId, on) {
    const path = findPathTo(nodeId);
    const pairs = [];
    for(let i=0; i<path.length-1; i++) pairs.push([path[i], path[i+1]]);
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach(p => {
      const from = p.dataset.from, to = p.dataset.to;
      const match = pairs.some(pair => pair[0] === from && pair[1] === to);
      if(match && on) {
        p.classList.add('flow-highlight');
        p.style.stroke = nodeMap[nodeId].cluster ? clusters.find(c => c.id === nodeMap[nodeId].cluster).color : '#fff';
        p.style.opacity = '1';
      } else if (match && !on) {
        p.classList.remove('flow-highlight');
        p.style.stroke = '';
        p.style.opacity = '';
      } else {
        p.style.opacity = on ? '0.12' : '';
      }
    });
    nodes.forEach(n => { if(n.el) n.el.style.opacity = (on && n.id !== nodeId) ? '0.6' : ''; });
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);
  function showTooltip(e, n) {
    tooltip.innerHTML = `<strong>${escapeHtml(n.title)}</strong><div style="margin-top:6px;font-size:12px;opacity:0.9">${escapeHtml(n.sub||'')}</div>`;
    tooltip.style.display = 'block';
    const rect = e.currentTarget.getBoundingClientRect();
    requestAnimationFrame(() => {
      tooltip.style.left = `${rect.left + window.pageXOffset + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.bottom + window.pageYOffset + 8}px`;
    });
  }
  function hideTooltip(){ tooltip.style.display = 'none'; }

  function fitCanvas(padding = PADDING) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if(!n.el) return;
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + NODE_W);
      maxY = Math.max(maxY, n.y + NODE_H);
    });
    if(minX === Infinity) { minX = 0; minY = 0; maxX = 1200; maxY = 800; }
    const width = Math.ceil((maxX - minX) + padding*2);
    const height = Math.ceil((maxY - minY) + padding*2);
    container.style.width = width + 'px'; container.style.height = height + 'px';
    svg.setAttribute('width', width); svg.setAttribute('height', height);

    const offsetX = padding - minX; const offsetY = padding - minY;
    nodes.forEach(n => {
      n.x += offsetX;
      n.y += offsetY;
      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
    });

    drawEdges(false);
    const stageW = stage.clientWidth, stageH = stage.clientHeight;
    const fitScale = Math.min(1, (stageW - 40) / width, (stageH - 40) / height);
    setScale(fitScale);
    stage.scrollLeft = Math.max(0, (width * fitScale - stageW) / 2);
    stage.scrollTop = Math.max(0, (height * fitScale - stageH) / 2);
  }

  function focusNode(nodeId) {
    const n = nodeMap[nodeId]; if(!n || !n.el) return;
    const cx = n.x + NODE_W / 2;
    const cy = n.y + NODE_H / 2;
    setScale(Math.min(1.12, Math.max(0.7, 1.0)));
    stage.scrollTo({ left: Math.max(0, cx*scale - stage.clientWidth / 2), top: Math.max(0, cy*scale - stage.clientHeight / 2), behavior:'smooth' });
    const path = findPathTo(nodeId);
    highlightPath(path, 1400);
  }

  function findPathTo(nodeId) {
    const path = [];
    let current = nodeId;
    while (current) {
      path.unshift(current);
      const edge = edges.find(e => e[1] === current);
      current = edge ? edge[0] : null;
    }
    return path;
  }

  function highlightPath(path, duration=1200) {
    const pairs = [];
    for(let i=0;i<path.length-1;i++) pairs.push([path[i], path[i+1]]);
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach(p => {
      const from = p.dataset.from, to = p.dataset.to;
      const match = pairs.some(pair => pair[0] === from && pair[1] === to);
      if(match) { p.classList.add('flow-highlight'); p.style.opacity = '1'; }
      else p.style.opacity = '0.12';
    });
    setTimeout(()=> {
      svgpaths.forEach(p => { p.classList.remove('flow-highlight'); p.style.opacity = ''; });
    }, duration);
  }

  let activeCluster = null;
  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach(c => {
      const item = document.createElement('div'); item.className = 'legend-item';
      const sw = document.createElement('div'); sw.className = 'legend-swatch'; sw.style.background = c.color;
      const label = document.createElement('div'); label.textContent = c.label;
      item.appendChild(sw); item.appendChild(label);
      item.addEventListener('click', ()=> toggleCluster(c.id));
      legendEl.appendChild(item);
    });
  }
  function toggleCluster(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    nodes.forEach(n => {
      if(!n.el) return;
      if(activeCluster && n.type !== 'root' && n.cluster !== activeCluster) n.el.style.opacity = '0.24';
      else n.el.style.opacity = '';
    });
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach(p => {
      if(!activeCluster) { p.style.opacity = ''; return; }
      const from = p.dataset.from, to = p.dataset.to;
      const f = nodeMap[from], t = nodeMap[to];
      if((f && f.cluster === activeCluster) || (t && t.cluster === activeCluster)) { p.style.opacity = '1'; p.style.stroke = ''; }
      else p.style.opacity = '0.06';
    });
  }

  function initSearch() {
    const flat = nodes.map(n => ({ id:n.id, title:n.title, sub:n.sub }));
    let currentFocus = -1;
    searchInput.addEventListener('input', function () {
      const val = this.value.trim().toLowerCase(); closeAllLists();
      if(!val) return;
      const list = document.createElement('div'); list.className = 'autocomplete-items'; document.body.appendChild(list);
      const inputRect = this.getBoundingClientRect();
      list.style.position = 'absolute';
      list.style.left = inputRect.left + 'px';
      list.style.top = (inputRect.bottom + window.pageYOffset) + 'px';
      list.style.width = inputRect.width + 'px';
      list.style.zIndex = '1000';
      const matches = flat.filter(it => it.title.toLowerCase().includes(val) || (it.sub||'').toLowerCase().includes(val));
      matches.slice(0,10).forEach(m => {
        const item = document.createElement('div'); item.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">${escapeHtml(m.sub||'')}</div>`;
        item.addEventListener('click', ()=> { searchInput.value = m.title; closeAllLists(); focusNode(m.id); });
        list.appendChild(item);
      });
    });
    searchInput.addEventListener('keydown', function(e) {
      const list = document.querySelector('.autocomplete-items'); if(!list) return;
      const items = list.getElementsByTagName('div');
      if(e.key === 'ArrowDown') { currentFocus++; addActive(items); e.preventDefault(); }
      else if(e.key === 'ArrowUp') { currentFocus--; addActive(items); e.preventDefault(); }
      else if(e.key === 'Enter') { e.preventDefault(); if(currentFocus > -1 && items[currentFocus]) items[currentFocus].click(); }
      function addActive(items) { if(!items) return; removeActive(items); if(currentFocus >= items.length) currentFocus = 0; if(currentFocus < 0) currentFocus = items.length-1; items[currentFocus].classList.add('autocomplete-active'); }
      function removeActive(items) { for(let it of items) it.classList.remove('autocomplete-active'); }
    });
    document.addEventListener('click', (e)=> { if (!searchInput.contains(e.target)) closeAllLists(); });
    function closeAllLists() { const items = document.getElementsByClassName('autocomplete-items'); for(let i=items.length-1; i>=0; i--) items[i].parentNode.removeChild(items[i]); }
  }

  function renderProblemButtons() {
    problemButtons.innerHTML = '';
    problems.forEach(p => {
      const btn = document.createElement('button'); btn.textContent = p.title; btn.title = p.sub || '';
      btn.addEventListener('click', ()=> { focusNode(p.id); });
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
      fitCanvas(PADDING);
    }
  }

  (function enablePan() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e)=> { if(e.target.closest('.node-box')) return; isDown=true; startX = e.pageX - stage.offsetLeft; startY = e.pageY - stage.offsetTop; scrollLeft = stage.scrollLeft; scrollTop = stage.scrollTop; stage.classList.add('dragging'); });
    window.addEventListener('mouseup', ()=> { isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e)=> { if(!isDown) return; const x = e.pageX - stage.offsetLeft; const y = e.pageY - stage.offsetTop; stage.scrollLeft = scrollLeft + (startX - x); stage.scrollTop = scrollTop + (startY - y); });
    stage.addEventListener('wheel', (e)=> { if(e.ctrlKey || e.metaKey) return; stage.scrollLeft += e.deltaY; e.preventDefault(); }, { passive:false });
  })();

  function setScale(s) { scale = s; container.style.transform = `scale(${scale})`; svg.style.transform = `scale(${scale})`; drawEdges(false); }

  document.getElementById('zoom-in').addEventListener('click', ()=> setScale(Math.min(1.6, scale + 0.12)));
  document.getElementById('zoom-out').addEventListener('click', ()=> setScale(Math.max(0.5, scale - 0.12)));
  document.getElementById('reset-view').addEventListener('click', ()=> { setScale(1); stage.scrollLeft = 0; stage.scrollTop = 0; nodes.forEach(n => { if(n.el) n.el.style.opacity=''; }); const paths = svg.querySelectorAll('path.flow-line'); paths.forEach(p => p.style.opacity=''); activeCluster = null; });

  useWorkerBtn.addEventListener('click', () => {
    if(!window.Worker) { alert('Web Worker not supported in this browser.'); return; }
    if(workerEnabled) {
      workerEnabled = false;
      useWorkerBtn.textContent = 'Use Worker';
      if(worker) { worker.terminate(); worker = null; }
    } else {
      try {
        worker = new Worker('/scripts/leetree-worker.js');
        workerEnabled = true; useWorkerBtn.textContent = 'Worker ON';
        worker.postMessage({ type:'init' });
      } catch(err) { console.error('Worker spawn failed', err); alert('Failed to start worker'); workerEnabled = false; useWorkerBtn.textContent = 'Use Worker'; }
    }
  });

  function escapeHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function hexToRgba(hex, a=1) { const h=hex.replace('#',''); const bi=parseInt(h,16); return `rgba(${(bi>>16)&255},${(bi>>8)&255},${bi&255},${a})`; }

  function boot() {
    buildGraph();
    computeGuidedPositions();
    renderNodes();
    setupSvgDefs();
    resolveCollisionsAndLayout(()=> {
      nodes.forEach(n => {
        if(!n.el) return;
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
    window.addEventListener('resize', ()=> {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(()=> { computeGuidedPositions(); fitCanvas(PADDING); drawEdges(false); }, 200);
    });
    // Interval for robust redraw
    setInterval(()=> { drawEdges(false); }, 500);
  }

  boot();

  window.Leetree = {
    focusNode: focusNode,
    addProblem: function(p) {
      problems.push(p); nodes.push({ id:p.id, title:p.title, sub:p.sub, url:p.url || '#', type:'leaf', cluster:p.cluster}); edges.push(['hub-'+p.cluster, p.id]); nodeMap[p.id] = nodes.find(n=>n.id===p.id);
      computeGuidedPositions();
      resolveCollisionsAndLayout(()=> {
        renderNodes(); setupSvgDefs(); drawEdges(true); fitCanvas(PADDING); renderProblemButtons();
      });
    },
    toggleWorker: function(enable) { useWorkerBtn.click(); }
  };
})();
