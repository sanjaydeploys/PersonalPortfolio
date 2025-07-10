document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'scale(1.05)';
      card.style.boxShadow = '0 0 12px var(--primary)';
      const bg = card.style.backgroundImage;
      if (bg) {
        card.style.backgroundSize = '120%';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      card.style.boxShadow = 'none';
      const bg = card.style.backgroundImage';
      if (bg) {
        card.style.backgroundSize = 'cover';
      }
    });
  });
});
