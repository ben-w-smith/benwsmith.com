function initPageTransitionBar() {
  document.addEventListener("astro:before-preparation", () => {
    document.querySelector(".page-transition-bar")?.classList.add("is-loading");
  });

  document.addEventListener("astro:after-swap", () => {
    document.querySelector(".page-transition-bar")?.classList.add("is-loading");
  });

  document.addEventListener("astro:page-load", () => {
    document.querySelector(".page-transition-bar")?.classList.remove("is-loading");
  });
}

initPageTransitionBar();
