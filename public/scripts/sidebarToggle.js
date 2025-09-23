(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');

    // Create indicator for desktop
    const indicator = document.createElement('div');
    indicator.className = 'nav-indicator';
    menu.appendChild(indicator);

    const links = menu.querySelectorAll('.nav-link');

    // Toggle menu on mobile
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      menu.classList.toggle('active');
    });

    // Close mobile menu on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        if(menu.classList.contains('active')) {
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    });

    // Desktop indicator hover
    function moveIndicator(el) {
      if(window.innerWidth <= 768) return;
      const rect = el.getBoundingClientRect();
      const parentRect = menu.getBoundingClientRect();
      indicator.style.left = (rect.left - parentRect.left) + 'px';
      indicator.style.width = rect.width + 'px';
      indicator.style.opacity = '1';
    }
    function hideIndicator() { indicator.style.opacity = '0'; }

    links.forEach(link => {
      link.addEventListener('mouseenter', () => moveIndicator(link));
      link.addEventListener('focus', () => moveIndicator(link));
      link.addEventListener('mouseleave', hideIndicator);
      link.addEventListener('blur', hideIndicator);
    });

    // Active link on load
    const active = menu.querySelector('.nav-link.active');
    if(active) moveIndicator(active);

    // Reset on resize
    window.addEventListener('resize', () => {
      if(window.innerWidth <= 768) hideIndicator();
      else if(active) moveIndicator(active);
    });
  });
})();
