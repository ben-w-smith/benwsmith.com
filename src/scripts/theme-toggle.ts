function initThemeToggle() {
  const toggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
  if (!toggle) return;

  const html = document.documentElement;

  function getCurrentTheme(): "light" | "dark" {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme: "light" | "dark") {
    html.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    toggle.querySelector(".icon-sun")?.classList.toggle("hidden", theme === "light");
    toggle.querySelector(".icon-moon")?.classList.toggle("hidden", theme === "dark");
  }

  applyTheme(getCurrentTheme());

  toggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      !prefersReducedMotion &&
      typeof document.startViewTransition === "function"
    ) {
      const { top, left, width, height } = toggle.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      html.dataset.themeVt = "active";
      // Force style recalculation so view-transition-name: none is applied before snapshot
      html.offsetHeight;

      const transition = document.startViewTransition(() => {
        applyTheme(next);
      });

      transition.ready.then(() => {
        html.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });

      transition.finished.finally(() => {
        delete html.dataset.themeVt;
      });
    } else {
      applyTheme(next);
    }
  });
}

document.addEventListener("astro:page-load", initThemeToggle);
