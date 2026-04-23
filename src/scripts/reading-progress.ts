function initReadingProgress() {
  const bar = document.querySelector<HTMLElement>(".reading-progress");
  if (!bar) return;

  function updateProgress() {
    const article = document.querySelector("article");
    if (!article) return;

    const rect = article.getBoundingClientRect();
    const articleHeight = rect.height;
    const scrolled = -rect.top;
    const viewportHeight = window.innerHeight;
    const total = articleHeight - viewportHeight;

    if (total <= 0) {
      bar.style.width = "0%";
      return;
    }

    const progress = Math.min(Math.max(scrolled / total, 0), 1);
    bar.style.width = `${progress * 100}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

document.addEventListener("astro:page-load", initReadingProgress);
