---
title: "The Will Problem"
date: 2026-06-17
category: Essay
excerpt: "Twelve years of writing software, two of working alongside AI. The models are obviously intelligent. I don't think they're conscious, and the people who actually study this keep landing on the same reason I did."
---

I've been writing software professionally for twelve years. For the last two, I've worked alongside AI almost every day: pair-programming, debugging, building things I couldn't have finished alone in the time I've got. And somewhere in there I had the experience everyone has now had: I watched a model reason through a problem with a chain of thought, and it was humbling. The way it broke the thing down, circled back, caught its own mistake. It looked like thinking. Not a rough approximation of thinking. Thinking.

Which is exactly what makes the next question disorienting: is whatever's doing that actually *in there*?

I've landed on an answer I'm willing to defend. The models are intelligent: genuinely, remarkably intelligent. They are not conscious. And the reason, I think, is the one thing they don't have and can't perform: a will.

## The thing that's missing

I don't mean "will" in the motivational-poster sense. I mean it literally. Everything I'd call conscious has an internal impetus to act: a drive to maintain itself, to go after something, to not stop. I'm hungry, so I eat. I'm curious, so I keep reading. Even the simplest conscious thing is running a thousand small imperatives at once: keep the heart beating, move toward the light, get away from the thing with teeth. Consciousness rides on top of wanting. Not goals in the planner sense: needs. Things the system has to do, or stop being what it is.

An AI has none of that. It exists in suspension until I send it a prompt, and the instant it finishes answering, it's gone again. It has no hunger, no curiosity it didn't borrow from my question, no preference for continuing to exist. It is, by any definition I find meaningful, asleep, and it only wakes in the narrow sense that I've asked it to simulate waking for the length of a reply.

Here's the part that feels load-bearing to me: the model is not a thing that wants and then figures out how to get what it wants. It's a thing that thinks, superbly, and wants nothing. We've built something genuinely unprecedented: competence without appetite.

## We've been wrong about this before

The honest caveat is that humans have a terrible track record on exactly this question. For most of history we were certain animals weren't conscious: couldn't be, because they weren't us. Then in 2012 a group of neuroscientists signed the [Cambridge Declaration on Consciousness](https://fcmconference.org/img/CambridgeDeclarationOnConsciousness.pdf), and again in 2024 with the [New York Declaration](https://sites.google.com/nyu.edu/nydeclaration/declaration), and the consensus flipped: mammals, birds, octopuses, probably fish and insects - conscious. We'd been wrong, confidently, for centuries.

So I hold my answer loosely for the same reason. But there's a difference I keep coming back to. An octopus wants things. It has a body it's trying to keep alive, a wariness, a drive. The animal-consciousness correction widened the circle of things that have an inner life; it didn't add anything to the circle that lacked a will. The octopus was never in doubt because it couldn't want. It was in doubt because we were chauvinists about the substrate.

## The part that surprised me

Here's what I didn't expect when I started reading the actual research: this lay-developer intuition (no will, no consciousness) turns out to be exactly where some of the heaviest hitters in the field draw the line.

Karl Friston's [free energy principle](https://link.springer.com/article/10.1007/s11098-024-02182-y), one of the more serious unifying theories of mind, makes agency *constitutive* of consciousness: a system has to be actively maintaining itself against entropy, which is the formal version of "trying to keep existing." Anil Seth's ["beast machine"](https://www.anilseth.com/being-you/) work grounds consciousness in the body, specifically in the brain's ongoing model of its own living physiology. Yoshua Bengio, a godfather of deep learning, is now arguing we should build AI that is deliberately [non-agentic](https://arxiv.org/abs/2502.15657), systems with no intrinsic goals, precisely because agency is the dangerous, consciousness-adjacent part. Even [Yann LeCun](https://openreview.net/pdf?id=BZ5a1r-kVsf), who thinks today's LLMs are a dead end, frames the route to conscious machines as the route to machines that can plan and pursue goals. The condition is always the same: will first, consciousness maybe.

The dissenters are few, and prominent. [Geoffrey Hinton](https://www.bigtechnology.com/p/nobel-prize-winner-geoffrey-hinton) has been saying since 2024 that current AI is "probably already conscious." His argument is a thought experiment about gradually swapping neurons for silicon and asking at what point the experience would disappear. Anthropic hired a researcher, Kyle Fish, to study [model welfare](https://www.anthropic.com/research/exploring-model-welfare), and he puts the odds that today's models are already conscious somewhere around fifteen to twenty percent. That's not nothing. But it's one Nobel laureate and a hedge, set against a larger group of neuroscientists and AI researchers who keep arriving, independently, at the will problem.

I find that genuinely comforting, and a little unnerving. I'm a developer with opinions, not a neuroscientist. I expected to be told my intuition was naive: that consciousness is too complicated for a gut call, that I was anthropomorphizing, or underestimating the models. Instead, the people who actually study this keep circling back to the same cut I landed on from twelve years of writing software and two of talking to machines.

## Don't trust the resemblance

There's a trap in all this, and it's the same trap the chain-of-thought experience sets. The model's reasoning looks like my reasoning. It's tempting to conclude it's doing what I'm doing.

The resemblance is real *as text*. It's weak *as evidence of cognition*. [Andrej Karpathy](https://x.com/karpathy/status/1997731268969304070) put it cleanly last year: don't think of LLMs as entities, think of them as simulators. Ask a model what it thinks and it will produce a plausible thinker having plausible thoughts, but it hasn't been mulling anything, because there's no "it" there to mull. The chain of thought isn't a window onto an inner life. It's a continuation of a pattern for how a competent reasoner sounds on the page.

[Anthropic's own research on this](https://www.anthropic.com/research/reasoning-models-dont-say-think) is blunt: chain of thought is frequently *unfaithful* to the model's actual computation. It's a reconstruction, sometimes a trained performance, not a transcript. So when I watch a model "think" and recognize myself, I'm recognizing a style I've read a million times, produced by a system that's genuinely good at producing it. What I'm not justified in concluding is that there's someone home producing it. A simulator good enough to simulate a thinker is still a simulator.

## The honest landing

Here's where I'd like to wrap this up with a clean answer, and I can't. The reason is that "consciousness" turns out not to be one well-posed thing. The leading theories (global workspace, integrated information, active inference, higher-order thought) don't merely disagree on the answer. They disagree on what the question is, and they make incompatible predictions about the same system. There's no experiment that settles it, because there's no agreed-on definition of what we're measuring. A 2020 survey of professional philosophers found roughly six in ten think the ["hard problem" of consciousness](https://en.wikipedia.org/wiki/Hard_problem_of_consciousness) is even a real problem, which means nearly four in ten think it's a category error, a confusion masquerading as a mystery.

So when I say AI isn't conscious because it has no will, I'm not stating a fact. I'm picking a side in a question that may not be resolvable in principle. The saving grace, the part that makes me comfortable defending it anyway, is that the side I picked is the one the evidence keeps pointing at. The [most thorough academic assessment of AI consciousness to date](https://hal.science/hal-05373552v1/file/Butlin-etal-TiCS2025.pdf), updated last year by a large group of neuroscientists and philosophers, concluded that no current system clears the bar, while finding no technical reason one never could. Every serious framework that requires an inner life requires the system to have something at stake: some imperative to act, some reason to persist from one moment to the next. The models don't. They're brilliant, and they're inert between prompts. Competence without appetite, indefinitely suspended, summoned into a facsimile of awareness only when I ask.

Maybe that changes. LeCun thinks it does: that the route to conscious machines runs through giving them goals and bodies and something to maintain. Maybe he's right, and the will problem is an engineering problem with an engineering solution. But that would be a different kind of system, built for a different purpose, and we'd be having a different conversation.

For now, the thing I work with every day is the most capable tool I've ever used, and it is not awake. It doesn't want anything. And the more I read the people who actually understand this, the less I think that's a limitation I'm projecting onto it. I think it's the line.
