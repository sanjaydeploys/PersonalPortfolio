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

  function renderNodes(isInitial = false) {
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

      if (isInitial && window.Leetree.animationsEnabled) {
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
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerUnits', 'strokeWidth');
    marker.setAttribute('markerWidth', '4');
    marker.setAttribute('markerHeight', '4');
    marker.setAttribute('orient', 'auto');
    const mpath = document.createElementNS(ns, 'path');
    mpath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    mpath.setAttribute('fill', 'rgba(255,255,255,0.28)');
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
      const w1 = f.el.offsetWidth;
      const h1 = f.el.offsetHeight;
      const w2 = t.el.offsetWidth;
      const h2 = t.el.offsetHeight;
      let x1 = f.x + w1 / 2;
      let y1 = f.y + h1 / 2;
      let x2 = t.x + w2 / 2;
      let y2 = t.y + h2 / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      if (Math.abs(dx) > Math.abs(dy)) {
        x1 += dx > 0 ? w1 / 2 : -w1 / 2;
        x2 += dx > 0 ? -w2 / 2 : w2 / 2;
      } else {
        y1 += dy > 0 ? h1 / 2 : -h1 / 2;
        y2 += dy > 0 ? -h2 / 2 : h2 / 2;
      }

      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const lift = Math.max(20, dist * 0.25);
      const perpX = -dy / dist * lift;
      const perpY = dx / dist * lift;
      const cx1 = x1 + dx * 0.35 + perpX * 0.55;
      const cy1 = y1 + dy * 0.35 + perpY * 0.55;
      const cx2 = x1 + dx * 0.65 + perpX * 0.45;
      const cy2 = y1 + dy * 0.65 + perpY * 0.45;
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

      const enabled = window.Leetree.animationsEnabled;
      if (enabled) {
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
        const cluster = path.dataset.cluster;
        const color = cluster ? clusters.find((c) => c.id === cluster).color : '#ffffff';
        path.style.stroke = window.LeetreeUtils.hexToRgba(color, 0.3);
      }
    });
  }

  function toggleEdgeAnimations() {
    const paths = svg.querySelectorAll('path.flow-line');
    const enabled = window.Leetree.animationsEnabled;
    paths.forEach((path) => {
      path.classList.remove('path-draw-advanced', 'flow-anim-advanced', 'flow-anim');
      path.style.stroke = '';
      if (enabled) {
        path.classList.add('flow-anim-advanced');
      } else {
        const cluster = path.dataset.cluster;
        const color = cluster ? clusters.find((c) => c.id === cluster).color : '#ffffff';
        path.style.stroke = window.LeetreeUtils.hexToRgba(color, 0.3);
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
    toggleEdgeAnimations();
  });

  return {
    renderNodes,
    setupSvgDefs,
    drawEdges,
    toggleEdgeAnimations,
    renderLegend,
    renderProblemButtons
  };
})();
