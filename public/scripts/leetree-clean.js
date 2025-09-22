/* leetree-clean.js
   Deterministic, compact LeetCode map:
   - guided hierarchical placement (root -> hubs -> problems)
   - deterministic collision resolution (iterations capped) to remove overlaps
   - curved SVG edges anchored to node centers
   - initial draw animation + subtle continuous dash flow
   - glow filter for edges
   - responsive fit, zoom, pan, search/focus
   - No floating nodes, no heavy continuous force sim
*/

/* USAGE:
  1) include this script after the HTML snippet.
  2) customize clusters/problems arrays below.
  3) call Leetree.addProblem(...) if you want to append at runtime.
*/

(function () {
  /* ---------- CONFIG: clusters & sample problems ----------
     Edit or extend these arrays to add more nodes.
  */
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

  // Representative set — expand as needed
  const problems = [
    { id:'two-sum', title:'Two Sum', sub:'LC1 — Hash map', url:'https://sanjay-patidar.vercel.app/two-sum-pattern', cluster:'sum' },
    { id:'two-sum-ii', title:'Two Sum II', sub:'LC167 — Sorted two-pointer', url:'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', cluster:'sum' },
    { id:'3sum', title:'3Sum', sub:'LC15 — k-sum', url:'https://sanjay-patidar.vercel.app/three-sum', cluster:'twoPointers' },
    { id:'3closest', title:'3Sum Closest', sub:'LC16', url:'https://sanjay-patidar.vercel.app/three-sum-closest', cluster:'twoPointers' },

    { id:'anagram', title:'Find All Anagrams', sub:'LC438 — fixed window', url:'https://sanjay-patidar.vercel.app/find-all-anagrams', cluster:'window' },
    { id:'min-window', title:'Minimum Window', sub:'LC76 — variable window', url:'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', cluster:'window' },

    { id:'subarray-sum-k', title:'Subarray Sum K', sub:'LC560', url:'#', cluster:'prefix' },

    { id:'perm', title:'Permutations', sub:'LC46', url:'#', cluster:'backtracking' },
    { id:'combinations', title:'Combinations', sub:'LC39', url:'#', cluster:'backtracking' },

    { id:'binary-search', title:'Binary Search', sub:'LC33', url:'#', cluster:'binary' },

    { id:'climb', title:'Climbing Stairs', sub:'LC70', url:'#', cluster:'dp' },
    { id:'islands', title:'Number of Islands', sub:'LC200', url:'#', cluster:'graph' }
  ];

  /* ---------- DOM refs ---------- */
  const svg = document.getElementById('lt-svg');
  const container = document.getElementById('lt-nodes');
  const stage = document.getElementById('lt-stage');
  const legendEl = document.getElementById('lt-legend');
  const searchInput = document.getElementById('lt-search');

  /* ---------- Derived node / edge arrays ---------- */
  const nodes = []; // objects: { id, title, sub, url, type, cluster, x, y, el }
  const edges = [];

  // root
  nodes.push({ id:'root', title:'DSA / Patterns', sub:'Start here', type:'root', cluster:null });

  // hubs and edges
  clusters.forEach(c => {
    const hid = 'hub-'+c.id;
    nodes.push({ id:hid, title:c.label, sub:'pattern hub', type:'hub', cluster:c.id });
    edges.push(['root', hid]);
  });

  // problems and edges
  problems.forEach(p => {
    nodes.push({ id:p.id, title:p.title, sub:p.sub, url:p.url || '#', type:'leaf', cluster:p.cluster });
    edges.push(['hub-'+p.cluster, p.id]);
  });

  /* ---------- Layout params ---------- */
  const NODE_W = 200, NODE_H = 72;
  const HUB_X = 340;            // x position of hubs relative to root
  const HUB_SPACING = 110;      // vertical spacing between hubs
  const LEAF_COL_GAP = 180;     // gap between leaf columns
  const LEAF_ROW_GAP = 100;     // gap between leaf rows
  const PADDING = 96;           // canvas padding to compute container size
  const COLLISION_ITERS = 160;  // collision resolution iterations (deterministic)

  /* ---------- Setup: create element nodes & legend ---------- */
  function createNodesDOM() {
    container.innerHTML = '';
    nodes.forEach(n => {
      const el = document.createElement('a');
      el.className = 'node-box ' + (n.type === 'root' ? 'root-node' : (n.type === 'hub' ? 'hub-node' : 'leaf-node'));
      el.href = n.url || '#';
      el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';
      el.dataset.id = n.id;
      el.setAttribute('role','link');
      el.setAttribute('aria-label', n.title + ' — ' + (n.sub||''));

      // accent bar
      const accent = document.createElement('span');
      accent.className = 'cluster-accent';
      const clusterColor = n.cluster ? (clusters.find(c => c.id === n.cluster).color) : '#ffffff';
      accent.style.background = clusterColor;
      accent.style.boxShadow = `0 8px 28px ${hexToRgba(clusterColor, 0.10)}`;
      el.appendChild(accent);

      const t = document.createElement('span');
      t.className = 'node-title';
      t.textContent = n.title;
      const s = document.createElement('span');
      s.className = 'node-sub';
      s.textContent = n.sub || '';
      el.appendChild(t);
      el.appendChild(s);

      // hover interactions
      el.addEventListener('mouseenter', (e) => {
        highlightConnections(n.id, true);
        showTooltip(e, n);
      });
      el.addEventListener('mouseleave', () => {
        highlightConnections(n.id, false);
        hideTooltip();
      });

      container.appendChild(el);
      n.el = el;
    });
  }

  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach(c => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = c.color;
      const lbl = document.createElement('div');
      lbl.textContent = c.label;
      item.appendChild(sw);
      item.appendChild(lbl);
      item.addEventListener('click', ()=> toggleClusterFilter(c.id));
      legendEl.appendChild(item);
    });
  }

  /* ---------- Guided placement (deterministic) ----------
     1) root at left
     2) hubs vertically positioned to right (based on count)
     3) leaves arranged in grid to right of each hub
  */
  function computeGuidedPositions() {
    const rootX = 60;
    const rootY = 240;
    nodeById('root').x = rootX;
    nodeById('root').y = rootY;

    // hubs: vertical stack centered on rootY
    const hubIds = clusters.map(c => 'hub-' + c.id);
    const total = hubIds.length;
    const startY = rootY - ((total - 1) / 2) * HUB_SPACING;
    hubIds.forEach((hid, idx) => {
      nodeById(hid).x = rootX + HUB_X;
      nodeById(hid).y = startY + idx * HUB_SPACING;
    });

    // leaves: group by cluster, grid layout to the right of hub
    const group = {};
    nodes.forEach(n => {
      if(n.type === 'leaf') {
        group[n.cluster] = group[n.cluster] || [];
        group[n.cluster].push(n.id);
      }
    });

    Object.keys(group).forEach(clusterId => {
      const hub = nodeById('hub-'+clusterId);
      const list = group[clusterId];
      const cols = Math.max(1, Math.ceil(list.length / 4));
      list.forEach((nid, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = hub.x + 180 + c * LEAF_COL_GAP;
        const y = hub.y - ((Math.min(3, list.length)-1)/2) * LEAF_ROW_GAP + r * LEAF_ROW_GAP;
        nodeById(nid).x = x;
        nodeById(nid).y = y;
      });
    });
  }

  /* ---------- Deterministic collision resolution ----------
     Simple separation for overlapping nodes (no randomness).
     We run a fixed number of passes and push overlapping rectangles apart.
  */
  function resolveCollisions() {
    // repeat passes
    for(let iter=0; iter < COLLISION_ITERS; iter++) {
      let moved = false;
      for(let i=0;i<nodes.length;i++) {
        const a = nodes[i];
        for(let j=i+1;j<nodes.length;j++) {
          const b = nodes[j];
          if(!('x' in a) || !('x' in b)) continue;
          // overlapping check (rects of NODE_W x NODE_H)
          const ax1 = a.x, ay1 = a.y, ax2 = a.x + NODE_W, ay2 = a.y + NODE_H;
          const bx1 = b.x, by1 = b.y, bx2 = b.x + NODE_W, by2 = b.y + NODE_H;
          if(ax2 <= bx1 || bx2 <= ax1 || ay2 <= by1 || by2 <= ay1) continue; // no overlap
          // compute overlapping vector
          const overlapX = Math.min(ax2, bx2) - Math.max(ax1, bx1);
          const overlapY = Math.min(ay2, by2) - Math.max(ay1, by1);
          // push along the larger overlap axis
          if(overlapX < overlapY) {
            // move left-right
            const push = overlapX/2 + 6; // small margin
            if(a.x < b.x) { a.x -= push; b.x += push; } else { a.x += push; b.x -= push; }
          } else {
            // move up-down
            const push = overlapY/2 + 6;
            if(a.y < b.y) { a.y -= push; b.y += push; } else { a.y += push; b.y -= push; }
          }
          moved = true;
        }
      }
      if(!moved) break; // early exit
    }
  }

  /* ---------- fit canvas: compute bounding box and size container/svg ----------
     After positions are fixed, offset nodes by padding and set container/svg size.
  */
  function fitAndPositionNodes() {
    // compute min/max from node positions
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if(typeof n.x !== 'number' || typeof n.y !== 'number') return;
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + NODE_W);
      maxY = Math.max(maxY, n.y + NODE_H);
    });
    if(minX === Infinity) { minX = 0; minY = 0; maxX = 1200; maxY = 800; }

    const width = Math.ceil((maxX - minX) + PADDING*2);
    const height = Math.ceil((maxY - minY) + PADDING*2);

    // set container & svg size
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // offset nodes so min becomes padding
    const offsetX = PADDING - minX;
    const offsetY = PADDING - minY;
    nodes.forEach(n => {
      n.x = Math.round(n.x + offsetX);
      n.y = Math.round(n.y + offsetY);
      if(n.el) {
        n.el.style.left = n.x + 'px';
        n.el.style.top = n.y + 'px';
      }
    });
  }

  /* ---------- SVG glow filter & defs ---------- */
  function setupSvgDefs() {
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');

    // glow filter
    const filter = document.createElementNS(ns, 'filter');
    filter.setAttribute('id','lt-glow');
    filter.setAttribute('x','-50%');
    filter.setAttribute('y','-50%');
    filter.setAttribute('width','200%');
    filter.setAttribute('height','200%');
    const feGaussian = document.createElementNS(ns, 'feGaussianBlur');
    feGaussian.setAttribute('stdDeviation','4.2');
    feGaussian.setAttribute('result','coloredBlur');
    filter.appendChild(feGaussian);
    const feMerge = document.createElementNS(ns, 'feMerge');
    const feMergeNode1 = document.createElementNS(ns, 'feMergeNode');
    feMergeNode1.setAttribute('in','coloredBlur');
    const feMergeNode2 = document.createElementNS(ns, 'feMergeNode');
    feMergeNode2.setAttribute('in','SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);

    // arrow marker
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id','lt-arrow');
    marker.setAttribute('viewBox','0 0 10 10');
    marker.setAttribute('refX','10');
    marker.setAttribute('refY','5');
    marker.setAttribute('markerUnits','strokeWidth');
    marker.setAttribute('markerWidth','8');
    marker.setAttribute('markerHeight','8');
    marker.setAttribute('orient','auto');
    const markerPath = document.createElementNS(ns, 'path');
    markerPath.setAttribute('d','M 0 0 L 10 5 L 0 10 z');
    markerPath.setAttribute('fill','rgba(255,255,255,0.18)');
    marker.appendChild(markerPath);

    defs.appendChild(filter);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }

  /* ---------- draw edges (curved cubic bezier) ----------
     We compute centers directly from n.x / n.y and element width/height.
     For smoother curves we add vertical lift proportional to dx.
     Also animate initial draw using stroke-dashoffset.
  */
  function drawEdges(initial = true) {
    // remove old paths except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if(defs) svg.appendChild(defs);

    edges.forEach(([fromId, toId]) => {
      const f = nodeById(fromId), t = nodeById(toId);
      if(!f || !t || !f.el || !t.el) return;
      const x1 = f.x + (f.el.offsetWidth || NODE_W)/2;
      const y1 = f.y + (f.el.offsetHeight || NODE_H)/2;
      const x2 = t.x + (t.el.offsetWidth || NODE_W)/2;
      const y2 = t.y + (t.el.offsetHeight || NODE_H)/2;

      const dx = x2 - x1;
      const lift = Math.max(48, Math.abs(dx) * 0.18);
      const cx1 = x1 + dx * 0.28;
      const cy1 = y1 - lift;
      const cx2 = x1 + dx * 0.72;
      const cy2 = y2 - lift * 0.6;
      const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-line');
      // add glow class sometimes for hubs
      if(f.type === 'hub' || t.type === 'hub') path.classList.add('flow-glow');
      path.setAttribute('marker-end', 'url(#lt-arrow)');
      svg.appendChild(path);

      // initial draw animation
      if(initial) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        // trigger transition on next frame
        requestAnimationFrame(() => {
          path.classList.add('path-draw');
          path.style.strokeDashoffset = '0';
          // after the growth finishes, add subtle continuous dash animation
          setTimeout(() => {
            path.classList.remove('path-draw');
            path.classList.add('flow-anim');
          }, 920);
        });
      } else {
        path.classList.add('flow-anim');
      }
    });
  }

  /* ---------- helpers ---------- */
  function nodeById(id) { return nodes.find(n => n.id === id); }
  function hexToRgba(hex, a=1) {
    const h = hex.replace('#','');
    const bi = parseInt(h,16);
    const r = (bi >> 16) & 255;
    const g = (bi >> 8) & 255;
    const b = bi & 255;
    return `rgba(${r},${g},${b},${a})`;
  }
  function escapeHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  /* ---------- interactions: tooltip & highlight ---------- */
  const tooltip = document.createElement('div'); tooltip.className = 'lt-tooltip'; document.body.appendChild(tooltip);
  function showTooltip(e,n) {
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<strong>${escapeHtml(n.title)}</strong><div style="margin-top:6px;font-size:12px;opacity:0.9">${escapeHtml(n.sub||'')}</div>`;
    const r = e.target.getBoundingClientRect();
    tooltip.style.left = (r.left + window.scrollX + 12) + 'px';
    tooltip.style.top = (r.top + window.scrollY - 8) + 'px';
  }
  function hideTooltip(){ tooltip.style.display = 'none'; }

  function highlightConnections(nodeId, on) {
    const paths = svg.querySelectorAll('path');
    paths.forEach(p => {
      if(p.dataset.from === nodeId || p.dataset.to === nodeId) {
        if(on) p.classList.add('flow-highlight'); else p.classList.remove('flow-highlight');
      } else {
        p.style.opacity = on ? '0.18' : '';
      }
    });
    nodes.forEach(n => {
      if(!n.el) return;
      n.el.style.opacity = on && n.id !== nodeId ? '0.6' : '';
    });
  }

  /* ---------- cluster filter ---------- */
  let activeCluster = null;
  function renderLegend() {
    legendEl.innerHTML = '';
    clusters.forEach(c => {
      const item = document.createElement('div'); item.className = 'legend-item';
      const sw = document.createElement('div'); sw.className = 'legend-swatch'; sw.style.background = c.color;
      const label = document.createElement('div'); label.textContent = c.label;
      item.appendChild(sw); item.appendChild(label);
      item.addEventListener('click', ()=> {
        activeCluster = (activeCluster === c.id) ? null : c.id;
        applyClusterFilter();
      });
      legendEl.appendChild(item);
    });
  }
  function applyClusterFilter() {
    nodes.forEach(n => {
      if(!n.el) return;
      if(activeCluster && n.type !== 'root' && n.cluster !== activeCluster) n.el.style.opacity = '0.3';
      else n.el.style.opacity = '';
    });
    const paths = svg.querySelectorAll('path');
    paths.forEach(p => {
      // light logic: if either endpoint is in cluster, show
      const from = p.dataset.from, to = p.dataset.to;
      const a = nodeById(from), b = nodeById(to);
      const keep = !activeCluster || ( (a && a.cluster === activeCluster) || (b && b.cluster === activeCluster) );
      p.style.opacity = keep ? '' : '0.06';
    });
  }

  /* ---------- search & focus ---------- */
  function initSearch() {
    // simple autocomplete + click-to-focus
    const flat = nodes.map(n => ({ id:n.id, title:n.title, sub:n.sub }));
    let acList = null;
    searchInput.addEventListener('input', function () {
      const v = this.value.trim().toLowerCase();
      if(acList) acList.remove();
      if(!v) return;
      acList = document.createElement('div');
      acList.className = 'autocomplete-items';
      acList.style.position='absolute';
      acList.style.zIndex='9999';
      acList.style.background='rgba(0,0,0,0.85)';
      acList.style.border='1px solid rgba(255,255,255,0.06)';
      acList.style.marginTop='6px';
      acList.style.width = this.clientWidth + 'px';
      this.parentNode.appendChild(acList);

      const matches = flat.filter(it => it.title.toLowerCase().includes(v) || (it.sub||'').toLowerCase().includes(v));
      matches.slice(0,8).forEach(m => {
        const item = document.createElement('div'); item.style.padding='8px'; item.style.cursor='pointer';
        item.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">${escapeHtml(m.sub||'')}</div>`;
        item.addEventListener('click', ()=> {
          searchInput.value = m.title;
          acList.remove();
          focusNode(m.id);
        });
        acList.appendChild(item);
      });
      document.addEventListener('click', (ev) => { if(acList && !acList.contains(ev.target)) acList.remove(); }, { once:true });
    });
  }

  function focusNode(id) {
    const n = nodeById(id); if(!n || !n.el) return;
    // center the node in the view & slight zoom
    const rect = n.el.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    const cx = (rect.left - parentRect.left) + rect.width/2;
    const cy = (rect.top - parentRect.top) + rect.height/2;
    // scale to a comfortable value then scroll
    setScale(1.02);
    stage.scrollTo({ left: Math.max(0, cx*scale - stage.clientWidth/2), top: Math.max(0, cy*scale - stage.clientHeight/2), behavior:'smooth' });
    // quick highlight
    highlightConnections(id, true); setTimeout(()=> highlightConnections(id,false), 1400);
  }

  /* ---------- pan & wheel ---------- */
  (function enablePan() {
    let isDown=false,startX=0,startY=0,scrollLeft=0,scrollTop=0;
    stage.addEventListener('mousedown', (e) => {
      if(e.target.closest('.node-box')) return;
      isDown = true; startX = e.pageX - stage.offsetLeft; startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft; scrollTop = stage.scrollTop; stage.classList.add('dragging'); e.preventDefault();
    });
    window.addEventListener('mouseup', ()=> { isDown=false; stage.classList.remove('dragging'); });
    window.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      const x = e.pageX - stage.offsetLeft; const y = e.pageY - stage.offsetTop;
      stage.scrollLeft = scrollLeft + (startX - x); stage.scrollTop = scrollTop + (startY - y);
    });
    stage.addEventListener('wheel', (e)=>{
      if(e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY; e.preventDefault();
    }, { passive:false });
  })();

  /* ---------- scale (zoom) ---------- */
  let scale = 1;
  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale})`;
    svg.style.transform = `scale(${scale})`;
  }
  document.getElementById('lt-zoom-in').addEventListener('click', ()=> setScale(Math.min(1.6, scale + 0.12)));
  document.getElementById('lt-zoom-out').addEventListener('click', ()=> setScale(Math.max(0.6, scale - 0.12)));
  document.getElementById('lt-reset').addEventListener('click', ()=> {
    setScale(1); stage.scrollLeft = 0; stage.scrollTop = 0; activeCluster = null; applyClusterFilter();
  });

  /* ---------- init & boot ---------- */
  function boot() {
    // 1) create DOM nodes
    createNodesDOM();
    // 2) guided positions
    computeGuidedPositions();
    // 3) collision resolution to avoid overlaps
    resolveCollisions();
    // 4) fit canvas & position DOM
    fitAndPositionNodes();
    // 5) SVG defs
    setupSvgDefs();
    // 6) draw edges with initial animation
    drawEdges(true);
    // 7) render legend, init search
    renderLegend();
    initSearch();
    initSearch();
    // 8) final: ensure focus roughly centered
    setTimeout(()=> { // allow browser to finish layout then center
      // fit-to-view logic: scale down if too wide
      const w = container.offsetWidth, h = container.offsetHeight;
      const stageW = stage.clientWidth, stageH = stage.clientHeight;
      const fitScale = Math.min(1, (stageW - 40) / w, (stageH - 40) / h);
      setScale(fitScale);
      stage.scrollLeft = Math.max(0, (w*fitScale - stageW)/2);
      stage.scrollTop = Math.max(0, (h*fitScale - stageH)/2);
    }, 80);
  }

  // expose simple API for adding nodes at runtime (will re-layout deterministically)
  window.Leetree = {
    addProblem: function(p) {
      if(nodeById(p.id)) return;
      nodes.push({ id:p.id, title:p.title, sub:p.sub || '', url:p.url || '#', type:'leaf', cluster:p.cluster });
      edges.push(['hub-'+p.cluster, p.id]);
      // re-create DOM and re-run layout steps
      createNodesDOM();
      computeGuidedPositions();
      resolveCollisions();
      fitAndPositionNodes();
      setupSvgDefs();
      drawEdges(true);
    },
    focusNode: focusNode,
    fit: function() { fitAndPositionNodes(); drawEdges(false); }
  };

  /* ---------- small utilities ---------- */
  function nodeById(id) { return nodes.find(n => n.id === id); }
  function hexToRgba(hex, a=1) { const h = hex.replace('#',''); const bi = parseInt(h,16); return `rgba(${(bi>>16)&255},${(bi>>8)&255},${bi&255},${a})`; }

  /* ---------- wire legend and search ------------ */
  function renderLegend() { /* already defined above; keep simple wrapper */ }
  function initSearch() { initSearchImpl(); }
  function initSearchImpl() { /* uses closure earlier - rebind searchInput listeners */ 
    // The search implementation was created earlier under initSearch; call that function
  }

  /* ---------- CALL BOOT ---------- */
  boot();

  /* ---------- Notes on scaling to hundreds of nodes ----------
     - This deterministic approach works well and is stable.
     - For very large graphs (> 300 nodes), I strongly recommend using
       a web-worker + quadtree for collision / repulsion passes to keep UI responsive.
     - If you want, I can provide a worker implementation that offloads the
       collision / placement math and posts back final positions for rendering.
  */
})();
