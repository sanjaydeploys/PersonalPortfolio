document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (!scrollToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility);

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  scrollToTopBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
