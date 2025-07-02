<script>
(function () {
  console.log('[navToggle.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[navToggle.js] Found element: ${selector}`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`[navToggle.js] Waiting for ${selector}, attempt ${attempts}`);
        setTimeout(check, interval);
      } else {
        console.error(`[navToggle.js] Element ${selector} not found after ${maxAttempts} attempts`);
      }
    };
    check();
  }

  function initializeNavToggle() {
    waitForElement('.nav-toggle', (navToggle) => {
      waitForElement('#nav-menu', (navMenu) => {
        navToggle.addEventListener('click', () => {
          const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
          navToggle.setAttribute('aria-expanded', !isExpanded);
          navMenu.classList.toggle('active', !isExpanded);
          console.log(`[navToggle.js] Menu toggled, expanded: ${!isExpanded}`);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[navToggle.js] DOMContentLoaded fired');
      initializeNavToggle();
    });
  } else {
    console.log('[navToggle.js] Document already loaded, initializing');
    initializeNavToggle();
  }
})();
</script>
