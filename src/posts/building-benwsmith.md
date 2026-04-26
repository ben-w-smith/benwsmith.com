---
title: "Building benwsmith.com"
date: 2026-04-26
category: Technical
excerpt: "A React site abandoned in 2017. An Astro rebuild in 2026. What changed in nine years — and what didn't."
---

## Nine Years Between Commits

The git log tells the story better than I could.

```
3a58e7b  2017-10-15  initial commit
954390e  2017-10-15  added some header animation
078ce53  2017-10-16  refined header animations
3a7488f  2017-10-17  rewrote animation staggering to use promises
719dc20  2017-10-17  not sure what I changed here
7e45075  2017-10-27  animation fades in... now to stagger stuff
edd82de  2017-10-27  using staggeredmotion... not perfect
2c3d718  2018-04-02  too long ago to remember what I'm doing now, dang
3290fa2  2026-04-23  init: Astro project with Inter font config
```

Nine years between commit messages. The first batch is a React + Webpack personal site with SCSS, Google Fonts, and a header animation system built on promises. The commit messages read like a developer thinking out loud — "not sure what I changed here," "too long ago to remember what I'm doing now, dang." That last one from April 2018 is where the trail went cold.

The site never shipped. It had potential — a layered header with foreground and background text, staggered animations, a fluid effect component. But it was a framework without a foundation. No content. No posts. No real reason for anyone to visit.

## What Changed

In 2017, I was building a personal brand site from scratch: React, Webpack, SCSS, a custom animation system. It was the right stack for the wrong problem. I was optimizing the delivery mechanism before I had anything to deliver.

In 2026, the constraints flipped. I had things to say — essays on AI and taste, reflections on fifteen years of writing software, technical notes from projects I'd shipped. What I needed was a site that would get out of the way. Zero JavaScript by default. Markdown files and a build step. Content, not framework.

Astro gave me exactly that.

## The Rebuild

The 2026 rebuild happened in one long day. Thirty commits on April 23rd:

1. **Scaffold** — Astro project, Inter font via Fontsource, global CSS with design tokens
2. **Content layer** — Blog posts as Markdown with Zod-validated frontmatter, content collections via Astro's glob loader
3. **Layout** — Base layout with header/footer slots, responsive nav, social links
4. **Components** — Post cards, category pills, back links — all Astro components, zero client-side JS
5. **Blog pages** — File-based routing (`blog/[...slug].astro`), homepage with post feed, individual post pages

The pattern is the opposite of the 2017 approach. Then, I started with the animation system. Now, I started with the content. The blog posts existed before the homepage did.

## View Transitions

The one place where Astro's approach let me be ambitious was page transitions. Using the View Transitions API with Astro's `ClientRouter`, I got SPA-like navigation for free — slide transitions between pages, a loading indicator bar during swaps, and fade-in animations on initial load. No React, no client-side router, no hydration overhead.

```css
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
```

The design system is built on CSS custom properties — animation durations, easing curves, spacing scales, shadow levels. All defined in `:root`, all consistent. The 2017 site had hardcoded values scattered through SCSS partials. This time, I got the system right before I wrote a single animation.

## The Ambient Canvas

The homepage has a Game of Life simulation running behind the hero text. It's subtle — blue cells fading in and out, barely visible until you move your mouse and seed new cells along your cursor path.

The implementation went through several iterations:

1. Basic GoL engine with cell birth/death
2. Mouse interaction — click to toggle cells
3. Continuous brush seeding — cells spawn on every mousemove via path interpolation
4. Heat system — cells interpolate between desaturated blue (ambient) and vivid blue (mouse-seeded) based on heat that decays each simulation step
5. Trail grid — an independent layer that captures mouse brush strokes and fades over ~0.4s
6. Theme awareness — colors adapt when you toggle between light and dark mode

It renders at 30fps with time-based throttling, simulation steps at ~6/second. There's a mask-image fade so the canvas disappears below the hero area. And it respects `prefers-reduced-motion` — if you'd rather not see animations, the canvas hides entirely.

The architectural lesson was specific and painful: the `<main>` element has a `transform` animation (`fadeInSlide`) which creates a new containing block, breaking `position: fixed` for anything inside it. The canvas needs to live outside `<main>`, in a named slot that's positioned before the header in the DOM.

## The Lab

After the homepage canvas, I extracted the Game of Life engine into a standalone module and built a lab page — a full-interactive sandbox where you can play with the simulation directly. It's linked from the nav, separate from the blog.

The lab is the 2017 site's spirit, done right. Then, I built an animation demo site with nothing to animate. Now, I have a playground for things that are genuinely fun to interact with.

## What Didn't Change

Good software still comes from understanding the problem before reaching for a solution. The best code is still the code you don't write. And shipping something real still beats perfecting something imaginary.

The 2017 commit messages already knew this. The problem wasn't the tech stack. It was that I was building a site for a writer who hadn't started writing.

So I started writing.
