(function () {
  console.log('[sidebarToggle.js] final nav rebuild');

  function waitFor(selector, cb, max = 12, interval = 80) {
    let tries = 0;
    const t = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(t);
        cb(el);
      } else if (++tries >= max) {
        clearInterval(t);
        cb(null);
      }
    }, interval);
  }

  function initNav() {
    waitFor('.nav-toggle', (toggle) => {
      waitFor('#nav-menu', (menu) => {
        if (!toggle || !menu) {
          console.warn('nav toggle/menu missing');
          return;
        }

        // create backdrop element only once
        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
          backdrop = document.createElement('div');
          backdrop.className = 'nav-backdrop';
          document.body.appendChild(backdrop);
        }

        const ORIG_IMG = document.querySelector('#nav-image');

        function addSignatureClone() {
          if (!ORIG_IMG) return;
          if (menu.querySelector('.nav-signature-clone')) return;
          const clone = ORIG_IMG.cloneNode(true);
          clone.removeAttribute('id');
          clone.classList.add('nav-signature-clone');
          clone.setAttribute('aria-hidden', 'true');
          // safety inline styles to ensure clone doesn't overflow
          clone.style.height = '56px';
          clone.style.width = 'auto';
          menu.appendChild(clone);
          // force reflow for transition
          // eslint-disable-next-line no-unused-expressions
          clone.offsetHeight;
        }

        function removeSignatureClone() {
          const existing = menu.querySelector('.nav-signature-clone');
          if (existing) existing.remove();
        }

        function openMenu() {
          toggle.classList.add('active');
          menu.classList.add('open');
          backdrop.classList.add('open');
          document.body.classList.add('nav-open');
          // append clone after slight delay so layout settled
          setTimeout(addSignatureClone, 60);
        }

        function closeMenu() {
          toggle.classList.remove('active');
          menu.classList.remove('open');
          backdrop.classList.remove('open');
          document.body.classList.remove('nav-open');
          // remove clone after animation completes
          setTimeout(removeSignatureClone, 420);
        }

        // toggle
        toggle.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (menu.classList.contains('open')) closeMenu();
          else openMenu();
        });

        // close on backdrop click
        backdrop.addEventListener('click', closeMenu);

        // close on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', closeMenu);
        });

        // close on ESC
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
        });

        // prevent accidental body width changes: ensure no resize sets 100vw elsewhere
        // (we cannot change other parts of app; this is a protective guard)
        window.addEventListener('resize', () => {
          // no-op but reserved for metrics/debugging
          // Could check for overflow and log if needed
        });
      });
    });
  }

  /* keep existing sidebar behavior — unchanged */
  function initSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    if (!toggleBtn || !sidebarWrapper) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebarWrapper.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      console.log(`[sidebarToggle.js] Sidebar ${isOpen ? 'opened' : 'closed'}`);
    });

    sidebarWrapper.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (sidebarWrapper.classList.contains('open')) {
          sidebarWrapper.classList.remove('open');
          toggleBtn.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', false);
        }
      });
    });
  }

  // init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initNav(); initSidebar(); });
  } else {
    initNav(); initSidebar();
  }
})();
