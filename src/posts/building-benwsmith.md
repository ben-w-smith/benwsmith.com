---
title: "The Signal — Craft in the Age of Slop"
date: 2026-04-26
category: Technical
excerpt: "Websites are easy to make now. That's the problem."
---

## The Problem with Easy

Websites are easy to make now. Really easy. Describe what you want to an AI, wait thirty seconds, and you've got something that looks professional enough. Clean layout, responsive, maybe even a dark mode toggle. Ship it.

Something happened with Bootstrap around 2014 that I think is about to happen again. Every second website looked the same — same grid, same hero unit, same blue buttons. Bootstrap wasn't bad. It was excellent, which was exactly the problem. When everyone uses the same excellent tool, the tool becomes a signal. And the signal wasn't quality. It was the absence of investment.

I think AI-generated sites are heading there fast. The telltales are already visible if you look for them: certain layout patterns, certain ways of filling space, certain stock photo choices that look designed without having been designed. A clean but generic site won't read as professional much longer. It'll read as unmarked. A null signal.

So I started thinking about what actually separates a site that signals investment from one that doesn't.

## The Leisure Thesis

The thing I kept coming back to is effort — specifically, why effort is visible in some products and invisible in others. I think it comes down to skill level. If you take me and a junior developer and tell us both to build a responsive personal site, the junior is going to spend most of their time on the basics. Getting the layout right. Making it not break on mobile. Figuring out why the footer is overlapping the content. I've done all of that hundreds of times, so it takes me a fraction of the time.

That speed difference is where the signal comes from. I have what you might call "leisure time" at the craft level — time that isn't consumed by fundamentals, time I can spend on things that are, strictly speaking, unnecessary. Small animations. Custom easing curves. A cellular automaton running behind the hero text.

The superfluousness is the entire point. It's the peacock's tail — expensive to grow, serves no survival purpose, and that's exactly why it works as a signal. If I can afford to spend time on things that don't affect functionality, it means the fundamentals came easy.

## Clean. Precise. Alive.

So the question became: what should that signal actually feel like? I settled on three words. Clean. Precise. Alive.

Not flashy. Not loud. Not demanding attention. Clean at first glance, rewarding if you pay attention, and subtly in motion even when nothing is happening. The craft whispers. It doesn't shout. Animations register subconsciously as "that's cool" and then get out of the way. Nothing competes for your attention because nothing needs to.

That philosophy became the rule set for every decision I made. And I think working within a narrow set of rules like that is its own signal — maybe the strongest one. It says I didn't reach for the next shiny thing. I decided what the site should feel like and I stuck with it.

## What Specificity Signals

I don't think craft is about having more features. I think it's about making narrow decisions and committing to them. And the reason those decisions matter is that they're visible — not as individual choices, but as a kind of coherence that you feel when you use the site.

Take the font. One font, three sizes, consistent weights. That reads as discipline. A site with six fonts reads as "I opened the font picker and couldn't decide." The impact isn't the font itself. It's the fact that someone made a call and stuck with it.

The color palette works the same way. Off-white background, near-black text, system blue for interactive elements. Nothing screams. The impact is that the site feels considered — like every color is there because it belongs, not because it was available.

But the thing I find really interesting is where specificity crosses over into the subconscious. The post cards don't move at a constant speed when you hover. They decelerate, like a physical object settling into place. I think your brain registers that difference even if you can't name it. You feel that someone thought about how it should move — not just that it should move.

Page transitions work the same way. Content slides in rather than flashing white. The page never blanks, never makes you wait without acknowledgment. You probably won't consciously notice any of this. But you'd absolutely feel the absence. And I think that's the strongest kind of signal — the stuff that registers below articulation.

## The Canvas Behind the Hero

The thing I spent the most time on is the thing nobody needs. The homepage has a Game of Life simulation running behind the hero text — blue cells fading in and out, barely visible until you move your mouse and seed new ones along your cursor path. Cells near your mouse shift from desaturated blue to vivid blue based on a heat system that decays each simulation step. A separate trail grid captures your brush strokes and fades over about 0.4 seconds. The whole thing renders at 30fps, simulation ticking at roughly six steps per second.

It serves zero functional purpose. And I think that's the whole point.

The hardest bug wasn't in the simulation. It was a CSS containment issue. The main element has a `fadeInSlide` animation that uses `transform`, which creates a new containing block and breaks `position: fixed` for anything inside it. The canvas had to live outside main, in a named slot positioned before the header in the DOM. I spent way too long figuring that out, but that's kind of the point too — the debugging is part of the investment.

## Working Within Constraints

The site is built with Astro, which appealed to me because it ships zero JavaScript by default. Pages are static HTML at build time. Blog posts are Markdown files. No CMS, no database. I write a file, commit it, and rsync the build output to a DigitalOcean droplet.

The design system is CSS custom properties — animation durations, easing curves, spacing scales, shadow levels, all defined in `:root` before I wrote a single animation. The animation system runs in three layers: micro-interactions for the small stuff like hover states, reusable effects for medium things like animated dividers, and ambient effects for scene-setting like the canvas. Each layer has a different purpose and a different build cadence.

Everything respects `prefers-reduced-motion`. If you'd rather not see animations, the canvas hides entirely and all motion stops. Light and dark theme follows system preference with a manual override. The reading experience always wins over visual flourish.

## The Signal

AI can generate a competent personal site in seconds. It'll be clean, well-structured, responsive. It'll also be interchangeable with every other AI-generated personal site on the internet.

The craft isn't in the features. It's in the decisions. The specific easing curve. The choice to use one font. The discipline to work within a narrow rule set instead of reaching for the next shiny thing. The cellular automaton behind the hero text that exists because it felt right to put it there.

Those decisions require taste, and taste requires caring about the result enough to be opinionated.
