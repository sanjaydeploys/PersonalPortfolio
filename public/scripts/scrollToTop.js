(function () {
  console.log('[scrollToTop.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[scrollToTop.js] Found element: ${selector}`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`[scrollToTop.js] Waiting for ${selector}, attempt ${attempts}`);
        setTimeout(check, interval);
      } else {
        console.error(`[scrollToTop.js] Element ${selector} not found after ${maxAttempts} attempts`);
      }
    };
    check();
  }

  function initializeScrollToTop() {
    waitForElement('.scroll-to-top', (button) => {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          button.classList.add('visible');
          console.log('[scrollToTop.js] Button visible');
        } else {
          button.classList.remove('visible');
          console.log('[scrollToTop.js] Button hidden');
        }
      });

      button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('[scrollToTop.js] Scroll to top triggered');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[scrollToTop.js] DOMContentLoaded fired');
      initializeScrollToTop();
    });
  } else {
    console.log('[scrollToTop.js] Document already loaded, initializing');
    initializeScrollToTop();
  }
})();
