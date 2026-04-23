# Personal Site Design Spec

## Overview

A personal website for Ben Smith — a 43-year-old software developer with 15 years of experience. The site serves as a blog for capturing thoughts: technical deep-dives, essays, and project showcases.

The design draws from Jakub Antalik's product design language (Frame.io, Dona.ai, his UI component work) — clean, precise, and alive with deliberate motion. Not his simple portfolio page — his actual product work.

## Design DNA

### Typography
- **Font:** Inter throughout (no serifs)
- **Titles:** Semibold, 18px
- **Body:** Regular, 14-15px
- **Labels/metadata:** Medium, 12-13px

### Colors
- **Background:** Off-white (#F7F7F8)
- **Text primary:** #1a1a1a
- **Text secondary:** #666
- **Borders/dividers:** #E5E5E5 (thin, not heavy)
- **Accent:** System blue (#007AFF) for interactive elements
- **Category pills:** Colored text on transparent tint backgrounds
  - Technical: #007AFF on #007AFF1A
  - Essay: #FF6B6B on #FF6B6B1A
  - Project: #4ECDC4 on #4ECDC41A

### Spacing & Details
- Generous padding: 16-24px
- Content max-width: ~640px for reading
- Thin dividers between items, no boxes
- Soft rounded corners: 8-12px for cards, 6-8px for buttons
- Subtle shadows where needed: rgba(0,0,0,0.05-0.15)
- Everything breathes — never crowded

## Layout

**Typographic blog** — single-column, text-first.

### Homepage
- Name ("Ben Smith") and short tagline at top
- Minimal nav: name/logo + 2-3 links (Blog, Projects, About)
- Clean list feed of posts below
- Each post shows: category pill + date, title, short excerpt
- Thin #E5E5E5 dividers between posts

### Individual Post Page
- Back link ("← Back to Blog")
- Category pill + date + reading time
- Post title (larger, 28px bold)
- Body text at 15px with 1.7 line-height
- Code blocks: white bg, thin border, monospace
- Max-width ~640px for comfortable reading

### Footer
- Social links, minimal and unobtrusive

## Content Types
- **Technical** — deep-dives, tutorials, walkthroughs
- **Essay** — reflections, opinions
- **Project** — showcases, open source work

## Tech Stack
- **Astro** — static site generator
- **DigitalOcean** — cheap droplet hosting
- **Markdown** — files with YAML frontmatter for authoring
- **Canvas / CSS / JS** — all animation layers

## Authoring Workflow
1. Write a Markdown file
2. Add frontmatter (title, date, category, optional flags)
3. Commit and push
4. Site rebuilds and deploys

No CMS, no admin panel, no video editing. All animation is code-based.

## Animation System

Three layers of motion, each with a different purpose and build cadence.

### Layer 1: Micro-Interactions
Seven categories, each a dedicated build session. Shared animation tokens (durations, easings) for consistency.

| # | Category | What It Covers |
|---|----------|---------------|
| 01 | Page Transitions | Content fade-in on load, staggered post reveal, View Transition API, smooth scroll restoration |
| 02 | Post List Interactions | Subtle lift on hover (translateY + shadow), title color shift, category pill pulse, press/active state feedback |
| 03 | Link & Navigation Animations | Underline grow from center, nav link indicator slide, active page highlight transition, external link icon reveal |
| 04 | Scroll-Triggered Reveals | Post cards fade + slide up, section headings reveal, footer slide-in, respect prefers-reduced-motion |
| 05 | Reading Experience | Progress bar along top, code block syntax highlight fade, image zoom on click, heading anchor link appear on hover |
| 06 | Dark Mode Transition | Smooth color property transitions, toggle icon morph (sun/moon), system preference detection |
| 07 | Loading & Skeleton States | Skeleton shimmer placeholders, content swap timing, initial page load choreography |

### Layer 2: Reusable Animated Effects
Site-appropriate animated elements that enhance the reading experience without feeling flashy or out of place. Not prescribed now — determined during animation passes based on what feels right for a blog context. Examples of the type: subtle featured post accents, animated dividers, gentle glow effects on interactive elements. Toggleable per-post via frontmatter flags.

### Layer 3: Ambient & Hero Effects
Scene-setting animations for homepage-level impact.

- **Ambient canvas background** — Interactive Game of Life (or similar) behind the homepage hero. Mouse-responsive. Low opacity so text stays readable. Optional per-page.
- **Hero templates** — Reusable templates for post headers. Code typing animation template for technical posts. Controlled by frontmatter data, no video editing needed. Additional templates (browser frame, diagram) added as separate sessions when needed.

## Build Phases

### Phase 1: Static Build
Full site with all pages, layout, typography, colors, spacing. Zero animation. Homepage, post listing, individual post pages, navigation. Deploy to DigitalOcean. The site should look complete and polished at this stage — just still.

### Phase 2: Micro-Animation Passes
7 focused sessions — one per category from Layer 1. Each session: design the motion, implement, tune timing and easing until it feels right. Shared animation tokens defined early for consistency across all sessions.

### Phase 3: Signature Moments
- Session 1: Ambient canvas background (Game of Life)
- Session 2: Reusable animated effects (Layer 2 — determine what fits during the session)
- Session 3: Hero template (code typing showcase)
- Additional hero templates as needed in future sessions

## Deployment
- Static build output from Astro
- Hosted on a cheap DigitalOcean droplet
- CI/CD via git push (exact mechanism TBD during implementation)

## What's NOT Included
- Search
- RSS feed
- Comments
- Analytics
- CMS
- Video content
- Newsletter signup
