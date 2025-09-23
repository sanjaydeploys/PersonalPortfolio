(function(){
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  const links = Array.from(navMenu.querySelectorAll('.nav-link'));

  // link animation helper
  function animateLinksIn() {
    links.forEach((lnk,i)=>{
      lnk.classList.remove('anim-out');
      setTimeout(()=>lnk.classList.add('anim-in'), i*60);
    });
  }
  function animateLinksOut() {
    links.forEach((lnk,i)=>{
      lnk.classList.remove('anim-in');
      lnk.classList.add('anim-out');
      setTimeout(()=>{
        lnk.classList.remove('anim-out');
      },520+(i*10));
    });
  }

  // open menu
  function openMenu(){
    navMenu.classList.add('active');
    overlay.classList.add('visible');
    document.documentElement.classList.add('nav-open');
    animateLinksIn();
  }

  // close menu
  function closeMenu(){
    navMenu.classList.remove('active');
    overlay.classList.remove('visible');
    document.documentElement.classList.remove('nav-open');
    animateLinksOut();
  }

  // toggle
  navToggle.addEventListener('click',()=>navMenu.classList.contains('active')?closeMenu():openMenu());

  // overlay click
  overlay.addEventListener('click', closeMenu);

  // close on link click
  links.forEach(link=>link.addEventListener('click', closeMenu));

  // close on ESC
  window.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });

  // desktop indicator
  let indicator = document.createElement('div');
  indicator.className='nav-indicator';
  navMenu.appendChild(indicator);
  function placeIndicator(el){
    if(window.innerWidth<=768) { indicator.style.opacity='0'; return; }
    indicator.style.left=el.offsetLeft+'px';
    indicator.style.width=el.offsetWidth+'px';
    indicator.style.opacity='1';
  }
  function hideIndicator(){indicator.style.opacity='0';}
  links.forEach(link=>{
    link.addEventListener('mouseenter',()=>placeIndicator(link));
    link.addEventListener('focus',()=>placeIndicator(link));
    link.addEventListener('mouseleave',hideIndicator);
    link.addEventListener('blur',hideIndicator);
  });
  const activeLink = navMenu.querySelector('.nav-link.active');
  if(activeLink) placeIndicator(activeLink);
  window.addEventListener('resize',()=>{ if(activeLink) placeIndicator(activeLink); });
})();
