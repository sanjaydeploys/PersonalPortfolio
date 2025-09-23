(function(){
  console.log('[navSidebar_v2] Loaded');

  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const links = Array.from(navMenu.querySelectorAll('.nav-link'));

  // create overlay
  let overlay = document.querySelector('.nav-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className='nav-overlay';
    document.body.appendChild(overlay);
  }

  // create indicator
  let indicator = navMenu.querySelector('.nav-indicator');
  if(!indicator){
    indicator = document.createElement('div');
    indicator.className='nav-indicator';
    navMenu.appendChild(indicator);
  }

  const isDesktop = ()=> window.innerWidth>768;
  const placeIndicator = el=>{
    if(!el||!isDesktop()){ indicator.style.opacity='0'; return;}
    const parentRect = navMenu.getBoundingClientRect();
    indicator.style.left = el.offsetLeft+'px';
    indicator.style.width = el.offsetWidth+'px';
    indicator.style.opacity='1';
  };
  const hideIndicator=()=>indicator.style.opacity='0';

  links.forEach(link=>{
    link.addEventListener('mouseenter', ()=>placeIndicator(link));
    link.addEventListener('focus', ()=>placeIndicator(link));
    link.addEventListener('mouseleave', hideIndicator);
    link.addEventListener('blur', hideIndicator);
  });

  // toggle mobile menu
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded')==='true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('active');
    if(navMenu.classList.contains('active')) openMenu(); else closeMenu();
  });

  links.forEach(link=>{
    link.addEventListener('click', ()=>{ if(navMenu.classList.contains('active')) closeMenu(); });
  });

  overlay.addEventListener('click', closeMenu);
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

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
    navToggle.setAttribute('aria-expanded','false');
    links.forEach(lnk=>lnk.classList.remove('anim-in'));
    hideIndicator();
  }

  // sync active link on load
  const active = navMenu.querySelector('.nav-link.active');
  if(active) placeIndicator(active);

  window.addEventListener('resize', ()=>{
    if(!isDesktop()) hideIndicator();
    else if(active) placeIndicator(active);
  });

})();
