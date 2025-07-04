(function () {
  console.log('[faqToggle.js] Script loaded (aria-controls version)');

  function initializeFAQ() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach(function (question) {
      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) {
        console.error('[faqToggle.js] FAQ answer not found for aria-controls:', answerId);
        return;
      }

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
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFAQ);
  } else {
    initializeFAQ();
  }
})();
