
(function () {
  console.log('[navEnhance_v1] enhancement script loaded');

  // local wait helper (isolated)
  function waitForElement(selector, callback, maxAttempts = 20, interval = 80) {
    let attempts = 0;
    const check = () => {
      const el = document.querySelector(selector);
      if (el) return callback(el);
      attempts++;
      if (attempts < maxAttempts) return setTimeout(check, interval);
      // not found
      console.warn('[navEnhance_v1] Element not found:', selector);
      callback(null);
    };
    check();
  }

  // MAIN setup: wait for nav-menu (we rely on your original sidebarToggle.js to attach toggle)
  waitForElement('#nav-menu', (navMenu) => {
    if (!navMenu) return;
    const navToggle = document.querySelector('.nav-toggle');
    const links = Array.from(navMenu.querySelectorAll('.nav-link'));
    let overlay = document.querySelector('.nav-overlay');

    // create overlay if missing
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }

    // create indicator for desktop if not present
    let indicator = navMenu.querySelector('.nav-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'nav-indicator';
      // light default styles; you can refine in CSS
      indicator.style.position = 'absolute';
      indicator.style.bottom = '6px';
      indicator.style.height = '3px';
      indicator.style.borderRadius = '999px';
      indicator.style.background = 'var(--secondary-color)';
      indicator.style.transition = 'left 220ms cubic-bezier(.2,.9,.3,1), width 220ms cubic-bezier(.2,.9,.3,1), opacity 160ms ease';
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
      navMenu.appendChild(indicator);
    }

    // helper: is desktop
    function isDesktop() { return window.innerWidth > 768; }

    // place indicator under provided element (desktop only)
    function placeIndicator(el) {
      if (!el || !isDesktop()) { indicator.style.opacity = '0'; return; }
      const parentRect = navMenu.getBoundingClientRect();
      // offsetLeft is relative to offsetParent - navMenu is positioned, so use offsetLeft
      const left = el.offsetLeft;
      const width = el.offsetWidth;
      indicator.style.left = left + 'px';
      indicator.style.width = width + 'px';
      indicator.style.opacity = '1';
    }
    function hideIndicator() { indicator.style.opacity = '0'; }

    links.forEach(link => {
      link.addEventListener('mouseenter', () => placeIndicator(link));
      link.addEventListener('focus', () => placeIndicator(link));
      link.addEventListener('mouseleave', hideIndicator);
      link.addEventListener('blur', hideIndicator);
    });

    // close function (safe): tries to use navToggle, falls back to removing classes
    function closeMenu() {
      if (!navMenu.classList.contains('active')) return;
      if (navToggle) {
        // try to call original toggle handler first (so aria stays in sync)
        navToggle.click();
        // fallback after short delay if still active
        setTimeout(() => {
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
          }
        }, 80);
      } else {
        navMenu.classList.remove('active');
      }
    }

    // open effects: overlay, lock scroll, staggered nav link animation
    function openEffects() {
      overlay.classList.add('visible');
      document.documentElement.classList.add('nav-open'); // locks scroll (use CSS)
      // animate links with stagger
      links.forEach((lnk, i) => {
        lnk.classList.remove('anim-out');
        // set inline delay for crisp stagger
        lnk.style.transition = 'transform 360ms cubic-bezier(.2,.9,.3,1), opacity 300ms ease';
        lnk.style.transitionDelay = (i * 60) + 'ms';
        // small timeout to ensure class triggers transition
        setTimeout(() => lnk.classList.add('anim-in'), 8);
      });
      // focus first link for keyboard users
      const first = navMenu.querySelector('.nav-link');
      if (first) first.focus();
    }

    function closeEffects() {
      overlay.classList.remove('visible');
      document.documentElement.classList.remove('nav-open');
      // reverse animate
      links.forEach((lnk, i) => {
        lnk.classList.remove('anim-in');
        lnk.classList.add('anim-out');
        // stagger out faster
        lnk.style.transitionDelay = ((links.length - i) * 20) + 'ms';
        // cleanup inline styles after anim complete
        setTimeout(() => {
          lnk.style.transition = '';
          lnk.style.transitionDelay = '';
          lnk.classList.remove('anim-out');
        }, 520 + (i * 10));
      });
      hideIndicator();
    }

    // overlay click closes menu
    overlay.addEventListener('click', closeMenu);

    // close on ESC key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') closeMenu();
    });

    // clicking any nav link closes the menu (mobile)
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          // let the original nav-toggle logic run if present, otherwise fallback
          closeMenu();
        }
      });
    });

    // Observe navMenu .class changes (react to original script toggling .active)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (m.attributeName === 'class') {
          const isActive = navMenu.classList.contains('active');
          console.log('[navEnhance_v1] nav-menu active state ->', isActive);
          if (isActive) openEffects(); else closeEffects();
        }
      });
    });
    mo.observe(navMenu, { attributes: true, attributeFilter: ['class'] });

    // initial state sync
    if (navMenu.classList.contains('active')) openEffects();
    else closeEffects();

    // handle window resize for indicator + ensure overlay hidden when moving to desktop
    let rTO = null;
    window.addEventListener('resize', () => {
      clearTimeout(rTO);
      rTO = setTimeout(() => {
        if (!isDesktop()) {
          // on mobile hide indicator (prevent floating)
          hideIndicator();
        } else {
          // snap to server-set .active link, if any
          const serverActive = navMenu.querySelector('.nav-link.active');
          if (serverActive) placeIndicator(serverActive);
        }
      }, 110);
    });

    // graceful cleanup on unload
    window.addEventListener('unload', () => mo.disconnect());
  }); // waitForElement #nav-menu end
})();

