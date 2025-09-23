
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    const menu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if (!menu) return;

    // --- indicator (same behaviour as before) ---
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    indicator.style.pointerEvents = 'none'; // ensure it never blocks clicks
    menu.appendChild(indicator);

    const links = Array.from(menu.querySelectorAll('.nav-link'));

    function moveIndicatorTo(el) {
      if (!el || !menu) return;
      const rect = el.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      indicator.style.width = rect.width + 'px';
      indicator.style.transform = 'translateX(' + (rect.left - menuRect.left) + 'px)';
      indicator.style.opacity = '1';
    }
    function hideIndicator() {
      const active = menu.querySelector('.nav-link.active');
      if (active) moveIndicatorTo(active);
      else { indicator.style.opacity = '0'; indicator.style.width = '0'; }
    }

    links.forEach(link => {
      link.addEventListener('mouseenter', (e) => moveIndicatorTo(e.currentTarget));
      link.addEventListener('focus', (e) => moveIndicatorTo(e.currentTarget));
      link.addEventListener('mouseleave', hideIndicator);
      link.addEventListener('blur', hideIndicator);

      // close mobile menu on link click (robust)
      link.addEventListener('click', () => {
        if (!menu.classList.contains('active')) return;
        // Try trigger existing toggle first
        if (navToggle) {
          navToggle.click();
          // After tiny delay ensure it's closed, otherwise force close
          setTimeout(() => {
            if (menu.classList.contains('active')) {
              menu.classList.remove('active');
              navToggle.setAttribute('aria-expanded', 'false');
              navToggle.classList.remove('active');
            }
          }, 60);
        } else {
          // fallback: force close
          menu.classList.remove('active');
        }
      });
    });

    // Snap to server-side active if present
    const serverActive = menu.querySelector('.nav-link.active');
    if (serverActive) moveIndicatorTo(serverActive);

    // Recompute on resize (debounce)
    let to = null;
    window.addEventListener('resize', () => {
      clearTimeout(to);
      to = setTimeout(hideIndicator, 120);
    });

    // ---------------------------
    // Fallback toggle handler:
    // if your sidebarToggle.js doesn't change menu state,
    // this runs *only then* (so we avoid double-toggle).
    // ---------------------------
    if (navToggle) {
      let lastMenuState = menu.classList.contains('active');

      navToggle.addEventListener('click', () => {
        // give other handlers a chance to run first
        setTimeout(() => {
          const newMenuState = menu.classList.contains('active');
          if (newMenuState === lastMenuState) {
            // no handler changed the state => fallback toggling
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', (!isExpanded).toString());
            menu.classList.toggle('active', !isExpanded);
            navToggle.classList.toggle('active', !isExpanded);
          }
          lastMenuState = menu.classList.contains('active');
        }, 28); // small delay
      });
    }
  });
})();

