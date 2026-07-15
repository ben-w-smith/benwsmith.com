---
title: "The Cost of Admission"
date: 2026-07-08
category: Essay
excerpt: "OpenAI spends about $2.60 for every dollar it brings in. Anthropic told investors to expect its first profitable quarter, if you exclude stock comp and measure during the months SpaceX was discounting its compute. Everyone keeps asking whether the AI labs are profitable. I think that's the wrong question, and the fact that it's the wrong question is the whole story."
---

I've been paying for AI APIs almost every working day for two years. Claude for the hard stuff, GLM for everything else, GPT when something needs a third opinion. I've watched per-token prices collapse year over year while the models quietly got smarter, and at some point I started doing what everyone does, wondering whether the companies on the other end of those tokens are actually making any money. On paper the answer looks brutal: OpenAI spends about $2.60 for every dollar it brings in.

The honest answer is more frustrating than that. It's yes, no, and it doesn't matter, depending entirely on which layer you measure. I think that's the whole story. Almost nobody is telling it that way.

## Three Kinds of Profitable

When Dario Amodei says Anthropic makes money on its API, he's not lying. When the skeptics say Anthropic is burning billions, they're not lying either. They're talking about different things, and the gap between them is where this entire industry lives.

The confusion comes from there being three layers of "profitable," and people (including, for a while, me) keep quietly switching between them. The first is gross margin on inference: the revenue from a token minus the cost of generating it. That's genuinely positive, often fifty to eighty percent. Selling tokens, by itself, makes money. This is what Amodei means.

The second layer is operating margin: inference profit minus the research, the talent, the stock comp, and the compute priced at what it actually costs. That's where it goes negative for almost everyone, and it's where Anthropic's much-celebrated "first quarterly operating profit" actually sits. The number was $559 million. It's a projection Anthropic gave investors, not an audited result, because the company is private and nobody outside gets to check. It appears to exclude stock-based comp. And it landed during the months SpaceX was still ramping Colossus and discounting Anthropic's fees. It might be a real inflection. It might also be the best quarter they'll ever photograph. I genuinely don't know, and I don't think anyone outside the company does either.

The third layer is the one nobody wants to talk about: net of the next training run. This is where every frontier lab is deeply, structurally underwater, and it's where Amodei himself lands when he stops doing press. His actual math, in a [long interview](https://dwarkesh.com/p/dario-amodei-2), goes like this: a model that cost a billion to train brings in four billion and costs a billion to serve. That model, on its own, makes money. But the company is spending ten billion to train the next one, so the company loses money. The two claims describe the same machine from two angles.

So when you ask "are the AI labs profitable," the question is malformed. At layer one, yes. At layer three, not one of them. The interesting question is why the entire industry is structured so that both answers can be true at once.

## Becoming Electricity

I think the framing everyone reaches for is wrong, not just pessimistic. The common read is that the labs are losing money and cynically rearranging their businesses to grab profit wherever they can: bundling subscriptions, hoarding compute, locking in workflows. A profit grab.

None of the moves here look chosen, they look forced. The labs aren't hunting profit, they're fleeing commoditization.

The model layer is dissolving underneath them. Open-weight models like DeepSeek, Qwen, Llama, and GLM sit within single digits of the frontier on real benchmarks at a tenth of the price. The gap at the very top has actually stopped shrinking this year, but that's not where the pressure lives. The pressure is the floor: the "good enough" tier keeps rising, and the economics underneath it run on a pair of scissors. [The compute needed to train a frontier model grows four to five times a year](https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year), while [the price of inference at a given capability level falls something like tenfold a year](https://epoch.ai/data-insights/llm-inference-price-trends). The thing they sell gets cheaper every year. The thing they have to buy to stay in the game gets bigger every year. Abundant things don't hold margin, they become inputs.

There's a name for where this ends. When something becomes abundant and cheap and standardized, it stops being a product and becomes infrastructure. Electricity did it. Telephony did it: AT&T spent the better part of a century as the most important company in America and then became a pipe. So did cloud. The labs can feel this happening to intelligence in real time, and every "strategy adjustment" you read about is an escape attempt from one specific fate: becoming electricity. A dumb pipe. Useful, everywhere, and worth almost nothing at the margin.

Microsoft ran the escape playbook thirty years ago. Netscape was going to own the internet, so Microsoft bundled a free browser into Windows, commoditizing the layer on top to protect the one underneath that actually made money. Joel Spolsky later gave the pattern its name: *commoditize your complement*. You don't capture value in the thing that's becoming cheap, you capture it in the thing next to the cheap thing, which is now the scarce part. The labs are on the Netscape side of that equation. The profit is migrating to whatever stays scarce once intelligence isn't.

## The Escape Vectors

So the real question isn't whether a lab is profitable, it's whether it owns something that stays scarce when the model stops being scarce. Looked at through that lens, the labs' "strategies" stop looking like tactics and start looking like bets on different scarce complements.

Google bet down, on the physical layer. They design their own chips, the TPUs, and the analysts who've priced it put Google's cost per unit of compute roughly forty percent below anyone paying Nvidia's margin. That forty percent is an input advantage, not a model advantage. It's probably the single biggest reason Google Cloud can post $6.5 billion in operating income a quarter while OpenAI lost $21 billion on $13 billion of revenue last year.

Meta bet sideways. They don't need the model to be profitable because they never planned to sell it. Llama is a complement to the ads business: better models mean better ranking mean more time on site mean more ad revenue. Meta is throwing something like $135 billion at compute this year, funded by the $100-plus billion in operating cash flow the ad machine generates and, lately, by debt, because even Meta's free cash flow can't cover a number like that anymore. They don't seem to care. The model is a marketing expense. For Meta, whether it's profitable is a category error.

Cohere bet up. Aidan Gomez literally co-wrote the transformer paper, and his response to the arms race was to leave it: stop competing on models and sell enterprise applications instead, at seventy percent gross margins. The highest-margin AI company I can find is the one that decided not to win on intelligence.

The strangest bet, and possibly the smartest, is the one that started at xAI. They built Colossus: over half a million GPUs across the Memphis site, the largest concentration of AI compute on earth. Then in February SpaceX absorbed xAI whole, in the largest private merger ever, and three months later the combined company signed the deal that makes the whole structure legible. Anthropic leased the entirety of Colossus 1, over 200,000 GPUs, at $1.25 billion a month through 2029. That's $15 billion a year, paid by a direct competitor, more than double what the model side of the business lost last year. And the reason the building was available at all is the detail I can't stop thinking about: Grok's demand had fallen so far that the site was running at around eleven percent utilization. The model couldn't fill the building, so the building went to work for the competition. Models lose money. The building wins.

The Chinese and European labs bet on something the Americans don't have access to: patient, strategic capital. DeepSeek ran for three years on a quant hedge fund's profits and just took its first outside money, $7.4 billion, the largest AI round in China's history, because staying at the frontier has outgrown even a very good hedge fund. Zhipu, the company whose model I'm using right now, did about $100 million in revenue last year and lost $680 million. Mistral's CEO has said out loud that scaling doesn't guarantee profitability. None of them need to be profitable in the near term, because they're funded by states and strategic investors who aren't measuring quarters.

I can't find a single major lab whose next frontier model is paid for by model-API profit. Every one of them is funded by something else: chips, ads, an application layer, a building, a state. The model itself never covers the next model. That's the structure, not a phase.

## The Quiet Inversion

There's a piece of this that gets missed, I think because it's uncomfortable for the narrative. We talk about the labs (OpenAI, Anthropic, xAI) as the protagonists of this era, the companies racing to build the future. But if you follow the money instead of the headlines, they're mostly being absorbed by the layer that actually captures it.

Who ends up holding the cash? Amazon, through AWS and its stake in Anthropic. Microsoft, through Azure and OpenAI. Google, through Cloud. And now SpaceX, leasing the world's biggest cluster to a lab that competes with its own. The labs are raising record rounds to pay record compute bills to the same handful of companies that funded the rounds. The five biggest American infrastructure players will spend somewhere around $670 billion on data centers this year, nearly double last year and several times the revenue of every lab combined. OpenAI and Anthropic are the protagonists of the story and the vassals of the economics.

This is an old infrastructure pattern. In buildout after buildout, the durable money pooled around the scarce physical layer while the operators came and went. The labs have read that history, which is why they're all desperately trying to own compute or distribution or a workflow surface. Nobody wants to be the operator in a world where the track is what's valuable.

## The Trap Goes All the Way Up

The thing I keep coming back to is the part I actually have firsthand evidence for. You'd think the obvious escape is the application layer: the workflow, the product, the thing that sits on top of the model and makes it reliable. Own the surface the user actually touches, and you've escaped the commodity. That's the whole logic behind Claude Code, behind Copilot, behind Cursor. Get above the model.

I don't think that layer holds either, and I know this because I live inside it. I run a development workflow I call Get Shit Done: spec, plan, build, verify, retro. It takes an unreliable model and turns it into a reliable system by wrapping it in process: a spec that grounds the context, a plan that externalizes the thinking, automated verification that catches the hallucinations before they ship, a retro that writes the lessons back into the rules. With it, one person ships three or four tickets in the time they used to ship one. It works. And it is, I think, exactly the layer every lab is now racing to own.

The problem is that none of it is defensible. It isn't patented, and it's barely even original. Cursor ships a version of it. Claude Code ships a version of it. I could write the whole thing down in a Markdown file and hand it to you, and you could run it tomorrow. The moment a workflow proves it makes models reliable, everybody copies it, because the copying is the cheap part. The ritual is just process. And the thing that makes a model reliable is, at the same time, the thing that makes it replaceable. Replaceable things commoditize. The scaffolding dissolves almost as fast as the model did.

So the escape doesn't work all the way up. The model commoditizes, and so does the workflow on top of it. The only things I can find that actually hold margin are the ones you can't copy: physical compute, power, chips, the stuff that has to be mined or fabbed, and locked-in distribution, the kind that comes from owning a social graph or a sovereign mandate. Everything above the silicon is a race to the bottom.

## The Cost of Admission

So back to the question everyone asks. Are the AI labs profitable?

At the margin, sure. As businesses, no. As bets on position in a winner-take-most endgame? That's the only frame that makes the numbers make sense, and it's the frame the capital markets are actually using, which is why the money keeps flowing despite the burn. The people funding these companies aren't buying a P&L, they're buying a seat, and paying the losses to stay in the room.

But the deeper point is that it was never going to be any other way. Intelligence is becoming a commodity, and commodities don't fund their own successors. The labs that survive won't be the ones with the best models, they'll be the ones who saw the commoditization coming and bought something it can't dissolve: a chip, a power plant, a social graph, a flag. Everyone still selling tokens is running on someone else's capital.

The model was never the business. It was the cost of admission.
