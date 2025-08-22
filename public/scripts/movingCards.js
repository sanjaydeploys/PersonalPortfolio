document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".moving-cards-track");

  tracks.forEach(track => {
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 32;
    let scrollX = 0;
    let speed = 1.5;
    let lockedCard = null;
    let lockedCardPos = 0;

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

      // Keep locked card visually fixed
      if (lockedCard) {
        lockedCard.style.transform = `translateX(${lockedCardPos}px) scale(1.05) translateY(-10px)`;
      }

      requestAnimationFrame(animate);
    };
    animate();

    // Independent hover behavior
    track.querySelectorAll(".moving-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
        const rect = card.getBoundingClientRect();
        lockedCard = card;
        lockedCardPos = rect.left - track.getBoundingClientRect().left + scrollX;

        card.classList.add("hover-active");
        card.style.position = "absolute";
        card.style.left = `${rect.left - track.getBoundingClientRect().left}px`;

        // Scale down other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        if (!lockedCard) return;
        lockedCard.style.position = "";
        lockedCard.style.left = "";
        lockedCard = null;

        card.classList.remove("hover-active");
        track.querySelectorAll(".moving-card").forEach(c => {
          c.classList.remove("scale-down");
        });
      });
    });
  });
});
