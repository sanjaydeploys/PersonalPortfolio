(function () {
  console.log('[faqToggle.js] Script loaded (debounced)');

  function initializeFAQ() {
    const questions = document.querySelectorAll('.faq-question');

    questions.forEach((question) => {
      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) {
        console.error('[faqToggle.js] FAQ answer not found for aria-controls:', answerId);
        return;
      }

      // Remove any previous listeners
      const newQuestion = question.cloneNode(true);
      question.parentNode.replaceChild(newQuestion, question);

      const toggle = () => {
        const isExpanded = newQuestion.getAttribute('aria-expanded') === 'true';
        newQuestion.setAttribute('aria-expanded', !isExpanded);
        newQuestion.classList.toggle('active', !isExpanded);
        answer.classList.toggle('active', !isExpanded);
        console.log(`[faqToggle.js] Toggled FAQ: ${newQuestion.textContent.trim()}, expanded: ${!isExpanded}`);
      };

      newQuestion.addEventListener('click', toggle);
      newQuestion.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFAQ, { once: true });
  } else {
    initializeFAQ();
  }
})();
