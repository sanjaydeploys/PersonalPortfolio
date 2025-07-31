document.addEventListener('DOMContentLoaded', () => {
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const snippetId = button.getAttribute('data-snippet-id');
      const wrapper = document.getElementById(snippetId);
      const emailContent = wrapper ? wrapper.getAttribute('data-snippet') : '';
      if (emailContent) {
        navigator.clipboard.writeText(emailContent).then(() => {
          button.textContent = 'Copied';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'Copy Email';
            button.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy email:', err);
          button.textContent = 'Error';
          setTimeout(() => {
            button.textContent = 'Copy Email';
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
