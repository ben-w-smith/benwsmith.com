# Animation 06: Dark Mode Transition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark mode theme that transitions smoothly, toggled by a button in the header with a sun/moon icon morph. Respects system preference on first visit, persists user choice in localStorage.

**Architecture:** A `[data-theme="dark"]` selector on `<html>` overrides the light-mode CSS custom properties. A theme toggle script detects system preference via `prefers-color-scheme`, reads/writes `localStorage`, and sets the attribute. The toggle button lives in the Header component with an inline SVG that morphs between sun and moon. All color transitions use `transition: color, background-color, border-color` on `body` and key elements for a smooth cross-fade.

**Tech Stack:** CSS custom properties, `[data-theme]` attribute selector, localStorage, `prefers-color-scheme` media query, inline SVG

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md` — Animation Layer 1, Category 06

---

## File Structure

```
src/
├── scripts/
│   └── theme-toggle.ts          # CREATE — detect preference, toggle, persist
├── styles/
│   └── global.css               # MODIFY — add [data-theme="dark"] overrides + transition rules
├── components/
│   └── Header.astro             # MODIFY — add theme toggle button with sun/moon SVG
└── layouts/
    └── BaseLayout.astro         # MODIFY — add inline script to prevent flash, import theme-toggle
```

---

### Task 1: Dark Mode Color Tokens and Transitions in CSS

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add dark mode color tokens**

In `src/styles/global.css`, add the following block immediately after the closing `}` of the `:root` block (after line 57) and before the `/* Reset */` comment:

```css
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-bg-off: #242424;
  --color-text-primary: #E8E8E8;
  --color-text-secondary: #999;
  --color-border: #333;
  --color-accent: #4DA3FF;

  --color-technical: #4DA3FF;
  --color-technical-bg: #4DA3FF1A;
  --color-essay: #FF8A8A;
  --color-essay-bg: #FF8A8A1A;
  --color-project: #6EDDD4;
  --color-project-bg: #6EDDD41A;

  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 2: Fix hardcoded white background on code blocks**

Find (line 183):
```css
  background: #FFFFFF;
```

Change to:
```css
  background: var(--color-bg-off);
```

This makes code blocks use the theme-aware token instead of hardcoded white.

- [ ] **Step 3: Add smooth transition rules**

Add the following after the dark mode tokens block and before `/* Reset */`:

```css
/* Theme transitions */
body,
.site-header,
.site-footer,
.post-card,
.category-pill,
.prose pre,
.prose code,
.back-link {
  transition: color var(--duration-normal) var(--ease-out),
              background-color var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add dark mode color tokens and theme transitions"
```

---

### Task 2: Theme Toggle Script and Flash Prevention

**Files:**
- Create: `src/scripts/theme-toggle.ts`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create the theme toggle script**

Create `src/scripts/theme-toggle.ts` with:

```typescript
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
    applyTheme(next);
  });
}

document.addEventListener("astro:page-load", initThemeToggle);
```

- [ ] **Step 2: Add flash prevention inline script in BaseLayout**

This small inline script runs before the page renders, preventing a flash of wrong-theme content.

In `src/layouts/BaseLayout.astro`, add a `<script is:inline>` block inside `<head>`, after the `<ClientRouter />` line.

Find:
```astro
    <ClientRouter />
  </head>
```

Change to:
```astro
    <ClientRouter />
    <script is:inline>
      (function(){var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.setAttribute("data-theme","dark")}})()
    </script>
  </head>
```

Note: This uses `is:inline` so Astro doesn't bundle it — it needs to run synchronously before paint.

- [ ] **Step 3: Import theme-toggle script in BaseLayout**

Find:
```astro
      <script src="../scripts/image-zoom.ts"></script>
```

Change to:
```astro
      <script src="../scripts/image-zoom.ts"></script>
      <script src="../scripts/theme-toggle.ts"></script>
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/theme-toggle.ts src/layouts/BaseLayout.astro
git commit -m "feat: add theme toggle script with flash prevention"
```

---

### Task 3: Theme Toggle Button in Header

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Add toggle button and icon styles**

Replace the entire content of `src/components/Header.astro` with:

```astro
---
const currentPath = Astro.url.pathname;
const navLinks = [
  { href: "/", label: "Blog" },
  { href: "/about", label: "About" },
];
---

<header class="site-header">
  <a href="/" class="site-name">Ben Smith</a>
  <nav class="site-nav">
    {navLinks.map((link) => (
      <a
        href={link.href}
        class:list={["nav-link", { active: currentPath === link.href }]}
      >
        {link.label}
      </a>
    ))}
    <button class="theme-toggle" aria-label="Toggle theme">
      <svg class="icon-sun hidden" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
      </svg>
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 1C4 3.5 3.5 6.5 6 10c2.5 3.5 6 4 9 3-1.5 2.5-4.5 4-7.5 3C4 15 1 11.5 1.5 7.5 2 5 3.5 2.5 6 1z" />
      </svg>
    </button>
  </nav>
</header>

<style>
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg) 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: var(--spacing-xl);
  }

  .site-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-primary);
    text-decoration: none;
  }

  .site-nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .nav-link {
    position: relative;
    font-size: 13px;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: 0;
    height: 1.5px;
    background: var(--color-accent);
    transition: width var(--duration-fast) var(--ease-out), left var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover {
    color: var(--color-text-primary);
  }

  .nav-link:hover::after {
    width: 100%;
    left: 0;
  }

  .nav-link.active {
    color: var(--color-text-primary);
  }

  .nav-link.active::after {
    width: 100%;
    left: 0;
    background: var(--color-text-primary);
  }

  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .theme-toggle:hover {
    color: var(--color-text-primary);
  }

  .hidden {
    display: none;
  }
</style>
```

Key changes:
- Added `<button class="theme-toggle">` inside `.site-nav` with sun and moon SVG icons
- Sun icon shows in dark mode (to switch to light), moon shows in light mode (to switch to dark)
- Both icons use `currentColor` so they follow theme colors
- `.hidden` class toggles visibility — the theme-toggle.ts script manages which icon is shown
- Toggle button has hover color shift matching other nav elements

- [ ] **Step 2: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add theme toggle button with sun/moon icons to header"
```

---

### Task 4: Visual Review and Timing Tuning

**Files:**
- Modify: `src/styles/global.css` (tune colors/timing if needed)

- [ ] **Step 1: Full interaction review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify:

- [ ] Click moon icon in header: entire page transitions smoothly to dark mode
- [ ] Dark mode colors: dark background, light text, adjusted borders and accents
- [ ] Click sun icon: transitions back to light mode smoothly
- [ ] Category pills: colors remain readable in both themes
- [ ] Code blocks: background adapts to theme (no white block in dark mode)
- [ ] Post card ping animation: accent color shifts appropriately in dark mode
- [ ] Progress bar: accent color adapts
- [ ] Image zoom overlay: still works in both themes
- [ ] Refresh page: theme persists (localStorage)
- [ ] Open in new tab: theme persists
- [ ] Set system to dark mode, clear localStorage, reload: auto-detects dark
- [ ] No flash of wrong theme on page load
- [ ] `prefers-reduced-motion`: toggle works but transitions are instant

If colors feel off, adjust in `src/styles/global.css` `[data-theme="dark"]` block:
- Background too dark/light? Change `--color-bg: #1a1a1a`
- Text not bright enough? Change `--color-text-primary: #E8E8E8`
- Accent too bright in dark? Change `--color-accent: #4DA3FF`

Kill the dev server.

- [ ] **Step 2: Commit any tuning changes**

```bash
git add -u
git commit -m "style: tune dark mode colors"
```

(Only if changes were made)

---

### Task 5: Production Build and Push

- [ ] **Step 1: Run production build**

Run:
```bash
npm run build
```

Expected: Build completes without errors. All pages generated.

- [ ] **Step 2: Preview production build**

Run:
```bash
npx astro preview --host
```

Expected: Theme toggle works identically to dev server. Kill the preview server.

- [ ] **Step 3: Push**

```bash
git push
```
