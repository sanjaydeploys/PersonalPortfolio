(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const splitter = document.getElementById('splitter');
    if (!splitter) return;

    const leftPane = splitter.previousElementSibling;
    const rightPane = splitter.nextElementSibling;
    const container = splitter.parentNode;

    const minWidthPx = 200; // Minimum width for each pane in pixels
    let isDragging = false;
    let startX, startLeftWidthPercent;

    // Initialize widths to 50% each
    leftPane.style.width = '50%';
    rightPane.style.width = '50%';

    // Add active class on drag for visual feedback
    splitter.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 768) return; // Disable dragging on mobile
      isDragging = true;
      startX = e.clientX;
      startLeftWidthPercent = parseFloat(leftPane.style.width) || 50;
      splitter.classList.add('active');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    });

    // Handle drag movement
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const containerWidth = container.getBoundingClientRect().width;
      const minWidthPercent = (minWidthPx / containerWidth) * 100; // Convert minWidth to percentage
      const deltaX = e.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100; // Convert pixel movement to percentage
      let newLeftWidthPercent = startLeftWidthPercent + deltaPercent;

      // Enforce minimum width constraints
      if (newLeftWidthPercent < minWidthPercent) {
        newLeftWidthPercent = minWidthPercent;
      } else if (newLeftWidthPercent > 100 - minWidthPercent) {
        newLeftWidthPercent = 100 - minWidthPercent;
      }

      // Update widths
      leftPane.style.width = `${newLeftWidthPercent}%`;
      rightPane.style.width = `${100 - newLeftWidthPercent}%`;
    });

    // Stop dragging
    const stopDragging = () => {
      if (isDragging) {
        isDragging = false;
        splitter.classList.remove('active');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('mouseleave', stopDragging);

    // Handle window resize for responsiveness
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // On mobile, rely on CSS to stack panes (flex-direction: column, width: 100%)
        leftPane.style.width = '100%';
        rightPane.style.width = '100%';
        splitter.style.display = 'none';
      } else {
        // On desktop, restore proportional widths if they were altered
        if (!isDragging) {
          const currentLeftWidth = parseFloat(leftPane.style.width) || 50;
          const containerWidth = container.getBoundingClientRect().width;
          const minWidthPercent = (minWidthPx / containerWidth) * 100;
          let adjustedLeftWidth = currentLeftWidth;
          if (currentLeftWidth < minWidthPercent) {
            adjustedLeftWidth = minWidthPercent;
          } else if (currentLeftWidth > 100 - minWidthPercent) {
            adjustedLeftWidth = 100 - minWidthPercent;
          }
          leftPane.style.width = `${adjustedLeftWidth}%`;
          rightPane.style.width = `${100 - adjustedLeftWidth}%`;
          splitter.style.display = 'block';
        }
      }
    };

    // Initial resize handling
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners on page unload
    window.addEventListener('unload', () => {
      document.removeEventListener('mousemove', stopDragging);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('mouseleave', stopDragging);
      window.removeEventListener('resize', handleResize);
    });
  });
})();
