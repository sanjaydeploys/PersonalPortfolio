<script>
  (function () {
    console.log('[navToggle] Script loaded');

    function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
      let attempts = 0;
      const check = () => {
        const element = document.querySelector(selector);
        if (element) {
          console.log(`[navToggle] Found element: ${selector}`);
          callback(element);
        } else if (attempts < maxAttempts) {
          attempts++;
          console.log(`[navToggle] Waiting for ${selector}, attempt ${attempts}`);
          setTimeout(check, interval);
        } else {
          console.error(`[navToggle] Element ${selector} not found`);
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
            console.log(`[navToggle] Toggled menu, expanded: ${!isExpanded}`);
          });
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeNavToggle);
    } else {
      initializeNavToggle();
    }
  })();
</script>
