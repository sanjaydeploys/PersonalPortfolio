const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const highlightText = (text, query) => {
  if (!query || !text) return text;
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    document.querySelector('.nav-menu').classList.toggle('active');
  });
}

const searchInput = document.getElementById('faq-search');
const searchButton = document.querySelector('.search-btn');
const faqItems = document.querySelectorAll('.faq-item');

const performSearch = () => {
  const query = searchInput.value.trim().toLowerCase();
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question').textContent.toLowerCase();
    const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
    const matches = query === '' || question.includes(query) || answer.includes(query);
    item.style.display = matches ? 'block' : 'none';
    if (matches && query !== '') {
      item.querySelector('.faq-question').innerHTML = highlightText(question, query);
      item.querySelector('.faq-answer p').innerHTML = highlightText(answer, query);
    } else {
      item.querySelector('.faq-question').textContent = question;
      item.querySelector('.faq-answer p').textContent = answer;
    }
  });
};

const debouncedSearch = debounce(performSearch, 300);
if (searchInput) searchInput.addEventListener('input', debouncedSearch);
if (searchButton) searchButton.addEventListener('click', performSearch);

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 300));
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
