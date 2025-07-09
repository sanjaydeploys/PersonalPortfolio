(function () {
  console.log('[animations.js] Script loaded');

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function handleScrollAnimations() {
    const elements = document.querySelectorAll('.section, .card, .faq-item');
    elements.forEach((el) => {
      if (isElementInViewport(el)) {
        el.classList.add('animate');
      }
    });
  }

  function initializeAnimations() {
    document.addEventListener('scroll', handleScrollAnimations);
    document.addEventListener('DOMContentLoaded', () => {
      handleScrollAnimations();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[animations.js] DOMContentLoaded fired');
      initializeAnimations();
    });
  } else {
    console.log('[animations.js] Document already loaded, initializing');
    initializeAnimations();
  }
})();
