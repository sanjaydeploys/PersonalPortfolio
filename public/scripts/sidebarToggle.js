(function () {
  console.log('[sidebarToggle.js] Loaded');

  function initSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle-btn');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');

    if (!toggleBtn || !sidebarWrapper) {
      console.warn('[sidebarToggle.js] Sidebar elements not found');
      return;
    }

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebarWrapper.classList.toggle('open');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen);
      console.log(`[sidebarToggle.js] Sidebar ${isOpen ? 'opened' : 'closed'}`);
    });

    // Auto close on link click
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
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    initSidebar();
  }
})();
