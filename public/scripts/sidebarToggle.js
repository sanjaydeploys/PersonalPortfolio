(function(){
  console.log('[Navbar+Sidebar] Loaded');

  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = Array.from(navMenu.querySelectorAll('.nav-link'));
  const overlay = document.querySelector('.nav-overlay');

  // === Desktop hover indicator ===
  let indicator = document.createElement('div');
  indicator.className='nav-indicator';
  navMenu.appendChild(indicator);

  function placeIndicator(el){
    if(window.innerWidth <= 768 || !el) { indicator.style.opacity='0'; return; }
    indicator.style.left = el.offsetLeft+'px';
    indicator.style.width = el.offsetWidth+'px';
    indicator.style.opacity='1';
  }
  function hideIndicator(){ indicator.style.opacity='0'; }

  navLinks.forEach(link=>{
    link.addEventListener('mouseenter', ()=>placeIndicator(link));
    link.addEventListener('mouseleave', hideIndicator);
  });

  // === Mobile open/close ===
  function openMenu(){
    navMenu.classList.add('active');
    overlay.classList.add('visible');
    document.documentElement.classList.add('nav-open');
    navLinks.forEach((lnk,i)=>{
      lnk.classList.remove('anim-in');
      setTimeout(()=>lnk.classList.add('anim-in'), i*60);
    });
  }
  function closeMenu(){
    navMenu.classList.remove('active');
    overlay.classList.remove('visible');
    document.documentElement.classList.remove('nav-open');
    navLinks.forEach(lnk=>lnk.classList.remove('anim-in'));
    hideIndicator();
    navToggle.setAttribute('aria-expanded','false');
  }

  navToggle.addEventListener('click', ()=>{
    if(navMenu.classList.contains('active')) closeMenu();
    else { navToggle.setAttribute('aria-expanded','true'); openMenu(); }
  });

  overlay.addEventListener('click', closeMenu);
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });
  navLinks.forEach(link=>link.addEventListener('click', closeMenu));

  // === Original sidebar script intact ===
  (function(){
    function waitForElement(selector, callback, maxAttempts=10, interval=100){
      let attempts=0;
      const check = ()=>{
        const el=document.querySelector(selector);
        if(el) callback(el);
        else if(attempts<maxAttempts){ attempts++; setTimeout(check,interval); }
        else callback(null);
      }; check();
    }

    function toggleMenuLogic(toggle, menu){
      if(!toggle||!menu) return;
      toggle.addEventListener('click', ()=>{
        const isExpanded = toggle.getAttribute('aria-expanded')==='true';
        toggle.setAttribute('aria-expanded',!isExpanded);
        menu.classList.toggle('active',!isExpanded);
      });
    }

    function initNavMenu(){
      waitForElement('.nav-toggle', navToggle=>{
        waitForElement('#nav-menu', navMenu=>{ toggleMenuLogic(navToggle,navMenu); });
      });
    }

    function initSidebar(){
      const toggleBtn=document.querySelector('.sidebar-toggle-btn');
      const sidebarWrapper=document.getElementById('sidebar-wrapper');
      if(!toggleBtn||!sidebarWrapper) return;

      toggleBtn.addEventListener('click', ()=>{
        const isOpen = sidebarWrapper.classList.toggle('open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded',isOpen);
      });
      sidebarWrapper.querySelectorAll('.sidebar-link').forEach(link=>{
        link.addEventListener('click', ()=>{
          if(sidebarWrapper.classList.contains('open')){
            sidebarWrapper.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', false);
          }
        });
      });
    }

    function initializeAll(){ initNavMenu(); initSidebar(); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initializeAll);
    else initializeAll();
  })();
})();
