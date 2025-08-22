document.addEventListener('DOMContentLoaded', () => {
  const tracks = document.querySelectorAll('.moving-cards-track');

  tracks.forEach(track => {
    // Clone all cards for infinite effect
    const cards = Array.from(track.children);
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });
});
