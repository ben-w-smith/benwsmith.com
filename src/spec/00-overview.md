---
title: "DBT Network of Utah — Dashboard v4 Requirements Specification"
order: 0
description: "Decision log D-01…D-15 from the 2026-09-05 interview, glossary, scope, and what v4 inherits from v1/v3."
---

**Fresh-start requirements · 2026-09-05 · Audience: Ben · Requirements only — no code.**

This specification was produced by: (1) seven analysis subagents fanning across the three prior
repos — `~/development/dbtdashboard` (v1), `~/development/dbtdashboard2` (v2),
`~/development/dbtdashboardv3` (v3); (2) external research on the canonical Linehan DBT
skills-training structure (note: **Marsha Linehan** — the repos confirm the spelling);
(3) a five-round Senior-PM interview with Ben on 2026-09-05. Every practice claim carries a
repo citation (`path:line`); every external claim carries a source in
[09-references.md](/dbt-spec/09-references/). Undecided items are marked **OPEN** and carry a
recommendation in [07-open-decisions.md](/dbt-spec/07-open-decisions/) — nothing is silently decided.

---

## 1. The decision this spec serves

v4 is a **complete fresh start**. Multiple prior LLM reviews of v1/v2/v3 argued for evolving or
refactoring instead of restarting; those opinions are catalogued (for the record) in
[09-references.md](/dbt-spec/09-references/) and are **superseded** — per Ben, 2026-09-05:
*"I am starting this fresh, no objections will be considered."* This document does not relitigate
that decision; it specifies what the fresh start must do.

### Decision log (from the 2026-09-05 interview)

| # | Decision | Round |
|---|----------|-------|
| **D-01** | Complete fresh start (v4). Prior "evolve, don't rework" opinions recorded, not actioned. | R1 |
| **D-02** | Deliverable = complete requirements spec for future work. No code. | R1 |
| **D-03** | Audience: Ben alone. | R1 |
| **D-04** | Staff-only system — clients (patients) never log in. | R1 |
| **D-05** | No SimplePractice integration of any kind. (The practice bills there; this system ignores it.) | R3 |
| **D-06** | **In scope:** client lifecycle · attendance · session close/lock · session & client notes · module & calendar management · intake pipeline & waitlists. | R1/R2 |
| **D-07** | **Out of scope:** billing tracking · graduation gifts + post-graduation re-enroll machinery · legacy spreadsheet import. (Raises the day-one data-entry question — **O-01**.) | R2 |
| **D-08** | Roles: **Owner (Christy) · Admin · Provider · Teacher · Developer (Ben)**. Two Teachers per class; employees swap roles between classes; no separate co-lead/assistant role. | R3/R4 |
| **D-09** | Miss rule of record: **cumulative misses within a series**; escalation **warn@2 → critical@3 → max@4**; **advisory only** — removal is always a human act; **missed individual-therapy appointments also count** (Providers log them). | R2/R4 |
| **D-10** | Attendance codes: **Present · Late · Absent · Free-pass**. **Late = present** (never a miss). **Every absence counts** toward the ladder, including a free-pass absence. One free-pass per series, recorded as a fact. | R5 |
| **D-11** | Graduation: eligibility = the client's **personal curriculum coverage** (all modules of the rotation, from any join point); the graduation act itself is **human, never automatic**. | R3 |
| **D-12** | MODULE_COMPLETED per client: a **human marks it; the system suggests** (attendance summary for the finished run). | R4 |
| **D-13** | Session cancellation supports **all three outcomes**: skip (permanent gap) · shift the calendar · makeup session. | R3 |
| **D-14** | Sessions have an explicit **"close/lock the night" ritual act** — easy to undo; corrections still possible afterward. | R3 |
| **D-15** | Series ≡ round (one round = one pass through the track's rotation) — carried forward from v3 `DOMAIN.md` B-4. | inherited |

---

## 2. Document map

| Doc | Contents |
|-----|----------|
| [01-linehan-standard.md](/dbt-spec/01-linehan-standard/) | How DBT classes are **expected** to flow per Linehan — the canonical baseline, with mermaid diagrams and external citations. |
| [02-dbtu-custom-practice.md](/dbt-spec/02-dbtu-custom-practice/) | How **DBT Network of Utah actually runs classes** — their own business practices, with mermaid diagrams, repo citations, and a delta table vs the Linehan baseline. |
| [03-client-lifecycle.md](/dbt-spec/03-client-lifecycle/) | Requirement area 1 — client lifecycle flows (1.1 sign-up→graduation, 1.2 through a module, 1.3 module→module), use cases, edge cases, REQs. |
| [04-session-operations.md](/dbt-spec/04-session-operations/) | Requirement area 2 — attendance (2.1), close/lock the session (2.2), notes (2.3), cancellation modes, miss-rule engine. |
| [05-module-management.md](/dbt-spec/05-module-management/) | Requirement area 3 — module lifecycle (3.1a–e), roster management (3.2), ordering/chaining/calendar (3.3). |
| [06-roles-and-permissions.md](/dbt-spec/06-roles-and-permissions/) | The five-role model (D-08), permission matrix, two-Teachers-per-class. |
| [07-open-decisions.md](/dbt-spec/07-open-decisions/) | The open-decision register — every unresolved question, each with a recommendation and impact. |
| [08-missed-use-cases.md](/dbt-spec/08-missed-use-cases/) | The missed-use-case catalog — scenarios absent from all three prior repos. |
| [09-references.md](/dbt-spec/09-references/) | Full citations: repo documents (path:line), prior agentic opinions (locations), external Linehan sources (URLs, books). |
| [10-scene-inventory.md](/dbt-spec/10-scene-inventory/) | Scene inventory — 13 staff moments, each with a five-line wireframe card for prototyping in Claude Design; build order, navigation map, review protocol, prompt seed. |

Diagrams are GitHub/VS Code/Obsidian-renderable mermaid. Terms follow the glossary below.

---

## 3. Glossary

| Term | Meaning in this spec |
|------|----------------------|
| **Module** | A DBT curriculum unit taught over multiple sessions: Distress Tolerance (DT), Emotion Regulation (ER), Interpersonal Effectiveness (IE); the Teen track adds Walking the Middle Path (MP). **Mindfulness is never a module** — it is a ~20-minute opening segment of every session (`v3 DOMAIN.md:28`). |
| **Session / class night** | One class meeting on one date. |
| **Class** | The recurring weekday cohort (e.g., "the Tue/Thurs 6–7pm Adult class"). ⚠️ **Ambiguous in Utah speech** — can also mean a module-run ("the 12-week class", `v3 artifacts/m1-gate/b11-proposal.md:63-65`) or a single night ("misses four classes", `v3 DOMAIN.md:57`). This spec uses *class* = cohort; quoted practice speech keeps its original sense, flagged. |
| **Module-run** | One module taught in one class in one round. |
| **Round / series** | One complete pass through a track's rotation (~28 weeks adult, ~26 weeks teen, plus breaks). Clients commonly complete two; no hard cap (Brynn = 3-round case, `v1 docs/requirements/dbt-utah-2026-06.md:65`). |
| **Track** | Adult · Teen ("multifamily" — parents participate, `v3 b11-proposal.md:26`). |
| **Boundary** | The seam between module-runs — the **only** entry point for clients (v3 A-4, `DOMAIN.md:39`). |
| **Membership window** | From a client's placement into a class until their exit. |
| **Teacher** | Staff member running class nights. Two per class (D-08). Practice speech also says "proctor", "leader", "co-teacher". |
| **Provider** | Individual therapist. |
| **Free-pass** | The one recorded free absence per series (formerly "free no-show"). Counts as a miss in the ladder (D-10); retained as a recorded fact. |
| **Miss ladder** | The D-09 escalation: warn@2 / critical@3 / max@4 cumulative misses within a series. |
| **Thursday meeting** | The weekly staff review — "the operational heartbeat" (`v3 DOMAIN.md:67` B-16) where placement and run planning happen. |
| **Layer A/B/C** | Documentation practice inherited from v3 `DOMAIN.md`: Layer A invariants / Layer B parameters / Layer C owner discretion. v4 keeps the discipline. |

**User vs client** (per Ben's definitions): *users* = staff (Owner, Admin, Provider, Teacher, Developer); *clients* = patients of DBT Network of Utah. Clients never touch the system (D-04).

---

## 4. What v4 deliberately inherits (ideas, not code)

A fresh start does not mean amnesia. These concepts earned their place:

**From v3** (`dbtdashboardv3/DOMAIN.md`, `DECISIONS.md`, `AGENTS.md`):
- Single-source domain doc discipline ("if a domain fact is not in this file, it is not a fact").
- Layer A/B/C (invariant / parameter / discretion) with owner-discretion acts recorded as decision records.
- **Append-only event spine** for client history; statuses derived at read time, never stored.
- **Record, never enforce** — advisory flags + human acts for every exit; **derive, don't cache**.
- **Soft-delete corrections** on the legal record (attendance/notes): correction = delete-old + append-new.
- "Planned dates are intent, sessions are history" (`v3 prisma/schema.prisma:84`).
- America/Denver as the practice-day timezone.
- v1's documented failure mode to avoid forever: 68,787 lines of markdown vs 38,393 lines of TypeScript (`v3 README.md:24-27`) — documentation bloat killed v1.

**From v1** (`dbtdashboard/research/knowledge-base.md`, `docs/logic/business-logic-*.md`, `docs/requirements/*`):
- The mined practice knowledge: pipeline stages, module rotation, waitlists, miss rules, graduation, multifamily specifics.
- The session-night flow ("the most-used flow in the product", `v1 docs/pack/flows/attendance.md:3`).
- The three-mode cancellation spec (`v1 docs/requirements/session-cancellation.md`) — finally built in v4 (D-13).
- Notes as near-first-class for providers (`v1 docs/requirements/notes-for-providers.md:5-7`).
- The flat-clinical-access / single-treatment-team HIPAA doctrine (`v1 docs/compliance/GAPS.md:11-17`).
- The regeneration hazards to design out: schedule edits that cascade-delete leader rows and silently detach clinical notes (`v1 session-cancellation.md:48-51`); import-day classes with no schedule (`v1 business-logic-classes.md:438-443`).

---

## 5. How to read this spec

- **[C]** markers = repo citation; **[S]** = external source (09-references).
- REQ-xx numbers are requirement candidates (behavior-level, implementation-free).
- Where prior generations conflicted, the chosen variant cites the decision (D-xx); rejected variants are named once, with their source, so the reasoning survives.
- 07-open-decisions.md is the punch list for the next conversation (Ben → Christy/Brittany where noted).
