document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".moving-cards-track");

  tracks.forEach(track => {
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 32; // card + gap
    let scrollX = 0;
    let speed = 1.5;
    let pausedCard = null;

    // Clone cards for infinite loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    const animate = () => {
      if (!pausedCard) {
        scrollX -= speed;
        if (Math.abs(scrollX) >= cardWidth * cards.length) {
          scrollX = 0;
        }
        track.style.transform = `translateX(${scrollX}px)`;
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Hover: only lock hovered card, others continue
    track.querySelectorAll(".moving-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
        pausedCard = card;
        card.classList.add("hover-active");
      });
      card.addEventListener("mouseleave", () => {
        pausedCard = null;
        card.classList.remove("hover-active");
      });
    });
  });
});
