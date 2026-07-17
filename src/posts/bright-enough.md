---
title: "Bright Enough"
date: 2026-07-15
category: Essay
excerpt: "For two centuries, artificial light was the textbook case of efficiency exploding demand. Then, in rich countries, it quietly stopped. I think intelligence is on the other branch of that fork, and the difference between the branches is where a software career goes next."
---

When LED bulbs made light roughly ten times cheaper to run, something interesting failed to happen: rooms didn't get ten times brighter. Mine didn't, and neither did yours. We bought the same brightness for less money and stopped thinking about it. Economists who went looking for the rebound [measured it at about 6 percent in Europe](https://www.sciencedirect.com/science/article/abs/pii/S0301421514002638), a rounding error next to the efficiency gain, and lighting's share of electricity use has been falling for years.

That non-event has been stuck in my head all week, because it's the right frame for the question the whole industry is circling: what actually happens when intelligence gets cheap?

I ran into the Jevons paradox recently, and it says the non-event shouldn't have happened. In 1865, the economist [William Stanley Jevons](https://en.wikipedia.org/wiki/Jevons_paradox) noticed something backwards about coal: Watt's steam engine burned coal far more efficiently than the engines before it, and Britain's coal consumption went up, not down. Efficiency didn't shrink demand, it opened up uses that were uneconomical before, and the new uses swamped the savings.

People treat that as a law now, especially in AI, where every drop in token prices is supposed to mean an explosion in tokens consumed. And for two hundred years, artificial light was the law's best evidence, so that's where I went looking. For most of human history, light was something you rationed. The Yale economist William Nordhaus once [priced it across the whole arc](https://www.newyorker.com/magazine/2010/12/20/the-efficiency-dilemma): an ancient Babylonian had to work more than 41 hours for the light a 75-watt bulb gives you in an hour. Thirty-five hundred years later, in Jefferson's day, the same light cost about five hours of work. Then the price fell off a cliff: by 1992, an hour of that light cost less than half a second of work.

And consumption went exactly where Jevons said it would. In the [long-run UK data economists use for this](https://www.researchgate.net/publication/241752411_The_Long_Run_Demand_for_Lighting_Elasticities_and_Rebound_Effects_in_Different_Phases_of_Economic_Development), consumption per person rose by thousands of times. An evening of decent reading light went from a real expense to a non-decision. We lit streets, shop windows, stadiums, the outsides of buildings, for decoration. If Jevons is a law, light is its poster child.

Except the curve flattened. Somewhere in the last few decades, in rich countries, rooms got as bright as the people in them wanted, and the cheapest light in history couldn't push demand much further. Eyes have a ceiling. Evenings have hours. Light wasn't headed to infinity after all, it was filling a container, and the container had a size.

So I've stopped reading Jevons as a paradox or a law. It's a fork. Some resources explode when they get cheap. Some just saturate.

## The Ceiling

I'm not the only one poking at this fork. [Hank Green put out a video about the Jevons paradox](https://www.youtube.com/watch?v=a6sYYrLTOjQ). His saturation example is the water heater: cheap hot water exploded into daily showers and dishwashers, then parked at a fifty-gallon tank, because a body can only use so much hot water in a day. It's the same curve as the lightbulb, run faster. He follows the idea up the stack, toward energy grids and civilization. I want to follow it down, into what it does to one working developer, because the fork has a cleaner rule than it first looks.

My first theory for the rule was fungibility. Electricity converts into light, motion, heat, computation, so cheap electricity kept finding new work for a hundred years, while hot water converts into exactly one thing, a warmer version of whatever it touches. But when I talked this through with Claude (which is how I work through most half-formed ideas now), it pushed back: the sharper cut is whether the resource is an endpoint or an input. A lit room is terminal consumption. You see by it, and the chain ends there. Electricity is an input, and inputs get used to build things that create new demand for the input, including things you couldn't have priced when the input was expensive. Endpoints saturate. Inputs compound.

One honest caveat before I lean on this: saturated is a rich-country word. Most of the world is still on the steep part of the light curve and the hot water curve, and the growth left in them is other people getting these things at all, not my rooms getting brighter. The ceiling is real, but it's per person, not planetary.

## The Input of Inputs

So which side is intelligence on? The place to start is what it's been. For as long as software has been an industry, code has been expensive for one reason: intelligence was expensive. Good code needs a smart person, and smart people bill accordingly. Entire methodologies exist to ration that scarce input. That's the world I built a career in.

This is also the first time we've had intelligence decoupled from a will, which I've [written about before](/blog/the-will-problem), and the decoupling is what makes it purchasable at all. You're not hiring a person with an agenda, you're buying thinking by the watt.

What AI changes is the price, and my own invoices are the cleanest Jevons data I have. [The price of inference at a given capability level has been falling something like tenfold a year](https://epoch.ai/data-insights/llm-inference-price-trends), and the savings didn't show up as savings, they showed up as usage. Two years ago I asked a model careful, rationed questions. Now I run agent teams, spin up four adversarial reviewers to attack a single blog post, and burn tokens on experiments I would not have paid a human expert to touch, because at the old price that demand simply couldn't exist. Nothing about my appetite changed. The price crossed a line, and a whole category of demand that had been priced out walked in.

And I can't find the container. Light is bounded by eyes and hot water by the body, but I don't see what bounds the questions. Every answer opens two more. If I'm honest, even with unlimited access to something far smarter than me, I would just keep asking, because intelligence is the input to the rest of what I want: better code, better decisions, better questions. It's the input other inputs are made of. That's the exploding branch of the fork, not the bright-enough one.

## The Precedent

I've been leaning on an assumption this whole time, so let me say it out loud: I think intelligence is electricity, not as a metaphor but as a structural claim.

Electricity was the last input of inputs. It converts into light, motion, heat, computation, and that convertibility kept demand climbing for a hundred years: every new use invented more demand, and the people pricing the first light bulb couldn't have listed what the grid would eventually be asked to power. Economists have a term for technologies like this, general-purpose, and the canonical list is short: steam, electricity, the computer. Intelligence is applying for membership.

The endpoint test is what convinces me it belongs on the list. A lit room is something you want for itself, which is exactly why it saturates: once the room is bright enough, the want runs out. I can't think of anyone who wants intelligence for itself. You want it for what's on the other side of it, the code, the decision, the diagnosis, the next question. Even curiosity, the purest case I can come up with, is instrumental. An input's demand isn't bounded by satiation, it's bounded by what you want to build, and wants stack.

The honest objection is that electricity's own curve went flat in the rich world. [American electricity demand barely moved for more than a decade](https://www.eia.gov/todayinenergy/detail.php?id=65264). If inputs compound, the flattening needs an explanation, and mine is that saturation isn't what happened. Efficiency standards did exactly what they were built to do, and the cheapest energy really is the energy you don't use. A big share of America's industrial demand left the country with the factories, so it didn't vanish, it moved. And the flat era is ending: the same curve is [rising again now](https://www.eia.gov/todayinenergy/detail.php?id=65264), bent upward by AI itself, with [data center demand projected to double or triple by 2028](https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers). Intelligence demand is already showing up one level down, as electricity demand. That's what derived demand looks like, and it moves in steps: flat while one generation of uses saturates, then a new use arrives and the curve bends again.

So I don't think intelligence has a container the way light does. The limits live around the input instead of inside it: grid capacity, attention, the hours it takes to check the work. Which is where the scarce thing actually lives.

## The Blast Radius

The uncomfortable part is personal. Being the smart person is what I've sold for over a decade. If intelligence is heading down the electricity curve, the honest question is what stays scarce, because that's the thing a career gets rebuilt on.

The stock answers are judgment and taste, and I half believe them. I've watched models fumble decisions for a specific reason: without a want, some judgments have no ground to stand on. But when I pushed on this, the answer that stuck was about stakes. A model can simulate judgment surprisingly well when the goals are clear. What it can't do is live with the outcome. I can be fired. I can be embarrassed in front of people whose respect I want. I'm inside the blast radius of my own decisions, and that, more than raw wanting, is what makes human judgment worth paying for. Trust needs somewhere to land.

The concrete version happens at my job every week. My boss could get a frontier model to produce roughly as much code as I do. He doesn't, and the reason isn't quality, it's checking: he doesn't have the hours to verify a model's output, and we all know the models still get things wrong. So what he's actually buying from me has quietly changed. It used to be code. Now it's a guarantee: when I say a thing is done, it's done, whether an AI helped or not. Somewhere in the last two years I stopped being the generator and became the verification layer.

Elevators had human operators for decades after the technology worked alone, and then trust migrated to the machine and the job evaporated. Autopilot flies most of every commercial flight and we still require pilots, so that migration is maybe half done.

The pattern in both is that trust follows verifiability: it moves off the human the moment verification gets cheap and statistical. The twist for code is that automated tests are a big part of why AI took to programming so fast, but a test can only check what somebody decided to check. Verifying a nontrivial change still costs almost as much as writing it, because the correctness of code isn't in the code, it's in the ambiguous pile of human intent the code is supposed to serve. Formal tools can prove that code matches a spec, but they can't write the spec. The ambiguity doesn't disappear when generation gets cheap, it moves upstream, and it lands on whoever can turn messy intent into a precise, checkable statement of done.

That's the scarce thing. Not intelligence, and not even judgment exactly, but a person who can specify what done means and be answerable for the result.

## What Doesn't Saturate

So my answer to the fork: intelligence is an input, the most general-purpose input we've ever had, and Jevons is going to run on it harder than he ran on coal. I think the demand curve bends upward for decades, and the pressure lands on the one thing AI consumes that is still bounded, electricity.

Inside that curve, the career advice writes itself, at least for me. Selling raw intelligence means selling into a falling price. The durable position is the wrapper around the cheap input: knowing what's worth building, specifying what done means, and standing inside the blast radius when it ships.

The rooms hit bright enough a generation ago. Thinking has no ceiling.
