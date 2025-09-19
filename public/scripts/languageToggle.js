(function () {
  function updateGroupSolutions(groupEl, lang, variant) {
    if (!groupEl) return;
    const solutions = groupEl.querySelectorAll('.solution');
    solutions.forEach(sol => {
      const l = sol.dataset.language;
      const v = sol.dataset.variant;
      sol.style.display = (l === lang && v === variant) ? '' : 'none';
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
    };

    if (langSelect && varSelect) {
      langSelect.addEventListener('change', applyAll);
      varSelect.addEventListener('change', applyAll);
      applyAll();
    } else {
      // fallback - show first available solution
      document.querySelectorAll('.solutions-group').forEach(group => {
        const first = group.querySelector('.solution');
        if (first) first.style.display = '';
      });
    }
  });
})();
