# Animation 01: Page Transitions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add smooth page transitions — content fades in on load, posts reveal with a stagger, cross-page navigation uses Astro's View Transition API, and scroll position restores cleanly.

**Architecture:** Astro 6's `ClientRouter` component from `astro:transitions` enables the View Transitions API with zero config. We add it to `BaseLayout.astro` and customize with `transition:animate` directives. CSS `@keyframes` handle the initial page load animation and staggered post reveal. A shared set of animation tokens (durations, easings) in `global.css` ensures consistency across all 7 animation passes.

**Tech Stack:** Astro ClientRouter, CSS custom properties, CSS @keyframes, `prefers-reduced-motion` media query

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md` — Animation Layer 1, Category 01

---

## File Structure

```
src/
├── styles/
│   └── global.css               # MODIFY — add animation tokens + keyframes + reduced-motion
├── layouts/
│   └── BaseLayout.astro         # MODIFY — add ClientRouter, transition:animate on <main>
├── components/
│   └── PostCard.astro           # MODIFY — accept staggerIndex prop for staggered reveal
├── pages/
│   ├── index.astro              # MODIFY — pass staggerIndex to PostCard
│   ├── about.astro              # No changes needed (inherits from layout)
│   └── blog/
│       └── [...slug].astro      # No changes needed (inherits from layout)
```

---

### Task 1: Add Animation Tokens to Global CSS

**Files:**
- Modify: `src/styles/global.css` (add after `--max-width-wide` token, line 45)

- [ ] **Step 1: Add animation tokens to `:root`**

In `src/styles/global.css`, add these tokens after line 45 (`--max-width-wide: 960px;`), before the closing `}` of `:root`:

```css
  /* Animation */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

- [ ] **Step 2: Add @keyframes for page transitions**

Add at the end of `src/styles/global.css`:

```css
/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Page transition classes */
.page-enter {
  animation: fadeIn var(--duration-normal) var(--ease-out) both;
}

.post-stagger {
  animation: slideUp var(--duration-normal) var(--ease-out) both;
  animation-delay: calc(var(--stagger-index, 0) * 80ms);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Verify CSS is valid**

Run:
```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add animation tokens and page transition keyframes"
```

---

### Task 2: Enable ClientRouter in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add ClientRouter and transition:animate**

Replace the entire content of `src/layouts/BaseLayout.astro` with:

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
    </div>
  </body>
</html>
```

Key changes from previous version:
- Import `ClientRouter` from `astro:transitions`
- Add `<ClientRouter />` in `<head>`
- Add `page-enter` class to `<main>` for initial load animation
- Add `transition:animate="fade"` to `<main>` for cross-page View Transitions

- [ ] **Step 2: Verify dev server and cross-page transitions**

Run:
```bash
npm run dev -- --host
```

Expected:
- Homepage loads with a subtle fade-in on the main content area
- Clicking a post link triggers a smooth cross-page fade transition
- Clicking "Back to Blog" triggers a reverse fade
- Navigating between Blog and About triggers a fade
- Browser back/forward buttons work with transitions

Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: enable ClientRouter for view transitions"
```

---

### Task 3: Staggered Post Reveal on Homepage

**Files:**
- Modify: `src/components/PostCard.astro` (add staggerIndex prop)
- Modify: `src/pages/index.astro` (pass staggerIndex)

- [ ] **Step 1: Add staggerIndex prop to PostCard**

In `src/components/PostCard.astro`, update the Props interface and destructuring.

Change the Props interface (lines 4-11) to:

```typescript
interface Props {
  title: string;
  date: Date;
  category: "Technical" | "Essay" | "Project";
  excerpt: string;
  slug: string;
  last?: boolean;
  staggerIndex?: number;
}
```

Change the destructuring (line 13) to:

```typescript
const { title, date, category, excerpt, slug, last = false, staggerIndex = 0 } = Astro.props;
```

Change the outer `<a>` tag (line 22) from:

```astro
<a href={`/blog/${slug}`} style={`text-decoration:none;display:block;padding:var(--spacing-lg) 0;${!last ? 'border-bottom:1px solid var(--color-border)' : ''}`}>
```

to:

```astro
<a href={`/blog/${slug}`} class="post-stagger" style={`--stagger-index:${staggerIndex};text-decoration:none;display:block;padding:var(--spacing-lg) 0;${!last ? 'border-bottom:1px solid var(--color-border)' : ''}`}>
```

This adds the `post-stagger` class and sets the `--stagger-index` CSS custom property inline.

- [ ] **Step 2: Pass staggerIndex from the homepage**

In `src/pages/index.astro`, change the PostCard invocation (lines 17-25) from:

```astro
    {posts.map((post, i) => (
      <PostCard
        title={post.data.title}
        date={post.data.date}
        category={post.data.category}
        excerpt={post.data.excerpt}
        slug={post.id}
        last={i === posts.length - 1}
      />
    ))}
```

to:

```astro
    {posts.map((post, i) => (
      <PostCard
        title={post.data.title}
        date={post.data.date}
        category={post.data.category}
        excerpt={post.data.excerpt}
        slug={post.id}
        last={i === posts.length - 1}
        staggerIndex={i}
      />
    ))}
```

- [ ] **Step 3: Verify staggered reveal**

Run:
```bash
npm run dev -- --host
```

Expected:
- Homepage loads: posts appear one after another with a slight delay between each (80ms)
- Each post slides up 12px while fading in
- The stagger creates a cascading reveal effect
- The hero section ("Ben Smith" + tagline) fades in immediately via the `page-enter` class
- `prefers-reduced-motion` is respected: if you toggle it in browser DevTools, animations are disabled

Kill the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.astro src/pages/index.astro
git commit -m "feat: add staggered post reveal animation"
```

---

### Task 4: Visual Review and Timing Tuning

**Files:**
- Modify: `src/styles/global.css` (tune timing if needed)

- [ ] **Step 1: Full animation review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify the complete page transition experience:

- [ ] Initial page load: main content fades in smoothly (300ms, ease-out)
- [ ] Homepage: hero section visible immediately, posts cascade in with 80ms stagger
- [ ] Click from homepage to post: smooth fade transition
- [ ] Click "Back to Blog": smooth reverse transition, posts re-stagger
- [ ] Navigate to About: smooth fade
- [ ] Navigate back: smooth fade
- [ ] Browser back/forward buttons work with transitions
- [ ] `prefers-reduced-motion`: toggle in DevTools, verify all animations are suppressed

If timing feels off, adjust in `src/styles/global.css`:
- Stagger too slow/fast? Change the `80ms` multiplier in `.post-stagger`
- Fade too slow/fast? Change `--duration-normal` or the `fadeIn` duration
- Slide too dramatic? Change `translateY(12px)` in `slideUp`

Kill the dev server.

- [ ] **Step 2: Commit any tuning changes**

```bash
git add -u
git commit -m "style: tune page transition timing"
```

(Only if changes were made)

---

### Task 5: Production Build Verification

**Files:**
- No file changes expected

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

Expected: All transitions work identically to dev server. All pages load. All animations play. Kill the preview server.

- [ ] **Step 3: Push**

```bash
git push
```

---

## Animation Tokens Reference

These tokens are shared across all 7 animation passes. Future passes should reference them:

| Token | Value | Use |
|-------|-------|-----|
| `--duration-instant` | 100ms | Hover states, micro-feedback |
| `--duration-fast` | 200ms | Small transitions |
| `--duration-normal` | 300ms | Page transitions, reveals |
| `--duration-slow` | 500ms | Complex animations |
| `--duration-slower` | 700ms | Hero moments |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Deceleration (entries) |
| `--ease-in-out` | cubic-bezier(0.45, 0, 0.55, 1) | Bidirectional |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful overshoot |

## Reduced Motion

The `@media (prefers-reduced-motion: reduce)` block in `global.css` suppresses all animations for users who prefer reduced motion. This applies site-wide and will cover all future animation passes.
