document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.testimonial-card');
  let currentIndex = 0;

  const showCard = (index) => {
    cards.forEach((card, i) => {
      card.style.display = i === index ? 'block' : 'none';
    });
  };

  const nextCard = () => {
    currentIndex = (currentIndex + 1) % cards.length;
    showCard(currentIndex);
  };

  setInterval(nextCard, 5000); // Auto-advance every 5 seconds
  showCard(currentIndex);
});
