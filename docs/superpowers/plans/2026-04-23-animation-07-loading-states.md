# Animation 07: Loading & Skeleton States — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add shimmer animations, a navigation loading indicator, polished page transition choreography, and image loading states to complete the micro-interaction animation layer.

**Architecture:** A shimmer gradient keyframe animation serves as the foundation for a navigation loading bar and future skeleton components. Astro's built-in `slide()` transition replaces the current `fade()` on the `<main>` element for more dynamic page transitions. A page-transition-bar script hooks into Astro's View Transition lifecycle events (`astro:before-preparation`, `astro:after-swap`, `astro:page-load`) to show a top-bar loading indicator during navigation. Image loading states use a background color placeholder and opacity fade-in.

**Tech Stack:** CSS custom properties, `@keyframes shimmer`, Astro View Transitions lifecycle events, `slide()` from `astro:transitions`, IntersectionObserver (existing)

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md` — Animation Layer 1, Category 07

---

## File Structure

```
src/
├── scripts/
│   ├── page-transition-bar.ts    # CREATE — loading bar during navigation
│   └── image-loading.ts          # CREATE — fade-in for prose images on load
├── styles/
│   └── global.css                # MODIFY — shimmer keyframes, skeleton tokens, image loading bg
├── components/
│   └── (no changes)
└── layouts/
    └── BaseLayout.astro          # MODIFY — slide() transition, loading bar element, new scripts
```

---

### Task 1: Shimmer Animation and Skeleton Design Tokens

**Files:**
- Modify: `src/styles/global.css`

This adds the shimmer keyframe animation and skeleton color tokens used by the navigation bar (Task 2) and available for future skeleton components.

- [ ] **Step 1: Add skeleton color tokens to `:root`**

In `src/styles/global.css`, add these two tokens to the `:root` block, after the `--shadow-hover` line (line 42):

```css
  --color-skeleton: #E5E5E5;
  --color-skeleton-shine: #F0F0F0;
```

- [ ] **Step 2: Add skeleton color tokens to `[data-theme="dark"]`**

In the `[data-theme="dark"]` block, add after the `--shadow-hover` line (line 75):

```css
  --color-skeleton: #333;
  --color-skeleton-shine: #3a3a3a;
```

- [ ] **Step 3: Add shimmer keyframes**

After the existing `@keyframes fadeInSlide` block (after line 274), add:

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

- [ ] **Step 4: Add `.skeleton` utility class**

After the shimmer keyframes, add:

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-skeleton) 25%,
    var(--color-skeleton-shine) 50%,
    var(--color-skeleton) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 5: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add shimmer animation keyframes and skeleton design tokens"
```

---

### Task 2: Navigation Loading Indicator

**Files:**
- Create: `src/scripts/page-transition-bar.ts`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro`

A thin shimmer bar at the top of the viewport that appears during Astro View Transitions navigation, providing visual feedback that a page load is in progress.

- [ ] **Step 1: Add page transition bar styles**

In `src/styles/global.css`, after the `.skeleton` utility class from Task 1, add:

```css
/* Navigation loading indicator */
.page-transition-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--color-accent) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1s ease-in-out infinite;
  z-index: 101;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out);
  pointer-events: none;
}

.page-transition-bar.is-loading {
  opacity: 1;
}
```

- [ ] **Step 2: Create the page transition bar script**

Create `src/scripts/page-transition-bar.ts` with:

```typescript
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
```

Note: This script runs at module level (not inside `astro:page-load`) because the lifecycle event listeners on `document` persist across navigations. The `document.querySelector` calls inside the callbacks always query the current DOM.

- [ ] **Step 3: Add bar element and script import to BaseLayout**

In `src/layouts/BaseLayout.astro`, make two changes:

First, add the bar element. Find (line 26-27):
```astro
  <body>
    <div class="reading-progress"></div>
```

Change to:
```astro
  <body>
    <div class="reading-progress"></div>
    <div class="page-transition-bar"></div>
```

Second, add the script import. Find (line 38):
```astro
      <script src="../scripts/theme-toggle.ts"></script>
```

Change to:
```astro
      <script src="../scripts/theme-toggle.ts"></script>
      <script src="../scripts/page-transition-bar.ts"></script>
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/page-transition-bar.ts src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: add navigation loading indicator bar during page transitions"
```

---

### Task 3: Page Transition Choreography

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/global.css`

Replace the basic fade transition with Astro's built-in `slide()` for a more dynamic content swap, and update the initial page load animation to match.

- [ ] **Step 1: Import `slide` and update `transition:animate`**

In `src/layouts/BaseLayout.astro`, update the import line. Find (line 2):
```astro
import { ClientRouter } from "astro:transitions";
```

Change to:
```astro
import { ClientRouter, slide } from "astro:transitions";
```

Then update the `<main>` element. Find (line 30):
```astro
      <main class="content-wrapper page-enter" transition:animate="fade">
```

Change to:
```astro
      <main class="content-wrapper page-enter" transition:animate={slide()}>
```

- [ ] **Step 2: Update initial page load animation**

In `src/styles/global.css`, update `.page-enter` to use `fadeInSlide` instead of `fadeIn` for consistency with the slide transition. Find (lines 277-279):
```css
.page-enter {
  animation: fadeIn var(--duration-normal) var(--ease-out) both;
}
```

Change to:
```css
.page-enter {
  animation: fadeInSlide var(--duration-normal) var(--ease-out) both;
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: use slide transition for page navigation and fadeInSlide on initial load"
```

---

### Task 4: Image Loading States

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/scripts/image-loading.ts`
- Modify: `src/layouts/BaseLayout.astro`

Add subtle loading placeholders for images in blog posts — a background color while loading, and a fade-in when the image finishes loading.

- [ ] **Step 1: Add image loading background**

In `src/styles/global.css`, update the `.prose img` rule. Find (lines 227-230):
```css
.prose img {
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
}
```

Change to:
```css
.prose img {
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
  background: var(--color-bg-off);
}
```

- [ ] **Step 2: Create the image loading script**

Create `src/scripts/image-loading.ts` with:

```typescript
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
```

- [ ] **Step 3: Import script in BaseLayout**

In `src/layouts/BaseLayout.astro`, find (after Task 2 changes):
```astro
      <script src="../scripts/page-transition-bar.ts"></script>
```

Change to:
```astro
      <script src="../scripts/page-transition-bar.ts"></script>
      <script src="../scripts/image-loading.ts"></script>
```

- [ ] **Step 4: Verify build**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/image-loading.ts src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: add image loading fade-in and background placeholder"
```

---

### Task 5: Visual Review and Ship

**Files:**
- Modify: `src/styles/global.css` (tune timing/colors if needed)

- [ ] **Step 1: Full interaction review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify:

- [ ] Navigation loading bar: click "About" link — shimmer bar appears at top during navigation, disappears when page loads
- [ ] Navigation loading bar: click "Blog" to go back — same behavior
- [ ] Slide transition: content slides in from below on navigation, old content slides up and out
- [ ] Initial page load: content fades in with a subtle slide-up (fadeInSlide)
- [ ] Post card stagger: cards still stagger in on initial load (not broken by slide transition)
- [ ] Image loading: images in blog posts show background color while loading, fade in when complete
- [ ] Dark mode: navigation bar uses correct accent color in dark mode
- [ ] Skeleton tokens: toggle between themes — skeleton colors adapt
- [ ] Shimmer animation: loading bar shimmer is visible but not distracting
- [ ] Reading progress bar: still works correctly, no conflict with navigation bar
- [ ] Theme toggle circular reveal: still works correctly
- [ ] Scroll reveals: still work correctly
- [ ] `prefers-reduced-motion`: all animations instant, loading bar hidden
- [ ] No visual regressions on any existing features

If timing feels off:
- Slide transition too slow/fast? Change the `slide()` call to `slide({ duration: '0.3s' })` in BaseLayout
- Shimmer too fast/slow? Change `1s` in the `.page-transition-bar` animation
- Initial load animation too subtle? Change `fadeInSlide` to `slideUp` in `.page-enter`

Kill the dev server.

- [ ] **Step 2: Commit any tuning changes**

```bash
git add -u
git commit -m "style: tune loading state animations"
```

(Only if changes were made)

- [ ] **Step 3: Run production build**

Run:
```bash
npm run build
```

Expected: Build completes without errors. All pages generated.

- [ ] **Step 4: Preview production build**

Run:
```bash
npx astro preview --host
```

Expected: All loading states work identically to dev server. Kill the preview server.

- [ ] **Step 5: Push**

```bash
git push
```
