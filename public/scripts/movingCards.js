document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.moving-cards-track');
  const cards = Array.from(track.children);

  // Duplicate cards for smooth infinite loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  // Independent hover lock
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('locked'); // flip stops reel only for this card
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('locked');
    });
  });

  // Optional: make reel speed adjustable
  let speed = 0.5; // pixels per frame
  let position = 0;

  function animate() {
    position -= speed;
    if (Math.abs(position) >= track.scrollWidth / 2) {
      position = 0; // reset smoothly
    }
    track.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }
  animate();
});
