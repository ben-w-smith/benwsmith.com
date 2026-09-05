---
title: "03 — Requirement Area 1: Client Lifecycle"
order: 3
description: "Client lifecycle flows: contact→graduation, movement through a module, module→module and round→round."
---

Per D-04 (staff-only) and the R2 interview answer, "user lifecycle" = **client** lifecycle.
Three flows requested: 1.1 initial contact → graduation; 1.2 movement through a module;
1.3 module → module. Sources: v1 `research/knowledge-base.md` [kb], v1
`docs/logic/business-logic-pipeline.md` [pipe], v1 `docs/logic/business-logic-classes.md`
[cls], v3 `DOMAIN.md` [DOM], `prisma/schema.prisma` [schema3], `artifacts/m1-gate/*` [gate/b11].

---

## 1.1 — Full client lifecycle (contact → graduation/exit)

```mermaid
flowchart TD
    START(["Person contacts the practice"]) --> SCR["Screening — Google Form<br/>data lives outside the system [kb 68-70]"]
    SCR --> INQ["INQUIRY recorded — system entry point [kb 71]"]
    INQ --> PRE["PRETREATMENT — ~4 weeks, informational<br/>no seat held, mutual selection at the end [kb 77-82 · DOM B-10]"]
    INQ -.->|"dead-ends here [gate A2]"| NP(["NOT_PROCEEDING — exited before class membership [schema3 179-185]"])
    PRE -->|"mutual yes"| WL["WAITLISTED — exactly one of Teen / Adult / Internal<br/>internal shows priority, never enforces [kb 84-90 · DOM B-9]"]
    PRE -.->|"mutual no, or practice-initiated pre-enrollment exit"| NP
    WL -->|"Thursday meeting assigns a seat<br/>AT a module boundary [DOM A-4 · B-16]"| PL["PLACED — opens the membership window [schema3 174-178 · gate A1]"]
    PL --> ACT["ACTIVE — attends sessions, moves through module-runs<br/>see 1.2 and 1.3"]
    ACT --> EOR["End-of-round signal: RED final module ·<br/>YELLOW second-to-last — prompt for the round-2 conversation [DOM B-14]"]
    EOR --> GELIG{"Graduation eligibility — DERIVED, advisory:<br/>client's PERSONAL coverage of the full rotation (D-11)<br/>mid-rotation joiners measured individually"}
    GELIG --> GD{{"GRADUATION — a HUMAN act<br/>never auto-written [gate A3]"}}
    GD --> GRAD(["GRADUATED — terminal success"])
    ACT -.->|"miss ladder advises (D-09) — a human decides"| DD{{"Drop decision — human [DOM B-6]"}}
    DD --> DROP(["DROPPED — terminal, reason recorded"])
    DROP -.->|"re-entry = Christy discretion<br/>rides a decision record [DOM 71-76]"| RD{{"Re-entry decision"}}
    RD -.->|"(O-06) target: waitlist / intake / direct placement"| WL
    RD -.->|"declined"| NP
    NP -.->|"(O-06) re-inquiry after pre-enrollment exit"| INQ
    DROP -.->|"restart alignment: may wait for an<br/>un-completed module start [kb 39 · DOM Layer C]"| WL
```

Hexagon `{{ }}` = human discretion point. Dashed = open or discretionary path.

**Happy-path requirements**

- REQ-CL-01 — The system records the client journey as an **append-only event spine**;
  statuses (inquiry / pretreatment / waitlisted / placed / active / graduated / dropped /
  not-proceeding) are **derived at read time, never stored** (inherited v3 Rule 2).
- REQ-CL-02 — A client holds **at most one open waitlist entry** across all three lists,
  enforced structurally (v3 ERD.md:151-159 precedent).
- REQ-CL-03 — Internal-list priority is **displayed** (placement ranking surface), never
  enforced.
- REQ-CL-04 — Placement happens at **module boundaries only**; the placement event carries the
  boundary date and opens the membership window.
- REQ-CL-05 — Graduation eligibility = personal coverage (all modules of the client's track
  rotation completed, per D-11/D-12); the eligibility display is advisory; the GRADUATED act is
  human and appends an event.
- REQ-CL-06 — DROPPED is reachable from any non-terminal stage; the drop records date, actor,
  reason, and the client's completed-modules snapshot.
- REQ-CL-07 — Re-entry after DROPPED is recorded as a discrete event riding a decision record
  (who/when/why invited/what it overrode); the entry target is **O-06**.
- REQ-CL-08 — NOT_PROCEEDING covers inquiry dead-ends, pretreatment declines, and waitlist
  withdrawals (gate A2), with an optional reason discriminator.

**Edge cases to cover** (full catalog: [08-missed-use-cases.md](/dbt-spec/08-missed-use-cases/))

| # | Case | Handling direction |
|---|---|---|
| 1 | Pretreatment restart after a gap | New PRETREATMENT_STARTED event; clock per-attempt (**open**, O-06 scope) |
| 2 | Placed but never attends first session | Miss clock anchor: from PLACED or first attendance? Exit path = drop with reason (**open**) |
| 3 | Placed into a run already >2 weeks in | 2-week close rule — surface as flag + owner override (**O-07**) |
| 4 | Duplicate client records | Merge tool or void-and-recreate (**open**; v1's unique constraints made this crash — pipe R44) |
| 5 | Deceased / permanently departed | Neither terminal fits; vocabulary gap (**O-24**) |
| 6 | Teen ages out / track crossover | Track-change event needed (**O-20**) |
| 7 | Client in two classes at once | Default: one active membership window; family dual-seat question (**O-16**) |
| 8 | timesGraduated integrity | Counter starts at 0 (v1 bug: born at 1 — cls G2) |
| 9 | Graduated client returns later | Post-grad re-enroll machinery OUT (D-07); record as new inquiry carrying history (**open**) |
| 10 | Early mutually-agreed completion mid-round | No "mutual early completion" reason exists — add to reason list (**open**) |

---

## 1.2 — Movement through a single module

```mermaid
flowchart TD
    B["Module boundary — PLACED takes effect here [schema3 174-178]"] --> W2["Weeks 1–2: new entrants allowed<br/>CLOSED after week 2 [kb 35 · b11 63-65] — flag + override (O-07)"]
    W2 --> S["Session night — mark each client:<br/>PRESENT · LATE = present · ABSENT · FREE-PASS (D-10)<br/>corrections = soft-delete old + append new [gate A4]"]
    S --> LAD{"Miss ladder — DERIVED, advisory (D-09)<br/>cumulative in series; every ABSENT and FREE-PASS counts;<br/>LATE never counts"}
    LAD -->|"cumulative 2"| W2W["WARN flag"]
    LAD -->|"cumulative 3"| C3["CRITICAL flag"]
    LAD -->|"cumulative 4"| C4["MAX flag — human decides; system never drops"]
    W2W --> S
    C3 --> S
    C4 -.-> DD2{{"Human drop decision"}}
    S --> MORE{"More nights in this run?<br/>length from the class's own run rows [DOM B-11]"}
    MORE -->|"yes"| S
    S -.->|"night cancelled — three modes (D-13)<br/>see 04 §4"| CANC["Cancelled / made up / shifted"]
    CANC --> MORE
    MORE -->|"run ends"| SUG{"System shows the client's attendance summary<br/>for the finished run (D-12)"}
    SUG --> MC{{"Staff mark MODULE_COMPLETED — human act (D-12)"}}
    MC --> BRK["1-week break [DOM B-11]"]
    BRK --> NXT["Next module run — see 1.3"]
```

**Requirements**

- REQ-CL-09 — Module completion per client is **human-marked with a system suggestion** (D-12):
  the suggestion surface shows the client's attendance for the finished run; no auto-threshold.
- REQ-CL-10 — Miss ladder derivation: cumulative ABSENT + FREE-PASS within the current series
  (≡ round); LATE and PRESENT never count; cancelled nights are skipped; the ladder resets at
  each round's first session (free-pass window likewise).
- REQ-CL-11 — Missed **individual-therapy** appointments feed the same ladder (D-09); logged by
  the client's Provider against the current series (**O-15**: surface design).
- REQ-CL-12 — Mid-module drop: the completed-modules snapshot records only modules the client
  completed (the in-progress module does NOT auto-count — rejecting v1 cls G4's inference;
  partial-credit semantics confirmed with practice per O-06).
- REQ-CL-13 — 2-week close is a **surfaced flag with owner override**, never a block (O-07
  recommendation; consistent with record-never-enforce).

---

## 1.3 — Module → module, round → round, graduation decision

```mermaid
flowchart TD
    MC["MODULE_COMPLETED — human-marked (D-12)"] --> BRK["1-week break between runs [DOM B-11]<br/>holiday flex stretches dates [b11 66-68]"]
    BRK --> MR{"Another module in this round?<br/>order + length from the CLASS's own run rows —<br/>adult DT→IE→ER · teen MP→DT→IE→ER [DOM A-9, B-1, B-2]"}
    MR -->|"yes"| RUN["Next module run — client continues<br/>in the same membership window"]
    MR -->|"no — round complete"| RC["Round boundary — series ≡ round [DOM B-4]<br/>miss ladder + free-pass reset (D-09/D-10)"]
    RUN --> SESS["Sessions — see 1.2"]
    SESS --> MC
    RC --> SIG["RED / YELLOW end-of-round signal — advisory prompt<br/>for the round-2 conversation [DOM B-14]"]
    SIG --> R2C{{"Round-2 conversation — client + practice"}}
    R2C -->|"continue"| R2["Round 2 — recommendation: membership window<br/>CONTINUES implicitly, no new placement (O-05)"]
    R2 --> RUN
    R2 -.->|"(O-05) continuing in a DIFFERENT class<br/>at a different rotation position"| RUN
    R2C --> GDEC{{"Graduation decision — human (D-11)"}}
    GDEC -->|"eligibility: PERSONAL coverage of the<br/>full rotation — derived + advisory"| GRAD(["GRADUATED"])
    R2C --> XIT{{"Exit decision"}} --> DROP(["DROPPED — return via re-entry path, 1.1"])
    GRAD --> OUT["Post-grad programs (Booster / Next Steps /<br/>Shame Resiliency / EMDR / discontinue) [kb 207-212]<br/>tracking OUT of scope (D-07)"]
```

**Requirements**

- REQ-CL-14 — The class's rotation order and module lengths are **per-class rows** (never
  constants); defaults seeded from the track on class creation (inherited v3 A-9).
- REQ-CL-15 — Round boundary is derived from taught history (last run of the rotation
  completed), never hard-coded; the miss ladder and free-pass window reset at each round's
  first session.
- REQ-CL-16 — "X of N" progress display: recommendation = across-two-rounds denominator
  (X of 6 adult / X of 8 teen), **unclamped** for round 3+ (**O-18**).
- REQ-CL-17 — Mid-rotation joiners: personal coverage tracked per client; the end-of-round
  red/yellow signal and graduation eligibility evaluate each client's own coverage, not the
  class calendar (D-11 consequence; v1 never computed this — cls U8).
- REQ-CL-18 — A client may continue a subsequent round in a different class; modeled as an
  exit-from-old-membership + placement-at-boundary pair (**O-05**).
- REQ-CL-19 — A dropped client's restart alignment (wait for an un-completed module) is a
  recorded discretionary act riding a decision record [kb:39; DOM Layer C].

**Design note — the four topology decisions this area rides on** (from the wave-2 analysis,
now mostly settled): graduation = personal coverage (settled, D-11); MODULE_COMPLETED =
human-marked (settled, D-12); round-2 continuation vs new placement (**O-05** — recommend
implicit continuation); re-entry target (**O-06** — recommend waitlist with preserved
completions).
