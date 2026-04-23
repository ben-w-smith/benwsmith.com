function initImageLoading() {
  const images = document.querySelectorAll<HTMLImageElement>(".prose img");
  images.forEach((img) => {
    if (img.complete) return;
    img.style.opacity = "0";
    img.style.transition = "opacity var(--duration-normal) var(--ease-out)";
    const show = () => {
      img.style.opacity = "1";
    };
    img.addEventListener("load", show, { once: true });
    img.addEventListener("error", show, { once: true });
  });
}

document.addEventListener("astro:page-load", initImageLoading);
