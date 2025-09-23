(function () {
  console.log('[sidebarToggle.js] nav final v1');

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
          console.warn('[sidebarToggle.js] nav toggle/menu missing');
          return;
        }

        // ensure backdrop exists once
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
          // inline safety sizes for clone
          clone.style.height = '34px';
          clone.style.width = 'auto';
          menu.appendChild(clone);
          // reflow to trigger transitions
          // eslint-disable-next-line no-unused-expressions
          clone.offsetHeight;
        }

        function removeSignatureClone() {
          const existing = menu.querySelector('.nav-signature-clone');
          if (existing) existing.remove();
        }

        function open() {
          toggle.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
          menu.classList.add('open');
          backdrop.classList.add('open');
          document.body.classList.add('nav-open');
          // append clone slightly after open for nicer timing
          setTimeout(addSignatureClone, 60);
        }

        function close() {
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('open');
          backdrop.classList.remove('open');
          document.body.classList.remove('nav-open');
          // remove clone after animations finish
          setTimeout(removeSignatureClone, 420);
        }

        // toggle handler
        toggle.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (menu.classList.contains('open')) close(); else open();
        });

        // close on backdrop click
        backdrop.addEventListener('click', close);

        // close on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', close);
        });

        // ESC key closes
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && menu.classList.contains('open')) close();
        });

        // Defensive: prevent injected width issues
        window.addEventListener('resize', () => {
          // If the drawer is open and viewport grew beyond mobile, close it
          if (window.innerWidth > 768 && menu.classList.contains('open')) {
            close();
          }
        });
      });
    });
  }

  /* preserve sidebar logic exactly (unchanged) */
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
