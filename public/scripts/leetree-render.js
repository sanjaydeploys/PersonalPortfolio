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

  function renderNodes() {
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

      if (window.Leetree.animationsEnabled) {
        el.style.opacity = 0;
        el.style.transform = 'scale(0.8) translateY(20px)';
        setTimeout(() => {
          el.classList.add('node-enter');
          el.style.opacity = 1;
          el.style.transform = 'scale(1) translateY(0)';
        }, idx * 20);
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
    mpath.setAttribute('fill', 'rgba(255,255,255,0.18)');
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
      const aRect = f.el.getBoundingClientRect();
      const bRect = t.el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      let x1 = aRect.left - parentRect.left + aRect.width / 2;
      let y1 = aRect.top - parentRect.top + aRect.height / 2;
      let x2 = bRect.left - parentRect.left + bRect.width / 2;
      let y2 = bRect.top - parentRect.top + bRect.height / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      if (Math.abs(dx) > Math.abs(dy)) {
        x1 = dx > 0 ? aRect.right - parentRect.left : aRect.left - parentRect.left;
        x2 = dx > 0 ? bRect.left - parentRect.left : bRect.right - parentRect.left;
      } else {
        y1 = dy > 0 ? aRect.bottom - parentRect.top : aRect.top - parentRect.top;
        y2 = dy > 0 ? bRect.top - parentRect.top : bRect.bottom - parentRect.top;
      }

      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const lift = Math.max(20, dist * 0.3);
      const perpX = -dy / dist * lift;
      const perpY = dx / dist * lift;
      const cx1 = x1 + dx * 0.3 + perpX * 0.6;
      const cy1 = y1 + dy * 0.3 + perpY * 0.6;
      const cx2 = x1 + dx * 0.7 + perpX * 0.4;
      const cy2 = y1 + dy * 0.7 + perpY * 0.4;
      const d = 'M ' + x1 + ' ' + y1 + ' C ' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + x2 + ' ' + y2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-line');
      if (f.type === 'hub' || t.type === 'hub' || f.type === 'subhub' || t.type === 'subhub') path.classList.add('flow-glow');
      path.setAttribute('marker-end', 'url(#map-arrow)');
      path.dataset.from = from;
      path.dataset.to = to;
      path.dataset.cluster = f.cluster || t.cluster;
      svg.appendChild(path);

      if (window.Leetree.animationsEnabled) {
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
        path.classList.add('flow-anim');
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
    drawEdges(false);
    renderNodes();
  });

  return {
    renderNodes,
    setupSvgDefs,
    drawEdges,
    renderLegend,
    renderProblemButtons
  };
})();
