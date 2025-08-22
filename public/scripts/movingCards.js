document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.moving-cards-track');
  const cards = Array.from(track.children);
  const cardWidth = cards[0].offsetWidth + 32; // include gap
  let scrollX = 0;

  // Duplicate cards for seamless loop
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  function animate() {
    scrollX -= 1.2; // speed
    if (Math.abs(scrollX) >= cardWidth * cards.length) {
      scrollX = 0;
    }
    track.style.transform = `translateX(${scrollX}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Independent hover lock
  track.addEventListener('mouseover', e => {
    if (e.target.closest('.moving-card')) {
      // hovered card flips, others keep scrolling
      e.target.closest('.moving-card').style.transform = 'scale(1.1) translateY(-20px)';
    }
  });
});
