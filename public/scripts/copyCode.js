document.addEventListener('DOMContentLoaded', () => {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const snippetId = button.getAttribute('data-snippet-id');
      const wrapper = document.getElementById(snippetId);
      const code = wrapper ? wrapper.getAttribute('data-snippet') : '';
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = 'Copied';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          button.textContent = 'Error';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        });
      }
    });

    // Accessibility: Allow copying with Enter or Space key
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
});
