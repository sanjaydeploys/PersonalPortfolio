window.Leetree = window.Leetree || {};
window.LeetreeUtils = (function () {
  const nodes = window.Leetree.nodes || [];
  const edges = window.Leetree.edges || [];
  const nodeMap = window.Leetree.nodeMap || {};
  const clusters = window.Leetree.clusters || [];
  const stage = document.getElementById('map-stage');
  const container = document.getElementById('map-nodes');
  const svg = document.getElementById('map-svg');
  const searchInput = document.getElementById('node-search');
  const PADDING = window.Leetree.PADDING || (window.innerWidth < 768 ? 15 : 80);
  let activeCluster = null;
  const tooltip = document.createElement('div');
  tooltip.className = 'node-tooltip';
  document.body.appendChild(tooltip);

  function highlightPath(path, duration = 0, on = true) {
    if (path.length < 2) return;
    const clusterColor = nodeMap[path[path.length - 1]].cluster ? clusters.find((c) => c.id === nodeMap[path[path.length - 1]].cluster).color : '#fff';
    const pairs = [];
    for (let i = 0; i < path.length - 1; i++) pairs.push([path[i], path[i + 1]]);
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach((p) => {
      const from = p.dataset.from, to = p.dataset.to;
      const match = pairs.some((pair) => pair[0] === from && pair[1] === to);
      if (match) {
        if (on) p.classList.add('flow-highlight-advanced');
        else p.classList.remove('flow-highlight-advanced');
        p.style.stroke = on ? clusterColor : '';
        p.style.opacity = on ? '1' : '';
        if (on && window.Leetree.animationsEnabled) p.classList.add('path-pulse-advanced');
        else p.classList.remove('path-pulse-advanced');
      } else {
        p.style.opacity = on ? '0.1' : '';
      }
    });
    if (duration > 0) {
      setTimeout(() => {
        svgpaths.forEach((p) => { p.classList.remove('flow-highlight-advanced'); p.style.stroke = ''; p.style.opacity = ''; p.classList.remove('path-pulse-advanced'); });
      }, duration);
    }
  }

  function showTooltip(e, n) {
    let desc = n.sub || 'No description';
    if (n.type === 'leaf') desc += '<br>Click to view solution';
    tooltip.innerHTML = '<strong>' + escapeHtml(n.title) + '</strong><div style="margin-top:6px;font-size:12px;opacity:0.9">' + escapeHtml(desc) + '</div>';
    tooltip.style.display = 'block';
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = rect.left + window.pageXOffset + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + window.pageYOffset + 8;
    if (left < 0) left = 0;
    if (left + tooltipRect.width > window.innerWidth) left = window.innerWidth - tooltipRect.width;
    if (top + tooltipRect.height > window.innerHeight + window.pageYOffset) top = rect.top + window.pageYOffset - tooltipRect.height - 8;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    if (window.Leetree.animationsEnabled) tooltip.classList.add('tooltip-fade-in');
  }

  function hideTooltip() {
    tooltip.style.display = 'none';
    tooltip.classList.remove('tooltip-fade-in');
  }

  function fitCanvas(padding = PADDING) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach((n) => {
      if (!n.el) return;
      const left = n.x || parseFloat(n.el.style.left || 0);
      const top = n.y || parseFloat(n.el.style.top || 0);
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + (n.el.offsetWidth || window.Leetree.NODE_W));
      maxY = Math.max(maxY, top + (n.el.offsetHeight || window.Leetree.NODE_H));
    });
    if (minX === Infinity) { minX = 0; minY = 0; maxX = 800; maxY = 600; }
    const width = Math.ceil(maxX - minX + padding * 2);
    const height = Math.ceil(maxY - minY + padding * 2);
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const offsetX = padding - minX;
    const offsetY = padding - minY;
    nodes.forEach((n) => {
      if (!n.el) return;
      n.x = (n.x || parseFloat(n.el.style.left || 0)) + offsetX;
      n.y = (n.y || parseFloat(n.el.style.top || 0)) + offsetY;
      n.el.style.left = n.x + 'px';
      n.el.style.top = n.y + 'px';
    });

    window.LeetreeRender.drawEdges(false);

    const headerHeight = document.querySelector('.map-header')?.offsetHeight || 60;
    stage.style.height = (window.innerHeight - headerHeight - 80) + 'px';

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const fitScaleW = (stageW - 10) / width;
    const fitScaleH = (stageH - 10) / height;
    const fitScale = Math.min(1, fitScaleW, fitScaleH);
    setScale(fitScale);
    stage.scrollLeft = Math.max(0, (width * fitScale - stageW) / 2);
    stage.scrollTop = Math.max(0, (height * fitScale - stageH) / 2);
  }

  function focusNode(nodeId) {
    const n = nodeMap[nodeId];
    if (!n || !n.el) return;
    const cx = n.x + (n.el.offsetWidth || window.Leetree.NODE_W) / 2;
    const cy = n.y + (n.el.offsetHeight || window.Leetree.NODE_H) / 2;
    setScale(Math.min(1.12, Math.max(0.7, 1.0)));
    stage.scrollTo({ left: Math.max(0, cx * window.Leetree.scale - stage.clientWidth / 2), top: Math.max(0, cy * window.Leetree.scale - stage.clientHeight / 2), behavior: 'smooth' });
    highlightPath(findPathTo(nodeId), 1400);
    if (window.Leetree.animationsEnabled) n.el.classList.add('node-focus-pulse');
    setTimeout(() => n.el.classList.remove('node-focus-pulse'), 1400);
  }

  function findPathTo(nodeId) {
    const visited = new Set();
    const queue = [{ id: 'root', path: ['root'] }];
    while (queue.length) {
      const { id, path } = queue.shift();
      if (id === nodeId) return path;
      if (visited.has(id)) continue;
      visited.add(id);
      edges.forEach(([from, to]) => {
        if (from === id) queue.push({ id: to, path: [...path, to] });
        if (to === id) queue.push({ id: from, path: [...path, from] });
      });
    }
    return [];
  }

  function toggleCluster(clusterId) {
    activeCluster = activeCluster === clusterId ? null : clusterId;
    nodes.forEach((n) => {
      if (!n.el) return;
      if (activeCluster && n.type !== 'root' && n.cluster !== activeCluster) n.el.style.opacity = '0.24';
      else n.el.style.opacity = '';
    });
    const svgpaths = svg.querySelectorAll('path.flow-line');
    svgpaths.forEach((p) => {
      if (!activeCluster) { p.style.opacity = ''; return; }
      const from = p.dataset.from, to = p.dataset.to;
      const f = nodeMap[from], t = nodeMap[to];
      if ((f && f.cluster === activeCluster) || (t && t.cluster === activeCluster)) {
        p.style.opacity = '1';
        p.style.stroke = '';
      } else {
        p.style.opacity = '0.06';
      }
    });
  }

  function initSearch() {
    if (!searchInput) {
      console.warn('initSearch: #node-search element not found');
      return;
    }
    const flat = nodes.map((n) => ({ id: n.id, title: n.title, sub: n.sub }));
    let currentFocus = -1;
    searchInput.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      closeAllLists();
      if (!val) return;
      const list = document.createElement('div');
      list.className = 'autocomplete-items';
      document.body.appendChild(list);
      const inputRect = this.getBoundingClientRect();
      list.style.position = 'absolute';
      list.style.left = inputRect.left + 'px';
      list.style.top = (inputRect.bottom + window.pageYOffset) + 'px';
      list.style.width = inputRect.width + 'px';
      list.style.zIndex = '1000';
      const matches = flat.filter((it) => it.title.toLowerCase().includes(val) || (it.sub || '').toLowerCase().includes(val));
      matches.slice(0, 10).forEach((m) => {
        const item = document.createElement('div');
        item.innerHTML = '<strong>' + escapeHtml(m.title) + '</strong><div style="font-size:12px;color:rgba(255,255,255,0.75)">' + escapeHtml(m.sub || '') + '</div>';
        item.addEventListener('click', () => { searchInput.value = m.title; closeAllLists(); focusNode(m.id); });
        list.appendChild(item);
      });
    });
    searchInput.addEventListener('keydown', (e) => {
      const list = document.querySelector('.autocomplete-items');
      if (!list) return;
      const items = list.getElementsByTagName('div');
      if (e.key === 'ArrowDown') { currentFocus++; addActive(items); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { currentFocus--; addActive(items); e.preventDefault(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (currentFocus > -1 && items[currentFocus]) items[currentFocus].click(); }
      function addActive(items) {
        if (!items) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('autocomplete-active');
      }
      function removeActive(items) {
        for (let it of items) it.classList.remove('autocomplete-active');
      }
    });
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target)) closeAllLists();
    });
    function closeAllLists() {
      const items = document.getElementsByClassName('autocomplete-items');
      for (let i = items.length - 1; i >= 0; i--) items[i].parentNode.removeChild(items[i]);
    }
  }

  function enableNodeDrag(el, n) {
    let isDragging = false;
    let startX, startY;
    el.addEventListener('mousedown', startDrag);
    el.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      startX = (e.clientX || e.touches[0].clientX) / window.Leetree.scale - n.x;
      startY = (e.clientY || e.touches[0].clientY) / window.Leetree.scale - n.y;
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      n.x = (e.clientX || e.touches[0].clientX) / window.Leetree.scale - startX;
      n.y = (e.clientY || e.touches[0].clientY) / window.Leetree.scale - startY;
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      window.LeetreeRender.drawEdges(false);
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

  function setupControlListeners() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetView = document.getElementById('reset-view');
    const toggleAnimations = document.getElementById('toggle-animations');
    const useWorker = document.getElementById('use-worker');
    const autoLayout = document.getElementById('auto-layout');

    if (zoomIn) {
      zoomIn.addEventListener('click', () => setScale(Math.min(1.6, window.Leetree.scale + 0.12)));
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => setScale(Math.max(0.5, window.Leetree.scale - 0.12)));
    }
    if (resetView) {
      resetView.addEventListener('click', () => {
        setScale(1);
        stage.scrollLeft = 0;
        stage.scrollTop = 0;
        nodes.forEach((n) => { if (n.el) n.el.style.opacity = ''; });
        const paths = svg.querySelectorAll('path.flow-line');
        paths.forEach((p) => { p.style.opacity = ''; });
        activeCluster = null;
      });
    }
    if (toggleAnimations) {
      toggleAnimations.addEventListener('click', () => {
        window.Leetree.animationsEnabled = !window.Leetree.animationsEnabled;
        toggleAnimations.textContent = `Anim: ${window.Leetree.animationsEnabled ? 'ON' : 'OFF'}`;
        window.LeetreeRender.drawEdges(false);
        window.dispatchEvent(new CustomEvent('leetree:toggleAnimations', { detail: { animationsEnabled: window.Leetree.animationsEnabled } }));
      });
    }
    if (useWorker) {
      useWorker.addEventListener('click', () => {
        if (!window.Worker) { alert('Web Worker not supported in this browser.'); return; }
        if (window.Leetree.workerEnabled) {
          window.Leetree.workerEnabled = false;
          useWorker.textContent = 'Worker: OFF';
          if (window.Leetree.worker) { window.Leetree.worker.terminate(); window.Leetree.worker = null; }
        } else {
          try {
            window.Leetree.worker = new Worker('/public/scripts/leetree-worker.js');
            window.Leetree.workerEnabled = true;
            useWorker.textContent = 'Worker: ON';
            window.Leetree.worker.postMessage({ type: 'init' });
          } catch (err) {
            console.error('Worker spawn failed', err);
            alert('Failed to start worker');
            window.Leetree.workerEnabled = false;
            useWorker.textContent = 'Worker: OFF';
          }
        }
      });
    }
    if (autoLayout) {
      autoLayout.addEventListener('click', () => {
        window.LeetreeLayout.computeGuidedPositions();
        window.LeetreeLayout.resolveCollisionsAndLayout(() => {
          nodes.forEach((n) => {
            if (!n.el) return;
            n.el.style.left = (n.x || 0) + 'px';
            n.el.style.top = (n.y || 0) + 'px';
          });
          window.LeetreeRender.drawEdges(false);
          fitCanvas(PADDING);
        });
      });
    }
  }

  (function enablePan() {
    let isDown = false, startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;
    stage.addEventListener('mousedown', (e) => {
      if (e.target.closest('.node-box')) return;
      isDown = true;
      startX = e.pageX - stage.offsetLeft;
      startY = e.pageY - stage.offsetTop;
      scrollLeft = stage.scrollLeft;
      scrollTop = stage.scrollTop;
      stage.classList.add('dragging');
    });
    window.addEventListener('mouseup', () => {
      isDown = false;
      stage.classList.remove('dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - stage.offsetLeft;
      const y = e.pageY - stage.offsetTop;
      stage.scrollLeft = scrollLeft + (startX - x);
      stage.scrollTop = scrollTop + (startY - y);
    });
    stage.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) return;
      stage.scrollLeft += e.deltaY;
      e.preventDefault();
    }, { passive: false });
  })();

  if (window.Leetree.isMobile) {
    let initialDistance = 0;
    let initialScale = 1;
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        initialScale = window.Leetree.scale;
      }
    }, { passive: false });
    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        setScale(Math.max(0.5, Math.min(1.6, initialScale * (distance / initialDistance))));
      }
    }, { passive: false });
  }

  function setScale(s) {
    window.Leetree.scale = s;
    container.style.transform = 'scale(' + s + ')';
    svg.style.transform = 'scale(' + s + ')';
    window.LeetreeRender.drawEdges(false);
  }

  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }

  function hexToRgba(hex, a = 1) {
    const h = hex.replace('#', '');
    const bi = parseInt(h, 16);
    return 'rgba(' + ((bi >> 16) & 255) + ',' + ((bi >> 8) & 255) + ',' + (bi & 255) + ',' + a + ')';
  }

  return {
    highlightPath,
    showTooltip,
    hideTooltip,
    fitCanvas,
    focusNode,
    findPathTo,
    toggleCluster,
    initSearch,
    enableNodeDrag,
    escapeHtml,
    hexToRgba,
    setupControlListeners
  };
})();
