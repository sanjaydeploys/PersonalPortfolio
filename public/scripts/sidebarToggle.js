(function(){
  console.log('[AdvancedNavbar] Loaded');

  // === NAVBAR ELEMENTS ===
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const links = Array.from(navMenu.querySelectorAll('.nav-link'));

  // === OVERLAY ===
  let overlay = document.querySelector('.nav-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className='nav-overlay';
    document.body.appendChild(overlay);
  }

  // === INDICATOR ===
  let indicator = navMenu.querySelector('.nav-indicator');
  if(!indicator){
    indicator = document.createElement('div');
    indicator.className='nav-indicator';
    navMenu.appendChild(indicator);
  }

  const isDesktop = ()=> window.innerWidth>768;

  const placeIndicator = el=>{
    if(!el || !isDesktop()){ indicator.style.opacity='0'; return; }
    indicator.style.left = el.offsetLeft+'px';
    indicator.style.width = el.offsetWidth+'px';
    indicator.style.opacity='1';
  };
  const hideIndicator = ()=> indicator.style.opacity='0';

  // Desktop hover indicator
  links.forEach(link=>{
    link.addEventListener('mouseenter', ()=>placeIndicator(link));
    link.addEventListener('focus', ()=>placeIndicator(link));
    link.addEventListener('mouseleave', hideIndicator);
    link.addEventListener('blur', hideIndicator);
  });

  // OPEN / CLOSE
  function openMenu(){
    overlay.classList.add('visible');
    document.documentElement.classList.add('nav-open');
    links.forEach((lnk,i)=>{
      lnk.classList.remove('anim-in');
      setTimeout(()=>lnk.classList.add('anim-in'), i*60);
    });
  }

  function closeMenu(){
    overlay.classList.remove('visible');
    document.documentElement.classList.remove('nav-open');
    navMenu.classList.remove('active');
    if(navToggle) navToggle.setAttribute('aria-expanded','false');
    links.forEach(lnk=>lnk.classList.remove('anim-in'));
    hideIndicator();
  }

  // TOGGLE CLICK
  navToggle?.addEventListener('click', ()=>{
    const isActive = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    if(isActive) openMenu(); else closeMenu();
  });

  // Overlay click & ESC key
  overlay.addEventListener('click', closeMenu);
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

  // Close menu on link click
  links.forEach(link=>link.addEventListener('click', ()=>{ if(navMenu.classList.contains('active')) closeMenu(); }));

  // Active link indicator sync
  const active = navMenu.querySelector('.nav-link.active');
  if(active) placeIndicator(active);

  // Resize
  window.addEventListener('resize', ()=>{
    if(!isDesktop()) hideIndicator();
    else if(active) placeIndicator(active);
  });

  // === ORIGINAL SIDEBAR SCRIPT ===
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

    function initializeAll() { initNavMenu(); initSidebar(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAll);
    else initializeAll();
  })();
})();
