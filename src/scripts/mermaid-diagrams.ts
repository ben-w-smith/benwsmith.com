// Renders ```mermaid fenced blocks on the dbt-spec pages.
// Lifecycle per CLAUDE.md: astro:page-load init / astro:before-swap cleanup.
// Mermaid loads from CDN on first diagram; if loading fails the fenced source
// stays visible as a code block (readable, just not pretty).

let themeObserver: MutationObserver | null = null;
let renderToken = 0;

const sources = new WeakMap<HTMLElement, string>();

function currentTheme(): "dark" | "default" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default";
}

async function loadMermaid(): Promise<any> {
  const url = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
  const mod: any = await import(/* @vite-ignore */ url);
  return mod.default;
}

function stageDiagrams(): HTMLElement[] {
  const staged: HTMLElement[] = [];
  // Astro's shiki pipeline marks the block as <pre data-language="mermaid">
  const blocks = Array.from(
    document.querySelectorAll<HTMLElement>('.prose pre[data-language="mermaid"]')
  );
  for (const pre of blocks) {
    const div = document.createElement("div");
    div.className = "mermaid";
    const src = pre.textContent ?? "";
    div.textContent = src;
    sources.set(div, src);
    pre.replaceWith(div);
    staged.push(div);
  }
  return staged;
}

function restoreStaged(): void {
  for (const div of Array.from(document.querySelectorAll<HTMLElement>(".mermaid"))) {
    const src = sources.get(div);
    if (src === undefined) continue;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = src;
    pre.appendChild(code);
    div.replaceWith(pre);
  }
}

async function draw(): Promise<void> {
  const token = ++renderToken;
  let mermaid: any;
  try {
    mermaid = await loadMermaid();
  } catch (err) {
    console.warn("[mermaid] CDN load failed — diagram sources left as code", err);
    restoreStaged();
    return;
  }
  if (token !== renderToken) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: currentTheme(),
    securityLevel: "loose",
    fontFamily: "Inter, system-ui, sans-serif",
  });
  try {
    await mermaid.run({ querySelector: ".mermaid" });
  } catch (err) {
    console.warn("[mermaid] render failed", err);
  }
}

async function renderAll(): Promise<void> {
  const existing = document.querySelector(".prose .mermaid");
  const staged = existing ? [] : stageDiagrams();
  if (!existing && staged.length === 0) return;
  await draw();
}

function init(): void {
  void renderAll();
  // Mermaid bakes colors into the SVG at render time — redraw when the site theme flips.
  themeObserver = new MutationObserver(() => {
    for (const div of Array.from(document.querySelectorAll<HTMLElement>(".mermaid"))) {
      const src = sources.get(div);
      if (src !== undefined) div.textContent = src; // reset to source so mermaid.run redraws
    }
    void draw();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

function cleanup(): void {
  themeObserver?.disconnect();
  themeObserver = null;
  renderToken++;
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", cleanup);
