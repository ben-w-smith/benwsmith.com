# Animation 02: Post List Interactions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hover and press interactions to post cards — subtle lift, title color shift, category pill pulse, and active state feedback.

**Architecture:** PostCard currently uses inline styles, which can't express `:hover` or `:active` pseudo-classes. We refactor PostCard to use a scoped `<style>` block for all visual styles, keeping only dynamic values (stagger index, last-card border) as inline. CategoryPill gets a small `<style>` block with a transition. Parent-hover-to-child is handled via `:global()` in PostCard's scoped styles.

**Tech Stack:** Astro scoped `<style>` blocks, CSS transitions, animation tokens from `global.css`

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md` — Animation Layer 1, Category 02

---

## File Structure

```
src/components/
├── PostCard.astro               # MODIFY — refactor inline styles to <style> block, add hover/active states
└── CategoryPill.astro           # MODIFY — add <style> block with transition
```

---

### Task 1: Refactor PostCard with Hover States

**Files:**
- Modify: `src/components/PostCard.astro`

- [ ] **Step 1: Replace the entire PostCard.astro with refactored version**

Replace the entire content of `src/components/PostCard.astro` with:

```astro
---
import CategoryPill from "./CategoryPill.astro";

interface Props {
  title: string;
  date: Date;
  category: "Technical" | "Essay" | "Project";
  excerpt: string;
  slug: string;
  last?: boolean;
  staggerIndex?: number;
}

const { title, date, category, excerpt, slug, last = false, staggerIndex = 0 } = Astro.props;

const formattedDate = date.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
---

<a
  href={`/blog/${slug}`}
  class="post-stagger post-card"
  style={`--stagger-index:${staggerIndex};${!last ? '' : 'border-bottom:none;'}${last ? 'border-bottom:none;' : ''}`}
>
  <div class="post-meta">
    <CategoryPill category={category} />
    <span class="text-label">{formattedDate}</span>
  </div>
  <h3 class="post-title">{title}</h3>
  <p class="post-excerpt">{excerpt}</p>
</a>

<style>
  .post-card {
    text-decoration: none;
    display: block;
    padding: var(--spacing-lg) 0;
    border-bottom: 1px solid var(--color-border);
    transition:
      transform var(--duration-fast) var(--ease-out),
      padding-left var(--duration-fast) var(--ease-out);
  }

  .post-card:hover {
    transform: translateY(-2px);
    padding-left: var(--spacing-sm);
  }

  .post-card:active {
    transform: translateY(0);
    padding-left: 0;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  .post-title {
    font-size: var(--font-size-title);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0 0 6px 0;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .post-card:hover .post-title {
    color: var(--color-accent);
  }

  .post-excerpt {
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-secondary);
    margin: 6px 0 0 0;
  }

  .post-card:hover :global(.category-pill) {
    transform: scale(1.08);
  }
</style>
```

Key changes from previous version:
- Moved all inline styles to scoped `<style>` block
- Added `post-card` class for hover targeting
- Added `post-meta`, `post-title`, `post-excerpt` classes
- `.post-card:hover` — lifts card 2px, nudges right 8px
- `.post-card:active` — pushes back to original position
- `.post-card:hover .post-title` — shifts title to accent color
- `.post-card:hover :global(.category-pill)` — scales pill up 8%

**Note on the border-bottom logic:** The old inline style had `${!last ? 'border-bottom:1px solid var(--color-border)' : ''}`. The new CSS always applies `border-bottom` via the `.post-card` class. For the last card, we need to remove it. Update the inline style to handle this:

Change this line:
```
  style={`--stagger-index:${staggerIndex};${!last ? '' : 'border-bottom:none;'}${last ? 'border-bottom:none;' : ''}`}
```

To:
```
  style={`--stagger-index:${staggerIndex};${last ? 'border-bottom:none;' : ''}`}
```

- [ ] **Step 2: Verify dev server starts**

Run:
```bash
npm run dev -- --host
```

Expected: Homepage loads, posts render identically to before (same layout, colors, spacing). No visual regression.

Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "feat: add hover and active states to post cards"
```

---

### Task 2: Add Transition to CategoryPill

**Files:**
- Modify: `src/components/CategoryPill.astro`

- [ ] **Step 1: Add scoped style block with transition**

Add a `class="category-pill"` to the `<span>` and add a `<style>` block.

Replace the entire content of `src/components/CategoryPill.astro` with:

```astro
---
interface Props {
  category: "Technical" | "Essay" | "Project";
}

const { category } = Astro.props;

const colors: Record<string, { text: string; bg: string }> = {
  Technical: { text: "var(--color-technical)", bg: "var(--color-technical-bg)" },
  Essay: { text: "var(--color-essay)", bg: "var(--color-essay-bg)" },
  Project: { text: "var(--color-project)", bg: "var(--color-project-bg)" },
};

const { text, bg } = colors[category];
---

<span class="category-pill" style={`font-size:var(--font-size-label);font-weight:var(--font-weight-medium);color:${text};background:${bg};padding:2px 8px;border-radius:var(--radius-sm);display:inline-block`}>
  {category}
</span>

<style>
  .category-pill {
    transition: transform var(--duration-fast) var(--ease-spring);
  }
</style>
```

Key changes:
- Added `class="category-pill"` to the `<span>`
- Added scoped `<style>` block with `transition` on `transform`
- Uses `--ease-spring` for a playful overshoot when the parent card is hovered

The pill itself doesn't have a `:hover` state — the parent PostCard's `:hover` scales it via `:global(.category-pill)`. The `transition` here makes that scaling smooth.

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryPill.astro
git commit -m "feat: add scale transition to category pill"
```

---

### Task 3: Visual Review and Timing Tuning

**Files:**
- Modify: `src/components/PostCard.astro` (tune timing if needed)

- [ ] **Step 1: Full interaction review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify:

- [ ] Hover over a post card: card lifts 2px, nudges right 8px, title shifts to accent blue, pill scales up slightly
- [ ] The transitions feel smooth and fast (~200ms)
- [ ] Click/press a post card: it pushes back to original position (active state)
- [ ] Moving mouse away: everything returns to original state smoothly
- [ ] Multiple cards in a row: hover works independently on each
- [ ] No visual regression — spacing, typography, colors same as before
- [ ] `prefers-reduced-motion`: toggle in DevTools, verify hover states still work but transitions are instant

If timing feels off, adjust in `PostCard.astro`'s `<style>` block:
- Lift too subtle/dramatic? Change `translateY(-2px)` or `padding-left: var(--spacing-sm)`
- Too slow/fast? Change `var(--duration-fast)` to `var(--duration-instant)` or `var(--duration-normal)`
- Pill pulse too much/little? Change `scale(1.08)`

Kill the dev server.

- [ ] **Step 2: Commit any tuning changes**

```bash
git add -u
git commit -m "style: tune post card interaction timing"
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

Expected: All interactions work identically to dev server. Kill the preview server.

- [ ] **Step 3: Push**

```bash
git push
```
