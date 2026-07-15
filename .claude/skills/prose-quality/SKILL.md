---
name: prose-quality
description: Use when drafting or editing any blog post in src/posts/ — enforces Ben's prose-quality floor via the prose-lint gate plus non-countable style budgets. Applies to every model drafting for this blog (Fable, Opus, GLM, DeepSeek, anything).
---

# Prose Quality Workflow

Why this exists: a 2026-07 four-reviewer audit found the gap between a good draft and a Ben draft is mostly countable micro-tics (em dashes, matched antithesis, stock setups, round numbers) plus a few judgment budgets. Countable things are enforced by `scripts/prose-lint.mjs`. Judgment budgets are listed here and applied in a revision pass. Follow the intent, not just the letter: tics read as model-written and bury the ideas.

## Process (every draft or substantive edit)

1. Read `src/data/voice-profile.md` in full. It is the identity spec; this skill is only the quality gate.
2. Draft (or edit) the post.
3. Run `npm run prose-lint -- src/posts/<slug>.md`.
4. Fix every ERROR. No exceptions, no justifications.
5. For each WARN: fix it, or keep it deliberately with a one-line justification in your summary to Ben.
6. Re-run until the gate passes.
7. Do one revision pass for the non-countable budgets below.
8. Also run the privacy guard: `npm run check:draft -- src/posts/<slug>.md`.
9. Present the result with the final lint output included.

## Non-countable budgets (revision-pass checklist)

- **Antithetical punch pairs** ("Models lose money. The building wins."): at most one per section, only as the section's closing beat, at most 4 per post. If the lint I2 line shows more, demote the extras to ordinary declaratives by merging with a comma or varying the shape.
- **One load-bearing metaphor per essay.** Other analogies are allowed only if brief and non-recurring. If two metaphors are both doing structural work, cut one.
- **Retired templates:** the "X was never the Y. It was the Z." closer (used in The Cost of Admission; do not reuse). Vary section-anchor phrases across posts — check the lint's corpus I3 output.
- **Numbers:** numerals with units for precise or large figures ("$559 million", "200,000 GPUs"); words for small round ones ("a billion to train"). Every stat carries a link or an in-sentence sourcing qualifier.
- **Strength matches certainty:** "I can't find an exception" over "the pattern is total". Hedge understanding ("I think", "my read is"), assert landings (drop "I think" only at section closes and the thesis).
- **Punctuation:** commas over dashes everywhere; " - " at most twice; avoid semicolons.
- **Openers:** don't reuse the "I've been [X]ing for [N years]" credential stamp two posts in a row. Compress credentials; don't cut them.
- **Closers:** one short declarative sentence, the most opinionated line in the piece, landing exactly once (lint W5 checks the echo).

## Attribution

Per `.claude/skills/draft.md`: blog posts are Ben's work. No Co-Authored-By trailers on post commits. Tooling commits may use them.
