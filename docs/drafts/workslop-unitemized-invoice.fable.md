---
title: "Workslop — The Unitemized Invoice"
date: 2026-08-24
category: Essay
excerpt: "The word gets used like the cost is settled fact. Sending became free, consuming didn't, and the difference lands on whoever does the reading. This is my attempt at the line items."
---

At some point in the past year, "workslop" stopped needing a definition. You can say it in a standup and the room nods. AI-generated work product that looks like a contribution, reads like one, and quietly hands its unfinished thinking to whoever receives it. The word caught on because it compressed a real experience into two syllables, and it now gets used like the cost is settled, a known tax with a known total.

But I can't find an itemization anywhere. The word works like the total line at the bottom of an invoice with no line items above it. We agree we're paying. Ask what the charges actually are, and you get a shrug and the word again. So the frame I'd offer is this: AI made sending nearly free, and it did nothing to the price of consuming. That difference doesn't vanish. It lands on whoever reads, and this post is my attempt to walk the charges, line by line.

## The Drain

I notice it most at the moment I pick up a ticket. There's a resistance now that wasn't there two years ago, a small pause before I open the description, because I don't know yet whether I'm about to read a colleague's thinking or a model's fluent guess at it. The tools around us promise ten times the output, and some weeks they feel close. And I still end more days than I'd like tired in a way that doesn't match anything I can point at, which is a hell of a trade for a productivity revolution.

The drain is what sent me looking for actual line items, because being tired from invisible work is a mood, and an itemization is something you can argue with. Hard days used to leave an artifact. Some of mine leave a browser history.

## The Line Items

A caveat before the list: the numbers in it are personal estimates from my own weeks, not measurements. The shape is the claim. And one question organizes the whole list, at which hop does a wrong guess stop being cheap to retract? A hop is any handoff, model to author, author to ticket, ticket to sprint, sprint to codebase. Hold that question, because each line item below is really the previous one, skipped, and left to compound for one more hop.

**The full read.** Human writing carries skim cues. The hedge, the visible "I think," the paragraph that goes vague where the author got tired, those tell you where to slow down and where you can safely skim. Model output ships without them. It reads uniformly confident whether it's right or invented, so the only safe read is a full read, every line at full attention. A correct artifact now costs the same to consume as a wrong one, because you can't tell which you're holding until you've finished. My guess is this alone roughly doubles my per-artifact reading cost, and it's the cheapest item on the bill.

**The premise audit.** A ticket used to arrive with its world pre-checked, because the human who wrote about an API had usually touched the API. Now the ticket's work and the ticket's world are separate questions. Does the field exist, is the contract real, did anyone actually call the endpoint. Checking the premise before doing the work is a new step, and at hop zero it costs about five minutes against the real system. The rest of this list is what happens when hop zero passes without it.

**The reconciliation.** When two artifacts disagree, the spec against the code, the ticket against the API docs, someone has to decide which one is real. The generator won't be the one doing it. The model that produced the conflict kept no memory of producing it and has no stake in resolving it, so reconciliation routes to whoever trips over the mismatch, usually mid-task, usually on a deadline of their own.

**The archaeology.** Past a certain hop, a wrong premise stops being a wrong sentence and becomes structure. Why do these two near-identical properties both exist, which came first, who depends on which, what breaks if one goes away. Those are history-and-intent questions, and git blame answers when, not why. This is the line item where, in my experience, the price jumps from minutes to days.

**The alignment.** The last item produces no artifact at all. Once a false premise has been read and believed across a team, retracting it is a communication project, the correction thread, the ticket edits, the person who was out that week and comes back still holding the old version of reality. It's pure coordination overhead, and there is zero new output at the end of it.

Read the list top to bottom and it's one process, the same unchecked guess traveling hop by hop, getting more expensive to retract at each stop. At hop zero it's a sentence edit, and four hops later it's a meeting series.

The objection I'd raise against my own list is that verification is already staffed, we have QA, PM acceptance, code review, the whole apparatus. We do, and I think that's exactly the trap. That machinery was designed against a human error profile: omission, honest fuzz, the missing edge case, the acceptance criterion that trails off into "TBD." AI inputs fail differently. They fail by confident fabrication in the seams, precise, plausible, formatted exactly like knowledge. The tax is the gap between the verification you staffed and the verification your inputs now require. Which is also why it pools where it does, on the people whose instincts cover premises and not just specs.

## Half an Epic

One story, told at the pattern level, because the people in it are real and the pattern is the point, not the people.

A ticket describes an integration against an API contract: field names, types, response shapes. It reads precise and complete, which under the old cues meant somebody had checked. That's the full read failing silently. The cue that used to trigger suspicion was visible fuzz, and there wasn't any, because somewhere upstream an agent had drafted the contract, and part of what it described didn't exist.

The premise audit at hop zero would have been the five-minute call. It didn't happen, and half an epic materialized on top of the invented shape, tickets, branches, working code, approved reviews. By the time the real API disagreed with the described one, the codebase held two near-identical properties, one for each version of reality, both live, both with consumers. Deciding which was real fell to whoever hit the mismatch first, mid-task. The reconciliation, arriving unscheduled.

Unwinding it took a day or two of archaeology, by my estimate. Which property came first, who reads which, what breaks on removal, questions the code can't answer about itself. Then the alignment tour, ticket edits, doc corrections, and a separate conversation with each person who had built a mental model on the invented contract.

The wrong fact cost five minutes to catch at hop zero. Caught where it actually was, it cost most of a week of attention spread across several people, and that figure is my estimate too. Same fact, same fix, different hop. The retraction price didn't grow with time, it grew with each reader who consumed the premise and built something on it.

## Forty Years of Precedent

This is where I'd usually reach for a fix, but I don't think we need to invent one. Sending has gotten suddenly cheap before, email did it to letters, reply-all did it to email, slide decks did it to written argument, and each time the correction arrived as etiquette, not as technology. As far as I can tell, the norms that worked sort into four functional categories, and each one maps directly onto the current mess.

Compression norms make the sender pay the cost of condensing. The TLDR is the famous one. Amazon's six-page memo is the industrial version, Bezos banned slide decks outright and forced narrative memos, and the genius of that rule is that it regulates density rather than volume, you can't hide an unchecked thought in a bullet point. The AI translation: summarize before you forward, in your own words, at your own risk.

Medium-restitution norms reroute the message to whatever medium is cheapest for the reader rather than the sender. Voicemail died of this, cheap to leave, expensive to retrieve, and text messaging won. "This should have been an email" is the same norm applied to meetings. The AI translation: your three sentences go in the message, the full transcript goes behind a link, and the reader picks their own depth.

Provenance norms mark how an artifact was made so the reader can set their parser before reading. "Sent from my iPhone" did real work, it meant expect brevity and don't read tone into the typos. The same family holds "forwarded as received" and "off the record." The AI translation: mark what's verified and what's assumed, which parts a human checked against the world and which parts a model supplied.

Sender-verifies-first norms make the sender do the consuming before producing. Usenet told newcomers to lurk before posting and read the FAQ first. Stack Overflow built "what have you tried" and duplicate closure into its mechanics. The AI translation: make the five-minute call before the ticket ships.

The taxonomy also holds an instructive failure. The military's slide problem was bad enough to make the front page of the New York Times in 2010. Gen. Mattis said "PowerPoint makes us stupid" on the record, McMaster banned it in his own command, and the institution kept running on slides anyway, because the people positioned to enforce the fix were the readers, and reader-enforced norms have to be policed indefinitely. The one large organization that actually killed slide culture was Amazon, and that took founder-level authority to force. The TLDR, meanwhile, needed no mandate from anybody. My read is it spread because a tight summary makes the sender look sharp. Norms the beneficiary must enforce crawl, and norms that let the sender signal competence spread on their own.

So the repertoire already exists, four categories deep, with roughly forty years of precedent behind it. The open question is which one this culture settles on.

## The Window

I don't think this is a permanent condition. The same window opened for email, for voicemail, for slides, a stretch of years where sending had gotten cheap and the etiquette hadn't caught up, and each time it closed once the norms hardened. My honest expectation is that the interesting question isn't whether norms arrive but which category wins. The precedent points one direction: the winner will be whichever norm lets the sender signal competence, because those are the only ones that spread without an enforcer.

I want to be plain about how that lands, because I'm one of the people it lands on. The ICs doing the full reads and the premise audits are paying the tax right now, and the eventual fix will show up not as recognition or a refund but as a status move for senders. The hours already spent stay spent. From the chair where I read these tickets, that is genuinely infuriating, and I'd rather say so in advance than pretend the etiquette is going to arrive as justice.

But the other half I'll state as belief, because that's what it is. I believe the people who build the sender-side competence now, who summarize before forwarding, mark what's assumed, and make the five-minute call before anything ships, are going to be disproportionately rewarded in this era. The tools made output cheap for every sender at once, which means output stopped being the signal. Whatever still costs something is the signal now. Reading still costs. Judgment still costs.

The new senior skill is vouching for what you send.
