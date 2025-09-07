(function () {
  console.log('[faqToggle.js] Script loaded and initializing…');

  function initializeFAQ() {
    const faqContainer = document.querySelector('.faq-list');
    if (!faqContainer) {
      console.warn('[faqToggle.js] No FAQ container found on page.');
      return;
    }

    const handleToggle = (e) => {
      const question = e.target.closest('.faq-question');
      if (!question || e.target.classList.contains('speak-btn')) return;

      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) {
        console.error('[faqToggle.js] FAQ answer not found for aria-controls:', answerId);
        return;
      }

      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', String(!isExpanded));
      question.classList.toggle('active', !isExpanded);
      answer.classList.toggle('active', !isExpanded);

      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0px';
      }

      console.log(
        `[faqToggle.js] Toggled FAQ: "${question.textContent.trim()}", expanded: ${!isExpanded}`
      );
    };

    faqContainer.addEventListener('click', handleToggle);

    faqContainer.addEventListener('keydown', (e) => {
      const question = e.target.closest('.faq-question');
      if (question && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleToggle({ target: question });
      }
    });

    // Initialize collapsed state
    document.querySelectorAll('.faq-answer').forEach((answer) => {
      answer.style.maxHeight = '0px';
      answer.classList.remove('active');
    });
    document.querySelectorAll('.faq-question').forEach((question) => {
      question.setAttribute('aria-expanded', 'false');
      question.classList.remove('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFAQ, { once: true });
  } else {
    initializeFAQ();
  }

  window.reinitializeFAQ = initializeFAQ;
})();
