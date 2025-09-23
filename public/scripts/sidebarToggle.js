(function () {
  console.log('[sidebarToggle.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 12, interval = 80) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) callback(element);
      else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, interval);
      } else {
        console.warn(`[sidebarToggle.js] Element ${selector} not found after ${attempts} attempts`);
        callback(null);
      }
    };
    check();
  }

  function toggleMenuLogic(toggle, menu) {
    if (!toggle || !menu) return;

    const ORIGINAL_IMG_SELECTOR = '#nav-image';
    const originalImage = document.querySelector(ORIGINAL_IMG_SELECTOR);

    function createSignatureWrapper() {
      // Prevent duplicate wrapper
      if (menu.querySelector('.nav-signature-wrap')) return null;

      const wrapper = document.createElement('div');
      wrapper.className = 'nav-signature-wrap';

      if (originalImage) {
        const clone = originalImage.cloneNode(true);
        clone.removeAttribute('id'); // avoid duplicate id
        clone.classList.add('nav-signature-clone');
        clone.setAttribute('aria-hidden', 'true');
        // small inline guard to ensure consistent height
        clone.style.height = '56px';
        clone.style.width = 'auto';
        wrapper.appendChild(clone);
      }

      menu.appendChild(wrapper);
      // force reflow so transitions/animations trigger reliably
      // eslint-disable-next-line no-unused-expressions
      wrapper.offsetHeight;
      return wrapper;
    }

    function removeSignatureWrapper() {
      const existing = menu.querySelector('.nav-signature-wrap');
      if (existing) existing.remove();
    }

    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('active');

      // append wrapper after menu starts sliding (tiny delay helps timing)
      setTimeout(() => {
        createSignatureWrapper();
      }, 60);
    }

    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');

      // start close transition
      menu.classList.remove('active');

      // remove clone after overlay closes (match CSS transition ~480ms)
      setTimeout(() => {
        removeSignatureWrapper();
      }, 480);
    }

    // toggle via click
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('active');
      if (isOpen) closeMenu(); else openMenu();
    });

    // close when link clicked (mobile)
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (menu.classList.contains('active')) closeMenu();
      });
    });

    // close on outside click (protective)
    document.addEventListener('click', (ev) => {
      if (!menu.classList.contains('active')) return;
      const target = ev.target;
      if (toggle.contains(target) || menu.contains(target)) return;
      closeMenu();
    });

    // keep keyboard accessible: close on ESC
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });
  }

  /* keep your existing sidebar logic intact (if any) */
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
