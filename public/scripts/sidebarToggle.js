(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded - Awe Level Edition v7');

  const navMenu = document.getElementById('nav-menu-list');
  const navToggle = document.querySelector('.nav-menu-toggle');
  const links = navMenu?.querySelectorAll('.nav-menu-link');
  const dsaToggleItem = navMenu?.querySelector('.nav-dsa-toggle');
  const dsaToggle = dsaToggleItem?.querySelector('.nav-toggle-link');
  const dsaLinks = navMenu?.querySelector('.nav-dsa-links');
  const submenuToggleItems = navMenu?.querySelectorAll('.nav-submenu-toggle');
  const submenuToggles = navMenu?.querySelectorAll('.nav-submenu-link');
  const subLinks = navMenu?.querySelectorAll('.nav-sub-link');

  // Function for smooth expand/collapse with dynamic height calculation and parent recalibration
  function toggleHeight(element, expand) {
    if (expand) {
      element.classList.add('active');
      element.style.maxHeight = `${element.scrollHeight}px`;
      // Recalibrate parent height if in mobile to ensure scroll
      if (window.innerWidth <= 768 && navMenu) {
        setTimeout(() => {
          navMenu.style.maxHeight = 'none'; // Allow auto expand
          navMenu.scrollTop = navMenu.scrollHeight; // Scroll to bottom
        }, 500);
      }
    } else {
      element.style.maxHeight = '0px';
      setTimeout(() => {
        element.classList.remove('active');
      }, 500);
      if (window.innerWidth <= 768 && navMenu) {
        setTimeout(() => {
          navMenu.style.maxHeight = 'none';
        }, 500);
      }
    }
  }

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
    closeAllDropdowns();
    removeFocusTrap();
  }

  // Close all dropdowns with smooth collapse
  function closeAllDropdowns() {
    if (dsaToggleItem && dsaLinks) {
      dsaToggleItem.setAttribute('aria-expanded', 'false');
      toggleHeight(dsaLinks, false);
    }
    submenuToggleItems.forEach((subItem) => {
      subItem.setAttribute('aria-expanded', 'false');
      toggleHeight(subItem.nextElementSibling, false);
      subItem.nextElementSibling.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
    });
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

  // DSA main toggle - with smooth height, independent
  dsaToggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isExpanded = dsaToggleItem.getAttribute('aria-expanded') === 'true';
    dsaToggleItem.setAttribute('aria-expanded', !isExpanded);
    toggleHeight(dsaLinks, !isExpanded);
    if (isExpanded) {
      closeAllSubmenus(); // Close submenus when closing main
    }
  });

  // Function to close all submenus
  function closeAllSubmenus() {
    submenuToggleItems.forEach((subItem) => {
      subItem.setAttribute('aria-expanded', 'false');
      toggleHeight(subItem.nextElementSibling, false);
      subItem.nextElementSibling.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
    });
  }

  // Submenu toggles - with smooth height, close others when opening new one
  submenuToggles.forEach((subToggle, index) => {
    subToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const subItem = submenuToggleItems[index];
      const subMenu = subItem.nextElementSibling;
      const isExpanded = subItem.getAttribute('aria-expanded') === 'true';
      // Close other submenus
      submenuToggleItems.forEach((otherItem, otherIndex) => {
        if (index !== otherIndex) {
          otherItem.setAttribute('aria-expanded', 'false');
          toggleHeight(otherItem.nextElementSibling, false);
          otherItem.nextElementSibling.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
        }
      });
      subItem.setAttribute('aria-expanded', !isExpanded);
      toggleHeight(subMenu, !isExpanded);
      if (!isExpanded) {
        const subLinksInThis = subMenu.querySelectorAll('.nav-sub-link');
        subLinksInThis.forEach((slnk, j) => {
          setTimeout(() => slnk.classList.add('anim-in'), j * 50 + 50);
        });
        // Recalibrate DSA links height
        if (dsaLinks.classList.contains('active')) {
          setTimeout(() => {
            dsaLinks.style.maxHeight = `${dsaLinks.scrollHeight}px`;
          }, 100);
        }
      } else {
        subMenu.querySelectorAll('.nav-sub-link').forEach(slnk => slnk.classList.remove('anim-in'));
        if (dsaLinks.classList.contains('active')) {
          setTimeout(() => {
            dsaLinks.style.maxHeight = `${dsaLinks.scrollHeight}px`;
          }, 500);
        }
      }
    });
  });

  // Close dropdowns on outside click for desktop
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && window.innerWidth >= 769) {
      closeAllDropdowns();
    }
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

  // Link click handling with close - ensure sublinks close menu on click
  links?.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('nav-toggle-link') || link.classList.contains('nav-submenu-link')) {
        e.stopPropagation(); // Prevent bubbling
        return; // Don't close on toggles
      }
      // For actual links, close menu
      closeMenu();
    });
    link.addEventListener('touchstart', (e) => {
      if (link.classList.contains('nav-toggle-link') || link.classList.contains('nav-submenu-link')) {
        e.stopPropagation();
        return;
      }
      closeMenu();
    }, { passive: false });
  });

  // ESC key close
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Advanced focus trapping with loop, targeting only nav
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

  // Sidebar Script - Kept intact, no changes to avoid triggering
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
