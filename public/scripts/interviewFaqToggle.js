console.log('[faqToggle.js] Script loaded and initializing…');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[faqToggle.js] DOM fully loaded, setting up FAQ toggles');

  // Select all FAQ questions
  const faqQuestions = document.querySelectorAll('.faq-question[data-toggle]');

  faqQuestions.forEach((question) => {
    // Ensure aria-controls matches the answer ID
    const answerId = question.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);

    if (!answer) {
      console.error(`[faqToggle.js] No answer found for question with aria-controls="${answerId}"`);
      return;
    }

    // Initialize ARIA attributes and state
    question.setAttribute('aria-expanded', 'false');
    answer.classList.remove('active');
    answer.style.maxHeight = '0';

    // Click handler for toggling
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      console.log(`[faqToggle.js] Toggled FAQ: "${question.textContent.trim()}", expanded: ${!isExpanded}`);

      // Toggle ARIA attributes and classes
      question.setAttribute('aria-expanded', !isExpanded);
      question.classList.toggle('active');

      // Toggle answer visibility with smooth animation
      if (isExpanded) {
        // Collapse
        answer.classList.remove('active');
        answer.style.maxHeight = '0';
      } else {
        // Expand
        answer.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });

    // Handle keyboard accessibility (Enter or Space to toggle)
    question.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        question.click();
      }
    });
  });

  // Handle window resize to adjust max-height for expanded answers
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-answer.active').forEach((answer) => {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    });
  });

  console.log('[faqToggle.js] FAQ toggle initialization complete');
});
