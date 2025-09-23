(function () {
  // Ensure DOM is ready
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  onReady(function () {
    const menu = document.getElementById('nav-menu');
    if (!menu) return;

    // create and append indicator (absolute inside .nav-menu)
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
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
      // try to snap to active link, otherwise hide
      const active = menu.querySelector('.nav-link.active');
      if (active) {
        moveIndicatorTo(active);
      } else {
        indicator.style.opacity = '0';
        indicator.style.width = '0';
      }
    }

    // Bind hover + focus to links (desktop interactions)
    links.forEach(link => {
      link.addEventListener('mouseenter', (e) => moveIndicatorTo(e.currentTarget));
      link.addEventListener('focus', (e) => moveIndicatorTo(e.currentTarget));
      link.addEventListener('mouseleave', () => hideIndicator());
      link.addEventListener('blur', () => hideIndicator());

      // On click: *if* mobile menu is open, close it by reusing your .nav-toggle handler
      link.addEventListener('click', () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu && navMenu.classList.contains('active')) {
          // trigger existing toggle logic (safe, re-uses your script)
          navToggle.click();
        }
      });
    });

    // Initialize: if there's an .active link set server-side, snap indicator to it
    const serverActive = menu.querySelector('.nav-link.active');
    if (serverActive) moveIndicatorTo(serverActive);

    // Recompute on resize (debounced)
    let to = null;
    window.addEventListener('resize', () => {
      clearTimeout(to);
      to = setTimeout(() => hideIndicator(), 120);
    });
  });
})();
