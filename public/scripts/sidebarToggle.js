(function () {
  console.log('[sidebarToggle.js] nav fresh v1');

  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('#nav-menu');
    if (!toggle || !menu) {
      console.warn('[sidebarToggle.js] nav toggle/menu missing');
      return;
    }

    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      document.body.appendChild(backdrop);
    }

    const origImg = document.querySelector('#nav-image');

    function addSignatureClone() {
      if (!origImg) return;
      if (menu.querySelector('.nav-signature-clone')) return;
      const clone = origImg.cloneNode(true);
      clone.removeAttribute('id');
      clone.classList.add('nav-signature-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.style.height = '40px';
      clone.style.width = 'auto';

      const cloneLi = document.createElement('li');
      cloneLi.classList.add('nav-signature-li');
      cloneLi.setAttribute('role', 'presentation');
      cloneLi.appendChild(clone);
      menu.appendChild(cloneLi);
    }

    function removeSignatureClone() {
      const existing = menu.querySelector('.nav-signature-li');
      if (existing) existing.remove();
    }

    function open() {
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('nav-open');
      setTimeout(addSignatureClone, 100);
    }

    function close() {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('nav-open');
      setTimeout(removeSignatureClone, 400);
    }

    toggle.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (menu.classList.contains('open')) close(); else open();
    });

    backdrop.addEventListener('click', close);

    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menu.classList.contains('open')) {
        close();
      }
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
      console.log(`[sidebarToggle.js] Sidebar ${isOpen ? 'opened' : 'closed'}`);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initNav(); initSidebar(); });
  } else {
    initNav();
    initSidebar();
  }
})();
