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

  function initializeSidebar() {
    waitForElement('.nav-toggle', (navToggle) => {
      waitForElement('#nav-menu', (navMenu) => {
        toggleMenuLogic(navToggle, navMenu);
      });
    });

    waitForElement('.sidebar-toggle', (sidebarToggle) => {
      waitForElement('.sidebar-nav', (sidebarNav) => {
        toggleMenuLogic(sidebarToggle, sidebarNav);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[sidebarToggle.js] DOMContentLoaded fired');
      initializeSidebar();
    });
  } else {
    console.log('[sidebarToggle.js] Document already loaded, initializing');
    initializeSidebar();
  }
})();
