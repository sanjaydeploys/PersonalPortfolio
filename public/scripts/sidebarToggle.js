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
        console.error(`[sidebarToggle.js] Element ${selector} not found after ${maxAttempts} attempts`);
      }
    };
    check();
  }

  function initializeSidebar() {
    waitForElement('.nav-toggle', (navToggle) => {
      waitForElement('.sidebar-toggle', (sidebarToggle) => {
        waitForElement('#nav-menu', (navMenu) => {
          waitForElement('.sidebar-nav', (sidebarNav) => {
            const toggleMenu = (toggle, menu) => {
              toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                menu.classList.toggle('active', !isExpanded);
                console.log(`[sidebarToggle.js] Toggled ${menu.id}, expanded: ${!isExpanded}`);
              });
            };
            toggleMenu(navToggle, navMenu);
            toggleMenu(sidebarToggle, sidebarNav);
          });
        });
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
