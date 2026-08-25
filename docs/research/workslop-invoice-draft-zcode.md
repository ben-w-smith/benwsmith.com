---
title: "Workslop — The Unitemized Invoice"
date: 2026-08-24
category: Essay
excerpt: "Everyone complains about the workslop tax like they've seen the bill. Nobody has itemized it. Sending became free; consuming didn't. This post explores that cost — five line items, one war story, and forty years of precedent for how it resolves."
---

# Workslop — The Unitemized Invoice

"Workslop" made it into Harvard Business Review, which means the word has finished its journey from insider joke to business vocabulary. People use it the way they use "technical debt" — a term everyone in the room nods at like they've all seen the same invoice. Ask what the workslop tax actually costs, though, and you get vibes. Everyone means something slightly different. Everyone is sure it's real. Nobody can produce the bill.

I can't produce the bill either. But I can itemize my copy of it, because I pay it every day, and I've come to believe the itemization is the missing piece. The shorthand points at a real gap: over the last few years, sending became free. Consuming didn't. Every technology that widens that gap generates a cost somewhere, and the interesting question is never whether the cost exists — it's who pays it, in what currency, and whether it appears on anyone's books. This post explores that cost. Mine looks like five line items.

## The lived version

I was born in 1983. I grew up on the rhyme: sticks and stones will break my bones, but words will never hurt me. I've thought about that rhyme a lot lately, because words are finally doing something to me, and it isn't what the rhyme meant. Nothing anyone sends me is aimed at me. That's what makes it heavy.

Here is what my days look like. I am, for what it's worth, the last person entitled to complain about AI-generated text. I've worked with these tools since before the current era, I built the workflow that put agentic tooling in the hands of the engineers around me, I've written the voice profiles, I know the tells. I'm a strong adopter making a strong complaint.

Over the past few months, picking up a Jira ticket has started to require a small act of will. Not because the work is hard — the work is the same work. It's that before I touch the work, I know I'm going to have to audit the ticket, and I know how that audit goes. Somewhere between a strong guess and a certainty, the ticket was drafted by a model, and the person whose name is on it didn't read it closely. The nuance and the mistakes are in there, unmarked, wearing the same confident prose as the correct parts. My coworkers forward whole agent responses into Slack the same way — eight hundred words of machine output, pasted whole, offered as if the forwarding were the work.

I end days more drained than I did before the tools that promised to multiply my output. The drain has started to move from mental into physical territory. I don't fully understand the mechanism yet. What I understand is the line items.

## What the tax actually is

Five of them. The first two are reading costs — you pay them before any work happens. The last three are repair costs — you pay them after work exists that shouldn't. Between those two phases sits the question I now ask about every artifact that crosses my desk: **at which hop does a wrong guess stop being cheap to retract?**

**1. The full-read cost.** For all of written history, length and polish were expensive signals. A long message meant someone had spent time on it; fluent confidence meant someone had checked. Readers built shortcuts on top of that: skim the confident parts, slow down where the prose gets hedgy and uncertain. AI inverted both signals at once. A long, polished message is now the cheapest thing a person can send, and the wrong sentences arrive in exactly the same confident voice as the right ones. A human-written ticket that's wrong usually *sounds* wrong — "I think we probably want..." — and your eye catches it at a skim. A model-written ticket that's wrong sounds identical to one that's right. So you can't skim. Every line gets read at full attention, because the cue that told you where to look is gone. Reading with your shortcuts switched off, all day, is its own line item.

**2. The premise audit.** There's the work the ticket asks for, and there's the world the ticket assumes. Checking the work used to be the whole job of picking it up. Now, before the work, there's a second job nobody assigned: verifying the world. Does this API field exist? Is the contract the shape the ticket says it is? Tickets used to be wrong by omission — fuzzy about the how, honest about it — and developer judgment was tuned for that. See the fuzz, ask a question, fill it in. The new tickets are wrong by fabrication: precise about the how, in a domain the ticket's author never had standing in. Nothing about the old skill prepares you for a confident, specific, invented detail.

**3. The reconciliation cost.** When the ticket and reality disagree, someone has to figure out which one is real. That someone is never the person who generated the ticket. It's whoever picks it up. This is where the tax starts to feel less like reading and more like debt collection.

**4. The archaeology cost.** If a wrong premise survives contact with implementation, the questions stop being about code and start being about history and intent. Why do these two near-identical things exist? Which clients depend on each? What was this one *for*? No tool answers questions about intent, because intent lived in a person's head, briefly, and didn't get written down. This work costs days, not minutes.

**5. The alignment cost.** A bad premise doesn't just mislead you — it misleads everyone who consumed it, and retraction means re-communicating across the team until everyone is realigned. Pure coordination overhead. No new output exists at the end of it. The feature didn't get better; the team just got back to zero.

One more thing, because the itemization usually gets misread as "nobody verifies anything." Companies verify. Mine has QA, product management, code review — the verification stages exist and are staffed. But those stages were bought for a specific error profile: the honest fuzz of human-written requirements. QA verifies the feature against the ticket. Nobody was ever assigned to verify the ticket against reality. The new inputs fail in the seams the old verification was never designed to look at, and the tax is exactly the gap between the verification an organization has paid for and the verification its inputs now require. That gap doesn't appear on any dashboard, which is what makes it an unitemized invoice: it's real work, performed by whoever is equipped to notice, at no list price.

## One invoice, in full

Here's a single ticket's journey through all five line items. It's a real pattern; the details are blurred on purpose.

A product manager wants a card in the UI to show a piece of seller status. They ask their agent to draft the story. The agent has the design in context and not the codebase, so it does what models do: it derives the backend from what the frontend needs, and writes the story complete with a specified change to an API contract — a field the API needs to expose so the status can be rendered without client-side computation. The field already exists, under a different name. The ticket is precise, confident, and wrong about the one thing nobody asked it to specify. (Line item two, accrued before anyone touched the work.)

The story reviews fine — it reads well, and reading well was what review was checking for. It spawns half an epic of stories that all inherit the premise, because once "the API needs field X" appears in six stories, it stops being a guess and becomes the plan. A developer picks up the stories, runs them through their own agent, and code materializes. Everyone did their step. (Line item one, paid in bulk by every reader along the way, and the hop question getting answered in the worst direction: each story that inherits the premise raises the price of retracting it.)

The change ships. Now the contract has two properties doing nearly the same thing. The next feature built against it has to choose, and can't tell which is load-bearing, so someone — hi — spends a day or two in archaeology: which property came first, who depends on which, what was the second one even for, and how do we collapse them without breaking the consumers of both. Then comes the realignment: walking the team through what the contract actually is now, story by story, so the next epic doesn't inherit a new bad premise. (Line items three, four, five. The invoice, itemized.)

Two days of expert work, zero new output, nothing anyone did maliciously, and not one minute of it visible as a cost anywhere in the system.

## The cheap-send lineage

If this were just my company's problem, it would be a rant, not an essay. What convinced me it's a phase — a window, not a permanent condition — is that every communication technology has been here before. Whenever sending gets cheap faster than norms adjust, a tax appears, and then a norm arrives to close it. The history is deep enough that we can sort it. Four kinds of norm, and each one is functionally different.

**Compression norms: the sender pays to condense.** Email's reply-all era begat the TL;DR, the one-topic thread, the disciplined subject line. The deepest version is Amazon's. In 2004, Jeff Bezos banned PowerPoint from executive meetings and replaced it with the six-page narrative memo — read silently, together, at the start of every meeting. The ban regulates density, not volume: prose can't hide missing thinking the way bullets can, and smart people can't fake it. A great memo takes a week to write. The sender does the compression so the readers don't have to.

**Medium-restitution norms: reroute the message to whatever is cheapest for the reader.** Voicemail was nearly free to leave and expensive to consume — dial in, listen at speech pace, no skimming, no searching. The norm that won was not "leave better voicemails." It was *stop leaving voicemails*; send a text. Same family as "this should have been a doc, not a meeting." The function is matching the message to the medium that costs the reader least, even when it costs the sender more.

**Provenance norms: mark how the thing was made, so the reader can calibrate before reading.** "Sent from my iPhone" has shipped on every iPhone since 2007, and it was never really an apology for typos. It's a parser setting. Those five words tell you the message was tapped out on a glass keyboard by someone in a hurry: expect brevity, expect weird formatting, don't expect attachments, weigh errors as mechanical rather than intellectual. The reader's whole interpretation shifts before the first sentence — which is a lot of work for a footer, and the point exactly.

**Sender-verifies-first norms: do the reading before you're allowed to produce.** Usenet's netiquette — *lurk before you post*, *read the FAQ first* — existed because producing a question was cheap and communities refused to keep paying the cost of answers that already existed. Stack Overflow hardened it into gates: What have you tried? Show your work. Closed as duplicate. The burden moves to before the send, and the sender has to demonstrate they've already done the consumption they were about to offload.

Here's the part of the history that matters most, and it's a failure. In 2009, General Stanley McChrystal was shown a PowerPoint diagram of American strategy in Afghanistan so dense — the famous spaghetti slide — that he joked, "When we understand that slide, we'll have won the war." General H.R. McMaster, in the same era, called PowerPoint "dangerous because it can create the illusion of understanding and the illusion of control," and here's the detail I find instructive: McMaster *banned* it outright when he led the counterinsurgency effort in Tal Afar in 2005. A general. A ban. Inside the institution that suffered most from the format. And the norm still didn't spread — the Pentagon is making spaghetti slides to this day. Amazon's ban stuck because it came from the top of a company famous for concentrated authority, and because memos made the senders better. That's the pattern: **norms that the beneficiary has to enforce spread slowly and badly; norms that let the sender signal competence spread on their own.** TL;DR is the clean proof. It started as a reader's insult — *too long; didn't read* — a dismissal you'd hurl at a wall of text. Then, over the late 2000s, it flipped: authors began putting their own TL;DR at the bottom of long posts, voluntarily, because a post with a summary got read instead of mocked. Readers didn't win that norm. Senders adopted it.

Run the taxonomy forward and you notice something almost comforting: we don't need to invent AI etiquette. The repertoire exists, with forty years of precedent per move. Summarize-before-forward is a compression norm — your three sentences in the message, the transcript behind a link. That's a TL;DR. Marking the seams on an AI-drafted ticket — *verified* versus *assumed, engineering to confirm* — is a provenance norm, a "Sent from my iPhone" for machine-drafted work. Routing raw agent output somewhere other than the top of my inbox is medium restitution. And "confirm the contract exists before the ticket ships" is sender-verifies-first, the FAQ rule wearing different clothes. The genuinely open question is not whether norms arrive. It's which of the four the culture settles on. The history says it won't be the one that protects readers. It'll be the one that makes senders look good.

## The landing

So: a window, not a condition. Cheap-send windows have opened before — email, slides, voicemail, forums — and they close in years, not decades, closed by norms that are social, short, and etiquette-grade rather than policy-grade. We are early in this one.

And the close I can see coming will be maddening for people like me. The norm that wins, by every precedent available, is the one that lets the sender signal competence: the three-sentence summary with the link, the seams marked, the premises confirmed before shipping. Which means the people who most need relief — the readers already paying the tax, doing the archaeology, holding the unitemized invoice — will watch the resolution arrive as a new expectation on *them*, too. The competence that made you the tax collector is about to become the standard for sending anything at all. I find that frustrating. I want to say so plainly, because I don't think I'm the only one.

But I'll close with the belief I actually hold, offered as belief: if you execute well on the sender side — if your summaries are honest, your seams marked, your premises checked — that will be rewarded in this era. The signal is rare right now, and rarity is what a signal is for. The engineers I trust most are already identifiable this way, a paragraph into a message. That paragraph costs them something every time. It's also, increasingly, the whole reputation.

The invoice gets itemized either way. I'd rather be the one itemizing.
