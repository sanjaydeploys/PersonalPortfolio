(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded - Awe Level Edition');

  const navMenu = document.getElementById('nav-menu-list');
  const navToggle = document.querySelector('.nav-menu-toggle');
  const closeBtn = navMenu?.querySelector('.nav-menu-close');
  const links = navMenu?.querySelectorAll('.nav-menu-link');
  const dsaToggle = navMenu?.querySelector('.nav-dsa-toggle');
  const dsaLinks = navMenu?.querySelector('.nav-dsa-links');
  const submenuToggles = navMenu?.querySelectorAll('.nav-submenu-toggle');

  // Open menu with enhanced animation
  function openMenu() {
    if (!navMenu) return;
    navMenu.classList.add('active');
    document.documentElement.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('active');
    links.forEach((lnk, i) => {
      setTimeout(() => lnk.classList.add('anim-in'), i * 80 + 100);
    });
    trapFocus(navMenu);
  }

  // Close menu with smooth exit
  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    document.documentElement.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    links.forEach(lnk => lnk.classList.remove('anim-in'));
    if (dsaToggle && dsaLinks) {
      dsaToggle.setAttribute('aria-expanded', 'false');
      dsaLinks.classList.remove('active');
    }
    submenuToggles.forEach(subToggle => {
      subToggle.setAttribute('aria-expanded', 'false');
      subToggle.nextElementSibling.classList.remove('active');
    });
    removeFocusTrap();
  }

  // Toggle click with prevent default
  navToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close button click
  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // DSA main toggle
  dsaToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isExpanded = dsaToggle.getAttribute('aria-expanded') === 'true';
    dsaToggle.setAttribute('aria-expanded', !isExpanded);
    dsaLinks.classList.toggle('active');
  });

  // Submenu toggles
  submenuToggles.forEach(subToggle => {
    subToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = subToggle.getAttribute('aria-expanded') === 'true';
      subToggle.setAttribute('aria-expanded', !isExpanded);
      subToggle.nextElementSibling.classList.toggle('active');
    });
  });

  // Enhanced swipe gestures with threshold
  let touchStartX = 0;
  let touchEndX = 0;
  navMenu?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  navMenu?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 75) closeMenu(); // Swipe left to close
    if (touchEndX - touchStartX > 75 && !navMenu.classList.contains('active')) openMenu(); // Swipe right to open
  }, { passive: true });

  // Link click handling with close
  links?.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('nav-toggle-link') || link.classList.contains('nav-submenu-link')) {
        return; // Don't close on toggles
      }
      e.stopPropagation();
      closeMenu();
    });
    link.addEventListener('touchstart', (e) => {
      if (link.classList.contains('nav-toggle-link') || link.classList.contains('nav-submenu-link')) {
        return;
      }
      e.stopPropagation();
      closeMenu();
    }, { passive: true });
  });

  // ESC key close
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Advanced focus trapping with loop
  function trapFocus(element) {
    const focusableEls = Array.from(element.querySelectorAll('a[href], button:not([disabled])'));
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
  function removeFocusTrap(element = navMenu) {
    if (element._focusTrap) {
      element.removeEventListener('keydown', element._focusTrap);
      delete element._focusTrap;
    }
  }

  // Sidebar Script - Kept intact as per instructions
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
