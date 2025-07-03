(function () {
  console.log('[faqToggle.js] Script loaded');

  function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (question && answer) {
        const toggle = () => {
          const isExpanded = question.getAttribute('aria-expanded') === 'true';
          question.setAttribute('aria-expanded', !isExpanded);
          question.classList.toggle('active', !isExpanded);
          answer.classList.toggle('active', !isExpanded);
          console.log(`[faqToggle.js] Toggled FAQ: ${question.textContent.trim()}, expanded: ${!isExpanded}`);
        };

        question.addEventListener('click', toggle);

        question.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
      } else {
        console.warn('[faqToggle.js] Missing question or answer in FAQ item');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[faqToggle.js] DOMContentLoaded fired');
      initializeFAQ();
    });
  } else {
    console.log('[faqToggle.js] Document already loaded, initializing');
    initializeFAQ();
  }
})();
