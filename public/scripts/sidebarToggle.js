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

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('active');
      toggle.classList.toggle('active', !isOpen);
      menu.classList.toggle('active', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);

      toggle.setAttribute('aria-expanded', !isOpen);
      console.log(`[sidebarToggle.js] Nav ${!isOpen ? 'opened' : 'closed'}`);
    });

    // close menu when clicking a link
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
          menu.classList.remove('active');
          toggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded', false);
        }
      });
    });

    // ESC key closes menu
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
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
