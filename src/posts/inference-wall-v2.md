---
title: "The Inference Wall"
date: 2026-04-30
category: Essay
excerpt: "The world has a surprising amount of detail. LLMs handle it by narrating everything out loud. There's a reason that approach is hitting a ceiling."
---

John Salvatier wrote an essay in 2017 called "Reality Has a Surprising Amount of Detail." His argument is that the physical world is fractally complex — not in some abstract philosophical sense, but in the specific, hands-on way you only discover when you actually try to do the thing. He uses building basement stairs as the example. Stairs seem simple at a high level. Two long boards, some angle brackets, stair treads. But the moment you start cutting, you realize there's no obvious way to trace the correct angle. The lumber warps because it was cut when it was wet. The screws shift when you tighten them, so the bracket ends up slightly wrong even after you drew the line. Every step decomposes into sub-steps with material consequences.

The thing Salvatier is really getting at is what expertise looks like when it's fully developed. A master carpenter doesn't consciously work through all of that. They know how wood behaves under a screw, how to account for warp before committing to a cut, how to read whether a board is true just by sighting down it. None of that is sitting in their working memory as explicit propositions. It's baked in. The detail is transparent — they see right through it to the problem they're actually solving. They've run their hands across enough lumber that the material has a model in their head.

I think this is the cleanest frame I've found for describing what LLMs don't have.

If a model needs to track a variable constraint across a 2,000-line refactoring, or remember that a config file lives two directories deep in a non-obvious location, or hold the interdependencies between three modules while working through a bug — it has to say it out loud. There's no transparent, baked-in model of the codebase. There's no intuition about how this particular kind of code tends to behave. Every detail that matters has to be explicitly generated and kept alive in the context window.

For an LLM, generating tokens is cognitive processing. If it doesn't write it down, it isn't thinking about it.

## The Narration Problem

This is why the best coding models are verbose, and why that verbosity is a feature, not a bug.

In April, Anthropic published a post-mortem on an attempt to make Opus 4.7 less verbose. They added instructions to the system prompt to keep text between tool calls under 25 words. Coding performance dropped three percent. The model wasn't being chatty. It was thinking. Those long chains of intermediate reasoning — which look like unnecessary hedging if you're not paying attention — are the brute-force workaround for not having a compressed, transparent model of the codebase. Every token is a bid to keep the fiddly details alive long enough to use them. Cut the narration, and the details evaporate.

There's a second concern here too. A model that generates 10,000 tokens of reasoning before landing on an answer has a much larger surface area for accidentally producing the right output. It's sort of like tarot reading — not because the model is doing something mystical, but because a big enough spread of cards will contain something that maps to whatever you're looking for. I think there's a real question about whether benchmark scores on verbose models are measuring reasoning quality or surface area. The difference matters.

So the natural question: if models need verbosity to stay grounded in detail, why not just make them bigger? More parameters, more capacity to internalize those fiddly specifics, more room for the kind of transparent understanding an expert develops. For a while, that worked. The jump from GPT-3 to GPT-4 felt qualitatively different — there were whole categories of task that started working that hadn't worked before.

But 2026 has a different feel.

## The 2026 Signal

Opus 4.7 and GPT-5.5 are both out. I've used both. They're improvements, and the benchmarks support that. But I find it genuinely hard to articulate what they do better in my actual work. The felt improvement doesn't match the release energy. Honestly, if Opus 4.6 dropped to Sonnet pricing, I'd use it over 4.7 at Opus pricing without much hesitation. That's not a knock on the models. It's a signal about where we are.

You can see it in the benchmark data. SWE-bench Verified — the standard measure of coding ability — tells a clear story: rapid improvement through early 2025, then a flattening that no amount of additional compute has broken through.

<figure>
  <img src="/images/swe-bench-verified-trend.svg" alt="SWE-bench Verified scores for Claude, GPT, and GLM model families from mid-2024 through April 2026, showing a clear plateau in scores despite increasing model size" />
  <figcaption>SWE-bench Verified scores across three frontier model families, June 2024 – April 2026. GLM data points annotated with total parameter counts. <a href="https://www.swebench.com/">Source</a></figcaption>
</figure>

The thing about genuinely smarter models is you know when you've got one. GPT-4 was like that. Claude 3 Opus was like that. Something qualitative shifted — tasks that didn't work suddenly worked, reasoning that used to fall apart held together. The recent releases don't have that feel. They feel like refinements at the margin. And I think that's because we've run close to the ceiling on what raw parameter scaling can deliver, and the labs are starting to bump against a constraint that more training data and more compute don't fix.

## The Memory Wall

Here's the physics, because I think it explains the plateau more concretely than vague talk of "diminishing returns."

The bottleneck in LLM inference isn't raw compute. Modern GPUs are genuinely incredible at parallel math. The bottleneck is memory bandwidth.

Inference runs in two phases. The prefill phase reads your prompt — GPU compute utilization sits near 100%. Then comes decoding, where the model generates tokens one by one. And for every single new token, the transformer architecture has to scan the entire conversation history stored in memory as the Key-Value cache.

This is an O(n) memory read problem. Longer context means a larger KV cache means more data that has to physically move from VRAM to the processor on every single decoding step. Memory bandwidth — how fast that data transfer happens — grows far more slowly than raw compute power. During decoding, GPU utilization frequently drops below 10%. The cores sit idle, starved for data, because the VRAM literally can't push information fast enough.

Making the model larger makes this worse. A bigger model means a bigger KV cache, more memory traffic per token, slower inference for the same hardware. You can pile on parameters, but if the GPU spends 90% of its time waiting for data, those parameters are dead weight.

There's a second wall that shows up specifically in agentic workloads. When a model acts as an agent — pausing to run scripts, search codebases, call external APIs — recent analysis found that tool-dominated workflows spend up to 88% of total latency waiting on CPU-bound orchestration. The GPU sits idle while a sequential Python script runs on the host processor. The inference wall isn't one wall. It's two. And the shift toward agentic coding workflows, which is clearly where serious use is going, hits the second one hard.

So the brute-force approach — generate more tokens, explore more paths, throw more compute at the detail problem — runs directly into both walls. The economics don't hold. Marginal capability gains per additional compute dollar are flattening, and the cost of inference is already the primary constraint on how aggressively these systems get deployed.

## Under the Hood

The most interesting AI work in 2026 isn't coming from bigger models. It's coming from labs that decided to stop fighting the memory wall and start routing around it.

DeepSeek's [FlashMLA](https://github.com/deepseek-ai/FlashMLA) attacks the KV cache directly. Multi-head Latent Attention compresses key-value pairs into low-rank latent representations instead of storing the full cache per token. Memory footprint shrinks. Bandwidth requirement per decoding step drops. Their V3.2 model adds DeepSeek Sparse Attention — a top-K token filtering mechanism that takes attention complexity from quadratic to linear. None of this is a parameter bump. It's an architectural rethink of how the model moves through its own memory.

Google's [Gemma 4](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/) takes a different approach to the same problem. Most layers use local sliding-window attention — looking only at a fixed nearby window of tokens rather than the full context. A small number of layers execute full global attention across everything. The model alternates between them on a fixed schedule. Bulk compute runs cheap on local windows. Occasional expensive global passes maintain full-context understanding. Their 27B Mixture-of-Experts variant — 128 specialized experts, roughly 8 active per token — delivers frontier-level reasoning at approximately 4 billion parameters of active compute cost.

Meta's Llama 4 Scout makes a similar structural bet: 109 billion total parameters, 17 billion active per token.

The pattern is the same everywhere you look. The labs getting real traction aren't shipping denser models. They're rethinking how models store and access information at the architectural level. Parameter count is no longer the signal. The architecture is.

## The Harness Thesis

So if bigger base models are constrained by physics, and the architectural optimizations deliver cheaper and faster intelligence rather than fundamentally smarter intelligence — where do the real gains come from?

I think they come from the scaffolding around the model, not the model itself.

The detail problem is a working memory problem. The model can't hold the fractal complexity of a large codebase in its context. But a harness can hold it in a database and feed the model exactly what it needs at the moment it needs it. An external state tracker can maintain the model of reality the LLM can't maintain itself. A Process Reward Model — a secondary model trained to evaluate the logical soundness of each intermediate reasoning step — can catch a bad assumption in real time and force a backtrack before it compounds into five more bad assumptions downstream.

This also changes the verbosity calculation. Right now, models narrate defensively because they have no safety net. Every intermediate statement has to be self-verified in context because nothing external is checking the work. A model operating inside a verification harness can move faster. It doesn't need to hedge every step out loud if something is watching the logic and will flag a wrong turn.

My read on 2026 is pretty straightforward: no one is shipping a meaningfully smarter base model this year. The inference wall makes that economically infeasible at the scale the labs want to operate. The architectural shifts — FlashMLA, sliding-window attention, sparse MoE routing — are genuine breakthroughs, but they make intelligence cheaper and faster, not qualitatively greater. The things worth watching aren't the model releases. They're the architectural innovations that reduce inference cost, and the harness engineering that lets existing models handle the surprising amount of detail in real codebases that they currently can't hold in their heads.

The inference wall forced the industry to stop treating scale as a strategy. That's the best thing that's happened to AI research in years.
