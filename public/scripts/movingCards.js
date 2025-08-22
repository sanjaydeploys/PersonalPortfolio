document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".moving-cards-track");

  tracks.forEach((track) => {
    const cards = Array.from(track.children);
    let scrollX = 0;
    let speed = window.innerWidth < 768 ? 0.8 : 1.5; // mobile slower
    let isPaused = false;

    // Duplicate cards for seamless loop
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    // Store freeze state per card
    const frozenCards = new WeakSet();

    const animate = () => {
      if (!isPaused) {
        scrollX -= speed;
        const totalWidth = cards.reduce((acc, c) => acc + c.offsetWidth + 32, 0);
        if (Math.abs(scrollX) >= totalWidth) {
          scrollX = 0;
        }

        // Apply transform individually → hovered (frozen) card stays
        Array.from(track.children).forEach((card, idx) => {
          if (!frozenCards.has(card)) {
            card.style.transform = `translateX(${scrollX}px)`;
          }
        });
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Hover logic → freeze only hovered card
    track.querySelectorAll(".moving-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        frozenCards.add(card);
        card.style.transform = "translateX(0)"; // lock in place
      });
      card.addEventListener("mouseleave", () => {
        frozenCards.delete(card);
      });
    });
  });
});
