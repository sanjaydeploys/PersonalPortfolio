document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.software-blogs-section .software-cards-track');
  if (!track) return;

  const cards = Array.from(track.children);

  // Clone cards for infinite effect
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Independent hover lock
  track.addEventListener('mouseover', e => {
    const card = e.target.closest('.software-card');
    if (card) {
      card.classList.add('active');
    }
  });

  track.addEventListener('mouseout', e => {
    const card = e.target.closest('.software-card');
    if (card) {
      card.classList.remove('active');
    }
  });
});
