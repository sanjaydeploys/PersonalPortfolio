(function () {
  console.log('[faqToggle.js] Script loaded and initializing…');

  function initializeFAQ() {
    const faqContainer = document.querySelector('.faq-list');
    if (!faqContainer) {
      console.warn('[faqToggle.js] No FAQ container found on page.');
      return;
    }

    const questions = faqContainer.querySelectorAll('.faq-question');

    if (!questions.length) {
      console.warn('[faqToggle.js] No FAQ questions found on page.');
      return;
    }

    questions.forEach((question) => {
      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) {
        console.error('[faqToggle.js] FAQ answer not found for aria-controls:', answerId);
        return;
      }

      const toggle = () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', String(!isExpanded));
        question.classList.toggle('active', !isExpanded);
        answer.classList.toggle('active', !isExpanded);

        console.log(
          `[faqToggle.js] Toggled FAQ: "${question.textContent.trim()}", expanded: ${!isExpanded}`
        );
      };

      // Prevent duplicate listeners
      question.removeEventListener('click', toggle);
      question.addEventListener('click', toggle);

      question.removeEventListener('keydown', handleKeydown);
      function handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }
      question.addEventListener('keydown', handleKeydown);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFAQ, { once: true });
  } else {
    initializeFAQ();
  }

  window.reinitializeFAQ = initializeFAQ;
})();
