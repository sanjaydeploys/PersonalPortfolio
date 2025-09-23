
(function () {
  console.log('[navSidebar.js] Script loaded');

  /** Utility: Wait until element exists **/
  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[navSidebar.js] Found element: ${selector}`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`[navSidebar.js] Waiting for ${selector}, attempt ${attempts}`);
        setTimeout(check, interval);
      } else {
        console.warn(`[navSidebar.js] Element ${selector} not found after ${maxAttempts} attempts`);
        callback(null);
      }
    };
    check();
  }

  /** ===== NAVBAR MENU ===== **/
  function initNavMenu() {
    waitForElement('.nav-toggle', (navToggle) => {
      waitForElement('#nav-menu', (navMenu) => {
        if (!navToggle || !navMenu) return;

        const links = navMenu.querySelectorAll('.nav-link');

        // Create animated indicator (desktop only)
        let indicator = navMenu.querySelector('.nav-indicator');
        if (!indicator) {
          indicator = document.createElement('div');
          indicator.className = 'nav-indicator';
          navMenu.appendChild(indicator);
        }

        // Toggle menu (mobile)
        navToggle.addEventListener('click', () => {
          const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
          navToggle.setAttribute('aria-expanded', !isExpanded);
          navMenu.classList.toggle('active', !isExpanded);
          console.log(`[navSidebar.js] Nav menu ${!isExpanded ? 'opened' : 'closed'}`);
        });

        // Close mobile menu on link click
        links.forEach(link => {
          link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              navToggle.setAttribute('aria-expanded', false);
            }
          });
        });

        // Indicator movement (desktop hover)
        function moveIndicator(el) {
          if (window.innerWidth <= 768) return;
          const rect = el.getBoundingClientRect();
          const parentRect = navMenu.getBoundingClientRect();
          indicator.style.left = (rect.left - parentRect.left) + 'px';
          indicator.style.width = rect.width + 'px';
          indicator.style.opacity = '1';
        }
        function hideIndicator() { indicator.style.opacity = '0'; }

        links.forEach(link => {
          link.addEventListener('mouseenter', () => moveIndicator(link));
          link.addEventListener('focus', () => moveIndicator(link));
          link.addEventListener('mouseleave', hideIndicator);
          link.addEventListener('blur', hideIndicator);
        });

        // Active link highlight on load
        const active = navMenu.querySelector('.nav-link.active');
        if (active) moveIndicator(active);

        // Reset on resize
        window.addEventListener('resize', () => {
          if (window.innerWidth <= 768) hideIndicator();
          else if (active) moveIndicator(active);
        });
      });
    });
  }

  /** ===== SIDEBAR ===== **/
  function initSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');

    if (!toggleBtn || !sidebarWrapper) {
      console.warn('[navSidebar.js] Sidebar toggle/button not found');
      return;
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebarWrapper.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      console.log(`[navSidebar.js] Sidebar ${isOpen ? 'opened' : 'closed'}`);
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

  /** ===== INIT EVERYTHING ===== **/
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

