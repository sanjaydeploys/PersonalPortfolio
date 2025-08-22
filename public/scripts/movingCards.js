document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".moving-cards-track");

  tracks.forEach(track => {
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 32; // card + gap
    let scrollX = 0;
    let speed = 1.5;
    let lockedCard = null;

    // Clone cards for infinite loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    const animate = () => {
      scrollX -= speed;

      if (Math.abs(scrollX) >= cardWidth * cards.length) {
        scrollX = 0;
      }

      track.style.transform = `translateX(${scrollX}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    // Independent hover behavior
    track.querySelectorAll(".moving-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
        lockedCard = card;
        card.classList.add("hover-active");
        // Apply "scale-down" to other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        lockedCard = null;
        card.classList.remove("hover-active");
        // Reset scaling for other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          c.classList.remove("scale-down");
        });
      });
    });
  });
});
