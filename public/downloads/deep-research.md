---
name: deep-research
description: IC-style deep research pipeline. Decomposes a query through assumptions check, EEI decomposition, multi-posture collection, ACH matrix, and Kent-scale synthesis. Use for questions that need primary sources, not SEO-layer content.
---

# Deep Research

Execute an intelligence-community-style research workflow on the user's query.

**Query:** $ARGUMENTS

Work through each phase sequentially. Do not skip phases. Output each phase's results before proceeding.

---

## Phase 1: Key Assumptions Check

Before any searching, surface what the query assumes that might be wrong.

List every assumption baked into the query. For each, tag confidence:
- **confident** — well-established, unlikely to be wrong
- **uncertain** — could go either way
- **potentially-wrong** — if this is wrong, the research direction changes

Uncertain and potentially-wrong assumptions become additional data requirements in Phase 2.

Output: numbered assumption list with tags.

---

## Phase 2: EEI Decomposition

Break the query into Essential Elements of Information — atomic, falsifiable, directly searchable data requirements.

For each EEI, specify:
- **The question** — specific enough that a yes/no or numeric answer would satisfy it
- **best_source_type** — what kind of source would best answer this (academic paper, government data, industry survey, expert interview, etc.)
- **known_limitations** — what this source type gets wrong

Generate at least 5 EEIs. Include EEIs derived from uncertain/potentially-wrong assumptions flagged in Phase 1.

Output: structured EEI list.

---

## Phase 3: Collection

Execute searches across five postures to bypass the SEO layer. Run as many in parallel as possible.

### Posture 1: ACADEMIC
Find peer-reviewed papers or preprints. Prefer arXiv, NBER, SSRN, Semantic Scholar, PubMed.
- Search using domain-specific vocabulary papers actually use, not colloquial phrasing
- For each result: title, authors, institution, key finding, URL

### Posture 2: DATA
Find primary data — surveys, government statistics, industry reports with raw numbers.
- BLS, Census, Stack Overflow survey, GitHub Octoverse, DORA report
- For each result: source, metric, value, date, URL

### Posture 3: ADJACENT FIELD
Identify a discipline that studies a closely related mechanism but isn't typically cited in this topic.
- Cognitive science, labor economics, neuroscience, sociology
- For each result: field, paper/source, key finding, why it's relevant

### Posture 4: COUNTERPOINT
Find the strongest published argument against the mainstream/consensus claim on this topic.
- Search for "[topic] criticism", "[finding] replication failure", skeptical takes
- For each result: source, argument, what it undermines

### Posture 5: PRIMARY SOURCE
Who is the original author of the most-cited claim in this topic? Find their actual words, not a summary.
- Search for named studies, quoted figures, trace claims to origin
- For each result: name, institution, exact quote or finding, URL

### Source Classification
For every source found, classify quality:
- **Primary** — original research, raw data, first-person account
- **Secondary** — reporting on primary research (journalism, blog posts citing studies)
- **Tertiary** — summaries of secondary sources (Wikipedia, listicles)

Output: findings organized by posture, each entry classified by source quality.

---

## Phase 4: ACH Matrix (Analysis of Competing Hypotheses)

Generate 2-4 plausible hypotheses that could explain the answer to the query.

Build a matrix: hypotheses × evidence. For each cell, score:
- **+** this evidence is consistent with this hypothesis
- **-** this evidence is inconsistent with this hypothesis
- **0** this evidence does not bear on this hypothesis

**Critical:** The winning hypothesis is the one with the *least inconsistent evidence*, not the most consistent evidence. Absence of inconsistency is more diagnostic than presence of support.

Output: the matrix with scores, and which hypothesis is hardest to disprove.

---

## Phase 5: Synthesis

Produce the final research brief. Rules:

1. **Kent-scale probability language** for all claims:
   - Almost certainly (93–99%)
   - Highly likely (80–93%)
   - Likely / Probably (55–80%)
   - Roughly even chance (45–55%)
   - Unlikely (20–45%)
   - Highly unlikely (7–20%)
   - Almost certainly not (1–7%)

2. **"So what" test** — only include findings that change understanding of the query or alter confidence in a hypothesis. True but irrelevant information gets cut.

3. **Open questions** — list what remains unanswered and what further research would resolve it.

4. **Source audit** — flag any claim that relies on a single source, or where sources disagree.

### Output Format

```
# Research Brief: [query]

## Key Findings
[Numbered list of findings, each with Kent-scale confidence and source citation]

## Competing Hypotheses
[Summary of ACH results — which hypothesis survived and why]

## Open Questions
[What this research did not resolve]

## Source Quality Notes
[Where the evidence is weak, biased, or contested]

## Best Sources Found
[Top 5-8 sources ranked by quality and relevance, with URLs]
```

---

## Stop Conditions

This pipeline is expensive. Check between phases:
- Have the last 3 searches added zero new claims? → stop, synthesize what you have
- Are all EEIs from Phase 2 answered? → stop, move to synthesis
- Is the "so what" test failing on new findings? → stop, diminishing returns
