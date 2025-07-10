document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.impact-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target;
          item.classList.add('border-animated');
          observer.unobserve(item);
        }
      });
    },
    { threshold: 0.5 }
  );

  items.forEach((item) => observer.observe(item));
});
