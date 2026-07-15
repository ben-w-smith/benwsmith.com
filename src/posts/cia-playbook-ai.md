---
title: "The CIA's Analytical Playbook Works Better on AI Than on Analysts"
date: 2026-05-27
category: Technical
excerpt: "The CIA spent 70 years building structured techniques to fix broken human reasoning. They fix something different in AI, and they fix it more completely."
---

## The Translation

In 1978, a CIA analyst named Richards Heuer published a paper arguing that intelligence analysts were systematically overconfident in their conclusions. His fix was a structured technique called Analysis of Competing Hypotheses: a matrix that forces you to score evidence against every plausible explanation, then pick the hypothesis with the *least inconsistent evidence* rather than the one that feels most right.

The trick is the inversion. Most people look for evidence that supports their preferred answer. Heuer's matrix forces you to look for evidence that *disproves* each hypothesis, and the winner is the one nobody managed to shoot down. The CIA adopted it. NATO adopted it. It became doctrinal.

RAND later found that the IC never empirically validated its own structured techniques. The premortem efficacy claim traces to a single 1989 study. But the techniques survived because practitioners found them useful, not because the literature was airtight. I think that's actually the more interesting datapoint. The techniques stuck because they produced better output in practice, even when the academics couldn't prove why.

In 2026, I wrapped Heuer's technique (and four other IC frameworks) in a Claude Code command called `/deep-research`. It runs a five-phase pipeline: Key Assumptions Check, EEI Decomposition, Multi-Posture Collection, ACH Matrix, Kent-scale Synthesis. All five phases map directly to intelligence community doctrine. I deliberately targeted the CIA's analytical framework because I needed rigor from AI-generated research, not a ChatGPT summary with confidence it hasn't earned.

The thing I keep coming back to is: the output isn't incrementally better. It's meaningfully better. The kind of better where you can feel the difference without knowing the technique names.

**Get the skill:** The [deep-research command](/downloads/deep-research.md) described above. Drop it in `.claude/commands/` and invoke with `/deep-research <your question>`.

## The First Translation

The deep-research command was just the start. The bigger translation was pgSD, a persona-gated software development workflow I built for my team at work.

The short version: pgSD runs five gated stages (research, design, build, verify, review) with specialized personas checking the work at each gate. The design gate is a hard stop: no writing code until the approach survives adversarial review. The mapping is embarrassingly precise. The research stage is the intelligence estimate. The design stage is course-of-action development with wargaming. Verification is battle damage assessment. The review stage is the military's After-Action Review.

But the interesting piece isn't the stage structure. It's the delegation pattern.

## Commander's Intent

pgSD dispatches read-only AI subagents for gate reviews. A PM subagent, a Senior Engineer subagent, a QA subagent. The parent agent sends them the work artifact, they review independently, the parent merges their findings. Parallel review, fresh context, no cross-contamination.

The military solved this exact problem 70 years ago.

US Army mission command doctrine defines something called Commander's Intent. Three parts: **Purpose** (why we're doing this), **Key Tasks** (the 2-5 things that must happen), and **End State** (what success looks like). The doctrine exists so subordinates can *"act to achieve the commander's desired results without further orders, even when the operation does not unfold as planned."*

That's the agent-delegation problem, verbatim.

pgSD's spec stage already partially encodes this. Section 2 "Context & Intent" maps to Purpose. Section 6 "Success Criteria" maps to End State. But I think it's missing two load-bearing pieces:

1. **Key Tasks**: the spec describes the world but doesn't enumerate "the 2-5 things that must happen for success."
2. **Disciplined-initiative clause**: explicit authorization for what the agent can do when reality diverges from plan. "If X is blocked, prefer Y over Z. Do not do W without asking."

Without that clause, every surprise becomes either "stop and ask" or "guess and proceed." The model follows the literal instructions past the point where it should have adapted, because it has no re-anchoring point for when the plan breaks down.

## The Klein Inversion

Gary Klein spent decades studying how experienced humans make decisions under pressure. His Recognition-Primed Decision model, part of a field called Naturalistic Decision Making, showed that experts don't run through formal checklists. They pattern-match. A veteran firefighter sizes up a building and *knows* it's about to flash over. They don't deliberate through a decision tree. The expertise is baked in: transparent, compressed, accessed without conscious effort. And here's the part that matters: if you ask the firefighter why, they can produce a rationale. They might not have used it to decide, but they can articulate the reasoning after the fact.

The pattern matching is legible. The framework is a transparency tool that experts don't need, because they already know what they know.

So the AI isn't Klein's novice. It's something weirder: an entity with immense pattern-matching ability and zero metacognitive access. An LLM has seen more production incidents than any senior engineer alive. It has pattern-matched across millions of codebases, debug logs, and architecture discussions. The issue isn't that it can't pattern-match, it's that the pattern matching is invisible. You can't see which patterns it's drawing on, and more importantly, you can't see where the gaps are. A model will confidently pattern-match to the wrong answer and you have no way to tell that's what happened.

The structured technique doesn't give the AI something it lacks. It gives you a way to verify what it's doing.

This shows up everywhere in AI coding workflows. The deep-research skill forces the model through assumptions checking before it starts searching, not because the model can't form assumptions, but because you can't see which assumptions it's making. The verification-before-completion skill is an iron law: don't claim something works without running the proof command. The model will confidently tell you it works. The proof command catches the confident hallucination. The systematic-debugging skill enforces "no fixes without root cause" as a binding constraint. Left to its own, the model shotgun-fixes symptoms: plausible fixes that don't actually solve anything.

The CIA developed these frameworks because human analysts have cognitive biases. The techniques are bias correctors. But the AI doesn't have the same biases. It has a different problem: the pattern matching works, but you can't see the seams. The technique solves a different failure mode for the AI, and the solution turns out to be the same shape.

The AI doesn't need the framework to make good decisions. You need it to see the decisions it's already making. And that's why these 70-year-old techniques work better on AI than they ever did on the analysts they were built for, not because the AI lacks the patterns, but because the human can explain theirs.

Not every task needs a five-phase pipeline. But the ones that do need it, the AI needs it more than you do.
