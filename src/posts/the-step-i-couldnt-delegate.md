---
title: "The Step I Couldn't Delegate"
date: 2026-07-22
category: Essay
excerpt: "I went through a year of my own AI coding history looking for the trap that keeps stalling my projects. The trap is real. But every failed recovery died in the same place, and it wasn't where I thought."
---

Yesterday I did something a little crazy. I pointed a fleet of agents at every AI coding conversation stored on my machines, close to a year of history spread across Cursor, Claude Code, and ZCode, and asked them to find every time I'd fallen into the same trap. I was confident about what they'd find, because I'd just lived it again the week before: a capable model builds you an impressive MVP in a day, you spend the next two weeks polishing it, and then one evening you poke at the core and discover it was never really there.

The agents found it: five projects' worth, going back to August 2025. But the thing I keep turning over is a different pattern the record coughed up, the one running through every attempt I made to escape.

## The trap I went looking for

Let me describe the shape of it, because if you build with these models you've probably felt at least the front half.

An internal weekly-report tool I built at work: fast MVP, genuinely delightful to iterate on, demoed to leadership within a week. When it finally stalled and I went digging, the impressive parts turned out to be scaffolding. A summary table hardcoded to two rows, a critical-issues section hardcoded to empty, and a generate button I had personally asked the model to wire to nothing so a demo would look smooth, and then, five days later, was clicking as if it worked. I was polishing the paint on a car with no engine, and I was the one who'd asked for the engine to be left out.

A voice dictation app I've now built seven versions of. Six of them died. The sixth had more automated tests than any version before it and failed anyway, over a forty-day grind. During the seventh, the builder model reported a finished build with 135 tests passing, and a second model reviewing against the spec found that the setup wizard's screens were literal placeholder labels and the mic level meter was frozen at zero. The tests were green and the product was a prop. Hold onto that one, though, because it gets a better ending.

A real-time strategy game where the polished artifact wasn't even code. I ran four rounds of adversarial critique on the design document while no playable game existed at all. I've [written that one up already](/blog/the-unbuilt-game), and the sim that killed it was honest work, but the ratio stands: four polish passes on a document, zero on the question of whether a human could sit down and play.

A scheduling dashboard for a small therapy practice, five weeks of what I can only call an enormous volume of changes, ending with me telling the model I was stalling out. And before any of that, back in 2025, in Cursor, with different models entirely, a data-pipeline app for a consulting client whose core data model cycled through four different shapes. Somewhere in that era I started tagging code with a homemade warning label that meant AI-implemented, not yet verified by a human. I invented that tag because, I think, on some level I already knew what was in the boxes.

Different tools, different models, different years: Opus, GLM, Kimi, it did not matter. The feeling at the bottom was identical every time: progress had quietly turned into a sensation instead of a fact, and the sensation was grinding the same ground over and over. More than once I asked a session, in language I'll leave in the archive, what we were even doing anymore.

## Where it fires

I expected the search to hand me the post I'd already half-written in my head, the one about how these models make the looks-done layer nearly free. That mechanism is real, and it isn't new. Joel Spolsky called the underlying illusion the [Iceberg Secret](https://www.joelonsoftware.com/2002/02/13/the-iceberg-secret-revealed/) two decades ago: the UI reads as 90% of the product while being 10% of the work. AI didn't invent the gap between looks done and is done. It dropped the price of looks-done to almost zero, so the gap opens faster and wider than it ever could when a human had to build that layer by hand.

But the record turned out to be narrower and more interesting than the mechanism. This wasn't happening to me constantly. It was five projects out of everything I've built with AI in a year. Something like 86 of my 100 Claude Code sessions show no trace of it, and the Cursor era concentrates almost entirely in that one client project. I think the trap has a habitat, and the five instances agree on what it is: a greenfield project, nobody grading the real output, an artifact that can look done while its core goes unverified, and no defined finish line.

The negative cases are what convinced me. I have iterated just as obsessively on terminal color themes, and it never hurt me, because the surface is the entire product and one glance verifies everything. Same with prose: I fan out adversarial reviews on blog drafts, and it works, because I read every word of the result myself. The one work dashboard that shipped clean this summer shipped because a coworker kept checking its numbers against figures he already knew, an external grader operating on real output, whether I liked it or not. And the RTS proves the trap doesn't need a UI at all. A design document polishes up beautifully.

The trap isn't in the model. It lives in any artifact that can look done without being done.

## Naming it never saved me

Here's the story I wanted to tell: one bad night I finally hit the wall, saw the pattern clearly, gave it a name, and the naming set me free. Very tidy. The record says otherwise, and this is the part of the dig that actually stung.

On the therapy-practice dashboard I named the pattern three separate times in about a month. Not vaguely, either. I told the model I'd been vibe coding too much. I told it I'd been reworking the same app over and over without ever bringing a human into the loop. I told it I generate piles of work, thin them out, and then barely look at what survives. Each confession kicked off a sincere, well-designed recovery. A spec of the load-bearing user flows. Later, a full backlog built around actually using the app myself, with a ratchet in it: walk the app by hand first, fix what the walk finds, lock it, work-in-progress limit of one, everything sized into sessions I could do in an hour or two. I reacted to that plan with the same delight the MVPs used to give me, because it was exactly what I'd asked for. And then every recovery relapsed the same way. Naming starts recoveries. It has never once finished one.

## The Reps

So if naming didn't predict recovery, what did? When the agents laid the whole record out, the split between what got done and what didn't turned out to be almost embarrassingly clean. It wasn't by size or difficulty. It was by who had to do it.

Everything an agent could execute, got executed. Research fan-outs, two full revisions of the backlog document itself, cross-model loops where one model fixed and another audited, chains that at one point involved 57 agents. All of it ran. Meanwhile the handful of steps that required my hands never happened. The manual walk through the app as an actual user. The write-up of findings afterward, which the plan explicitly asked for. A single one-hour conversation with the person the dashboard was for, which the backlog said would unblock four workstreams' worth of decisions. That conversation was the smallest thing on the list that only I could do, and the only one with a perfect record of never happening.

I can't even claim I was drowning. The model had de-fanged that excuse in advance, in writing: the backlog looked like 100 hours, but the critical path was 20 to 25, and only 6 to 8 of those were mine. I stalled anyway. And on the day I finally touched real work, committed one genuine fix, my very next move was to hand the fixes the walk was supposed to gate to yet another model, without ever doing the walk. That broke the two most important rules of the plan within 48 hours of my first contact with the real work it prescribed.

The best analogy I have is physical therapy. You can delegate the surgery to a surgeon, the imaging to a lab, the prescriptions to a pharmacist, and all of that is real, skilled work being done on your behalf. The exercises you cannot delegate. Nobody else's reps rebuild your knee. And my read is that my entire toolkit, the fan-outs, the audits, the reviewer models, the orchestration, is a machine for doing more of everything except the reps. My reflex when a project stalls is to add more model-side process, and the record shows that reflex firing even when the problem being solved was me skipping the human step. I responded to skipping the reps by hiring more surgeons.

## The archive is the pattern

And then there's the kicker, the one I have to include because leaving it out would make this post another artifact that looks done without being done. That corpus I described at the top, the fleet of agents, the tidy index of five projects, the cross-referenced money quotes? It took a day of real effort. I built it instead of doing the walk. The dashboard has a committed fix from last week and a queue of machine-audited but never human-verified work sitting uncommitted behind it, and what I chose to do next was produce a beautifully organized archive about my avoidance. The pattern caught itself in the act. The only reason I get to laugh about it is that this time I noticed.

## The shape of the wins

The record does contain escapes that worked, and they all have the same shape. The seventh dictation app is the one I dictate into every day, and its good night went like this: a written spec with numbered acceptance criteria, a reviewer model that wasn't the builder grading against them, and a bounded list of three defects, which is where the placeholder screens and the frozen meter from earlier actually got caught. Then me, hands on the actual app that same evening, finding two more bugs the review missed and merging before midnight. The trap fired on that project too. The shape of the recovery is what made the reveal three defects instead of forty. Do the human step immediately, once, while it's small. I can't find a clean win in my archive that doesn't have that shape, and none of them involve a scheduled future obligation to go be a user someday.

So the rule I'm taking from a year of my own receipts is not another process but a definition. On any project where the surface can outrun the core, the unit of progress is a hands-on session, and nothing new gets generated until the findings from the last one are written down. I know how that sounds. It's nearly the ratchet I broke in July, and the difference is the part I got wrong the first time: the ratchet scheduled the walk as future work and let everything else keep counting as progress in the meantime. This version refuses to count anything else at all. The agents can keep every other job on the project, but this one's mine.

Nobody else can do your reps.
