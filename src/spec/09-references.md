---
title: "09 — References & Citations"
order: 9
description: "Full citations: repo path:line sources, prior agentic opinions, external Linehan sources."
---

## §1 Repo primary sources (practice knowledge & prior specs)

All paths relative to the two repos:

**v1 — `~/development/dbtdashboard/`**
| Ref | Path | What it supports |
|---|---|---|
| [kb] | `research/knowledge-base.md` | The practice knowledge base (interviews + 14-tab Master Log): pipeline stages 64–108; module rules 34–39; class grid 46–53; attendance codes 113–131; miss rule 133–138; graduation 196–205; multifamily 217–224; staff roster 228–240 |
| [pipe] | `docs/logic/business-logic-pipeline.md` | Pipeline machine: status enum :18; transition side effects 51–58; restore/waitlist/open conflicts 64–130, 305–332 |
| [cls] | `docs/logic/business-logic-classes.md` | Class/module rules: rotation :17–21; clock :55; regeneration hazards 143–147; delete/archive guards 273–275; open questions 438–461 (U1–U9) |
| [billing] | `docs/logic/business-logic-billing-auth-import.md` | Auth (15-min JWT, HIPAA logoff) 174–177; roles reality 207–209; import behavior 258–310 |
| [req] | `docs/requirements/dbt-utah-2026-06.md` | June stakeholder meeting: series/rounds :21–30; drop reasons :68 |
| [owner-dec] | `docs/archive/estate-2026-08/audit/2026-06-16-owner-decisions.md` | Owner decisions: capacity :10; internal list :14; **cumulative miss policy :18**; DEV/SUDO :19; N-don't-charge :63 |
| [att] | `docs/pack/flows/attendance.md` | Session-night flow; Y/L/N/FREE codes :15 |
| [sc] | `docs/requirements/session-cancellation.md` | The three cancellation modes :6–31; "do not renumber" :30–31; unbuilt status :35–43 |
| [np] | `docs/requirements/notes-for-providers.md` | Notes-as-first-class :5–7; orphaned noteCompleted 33–39; queue value :50; SetNull hazard 68–70 |
| [flows-design] | `docs/archive/estate-2026-08/superpowers/specs/2026-06-10-dbt-user-flows-design.md` | Session-night + Thursday placement flows 57–66, 160–197 |
| [gaps] | `docs/compliance/GAPS.md` | Flat clinical access / treatment-team doctrine :11–17 |
| [data-inv] | `docs/compliance/DATA_INVENTORY.md` | Note classification :108 |
| [MAP-0] | `docs/pack/MAP-0.md` | Roles table 9–16; pipeline :5 |

**v2 — `~/development/dbtdashboard2/`** (minimal demo; lessons list)
`PLAN.md` — why v2 existed :11–13; roles :58; re-enrollment lesson :101; UTC lesson `docs/pack/decisions.md:14`; out-of-scope list :360.

**v3 — `~/development/dbtdashboardv3/`**
| Ref | Path | What it supports |
|---|---|---|
| [DOM] | `DOMAIN.md` | The domain authority: vocabulary 20–30; Layer A invariants 36–46; Layer B parameters 52–66 (B-1…B-16); Layer C discretion 69–97 |
| [schema3] | `prisma/schema.prisma` | The model as built: ClientEvent spine 193–203; ClassModuleRun 71–91; attendance codes + corrections 240–260; planned-vs-history :84 |
| [gate] | `artifacts/m1-gate/fable-gate-review.md` | Gate verdict + amendments A1–A4 |
| [b11] | `artifacts/m1-gate/b11-proposal.md` | Practice interview extraction: 2-week close 63–65; holiday flex 66–68; cadences 21–34 |
| [ERD] | `artifacts/m1-gate/ERD.md` | Entity relations; waitlist exclusivity 151–159 |
| [package] | `artifacts/m1-gate/package.md` | Derivation rules; "X of N" semantics 58 |
| [m2-obs] | `artifacts/m2-observations/report.md` | Observed deployed behavior (cancel/undo, roster disclosure) |
| [DECISIONS] | `DECISIONS.md` · `PLAN.md` · `README.md` · `AGENTS.md` · `DEPLOY.md` | Architecture stances 55–57; anti-bloat rule README 24–27; retention + PHI context DEPLOY 62–68 |

## §2 External sources (Linehan baseline)

Books:
1. Linehan, M. M. (2015). *DBT® Skills Training Manual, 2nd ed.* Guilford Press. ISBN 9781462516995. (Revised ed. 2025 in print: https://www.guilford.com/books/DBT-Skills-Training-Manual/Marsha-Linehan/9781462556359) — modules, session structure, co-leaders, multiple curricula. ⚠️ page numbers cited online are secondhand; minute-level agenda allocations unpublished online.
2. Rathus, J. H., & Miller, A. L. (2015). *DBT® Skills Manual for Adolescents.* Guilford Press. https://www.guilford.com/books/DBT-Skills-Manual-for-Adolescents/Rathus-Miller/9781462515356 — Walking the Middle Path.
3. Linehan, M. M. (1993). *Skills Training Manual for Treating Borderline Personality Disorder.* Guilford. — open vs closed groups. ⚠️ quote via snippet; verify in print.
4. Linehan, M. M., & Wilks, C. R. (2015). "The Case Against DBT Skills Groups for Suicidal Adolescents…" in *DBT in Clinical Practice*, 2nd ed. — the four-consecutive-miss research origin.

Institutions & program pages:
5. Guilford product page (module list, curricula-of-different-durations): guilford.com link above.
6. Linehan Institute publications ("flexibility within fidelity"): https://www.linehaninstitute.org/publications-books/dbt-skills-training-manual
7. Linehan Institute free diary cards: https://www.linehaninstitute.org/dbt-assessments
8. **DBT-LBC Program Manual Guidelines** (120-minute groups; 6 months + repeat; required 4-miss & 24-hour policies; discharge/re-entry policies): https://dbt-lbc.org/certification/program-certification/program-manual-guidelines/
9. Behavioral Tech (Linehan-founded): https://behavioraltech.org/
10. Triangle Area DBT — full 24-week Table 2.2-lineage schedule: http://www.triangleareadbt.com/dbt-skills-group-shedule
11. Tom Conlon — "Schedule 1: 24 Weeks, Linehan Standard…" scan: https://www.tomconlon.ie/wp-content/uploads/2024/01/24-Week-DBT-Schedule.pdf
12. Open-enrollment implementations (module-boundary entry): dbttherapy.org; St. Louis DBT; Anova Therapy; PEACE Psychotherapy; Boston DBT.

Studies:
13. Ritschel et al. (2015), PubMed — open-enrollment, any-order modules pilot.
14. Blackford et al. (2011), PMC3191933 — 90-min weekly class, two leaders, homework-first agenda.
15. Durpoix et al. (2023), PMC10734074 — 16-session adaptation; Hastings et al. (2022) — 12-week school adaptation.

**Unverified claims (flagged, do not cite as fact):** exact session minute allocations; any verbatim "like a class" manual quote; an IE-second Linehan schedule; manual page numbers; the 1993 open-groups quote; any Linehan-authored make-up protocol.

## §3 Prior agentic opinions (catalogued; superseded by D-01)

Recorded for the record only — the fresh-start decision (2026-09-05) supersedes them:

- **v1 estate archive** `~/development/dbtdashboard/docs/archive/estate-2026-08/` — the multi-wave AI reviews: `reviews/2026-08-07-multi-agent/FINAL-REPORT.md`; `wave2-planning/salvage-decision.md` (KEEP-vs-rework table, incl. "KEEP — reference pattern… never rework it" :109); `wave3-premortems/`; `wave4-redteam/`; `reviews/2026-08-07-zcode-multipass/`.
- **v3 gate artifacts** — `fable-gate-review.md` ("PASS WITH FOUR AMENDMENTS… no further gate round is needed" :9–15); `package.md` ("Blocking findings from assembly: none" :25); `shape-checklist.md` (accept-all recommendations).
- **v3 direction docs** — DECISIONS.md:38–39 ("a further restart requires a written entry here" — this spec's decision log is that written entry's successor); README.md:24–27 ("the documentation set is closed"); AGENTS.md Rule 0; PLAN.md:103–104 ("everything else is an edit").

## §4 Interview record

Senior-PM interview, Ben, 2026-09-05, five rounds (AskUserQuestion transcripts preserved in the
session log). Outcomes codified as D-01…D-15 in [README.md](/dbt-spec/00-overview/). Notable verbatims:

- R1: *"this will be a complete fresh start requirements spec of future work"* · *"I am starting this fresh, no objections will be considered."*
- R3: *"worth adding a ritual to a session that is a 'close' or 'Lock' the session. This should be very easy to undo… a helpful ritual to the employees at DBT network of utah."* (→ D-14)
- R4: *"great catch, I guess I was thinking co-leader or co-teacher. All classes have 2 DBT network of utah (DBTNU) employees… maybe we can just have a teacher role, and allow 2 teachers to a class."* (→ D-08)
