---
title: "05 — Requirement Area 3: Module Lifecycle & Scheduling"
order: 5
description: "Module lifecycle (create/edit/archive/delete), roster management, ordering/chaining, and the calendar."
---

Flows requested: 3.1 module management (create/edit/archive/delete/complete) · 3.2 adding and
removing clients · 3.3 ordering/chaining/calendar organization. Sources: v1
`docs/logic/business-logic-classes.md` [cls], v1 `research/knowledge-base.md` [kb], v3
`DOMAIN.md` [DOM], `prisma/schema.prisma` [schema3], `artifacts/m1-gate/*` [gate/b11/ERD].

Vocabulary reminder: **module** = curriculum unit · **module-run** = one module taught in one
class in one round · **class** = the weekday cohort · **session** = one night.

---

## 3.1 — Module & class lifecycle

```mermaid
flowchart TD
    C(["Class created — Owner/Admin<br/>seeds the track's default rotation rows"]) --> P["Planned — named + track, no schedule yet"]
    P --> U["Upcoming — start date + meeting slots set<br/>2 Teachers assigned (D-08)"]
    U --> F["In flight — first night reached<br/>the practice day (America/Denver)"]
    F --> R1["Run planned — run rows carry intent only"]
    R1 --> R2["Run teaching — nights recorded as history"]
    R2 --> R2R["Nights taught · skipped · made up"]
    R2R --> R2
    R2 --> R3["Run complete — DERIVED from taught sessions"]
    R3 -->|"chain next run after the 1-week break [DOM B-11]"| R1
    R3 -->|"last module of the rotation → round N+1, no cap [B-5]"| R1
    R1 -.->|"boundary reached with nothing planned —<br/>the Thursday meeting plans it [B-16]"| R1
    F --> FIN["Finished — final intended run complete — derived + surfaced;<br/>the human Archive act is prompted here"]
    FIN --> ARC["Archived — Owner/Admin; retained<br/>(minors: into adulthood) [A-10]"]
    F -->|"archive mid-run — requires explicit<br/>per-client exit events first"| ARC
    ARC -->|"reopen"| F
    P --> DEL["Deleted — only when NO attendance<br/>or notes exist anywhere"]
    U --> DEL
    FIN -.->|"blocked while any attendance or notes exist —<br/>legal record [A-10] → archive instead"| ARC
```

(States other than **Archived** are derived, never stored — REQ-MM-02.)

**Requirements**

- REQ-MM-01 — Creating a class (Owner/Admin): name, track, meeting pattern (list of
  weekday+time slots), capacity; the track's default rotation rows are seeded and are
  immediately editable per-class (inherited A-9).
- REQ-MM-02 — Class states are **derived** (planned/upcoming/in-flight/finished) from dates and
  taught history; **Archived is a human act**; nothing auto-completes (v1 B6 lesson) —
  the derived "finished" state is surfaced so the human archive act is prompted, not forgotten.
- REQ-MM-03 — Module-runs are rows: one per (class, round, rotation index) with planned weeks
  and planned start; "planned dates are intent, sessions are history" (schema3:84).
- REQ-MM-04 — Editing a run (length, start, order of *future* runs, Teachers) never regenerates
  or touches sessions with attendance or notes; already-taught history is immutable. The v1
  regeneration hazards (cascade-deleted leader rows, detached notes — sc:48-51) are designed
  out permanently.
- REQ-MM-05 — Run completion is derived from taught sessions; per-client completion is a
  separate human act (D-12).
- REQ-MM-06 — Archive requires every client to have an explicit exit event (or explicit
  transfer); archiving never mutates attendance/notes.
- REQ-MM-07 — Deletion is permitted only when no attendance or notes exist anywhere in the
  class; otherwise archive-with-retention is the only path (legal record — DOM A-10).
- REQ-MM-08 — Reopen from Archived returns the class to its derived state without fabricated
  history.

**Edge cases:** edit module length mid-run (future sessions re-project, taught weeks
immutable); reorder remaining modules mid-round (legitimate — A-9; reservations pointing at a
moved target get re-confirmed); change meeting days mid-run (future-only; no destructive
regeneration); class merge (two Tue/Thu sections — exit+place pairs, rotation history forks);
class split (Layer C seat assignment); archive mid-run (per-client exits first); round rollover
timing (Thursday meeting — O-05); zero-client run (floor question, O-17 min-viable-size
lineage); a class pauses 3 weeks (clock simply frozen — pause is absence of taught nights,
planned dates drift visibly — **O-26 recommendation**: show drift explicitly rather than model
a pause entity).

---

## 3.2 — Adding / removing clients from a module

```mermaid
flowchart TB
    subgraph "Thursday review meeting — staff, weekly heartbeat [DOM B-16]"
        T1["Rank waitlisted clients:<br/>internal priority first, then longest-waiting — displayed"]
        T2["Review paperwork signals:<br/>agreement signed · book mailed · first payment · ROI —<br/>surfaced, never a gate [v1 I4]"]
        T3["Pick class + target run —<br/>seats offered only for modules AHEAD of the class position [v1 B5]"]
        T4["RESERVE the seat — firm reservation<br/>recommendation: keep the reservation entity (O-02)"]
    end
    subgraph "System — derivations, never gates"
        S1["Open seats = capacity − active members −<br/>live reservations + departing count"]
        S2["Boundary arrives: target run's first night taught"]
        S3["PLACED event — opens the membership window"]
        S4["2-week close flag after two taught weeks —<br/>override via decision record (O-07)"]
        S5["Red / yellow end-of-round + miss-ladder flags"]
    end
    subgraph "Any staff"
        U1["Attendance nightly (04 §2.1)"]
    end
    subgraph "Owner — Layer C"
        O1["Mid-run exit: DROPPED + reason + decision record"]
        O2["Override: close rule · capacity · ladder flags"]
    end
    T1 --> T2 --> T3 --> T4 --> S2 --> S3 --> S4
    S1 --> T3
    S4 --> O2
    U1 --> S5
    O1 --> S5
    S3 --> U1
```

**Requirements**

- REQ-MM-09 — Roster add: waitlist → (Thursday) firm **reservation** for a specific future
  module-run → **PLACED** at the boundary (O-02 recommendation: keep the reservation entity —
  it matches the practice's real workflow and v1's FutureEnrollment precedent).
- REQ-MM-10 — Reservation slides with its run (targets a run, never a date); if the run moves
  materially (reordered, delayed >2 weeks), the placement surface flags it for re-confirmation.
- REQ-MM-11 — Roster remove: DROPPED or GRADUATED (human acts) close the membership window;
  transfers out are modeled as explicit exit + placement pairs.
- REQ-MM-12 — A client holds at most one open waitlist entry and at most one live reservation.
- REQ-MM-13 — Over-reservation (more reservations than seats after a capacity shrink) surfaces
  as a collision on the placement surface with the ranking shown — the owner chooses; nothing
  auto-evicts.
- REQ-MM-14 — Paperwork signals are surfaced next to candidates, never enforced.

**Edge cases:** reserved client's boundary moves (re-confirm); waitlist withdrawal mid-reservation
(reservation released); returning client alignment (wait for un-completed module — kb:39);
teen turns 18 mid-program (track crossover, O-20); family seat-unit question for multifamily
(O-16); capacity change mid-run (shrink = over-capacity flag, never eviction).

---

## 3.3 — Ordering, chaining, and calendar organization

```mermaid
flowchart TD
    A["Class created under a Track —<br/>default rotation rows seeded, editable per-class (A-9)"] --> B["Run rows: order · planned weeks · planned start ·<br/>2 Teachers per run (D-08; assignment per run — B-12 lineage)"]
    B --> C{"Thursday meeting plans<br/>the next run (B-16)"}
    C -->|"holiday flex — take a week off,<br/>that pushes the dates [b11 66-68]"| F["Shift planned start — the 1-week break<br/>absorbs some flex (O-27: is the break a scheduled<br/>gap or planning slack?)"]
    C -->|"no flex"| H["Project the calendar — DERIVED, never stored as truth:<br/>walk the meeting pattern · 1–2 nights/week ·<br/>1-week break between runs"]
    F --> H
    H --> I["Nights happen → sessions recorded as history<br/>(cancelled nights leave gaps — 04 §cancellation)"]
    I --> J{"Run complete? — derived<br/>from taught sessions"}
    J -->|"not last module"| P["Chain next run — same class, next rotation index"]
    J -->|"last module"| Q["Round rollover — roundNumber+1, same class (B-5)<br/>ladder + free-pass reset · round-2 conversation prompts"]
    P --> C
    Q --> C
    H -.->|"drift check: planned vs taught<br/>is DISPLAYED, never auto-corrected"| C
```

**The weekly grid** (organization target — the real practice grid, kb:46-53):

| Slot | Mon | Tue | Wed | Thu |
|---|---|---|---|---|
| 9–10am | | Adult AM (in-person) | Adult AM (in-person) | |
| 6–7pm | | Adult PM #1 + #2 (virtual) | Teen MF (online) | Teen MF (in-person) · Adult PM #1 + #2 (virtual) |
| 6–8pm | | | Adult PM Wed (virtual) | |

- REQ-MM-15 — The meeting pattern is a **list of slots** (weekday + time + format), not a
  single weekday string (v3's shape defect — gate fable-gate-review.md:84-87); format can vary
  per night (teen: Wed online, Thu in-person).
- REQ-MM-16 — The forward calendar is a **projection** derived from run rows + meeting pattern;
  it is never authoritative history; drift between planned and taught is displayed, not hidden.
- REQ-MM-17 — Chaining: next run auto-projected after the 1-week break; round rollover
  auto-projected after the last module; both await Thursday-meeting confirmation (humans plan;
  the system proposes).
- REQ-MM-18 — One session per class per calendar date (no same-night doubles; makeup dates
  must not collide — surfaced if they would).
- REQ-MM-19 — Practice-day timezone = America/Denver; sessions store UTC-midnight dates; the
  6pm-MT/UTC-day-flip is handled once, centrally (v1 C1 lesson; see 08 §5 DST edge).

**Edge cases:** the two identical Tue/Thu PM sections (#1/#2 disambiguation everywhere —
rosters, zoom links, printed lists); two classes booked into the same zoom/room (no resource
model exists yet — flagged in 08 §4 as a real collision risk); makeup landing in a break week
or on another class's night (allowed but flagged); a whole practice-week dark (holiday — five
classes × bulk-cancel; 08 §4 recommends a practice-wide holiday calendar); DST shift for
evening classes; module content updated mid-year (new manual edition — runs record what was
taught; no content versioning needed at ~30-client scale, revisit if curriculum tracking
enters scope).
