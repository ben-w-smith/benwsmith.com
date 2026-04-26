---
title: "Building benwsmith.com"
date: 2026-04-26
category: Technical
excerpt: "Websites are easy to make now. That's the problem."
---

## The Problem with Easy

Websites are easy to make now. Really easy. Describe what you want to an AI, wait thirty seconds, and you've got something that looks professional enough. Clean layout, responsive, maybe even a dark mode toggle. Ship it.

Something happened with Bootstrap around 2014 that I think is about to happen again. Every second website looked the same — same grid, same hero unit, same blue buttons. Bootstrap wasn't bad. It was excellent, which was exactly the problem. When everyone uses the same excellent tool, the tool becomes a signal. And the signal wasn't quality. It was the absence of investment.

AI-generated sites are heading there fast. The telltales are already visible if you look for them: certain layout patterns, certain ways of filling space, certain stock photo choices that look designed without having been designed. A clean but generic site won't read as professional much longer. It'll read as unmarked. A null signal.

## Why I Rebuilt Mine

I'm a career developer. Fifteen years in. My personal site needed to convey that I actually care about craft, not just that I know how to prompt an AI. The question wasn't really about design. It was about what specific things signal real investment to someone visiting a website.

I started thinking about this in terms of effort, and I think there's a correlation that explains why certain design details work. If you take me and a junior developer, the junior has to spend significantly more time on the basics — getting the layout right, making it responsive, not breaking on mobile. I can do all of that quickly because I've done it hundreds of times. That speed gives me what you might call "leisure time" at the craft level. Time to add things that are, strictly speaking, unnecessary. Small animations. Custom easing curves. A cellular automaton running behind the hero text.

That superfluousness is the entire point. It's the signal. If I have the time and skill to "waste" on details that don't affect functionality, it means the fundamentals came easy. The flourish is the proof.

## Specificity Over Complexity

So what does that proof look like in practice? I don't think it's about complexity. I think it's about specificity — the willingness to make narrow decisions and stick with them.

The font is Inter throughout. One font, three sizes, consistent weights. A site with six fonts and twelve size variations reads as "I opened the font picker." A site with one font, carefully sized, reads as "I made decisions and stuck with them." The discipline is the signal.

The color palette is the same way. Off-white background, near-black text, system blue for anything interactive, thin gray dividers between posts. Category pills use colored text on transparent tinted backgrounds — blue for Technical, red for Essays, teal for Projects. The constraint isn't a limitation. It's a choice that says I thought about what belongs here and excluded everything that doesn't.

The post cards have a hover effect that doesn't move at a constant speed. They decelerate. The easing curve is a spring approximation — `cubic-bezier(0.16, 1, 0.3, 1)` — that feels physical instead of mechanical. Your brain registers the difference even if you can't name it. A linear transition says "a developer added an interaction." A spring transition says "a developer thought about how this should feel."

Page transitions use the View Transitions API. Content slides in rather than flashing white. A loading indicator runs during swaps. The page never blanks, never makes you wait without acknowledgment. You probably won't consciously notice any of this. But you'd absolutely notice if it were missing.

## The Canvas Behind the Hero

The thing I spent the most time on is the thing nobody needs. The homepage has a Game of Life simulation running behind the hero text — blue cells fading in and out, barely visible until you move your mouse and seed new ones along your cursor path. Cells near your mouse shift from desaturated blue to vivid blue based on a heat system that decays each simulation step. A separate trail grid captures your brush strokes and fades over about 0.4 seconds. The whole thing renders at 30fps, simulation ticking at roughly six steps per second.

It serves zero functional purpose. That's exactly why it works as a signal of craft. It says: the fundamentals were easy enough that I had time to build something that exists purely to make the site feel alive.

The hardest bug wasn't in the simulation. It was a CSS containment issue. The main element has a `fadeInSlide` animation that uses `transform`, which creates a new containing block and breaks `position: fixed` for anything inside it. The canvas had to live outside main, in a named slot positioned before the header in the DOM. I spent way too long figuring that out, but that's kind of the point too — the debugging is part of the investment.

## Working Within Constraints

The site is built with Astro, which appealed to me because it ships zero JavaScript by default. Pages are static HTML at build time. Blog posts are Markdown files. No CMS, no database. I write a file, commit it, and rsync the build output to a DigitalOcean droplet.

The design system is CSS custom properties — animation durations, easing curves, spacing scales, shadow levels, all defined in `:root` before I wrote a single animation. The animation system runs in three layers: micro-interactions for the small stuff like hover states, reusable effects for medium things like animated dividers, and ambient effects for scene-setting like the canvas. Each layer has a different purpose and a different build cadence.

Everything respects `prefers-reduced-motion`. If you'd rather not see animations, the canvas hides entirely and all motion stops. Light and dark theme follows system preference with a manual override. The reading experience always wins over visual flourish.

I think the constraint-based approach is what separates this from an AI-assembled site. An AI can pick from a palette of options. It can't decide that one font is enough and commit to it. It can't choose a specific easing curve because it knows how the deceleration should feel. Those decisions require taste, and taste requires caring about the result enough to be opinionated.

## The Signal

AI can generate a competent personal site in seconds. It'll be clean, well-structured, responsive. It'll also be interchangeable with every other AI-generated personal site on the internet.

The craft isn't in the features. It's in the decisions. The specific easing curve. The choice to use one font. The discipline to work within a narrow design methodology instead of reaching for the next shiny thing. The cellular automaton behind the hero text that exists because it felt right to put it there.

My hope is that, with every pixel on this site being a deliberate choice, the whole thing feels more coherent and enjoyable to use than something thrown together in a few prompts.
