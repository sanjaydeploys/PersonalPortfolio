(function () {
  function initializeFAQ() {
    const faqContainer = document.querySelector('.faq-list');
    if (!faqContainer) return;

    const toggleFAQ = (e) => {
      const question = e.target.closest('.faq-question');
      if (!question || e.target.classList.contains('speak-btn')) return;

      const answerId = question.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);
      if (!answer) return;

      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isExpanded;

      question.setAttribute('aria-expanded', newExpanded);
      answer.classList.toggle('active', newExpanded);
    };

    faqContainer.addEventListener('click', toggleFAQ);
    faqContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const question = e.target.closest('.faq-question');
        if (question) toggleFAQ({ target: question });
      }
    });

    document.querySelectorAll('.faq-question').forEach((q) => {
      q.setAttribute('aria-expanded', 'false');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFAQ);
  } else {
    initializeFAQ();
  }
})();
