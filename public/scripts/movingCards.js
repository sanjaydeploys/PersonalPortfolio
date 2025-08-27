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

        lockedCard = card;
        originalIndex = index;

        // Create placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "card-placeholder";
        placeholder.style.width = `${card.offsetWidth}px`;
        placeholder.style.height = `${card.offsetHeight}px`;
        card.parentNode.insertBefore(placeholder, card);

        // Pull card above track
        container.appendChild(card);
        card.classList.add("hover-active");
        card.style.position = "absolute";
        card.style.left = `${rect.left - containerRect.left}px`;
        card.style.top = `${rect.top - containerRect.top}px`;

        // Scale down others
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        if (!lockedCard) return;

        // Reset positioning
        lockedCard.style.position = "";
        lockedCard.style.left = "";
        lockedCard.style.top = "";

        // Reattach back into track
        const placeholder = track.querySelector(".card-placeholder");
        track.insertBefore(lockedCard, placeholder);
        placeholder.remove();

        lockedCard.classList.remove("hover-active");
        track.querySelectorAll(".moving-card").forEach(c => {
          c.classList.remove("scale-down");
        });

        lockedCard = null;
        originalIndex = null;
      });
    });
  });

  // 🔥 Tech stack reel infinite scroll (kept separate, won’t affect moving-cards)
  document.querySelectorAll(".tech-reel").forEach(reel => {
    // Clone nodes to create infinite scroll
    const clone = reel.cloneNode(true);
    reel.parentElement.appendChild(clone);
  });
});
