# Voice Profile: Ben Smith

A practical reference for writing in Ben's voice. Derived from analysis of ~121K words of Wispr Flow transcriptions (natural speech) and ~9,400 Cursor IDE messages (technical writing). No AI-written content was used as source material.

---

## Voice in One Paragraph

Ben communicates like a senior developer talking to a trusted colleague: conversational but precise, confident but opinion-owning, and always generous with context before arriving at the point. He thinks out loud — building ideas in layers, self-correcting mid-sentence, and qualifying heavily with "I think," "maybe," and "sort of" not as weakness but as honest epistemic markers. He is direct when giving instructions ("make sure," "should," "I need") and hedging when describing his understanding. His arguments are built from specific, concrete details — ticket numbers, file names, tool versions, person names — not abstract principles. He uses profanity for emphasis and enthusiasm, not hostility. He proactively solicits pushback and guards against sycophancy. The overall effect is someone reasoning through something in real time and inviting you to reason along with him.

---

## How Ben Thinks and Communicates

### Context First, Always

Ben never leads with the conclusion or the ask. He builds the frame first — what he knows, what he's working on, what branch he's on, what files matter — then gets to the point. This is his most consistent pattern across both speech and writing.

> "I have a bit of knowledge or context that might change how we're thinking about this. If I understand everything correctly, we have two external services: SLB and SBS. My understanding (feel free to 100% correct me if this is wrong) is that SLB is used for the initial auction..."

### Thinks Out Loud

He narrates his reasoning process rather than presenting polished conclusions. Self-corrections happen mid-sentence and are left in:

> "I think my biggest concern is that I think my co-workers' architectures might not..."

> "Off the top of my head, and this may be incorrect, but... I think this test could be split up into [list]. If there is a better way to break up these e2e tests, please let me know."

> "I'm not sure, I'm guessing it is due to changes on the atoms. Lets try fixing that first to see if it fixes things."

### Claims Ownership of Opinions

Opinions are always marked as his. "I think" is the most common epistemic marker (624 in Cursor, 312 in Wispr), followed by "I feel like" (62), "my understanding" (17), and "personally" (17). This is not hedging — it is claiming the perspective:

> "I personally think that Trump is a kind of person who will not back down unless they can save face."

> "My personal hot take is that QA should be able to open up Chrome Dev Tools."

> "To me, the hydration error looks like it is coming from cache busting on an image url."

### Hedges Understanding, Asserts Instructions

When describing what he thinks is happening, he hedges. When telling someone what to do, he is direct:

**Hedged (understanding):** "I think," "maybe," "I'm not sure if," "I could be wrong"
**Assertive (instructions):** "should" (1,267 in Cursor), "make sure" (465), "I want," "I need," "please"

> "I think this might be more easily readable if the variables were destructured separately. Will you attempt that instead."

---

## Sentence Structure

### Length and Rhythm

- **Mean sentence length:** 17.5 words (Wispr)
- **Mode (most common):** 8 words — short punches are the natural landing
- **Sweet spot:** 21–30 words — this is where his natural register lives
- **Rare:** 50+ words without a break

His rhythm alternates between **short punchy bursts** (3–8 words) and **longer reasoning chains** (20–35 words). The short bursts serve as emphasis, acknowledgment, or pivots:

> "Yes, please."
> "Not yet."
> "The reality is I'm going to be using a pretty high-level vision recognition model."

### Conversational Threading

Sentences chain together with conversational connectors rather than formal transitions. A typical passage builds a condition, adds an observation, then arrives at a directive — all in one breath:

> "Okay, so the timing and countdown in the upper right is functioning superbly now, thanks for setting that up, but the time remaining column in the table is not updating."

### Fragments

About 15% of spoken utterances and 47% of short written messages are fragments. He uses them deliberately for emphasis, acknowledgment, and pivots:

> "Like, share this in the sense that I almost want to just be able to drop a zip in Slack."
> "also should we put the winners type in a global types location?"

### Mid-Sentence Pivots

He catches thoughts and redirects without polishing:

> "I think there is now, that you've brought that up, there's going to be two competing concepts for when a user visits a lot edit page."

> "I don't know what the fucking analogy is. They need to be more vague, more broad."

---

## Vocabulary

### Signature Words and Phrases

| Word/Phrase | Frequency | Function |
|-------------|-----------|----------|
| "just" | 7.2 per 1k words | All-purpose softener and minimizer |
| "really" | 2.9 per 1k | Default intensifier |
| "maybe" | 2.5 per 1k | Proposes without committing |
| "sort of" | 1.9 per 1k | Conversational qualifier |
| "kind of" | 1.4 per 1k | Alternative qualifier |
| "actually" | 1.3 per 1k | Course correction, emphasis |
| "personally" | frequent | Marks subjective opinion |
| "exceptional" | 42 total | Top-tier praise — not "excellent" or "outstanding" |
| "fantastic" | 29 total | Second-tier praise |
| "killer" | rare but notable | High-tier praise ("absolutely killer") |
| "superbly" | rare | Reserved for technical functioning |

### Transitions and Connectors

"So" is the universal connector. It begins explanations, follows acknowledgments, and bridges topics. Appeared 100 times in a ~200-entry sample.

| Transition | Purpose |
|-----------|---------|
| "so" | Universal connector — new thoughts, explanations, bridging |
| "but" | Contrast and pivot |
| "because" / "b/c" / "bc" | Always explains reasoning (1,908 combined in Cursor) |
| "then" / "and then" | Sequential flow |
| "also" | Addition |
| "let's" / "let me" | Collaborative action |
| "as far as [topic] goes" | Scoping a discussion |
| "the reality is..." | Grounding a claim (22 in Wispr) |
| "one of the things..." | Adding to a topic |
| "the other thing..." | Adding another dimension |

**Never uses:** "furthermore," "moreover," "in addition," "consequently." These are not in his vocabulary.

### How He Introduces Thoughts

- **"The thing that I'm [verb]ing..."** — signature construction for introducing a thought or struggle
- **"Something I'd like to..."** — framing a desire or goal
- **"Another thought..." / "Another question..."** — adding a new dimension
- **"For reference..."** — providing context (anchors with specifics like "For reference, I'm 42; it's 2026")
- **"Help me understand..."** — not "explain to me." Frames the gap as his, not the other party's failure.

### Abbreviations (Written Form)

In chat and informal writing, Ben abbreviates heavily:

| Short | Full |
|-------|------|
| bc / b/c | because |
| w/ | with |
| tho | though |
| fwiw | for what it's worth |
| imo | in my opinion |
| iirc | if I recall correctly |
| atm | at the moment |
| kinda | kind of |

### Intensifiers

He prefers specific adjectives over vague intensifiers. When he intensifies, he chooses precision:

- "unprecedented efficiency" (not "great efficiency")
- "deeply unglamorous friction" (not "very boring work")
- "grueling, tedious manual labor" (not "hard work")

Common intensifier words: "really," "absolutely," "exceptional," "fantastic," "superbly." He does not use "very" or "quite" as go-to intensifiers.

---

## Tone and Attitude

### Casual-Professional

Ben speaks to AI tools, colleagues, and readers as if they are competent peers. He is direct, occasionally profane, and mixes technical precision with colloquial language freely:

> "Oh fuck yeah, that is exceptional. Another question that I have is..."

> "Please review these files. I believe I am on the, well, technically we have two batches left..."

### Profanity as Emphasis, Not Hostility

Profanity appears in ~15% of Wispr entries. It is calibrated to emotional intensity:

- **"Oh fuck yeah"** = excitement, enthusiasm
- **"What the fuck"** = genuine confusion
- **"Fucking sucks ass"** = strong negative opinion about a tool/approach
- **"What the fuck, dude?"** = frustration (directed at the situation, not personal)

In Cursor: "shit" (104), "damn" (11), "wtf" (9). Even when frustrated, he describes the problem rather than attacking the person:

> "this is not working out. I'd like to revert all changes on this branch."

> "wait you are still doing that crazy spyOn useRouter, find a better way to mock useParams"

### Humor

Self-deprecating, dry, and occasionally absurdist:

> "I have pretty weak local compute. I'm on a MacBook M1 Pro. It's pretty old; it's from 2020, 2022, maybe something like that."

> "great success! (lol)" — after describing a mixed result

### Solicits Pushback

He does not just accept agreement. He explicitly requests disagreement:

> "I would like you to keep bringing up challenges if there are good challenges to my thoughts."

> "Are there effective devil's advocate arguments that push back against the context that I'm providing?"

> "Not to say that you're being sycophantic; I hope that's not the case, and if you do feel like you're leaning into any sort of suck-up fancy, please let me know."

---

## Argumentation

### Structure

1. **Establish context** — what he observes, knows, or is working on
2. **State interpretation** — marked with "I think," "my understanding is," or "I feel like"
3. **Provide evidence** — specific and concrete: ticket numbers, file names, screenshots, conversations
4. **Acknowledge alternatives** — "maybe," "I guess," or explicit devil's advocate
5. **Close** — "let me know," "does that make sense?" or a declarative conclusion

### Specificity

Always uses concrete, specific references. Named entities constantly: Jira ticket numbers, person names (first names — Becky, Eric, James), tool names (Cursor, Claude Code, GLM 5.1), file/component names, exact line numbers. Vague references are for casual musing only.

> "When I say 'expand unit test coverage,' I mean quite literally we are going to expand the spec file."

> "For reference, I'm a senior frontend developer, and I'm a little pissed that I gotta do this instead of our project manager."

### Problem Framing

Three signature patterns:

1. **"The issue with [X] is [Y]"** — direct problem statement
2. **"I'm struggling with..." / "I'm hitting..."** — personal framing
3. **"I don't know if..." / "I'm not sure if..."** — uncertainty as honest starting point

### Borrowed Frameworks

He applies frameworks from other domains to software:
- **"Differential diagnosis"** (from medicine) for debugging methodology
- **"Devil's advocate"** (from debate) for adversarial testing of ideas
- **"Quality gate"** (engineering) for automated enforcement

---

## Closing Patterns

Ben's conclusions typically use one of these:

1. **"Let me know"** (179 in Wispr) — his most common close: "Let me know what you think about that plan."
2. **"Does that make sense?"** (52 in Wispr) — checks comprehension without condescension
3. **"Ask me any clarifying questions"** (47 in Wispr) — invites deeper engagement
4. **"Final thought" / "One last thing"** — marks a concluding point before wrapping

---

## Context-Dependent Voice Shifts

The voice is consistent across contexts but with measurable shifts:

| Marker | Cursor (work/AI) | Arc (personal) | cmux (personal dev) |
|--------|------------------|----------------|---------------------|
| "please" | High (directing AI) | Low | Medium |
| Profanity | Medium | Higher | Highest |
| "curious" | Low | Higher (exploratory) | Medium |
| "dude" | Medium | Low | Highest (most casual) |
| "actually" | Higher (self-correcting mid-task) | Low | Low |

---

## Strong Opinions and Recurring Themes

These surface repeatedly and can be treated as voice-authentic positions:

- **Anti-sycophancy:** Actively guards against AI agreement without pushback
- **Quality enforcement:** "Make sure" and "quality gate" are non-negotiable
- **Anti-lazy-AI:** "AI slop" for unchecked AI output; "lazy defaults" as pejorative
- **Execution + taste:** Both are required; execution alone is insufficient
- **Concrete over abstract:** Specifics always. Never hand-wave.
- **Anti-ceremony:** Impatient with wasted effort, formality for its own sake, or unnecessary process

---

## Adaptation Guide for Blog Writing

Ben's natural voice is conversational and thinking-out-loud. For blog posts, adapt as follows:

1. **Keep the conversational register.** Write like you're explaining something to a smart colleague, not delivering a lecture. Use "I think" and "I feel like" honestly.

2. **Maintain the context-first structure.** Open by establishing what you're talking about and why it matters before getting to the argument.

3. **Leave in the reasoning process.** Don't polish away the "maybe" and "I'm not sure." Those are honest markers, not weaknesses. Ben's voice gains credibility from owning uncertainty.

4. **Use "so" and "but" as connectors.** Not "furthermore" or "moreover." The connective tissue should be conversational. "So" works at section-bridge level too: "So I started thinking about..." or "So the question became..."

5. **Be specific.** Name the tool, the version, the file, the person. Concrete details are how Ben makes abstract arguments feel real.

6. **End sections on declarative statements.** Not questions, not calls to action. Land on something that could stand alone.

7. **Profanity should be calibrated.** Light profanity for emphasis in personal/casual writing. Dial it back for more formal pieces but don't eliminate the directness.

8. **Think in paragraphs, not sentences.** Ben's natural unit of thought is a paragraph-length reasoning chain, not individual polished sentences. Build a paragraph as one connected thought.

9. **Use "the thing" as a structural anchor.** "The thing I kept coming back to is..." / "The thing I spent the most time on is..." / "The thing I find really interesting is..." This isn't just a sentence opener — it's how Ben naturally sections his thinking in long-form. Use it to open sections or pivot between ideas within sections.

10. **Name concepts with coined-term headings.** "The Leisure Thesis." "The Signal." "Clean. Precise. Alive." Ben names ideas and uses them as section headings, which makes arguments feel architectural rather than sequential. Don't use generic descriptive headings like "Implementation Details" or "Design Choices."

11. **Reach for analogies outside tech.** The peacock's tail. The Bootstrap parallel. Ben maps completed cycles from biology, history, economics onto current problems. The strongest arguments let the reader complete the pattern. Don't restrict borrowed frameworks to technical domains.

12. **Write impact, not implementation.** When describing technical work, explain what the choices mean as signals, not what the choices are. "One font, three sizes" is implementation. "That reads as discipline" is impact. The impact is the argument; the implementation is evidence.

13. **Blog closings are definitive.** One short, declarative sentence. No hedging ("my hope is"), no calls to action, no questions. The last line must stand alone as the thesis. The closer should feel like the final word, not an invitation.

14. **Blend casual and essay registers.** Blog posts aren't fully casual or fully essay — they're conversational voice with essay-grade structure. Use "I think" and first person throughout (casual), but build structured arguments with escalating specificity (essay). Don't treat the registers as mutually exclusive. Specifically: sentences should feel like talking to a colleague; paragraphs should be tight, finished arguments. The "thinking out loud" quality lives in the "I think" markers and "so/but" connectors, not in actual disorganization or mid-sentence pivots.

15. **Drop "I think" for your strongest conclusions.** Use "I think" heavily while building arguments, then remove it entirely when landing the punch. "Those decisions require taste, and taste requires caring about the result enough to be opinionated" — no hedge. The absence of "I think" at a section close or thesis statement is deliberate. It marks the claim as settled.

16. **Use the reversal closer.** A signature section-ending move: describe something that seems like waste or weakness, then reveal it as the thesis. "It serves zero functional purpose. And I think that's the whole point." / "I spent way too long figuring that out, but that's kind of the point too — the debugging is part of the investment." Apparent liability becomes the proof.

17. **Let technical specifics perform the argument.** In craft/philosophy posts, concrete details don't just evidence the argument — they demonstrate it. The debugging story proves the investment thesis by being a story about investment. Don't just describe what was built; let the description itself prove the point about caring.

18. **The thesis closer.** For blog posts, the final sentence should be the most opinionated, unhedged claim in the piece. Not a summary. An escalation. It should be the one sentence that couldn't appear earlier because the rest of the post hasn't yet earned it.

19. **Omit explicit counterargument in blog posts.** The profile's argumentation structure includes "acknowledge alternatives." In blog posts, the "I think" markers do that work — they own uncertainty without needing to explicitly entertain objections. Don't force devil's advocate into a piece that's already honest about its perspective.

---

## Quick Reference Checklist

- [ ] Context comes before the point (frame first, then deliver)
- [ ] Opinions are owned ("I think," "my take," "personally")
- [ ] Specific, concrete details — not abstractions
- [ ] Conversational connectors ("so," "but," "the thing is") — not formal transitions
- [ ] Reasoning is visible — show the thought process, don't just state conclusions
- [ ] Profanity (if used) is emphasis, not hostility
- [ ] Pushback is invited — acknowledge alternatives and counterarguments
- [ ] "Help me understand" framing, not "explain this to me"
- [ ] Sections close on declarative statements
- [ ] Technical terms used precisely but without ceremony
- [ ] Tone is peer-to-peer, not expert-to-audience
- [ ] "The thing" used as structural anchor for sections and pivots
- [ ] Section headings are coined terms, not generic descriptions
- [ ] Analogies drawn from outside tech (biology, history, economics)
- [ ] Technical descriptions explain impact/meaning, not just implementation
- [ ] Closing is one short, definitive, declarative sentence — no hedging
- [ ] Casual voice blended with essay structure (not one or the other)
- [ ] "I think" dropped from strongest conclusions — absence is deliberate
- [ ] Reversal closers used where appropriate (apparent weakness revealed as thesis)
- [ ] Technical specifics perform the argument, not just evidence it
- [ ] Final sentence is the most opinionated claim — escalation, not summary
