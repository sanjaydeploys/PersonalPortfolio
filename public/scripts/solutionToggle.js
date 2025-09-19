document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".solution-container");

  containers.forEach(container => {
    const buttons = container.querySelectorAll(".toggle-btn");
    const blocks = container.querySelectorAll(".solution-block");

    // default: show first language
    blocks.forEach((b, idx) => {
      b.style.display = idx === 0 ? "block" : "none";
    });

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.target;

        // hide all, show target
        blocks.forEach(b => {
          b.style.display =
            b.dataset.language === lang ? "block" : "none";
        });
      });
    });
  });
});
