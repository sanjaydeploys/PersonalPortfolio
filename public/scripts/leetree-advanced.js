/* Updated leetree-advanced.js with further fixes:
   - Added touch events for tooltip on mobile (touchstart for show, touchend for hide).
   - Refined curve in drawEdges: Adjusted lift and control points for better directionality, especially when dy is large (more vertical).
   - Improved fitCanvas: Added dynamic stage height based on window.innerHeight, subtracted header heights, ensured no white space by setting min scale carefully.
   - Search autocomplete: Made it overlay by styling in CSS (position:absolute), appended to body for better positioning.
   - Mobile layout: Further reduced spacings, made hub columns 1 on mobile for more vertical tree.
   - Maintained all functionalities.
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

  const NODE_W = isMobile ? 140 : 200;
  const NODE_H = isMobile ? 50 : 72;
  const PADDING = isMobile ? 32 : 96;

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
    const rootX = PADDING, rootY = (stage.clientHeight / 2) || 220;
    nodeMap['root'].x = rootX; nodeMap['root'].y = rootY;

    const hubIds = clusters.map(c => 'hub-'+c.id);
    const hubCount = hubIds.length;
    const hubCols = isMobile ? 1 : 2;
    const hubPerCol = Math.ceil(hubCount / hubCols);
    const colSpacing = isMobile ? 240 : 360;
    const rowSpacing = isMobile ? 80 : 110;
    const startY = rootY - ((hubPerCol - 1) / 2) * rowSpacing;
    hubIds.forEach((hid, i) => {
      const col = Math.floor(i / hubPerCol);
      const row = i % hubPerCol;
      nodeMap[hid].x = rootX + colSpacing + col * colSpacing;
      nodeMap[hid].y = startY + row * rowSpacing;
    });

    const group = {};
    nodes.forEach(n => { if(n.type === 'leaf') { group[n.cluster] = group[n.cluster] || []; group[n.cluster].push(n.id); } });
    Object.keys(group).forEach(clusterId => {
      const hub = nodeMap['hub-'+clusterId];
      const list = group[clusterId];
      const maxRows = isMobile ? 4 : 4;
      const rows = Math.min(maxRows, list.length);
      const cols = Math.ceil(list.length / rows);
      const leafSpacingX = isMobile ? 160 : 220;
      const leafSpacingY = isMobile ? 70 : 110;
      list.forEach((id, idx) => {
        const r = idx % rows;
        const c = Math.floor(idx / rows);
        const x = hub.x + 160 + c * leafSpacingX;
        const y = hub.y - ((rows - 1) / 2) * leafSpacingY + r * leafSpacingY;
        nodeMap[id].x = x;
        nodeMap[id].y = y;
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
    const NODE_W_LOCAL = NODE_W + 20, NODE_H_LOCAL = NODE_H + 20;
    const iters = 160;
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
          const push = Math.min(overlapX, overlapY) / 2 + 8;
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

      el.addEventListener('mouseenter', (e)=> { highlightConnections(n.id, true); showTooltip(e, n); });
      el.addEventListener('mouseleave', ()=> { highlightConnections(n.id, false); hideTooltip(); });
      el.addEventListener('touchstart', (e)=> { highlightConnections(n.id, true); showTooltip(e, n); });
      el.addEventListener('touchend', ()=> { highlightConnections(n.id, false); hideTooltip(); });
      el.addEventListener('click', (ev)=> {
        if(!n.url || n.url === '#') { ev.preventDefault(); focusNode(n.id); }
      });

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

    const marker = document.createElementNS(ns,'marker'); marker.setAttribute('id','map-arrow'); marker.setAttribute('viewBox','0 0 10 10'); marker.setAttribute('refX','10'); marker.setAttribute('refY','5'); marker.setAttribute('markerUnits','strokeWidth'); marker.setAttribute('markerWidth','8'); marker.setAttribute('markerHeight','8'); marker.setAttribute('orient','auto');
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
      let x1 = aRect.left - parentRect.left + aRect.width / 2;
      let y1 = aRect.top - parentRect.top + aRect.height / 2;
      let x2 = bRect.left - parentRect.left + bRect.width / 2;
      let y2 = bRect.top - parentRect.top + bRect.height / 2;

      if (Math.abs(x1 - x2) < 20) {
        if (y1 < y2) {
          y1 += aRect.height / 2 - 10;
          y2 -= bRect.height / 2 - 10;
        } else {
          y1 -= aRect.height / 2 - 10;
          y2 += bRect.height / 2 - 10;
        }
      } else if (x1 < x2) {
        x1 += aRect.width / 2 - 10;
        x2 -= bRect.width / 2 - 10;
      } else {
        x1 -= aRect.width / 2 - 10;
        x2 += bRect.width / 2 - 10;
      }

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const lift = Math.max(32, dist * 0.12);
      const cx1 = x1 + dx * 0.3 + (dy / dist) * lift * 0.4;
      const cy1 = y1 + dy * 0.3 - (dx / dist) * lift * 0.4;
      const cx2 = x1 + dx * 0.7 + (dy / dist) * lift * 0.2;
      const cy2 = y1 + dy * 0.7 - (dx / dist) * lift * 0.2;
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

  function highlightConnections(nodeId, on) {
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(p.dataset.from === nodeId || p.dataset.to === nodeId) {
        p.classList.toggle('flow-highlight', on);
        p.style.opacity = on ? '1' : '';
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
      tooltip.style.top = `${rect.bottom + window.pageYOffset + (isMobile ? 4 : 8)}px`;
    });
  }
  function hideTooltip(){ tooltip.style.display = 'none'; }

  function fitCanvas(padding = PADDING) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if(!n.el) return;
      const left = parseFloat(n.el.style.left || 0);
      const top = parseFloat(n.el.style.top || 0);
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + (n.el.offsetWidth || NODE_W));
      maxY = Math.max(maxY, top + (n.el.offsetHeight || NODE_H));
    });
    if(minX === Infinity) { minX = 0; minY = 0; maxX = 800; maxY = 600; }
    const width = Math.ceil(maxX - minX + padding * 2);
    const height = Math.ceil(maxY - minY + padding * 2);
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const offsetX = padding - minX;
    const offsetY = padding - minY;
    nodes.forEach(n => {
      if(!n.el) return;
      const left = parseFloat(n.el.style.left || 0) + offsetX;
      const top = parseFloat(n.el.style.top || 0) + offsetY;
      n.el.style.left = left + 'px';
      n.el.style.top = top + 'px';
      n.x = left;
      n.y = top;
    });

    drawEdges(false);

    const headerHeight = document.querySelector('.map-header')?.offsetHeight || 60;
    stage.style.height = (window.innerHeight - headerHeight - 100) + 'px'; // Dynamic height

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScaleW = stageW / width;
    const fitScaleH = stageH / height;
    const fitScale = Math.min(1, fitScaleW, fitScaleH);
    setScale(fitScale);
    stage.scrollLeft = (width * fitScale - stageW) / 2;
    stage.scrollTop = (height * fitScale - stageH) / 2;
  }

  function focusNode(nodeId) {
    const n = nodeMap[nodeId]; if(!n || !n.el) return;
    const cx = parseFloat(n.el.style.left) + (n.el.offsetWidth || NODE_W) / 2;
    const cy = parseFloat(n.el.style.top) + (n.el.offsetHeight || NODE_H) / 2;
    setScale(Math.min(1.12, Math.max(0.7, 1.0)));
    stage.scrollTo({ left: Math.max(0, cx * scale - stage.clientWidth / 2), top: Math.max(0, cy * scale - stage.clientHeight / 2), behavior:'smooth' });
    const path = findPathTo(nodeId);
    highlightPath(path, 1400);
  }

  function findPathTo(nodeId) {
    const n = nodeMap[nodeId]; if(!n) return [];
    if(n.type === 'hub') return ['root', nodeId];
    if(n.type === 'leaf') return ['root', 'hub-'+n.cluster, nodeId];
    return ['root'];
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
      const list = document.createElement('div'); list.className = 'autocomplete-items'; document.body.appendChild(list); // To body for overlay
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

  (function enablePan() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e)=> { if(e.target.closest('.node-box')) return; isDown=true; startX = e.pageX - stage.offsetLeft; startY = e.pageY - stage.offsetTop; scrollLeft = stage.scrollLeft; scrollTop = stage.scrollTop; stage.classList.add('dragging'); });
    window.addEventListener('mouseup', ()=> { isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e)=> { if(!isDown) return; const x = e.pageX - stage.offsetLeft; const y = e.pageY - stage.offsetTop; stage.scrollLeft = scrollLeft + (startX - x); stage.scrollTop = scrollTop + (startY - y); });
    stage.addEventListener('wheel', (e)=> { if(e.ctrlKey || e.metaKey) return; stage.scrollLeft += e.deltaY; e.preventDefault(); }, { passive:false });
  })();

  function setScale(s) { scale = s; container.style.transform = `scale(${scale})`; svg.style.transform = `scale(${scale})`; }

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
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { computeGuidedPositions(); resolveCollisionsAndLayout(() => { fitCanvas(PADDING); drawEdges(false); }); }, 200);
    });
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

/* leetree-worker.js unchanged */

self.addEventListener('message', (ev) => {
  const data = ev.data;
  if(!data) return;
  if(data.type === 'init') {
    self.postMessage({ type:'inited' });
    return;
  }
  if(data.type === 'layout') {
    const arr = data.nodes.map(n => ({ id:n.id, x:n.x, y:n.y }));
    const NODE_W = 200, NODE_H = 72;
    const ITER = 180;
    for(let iter=0; iter<ITER; iter++) {
      let moved = false;
      for(let i=0;i<arr.length;i++) {
        const a = arr[i];
        for(let j=i+1;j<arr.length;j++) {
          const b = arr[j];
          if(a.x + NODE_W <= b.x || b.x + NODE_W <= a.x || a.y + NODE_H <= b.y || b.y + NODE_H <= a.y) continue;
          const overlapX = Math.min(a.x + NODE_W, b.x + NODE_W) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + NODE_H, b.y + NODE_H) - Math.max(a.y, b.y);
          if(overlapX <= 0 || overlapY <= 0) continue;
          if(overlapX < overlapY) {
            const push = overlapX/2 + 6;
            if(a.x < b.x) { a.x -= push; b.x += push; } else { a.x += push; b.x -= push; }
          } else {
            const push = overlapY/2 + 6;
            if(a.y < b.y) { a.y -= push; b.y += push; } else { a.y += push; b.y -= push; }
          }
          moved = true;
        }
      }
      if(!moved) break;
    }
    for(let i=0;i<arr.length;i++){
      for(let j=i+1;j<arr.length;j++){
        const a=arr[i], b=arr[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist2 = dx*dx+dy*dy;
        if(dist2===0){ a.x += (Math.random()-0.5)*4; a.y += (Math.random()-0.5)*4; }
      }
    }
    self.postMessage({ type:'layout', nodes: arr });
  }
});

/* Updated leetree-advanced.css with fixes:
   - Improved mobile: Flex-wrap for header, smaller fonts, adjusted paddings.
   - Autocomplete-items: Styled as overlay with background, border, max-height scroll.
   - No white space: Set body margin 0 if needed, but assume it's handled.
   - Tooltip: Adjusted for mobile with smaller size.
*/

.leetcode-3d-map { color:#fff; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,monospace; padding:14px 8px; }
.map-header { display:flex; flex-direction:row; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
.map-title { font-size:20px; margin:0; font-weight:700; color:#fff; }
.map-controls { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
.map-search, .map-search:focus { min-width:240px; padding:6px 8px; border-radius:6px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); color:#fff; outline:none; }
.control-buttons { display:flex; gap:4px; }
.control-buttons button { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); color:#fff; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:12px; }

/* Stage */
.map-stage { position:relative; height:560px; border-radius:10px; overflow:auto; border:1px solid rgba(255,255,255,0.03); -webkit-overflow-scrolling:touch; }
.map-svg { position:absolute; left:0; top:0; pointer-events:none; transition: transform 180ms ease; }
.map-nodes { position:absolute; left:0; top:0; transition: transform 180ms ease; }

/* Node */
.node-box { position:absolute; display:block; min-width:160px; padding:10px 12px 10px 24px; border-radius:10px; color:#fff; text-decoration:none; box-shadow:0 8px 26px rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.06); background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); font-weight:700; cursor:pointer; transition: transform 160ms ease, box-shadow 160ms ease; }
.node-title { display:block; font-size:13px; }
.node-sub { display:block; font-size:11px; opacity:0.88; margin-top:6px; font-weight:600; color:rgba(255,255,255,0.9); }

/* sizes */
.root-node { min-width:220px; padding:14px 16px 14px 28px; font-size:15px; }
.intermediate-node { min-width:180px; padding:12px 14px 12px 26px; }
.leaf-node { min-width:150px; padding:10px 12px 10px 24px; }

/* hover lift */
.node-box:hover { transform: translateY(-8px) scale(1.03); box-shadow:0 18px 50px rgba(0,0,0,0.75); }

/* accent */
.cluster-accent { position:absolute; left:8px; top:8px; width:6px; height:calc(100% - 16px); border-radius:4px; }

/* edges */
.flow-line { stroke: rgba(255,255,255,0.14); stroke-width:2.6; fill:none; stroke-linecap:round; transition: stroke 160ms, opacity 160ms; }
.flow-glow { filter: url(#map-glow); stroke: rgba(255,255,255,0.22); stroke-width:3.2; }

/* initial draw and continuous motion */
.path-draw { transition: stroke-dashoffset 900ms cubic-bezier(.2,.9,.2,1); }
.flow-anim { stroke-dasharray: 200; animation: map-dash 2.6s linear infinite; }
@keyframes map-dash { to { stroke-dashoffset: -200; } }

/* highlight */
.flow-highlight { stroke: rgba(255,255,255,0.96) !important; stroke-width:3.2 !important; opacity:1 !important; }

/* tooltip */
.node-tooltip { position:fixed; z-index:9999; padding:6px 8px; border-radius:6px; background:rgba(0,0,0,0.82); color:#fff; font-size:11px; border:1px solid rgba(255,255,255,0.04); pointer-events:none; display:none; box-shadow:0 6px 24px rgba(0,0,0,0.6); max-width:200px; }

/* legend & actions */
.map-legend { margin-top:10px; display:flex; gap:6px; flex-wrap:wrap; align-items:center; color:#fff; }
.legend-item { display:flex; align-items:center; gap:6px; padding:4px 6px; border-radius:6px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.03); cursor:pointer; font-size:12px; }
.legend-swatch { width:12px; height:12px; border-radius:3px; }

/* action buttons list */
.map-actions { margin-top:10px; }
.actions-header { margin-bottom:6px; font-size:12px; }
.problem-buttons { display:flex; gap:6px; flex-wrap:wrap; }
.problem-buttons button { padding:4px 6px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); color:#fff; cursor:pointer; font-size:11px; }

/* ASCII guide */
.map-ascii { color:#fff; font-family:monospace; white-space:pre-wrap; font-size:11px; margin-top:10px; }

/* autocomplete overlay */
.autocomplete-items { background:rgba(0,0,0,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:6px; max-height:240px; overflow-y:auto; z-index:1000; }
.autocomplete-items div { padding:8px 10px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.06); }
.autocomplete-items div:hover, .autocomplete-active { background:rgba(255,255,255,0.08); }

/* responsive */
@media (max-width: 768px) {
  .leetcode-3d-map { padding:8px; }
  .map-header { flex-direction:column; align-items:flex-start; }
  .map-title { font-size:18px; }
  .map-search { min-width:100%; margin-bottom:8px; }
  .control-buttons { justify-content:center; width:100%; }
  .control-buttons button { padding:4px 6px; font-size:11px; }
  .map-stage { height:360px; }
  .node-box { min-width:120px; padding:6px 8px 6px 18px; }
  .root-node { min-width:160px; padding:8px 10px 8px 22px; font-size:14px; }
  .intermediate-node { min-width:140px; padding:8px 10px 8px 20px; }
  .leaf-node { min-width:110px; padding:6px 8px 6px 18px; }
  .node-title { font-size:11px; }
  .node-sub { font-size:9px; margin-top:4px; }
  .cluster-accent { left:6px; width:4px; top:6px; height:calc(100% - 12px); }
  .map-legend { gap:4px; }
  .legend-item { padding:4px 6px; font-size:11px; }
  .legend-swatch { width:10px; height:10px; }
  .map-actions { margin-top:8px; }
  .actions-header { font-size:11px; }
  .problem-buttons button { padding:4px 6px; font-size:10px; }
  .map-ascii { font-size:10px; }
  .autocomplete-items { max-height:200px; }
  .autocomplete-items div { padding:6px 8px; font-size:11px; }
  .node-tooltip { padding:4px 6px; font-size:10px; max-width:160px; }
}

/* Section HTML unchanged, but added use-worker button if missing */

<!-- LeetCode Interactive 3D Pattern Map -->
<section id="leetcode-3d-map" class="leetcode-3d-map" aria-label="LeetCode Pattern Interactive Map">
  <div class="map-header">
    <h2 class="map-title">LeetCode Pattern Map — Interactive</h2>
    <div class="map-controls">
      <input id="node-search" class="map-search" placeholder="Search problems / patterns..." aria-label="Search nodes" />
      <div class="control-buttons">
        <button id="zoom-in" aria-label="Zoom in">＋</button>
        <button id="zoom-out" aria-label="Zoom out">−</button>
        <button id="reset-view" aria-label="Reset view">Reset</button>
        <button id="use-worker">Use Worker</button>
      </div>
    </div>
  </div>

  <div id="map-stage" class="map-stage" tabindex="0" role="region" aria-label="Interactive LeetCode map">
    <svg id="map-svg" class="map-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"></svg>
    <div id="map-nodes" class="map-nodes" aria-hidden="false"></div>
  </div>

  <div class="map-legend" id="map-legend" aria-hidden="false" role="list"></div>

  <div class="map-actions">
    <h3 class="actions-header">Quick Access Problems</h3>
    <div id="problem-buttons" class="problem-buttons"></div>
  </div>

  <section class="map-guide" id="map-guide" aria-label="Study roadmap and pattern recognition">
    <h3>Study Roadmap & Quick Recognition Checklist</h3>
    <pre class="map-ascii">
1) Sum / Pair patterns → Two Sum family
2) Sliding Window — Fixed → Variable
3) Prefix-sum & Monotonic Queue
4) Two-pointer family & k-sum
5) Backtracking / Permutations
6) Binary Search & Search-on-answer
7) Dynamic Programming 1D → 2D
8) Graphs — BFS / DFS patterns
Revision Routine: Brute + Optimized → Dry-run → Complexity → Edge cases
    </pre>
  </section>
</section>
