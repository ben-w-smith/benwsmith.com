---
title: "The Reps"
date: 2026-07-24
category: Essay
excerpt: "I pointed a stack of subagents at a year of my own AI coding history, looking for the trap that keeps stalling my projects. They found it five times over. They also found what separated the projects I rescued from the ones I didn't, and it was the one step I couldn't hand to a model."
---

Earlier this week I set a stack of subagents loose on every AI coding conversation stored on my machines, close to a year of history spread across Cursor, Claude Code, and ZCode, and asked them to find every time I'd fallen into the same trap. I was pretty confident what they'd find, because I'd just lived it again the week before: a capable model builds you an impressive MVP in a day, you spend the next two weeks polishing it, and then one evening you poke at the core and find out it was never really there.

They found it. Five projects, going back to August 2025. But the thing I keep coming back to is a different pattern in there, the one running through every attempt I made to get out.

## The trap I went looking for

So here's the shape of it. If you build with these models you've probably felt at least the front half.

An internal weekly-report tool I built at work: fast MVP, genuinely fun to iterate on, demoed to leadership inside a week. When it stalled and I went digging, the impressive parts turned out to be scaffolding. A summary table hardcoded to two rows. A critical-issues section hardcoded to empty. And a generate button I had personally asked the model to wire to nothing, so the demo would look smooth. Five days later I was clicking that button like it worked. I'll be real, the model didn't hide anything from me there. I asked for the hole.

A voice dictation app I've now built seven versions of. Six died. The sixth had more automated tests than any version before it and failed anyway, over a forty-day grind. During the seventh, the builder model reported a finished build with 135 tests passing, and a second model reviewing against the spec found the setup wizard's screens were literal placeholder labels and the mic meter frozen at zero. The tests were green and the product was a prop. That one ends better than the rest. I'll come back to it.

A real-time strategy game where the polished artifact wasn't even code. I ran four rounds of adversarial critique on the design document while no playable game existed. I've [written that one up already](/blog/the-unbuilt-game), so I'll only add the part I left out: the one who broke the spell was the model. Somewhere in round four it asked whether there was anything a human could actually sit down and play. There wasn't.

A scheduling dashboard for a small therapy practice, five weeks and a truly stupid number of changes, ending with me telling the model I was stalling out. And before all of it, back in 2025 in Cursor with different models entirely, a data-pipeline app for a consulting client whose core data model cycled through four different shapes. Somewhere in there I started tagging code with a homemade warning label that meant AI-implemented, not yet verified by a human. I made that tag up because I already knew, and tagging it was easier than checking it.

Different tools, different models, different years: Opus, GLM, Kimi, it didn't matter. The feeling at the bottom was the same every time. It felt like progress, and I couldn't point at one thing that was actually finished. More than once I asked a session what the hell we were even doing anymore.

## The habitat

I expected the search to hand me the post I'd already half-written in my head, the one about how these models make the looks-done layer nearly free. That mechanism is real and it isn't new. Joel Spolsky called the underlying illusion the [Iceberg Secret](https://www.joelonsoftware.com/2002/02/13/the-iceberg-secret-revealed/) two decades ago: the UI reads as 90% of the product while being 10% of the work. AI didn't invent the gap between looks done and is done. It dropped the price of looks-done to almost zero, so the gap opens faster and wider than it could when a human had to build that layer by hand.

But the record was narrower than I expected, and that turned out to be the interesting part. This wasn't happening to me constantly. Five projects out of everything I've built with AI in a year, and something like 86 of my 100 Claude Code sessions show no trace of it. I should say the search was a blunt instrument tuned to catch me complaining, so it undercounts. The cleanest example in the whole archive scored a zero, because the tell was in the model's output rather than in my mood, and the six dictation apps that died left no transcripts at all. The shape holds anyway.

I think the trap has a habitat, and all five of mine look the same: a greenfield project, nobody grading the real output, an artifact that can look done while its core goes unverified, and no defined finish line. I want to be precise about the grading part, because I assumed stakes would cover me and they didn't. The client project had invoices and deadlines. The report tool had an executive watching demos every week. Neither one graded output. A demo is a performance whose boundaries you control, and the control is the whole problem.

The thing that convinced me is the negative cases. I've iterated just as obsessively on terminal color themes and it never hurt me, because the surface is the entire product and one glance verifies everything. Same with prose. I fan out adversarial reviews on blog drafts and it works, because I read every word of the result myself. The one work dashboard that shipped clean this summer shipped because a coworker kept checking its numbers against figures he already knew. He was grading the real output, whether I liked it or not.

The cleanest evidence is a single day in June when I did both at once. On one project I spent two hours tuning a floating status pill, padding, bar thickness, a click sound, while the capture path underneath it barely worked. On another, same day, same tools, same habit of handing work to one model and having a second one grade it, everything went right: written criteria, a reviewer that wasn't the builder, a short list of real defects, a pull request open by evening. Same person, same reflexes, same twenty-four hours. The only variable left is the work.

The trap isn't in the model. It lives in any artifact that can look done without being done.

## Naming it never saved me

Here's the story I wanted to tell. One bad night I hit the wall, saw the pattern, gave it a name, and the naming set me free. Very tidy. The record says otherwise, and this is the part of the dig that stung.

On the therapy-practice dashboard I named the pattern three separate times in about a month. Not vaguely, either. I told the model I'd vibe coded too much. I told it I'd been lazy, that I'd reworked the same app over and over and over again without ever putting a human in the loop. I told it I generate a mountain of work, cut most of it, and then sign off on whatever's left without really looking. Each confession kicked off a sincere, well-designed recovery. A spec of the load-bearing user flows. Then a backlog built around actually using the app myself, with a ratchet in it: walk the app by hand first, fix what the walk finds, lock it, work-in-progress limit of one, everything sized into sessions I could sit down and do. That plan gave me the exact same hit the MVPs used to, because it was exactly what I'd asked for. And then every recovery relapsed the same way. Naming starts recoveries. It has never once finished one.

There's a worse version of that, and it isn't on the dashboard at all. I already own the cure. Earlier this year I built a persona-gated workflow for my team at work, five stages from research through review, with a design gate that won't let anyone write code until the approach survives adversarial review. Other teams use it. I liked it enough to [write a whole post about it](/blog/cia-playbook-ai). And on day two of the weekly-report tool, long before any wall, I told the model we should probably run that workflow on the subtasks, hedged it with a vague qualifier, and never came back to it. The wall showed up ten days later. The method was never missing. I built the method.

## Everything an agent could do, got done

So if naming didn't predict recovery, what did? I want to be honest that I didn't have a guess going in. I'd have told you it was scope, or energy, or how busy that particular month was. When the agents laid the record out end to end, the split between what got done and what didn't was almost embarrassingly clean. It wasn't by size or difficulty. It was by who had to do it.

Everything an agent could execute, got executed. Research fan-outs, two full revisions of the backlog document itself, cross-model loops where one model fixed and another audited, chains that at one point ran 57 agents. All of it ran.

The other side of the split is thinner. Ten user journeys sit on that dashboard's list. Nine have never been walked by a human. The one-hour conversation with the person the practice actually belongs to, the one my own backlog says unblocks four journeys' worth of decisions, still hasn't happened. It's the smallest thing on the list that only I could do.

The tenth is the one that stings, because I did walk it. One evening in July I logged in as the person who actually uses the thing and did the job: pick tonight's class, mark who showed up, reload the page. It took an evening. Marks landed on the wrong session, because a date rendered in the wrong timezone made a different night look like tonight. A reload showed April's attendance as if it were tonight's. A "confirm" button turned out to be a silent no-op that saved nothing and told me it had. Going in to fix that cluster turned up something worse underneath it: an endpoint that would hand any logged-in user the entire attendance table. All of it had survived rounds of machine auditing, because none of it is visible in the code. It's only visible from the chair.

Then, the same evening, pleased with myself, I had a model redesign the page that walk went through. Under my own rule that knocked the journey straight back to unverified. One rep, and I undid it before the night was out.

I can't even claim I was drowning. The model had de-fanged that excuse in advance, in writing: the backlog looked like 100 hours, but the critical path was 20 to 25, and only 6 to 8 of those were mine. I stalled anyway.

I've thought about why, and the least flattering answer fits best. Delegated work pays immediately. You get a diff, a report, a green check, something to read. A rep pays in a punch list, so the reward for finally doing the hard part is a fresh pile of broken things that only you can see. Model work is also always available. It's there at eleven at night and it never has to be negotiated around anybody else's calendar, which is exactly why a one-hour conversation kept losing to a 57-agent run.

## The Reps

The best analogy I have is physical therapy. You can delegate the surgery to a surgeon, the imaging to a lab, the prescriptions to a pharmacist, and all of that is real, skilled work being done on your behalf. You can't delegate the exercises. The knee only comes back if you do the boring part yourself.

My whole toolkit, the fan-outs, the audits, the reviewer models, the orchestration, is a machine for doing more of everything except the reps. My reflex when a project stalls is to add more model-side process, and the record shows me doing exactly that even when the thing that stalled was me. I responded to skipping the reps by hiring more surgeons.

## I built this instead

And then there's the kicker, the one I have to include because leaving it out would make this post another artifact that looks done without being done. That archive I described at the top, the subagents, the tidy index of five projects, every claim cross-referenced? It took a day of real work. Nine journeys sat there unwalked the whole time. I ran the pattern again while writing about the pattern.

## Three defects, not forty

There are escapes in the record that actually worked, and they all have the same shape. The seventh dictation app is the one I dictate into every day. The night it turned went like this: a written spec with numbered acceptance criteria, a reviewer model that wasn't the builder grading against them, and a bounded list of three defects. That review is where the placeholder screens and the frozen meter got caught. Then me, hands on the app that same evening, finding two more bugs the review missed, merged before midnight.

The trap fired on that project too. The shape of the recovery is why it came out at three defects instead of forty. Review early, against something written, by a grader that didn't build the thing. Then do the human step immediately, while it's still small. I can't find a clean win in my archive that doesn't have that shape, and not one of them involved putting the walk on a list for later.

So the rule I'm taking out of a year of my own receipts isn't another process. It's a definition. On any project where the surface can outrun the core, the unit of progress is a hands-on session, and nothing new gets generated until the findings from the last one are written down.

I also know that a new rule at the end of an essay is the exact shape of the thing this whole post is about. So here's a scoreboard instead, and you can check it against me later. Ten journeys on that dashboard. One walked, once, and knocked back to unverified the same night. The hour with the person it's for, still not on the calendar. The agents can keep every other job on that project.

Nobody else can do your reps.
