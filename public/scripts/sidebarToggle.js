(function () {
  console.log('[sidebarToggle.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, interval);
      } else {
        console.warn(`[sidebarToggle.js] Element ${selector} not found`);
        callback(null);
      }
    };
    check();
  }

  function toggleMenuLogic(toggle, menu) {
    if (!toggle || !menu) return;

    function openMenu() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', true);
      menu.classList.add('active');
    }

    function closeMenu() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      menu.classList.remove('active');
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu on link click (mobile)
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  function initNavMenu() {
    waitForElement('.nav-toggle', (navToggle) => {
      waitForElement('#nav-menu', (navMenu) => {
        toggleMenuLogic(navToggle, navMenu);
      });
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
