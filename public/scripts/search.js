document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.querySelector('.search-btn');
  const searchResults = document.getElementById('search-results');

  const searchableContent = [
    ...document.querySelectorAll('.section h2, .section p, .faq-question, .faq-answer, .card h3, .card p, .gallery-caption')
  ].map(el => ({
    text: el.textContent.trim(),
    element: el,
    section: el.closest('.section')?.querySelector('h2')?.textContent || el.closest('.faq-item')?.querySelector('.faq-question')?.textContent || '',
    id: el.closest('.section')?.id || el.closest('.faq-item')?.querySelector('.faq-question')?.id || ''
  }));

  function escapeHTML(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function performSearch(query) {
    query = query.toLowerCase().trim();
    searchResults.innerHTML = '';
    searchResults.classList.remove('active');

    if (!query) return;

    const escapedQuery = query.replace(/[.*+?^{}()|[\]\\]/g, '\\$&');
    const results = searchableContent
      .filter(item => item.text.toLowerCase().includes(query))
      .slice(0, 8);

    if (results.length === 0) {
      const safeQuery = escapeHTML(query);
      searchResults.innerHTML = `
        <div class="no-results">
          <span lang="en" class="lang-hidden">No results found for "${safeQuery}". Try different keywords.</span>
          <span lang="hi" class="lang-visible">"${safeQuery}" के लिए कोई परिणाम नहीं मिला। अलग कीवर्ड आजमाएँ।</span>
        </div>`;
      searchResults.classList.add('active');
      return;
    }

    results.forEach(result => {
      const highlightedText = result.text.replace(
        new RegExp(escapedQuery, 'gi'),
        '<span class="search-highlight">$&</span>'
      );
      const resultItem = document.createElement('div');
      resultItem.classList.add('search-result-item');
      resultItem.innerHTML = `
        <strong>
          <span lang="en" class="lang-hidden">${escapeHTML(result.section)}</span>
          <span lang="hi" class="lang-visible">${escapeHTML(result.section)}</span>
        </strong>
        <p>${highlightedText.slice(0, 120)}${result.text.length > 120 ? '...' : ''}</p>`;
      resultItem.addEventListener('click', () => {
        if (result.id) {
          window.location.hash = result.id;
          const target = document.getElementById(result.id);
          if (target && target.classList.contains('faq-question')) {
            target.click();
          }
          target?.scrollIntoView({ behavior: 'smooth' });
          searchResults.classList.remove('active');
          searchInput.value = '';
        }
      });
      searchResults.appendChild(resultItem);
    });

    searchResults.classList.add('active');
  }

  if (searchInput && searchBtn && searchResults) {
    searchInput.addEventListener('input', e => performSearch(e.target.value));
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') performSearch(searchInput.value);
    });
  }
});
