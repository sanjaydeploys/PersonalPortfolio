(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const splitter = document.getElementById('splitter');
    if (!splitter) return;

    const leftPane = splitter.previousElementSibling;
    const rightPane = splitter.nextElementSibling;
    const container = splitter.parentNode;

    let isDragging = false;
    let startX, startWidthLeft, startWidthRight;

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startWidthLeft = leftPane.offsetWidth;
      startWidthRight = rightPane.offsetWidth;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      leftPane.style.width = `${startWidthLeft + delta}px`;
      rightPane.style.width = `${startWidthRight - delta}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    });

    // Responsive: Stack on mobile
    if (window.innerWidth < 768) {
      container.style.flexDirection = 'column';
      splitter.style.display = 'none';
      leftPane.style.width = '100%';
      rightPane.style.width = '100%';
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        container.style.flexDirection = 'column';
        splitter.style.display = 'none';
      } else {
        container.style.flexDirection = 'row';
        splitter.style.display = 'block';
      }
    });
  });
})();
