(function(){
  console.log('[navEnhance_v3] Loaded');

  const navMenu = document.getElementById('nav-menu');
  if(!navMenu) return;
  const navToggle = document.querySelector('.nav-toggle');
  const links = Array.from(navMenu.querySelectorAll('.nav-link'));

  // Overlay
  let overlay = document.querySelector('.nav-overlay');
  if(!overlay){ overlay = document.createElement('div'); overlay.className='nav-overlay'; document.body.appendChild(overlay); }

  // Indicator
  let indicator = navMenu.querySelector('.nav-indicator');
  if(!indicator){ indicator = document.createElement('div'); indicator.className='nav-indicator'; navMenu.appendChild(indicator); }

  const isDesktop = ()=> window.innerWidth>768;
  const placeIndicator = el=>{
    if(!el||!isDesktop()){ indicator.style.opacity='0'; return;}
    indicator.style.left = el.offsetLeft+'px';
    indicator.style.width = el.offsetWidth+'px';
    indicator.style.opacity='1';
  };
  const hideIndicator=()=>indicator.style.opacity='0';

  // desktop hover
  links.forEach(link=>{
    link.addEventListener('mouseenter', ()=>placeIndicator(link));
    link.addEventListener('focus', ()=>placeIndicator(link));
    link.addEventListener('mouseleave', hideIndicator);
    link.addEventListener('blur', hideIndicator);
  });

  // open / close functions
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

  // toggle click
  navToggle?.addEventListener('click', ()=>{
    navMenu.classList.toggle('active');
    const isActive = navMenu.classList.contains('active');
    if(isActive) openMenu(); else closeMenu();
    navToggle.setAttribute('aria-expanded', isActive);
  });

  // overlay click
  overlay.addEventListener('click', closeMenu);
  // ESC key
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });
  // click nav link closes menu
  links.forEach(link=>link.addEventListener('click', ()=>{ if(navMenu.classList.contains('active')) closeMenu(); }));

  // sync active on load
  const active = navMenu.querySelector('.nav-link.active');
  if(active) placeIndicator(active);

  // resize indicator
  window.addEventListener('resize', ()=>{
    if(!isDesktop()) hideIndicator();
    else if(active) placeIndicator(active);
  });
})();
