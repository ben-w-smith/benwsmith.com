# benwsmith.com

Personal blog and portfolio site built with Astro 6 (static output).

## Tech Stack

- **Framework:** Astro 6.1 with static output
- **Styling:** Vanilla CSS with design tokens in `src/styles/global.css`
- **Scripts:** TypeScript, loaded via `<script>` tags in Astro components
- **Transitions:** Astro View Transitions API (`ClientRouter`, `slide()`)
- **Content:** Markdown blog posts in `src/posts/`, loaded via Astro content collections
- **Node:** >=22.12.0

## Commands

```bash
npm run dev         # Start dev server
npm run build       # Production build to dist/
npm run preview     # Preview production build locally
```

## Project Structure

```
src/
├── components/       # Astro UI components
├── layouts/          # BaseLayout.astro (HTML shell, scripts, styles)
├── pages/            # File-based routing (index, about, blog/[...slug])
├── posts/            # Markdown blog content
├── scripts/          # Client-side TypeScript (run in browser)
└── styles/
    └── global.css    # Design tokens, animations, utility classes
```

## Git Conventions

- **Main branch:** `main`
- **Commit style:** Conventional commits (`feat:`, `fix:`, `style:`, `chore:`)
- **GitHub account:** `ben-w-smith` (personal)
- **SSH alias:** Remote uses `github.com-benwsmith` host alias (`~/.ssh/id_rsa_benwsmith`)
- **Worktrees:** Feature work uses `.worktrees/` directory (gitignored)

## Deployment

- **Host:** DigitalOcean droplet (`benwsmith-com`, ID 567462810)
- **IP:** 146.190.160.114
- **Region:** sfo3, Ubuntu 24.04, nginx
- **DNS:** Cloudflare (A record → 146.190.160.114)
- **Deploy command:**
  ```bash
  npm run build && rsync -avz --delete dist/ root@146.190.160.114:/var/www/html/
  ```
- **SSH:** `ssh root@146.190.160.114` (uses `~/.ssh/id_ed25519`)

## Design System

Design tokens live in `src/styles/global.css` under `:root` and `[data-theme="dark"]`.

Key tokens:
- `--color-accent`: `#007AFF` (light) / `#4DA3FF` (dark)
- `--font-size-site-name`: 48px (hero), `--font-size-title`: 18px (post cards)
- `--max-width`: 640px (content), `--max-width-wide`: 960px (page wrapper)
- Animation durations: `--duration-fast` (200ms) through `--duration-slower` (700ms)
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` (primary easing)

Theme toggle stores preference in `localStorage` under key `"theme"`.

## Architecture

### View Transitions

All scripts use `astro:page-load` for initialization and `astro:before-swap` for cleanup. This ensures proper lifecycle management across SPA navigations.

### Ambient Canvas (homepage only)

`AmbientCanvas.astro` + `ambient-canvas.ts` — Game of Life simulation behind the hero.

Key architectural decisions:
- **Must use `slot="background"`** in `index.astro` to place the canvas outside the `<main>` element. The `<main>` has a `transform` animation (`fadeInSlide`) which breaks `position: fixed` by creating a new containing block.
- **Named slot pattern:** `BaseLayout.astro` has `<slot name="background" />` before `<Header />` for elements that need true viewport-fixed positioning.
- **Mask-image fade:** Canvas uses CSS `mask-image` to fade out below the hero area.
- **Separate visual layers:** Trail grid (mouse brush stroke) is independent of the GoL simulation grid. Trail fades over ~0.4s, GoL cells fade in/out over ~0.3s/~1s.
- **Heat system:** Cells interpolate between desaturated blue (ambient) and vivid blue (mouse-seeded) based on heat that decays each simulation step.
- **30fps render** with time-based throttling; simulation steps at ~6/second.
- **Continuous brush seeding:** GoL cells spawn on every `mousemove` via path interpolation (`seedAlongPath`), with ~25% probability per cell in a 3x3 area. No distance threshold — any movement seeds.

### Reduced Motion

`prefers-reduced-motion: reduce` is handled at two levels:
- **CSS:** Global rule disables all animation durations, iteration counts, and transition durations.
- **Canvas:** AmbientCanvas hides entirely (`display: none`). Any new animation work must respect this preference.

### Scripts Lifecycle

Each script in `src/scripts/` follows the same pattern:
```typescript
function init() { /* setup */ }
function cleanup() { /* teardown */ }
document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", cleanup);
```

## Design Philosophy

Content is king. Animations register subconsciously as "that's cool" then get out of the way. Effects should never compete with or distract from blog content. When in doubt, reduce opacity or constrain to non-content areas.
