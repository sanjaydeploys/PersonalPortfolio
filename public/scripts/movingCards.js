document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".moving-cards-container");

  containers.forEach(container => {
    const track = container.querySelector(".moving-cards-track");
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 32; // card width + gap
    let scrollX = 0;
    let speed = 1.5;
    let lockedCard = null;
    let originalIndex = null;

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

    // Hover lock logic
    track.querySelectorAll(".moving-card").forEach((card, index) => {
      card.addEventListener("mouseenter", () => {
        if (lockedCard) return;

        const rect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Store reference to reattach later
        lockedCard = card;
        originalIndex = index;

        // Detach card and place it fixed in container
        const placeholder = document.createElement("div");
        placeholder.className = "card-placeholder";
        placeholder.style.width = `${card.offsetWidth}px`;
        placeholder.style.height = `${card.offsetHeight}px`;
        card.parentNode.insertBefore(placeholder, card);

        container.appendChild(card);
        card.classList.add("hover-active");
        card.style.position = "absolute";
        card.style.left = `${rect.left - containerRect.left}px`;
        card.style.top = `${rect.top - containerRect.top}px`;

        // Scale down other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        if (!lockedCard) return;

        // Remove absolute positioning
        lockedCard.style.position = "";
        lockedCard.style.left = "";
        lockedCard.style.top = "";

        // Reattach card back to track
        const placeholder = track.querySelector(".card-placeholder");
        track.insertBefore(lockedCard, placeholder);
        placeholder.remove();

        // Reset states
        lockedCard.classList.remove("hover-active");
        track.querySelectorAll(".moving-card").forEach(c => {
          c.classList.remove("scale-down");
        });

        lockedCard = null;
        originalIndex = null;
      });
    });
  });
});
