---
title: "Fifty Gallons"
date: 2026-07-15
category: Essay
excerpt: "We made heating water radically more efficient, and everyone's tank settled at about fifty gallons. We're making intelligence radically cheaper, and I don't think the demand curve looks anything like that. The difference between those two curves is where a software career goes next."
---

The water heater in my house holds fifty gallons. So does yours, probably, give or take ten. That number has been stable for decades, and there's no push for a bigger one, because at some point in the last century hot water quietly became a solved problem. I've been thinking about that tank all week, because I think it's the best available answer to the question the whole industry is circling right now: what actually happens when intelligence gets cheap?

I ran into the Jevons paradox recently. In 1865, an economist named [William Stanley Jevons](https://en.wikipedia.org/wiki/Jevons_paradox) noticed something backwards about coal: Watt's steam engine used coal far more efficiently than the engines before it, and Britain's coal consumption went up, not down. Efficiency didn't shrink demand, it opened up uses for steam power that were uneconomical before, and the new uses swamped the savings.

People treat that as a law now, especially in AI, where the pitch is that every drop in the price of a token means an explosion in tokens consumed. But the first thing I did with the idea was try to break it, because hot water is a counterexample sitting in my basement. We made heating water enormously more efficient over a century. Demand rose, found the shape of the modern house, and stopped.

So I've stopped reading Jevons as a paradox or a law. It's a fork. Some resources explode when they get cheap. Some just get comfortable.

## The Fifty-Gallon Ceiling

For most of history, hot water was expensive enough that people used it only when they had to: boiling for safety, washing clothes, cooking. A hot bath was a luxury you planned for. Then storage water heaters showed up around the turn of the last century, and the price of a hot gallon collapsed. Right on schedule, Jevons showed up too: daily showers became normal, dishwashers became normal, laundry went hot. Demand grew maybe tenfold.

And then it stopped. Tanks settled at forty or fifty gallons and stayed there, because a human can only use so much hot water in a day. The demand was real, but it was bounded by the size of a body and the hours in a morning.

My first theory for what separates hot water from coal was fungibility. Electricity is the cleanest example of the other branch: it converts into light, motion, heat, computation, so cheap electricity kept finding new work to do for a hundred years. Hot water converts into exactly one thing, a warmer version of whatever it touches. It isn't even tradable: the heat leaks out on the way to my neighbor's house.

I was talking this through with Claude, out loud, the way I work through most half-formed ideas now, and it pushed back on the framing. The sharper cut isn't fungibility, it's whether the resource is an endpoint or an input. A shower is terminal consumption: you take it, it's consumed, the chain ends there. Electricity is an input, and inputs get used to build things that create new demand for the input, including things you couldn't have priced when the input was expensive. Endpoints saturate. Inputs compound.

## The Input of Inputs

So which one is intelligence? Start with what it's been. For as long as software has been an industry, code has been expensive for one reason: intelligence was expensive. Good code needs a smart person, and smart people bill accordingly. Entire methodologies exist to ration that scarce input. That's the world I built a career in.

This is also the first time we've had intelligence decoupled from a will, which I've [written about before](/blog/the-will-problem), and the decoupling is what makes it purchasable at all. You're not hiring a person with an agenda, you're buying thinking by the gallon.

What AI changes is the price, and my own invoices are the cleanest Jevons data I have. [The price of inference at a given capability level has been falling something like tenfold a year](https://epoch.ai/data-insights/llm-inference-price-trends), and my usage didn't fall with it. It exploded. Two years ago I asked a model careful, rationed questions. Now I run agent teams, spin up four adversarial reviewers to attack a single blog post, and burn tokens on experiments I would not have paid a human expert to touch, because at the old price that demand simply couldn't exist. Nothing about my appetite changed. The price crossed a line, and a whole category of demand that had been priced out walked in.

And I can't find a saturation point. Hot water is bounded by the body, but I don't see what bounds the questions. Every answer opens two more. If I'm honest, even with unlimited access to something far smarter than me, I would just keep asking, because intelligence is the input to the rest of what I want: better code, better decisions, better questions. It's the input other inputs are made of. That's the exploding branch of the fork, not the fifty-gallon one.

## The Blast Radius

The uncomfortable part is personal. Being the smart person is what I've sold for over a decade. If intelligence is heading down the electricity curve, the honest question is what stays scarce, because that's the thing a career gets rebuilt on.

The stock answers are judgment and taste, and I half believe them. I've watched models fumble decisions for a specific reason: without a want, some judgments have no ground to stand on. But when I pushed on this, the answer that stuck was about stakes. A model can simulate judgment surprisingly well when the goals are clear. What it can't do is live with the outcome. I can be fired. I can be embarrassed in front of people whose respect I want. I'm inside the blast radius of my own decisions, and that, more than raw wanting, is what makes human judgment worth paying for. Trust needs somewhere to land.

The concrete version happens at my job every week. My boss could get a frontier model to produce roughly as much code as I do. He doesn't, and the reason isn't quality, it's checking: he doesn't have the hours to verify a model's output, and we all know the models still get things wrong. So what he's actually buying from me has quietly changed. It used to be code. Now it's a guarantee, that when I say a thing is done, it's done, whether an AI helped or not. Somewhere in the last two years I stopped being the generator and became the verification layer.

There's a name for how this ends, and I got there by way of elevators. Elevators had human operators for decades after the technology worked alone, and then trust migrated to the machine and the job evaporated. Autopilot flies most of every commercial flight and we still require pilots, so that migration is maybe half done. The pattern in both is that trust follows verifiability: it moves off the human the moment verification gets cheap and statistical. Code is nowhere near that. Verifying a nontrivial change costs almost as much as writing it, because the correctness of code isn't in the code, it's in the ambiguous pile of human intent the code is supposed to serve. Formal tools can prove that code matches a spec, but they can't write the spec. The ambiguity doesn't disappear when generation gets cheap, it moves upstream, and it lands on whoever can turn messy intent into a precise, checkable statement of done.

That's the scarce thing. Not intelligence, and not even judgment exactly, but a person who can specify what done means and be answerable for the result.

## What Doesn't Saturate

So my answer to the fork: intelligence is an input, the most general-purpose input we've ever had, and Jevons is going to run on it harder than he ran on coal. I think the demand curve bends upward for decades, and the pressure lands on the one thing AI consumes that is still an endpoint, electricity. That part is a story I'm still thinking through.

Inside that curve, the career advice writes itself, at least for me. Selling raw intelligence means selling into a falling price. The durable position is the wrapper around the cheap input: knowing what's worth building, specifying what done means, and standing inside the blast radius when it ships.

My tank topped out at fifty gallons because a body can only use so much hot water. I've looked hard for the equivalent limit on intelligence, and I can't find it. Demand for thinking doesn't stop.
