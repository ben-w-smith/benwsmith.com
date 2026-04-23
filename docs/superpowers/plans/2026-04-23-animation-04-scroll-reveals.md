# Animation 04: Scroll-Triggered Reveals — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elements below the fold fade + slide up into view as the user scrolls. Post cards reveal individually, section headings animate in, and the footer slides up when it enters the viewport.

**Architecture:** A shared Intersection Observer script (`scroll-reveal.ts`) watches elements with a `data-reveal` attribute. When an element enters the viewport (with a threshold and root margin), it gets an `is-visible` class that triggers a CSS transition from opacity 0 + translateY(20px) to its natural position. Each element supports a `data-reveal-delay` for staggered reveals. The observer disconnects after all elements are revealed. Elements are visible by default if JS fails — the reveal is an enhancement, not a requirement.

**Tech Stack:** TypeScript client script, Intersection Observer API, CSS transitions, Astro `<script>` tag for automatic bundling

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md` — Animation Layer 1, Category 04

---

## File Structure

```
src/
├── scripts/
│   └── scroll-reveal.ts        # CREATE — Intersection Observer logic
├── styles/
│   └── global.css              # MODIFY — add .scroll-reveal base styles
├── components/
│   ├── PostCard.astro          # MODIFY — add data-reveal + data-reveal-delay
│   └── Footer.astro            # MODIFY — add data-reveal to footer element
├── pages/
│   ├── index.astro             # MODIFY — add data-reveal to hero section heading
│   └── about.astro             # MODIFY — add data-reveal to heading
└── layouts/
    └── BaseLayout.astro        # MODIFY — import scroll-reveal script
```

---

### Task 1: Create Scroll Reveal Script and CSS

**Files:**
- Create: `src/scripts/scroll-reveal.ts`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Create the scroll-reveal.ts script**

Create the file `src/scripts/scroll-reveal.ts` with:

```typescript
function initScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-reveal-delay");
          if (delay) {
            (entry.target as HTMLElement).style.transitionDelay = `${delay}ms`;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener("astro:page-load", initScrollReveal);
```

Key design decisions:
- Uses `astro:page-load` event so it re-initializes after View Transitions
- Checks `prefers-reduced-motion` — if reduced motion is preferred, all elements are immediately visible
- `rootMargin: "0px 0px -40px 0px"` — elements trigger slightly before reaching the viewport center (40px buffer)
- `transitionDelay` is set dynamically from `data-reveal-delay` attribute, enabling staggered reveals without CSS custom properties
- Observer disconnects from each element after it's revealed (one-shot animation)

- [ ] **Step 2: Add scroll reveal CSS to global.css**

In `src/styles/global.css`, add after the `.post-stagger` block (line 256) and before the `@media (prefers-reduced-motion)` block:

```css
/* Scroll reveal */
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-normal) var(--ease-out),
              transform var(--duration-normal) var(--ease-out);
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

Note: The `prefers-reduced-motion` block that already exists in `global.css` will suppress the transition-duration on these elements, making them appear instantly.

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add src/scripts/scroll-reveal.ts src/styles/global.css
git commit -m "feat: add scroll reveal script and CSS"
```

---

### Task 2: Import Script in BaseLayout and Add data-reveal to Elements

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Import scroll-reveal in BaseLayout**

In `src/layouts/BaseLayout.astro`, add a script import at the bottom of the file, after the closing `</html>` tag is NOT valid — add it before the closing `</body>` tag.

Find this line (line 29):

```astro
      <Footer />
    </div>
```

Change it to:

```astro
      <Footer />
      <script src="../scripts/scroll-reveal.ts"></script>
    </div>
```

The full file should now be:

```astro
---
import { ClientRouter } from "astro:transitions";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} — Ben Smith</title>
    <ClientRouter />
  </head>
  <body>
    <div class="page-wrapper">
      <Header />
      <main class="content-wrapper page-enter" transition:animate="fade">
        <slot />
      </main>
      <Footer />
      <script src="../scripts/scroll-reveal.ts"></script>
    </div>
  </body>
</html>
```

- [ ] **Step 2: Add data-reveal to homepage hero heading**

In `src/pages/index.astro`, change line 12:

```astro
    <h1 style="font-size:var(--font-size-site-name);font-weight:var(--font-weight-bold);line-height:1.1;margin-bottom:var(--spacing-sm)">Ben Smith</h1>
```

to:

```astro
    <h1 data-reveal style="font-size:var(--font-size-site-name);font-weight:var(--font-weight-bold);line-height:1.1;margin-bottom:var(--spacing-sm)">Ben Smith</h1>
```

And change line 13:

```astro
    <p style="font-size:15px;color:var(--color-text-secondary);letter-spacing:0.02em">Software Developer · Writer</p>
```

to:

```astro
    <p data-reveal data-reveal-delay="100" style="font-size:15px;color:var(--color-text-secondary);letter-spacing:0.02em">Software Developer · Writer</p>
```

The hero heading reveals first, the subtitle follows 100ms later.

- [ ] **Step 3: Add data-reveal to PostCard**

In `src/components/PostCard.astro`, change line 23-27 (the `<a>` tag):

```astro
<a
  href={`/blog/${slug}`}
  class="post-stagger post-card"
  style={`--stagger-index:${staggerIndex};${last ? 'border-bottom:none;' : ''}`}
>
```

to:

```astro
<a
  href={`/blog/${slug}`}
  class="post-stagger post-card"
  data-reveal
  data-reveal-delay={staggerIndex * 80}
  style={`--stagger-index:${staggerIndex};${last ? 'border-bottom:none;' : ''}`}
>
```

This gives each post card a staggered delay of 80ms * its index, creating a cascading reveal as the user scrolls down through the post list.

- [ ] **Step 4: Add data-reveal to footer**

In `src/components/Footer.astro`, change line 9:

```astro
<footer class="site-footer">
```

to:

```astro
<footer class="site-footer" data-reveal>
```

- [ ] **Step 5: Add data-reveal to about page heading**

In `src/pages/about.astro`, the about page has `<h1>About</h1>` inside the prose article. Add `data-reveal` to the article:

Change line 6:

```astro
  <article class="prose">
```

to:

```astro
  <article class="prose" data-reveal>
```

- [ ] **Step 6: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro src/pages/about.astro src/components/PostCard.astro src/components/Footer.astro
git commit -m "feat: add scroll-triggered reveals to post cards, headings, and footer"
```

---

### Task 3: Visual Review and Timing Tuning

**Files:**
- Modify: `src/styles/global.css` (tune timing if needed)

- [ ] **Step 1: Full interaction review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify:

- [ ] Homepage: hero heading ("Ben Smith") and subtitle reveal with fade + slide up on initial load
- [ ] Homepage: post cards below the fold reveal individually as you scroll down, staggered 80ms apart
- [ ] About page: article content reveals on scroll
- [ ] Footer: slides up when it enters the viewport
- [ ] All reveal animations take ~300ms with ease-out
- [ ] Navigating between pages: reveals replay correctly (via `astro:page-load`)
- [ ] `prefers-reduced-motion`: toggle in DevTools, verify all elements are immediately visible (no transitions)
- [ ] No visual regression — elements that are already in the viewport on load appear immediately without awkward delay

If timing feels off, adjust in `src/styles/global.css`:
- Reveal too slow/fast? Change `--duration-normal` to `--duration-fast` or `--duration-slow` in the `[data-reveal]` transition
- Slide too dramatic? Change `translateY(20px)` to `translateY(12px)`
- Elements triggering too early/late? Adjust `rootMargin` in `scroll-reveal.ts`

Kill the dev server.

- [ ] **Step 2: Commit any tuning changes**

```bash
git add -u
git commit -m "style: tune scroll reveal timing"
```

(Only if changes were made)

---

### Task 4: Production Build and Push

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

Expected: All scroll reveals work identically to dev server. Kill the preview server.

- [ ] **Step 3: Push**

```bash
git push
```
