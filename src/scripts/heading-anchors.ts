function initHeadingAnchors() {
  const headings = document.querySelectorAll<HTMLElement>(".prose h2, .prose h3");

  headings.forEach((heading) => {
    if (!heading.id) {
      const slug = heading.textContent
        ?.toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (slug) heading.id = slug;
    }

    if (!heading.id) return;

    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.className = "heading-anchor";
    link.setAttribute("aria-label", `Link to ${heading.textContent}`);
    link.textContent = "#";

    heading.style.position = "relative";

    heading.insertBefore(link, heading.firstChild);
  });
}

document.addEventListener("astro:page-load", initHeadingAnchors);
