document.addEventListener('DOMContentLoaded', function() {
  const langButtons = document.querySelectorAll('.lang-btn');

  function setLanguage(lang) {
    document.querySelectorAll('[lang="en"]').forEach(el => {
      el.classList.toggle('lang-hidden', lang !== 'en');
      el.classList.toggle('lang-visible', lang === 'en');
    });
    document.querySelectorAll('[lang="hi"]').forEach(el => {
      el.classList.toggle('lang-hidden', lang !== 'hi');
      el.classList.toggle('lang-visible', lang === 'hi');
    });
    localStorage.setItem('language', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  // Initialize language
  const savedLang = localStorage.getItem('language') || 'en';
  setLanguage(savedLang);

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      const newLang = button.dataset.lang;
      setLanguage(newLang);
      // Stop any ongoing speech when language changes
      window.speechSynthesis.cancel();
    });
  });
});
