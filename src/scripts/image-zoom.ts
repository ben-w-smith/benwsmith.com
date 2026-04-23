function initImageZoom() {
  const images = document.querySelectorAll<HTMLImageElement>(".prose img");

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "image-zoom-overlay";

      const zoomed = document.createElement("img");
      zoomed.src = img.src;
      zoomed.alt = img.alt || "";
      zoomed.className = "image-zoom-expanded";

      overlay.appendChild(zoomed);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => overlay.classList.add("is-active"));

      overlay.addEventListener("click", () => {
        overlay.classList.remove("is-active");
        overlay.addEventListener("transitionend", () => overlay.remove());
      });
    });
  });
}

document.addEventListener("astro:page-load", initImageZoom);
