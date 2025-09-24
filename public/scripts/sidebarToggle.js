(function(){
  console.log('[AdvancedNavbar] Loaded');

  const navMenu = document.getElementById('nav-menu-list');
  const navToggle = document.querySelector('.nav-menu-toggle');
  const closeBtn = navMenu?.querySelector('.nav-menu-close');
  const links = navMenu.querySelectorAll('.nav-menu-link');

  // Open menu
  function openMenu() {
    navMenu.classList.add('active');
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

  // ESC key
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Ensure nav links are clickable
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default to avoid interference
      window.location.href = link.getAttribute('href');
    });
    link.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Ensure touch events work
      window.location.href = link.getAttribute('href');
    });
  });
})();
