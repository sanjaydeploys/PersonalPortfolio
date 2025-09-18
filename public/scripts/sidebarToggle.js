(function () {
  console.log('[sidebarToggle.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[sidebarToggle.js] Found element: ${selector}`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`[sidebarToggle.js] Waiting for ${selector}, attempt ${attempts}`);
        setTimeout(check, interval);
      } else {
        console.warn(`[sidebarToggle.js] Element ${selector} not found after ${maxAttempts} attempts`);
        callback(null); // allow execution even if not found
      }
    };
    check();
  }

  function toggleMenuLogic(toggle, menu) {
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      menu.classList.toggle('active', !isExpanded);
      console.log(`[sidebarToggle.js] Toggled ${menu.id || menu.className}, expanded: ${!isExpanded}`);
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

    if (!toggleBtn || !sidebarWrapper) {
      console.warn('[sidebarToggle.js] Sidebar toggle/button not found');
      return;
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebarWrapper.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      console.log(`[sidebarToggle.js] Sidebar ${isOpen ? 'opened' : 'closed'}`);
    });

    // Auto close sidebar on link click (mobile only)
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
