(function () {
  function waitForElement(selector, callback, maxAttempts = 12, interval = 80) {
    let attempts = 0;
    const check = () => {
      const el = document.querySelector(selector);
      if (el) callback(el);
      else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, interval);
      } else callback(null);
    };
    check();
  }

  function initNavMenu() {
    waitForElement('.nav-toggle', toggle => {
      waitForElement('#nav-menu', menu => {
        if (!toggle || !menu) return;

        const originalImage = document.querySelector('#nav-image');

        function createSignature() {
          if (menu.querySelector('.nav-signature-clone')) return;
          if (!originalImage) return;
          const clone = originalImage.cloneNode(true);
          clone.removeAttribute('id');
          clone.classList.add('nav-signature-clone');
          clone.setAttribute('aria-hidden', 'true');
          menu.appendChild(clone);
          clone.offsetHeight;
        }

        function removeSignature() {
          const sig = menu.querySelector('.nav-signature-clone');
          if (sig) sig.remove();
        }

        function openMenu() {
          toggle.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
          menu.classList.add('active');
          setTimeout(createSignature, 50);
        }

        function closeMenu() {
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('active');
          setTimeout(removeSignature, 400);
        }

        toggle.addEventListener('click', () => {
          menu.classList.contains('active') ? closeMenu() : openMenu();
        });

        menu.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', () => {
            if (menu.classList.contains('active')) closeMenu();
          });
        });

        document.addEventListener('click', e => {
          if (!menu.classList.contains('active')) return;
          if (!toggle.contains(e.target) && !menu.contains(e.target)) closeMenu();
        });

        document.addEventListener('keydown', e => {
          if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
        });
      });
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

  function initAll() {
    initNavMenu();
    initSidebar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
