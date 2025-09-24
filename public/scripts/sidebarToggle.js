(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded - Awe Level Edition v15');

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
        console.warn(`[AdvancedNavbar] Element ${selector} not found after ${maxAttempts} attempts`);
        callback(null);
      }
    };
    check();
  }

  function initializeNav() {
    waitForElement('#nav-menu-list', (navMenu) => {
      if (!navMenu) {
        console.error('[AdvancedNavbar] nav-menu-list not found');
        return;
      }

      const navToggle = document.querySelector('.nav-menu-toggle');
      const links = navMenu.querySelectorAll('.nav-menu-link');
      const socialLinks = navMenu.querySelectorAll('.social-link');

      // Smooth expand/collapse with dynamic height for any submenu depth
      function toggleHeight(element, expand) {
        if (!element) {
          console.warn('[AdvancedNavbar] toggleHeight called with null element');
          return;
        }
        if (expand) {
          element.style.display = 'block';
          element.classList.add('active');
          // Calculate total height including nested submenus
          let totalHeight = element.scrollHeight;
          const nestedSubmenus = element.querySelectorAll('.nav-submenu-links.active');
          nestedSubmenus.forEach(submenu => {
            totalHeight += submenu.scrollHeight;
          });
          element.style.maxHeight = `${totalHeight}px`;
          if (window.innerWidth <= 1024) {
            setTimeout(() => {
              navMenu.style.maxHeight = 'none';
              navMenu.scrollTop = navMenu.scrollHeight;
            }, 500);
          }
        } else {
          element.style.maxHeight = '0px';
          setTimeout(() => {
            element.classList.remove('active');
            element.style.display = 'none';
          }, 500);
          if (window.innerWidth <= 1024) {
            setTimeout(() => {
              navMenu.style.maxHeight = 'none';
            }, 500);
          }
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
        closeAllDropdowns();
        removeFocusTrap();
      }

      // Close all dropdowns and submenus
      function closeAllDropdowns() {
        const toggleItems = navMenu.querySelectorAll('.nav-dsa-toggle, .nav-case-studies-toggle, .nav-submenu-toggle');
        toggleItems.forEach(item => {
          const submenu = item.nextElementSibling;
          if (submenu) {
            item.setAttribute('aria-expanded', 'false');
            toggleHeight(submenu, false);
            submenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
          }
        });
      }

      // Initialize toggle for any depth
      function initializeToggle(toggleItem, toggleSelector, submenuSelector) {
        waitForElement(toggleSelector, (toggle) => {
          if (!toggle) {
            console.warn(`[AdvancedNavbar] Toggle ${toggleSelector} not found`);
            return;
          }
          waitForElement(submenuSelector, (submenu) => {
            if (!submenu) {
              console.warn(`[AdvancedNavbar] Submenu ${submenuSelector} not found`);
              return;
            }
            toggle.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const isExpanded = toggleItem.getAttribute('aria-expanded') === 'true';
              toggleItem.setAttribute('aria-expanded', !isExpanded);
              toggleHeight(submenu, !isExpanded);
              // Close other top-level menus if this is a top-level toggle
              if (toggleItem.classList.contains('nav-dsa-toggle') || toggleItem.classList.contains('nav-case-studies-toggle')) {
                const otherToggles = navMenu.querySelectorAll(
                  `.nav-dsa-toggle, .nav-case-studies-toggle:not(.${toggleItem.className.split(' ').join('.')})`
                );
                otherToggles.forEach(otherItem => {
                  const otherSubmenu = otherItem.nextElementSibling;
                  if (otherSubmenu && otherItem !== toggleItem) {
                    otherItem.setAttribute('aria-expanded', 'false');
                    toggleHeight(otherSubmenu, false);
                    otherSubmenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
                  }
                });
              }
              // Animate sublinks
              if (!isExpanded) {
                submenu.querySelectorAll('.nav-sub-link').forEach((slnk, j) => {
                  setTimeout(() => slnk.classList.add('anim-in'), j * 50 + 50);
                });
              } else {
                submenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
              }
            });
          });
        });
      }

      // Initialize top-level and submenu toggles
      const toggleConfigs = [
        { item: '.nav-dsa-toggle', toggle: '.nav-dsa-toggle .nav-toggle-link', submenu: '.nav-dsa-links' },
        { item: '.nav-case-studies-toggle', toggle: '.nav-case-studies-toggle .nav-toggle-link', submenu: '.nav-case-studies-links' },
        { item: '.nav-submenu-toggle', toggle: '.nav-submenu-toggle .nav-submenu-link', submenu: '.nav-submenu-links' }
      ];

      toggleConfigs.forEach(config => {
        const toggleItems = navMenu.querySelectorAll(config.item);
        toggleItems.forEach(item => initializeToggle(item, config.toggle, config.submenu));
      });

      // Toggle click for main menu
      navToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Sub-link navigation
      const subLinks = navMenu.querySelectorAll('.nav-sub-link');
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
          closeAllDropdowns();
        }
      });

      // Swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;
      navMenu.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      navMenu.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 75) closeMenu();
        if (touchEndX - touchStartX > 75 && !navMenu.classList.contains('active')) openMenu();
      }, { passive: true });

      // Link click handling
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          if (link.classList.contains('nav-toggle-link') || link.classList.contains('nav-submenu-link')) {
            e.stopPropagation();
            return;
          }
          const href = link.getAttribute('href');
          if (href && href !== '#') {
            window.location.href = href;
          }
          closeMenu();
        });
        link.addEventListener('touchstart', (e) => {
          if (link.classList.contains('nav-toggle-link') || link.classList.contains('nav-submenu-link')) {
            e.stopPropagation();
            return;
          }
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
    });
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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNav);
  } else {
    initializeNav();
  }
})();
