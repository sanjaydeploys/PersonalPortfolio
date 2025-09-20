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
    leftPane.style.flexBasis = '50%';
    rightPane.style.flexBasis = '50%';
    leftPane.style.width = '50%'; // Fallback for consistency
    rightPane.style.width = '50%';

    // Prevent interference from other elements
    const disablePointerEvents = () => {
      document.querySelectorAll('.navbar, .social-sticky-container, .sidebar-toggle-btn, .section')
        .forEach(el => el.style.pointerEvents = 'none');
    };

    const restorePointerEvents = () => {
      document.querySelectorAll('.navbar, .social-sticky-container, .sidebar-toggle-btn, .section')
        .forEach(el => el.style.pointerEvents = '');
    };

    // Start dragging
    const startDragging = (e) => {
      if (window.innerWidth <= 768) return; // Disable dragging on mobile
      e.stopPropagation(); // Prevent bubbling to other elements
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startLeftWidthPercent = parseFloat(leftPane.style.flexBasis) || 50;
      splitter.classList.add('active');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      disablePointerEvents();
    };

    splitter.addEventListener('mousedown', startDragging);
    splitter.addEventListener('touchstart', startDragging, { passive: false });

    // Handle drag movement
    const handleMove = (e) => {
      if (!isDragging) return;
      e.stopPropagation();

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const containerWidth = container.getBoundingClientRect().width;
      const minWidthPercent = (minWidthPx / containerWidth) * 100;
      const deltaX = clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      let newLeftWidthPercent = startLeftWidthPercent + deltaPercent;

      // Enforce minimum width constraints
      newLeftWidthPercent = Math.max(minWidthPercent, Math.min(100 - minWidthPercent, newLeftWidthPercent));

      // Update widths
      leftPane.style.flexBasis = `${newLeftWidthPercent}%`;
      rightPane.style.flexBasis = `${100 - newLeftWidthPercent}%`;
      leftPane.style.width = `${newLeftWidthPercent}%`; // Fallback
      rightPane.style.width = `${100 - newLeftWidthPercent}%`;
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });

    // Stop dragging
    const stopDragging = (e) => {
      if (isDragging) {
        e.stopPropagation();
        isDragging = false;
        splitter.classList.remove('active');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        restorePointerEvents();
      }
    };

    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
    document.addEventListener('mouseleave', stopDragging);
    document.addEventListener('touchcancel', stopDragging);

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Mobile: Rely on CSS for stacking, ensure visibility
        leftPane.style.flexBasis = '100%';
        rightPane.style.flexBasis = '100%';
        leftPane.style.width = '100%';
        rightPane.style.width = '100%';
        leftPane.style.height = 'auto'; // Ensure natural height
        rightPane.style.height = 'auto';
        container.style.height = 'auto'; // Allow container to expand
        splitter.style.display = 'none';
      } else {
        // Desktop: Fixed height and proportional widths
        container.style.height = '600px'; // Fixed height like LeetCode editor
        if (!isDragging) {
          const currentLeftWidth = parseFloat(leftPane.style.flexBasis) || 50;
          const containerWidth = container.getBoundingClientRect().width;
          const minWidthPercent = (minWidthPx / containerWidth) * 100;
          let adjustedLeftWidth = Math.max(minWidthPercent, Math.min(100 - minWidthPercent, currentLeftWidth));
          leftPane.style.flexBasis = `${adjustedLeftWidth}%`;
          rightPane.style.flexBasis = `${100 - adjustedLeftWidth}%`;
          leftPane.style.width = `${adjustedLeftWidth}%`;
          rightPane.style.width = `${100 - adjustedLeftWidth}%`;
          leftPane.style.height = ''; // Clear height for desktop
          rightPane.style.height = '';
          splitter.style.display = 'block';
        }
      }
    };

    // Initial resize handling
    handleResize();
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners
    window.addEventListener('unload', () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
      document.removeEventListener('mouseleave', stopDragging);
      document.removeEventListener('touchcancel', stopDragging);
      window.removeEventListener('resize', handleResize);
    });
  });
})();
