# Outline: "Workslop — The Unitemized Invoice"

Status: outline approved in brainstorm session, 2026-08-24. Supersedes the two-post framing in
`judgment-pass-dossier.md` for this post (that dossier remains useful as the research quarry,
especially the citation-tiers and link-verification gate).

Related prior posts: "The Reps" (register reference). Do not lean on GSD/PGSD workflows —
deliberately out of scope.

## Front matter decisions

- Title: **"Workslop — The Unitemized Invoice"** (runner-up: "The Unitemized Line Item")
- Category: Essay
- Core thesis: "Workslop" is used everywhere as shorthand, but nobody has itemized what the tax
  actually consists of. Sending became free; consuming didn't. This post explores that cost.

## 1. Cold open — the unitemized invoice

- "Workslop" is now shorthand everywhere — used like everyone agrees what it costs.
- Nobody has itemized it. Set the frame: sending became free; consuming didn't.
- Close of the open: **this post explores that bill / that cost** (NOT "this post is the bill").

## 2. The lived experience

- First person, honest, short. The drain; the resistance when picking up a Jira ticket; tools
  that promise 10x and days that end emptier. Hook, not argument.
- This section compresses first if the post runs long.

## 3. What the tax actually is — the itemization (center of gravity)

Five line items:

1. **The full-read cost** — skim cues (hedging, visible uncertainty) are gone; every line read at
   full attention, correct or not.
2. **The premise audit** — checking the ticket's *world* (does the API field exist, is the
   contract real) before doing the ticket's work.
3. **The reconciliation cost** — when artifacts disagree, someone figures out which is real; never
   the generator.
4. **The archaeology cost** — why do these two near-identical properties exist, who depends on
   which. History-and-intent questions, days not minutes.
5. **The alignment cost** — re-communicating across the team to retract a consumed premise;
   coordination overhead with zero new output.

Organizing question threaded throughout: **at which hop does a wrong guess stop being cheap to
retract?** Cost figures are labeled personal estimates, not data — the shape is the claim.

The QA/PM nuance lives here: verification IS institutionally captured (QA, PM acceptance, review),
but it was designed for a human error profile (omission, honest fuzz). AI inputs fail differently
(confident fabrication in the seams). The tax is the gap between the verification you staffed and
the verification the inputs now require — which is why it lands on the people whose instincts
cover premises, not just specs.

## 4. One example, told fully

- The API contract story: PM's agent fabricates a contract; half an epic materializes on it; two
  near-duplicate properties end up live; a day or two of code archaeology to unwind.
- Pattern-level, no identifiable specifics ("an epic," not "our epic"; no roles pinned to
  failures).
- Each stage of the story tags a line item from section 3 so narrative and itemization lock
  together.

## 5. The cheap-send lineage

Four functional categories of historical norms, each with a direct AI counterpart:

1. **Compression norms** (sender pays the cost of condensing) — email reply-all/TL;DR;
   Amazon's six-page narrative memo ban on slides (regulates density, not volume). AI analog:
   summarize-before-forward.
2. **Medium-restitution norms** (reroute to the cheapest medium for the *reader*) — voicemail →
   text; "this should be a doc, not a meeting." AI analog: your three sentences in the message,
   the transcript behind the link.
3. **Provenance norms** (mark how the artifact was made so the reader can calibrate) — "Sent from
   my iPhone" as parser-setting, not apology; "forwarded as received"; "off the record." AI
   analog: verified-vs-assumed marking.
4. **Sender-verifies-first norms** (do the consumption work before producing) — Usenet "lurk
   before you post" / "read the FAQ"; Stack Overflow "what have you tried?" / duplicate closure.
   AI analog: confirm the contract exists before the ticket ships.

The instructive failure: the Pentagon PowerPoint problem produced no working norm inside the
suffering institutions; only Amazon (unusual authority concentration) forced the memo format.
Lesson: norms the *beneficiary* must enforce spread slowly; norms that let the *sender* signal
competence spread fast (TL;DR won because it made the sender look good).

Payoff of the taxonomy: we don't need to invent AI etiquette — there's a four-norm repertoire
with forty years of precedent. The open question is only which one the culture settles on.

## 6. Landing — the transitional state

- This is a window, not a permanent condition. Same window opened for every cheap-send technology
  and closed within a few years.
- The open question isn't whether norms arrive but *which* of the four wins — and history says
  it'll be the one that lets the sender signal competence.
- **Required closing beat 1:** the sender-signals-competence outcome will feel extremely
  frustrating to individual contributors — the ones already paying the tax. Say this plainly,
  from lived experience.
- **Required closing beat 2:** personal belief, stated as belief: if you execute well on that
  sender-side competence, it will be rewarded in this new era of AI development.
- End on the diagnostic + forward motion. No workflow redesign, no org-level prescriptions
  (deliberately out of scope).

## Standing guardrails

- **Stats hygiene:** personal evidence first. If any external number is used, prefer the sturdy
  independent core (Danish registry data, METR, CircleCI) — never BetterUp workslop prevalence
  figures. Verify every citation resolves and says what we claim (AI-pipeline provenance;
  constructed arXiv links especially). Hard gate before publishing.
- **Identifiability:** every example real but pattern-level; no employer, role-to-failure mapping,
  or rollout timestamps.
- **Self-consistency:** the post must perform the judgment pass it argues for — our selection,
  our estimates labeled as estimates, our name on the claims. No pasted model output.
- **Scope:** no GSD/PGSD promotion; no org-restructuring playbook. Norms are etiquette-grade:
  short, sender-side, one line each.
