(function () {
  function updateGroupSolutions(groupEl, lang, variant) {
    if (!groupEl) return;
    const solutions = groupEl.querySelectorAll('.solution');
    solutions.forEach(sol => {
      const l = sol.dataset.language;
      const v = sol.dataset.variant;
      sol.style.display = (l === lang && v === variant) ? 'block' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('language-select');
    const varSelect = document.getElementById('variant-select');

    const applyAll = () => {
      const lang = langSelect.value;
      const variant = varSelect.value;
      document.querySelectorAll('.solutions-group').forEach(group => {
        updateGroupSolutions(group, lang, variant);
      });
      // Toggle language notes
      document.querySelectorAll('.language-notes').forEach(note => {
        note.style.display = (note.dataset.language === lang) ? 'block' : 'none';
      });
    };

    if (langSelect && varSelect) {
      langSelect.addEventListener('change', applyAll);
      varSelect.addEventListener('change', applyAll);
      applyAll(); // Initial call
    } else {
      // fallback - show first available solution and note
      document.querySelectorAll('.solutions-group').forEach(group => {
        const first = group.querySelector('.solution');
        if (first) first.style.display = 'block';
      });
      const firstNote = document.querySelector('.language-notes');
      if (firstNote) firstNote.style.display = 'block';
    }
  });
})();
