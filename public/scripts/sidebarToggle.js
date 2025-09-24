(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded - Awe Level Edition v16');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) callback(element);
      else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, interval);
      } else {
        console.warn(`[AdvancedNavbar] Element ${selector} not found after ${maxAttempts} attempts`);
        callback(null);
      }
    };
    check();
  }

  function initializeNav() {
    const navMenu = document.getElementById('nav-menu-list');
    const navToggle = document.querySelector('.nav-menu-toggle');
    const links = navMenu?.querySelectorAll('.nav-menu-link');

    // Reset all submenus on load
    function resetSubmenus(parent = navMenu) {
      const toggles = parent.querySelectorAll('.nav-toggle');
      toggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        const submenu = toggle.querySelector('.subtree');
        if (submenu) {
          submenu.classList.remove('active');
          submenu.style.display = 'none';
          submenu.style.maxHeight = '0px';
          resetSubmenus(submenu); // Recursively reset nested submenus
        }
      });
    }

    // Smooth expand/collapse with dynamic height
    function toggleHeight(element, expand) {
      if (!element) {
        console.warn('[AdvancedNavbar] toggleHeight called with null element');
        return;
      }
      if (expand) {
        element.style.display = 'block';
        element.classList.add('active');
        element.style.maxHeight = `${element.scrollHeight}px`;
        if (window.innerWidth <= 1024 && navMenu) {
          setTimeout(() => {
            navMenu.querySelector('.nav-menu-items').scrollTop = navMenu.scrollHeight;
          }, 500);
        }
      } else {
        element.style.maxHeight = '0px';
        setTimeout(() => {
          element.classList.remove('active');
          element.style.display = 'none';
        }, 500);
      }
    }

    // Open main menu
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

    // Close main menu
    function closeMenu() {
      if (!navMenu) return;
      navMenu.classList.remove('active');
      document.documentElement.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
      links.forEach(lnk => lnk.classList.remove('anim-in'));
      resetSubmenus();
      removeFocusTrap();
    }

    // Toggle submenu (generic for any depth)
    function toggleSubmenu(toggleItem, submenu) {
      if (!toggleItem || !submenu) return;
      const isExpanded = toggleItem.getAttribute('aria-expanded') === 'true';
      toggleItem.setAttribute('aria-expanded', !isExpanded);
      toggleHeight(submenu, !isExpanded);
      if (!isExpanded) {
        const subLinks = submenu.querySelectorAll('.nav-sub-link');
        subLinks.forEach((slnk, j) => {
          setTimeout(() => slnk.classList.add('anim-in'), j * 50 + 50);
        });
      } else {
        submenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
        resetSubmenus(submenu); // Close nested submenus
      }
    }

    // Main menu toggle
    navToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Generic toggle handler for all submenus
    navMenu?.addEventListener('click', (e) => {
      const toggleLink = e.target.closest('.nav-toggle-link');
      if (!toggleLink) return;
      e.preventDefault();
      e.stopPropagation();
      const toggleItem = toggleLink.closest('.nav-toggle');
      const submenu = toggleItem?.querySelector(':scope > .subtree');
      if (!submenu) return;

      // Close sibling submenus at the same level
      const parentSubmenu = toggleItem.closest('.subtree') || navMenu;
      const siblingToggles = parentSubmenu.querySelectorAll(':scope > .nav-menu-item.nav-toggle');
      siblingToggles.forEach(sibling => {
        if (sibling !== toggleItem && sibling.getAttribute('aria-expanded') === 'true') {
          sibling.setAttribute('aria-expanded', 'false');
          const siblingSubmenu = sibling.querySelector(':scope > .subtree');
          if (siblingSubmenu) {
            toggleHeight(siblingSubmenu, false);
            siblingSubmenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
            resetSubmenus(siblingSubmenu);
          }
        }
      });

      toggleSubmenu(toggleItem, submenu);
    });

    // Sub-link navigation
    const subLinks = navMenu?.querySelectorAll('.nav-sub-link');
    subLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      });
      link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      }, { passive: false });
    });

    // Social link navigation
    const socialLinks = navMenu?.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      });
      link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      }, { passive: false });
    });

    // Close dropdowns on outside click (desktop)
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && window.innerWidth >= 1025) {
        resetSubmenus();
      }
    });

    // Swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;
    navMenu?.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    navMenu?.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 75) closeMenu();
      if (touchEndX - touchStartX > 75 && !navMenu.classList.contains('active')) openMenu();
    }, { passive: true });

    // Link click handling
    links?.forEach(link => {
      if (link.classList.contains('nav-toggle-link')) return;
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      });
      link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
        closeMenu();
      }, { passive: false });
    });

    // ESC key close
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    // Focus trapping
    function trapFocus(element) {
      const focusableEls = Array.from(element.querySelectorAll('a[href], button:not([disabled]), [role="button"]'));
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

    // Initialize by resetting submenus
    resetSubmenus();
  }

  // Sidebar Script - Preserved exactly
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

  // Initialize nav after DOM is ready
  waitForElement('#nav-menu-list', () => {
    initializeNav();
  });
})();
