/* leetree.js — Improved auto-layout, dynamic sizing, arrows, pan/zoom, hover highlight
   Drop into your SSR page just like before:
   <script src="/scripts/leetree.js"></script>
*/

(function () {
  // ---------- CONFIG ----------
  // simple node list (id must be unique). If you want me to bulk add every problem I can.
  const nodes = [
    { id: 'root', title: 'DSA / Patterns', subtitle: 'Start here', url: '#', type: 'root' },

    // branches (will be auto-positioned)
    { id: 'sum', title: 'SUM & PAIR', subtitle: 'Two-sum family', url: '#', type: 'intermediate' },
    { id: 'two1', title: 'Two Sum (LC1)', subtitle: 'Hash map / indices', url: 'https://sanjay-patidar.vercel.app/two-sum-pattern', type: 'leaf' },
    { id: 'two2', title: 'Two Sum II (LC167)', subtitle: 'Two-pointers (sorted)', url: 'https://sanjay-patidar.vercel.app/two-sum-ii-sorted', type: 'leaf' },
    { id: '3sum', title: '3Sum (LC15)', subtitle: 'k-sum family', url: 'https://sanjay-patidar.vercel.app/three-sum', type: 'leaf' },
    { id: '3closest', title: '3Sum Closest (LC16)', subtitle: 'closest target', url: 'https://sanjay-patidar.vercel.app/three-sum-closest', type: 'leaf' },

    { id: 'window', title: 'SLIDING WINDOW', subtitle: 'Fixed & variable', url: '#', type: 'intermediate' },
    { id: 'anagram', title: 'Anagrams (LC438)', subtitle: 'Fixed window', url: 'https://sanjay-patidar.vercel.app/find-all-anagrams', type: 'leaf' },
    { id: 'minwindow', title: 'Min Window (LC76)', subtitle: 'Variable window', url: 'https://sanjay-patidar.vercel.app/minimum-variable-window-substring', type: 'leaf' },

    { id: 'prefix', title: 'PREFIX SUM', subtitle: 'Prefix & subarray', url: '#', type: 'intermediate' },
    { id: 'pref1', title: 'Prefix Sum (LC560)', subtitle: 'Cum sum maps', url: '#', type: 'leaf' },

    { id: 'back', title: 'BACKTRACKING', subtitle: 'Permutations/combos', url: '#', type: 'intermediate' },
    { id: 'perm', title: 'Permutations (LC46)', subtitle: 'Recursive tree', url: '#', type: 'leaf' },
    { id: 'subs', title: 'Subsets (LC78)', subtitle: 'Decision tree', url: '#', type: 'leaf' },

    { id: 'dp', title: 'DYNAMIC PROGRAMMING', subtitle:'1D/2D patterns', url: '#', type:'intermediate' },
    { id: 'dp1', title: 'Climbing (LC70)', subtitle:'1D DP', url:'#', type:'leaf' },
    { id: 'dp2', title: 'House Robber (LC198)', subtitle:'1D DP', url:'#', type:'leaf' },

    { id: 'graph', title: 'GRAPH', subtitle:'BFS/DFS basics', url:'#', type:'intermediate' },
    { id: 'islands', title: 'Islands (LC200)', subtitle:'Grid BFS', url:'#', type:'leaf' },
    { id: 'ladder', title: 'Word Ladder (LC127)', subtitle:'BFS levels', url:'#', type:'leaf' },
  ];

  // edges define flow direction [fromId, toId]
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

  // layout params: tweak to pack tighter or looser
  const H_GAP = 260;   // horizontal gap between sibling nodes
  const V_GAP = 150;   // vertical gap between levels
  const NODE_W = 220;  // approximate node width used for layout calculation
  const NODE_H = 72;   // approximate node height

  // DOM refs
  const svg = document.getElementById('tree-svg');
  const container = document.getElementById('tree-nodes');
  const stage = document.getElementById('tree-stage');

  // maps
  const nodeById = {};
  const childrenMap = {};

  // build children map and nodeById
  nodes.forEach(n => { nodeById[n.id] = Object.assign({}, n); childrenMap[n.id] = []; });
  edges.forEach(([p,c]) => { if(childrenMap[p]) childrenMap[p].push(c); });

  // ====== Simple hierarchical layout (root-based BFS) ======
  function computeLevels(rootId = 'root') {
    // BFS to compute depth (level) for each node; if unconnected nodes remain, give them levels after BFS
    const levels = {};
    const q = [rootId];
    levels[rootId] = 0;
    const visited = new Set([rootId]);
    while(q.length) {
      const id = q.shift();
      const lvl = levels[id];
      const kids = childrenMap[id] || [];
      kids.forEach(childId => {
        if(!visited.has(childId)) {
          visited.add(childId);
          levels[childId] = lvl + 1;
          q.push(childId);
        }
      });
    }
    // any nodes not visited: put them at next levels to the right
    let maxLevel = Math.max(...Object.values(levels));
    nodes.forEach(n => { if(!(n.id in levels)) { maxLevel++; levels[n.id] = maxLevel; } });
    return levels;
  }

  function layoutNodes() {
    const levels = computeLevels('root');
    // group nodes by level
    const byLevel = {};
    for(const id in levels) {
      const lvl = levels[id];
      if(!byLevel[lvl]) byLevel[lvl] = [];
      byLevel[lvl].push(nodeById[id]);
    }
    // sort levels by level index
    const levelKeys = Object.keys(byLevel).map(k => parseInt(k)).sort((a,b)=>a-b);

    // compute width needed per level, place nodes horizontally spaced
    const placements = {}; // { id: {x,y} }
    levelKeys.forEach((lvl) => {
      const group = byLevel[lvl];
      // horizontal span for this level
      const totalWidth = (group.length - 1) * H_GAP;
      // center at xStart; we will compute full tree width then offset later
      const xStart = lvl * 0; // temporary, we will offset later
      group.forEach((node, i) => {
        const x = i * H_GAP; // spacing siblings across horizontally
        const y = lvl * V_GAP;
        placements[node.id] = { x, y };
      });
    });

    // Now we want to arrange levels left-to-right with some spacing to avoid overlaps.
    // We'll compute offsets per level so that each level starts after previous level's max X + margin.
    const levelOffsets = {};
    let currentX = 0;
    levelKeys.forEach(lvl => {
      levelOffsets[lvl] = currentX;
      // compute max X used at this level
      const group = byLevel[lvl];
      const maxX = ((group.length - 1) * H_GAP);
      // allow some overlap reduction: move next level a bit to the right
      currentX += Math.max(maxX + 220, 420); // ensure minimum width per level
    });

    // assign final positions with offsets
    for(const id in placements) {
      const base = placements[id];
      const lvl = computeLevels()['' + levels[id]]; // not ideal; instead use levels map
    }
    // simpler: place by level and index
    const finalPositions = {};
    levelKeys.forEach((lvl) => {
      const group = byLevel[lvl];
      const offsetX = levelOffsets[lvl];
      // center the group horizontally within its allotted width block
      const blockWidth = Math.max( (group.length - 1) * H_GAP, 320 );
      const cx = offsetX + blockWidth/2;
      group.forEach((node, i) => {
        // place siblings around center
        const x = offsetX + (i - (group.length-1)/2) * H_GAP;
        const y = 80 + lvl * V_GAP;
        finalPositions[node.id] = { x, y };
      });
    });

    // store positions back into nodeById
    for(const id in finalPositions) {
      nodeById[id].x = Math.round(finalPositions[id].x);
      nodeById[id].y = Math.round(finalPositions[id].y);
    }
  }

  // fallback: if root missing or layout failed, keep manual positions (none set => layoutNodes will set)
  layoutNodes();

  // ====== Render nodes into DOM (absolute positioned) ======
  const created = {};
  nodes.forEach(n => {
    const el = document.createElement('a');
    el.className = n.type === 'root' ? 'root-node' : (n.type === 'intermediate' ? 'intermediate-node' : 'leaf-node');
    el.href = n.url || '#';
    el.target = (n.url && n.url.startsWith('http')) ? '_blank' : '_self';

    // Use computed layout positions (nodeById entries)
    const pos = nodeById[n.id];
    const x = (typeof pos.x === 'number') ? pos.x : (n.x || 600);
    const y = (typeof pos.y === 'number') ? pos.y : (n.y || 200);

    el.style.left = (x) + 'px';
    el.style.top = (y) + 'px';

    el.dataset.id = n.id;
    el.innerHTML = `<span class="node-title">${n.title}</span><span class="node-sub">${n.subtitle||''}</span>`;

    // hover highlight
    el.addEventListener('mouseenter', () => highlightNodeEdges(n.id, true));
    el.addEventListener('mouseleave', () => highlightNodeEdges(n.id, false));

    // tooltip
    el.addEventListener('mouseenter', (e) => showTooltip(e, n));
    el.addEventListener('mouseleave', hideTooltip);

    container.appendChild(el);
    nodeById[n.id].el = el;
    created[n.id] = el;
  });

  // ------- SVG helpers: marker for arrowheads -------
  function createSvgDefs() {
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
  createSvgDefs();

  // draw edges using nodeById positions (fast)
  function drawEdges() {
    // clear old edges
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    createSvgDefs(); // recreate defs (marker)
    // for each edge, draw smooth cubic bezier
    edges.forEach(([fromId,toId]) => {
      const f = nodeById[fromId];
      const t = nodeById[toId];
      if(!f || !t || !f.x || !t.x) return;

      const x1 = f.x + NODE_W/2;
      const y1 = f.y + NODE_H/2;
      const x2 = t.x + NODE_W/2;
      const y2 = t.y + NODE_H/2;

      const dx = x2 - x1;
      // control points: push curve upward for aesthetic diagonal
      const curveLift = Math.max(80, Math.abs(dx) * 0.18);
      const cx1 = x1 + dx*0.25;
      const cx2 = x1 + dx*0.75;
      const cy1 = y1 - curveLift;
      const cy2 = y2 - curveLift*0.6;

      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d', `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`);
      path.setAttribute('class','flow-line flow-anim');
      path.setAttribute('marker-end','url(#arrowhead)');
      // stitch dataset for highlight toggling
      path.dataset.from = fromId;
      path.dataset.to = toId;
      svg.appendChild(path);
    });
  }

  // highlight edges related to node id
  function highlightNodeEdges(nodeId, on) {
    const paths = svg.querySelectorAll('path.flow-line');
    paths.forEach(p => {
      if(p.dataset.from === nodeId || p.dataset.to === nodeId) {
        if(on) p.style.stroke = 'rgba(255,255,255,0.9)';
        else p.style.stroke = '';
      } else {
        if(on) p.style.opacity = '0.18';
        else p.style.opacity = '';
      }
    });
  }

  // tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  tooltip.style.display='none';
  document.body.appendChild(tooltip);
  function showTooltip(e,n) {
    tooltip.style.display='block';
    tooltip.innerHTML = `<strong>${n.title}</strong><div style="font-size:12px;opacity:0.9;margin-top:6px;">${n.subtitle||''}</div>
      <div style="margin-top:6px;font-size:11px;opacity:0.8;">${n.url && n.url!=='#' ? n.url : 'demo / placeholder'}</div>`;
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + window.scrollX + 12) + 'px';
    tooltip.style.top = (rect.top + window.scrollY - 8) + 'px';
  }
  function hideTooltip() { tooltip.style.display='none'; }

  // compute bounding box and set container/svg sizes and optionally fit to viewport
  function fitCanvas(padding = 120) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      const pos = nodeById[n.id];
      if(typeof pos.x !== 'number' || typeof pos.y !== 'number') return;
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + NODE_W);
      maxY = Math.max(maxY, pos.y + NODE_H);
    });
    if(minX === Infinity) { // nothing to set
      minX = 0; minY = 0; maxX = 1200; maxY = 800;
    }
    const width = Math.ceil(maxX - minX + padding*2);
    const height = Math.ceil(maxY - minY + padding*2);

    // set container & svg dims via style (absolute)
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    // offset all nodes to account for minX/minY + padding
    const offsetX = -minX + padding;
    const offsetY = -minY + padding;
    nodes.forEach(n => {
      const pos = nodeById[n.id];
      if(typeof pos.x !== 'number' || typeof pos.y !== 'number') return;
      pos.screenX = pos.x + offsetX;
      pos.screenY = pos.y + offsetY;
      const el = nodeById[n.id].el;
      el.style.left = (pos.screenX) + 'px';
      el.style.top = (pos.screenY) + 'px';
    });

    // redraw edges using screenX/screenY
    drawEdges();

    // try to fit to viewport: if canvas width larger than stage, set scale so it fits horizontally
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScale = Math.min(1, (stageW - 40) / width, (stageH - 40) / height);
    setScale(fitScale);
    // center horizontally (scroll)
    const centerX = (width*fitScale - stageW)/2;
    const centerY = (height*fitScale - stageH)/2;
    stage.scrollLeft = Math.max(0, centerX);
    stage.scrollTop = Math.max(0, centerY);
  }

  // simple scale/zoom apply to both container and svg
  let scale = 1;
  function setScale(s) {
    scale = s;
    container.style.transform = `scale(${scale})`;
    svg.style.transform = `scale(${scale})`;
  }

  // zoom handlers wired to buttons (if present)
  const zi = document.getElementById('zoom-in');
  const zo = document.getElementById('zoom-out');
  const rz = document.getElementById('reset-view');
  if(zi) zi.addEventListener('click', ()=> setScale(Math.min(1.6, scale + 0.12)));
  if(zo) zo.addEventListener('click', ()=> setScale(Math.max(0.6, scale - 0.12)));
  if(rz) rz.addEventListener('click', ()=> { setScale(1); stage.scrollLeft = 0; stage.scrollTop = 0; });

  // pan: click+drag on stage to pan
  (function enableDragPan() {
    let isDown=false, startX=0, startY=0, scrollLeft=0, scrollTop=0;
    stage.addEventListener('mousedown', (e) => {
      if(e.target.closest('.node')) return; // allow node click without panning
      isDown=true;
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      stage.classList.add('dragging');
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
    // smooth horizontal wheel: shift+wheel free; normal wheel scrolls vertically; we swap vertical wheel into horizontal scroll
    stage.addEventListener('wheel', (e)=> {
      if (e.deltaY === 0) return;
      // if ctrl or meta pressed, allow browser zoom
      if(e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive:false });
  })();

  // initial fit + render
  fitCanvas(120);

  // redraw on resize to refit if stage changed
  window.addEventListener('resize', ()=> { fitCanvas(120); });

  // expose API for adding nodes / edges dynamically
  window.Leetree = {
    addNode: function(n) { nodes.push(n); nodeById[n.id] = n; childrenMap[n.id] = []; /* very minimal; re-render full? */ },
    addEdge: function(e) { edges.push(e); if(!childrenMap[e[0]]) childrenMap[e[0]]=[]; childrenMap[e[0]].push(e[1]); fitCanvas(120); },
    fit: function(padding=120) { fitCanvas(padding); }
  };

})();
