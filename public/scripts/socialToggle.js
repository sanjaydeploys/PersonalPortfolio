document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.social-toggle-button');
  const shareLinks = document.querySelector('.social-share-links');

  if (toggleButton && shareLinks) {
    toggleButton.addEventListener('click', () => {
      shareLinks.classList.toggle('open');
      toggleButton.classList.toggle('active');
      toggleButton.setAttribute('aria-expanded', shareLinks.classList.contains('open'));
    });

    // Close the share links when clicking outside
    document.addEventListener('click', (event) => {
      if (!toggleButton.contains(event.target) && !shareLinks.contains(event.target)) {
        shareLinks.classList.remove('open');
        toggleButton.classList.remove('active');
        toggleButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
