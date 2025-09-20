(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const splitter = document.getElementById('splitter');
    if (!splitter) return;

    const leftPane = splitter.previousElementSibling;
    const rightPane = splitter.nextElementSibling;
    const container = splitter.parentNode;

    const minWidth = 200; // Minimum width for each pane (pixels)
    let isDragging = false;
    let startX, startLeftWidth;

    // Initialize widths (50% each by default)
    leftPane.style.width = '50%';
    rightPane.style.width = '50%';

    splitter.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startLeftWidth = leftPane.getBoundingClientRect().width;
      splitter.classList.add('active');
