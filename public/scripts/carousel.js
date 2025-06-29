(function () {
  console.log('[carousel.js] Script loaded');

  function waitForElement(selector, callback, maxAttempts = 10, interval = 100) {
    let attempts = 0;
    const check = () => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`[carousel.js] Found element: ${selector}`);
        callback(element);
      } else if (attempts < maxAttempts) {
        attempts++;
        console.log(`[carousel.js] Waiting for ${selector}, attempt ${attempts}`);
        setTimeout(check, interval);
      } else {
        console.error(`[carousel.js] Element ${selector} not found after ${maxAttempts} attempts`);
      }
    };
    check();
  }

  function initializeCarousel() {
    waitForElement('.testimonials-carousel', (carousel) => {
      const cards = carousel.querySelectorAll('.testimonial-card');
      if (cards.length === 0) {
        console.error('[carousel.js] No testimonial cards found');
        return;
      }

      let currentIndex = 0;
      const totalCards = cards.length;

      function showCard(index) {
        cards.forEach((card, i) => {
          card.style.display = i === index ? 'block' : 'none';
        });
        console.log(`[carousel.js] Showing card ${index + 1} of ${totalCards}`);
      }

      function nextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        showCard(currentIndex);
      }

      showCard(currentIndex);
      const interval = setInterval(nextCard, 5000);

      // Cleanup interval on page unload
      window.addEventListener('unload', () => {
        clearInterval(interval);
        console.log('[carousel.js] Cleared interval');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[carousel.js] DOMContentLoaded fired');
      initializeCarousel();
    });
  } else {
    console.log('[carousel.js] Document already loaded, initializing');
    initializeCarousel();
  }
})();
