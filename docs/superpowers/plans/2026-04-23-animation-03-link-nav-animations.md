# Animation 03: Link & Navigation Animations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add underline grow-from-center on hover for nav and footer links, nav link indicator slide, active page highlight, and external link icon reveal on footer links.

**Architecture:** Header and Footer currently use all-inline styles. We refactor both to use scoped `<style>` blocks. Link underline animations use `::after` pseudo-elements that scale from center (width 0 → 100%) on hover. Active page detection uses the existing `currentPath` logic but transitions it smoothly via a class. External link icons use an inline SVG appended via the Footer template, revealed on hover.

**Tech Stack:** Astro scoped `<style>` blocks, CSS transitions, `::after` pseudo-elements, CSS custom properties from `global.css`

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md` — Animation Layer 1, Category 03

---

## File Structure

```
src/components/
├── Header.astro               # MODIFY — refactor to scoped <style>, add underline grow + active highlight
└── Footer.astro               # MODIFY — refactor to scoped <style>, add underline grow + external link icon
```

---

### Task 1: Refactor Header with Underline Grow and Active Highlight

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Replace the entire Header.astro with refactored version**

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
</style>
```

Key changes from previous version:
- Moved all inline styles to scoped `<style>` block
- Added `site-header`, `site-name`, `site-nav`, `nav-link` classes
- `::after` pseudo-element on `.nav-link` grows from center on hover (left: 50%, width: 0 → left: 0, width: 100%)
- `.nav-link:hover` — color shifts to primary, underline grows out from center
- `.nav-link.active` — always shows full underline in primary color (active page indicator)
- Active state uses `class:list` with the existing `currentPath` logic

- [ ] **Step 2: Verify dev server starts**

Run:
```bash
npm run dev -- --host
```

Expected: Header renders identically to before. Nav links show underline growing from center on hover. Active page link has persistent underline in dark color. Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add underline grow and active highlight to nav links"
```

---

### Task 2: Refactor Footer with Underline Grow and External Link Icon

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace the entire Footer.astro with refactored version**

Replace the entire content of `src/components/Footer.astro` with:

```astro
---
const socialLinks = [
  { href: "https://github.com/ben-w-smith", label: "GitHub", external: true },
  { href: "https://twitter.com/benwsmith", label: "Twitter", external: true },
  { href: "mailto:hello@benwsmith.com", label: "Email", external: false },
];
---

<footer class="site-footer">
  {socialLinks.map((link) => (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
      class="footer-link"
    >
      {link.label}
      {link.external && (
        <svg
          class="external-icon"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 9L9 1M9 1H4M9 1V6" />
        </svg>
      )}
    </a>
  ))}
</footer>

<style>
  .site-footer {
    padding: var(--spacing-2xl) 0;
    border-top: 1px solid var(--color-border);
    margin-top: var(--spacing-2xl);
    display: flex;
    gap: var(--spacing-lg);
    justify-content: center;
  }

  .footer-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 13px;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .footer-link::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: 0;
    height: 1px;
    background: var(--color-text-secondary);
    transition: width var(--duration-fast) var(--ease-out), left var(--duration-fast) var(--ease-out);
  }

  .footer-link:hover {
    color: var(--color-text-primary);
  }

  .footer-link:hover::after {
    width: 100%;
    left: 0;
  }

  .external-icon {
    opacity: 0;
    transform: translateY(1px);
    transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out);
  }

  .footer-link:hover .external-icon {
    opacity: 1;
    transform: translateY(0);
  }
</style>
```

Key changes from previous version:
- Moved all inline styles to scoped `<style>` block
- Added `external` boolean to link data, removed `startsWith("http")` checks from template
- Inline SVG arrow icon rendered only for external links (`link.external`)
- `::after` pseudo-element on `.footer-link` grows from center on hover
- `.external-icon` hidden by default (`opacity: 0`), fades in + slides up on hover
- Underline color matches text color (secondary), shifts to primary on hover

- [ ] **Step 2: Verify dev server starts**

Run:
```bash
npm run dev -- --host
```

Expected: Footer renders identically. Links show underline growing from center on hover. External links (GitHub, Twitter) reveal a small arrow icon on hover. Email link has no icon. Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add underline grow and external link icon to footer"
```

---

### Task 3: Visual Review and Timing Tuning

**Files:**
- Modify: `src/components/Header.astro` (tune timing if needed)
- Modify: `src/components/Footer.astro` (tune timing if needed)

- [ ] **Step 1: Full interaction review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify:

- [ ] Nav links: underline grows from center on hover, smooth 200ms
- [ ] Nav links: color shifts from secondary to primary on hover
- [ ] Active page nav link has persistent underline in primary text color
- [ ] Switching pages: active underline moves correctly (Blog on homepage, About on about page)
- [ ] Footer links: underline grows from center on hover
- [ ] Footer external links (GitHub, Twitter): arrow icon fades in on hover
- [ ] Footer email link: no icon, underline still works
- [ ] No visual regression — spacing, typography, colors same as before
- [ ] `prefers-reduced-motion`: toggle in DevTools, verify hover states still work but transitions are instant

If timing feels off, adjust in the respective `<style>` blocks:
- Underline too slow/fast? Change `var(--duration-fast)` to `var(--duration-instant)` or `var(--duration-normal)`
- Underline too thin/thick? Change `height: 1.5px` or `height: 1px`
- Icon reveal too subtle? Change `opacity` values or `translateY` distance

Kill the dev server.

- [ ] **Step 2: Commit any tuning changes**

```bash
git add -u
git commit -m "style: tune link animation timing"
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
