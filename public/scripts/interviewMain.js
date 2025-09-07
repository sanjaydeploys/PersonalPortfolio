// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
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

// FAQ Accordion (Call reinitialize if needed, but faqToggle.js handles)
window.reinitializeFAQ = window.reinitializeFAQ || (() => {});

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
    if (matches && query !== '') {
      const questionEl = item.querySelector('.faq-question');
      const answerEl = item.querySelector('.faq-answer p');
      questionEl.innerHTML = highlightText(questionEl.textContent, query);
      answerEl.innerHTML = highlightText(answerEl.textContent, query);
      // Trigger toggle if needed
      questionEl.classList.add('active');
      questionEl.nextElementSibling.classList.add('active');
    } else {
      const originalQuestion = item.querySelector('.faq-question').dataset.original || item.querySelector('.faq-question').textContent;
      const originalAnswer = item.querySelector('.faq-answer p').dataset.original || item.querySelector('.faq-answer p').textContent;
      item.querySelector('.faq-question').innerHTML = originalQuestion;
      item.querySelector('.faq-answer p').innerHTML = originalAnswer;
      item.querySelector('.faq-question').dataset.original = originalQuestion;
      item.querySelector('.faq-answer p').dataset.original = originalAnswer;
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

// Initialize FAQ on load
if (typeof window !== 'undefined' && window.reinitializeFAQ) {
  window.reinitializeFAQ();
}

// Error Handling
window.addEventListener('error', (e) => {
  console.error('Client-side error:', e.message, e.filename, e.lineno);
});
