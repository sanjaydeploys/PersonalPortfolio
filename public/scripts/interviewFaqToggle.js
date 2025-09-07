(function () {
  console.log('[faqToggle.js] Script loaded and initializing…');

  function initializeFAQ() {
    const faqContainer = document.querySelector('.faq-list');
    if (!faqContainer) {
      console.warn('[faqToggle.js] No FAQ container found on page.');
      return;
    }

    const toggleFAQ = (e) => {
      const question = e.target.closest('.faq-question');
      if (!question || e.target.classList.contains('speak-btn')) return;

      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      if (!answer) {
        console.error('[faqToggle.js] FAQ answer not found for aria-controls:', answerId);
        return;
      }

      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isExpanded;

      question.setAttribute('aria-expanded', String(newExpanded));
      question.classList.toggle('active', newExpanded);
      answer.classList.toggle('active', newExpanded);

      if (newExpanded) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      } else {
        answer.style.maxHeight = '0px';
      }

      console.log(
        `[faqToggle.js] Toggled FAQ: "${question.textContent.trim()}", expanded: ${newExpanded}`
      );
    };

    // Use delegated event listener to capture all future .faq-question elements
    faqContainer.removeEventListener('click', toggleFAQ);
    faqContainer.addEventListener('click', toggleFAQ);

    faqContainer.removeEventListener('keydown', handleKeydown);
    function handleKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const question = e.target.closest('.faq-question');
        if (question) {
          e.preventDefault();
          toggleFAQ({ target: question });
        }
      }
    }
    faqContainer.addEventListener('keydown', handleKeydown);

    // Initialize all FAQs as collapsed
    document.querySelectorAll('.faq-question').forEach((q) => {
      q.setAttribute('aria-expanded', 'false');
      q.classList.remove('active');
    });
    document.querySelectorAll('.faq-answer').forEach((a) => {
      a.classList.remove('active');
      a.style.maxHeight = '0px';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFAQ, { once: true });
  } else {
    initializeFAQ();
  }

  window.reinitializeFAQ = initializeFAQ;
})();
