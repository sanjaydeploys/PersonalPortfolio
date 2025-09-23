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
      if (menu.querySelector('.nav-signature-wrap')) return null;
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-signature-wrap';

      if (originalImage) {
        const clone = originalImage.cloneNode(true);
        clone.removeAttribute('id');
        clone.classList.add('nav-signature-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.style.height = '56px';
        clone.style.width = 'auto';
        clone.style.filter = 'brightness(1) drop-shadow(0 0 12px rgba(255,255,255,0.3))';
        wrapper.appendChild(clone);
      }

      menu.appendChild(wrapper);
      wrapper.offsetHeight; // trigger CSS transition
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
      setTimeout(createSignatureWrapper, 60);
    }

    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      setTimeout(removeSignatureWrapper, 480);
    }

    // Toggle via hamburger click
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('active');
      isOpen ? closeMenu() : openMenu();
    });

    // Close overlay on link click (mobile)
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (menu.classList.contains('active')) closeMenu();
      });
    });

    // Close overlay if clicking outside
    document.addEventListener('click', ev => {
      if (!menu.classList.contains('active')) return;
      const target = ev.target;
      if (!toggle.contains(target) && !menu.contains(target)) closeMenu();
    });

    // Close overlay via ESC
    document.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });
  }

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
