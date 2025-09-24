(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded');

  const navMenu = document.getElementById('nav-menu-list');
  const navToggle = document.querySelector('.nav-menu-toggle');
  const closeBtn = navMenu?.querySelector('.nav-menu-close');
  const links = navMenu?.querySelectorAll('.nav-menu-link');
  const dsaToggle = navMenu?.querySelector('.nav-dsa-toggle');
  const dsaLinks = navMenu?.querySelector('.nav-dsa-links');

  // Open menu
  function openMenu() {
    if (!navMenu) return;
    navMenu.classList.add('active');
    document.documentElement.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('active');
    links.forEach((lnk, i) => {
      setTimeout(() => lnk.classList.add('anim-in'), i * 100);
    });
    trapFocus(navMenu);
  }

  // Close menu
  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    document.documentElement.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    links.forEach(lnk => lnk.classList.remove('anim-in'));
    if (dsaToggle && dsaLinks) {
      dsaToggle.classList.remove('active');
      dsaLinks.classList.remove('active');
      dsaToggle.setAttribute('aria-expanded', 'false');
    }
    removeFocusTrap();
  }

  // Toggle click
  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button click
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // DSA submenu toggle
  dsaToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = dsaToggle.getAttribute('aria-expanded') === 'true';
    dsaToggle.setAttribute('aria-expanded', !isExpanded);
    dsaLinks.classList.toggle('active');
    dsaToggle.classList.toggle('active');
  });

  // Swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;
  navMenu?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  navMenu?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) closeMenu(); // Swipe left
    if (touchEndX - touchStartX > 50 && !navMenu.classList.contains('active')) openMenu(); // Swipe right
  });

  // Link click handling
  links?.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
    link.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  // DSA link click handling
  const dsaLinkItems = navMenu?.querySelectorAll('.nav-dsa-link');
  dsaLinkItems?.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
    link.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  });

  // ESC key
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Focus trapping
  function trapFocus(element) {
    const focusableEls = element.querySelectorAll('a[href], button:not([disabled])');
    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];
    const handleKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    element.addEventListener('keydown', handleKey);
    element._focusTrap = handleKey;
    first.focus();
  }
  function removeFocusTrap() {
    if (navMenu._focusTrap) {
      navMenu.removeEventListener('keydown', navMenu._focusTrap);
      delete navMenu._focusTrap;
    }
  }

  // Sidebar Script
  (function(){
    console.log('[sidebarToggle.js] Script loaded');

    function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
      let attempts = 0;
      const check = () => {
        const element = document.querySelector(selector);
        if (element) callback(element);
        else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, interval);
        } else {
          callback(null);
        }
      };
      check();
    }

    function initSidebar() {
      const toggleBtn = document.querySelector('.sidebar-toggle-btn');
      const sidebarWrapper = document.getElementById('sidebar-wrapper');
      if (!toggleBtn || !sidebarWrapper) return;

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebarWrapper.classList.toggle('open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
          trapFocus(sidebarWrapper);
        } else {
          removeFocusTrap(sidebarWrapper);
        }
      });

      sidebarWrapper.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation();
          if (sidebarWrapper.classList.contains('open')) {
            sidebarWrapper.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', false);
            removeFocusTrap(sidebarWrapper);
          }
        });
      });
    }

    function initializeAll() {
      initSidebar();
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
      initializeAll();
    }
  })();
})();
