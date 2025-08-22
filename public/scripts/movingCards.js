document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".moving-cards-track");

  tracks.forEach(track => {
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 32; // card + gap
    let scrollX = 0;
    let speed = 1.5;

    // Clone cards for infinite loop
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    // Animate track continuously
    const animate = () => {
      scrollX -= speed;
      if (Math.abs(scrollX) >= cardWidth * cards.length) {
        scrollX = 0;
      }
      track.style.transform = `translateX(${scrollX}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    // Hover behavior for independent lock
    track.querySelectorAll(".moving-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
        // Lock hovered card visually above the moving track
        card.classList.add("hover-active");
        card.style.position = "absolute";
        card.style.left = `${card.getBoundingClientRect().left - track.getBoundingClientRect().left}px`;

        // Scale down all other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        // Reset hovered card
        card.classList.remove("hover-active");
        card.style.position = "";
        card.style.left = "";

        // Reset all other cards
        track.querySelectorAll(".moving-card").forEach(c => c.classList.remove("scale-down"));
      });
    });
  });
});
