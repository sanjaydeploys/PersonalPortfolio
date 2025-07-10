document.addEventListener('DOMContentLoaded', () => {
  const animateNumbers = (element, target, duration, suffix = '', prefix = '', denominator = null) => {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    const animate = () => {
      start += increment;
      if (start >= target) {
        start = target;
      } else {
        requestAnimationFrame(animate);
      }

      let displayValue = Math.round(start);
      if (suffix === '%') {
        displayValue = Math.min(displayValue, target) + suffix;
      } else if (denominator) {
        displayValue = `${Math.min(Math.round(start), target)}/${denominator}`;
      } else if (prefix) {
        displayValue = `${prefix}${Math.min(Math.round(start), target)}`;
      } else if (suffix) {
        displayValue = displayValue.toLocaleString() + suffix;
      }

      element.textContent = displayValue;
    };
    animate();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.dataset.countTo);
          const suffix = element.dataset.suffix || '';
          const prefix = element.dataset.prefix || '';
          const denominator = element.dataset.denominator || null;

          // Trigger number animation
          animateNumbers(element.querySelector('.impact-value'), target, 2000, suffix, prefix, denominator);

          // Trigger border animation
          element.classList.add('border-animated');

          // Unobserve after animation starts to prevent re-triggering
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.impact-item').forEach((item) => {
    observer.observe(item);
  });
});
