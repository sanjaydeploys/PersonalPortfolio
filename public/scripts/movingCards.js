document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".moving-cards-container");

  containers.forEach(container => {
    const track = container.querySelector(".moving-cards-track");
    const cards = Array.from(track.children);
    const cardWidth = cards[0].offsetWidth + 32; // card width + gap
    let scrollX = 0;
    let speed = 1.5;
    let lockedCard = null;
    let placeholder = null;

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
    track.querySelectorAll(".moving-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
        if (lockedCard) return;

        const rect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        lockedCard = card;

        // Create placeholder to maintain layout
        placeholder = document.createElement("div");
        placeholder.className = "card-placeholder";
        placeholder.style.width = `${card.offsetWidth}px`;
        placeholder.style.height = `${card.offsetHeight}px`;
        card.parentNode.insertBefore(placeholder, card);

        // Move card into container for independent positioning
        container.appendChild(card);
        card.classList.add("hover-active");

        // Set initial position via transform for smoothness
        const startX = rect.left - containerRect.left;
        const startY = rect.top - containerRect.top;
        card.style.transform = `translate(${startX}px, ${startY}px) scale(1)`;

        // Force browser reflow so transition triggers
        card.offsetHeight;

        // Animate smoothly into locked position
        card.style.transition = "transform 0.3s ease";
        card.style.transform = `translate(${startX}px, ${startY - 10}px) scale(1.05)`;

        // Dim other cards
        track.querySelectorAll(".moving-card").forEach(c => {
          if (c !== card) c.classList.add("scale-down");
        });
      });

      card.addEventListener("mouseleave", () => {
        if (!lockedCard) return;

        // Remove transition to avoid flicker when reattaching
        lockedCard.style.transition = "transform 0.2s ease";
        lockedCard.style.transform = "scale(1)";

        setTimeout(() => {
          // Reattach to track
          const temp = lockedCard;
          track.insertBefore(temp, placeholder);
          placeholder.remove();
          placeholder = null;

          // Reset styles
          temp.classList.remove("hover-active");
          temp.style.transition = "";
          temp.style.transform = "";

          track.querySelectorAll(".moving-card").forEach(c => {
            c.classList.remove("scale-down");
          });

          lockedCard = null;
        }, 200);
      });
    });
  });
});
