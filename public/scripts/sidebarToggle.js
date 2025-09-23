(function () {
  console.log('[sidebarToggle.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 12, interval = 80) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, interval);
      } else {
        console.warn(`[sidebarToggle.js] Element ${selector} not found after ${attempts} attempts`);
        callback(null);
      }
    };
    check();
  }

  /**
   * Nav toggle logic:
   * - toggles `.active` class on .nav-toggle and #nav-menu
   * - clones the single image (#nav-image) into .nav-menu when opening (clone gets class nav-signature-clone)
   * - removes clone on close
   */
  function toggleMenuLogic(toggle, menu) {
    if (!toggle || !menu) return;

    const originalImage = document.querySelector('#nav-image');

    // helper: create clone and append to menu
    function appendSignatureClone() {
      if (!originalImage) return null;
      // Avoid multiple clones
      if (menu.querySelector('.nav-signature-clone')) return null;
      const clone = originalImage.cloneNode(true);
      clone.removeAttribute('id'); // avoid duplicate ids
      clone.classList.add('nav-signature-clone');
      clone.setAttribute('aria-hidden', 'true');
      // reduce height for mobile clone
      clone.style.height = '56px';
      clone.style.width = 'auto';
      // Append at the end of menu
      menu.appendChild(clone);
      // force reflow to ensure transitions run
      // eslint-disable-next-line no-unused-expressions
      clone.offsetHeight;
      return clone;
    }

    function removeSignatureClone() {
      const existing = menu.querySelector('.nav-signature-clone');
      if (existing) existing.remove();
    }

    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('active');
      // append clone after a tiny delay to let menu slide in
      setTimeout(() => appendSignatureClone(), 60);
    }

    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      // hide active first so CSS transitions run
      menu.classList.remove('active');
      // remove clone after animation completes
      setTimeout(() => removeSignatureClone(), 420);
    }

    // Toggle on click
    toggle.addEventListener('click', () => {
      const open = menu.classList.contains('active');
      if (open) closeMenu(); else openMenu();
    });

    // Close on link click (mobile)
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        // only close if menu currently open
        if (menu.classList.contains('active')) {
          closeMenu();
        }
      });
    });

    // Close when clicking outside menu (optional protective UX)
    document.addEventListener('click', (ev) => {
      if (!menu.classList.contains('active')) return;
      const target = ev.target;
      if (target === toggle || toggle.contains(target)) return;
      if (menu.contains(target)) return;
      closeMenu();
    });
  }

  /* ========== Sidebar init (kept intact) ========== */
  function initSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');

    if (!toggleBtn || !sidebarWrapper) {
      // it's okay if sidebar is not used on a page
      return;
    }

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

  /* ========== Wiring ========== */
  function initNavMenu() {
    waitForElement('.nav-toggle', (navToggle) => {
      waitForElement('#nav-menu', (navMenu) => {
        if (!navToggle || !navMenu) {
          console.warn('[sidebarToggle.js] nav toggle/menu missing');
          return;
        }
        toggleMenuLogic(navToggle, navMenu);
      });
    });
  }

  function initializeAll() {
    initNavMenu();
    initSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
  } else {
    initializeAll();
  }
})();
