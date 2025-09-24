(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded');

  const navMenu = document.getElementById('nav-menu-list');
  const navToggle = document.querySelector('.nav-menu-toggle');
  const closeBtn = navMenu?.querySelector('.nav-menu-close');
  const links = navMenu.querySelectorAll('.nav-menu-link');

  // Open menu
  function openMenu() {
    navMenu.classList.add('active');
    document.documentElement.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('active'); // For hamburger animation
    navToggle.style.display = 'flex'; // Keep visible for animation
    links.forEach((lnk, i) => {
      setTimeout(() => lnk.classList.add('anim-in'), i * 100);
    });
    trapFocus(navMenu); // Advanced: focus trapping
  }

  // Close menu
  function closeMenu() {
    navMenu.classList.remove('active');
    document.documentElement.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
    links.forEach(lnk => lnk.classList.remove('anim-in'));
    removeFocusTrap(); // Advanced
  }

  // Toggle click
  navToggle?.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) closeMenu();
    else openMenu();
  });

  // Close button click
  closeBtn?.addEventListener('click', closeMenu);

  // ESC key
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Advanced: Swipe to close on mobile
  let touchStartX = 0;
  let touchEndX = 0;
  navMenu.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });
  navMenu.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) closeMenu(); // Swipe left to close
  });

  // Ensure nav links are clickable with natural navigation
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      // No preventDefault - allow natural <a> navigation
      closeMenu(); // Close menu after click
    });
  });

  // Advanced: Focus trapping in menu
  function trapFocus(element) {
    const focusableEls = element.querySelectorAll('a[href], button');
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
    first.focus();
    element._focusTrap = handleKey; // Store for removal
  }
  function removeFocusTrap() {
    if (navMenu._focusTrap) {
      navMenu.removeEventListener('keydown', navMenu._focusTrap);
      delete navMenu._focusTrap;
    }
  }

  // === Original Sidebar Script Reintroduced ===
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

    function toggleMenuLogic(toggle, menu) {
      if (!toggle || !menu) return;
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active', !isExpanded);
      });
    }

    function initNavMenu() {
      waitForElement('.nav-menu-toggle', navToggle => {
        waitForElement('#nav-menu-list', navMenu => { toggleMenuLogic(navToggle, navMenu); });
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
        trapFocus(sidebarWrapper); // Advanced: add focus trap to sidebar too
      });

      sidebarWrapper.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
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
      initNavMenu(); // Reintroduced, but since main logic is above, it won't conflict
      initSidebar();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAll);
    else initializeAll();
  })();
})();
