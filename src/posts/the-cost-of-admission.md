---
title: "The Profit Problem"
date: 2026-06-28
category: Essay
excerpt: "OpenAI spends about $1.69 for every dollar it brings in. Anthropic may post its first quarterly profit this year — if you exclude stock comp, and if you measure during the months SpaceX was discounting its compute. Everyone keeps asking whether the AI labs are profitable. I think that's the wrong question, and the fact that it's the wrong question is most of the story."
---

I've been paying for AI APIs almost every working day for two years. Claude for the hard stuff, GLM for everything else, GPT when something needs a third opinion. I've watched per-token prices fall roughly fourfold a year while the models quietly got smarter, and at some point I started doing what everyone does — wondering whether the companies on the other end of those tokens are actually making any money.

The honest answer is the most frustrating kind. It's yes, no, and it doesn't matter, depending entirely on which layer you measure. I think that's the whole story. Almost nobody is telling it that way.

## Three Kinds of Profitable

When Dario Amodei says Anthropic makes money on its API, he's not lying. When the skeptics say Anthropic is burning billions, they're not lying either. They're talking about different things, and the gap between them is where this entire industry lives.

The confusion comes from there being three layers of "profitable," and people — including, for a while, me — keep quietly switching between them. The first is gross margin on inference: the revenue from a token minus the cost of generating it. That's genuinely positive, often fifty to eighty percent. Selling tokens, by itself, makes money. This is what Amodei means.

The second layer is operating margin — minus the research, the talent, the stock comp, and the compute priced at what it actually costs. That's where it goes negative for almost everyone, and it's where Anthropic's much-celebrated "first quarterly operating profit" actually sits. The number was $559 million. It excluded stock-based comp. It landed during the months SpaceX was still ramping Colossus and discounting the fees. It might be a real inflection. It might also be the best quarter they'll ever photograph. I genuinely don't know, and I don't think anyone outside the company does either.

The third layer is the one nobody wants to talk about: net of the next training run. This is where every frontier lab is deeply, structurally underwater, and it's where Amodei himself lands when he stops doing press. His actual line, in a [long interview](https://dwarkesh.com/p/dario-amodei-2), was something close to: each model makes money, but the company loses money, because we're spending ten billion to train the next one. That's not a contradiction. It's the same machine described from two angles.

So when you ask "are the AI labs profitable," the question is malformed. At layer one, yes. At layer three, not one of them. The interesting question isn't which answer is right. It's why the entire industry is structured so that both can be true at once.

## Becoming Electricity

I think the framing everyone reaches for is not just pessimistic. It's wrong. The common read is that the labs are losing money and cynically rearranging their businesses to grab profit wherever they can — bundling subscriptions, hoarding compute, locking in workflows. A profit grab.

None of the moves here look chosen. They look forced. What the labs are doing isn't hunting profit. They're fleeing commoditization.

The model layer is dissolving underneath them. Open-weight models — DeepSeek, Qwen, Llama, GLM, the one I'm typing next to right now — sit within single digits of the frontier on real benchmarks at a tenth of the price, and the gap keeps closing. [Training compute gets four to five times cheaper every year](https://epoch.ai/trends). The thing they sell is becoming abundant, and abundant things don't hold margin. They become inputs.

There's a name for where this ends. When something becomes abundant and cheap and standardized, it stops being a product and becomes infrastructure. Electricity did it. Telephony did it — AT&T spent the better part of a century as the most important company in America and then became a pipe. Cloud did it. The labs can feel this happening to intelligence in real time, and every "strategy adjustment" you read about is an escape attempt from one specific fate: becoming electricity. A dumb pipe. Useful, everywhere, and worth almost nothing at the margin.

There's an old piece of software economics that names where the money goes from here, and Microsoft ran the playbook thirty years ago. Netscape was going to own the internet, so Microsoft bundled a free browser into Windows — commoditizing the layer on top to protect the one underneath that actually made money. Joel Spolsky later gave the pattern its name: *commoditize your complement*. You don't capture value in the thing that's becoming cheap. You capture it in the thing next to the cheap thing, which is now the scarce part. The labs are on the Netscape side of that equation. The profit is migrating — like water finding its level — to whatever stays scarce once intelligence isn't.

## The Escape Vectors

So the real question isn't whether a lab is profitable. It's whether it owns something that stays scarce when the model stops being scarce. Looked at through that lens, the labs' "strategies" stop looking like tactics and start looking like bets on different scarce complements.

Google bet down, on the physical layer. They design their own chips — TPUs — and analysts who've priced it put their per-token cost roughly forty to fifty percent below anyone running on Nvidia GPUs. That's not a model advantage. That's an input advantage. They pay themselves for the silicon everyone else pays Nvidia a premium for. It's probably the single reason Google Cloud can post seven billion in operating income a quarter while OpenAI loses money on more revenue.

Meta bet sideways. They don't need the model to be profitable because they never planned to sell it. Llama is a complement to the ads business — better models mean better ranking mean more time on site mean more ad revenue. Meta throws something like a hundred and thirty billion a year at compute and funds it out of forty billion in free cash flow from advertising. The model is a marketing expense. For Meta, whether it's profitable is a category error.

Cohere bet up. Aidan Gomez literally co-wrote the transformer paper, and his response to the arms race was to leave it — to stop competing on models and sell enterprise applications instead, at seventy percent gross margins. The highest-margin AI company I can find is the one that decided not to win on intelligence.

xAI made the strangest bet of all, and possibly the smartest. They built Colossus — half a million GPUs, the largest single AI site on earth — and then handed a chunk of it to Anthropic. Renting compute to your own competitor prints something like five or six billion a year. One analyst put it bluntly: the lease almost perfectly hedges xAI's losses. They stopped trying to win on the model and started being the landlord. Models lose money. The building wins.

The Chinese and European labs bet on something the Americans don't have access to: sovereign capital. DeepSeek ran for three years on a quant hedge fund's profits and just took its first outside money — seven and a half billion — because training the next model costs over five hundred million a run and even a hot hedge fund couldn't cover it anymore. Zhipu, the company whose model I'm using right now, did about a hundred million in revenue last year and lost six hundred and eighty. Mistral's CEO says out loud that profitability is elusive. None of them need to be profitable in the near term, because they're funded by states and strategic investors who aren't measuring quarters.

The pattern is total. There is not a single major lab whose next frontier model is paid for by model-API profit. Every one of them is funded by something else — chips, ads, an application layer, a building, a state. The model itself never covers the next model. That's not a phase. That's the structure.

## The Quiet Inversion

There's a piece of this that gets missed, I think because it's uncomfortable for the narrative. We talk about the labs — OpenAI, Anthropic, xAI — as the protagonists of this era, the companies racing to build the future. But the reality is that if you follow the money instead of the headlines, they're mostly being absorbed by the layer that actually captures it.

Who ends up holding the cash? Amazon, through AWS and its stake in Anthropic. Microsoft, through Azure and OpenAI. Google, through Cloud. And now SpaceX, leasing the world's biggest cluster back to the labs that compete with it. The labs are raising record rounds to pay record compute bills to the same handful of companies that funded the rounds. OpenAI and Anthropic are the protagonists of the story and the vassals of the economics.

This is the railroad pattern, and it's older than AI. In every infrastructure buildout, the people who own the scarce physical thing — the right of way, the wire, the chip, the megawatt — capture the durable money. The operators come and go. The labs know this, which is why they're all desperately trying to own compute or distribution or a workflow surface. They've read the same history. They're trying not to be the train operator in a world where the track is what's valuable.

## The Trap Goes All the Way Up

The thing I keep coming back to is the part I actually have firsthand evidence for. You'd think the obvious escape is the application layer — the workflow, the product, the thing that sits on top of the model and makes it reliable. Own the surface the user actually touches, and you've escaped the commodity. That's the whole logic behind Claude Code, behind Copilot, behind Cursor. Get above the model.

I don't think that layer holds either, and I know this because I live inside it. I run a development workflow I call Get Shit Done — spec, plan, build, verify, retro. It takes an unreliable model and turns it into a reliable system by wrapping it in process: a spec that grounds the context, a plan that externalizes the thinking, automated verification that catches the hallucinations before they ship, a retro that writes the lessons back into the rules. With it, one person ships three or four tickets in the time they used to ship one. It works. And it is, I think, exactly the layer every lab is now racing to own.

Here's the problem. It's not patented. It's barely even original. Cursor ships a version of it. Claude Code ships a version of it. I could write the whole thing down in a Markdown file and hand it to you, and you could run it tomorrow. The moment a workflow proves it makes models reliable, everybody copies it — because the copying is the cheap part. The ritual is just process. And the thing that makes a model reliable is, at the same time, the thing that makes it replaceable. Replaceable things commoditize. The scaffolding dissolves almost as fast as the model did.

So the escape doesn't work all the way up. The model commoditizes. The workflow on top of it commoditizes. The only things I can find that actually hold margin are the ones you can't copy — physical compute, power, chips, the stuff that has to be mined or fabbed — and locked-in distribution, the kind that comes from owning a social graph or a sovereign mandate. Everything above the silicon is a race to the bottom. The race is just getting faster.

## The Profit Problem

So back to the question everyone asks. Are the AI labs profitable?

At the margin, sure. As businesses, no. As bets on position in a winner-take-most endgame, that's the only frame that makes the numbers make sense — and it's the frame the capital markets are actually using, which is why the money keeps flowing despite the burn. Nobody funding these companies thinks they're buying a P&L. They're buying a seat, and paying the losses as the price of admission.

But the deeper point is that it was never going to be any other way. Intelligence is becoming a commodity, and commodities don't fund their own successors. The labs that survive won't be the ones with the best models. They'll be the ones who looked at the commoditization coming and bought something it can't dissolve — a chip, a power plant, a social graph, a flag. Everyone still selling tokens is running on someone else's capital and borrowed time.

The model was never the business. It was the cost of admission.
