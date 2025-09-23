
(function () {
  function whenReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  whenReady(function () {
    const menu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (!menu) return;

    // create indicator once
    let indicator = menu.querySelector('.nav-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'nav-indicator';
      menu.appendChild(indicator);
    }

    const links = Array.from(menu.querySelectorAll('.nav-link'));

    // compute whether we are in desktop (indicator allowed)
    function isDesktop() {
      return window.innerWidth > 768;
    }

    // update indicator position using element offsetLeft relative to menu container
    function placeIndicator(el) {
      if (!el || !isDesktop()) {
        indicator.style.opacity = '0';
        return;
      }
      // Ensure the link is directly inside nav-menu or offsetParent is nav-menu
      const left = el.offsetLeft - menu.scrollLeft;
      const width = el.offsetWidth;
      indicator.style.left = left + 'px';
      indicator.style.width = width + 'px';
      indicator.style.opacity = '1';
    }

    function hideIndicator() {
      // if there's a server-set .active link, snap to it, else hide
      const active = menu.querySelector('.nav-link.active');
      if (active && isDesktop()) placeIndicator(active);
      else { indicator.style.opacity = '0'; indicator.style.width = '0'; }
    }

    // attach hover/focus handlers (desktop)
    links.forEach(link => {
      link.addEventListener('mouseenter', () => { if (isDesktop()) placeIndicator(link); });
      link.addEventListener('focus', () => { if (isDesktop()) placeIndicator(link); });
      link.addEventListener('mouseleave', hideIndicator);
      link.addEventListener('blur', hideIndicator);

      // close mobile menu on link click: **directly** remove active class & sync attrs
      link.addEventListener('click', (e) => {
        if (!menu.classList.contains('active')) return;
        // remove active class (non-invasive)
        menu.classList.remove('active');
        // sync toggle button aria + visual
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.classList.remove('active');
        }
        // hide indicator on mobile
        hideIndicator();
      });
    });

    // Snap indicator to server-side active initially (desktop only)
    const serverActive = menu.querySelector('.nav-link.active');
    if (serverActive) placeIndicator(serverActive);

    // Reposition indicator on resize (debounced)
    let rto = null;
    window.addEventListener('resize', () => {
      clearTimeout(rto);
      rto = setTimeout(() => {
        // If menu visible and desktop, recompute based on active or hide
        if (isDesktop()) {
          const active = menu.querySelector('.nav-link.active');
          if (active) placeIndicator(active);
        } else {
          hideIndicator();
        }
      }, 120);
    });

    // Use a MutationObserver to react if your sidebarToggle.js toggles classes
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class') {
          const isActive = menu.classList.contains('active');
          // when dropdown opens (mobile), hide indicator (menu now a panel)
          if (!isDesktop() && isActive) {
            indicator.style.opacity = '0';
          } else {
            // when it closes on mobile, make sure indicator is hidden
            if (!isActive) hideIndicator();
            // If desktop and has active link, snap indicator
            if (isDesktop()) {
              const active = menu.querySelector('.nav-link.active');
              if (active) placeIndicator(active);
            }
          }
        }
      }
    });
    mo.observe(menu, { attributes: true, attributeFilter: ['class'] });

    // Also observe body class changes (if any) OR navigation layout changes (optional)
    // Clean up when page unloads
    window.addEventListener('unload', () => mo.disconnect());
  });
})();

