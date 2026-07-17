# "Bright Enough" — revision handoff (2026-07-17)

For the agent resuming this work with Ben on another machine. This file is the map; everything else is in the repo.

## State at handoff

- Branch: `draft/bright-enough` (tracks `origin/draft/bright-enough`). All work committed and pushed; working tree clean.
- Post: `src/posts/bright-enough.md` — "Bright Enough" (Essay, dated 2026-07-15).
- Gates green: `npm run prose-lint -- src/posts/bright-enough.md` (0 errors, 0 warnings, punch pairs exactly 4/4) and `npm run check:draft -- src/posts/bright-enough.md` (clean).
- Preview: `npm run dev` → http://localhost:4321/blog/bright-enough. If the page serves stale content after edits, restart the dev server (vite wedged once this session).

## What happened this session (all committed)

1. **Act one re-narrated as exploration** (Ben's request: "chain of thought guidance to a reader"). Order: LED non-event (his original cold open, restored) → frame question ("what actually happens when intelligence gets cheap?") → Jevons ("it says the non-event shouldn't have happened") → "so that's where I went looking" → Nordhaus light-price arc (Babylon 41h → Jefferson 5h → 1992 half-second, linked to David Owen's New Yorker Jevons piece) → consumption explosion (Fouquet & Pearson) → "Except the curve flattened" → the fork ("Some resources explode when they get cheap. Some just saturate.").
2. **New section "## The Precedent"** added this session (Ben's direction): names the assumption "intelligence is electricity," argues it via the general-purpose list and the endpoint test ("wants stack"), answers the flat-electricity objection (efficiency policy + offshoring; EIA + DOE links; demand moves in steps), and stitches the two halves ("limits live around the input... which is where the scarce thing actually lives").
3. **Blind editor review** (subagent, zero context) was relayed to Ben and mostly executed: "There's a name for how this ends" cut (Ben: orphaned sentence), elevator paragraph split, sequel tease ("story I'm still thinking through") cut, line-level fixes (savings/usage logic, "guarantee:" colon, Claude aside in parens, Hank Green scaffolding removed, two "I think" hedges dropped). Vocabulary aligned on "saturate."
4. Editor's do-not-touch list: the cold open, the Nordhaus arc, the boss paragraph ("the essay's core"), the fork/container/blast-radius metaphors, the caveats.

## THE PENDING DECISION — resume here

Ben's last editorial call: **the GPT paragraph is the strongest in the essay** — "Electricity was the last input of inputs... Economists have a term for technologies like this, general-purpose, and the canonical list is short: steam, electricity, the computer. Intelligence is applying for membership." (`src/posts/bright-enough.md:44`)

He asked how to rewrite the essay around that point and simplify — his sprawl list: "general purpose for intelligence, jevons mechanics, programming careers, historical material usage and contexts." He also asked whether he's misdiagnosing and the flow is fine. My answer (delivered): the flow isn't broken, but the hierarchy is upside down — the GPT idea should be the thesis, not support. He had NOT confirmed executing the restructure when he paused. **First thing on resume: confirm he still wants it.**

### Proposed restructure ("GPT as thesis"), ~1,600 → ~950 words

Spine: "Intelligence is applying for membership in the shortest club in economic history."

1. Cold open unchanged (LED non-event).
2. Light arc compressed to one paragraph (Babylon → Jefferson → half-second; flattening/container folded in).
3. The rule in one short paragraph: "endpoints saturate, inputs compound." Jevons becomes a linked clause (the 1865 coal story dies). Water heater + Hank Green credit survive as one clause. Rich-country caveat survives as one sentence.
4. **Hinge: the GPT paragraph, nearly verbatim, moved to the center**, +1–2 beats (the grid's first customers thought they were buying light; we can price the chatbot but can't list what intelligence gets built into).
5. Endpoint test ("wants stack"), light compression.
6. Objection paragraph, tightened (flat curve → chosen flatness + offshoring → bending again, bent by AI, in steps).
7. Personal coda compressed to ~150 words: keep the boss paragraph's three beats (he's buying a guarantee now, verification layer, blast radius/answerability). Cut the judgment/taste survey, elevators, autopilot, formal methods.
8. Closer unchanged: "The rooms hit bright enough a generation ago. Thinking has no ceiling."

Cut list: coal story; Fouquet & Pearson streets-and-stadiums paragraph (electricity's own diversification becomes the explosion evidence); the fungibility first-theory + Claude pushback (kills the Claude cameo — flagged to Ben as a cost); the will-problem aside; the trust-follows-verifiability machinery. The invoices beat survives as one sentence in the hinge (personal proof of exploding input demand).

Also required if restructured: rewrite the frontmatter excerpt (currently fork-framed), and re-run both gates.

## Process rules this repo enforces

- **Voice**: read `src/data/voice-profile.md` before drafting in Ben's voice.
- **Quality gate**: `npm run prose-lint -- src/posts/<slug>.md` — fix every ERROR; fix or deliberately justify each WARN (see `.claude/skills/prose-quality/SKILL.md`). Punch-pair budget is 4/post and the draft is at exactly 4 — demote before adding.
- **Privacy guard**: `npm run check:draft -- src/posts/<slug>.md` must pass before publish.
- **Punctuation**: commas over dashes, no semicolons, no em dashes. Stats: every one carries a link or in-sentence sourcing qualifier; numerals for precise/large figures, words for small round ones.
- **Commits**: no Co-Authored-By trailers on blog post commits (the author's work; tooling commits may use them).
- **Publish flow** (`/draft publish`, see `.claude/skills/draft.md`): guard → Ben's final read-through → commit → merge to main → `npm run build && rsync -avz --delete dist/ root@146.190.61.214:/var/www/html/` → delete draft branch.
- **Before publishing, delete this handoff file** (`docs/bright-enough-handoff.md`) on the draft branch so it doesn't merge to main. The package-lock.json sync commit is safe to merge.

## Loose ends

- `origin/draft/inference-wall` — older draft; its post file is `src/posts/inference-wall-v2.md`, which breaks the branch↔filename convention (`/draft check` and `/draft publish` look up the file by branch slug). Rename when that draft resumes.
- `origin/draft/the-cost-of-admission` — other unpublished draft, has prose-lint tooling merged in already.
- gh CLI on Ben's machines is logged into his work account — use git over SSH only, no `gh` commands in this repo.
