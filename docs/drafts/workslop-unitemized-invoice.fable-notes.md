# Fable draft notes: Workslop — The Unitemized Invoice

Draft: `docs/drafts/workslop-unitemized-invoice.fable.md`
Written 2026-08-24 from the approved outline (`docs/research/workslop-unitemized-invoice-outline.md`).
Deliberately kept out of `src/posts/` because a second agent is drafting the same post in
parallel. Publishing = Ben picks a draft (or merges), moves it to
`src/posts/workslop-unitemized-invoice.md`, and re-runs both gates there.

## Gate status

- `npm run prose-lint` — passed, 0 errors, 0 warns. Mean sentence 17.5 words.
  Punch pairs 2/4, both at closers ("Hard days used to leave an artifact...",
  "Reading still costs. Judgment still costs."). Negation-pivot budget 0/1 used.
- `npm run check:draft` — passed, no privacy issues.
- Voice profile (`src/data/voice-profile.md`) and prose-quality skill loaded before drafting.

## Decisions that deviate from or interpret the outline

1. **Role scrub in "Half an Epic."** The outline's story beat says "PM's agent fabricates a
   contract," but the identifiability guardrail says no role-to-failure mapping. The guardrail
   won: the draft says "somewhere upstream an agent had drafted the contract." Ben's call if
   the PM detail should return.
2. **Fact-check catch:** "PowerPoint makes us stupid" is Gen. Mattis, not McMaster (verified
   against Wikipedia's PowerPoint article, which cites the 2010 NYT piece). McMaster is the
   one who banned it in his command. The draft attributes correctly. NYT blocks automated
   fetching, so the draft uses in-sentence attribution ("front page of the New York Times in
   2010") with no hyperlink. If a link is wanted, someone has to verify
   nytimes.com/2010/04/27/world/27powerpoint.html by hand (paywall).
3. **Zero external stats.** Per the stats-hygiene guardrail I used personal estimates only,
   each labeled ("my estimate," "my guess"). The citation-verification gate is therefore
   trivially satisfied. Amazon memo culture, voicemail-to-text, Usenet/Stack Overflow norms
   are stated as common knowledge, no links.
4. **TLDR spelled without the semicolon.** "TL;DR" trips the W1 semicolon warn, so the draft
   uses "TLDR" throughout.
5. **Title em dash.** The approved title keeps its em dash in frontmatter. The lint scans
   excerpt + body only, so this passes, and the body/excerpt contain none.
6. **No internal link to The Reps.** Considered in The Drain, cut for scope discipline. Easy
   to add back if Ben wants the arc connected.

## Outline coverage check

- Cold open: sending free / consuming not, post "walks the charges" (explores, is not the bill). Done.
- Lived experience: compressible two-paragraph section ("The Drain"). Done.
- Five line items, bold-led, no ordinal scaffolding, hop question threaded and "hop" defined. Done.
- QA/PM nuance paragraph closes "The Line Items." Done.
- API contract story tags all five items in order. Done.
- Four norm categories + Pentagon/Amazon instructive failure + TLDR lesson. Done.
- Landing: window framing, IC-frustration beat stated plainly, sender-competence belief
  stated as belief, closer "The new senior skill is vouching for what you send." Done.

## Open items for Ben

- Choose between parallel drafts (or merge), then move winner to `src/posts/` and re-run
  `prose-lint` + `check:draft` on the final path.
- Confirm the role-scrub call in item 1.
- Publish date currently 2026-08-24 in frontmatter, adjust at publish time.
