---
title: "04 — Requirement Area 2: Session-Night Operations"
order: 4
description: "Session-night operations: attendance, the close/lock ritual, notes, cancellation modes, and the miss ladder."
---

Flows requested: 2.1 marking attendance · 2.2 marking the session complete · 2.3 notes on
clients during the session. Plus the two engines that hang off session night: cancellation
(D-13) and the miss ladder (D-09/D-10). Sources: v1 `docs/pack/flows/attendance.md` [att], v1
`docs/requirements/session-cancellation.md` [sc], v1 `docs/requirements/notes-for-providers.md`
[np], v3 `DOMAIN.md` [DOM], `prisma/schema.prisma` [schema3], `artifacts/m1-gate/*` [gate].

---

## 2.1 — Marking attendance

```mermaid
flowchart TD
    T["Teacher opens tonight's session<br/>— the most-used flow in the product [att 3]"] --> R["Roster with contact info visible<br/>(contract therapists have no SimplePractice [kb 245])"]
    R --> CN{"Night cancelled?"}
    CN -->|"yes"| CX["No marking controls — cancelled state + undo<br/>rotation clock frozen [v3 M2-S3]"]
    CN -->|"no"| GUARD{"Write guards: session exists on this date ·<br/>client's membership window open ·<br/>marker is a Teacher of the class or Admin"}
    GUARD -->|"fail"| REF["Refuse explicitly — never silently retarget a date<br/>(v1 bug ATT-20)"]
    GUARD -->|"pass"| MARK["Mark each client — one live row per client per night:<br/>PRESENT · LATE = present · ABSENT · FREE-PASS (D-10)"]
    MARK --> FREE{"FREE-PASS already used this series?"}
    FREE -->|"yes"| FR["Record as fact + advisory — record, never enforce [gate]<br/>(O-19 confirms the 4th button's purpose)"]
    FREE -->|"no"| OK["Recorded"]
    MARK --> CORR{"Changing an existing mark?"}
    CORR -->|"yes"| SD["Correction = soft-delete old row + append new<br/>legal record — never update in place [gate A4 · DOM A-10]"]
    CORR -->|"no"| DER
    OK --> DER["Derivations at read time — nothing cached:<br/>miss ladder · free-pass budget · began-attending"]
    SD --> DER
    DER --> FLAG["Advisory flags render inline on the roster<br/>ack / snooze / override-with-reason — never gates"]
```

**Requirements**

- REQ-SO-01 — Attendance codes: **Present · Late · Absent · Free-pass** (D-10). Late = present
  for all derivations; every Absent **and** Free-pass counts toward the miss ladder; one
  free-pass per series, anchored at the round's first session.
- REQ-SO-02 — At most one **live** attendance row per client per session (soft-delete +
  append for corrections — inherited gate A4).
- REQ-SO-03 — Guards: no marking on cancelled nights, future dates, off-nights, or clients
  outside an open membership window; failures are explicit.
- REQ-SO-04 — Backfilling past nights is allowed; every row carries both **effective date**
  (the session) and **recorded-at** (the write) — the audit trail distinguishes them.
- REQ-SO-05 — Unmarked clients on a past night are **not** misses; a "nights unrecorded"
  hygiene advisory surfaces to the class's Teachers (**O-08**, recommendation; spreadsheet
  blank=missed semantics rejected).
- REQ-SO-06 — A client who attended but is outside the guard (wrong section of an identical
  Tue/Thu pair, dropped-but-showed-up) gets a sanctioned "attended out-of-roster" fact or an
  annotation path, not a silent refusal (practice-bending reality; see 08 §2).

## 2.2 — Completing the session: the Close/Lock ritual (D-14)

Ben's direction (R3): *"worth adding a ritual to a session that is a 'close' or 'Lock'… very
easy to undo… a helpful ritual to the employees."* Prior generations: v1 had a COMPLETED enum
value **no user could ever set** [sc:35-43]; v3 deliberately had no completion state. v4 adds
the act back — as a soft ritual, not a lock on the legal record.

```mermaid
flowchart TD
    N["Night runs — attendance marked (2.1)<br/>notes written during class (2.3)"] --> READY{"Roster fully marked?"}
    READY -->|"no — clients unmarked"| HYG["Hygiene prompt: N clients unmarked —<br/>not misses, just unrecorded (O-08)"]
    HYG --> CH{"Teacher: CLOSE THE NIGHT?"}
    READY -->|"yes"| CH
    CH -->|"close"| CLOSE["NIGHT CLOSED — ritual act by a Teacher of the class (D-14)"]
    CLOSE --> E1["Unwritten-notes queue snapshots to the<br/>teacher's owed list (2.3)"]
    CLOSE --> E2["Miss-ladder flags refresh + surface for review"]
    CLOSE --> E3["Night's roster becomes the reference view<br/>for staff reviewing later"]
    CLOSE --> WHATNOT["Does NOT: lock attendance (corrections still append) ·<br/>advance anything (module progress is human, D-12) ·<br/>trigger billing (out of scope, D-05/D-07)"]
    CH -->|"leave open"| OPEN2["Stays open — surfaces in the<br/>unclosed-nights hygiene list"]
    CLOSE -.->|"undo — one click, always available (D-14: very easy to undo)"| OPEN2
    OPEN2 -.->|"close later, backdated"| CLOSE
```

**Requirements**

- REQ-SO-07 — A Teacher of the class (or Admin) can **close** a night; closing is a recorded
  act with actor and timestamp.
- REQ-SO-08 — **Undo is one click** and always available (re-opening is itself recorded);
  closing/undoing never mutates attendance or notes.
- REQ-SO-09 — Closing does not gate corrections: soft-delete + append remains available on
  closed nights forever (legal-record semantics, DOM A-10).
- REQ-SO-10 — Unclosed past nights surface in a hygiene list to the class's Teachers
  ("nights unrecorded" — gate Q11 lineage).
- REQ-SO-11 — Zero-attendee night: closable like any other; whether the rotation clock
  advanced is a property of taught-sessions policy (**O-13** — recommendation: the clock
  follows what the Teachers taught, independent of attendance).

## 2.3 — Notes on clients during the session

Brittany, repeatedly: "Notes are almost a first-class thing for providers" [np:5-7]. Practice
usage: attendance notes = communication between class teachers and individual therapists
[kb:243-245].

```mermaid
flowchart TD
    N["During or after class — per-client note entry<br/>on the session screen [v3 PLAN M3]"] --> W{"Tied to tonight?"}
    W -->|"yes"| SL["SESSION NOTE — session + client + author + body<br/>multiple notes per client per night allowed [gate Q9]"]
    W -->|"no — running record"| GP["CLIENT NOTE — standalone, no session link<br/>optional pin + category (v1 ClientNote precedent)"]
    SL --> ABS["Notes on ABSENT clients allowed —<br/>absence communication is a primary use"]
    SL --> ED["Edit = soft-delete + append — legal record [DOM A-10]"]
    GP --> ED
    ED --> VIS{"Visibility — recommendation: flat clinical<br/>(single treatment team, HIPAA treatment<br/>exception — v1 GAPS 11-17) · edit: author + Owner/Admin (O-10)"}
    SL --> Q["UNWRITTEN-NOTES QUEUE — derived:<br/>client attended + no session note by this author<br/>— flagged by v1 as the highest-value provider screen (np 50)"]
    Q --> CLOSE2["Snapshot surfaces at night close (2.2)"]
    Q --> WR["Teacher writes the owed note from the queue → clears"]
```

**Requirements**

- REQ-SO-12 — Two note kinds: **session notes** (per client per night, multiple authors) and
  **standalone client notes** (pinnable) — both first-class (**O-11** recommendation).
- REQ-SO-13 — The **unwritten-notes queue** is derived (attended + no note by this author),
  surfaces at night close, and links straight to writing the owed note.
- REQ-SO-14 — Editing is author-only plus Owner/Admin; all edits are soft-delete + append with
  full trail; nothing hard-deletes.
- REQ-SO-15 — Notes never detach from their session: sessions with attendance or notes are
  immutable to any calendar regeneration (v1's SetNull detachment hazard — sc:48-51 — is a
  never-again rule).
- REQ-SO-16 — Visibility default = flat clinical access across Owner/Admin/Provider/Teacher,
  per the treatment-team doctrine (**O-10** confirm with practice).

---

## The cancellation engine (D-13 — all three modes)

v1 spec'd all three, built none [sc]; v3 built skip only. v4 builds all three:

```mermaid
flowchart TD
    C["A class night will not happen as planned"] --> WHO{"Who cancels — recommendation:<br/>a Teacher of the class or Admin (O-14)"} --> MODE{"Outcome (D-13)"}
    MODE -->|"1 · SKIP"| SK["Night marked CANCELLED — topic never covered<br/>PERMANENT gap in week numbering — weeks run 2, 4, 5…<br/>the honest record: do not renumber to hide it [sc 30-31]<br/>rotation clock does NOT advance · no attendance"]
    MODE -->|"2 · SHIFT"| SH["Night removed — every later session moves out one slot<br/>projected end date shifts (holiday absorption)<br/>guard: sessions with attendance or notes never move"]
    MODE -->|"3 · MAKEUP"| MK["CANCELLED + new session on a Teacher-picked date<br/>carries the SAME module + week · no same-night doubles<br/>rotation clock ADVANCES on the makeup night [v1 B2]"]
    SK --> U["Undo available — one click (v3 M2-S3 precedent)"]
    SH --> U
    MK --> U
    MK --> MKQ{"Client attends the makeup —<br/>does the original miss annotate?"}
    MKQ --> AN["Recommendation: annotate, never rewrite —<br/>the absence happened; the makeup is recorded (O-12)"]
```

- REQ-SO-17 — All three modes exist with one write path each; undo is one click and recorded.
- REQ-SO-18 — Week-number gaps from skips are permanent and visible; renumbering to hide gaps
  is prohibited [sc:30-31].
- REQ-SO-19 — Shift mode never touches sessions carrying attendance or notes (immutability
  rule, REQ-SO-15).
- REQ-SO-20 — A makeup session may itself be cancelled (revert to skip semantics) — **O-12**
  covers attendance-annotation semantics.

## The miss-ladder engine (final policy: D-09 + D-10)

All four prior variants (Master-Log 4-consecutive-auto-remove; v1's shipped 1/2/3; Christy's
2026-06-16 cumulative; v3's consecutive-4 advisory) are **superseded** by the interview
decision. Final rule:

```mermaid
flowchart TD
    M["A miss-worthy event occurs:<br/>ABSENT or FREE-PASS on a class night (D-10)<br/>· or a Provider logs a missed individual-therapy appointment (D-09)"] --> SCOPE{"Scope: within the client's CURRENT series ≡ round<br/>(resets at each round's first session)"}
    SCOPE --> COUNT["Cumulative count increments"]
    COUNT -->|"count = 2"| W["WARN — advisory flag"]
    COUNT -->|"count = 3"| CR["CRITICAL — advisory flag"]
    COUNT -->|"count ≥ 4"| MX["MAX — advisory flag, unmistakable<br/>(flag fires BEFORE the 4th lands — Brittany s<br/>big red giant flag , DOM B-6)"]
    W --> HUM["HUMANS decide everything from here —<br/>the system NEVER drops anyone (D-09)"]
    CR --> HUM
    MX --> HUM
    HUM --> OV{{"Owner override / accommodation —<br/>recorded as a decision record (DNU bends its own rules)"}}
    HUM --> DR{{"Drop decision — DROPPED event + reason (03 §1.1)"}}
    HUM --> OK2["No action — flags ride the roster"]
```

- REQ-SO-21 — Ladder inputs: every ABSENT and FREE-PASS in the current round, plus
  Provider-logged missed individual-therapy appointments; LATE/PRESENT never count; cancelled
  nights are skipped entirely.
- REQ-SO-22 — Escalation warn@2 / critical@3 / max@4, all advisory; the max flag must be
  visible before the miss that would make 4 lands (advance warning, DOM B-6).
- REQ-SO-23 — No automatic drop, ever; every override or accommodation rides a decision
  record.
- REQ-SO-24 — The Provider-facing path to log a missed individual-therapy appointment exists
  (**O-15**) and feeds the same ladder.
- REQ-SO-25 — A **planned-absence annotation** (vacation, hospitalization, school) may be
  recorded on future nights: visible to staff, reason-blind to the ladder (misses still count;
  humans see why) — **O-21** recommendation, directly reduces override volume for medical
  leaves.

**Edge cases** (full catalog in 08): concurrent marking by two staff (last-write wins +
surface "already marked by X"); attendance dispute weeks later (legal-record amendment flow);
proctor forgets to mark until next week (backfill + both timestamps); client attends the wrong
identical section (out-of-roster fact); Zoom outage mid-night (degraded-night note);
substitute Teacher for one night (per-night leader record — see 06 §3, payroll-adjacent).
