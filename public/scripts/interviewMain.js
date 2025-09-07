// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text, query) => {
  if (!query || !text) return text;
  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp('(' + escapedQuery + ')', 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });
}

// Sidebar Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarNav = document.querySelector('.sidebar-nav');
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebarNav.classList.toggle('active');
  });
}

// Sidebar Navigation
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sections = document.querySelectorAll('.faq-section');
const observerOptions = {
  root: null,
  threshold: 0.3,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      sidebarLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
      });
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

sidebarLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Search Functionality
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
    const questionEl = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer p');
    if (matches && query !== '') {
      questionEl.innerHTML = highlightText(questionEl.textContent, query);
      answerEl.innerHTML = highlightText(answerEl.textContent, query);
      // Preserve toggle state
      const isExpanded = questionEl.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        const answer = item.querySelector('.faq-answer');
        answer.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    } else {
      questionEl.innerHTML = questionEl.dataset.original || questionEl.textContent;
      answerEl.innerHTML = answerEl.dataset.original || answerEl.textContent;
      questionEl.dataset.original = questionEl.dataset.original || questionEl.textContent;
      answerEl.dataset.original = answerEl.dataset.original || answerEl.textContent;
    }
  });
};

const debouncedSearch = debounce(performSearch, 300);
if (searchInput) searchInput.addEventListener('input', debouncedSearch);
if (searchButton) searchButton.addEventListener('click', performSearch);

// Back to Top Button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 300);
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Initialize FAQ on load only if not already handled
if (typeof window !== 'undefined' && window.reinitializeFAQ && !window.faqInitialized) {
  window.reinitializeFAQ();
  window.faqInitialized = true;
}

// Error Handling
window.addEventListener('error', (e) => {
  console.error('Client-side error:', e.message, e.filename, e.lineno);
});
