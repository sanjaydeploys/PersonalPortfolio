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

        // Placeholder to keep layout stable
        const placeholder = document.createElement("div");
        placeholder.className = "card-placeholder";
        placeholder.style.width = `${card.offsetWidth}px`;
        placeholder.style.height = `${card.offsetHeight}px`;
        card.parentNode.insertBefore(placeholder, card);

        // Move card to container for locking
        container.appendChild(card);
        card.classList.add("hover-active");
        card.style.position = "absolute";

        // Use transform for smooth positioning
        const targetX = rect.left - containerRect.left;
        const targetY = rect.top - containerRect.top;
        card.style.transform = `translate(${targetX}px, ${targetY}px) scale(1)`;

        // Allow transition after setting initial position
        requestAnimationFrame(() => {
          card.style.transition = "transform 0.35s ease, filter 0.3s ease";
          card.style.transform = `translate(${targetX}px, ${targetY - 10}px) scale(1.05)`;
        });

        // Dim other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        if (!lockedCard) return;

        const placeholder = track.querySelector(".card-placeholder");
        const placeholderRect = placeholder.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Animate back to original slot
        const backX = placeholderRect.left - containerRect.left;
        const backY = placeholderRect.top - containerRect.top;
        lockedCard.style.transform = `translate(${backX}px, ${backY}px) scale(1)`;

        // After animation ends, put it back in the track
        lockedCard.addEventListener(
          "transitionend",
          () => {
            lockedCard.style.position = "";
            lockedCard.style.transform = "";
            lockedCard.style.transition = "";
            lockedCard.classList.remove("hover-active");
            track.insertBefore(lockedCard, placeholder);
            placeholder.remove();

            track.querySelectorAll(".moving-card").forEach(c => {
              c.classList.remove("scale-down");
            });

            lockedCard = null;
            originalIndex = null;
          },
          { once: true }
        );
      });
    });
  });
});
