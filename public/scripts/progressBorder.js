document.addEventListener('DOMContentLoaded', () => {
  const impactItems = document.querySelectorAll('.impact-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          // Trigger border animation
          item.classList.add('border-animated');

          // Trigger number animation
          const countTo = parseInt(item.getAttribute('data-count-to'), 10);
          const suffix = item.getAttribute('data-suffix') || '';
          const prefix = item.getAttribute('data-prefix') || '';
          const denominator = item.getAttribute('data-denominator') || '';
          const valueElement = item.querySelector('.impact-value');
          let current = 0;
          const increment = countTo / 60; // Smooth animation over ~1 second
          const animateNumber = () => {
            current += increment;
            if (current >= countTo) {
              current = countTo;
              clearInterval(animation);
            }
            valueElement.textContent = `${prefix}${Math.round(current)}${suffix}${
              denominator ? `/${denominator}` : ''
            }`;
          };
          const animation = setInterval(animateNumber, 16); // ~60fps
          observer.unobserve(item); // Animate only once
        }
      });
    },
    { threshold: 0.5 }
  );

  impactItems.forEach((item) => observer.observe(item));
});
