(function () {
  console.log('[faqToggle.js] Script loaded');

  function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (question && answer) {
        question.addEventListener('click', () => {
          const isExpanded = question.getAttribute('aria-expanded') === 'true';
          question.setAttribute('aria-expanded', !isExpanded);
          answer.classList.toggle('active', !isExpanded);
          console.log(`[faqToggle.js] Toggled FAQ: ${question.textContent}, expanded: ${!isExpanded}`);
        });
        question.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
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
