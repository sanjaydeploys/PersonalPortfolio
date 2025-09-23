(function(){
  // Run after DOM ready
  function ready(fn){ if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function(){
    const menu = document.getElementById('nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    if(!menu) return;

    // Create a single indicator element inside nav-menu (if not exist)
    let indicator = menu.querySelector('.nav-indicator');
    if(!indicator){
      indicator = document.createElement('div');
      indicator.className = 'nav-indicator';
      menu.appendChild(indicator);
    }

    const links = Array.from(menu.querySelectorAll('.nav-link'));

    // Utility: desktop predicate
    function isDesktop(){ return window.innerWidth > 768; }

    // Place indicator using offsetLeft/offsetWidth relative to nav-menu
    function placeIndicatorFor(el){
      if(!el || !isDesktop()){
        indicator.style.opacity = '0';
        return;
      }
      // element offset relative to menu container
      const left = el.offsetLeft;
      const width = el.offsetWidth;
      indicator.style.left = left + 'px';
      indicator.style.width = width + 'px';
      indicator.style.opacity = '1';
    }

    function hideIndicator(){
      const active = menu.querySelector('.nav-link.active');
      if(active && isDesktop()){
        placeIndicatorFor(active);
      } else {
        indicator.style.opacity = '0';
        indicator.style.width = '0';
      }
    }

    // Hover & focus handlers for desktop
    links.forEach((lnk, idx) => {
      lnk.addEventListener('mouseenter', () => { if(isDesktop()) placeIndicatorFor(lnk); });
      lnk.addEventListener('focus', () => { if(isDesktop()) placeIndicatorFor(lnk); });
      lnk.addEventListener('mouseleave', hideIndicator);
      lnk.addEventListener('blur', hideIndicator);

      // On click - close menu if mobile: simply remove 'active' and sync aria
      lnk.addEventListener('click', () => {
        if(menu.classList.contains('active')){
          menu.classList.remove('active');
          if(navToggle){
            navToggle.setAttribute('aria-expanded','false');
            navToggle.classList.remove('active');
          }
        }
      });
    });

    // If server-side set .active link exists, snap to it
    const activeServer = menu.querySelector('.nav-link.active');
    if(activeServer) placeIndicatorFor(activeServer);

    // Recompute on resize (debounced)
    let rto=null;
    window.addEventListener('resize', ()=> {
      clearTimeout(rto);
      rto = setTimeout(()=> {
        if(isDesktop()){
          const active = menu.querySelector('.nav-link.active');
          if(active) placeIndicatorFor(active);
        } else {
          hideIndicator();
        }
      }, 120);
    });

    // Keyboard navigation for menu (left/right/enter/esc)
    // Focused element inside menu can use arrows to move
    menu.addEventListener('keydown', (e) => {
      const focusEl = document.activeElement;
      const idx = links.indexOf(focusEl);
      if(idx === -1) return;

      if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){
        e.preventDefault();
        const next = links[(idx + 1) % links.length];
        next.focus();
        if(isDesktop()) placeIndicatorFor(next);
      } else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){
        e.preventDefault();
        const prev = links[(idx - 1 + links.length) % links.length];
        prev.focus();
        if(isDesktop()) placeIndicatorFor(prev);
      } else if(e.key === 'Escape'){
        // close mobile menu easily
        if(menu.classList.contains('active')){
          menu.classList.remove('active');
          if(navToggle){
            navToggle.setAttribute('aria-expanded','false');
            navToggle.classList.remove('active');
            navToggle.focus();
          }
        }
      } else if(e.key === 'Enter' || e.key === ' '){
        // allow link activation via Enter/Space naturally
      }
    });

    // Ensure indicator follows mutations to class (if your sidebar script toggles classes)
    const mo = new MutationObserver((mutations)=>{
      mutations.forEach(m=>{
        if(m.attributeName === 'class'){
          // if the menu opens on mobile hide indicator
          const isActive = menu.classList.contains('active');
          if(!isDesktop() && isActive){
            indicator.style.opacity = '0';
          } else if(isDesktop()){
            const active = menu.querySelector('.nav-link.active');
            if(active) placeIndicatorFor(active);
          }
        }
      });
    });
    mo.observe(menu, { attributes:true, attributeFilter:['class'] });

    // Clean up on unload
    window.addEventListener('unload', ()=> mo.disconnect());
  });
})();
