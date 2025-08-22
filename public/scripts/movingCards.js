document.addEventListener("DOMContentLoaded", () => {
  const tracks = document.querySelectorAll(".moving-cards-track");

  tracks.forEach((track) => {
    const cards = Array.from(track.children);
    const totalWidth = cards.reduce((acc, card) => acc + card.offsetWidth + 32, 0); // 32px gap approx
    let scrollX = 0;
    let speed = 1.2; // 🔥 faster than before
    let isPaused = false;

    // Duplicate cards for seamless loop
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    const animate = () => {
      if (!isPaused) {
        scrollX -= speed;
        if (Math.abs(scrollX) >= totalWidth) {
          scrollX = 0; // reset like circular linked list
        }
        track.style.transform = `translateX(${scrollX}px)`;
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Pause on hover (either on track or a card)
    track.addEventListener("mouseenter", () => { isPaused = true; });
    track.addEventListener("mouseleave", () => { isPaused = false; });
    track.querySelectorAll(".moving-card").forEach(card => {
      card.addEventListener("mouseenter", () => { isPaused = true; });
      card.addEventListener("mouseleave", () => { isPaused = false; });
    });
  });
});
