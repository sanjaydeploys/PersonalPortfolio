(function(){
  console.log('[AdvancedNavbar+Sidebar] Loaded');

  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const closeBtn = navMenu?.querySelector('.nav-close');
  const links = navMenu.querySelectorAll('.nav-link');

  // Overlay
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // Open menu
  function openMenu() {
    navMenu.classList.add('active');
    overlay.classList.add('visible');
    document.documentElement.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.style.display = 'none';
    links.forEach((lnk, i) => {
      setTimeout(() => lnk.classList.add('anim-in'), i * 100);
    });
  }

  // Close menu
  function closeMenu() {
    navMenu.classList.remove('active');
    overlay.classList.remove('visible');
    document.documentElement.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.style.display = 'flex';
    links.forEach(lnk => lnk.classList.remove('anim-in'));
  }

  // Toggle click
  navToggle?.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) closeMenu();
    else openMenu();
  });

  // Close button click
  closeBtn?.addEventListener('click', closeMenu);

  // Overlay click
  overlay.addEventListener('click', closeMenu);

  // ESC key
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Navlink click
  links.forEach(link => {
    link.addEventListener('click', () => {
      window.location.href = link.getAttribute('href'); // Direct navigation
    });
  });

  // === ORIGINAL SIDEBAR SCRIPT INTACT ===
  (function(){
    console.log('[sidebarToggle.js] Script loaded');

    function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
      let attempts = 0;
      const check = () => {
        const element = document.querySelector(selector);
        if (element) callback(element);
        else if (attempts < maxAttempts) { attempts++; setTimeout(check, interval); }
        else callback(null);
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
      waitForElement('.nav-toggle', navToggle => {
        waitForElement('#nav-menu', navMenu => { toggleMenuLogic(navToggle, navMenu); });
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
      });

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

    function initializeAll() { /* initNavMenu(); */ initSidebar(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAll);
    else initializeAll();
  })();
})();
