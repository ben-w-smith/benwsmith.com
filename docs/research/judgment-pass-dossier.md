# Research dossier: "The Judgment Pass" post pair

Working state of the brainstorm from the 2026-08-24 session (claude.ai conversation +
deep-research report + 97-URL bibliography). This file is the quarry for two posts.
It never publishes; src/posts/ is the only published content.

## Decisions made

- **Two posts, not one.** Post 1 is the personal diagnosis essay. Post 2 is the
  research-backed org playbook. Do not merge them.
- **Post 1 spine:** the judgment pass. AI made the writing free, so the only part of
  communication still a human's job is judgment (what matters, what's shaky, what am
  I claiming). That's the part being skipped, and skipped judgment doesn't disappear,
  it routes to the reader.
- **Post 1 title:** The Judgment Pass (runner-up: The Verification Tax).
- **Post 2 spine:** the constraint relocated from writing code to verifying it, and
  almost nobody staffed the new location.
- **Post 2 title candidates:** The Unstaffed Stage (lead), The New Location,
  The Relocated Constraint, The Entropy Pump.
- **Sequencing:** ship Post 1 standalone with one forward-pointing sentence. Post 2
  follows once Post 1 settles, opening by quoting it.
- Blog arc: The Reps (the step I couldn't delegate) -> Post 1 (the step my org
  skipped) -> Post 2 (the step somebody has to staff).

## Post 1 plan: The Judgment Pass

Structure:
1. Cold open: sticks and stones, born 1983. Words are finally doing something to me,
   but not the way the rhyme meant. Nothing is aimed at me. It's handed to me.
2. Credibility turn: maximal adopter resume (Codeium-era, GSD/pgSD, voice profiles,
   teaches coworkers to spot AI text), and some of this flood came through a door I
   built. Self-implication up front.
3. Mechanism: spoofed signals (length and polish were costly signals; AI inverted
   both), reading with skim-shortcuts off, and the verification symmetry: a correct
   unreviewed AI ticket costs the same two hours as a wrong one, because you can't
   know which you've got until you've done the full read.
4. Centerpiece: the API contract story. Omission vs. fabrication (human tickets err
   by visible fuzz; AI tickets err by confident precision in a domain the author had
   no standing in). Premise hardens across six stories. Removal-cost ladder: wrong
   sentence 5 minutes, merged into contract an hour, second client a day, two live
   duplicate properties two days of archaeology.
5. The name: offloading. "The model did the 80% and they did none of the 20% that
   was theirs." Competence tax (cleanup routes to whoever can see it). Accountability
   gap ("the AI got it wrong" has nobody's name on it).
6. Landing: tie to The Reps. The judgment pass is the job now. Close on "unpriced":
   the tax isn't on anyone's books, no sprint plans it, no metric counts it. One
   sentence gesturing that the fix is org-shaped, not tool-shaped -> Post 2.

Borrowed numbers (maximum three, all currently missing URLs, see link hunt below):
- CircleCI 2026: feature-branch throughput +15%, main-branch -7%, merge success
  70.8%, a five-year low (individual gains real, org translation negative).
- Faros.ai 2026: median PR review time +441%, 31% of PRs merged with no review
  (the verification tax and the skipped judgment pass, counted).
- GitClear: duplication +81%, refactoring -70% (fingerprint of "addition free,
  subtraction at full price"). Only if the entropy-pump paragraph survives.

Guardrails:
- Identifiability: coworkers will read this. Examples stay real but pattern-level.
  No roles pinned to specific ticket failures. The API story is "an epic," not "our
  epic." No timeline tied to the rollout Ben led. Self-implication defuses the
  subtweet reading.
- Stats hygiene: do not cite BetterUp workslop prevalence numbers (open online
  survey, vendor sells the cure). If crediting the term, cite HBR and note the
  critique (pivot-to-ai: "bad study, but an excellent word"). The sturdy external
  number is the Danish registry study (2.8% hours saved, 8.4% got new AI-oversight
  tasks).
- METR tension: devs estimated 20% faster, measured 19% slower. Keep that fight out
  of Post 1, but soften any "capable of 10x" phrasing so it can't be sniped.
- Tone: the reply-all comparison keeps it "we're in the etiquette gap," not "my
  coworkers are lazy."
- Voice: no em dashes, prose-lint gate, load prose-quality skill before drafting.

## Post 2 plan: The Unstaffed Stage

Frame (same register as the CIA-playbook post): I had three hypotheses about what
successful orgs do differently. I sent a research pipeline after them. Here's how
they graded.

- Hypothesis (a) accountability at handoffs: supported. Reviewer-of-record (Big
  Agile), "you may not merge what you cannot explain" (SecureFlag), ban "the AI did
  it" in postmortems, Google's merge-owner rule, sender-carries-proof norms.
  Weakest corner: no outcome data yet for forward-the-transcript norms.
- Hypothesis (b) requirements not implementation: supported with refinement. SDD
  (GitHub Spec-Kit, Amazon Kiro, EARS notation, Thoughtworks Radar v33 Assess ring).
  The refinement is Yeret's trap: a frozen handoff spec is "waterfall with
  Markdown"; the spec must be a living in-sprint artifact.
- Hypothesis (c) per-domain tedious-vs-judgment maps: best supported. Shopify's
  three-column list, McKinsey definer/builder pods (transformers became top
  accelerators 40% vs. 17% for tool-only experimenters), Microsoft PM study
  delegation boundary, NN/g design-tools gap.
- The gap evidence, descending rigor: Humlum & Vestergaard (precise zeros, 2.8%
  saved, 8.4% new tasks), METR RCT (perception inversion), Stanford Denisov-Blanch
  (half of gross gains eaten by rework; 30-40% only on greenfield), DORA 2025
  (throughput up, stability still down, AI is an amplifier), CircleCI, Faros,
  GitClear, MSR 2026 (agent PRs that eat review labor and never converge).
- Klarna as the cautionary tail: speed-and-average metrics hide damage in the
  tails, which is exactly what celebrating PR throughput does.
- Evidence-quality grading is itself content: the scariest numbers (MIT 95%,
  workslop prevalence) and the rosiest (2-10x, Sonar 2.2x) are both the weakest
  evidence; the boring independent core all points the same direction.
- Meta-paragraph, possibly the best in the post: a model gathered this; here's what
  survived my read. Supporting detail from the bibliography itself: the SEO layer
  arrived with ten links per claim while half the load-bearing primary sources
  arrived with no URL at all.
- Optional artifact like the deep-research download: the staged recommendations
  distilled into a checklist or policy block (reviewer-of-record line, cannot-merge-
  cannot-explain, sender-carries-proof, assumed-vs-verified ticket convention).

## Editorial principle for both posts

Self-consistency: these posts cannot themselves be pasted AI output. Post 1 argues
that forwarding unparsed model text offloads judgment onto the reader; Post 2's
research came out of a model pipeline. The posts must perform the judgment pass they
argue for: Ben's selection, Ben's grading, two or three numbers chosen from the
forty available, Ben's name on every claim. The report is a quarry, not a draft.

## Bibliography triage (97 URLs from the research thread)

### Tier 1: cite-ready primary sources (keep)

- https://www.nber.org/papers/w33777 - Humlum & Vestergaard, Danish registry data
  (canonical link; rev PDF also at nber.org/system/files/working_papers/w33777/revisions/w33777.rev0.pdf)
- https://hbr.org/2026/01/why-people-create-ai-workslop-and-how-to-stop-it - HBR
  workslop follow-up (term credit; the original Sept 2025 HBR piece needs locating
  if cited)
- https://pivot-to-ai.com/2025/09/23/workslop-bad-study-but-an-excellent-word/ -
  the honesty footnote on workslop stats
- https://dora.dev/dora-report-2025/ and
  https://services.google.com/fh/files/misc/2025_state_of_ai_assisted_software_development.pdf
- https://www.mckinsey.com.br/en/our-insights/beyond-the-copilot-scaling-the-agentic-product-development-life-cycle
  - McKinsey agentic PDLC survey (n=334; transformers vs. experimenters)
- https://www.sonarsource.com/blog/the-future-is-ac-dc-the-agent-centric-development-cycle/
  - Sonar AC/DC (grade Low-Medium, vendor case study; use for the pattern, not the 2.2x)
- https://hdsr.mitpress.mit.edu/pub/0mrfxamu/release/3 - HDSR agent-centric
  enterprise (grade Low for the 2-10x numbers, authors admit replication need)
- https://yuvalyeret.com/blog/is-spec-driven-development-a-step-forward-or-back-for-product-development/
  - the "waterfall with Markdown" refinement
- https://addyosmani.com/blog/code-review-ai/ (mirror:
  https://addyo.substack.com/p/code-review-in-the-age-of-ai) - "a PR without
  evidence it works isn't shipping faster, it's moving work downstream"
- https://arxiv.org/abs/2507.09089 - METR RCT (ID given in report; URL constructed,
  verify it resolves)
- https://arxiv.org/abs/2510.02504 - Microsoft PM study (ID given; URL constructed,
  verify)
- https://www.nngroup.com/articles/ai-design-tools-update-2/ - NN/g design-systems gap
- https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/
  - SDD reference implementation write-up
- https://www.betterup.com/workslop - only if pointing at the construct's origin
  while criticizing its numbers

### Tier 2: load-bearing but NO URL yet (hunt before drafting)

All three of Post 1's borrowed numbers live here. This is the pre-draft task.

- CircleCI 2026 State of Software Delivery report (28M workflows; -7%, 70.8%) and
  the Q2 2026 pulse (76.7% recovery)
- Faros.ai 2025/2026 telemetry reports (441% review time, 31% unreviewed merges,
  +242.7% incidents per PR)
- GitClear code-quality reports (churn 3.3% -> 7.1%, duplication +81%,
  refactoring -70%, 1.7x issues per AI PR)
- Anthropic "How AI Is Transforming Work at Anthropic" (Aug 2025) and the Code
  Review launch post (16% -> 54% substantive review)
- Stanford / Denisov-Blanch commit analysis (15-20% net, half eaten by rework)
- Thoughtworks Technology Radar Vol. 33 (SDD in Assess; semantic diffusion flag)
- Shopify / Tobi Lutke memo (April 2025) and the three-column list sourcing
- Klarna reversal coverage (Feb 2024 announcement, May 2025 walk-back)
- Big Agile reviewer-of-record post; SecureFlag review guidance
- MSR 2026 Popescu et al. (~33,707 agent PRs)
- Rob Bowley's critique of CircleCI's top-5% cohort (data-artifact caution)
- GitHub Spec-Kit repo; Amazon Kiro docs; EARS notation origin (Mavin, Rolls-Royce)

### Tier 3: hold, not for these two posts

- Multi-turn / multi-agent error compounding cluster (arxiv 2504.04717, 2412.10424,
  2605.27559, 2606.04435, 2606.19812, 2604.16004, beam.ai, zartis, wand.ai,
  emergentmind) - the 17x topology claim was cut from Post 1; possible seed for a
  third post on LLM-chain topology and premise laundering
- AI disclosure penalty cluster (theconversation, marsmag, sciencedirect x3,
  sciencedaily, dl.acm, arxiv 2510.24011 / 2601.09620, mdpi) - axis explicitly
  rejected in the source conversation
- https://www.nber.org papers mirrors (ssrn x2, bfi.uchicago, squarespace preprint,
  rfberlin, etui slides, researchgate, arxiv 2604.18849) - keep NBER canonical only

### Cut: do not cite

- MIT NANDA aggregator pile (finance.yahoo, forbes x3, legal.io, trullion, dataiku,
  mindtheproduct, technologymagazine, innovativehumancapital) - underlying study
  graded Low-Medium, SEO layer adds nothing
- Workslop press echo (builtin, forbes x2, cnbc, charterworks, entrepreneur,
  thenextweb, the-decoder, axios, unleash.ai, techcrunch, ayeks.de, rw-3) -
  prevalence stats graded Low / conflict of interest
- Generic workflow-redesign content marketing (cio.com, buildmvpfast, synclovis,
  ai-infra-link, onereach, vellum)
- SDD explainer blogs beyond Tier 1 (agentic-engineering.swmansion, stackranked,
  jamasoftware, augmentcode, ainativecompass, noailabs.medium, medium
  towards-data-engineering)
- Remaining accountability/policy explainers (codacy, aibuilderclub, myrobertson,
  mentorcruise, theopenlane, metacto x3) - the concepts survive via Tier 1/2 sources
- rdel.substack, institutepm - fold their one-liners into prose if needed, but
  prefer primary sources

## Pre-draft gates

1. Link hunt: locate Tier 2 URLs (CircleCI, Faros, GitClear, Anthropic, Stanford,
   Thoughtworks v33, Shopify, Klarna, Big Agile, SecureFlag, MSR 2026, Bowley).
2. Citation verification: every URL and stat in this dossier came through an AI
   research pipeline. Before publishing, resolve each cited link and confirm it says
   what we claim (the constructed arXiv links especially). This gate is the judgment
   pass; skipping it refutes both posts.
3. Load the prose-quality skill before writing a word of either draft.
