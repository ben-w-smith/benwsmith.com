# Personal Site — Phase 1: Static Build

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, polished, static personal blog site with all pages, layout, typography, colors, and spacing — zero animation. Ready for DigitalOcean deployment.

**Architecture:** Astro static site with content collections for blog posts. Inter font throughout. Single-column typographic layout. Markdown files with YAML frontmatter for authoring. Global CSS with design tokens.

**Tech Stack:** Astro, Inter font (via Fontsource), CSS custom properties for design tokens, Markdown content collections

**Design spec:** `docs/superpowers/specs/2026-04-23-personal-site-design.md`

---

## File Structure

```
benwsmith.com/
├── astro.config.mjs              # Astro config: Inter font, static output
├── package.json
├── tsconfig.json
├── public/
│   └── favicon.svg               # Simple favicon
├── src/
│   ├── content.config.ts          # Blog collection schema (title, date, category, excerpt)
│   ├── styles/
│   │   └── global.css             # Design tokens, resets, typography, layout, component styles
│   ├── layouts/
│   │   └── BaseLayout.astro       # HTML shell: head, nav, slot, footer
│   ├── components/
│   │   ├── Header.astro           # Site name + nav links
│   │   ├── Footer.astro           # Social links
│   │   ├── PostCard.astro         # Single post item in the feed (pill, date, title, excerpt)
│   │   ├── CategoryPill.astro     # Colored category badge
│   │   └── BackLink.astro         # "← Back to Blog" link
│   └── pages/
│       ├── index.astro            # Homepage: hero + post feed
│       ├── blog/
│       │   └── [...slug].astro    # Individual post page
│       └── about.astro            # About page (placeholder content)
└── src/
    └── posts/                     # Markdown blog posts
        └── hello-world.md         # Sample post for development
```

---

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`

- [ ] **Step 1: Initialize the project**

Run:
```bash
cd /Users/bensmith/personal/benwsmith.com
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

If prompted about existing files, choose to overwrite.

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
```

- [ ] **Step 3: Configure astro.config.mjs**

Replace `astro.config.mjs` with:

```js
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://benwsmith.com",
  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
```

- [ ] **Step 4: Verify dev server starts**

Run:
```bash
npm run dev -- --host
```

Expected: Server starts on localhost:4321. Open in browser, confirm Astro default page loads. Kill the dev server.

- [ ] **Step 5: Initialize git and commit**

```bash
git init
cat > .gitignore << 'EOF'
node_modules/
dist/
.astro/
.superpowers/
EOF
git add .
git commit -m "init: Astro project with Inter font config"
```

Set remote:
```bash
git remote add origin git@github.com-benwsmith:ben-w-smith/benwsmith.com.git
```

---

### Task 2: Global Styles and Design Tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create the global stylesheet**

Create `src/styles/global.css` with all design tokens and base styles:

```css
/* Design Tokens */
:root {
  --font-inter: var(--font-inter, "Inter", system-ui, sans-serif);

  --color-bg: #FFFFFF;
  --color-bg-off: #F7F7F8;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666;
  --color-border: #E5E5E5;
  --color-accent: #007AFF;

  --color-technical: #007AFF;
  --color-technical-bg: #007AFF1A;
  --color-essay: #FF6B6B;
  --color-essay-bg: #FF6B6B1A;
  --color-project: #4ECDC4;
  --color-project-bg: #4ECDC41A;

  --font-size-label: 12px;
  --font-size-body: 15px;
  --font-size-title: 18px;
  --font-size-hero-title: 28px;
  --font-size-site-name: 48px;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.08);

  --max-width: 640px;
  --max-width-wide: 960px;
}

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-inter);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  line-height: 1.6;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

/* Layout */
.page-wrapper {
  max-width: var(--max-width-wide);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.content-wrapper {
  max-width: var(--max-width);
  margin: 0 auto;
}

/* Typography */
.text-label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.text-body {
  font-size: var(--font-size-body);
  line-height: 1.7;
  color: var(--color-text-primary);
}

/* Divider */
.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0;
}

/* Prose — Markdown body styles */
.prose {
  font-size: var(--font-size-body);
  line-height: 1.7;
  color: var(--color-text-primary);
}

.prose h1 {
  font-size: var(--font-size-hero-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
  margin-bottom: var(--spacing-lg);
}

.prose h2 {
  font-size: 22px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-md);
}

.prose h3 {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-sm);
}

.prose p {
  margin-bottom: var(--spacing-md);
}

.prose ul,
.prose ol {
  margin-bottom: var(--spacing-md);
  padding-left: var(--spacing-lg);
}

.prose li {
  margin-bottom: var(--spacing-xs);
}

.prose blockquote {
  border-left: 3px solid var(--color-border);
  padding-left: var(--spacing-md);
  color: var(--color-text-secondary);
  margin: var(--spacing-lg) 0;
  font-style: italic;
}

.prose code {
  font-family: "SF Mono", "Fira Code", monospace;
  font-size: 13px;
  background: var(--color-bg-off);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.prose pre {
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  overflow-x: auto;
  margin: var(--spacing-lg) 0;
  font-size: 13px;
  line-height: 1.6;
}

.prose pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}

.prose img {
  border-radius: var(--radius-md);
  margin: var(--spacing-lg) 0;
}

.prose a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-2xl) 0;
}
```

- [ ] **Step 2: Verify the CSS file is valid**

Run:
```bash
npx stylelint src/styles/global.css --allow-empty-input 2>/dev/null || echo "Stylelint not configured, skipping"
ls -la src/styles/global.css
```

Expected: File exists, no parse errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global styles with design tokens"
```

---

### Task 3: Content Collection Schema

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Define the blog collection schema**

Create `src/content.config.ts`:

```typescript
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(["Technical", "Essay", "Project"]),
    excerpt: z.string(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add blog content collection schema"
```

---

### Task 4: Base Layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create the base layout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
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
  </head>
  <body>
    <div class="page-wrapper">
      <Header />
      <main class="content-wrapper">
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add base layout with header/footer slots"
```

---

### Task 5: Header Component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Create the header**

Create `src/components/Header.astro`:

```astro
---
const currentPath = Astro.url.pathname;
const navLinks = [
  { href: "/", label: "Blog" },
  { href: "/about", label: "About" },
];
---

<header style="display:flex;align-items:center;justify-content:space-between;padding:var(--spacing-lg) 0;border-bottom:1px solid var(--color-border);margin-bottom:var(--spacing-xl)">
  <a href="/" style="font-size:15px;font-weight:600;color:var(--color-text-primary);text-decoration:none">Ben Smith</a>
  <nav style="display:flex;gap:var(--spacing-lg)">
    {navLinks.map((link) => (
      <a
        href={link.href}
        style={`font-size:13px;color:${currentPath === link.href ? "var(--color-text-primary)" : "var(--color-text-secondary)"};text-decoration:none`}
      >
        {link.label}
      </a>
    ))}
  </nav>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add header component with nav"
```

---

### Task 6: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create the footer**

Create `src/components/Footer.astro`:

```astro
---
const socialLinks = [
  { href: "https://github.com/ben-w-smith", label: "GitHub" },
  { href: "https://twitter.com/benwsmith", label: "Twitter" },
  { href: "mailto:hello@benwsmith.com", label: "Email" },
];
---

<footer style="padding:var(--spacing-2xl) 0;border-top:1px solid var(--color-border);margin-top:var(--spacing-2xl);display:flex;gap:var(--spacing-lg);justify-content:center">
  {socialLinks.map((link) => (
    <a
      href={link.href}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
      style="font-size:13px;color:var(--color-text-secondary);text-decoration:none"
    >
      {link.label}
    </a>
  ))}
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add footer component with social links"
```

---

### Task 7: Category Pill Component

**Files:**
- Create: `src/components/CategoryPill.astro`

- [ ] **Step 1: Create the category pill**

Create `src/components/CategoryPill.astro`:

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

<span style={`font-size:var(--font-size-label);font-weight:var(--font-weight-medium);color:${text};background:${bg};padding:2px 8px;border-radius:var(--radius-sm);display:inline-block`}>
  {category}
</span>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CategoryPill.astro
git commit -m "feat: add category pill component"
```

---

### Task 8: Post Card Component

**Files:**
- Create: `src/components/PostCard.astro`

- [ ] **Step 1: Create the post card**

Create `src/components/PostCard.astro`:

```astro
---
import CategoryPill from "./CategoryPill.astro";

interface Props {
  title: string;
  date: Date;
  category: "Technical" | "Essay" | "Project";
  excerpt: string;
  slug: string;
}

const { title, date, category, excerpt, slug } = Astro.props;

const formattedDate = date.toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
---

<a href={`/blog/${slug}`} style="text-decoration:none;display:block;padding:var(--spacing-lg) 0;border-bottom:1px solid var(--color-border)">
  <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-sm)">
    <CategoryPill category={category} />
    <span class="text-label">{formattedDate}</span>
  </div>
  <h3 style="font-size:var(--font-size-title);font-weight:var(--font-weight-semibold);color:var(--color-text-primary);margin:0 0:6px 0">{title}</h3>
  <p style="font-size:14px;line-height:1.6;color:var(--color-text-secondary);margin:6px 0 0 0">{excerpt}</p>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.astro
git commit -m "feat: add post card component"
```

---

### Task 9: Back Link Component

**Files:**
- Create: `src/components/BackLink.astro`

- [ ] **Step 1: Create the back link**

Create `src/components/BackLink.astro`:

```astro
---

---

<a href="/" style="font-size:13px;color:var(--color-accent);text-decoration:none;display:inline-block;margin-bottom:var(--spacing-lg)">
  &larr; Back to Blog
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BackLink.astro
git commit -m "feat: add back link component"
```

---

### Task 10: Favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Create a simple favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1a1a1a"/>
  <text x="16" y="23" font-family="system-ui" font-size="20" font-weight="600" fill="white" text-anchor="middle">B</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add public/favicon.svg
git commit -m "feat: add favicon"
```

---

### Task 11: Sample Blog Post

**Files:**
- Create: `src/posts/hello-world.md`

- [ ] **Step 1: Create a sample post**

Create `src/posts/hello-world.md`:

```markdown
---
title: "Hello World"
date: 2026-04-23
category: Technical
excerpt: "First post on the new site. Why I built this with Astro and what I'm planning to write about."
---

## Hello World

Welcome to my corner of the internet. I'm Ben — a software developer who's been writing code for 15 years. This is where I'll capture thoughts on software, technology, and whatever else seems worth writing about.

### Why Astro

After years of building applications in React, Next.js, and various other frameworks, I wanted something simple for a personal site. No hydration overhead, no client-side JavaScript fighting me. Just Markdown files and a build step.

Astro gives me exactly that. Zero JS by default, content collections with type-safe frontmatter, and a build output that's just static HTML. Fast, simple, and mine.

### What to Expect

I plan to write about:

- **Technical deep-dives** — things I've learned building software professionally
- **Essays** — reflections on the industry, craft, and whatever's on my mind
- **Projects** — open source work and side projects

Stay tuned.
```

- [ ] **Step 2: Create a second sample post for development**

Create `src/posts/fifteen-years.md`:

```markdown
---
title: "15 Years of Writing Software"
date: 2026-04-20
category: Essay
excerpt: "Reflections on how the industry has changed since I started writing code in 2011."
---

## The Long View

Fifteen years is a long time in software. When I started, we were deploying to physical servers and arguing about whether jQuery counted as a "framework." Now we have AI writing code and deploying to edge nodes I can't even locate on a map.

### What's Changed

The tools have gotten better. The abstractions have gotten higher. The deploy button has gotten bigger and more tempting. But the core of the work — thinking clearly about problems and building things people use — that hasn't changed at all.

### What Hasn't

Good software still comes from understanding the problem before reaching for a solution. The best code is still the code you don't write. And shipping something real still beats perfecting something imaginary.

Here's to the next fifteen.
```

- [ ] **Step 3: Commit**

```bash
git add src/posts/
git commit -m "feat: add sample blog posts"
```

---

### Task 12: Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the default homepage**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PostCard from "../components/PostCard.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog")).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);
---

<BaseLayout title="Blog">
  <section style="padding:var(--spacing-2xl) 0">
    <h1 style="font-size:var(--font-size-site-name);font-weight:var(--font-weight-bold);line-height:1.1;margin-bottom:var(--spacing-sm)">Ben Smith</h1>
    <p style="font-size:15px;color:var(--color-text-secondary);letter-spacing:0.02em">Software Developer · Writer</p>
  </section>

  <section>
    {posts.map((post) => (
      <PostCard
        title={post.data.title}
        date={post.data.date}
        category={post.data.category}
        excerpt={post.data.excerpt}
        slug={post.id}
      />
    ))}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify the homepage renders**

Run:
```bash
npm run dev -- --host
```

Expected: Homepage at localhost:4321 shows "Ben Smith" heading, tagline, and two sample posts with category pills, dates, titles, and excerpts. Posts are sorted newest-first. Typography is Inter. Colors match spec. Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add homepage with post feed"
```

---

### Task 13: Individual Post Page

**Files:**
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Create the dynamic post route**

Create `src/pages/blog/[...slug].astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import BackLink from "../../components/BackLink.astro";
import CategoryPill from "../../components/CategoryPill.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);

const formattedDate = post.data.date.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const readingTime = Math.ceil(
  (await render(post)).remarkPluginFrontmatter?.wordCount / 200
) || 5;
---

<BaseLayout title={post.data.title}>
  <BackLink />

  <article>
    <header style="margin-bottom:var(--spacing-xl)">
      <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-sm)">
        <CategoryPill category={post.data.category} />
        <span class="text-label">{formattedDate} &middot; {readingTime} min read</span>
      </div>
      <h1 style="font-size:var(--font-size-hero-title);font-weight:var(--font-weight-bold);color:var(--color-text-primary);line-height:1.3;margin:0">{post.data.title}</h1>
    </header>

    <div class="prose">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Verify post pages render**

Run:
```bash
npm run dev -- --host
```

Expected: Click a post from the homepage. Post page shows back link, category pill, date, reading time, title at 28px bold, body text with proper prose styling. Code blocks have white bg and thin border. Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add individual blog post pages"
```

---

### Task 14: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create the about page**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="About">
  <article class="prose">
    <h1>About</h1>
    <p>I'm Ben Smith — a software developer with 15 years of experience building web applications, developer tools, and the occasional side project.</p>
    <p>This site is where I capture thoughts on software, technology, and whatever else seems worth writing about. Built with Astro, deployed on DigitalOcean.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Verify about page renders**

Run:
```bash
npm run dev -- --host
```

Expected: Navigate to /about. Page shows heading and body text. Header nav highlights "About". Back navigation to homepage works. Kill the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
```

---

### Task 15: Visual Review and Polish

**Files:**
- Modify: `src/styles/global.css`, components as needed

- [ ] **Step 1: Full visual review**

Run:
```bash
npm run dev -- --host
```

Open browser and verify against the design spec:

- [ ] Typography: Inter loads correctly, all weights render (400, 500, 600, 700)
- [ ] Colors: Background white, text #1a1a1a, secondary #666, borders #E5E5E5
- [ ] Category pills: Technical is blue, Essay is red, Project is teal — each with tinted bg
- [ ] Spacing: Generous padding, content max-width ~640px, never feels crowded
- [ ] Homepage: Name large at top, tagline below, post feed sorted newest-first, thin dividers between posts
- [ ] Post page: Back link, metadata line, large title, prose body with code block styling
- [ ] Nav: "Blog" and "About" links, current page slightly darker
- [ ] Footer: Centered social links, subtle

Fix any visual discrepancies inline. Kill the dev server.

- [ ] **Step 2: Commit any polish changes**

```bash
git add -u
git commit -m "style: visual polish pass"
```

---

### Task 16: Production Build and Deploy Prep

**Files:**
- Modify: `package.json` (add deploy script placeholder)

- [ ] **Step 1: Run production build**

Run:
```bash
npm run build
```

Expected: Build completes without errors. Static output in `dist/` directory.

- [ ] **Step 2: Preview the production build**

Run:
```bash
npx astro preview --host
```

Expected: Site works identically to dev server. All pages load. All links work. Kill the preview server.

- [ ] **Step 3: Verify build output**

Run:
```bash
ls -la dist/
ls -la dist/blog/
```

Expected: `index.html`, `about/index.html`, `blog/hello-world/index.html`, `blog/fifteen-years/index.html` all present.

- [ ] **Step 4: Commit**

```bash
git add -u
git commit -m "chore: verify production build"
```

- [ ] **Step 5: Push to remote**

```bash
git push -u origin main
```

Note: If the GitHub repo doesn't exist yet, create it first:
```bash
GH_TOKEN="$(gh auth token --user ben-w-smith)" gh repo create ben-w-smith/benwsmith.com --private --source=. --remote=origin --push
```

---

## Post-Phase 1

After this plan is complete, the site will be fully built and deployed with zero animation. The next phases are separate implementation plans:

- **Phase 2:** 7 micro-animation passes (each its own plan/session)
- **Phase 3:** Signature moments — ambient canvas, reusable effects, hero templates (each its own plan/session)
