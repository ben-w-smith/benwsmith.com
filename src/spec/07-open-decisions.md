---
title: "07 — Open Decision Register"
order: 7
description: "Open-decision register O-01…O-33, each with a recommendation, impact, and suggested owner."
---

Everything the interview left open, with a recommendation and impact. Nothing here is silently
decided. **Confirm-before-build** items are the ones that change shapes (topology); the rest
can ride as defaults until the practice weighs in. Suggested owners: Ben / Christy (owner) /
Brittany (clinician-tier). O-01…O-28 came out of the interview; O-29…O-33 surfaced from
prototyping Scenes 1–3 (prototype review 2026-09-07).

| # | Decision | Recommendation | Impact if wrong | Owner |
|---|----------|----------------|-----------------|-------|
| **O-01** | **Day-one data entry.** Spreadsheet import is out of scope (D-07), so ~30 clients + history enter manually — or import comes back as a one-time exception. | Re-scope a one-time, read-only import of current clients + completed-modules summary; skip attendance history. | Go-live deadlock or weeks of typing; wrong history breaks ladders at day one. | Ben |
| **O-02** | **Reservation entity** between waitlist and placed (v1 had FutureEnrollment RESERVED; v3 dropped it). | **Keep it** — matches the real Thursday-meeting workflow; gives the placement surface something to point at. | Changes roster-add flow shape + seat math. | Ben |
| **O-03** | **Calendar model**: pre-generated future sessions vs record-as-you-go. | Run rows carry intent; **sessions recorded as they occur**; forward calendar is a derived projection. Kills v1's regeneration hazards permanently. | Topology of the whole scheduling area. | Ben |
| **O-04** | **Class lifecycle stored vs derived.** | Derived states + human Archive/Complete acts (v1's "nothing auto-completes" + v3's derive stance). | B.1 state machine shape. | Ben |
| **O-05** | **Round-2 mechanics**: implicit continuation vs new placement event. | Implicit continuation — membership window crosses the round seam; round boundary derived. | 1.3 topology. | Ben |
| **O-06** | **Re-entry target after DROPPED** (waitlist / intake / direct placement) + what's preserved; also pretreatment-restart clock semantics. | Waitlist, preserving completed modules + times-graduated; new pretreatment clock per attempt. | 1.1 return paths. | Christy |
| **O-07** | **2-week close rule**: enforce, surface, or drop. | Surface as flag + Owner override; never block (record-never-enforce; v1 shipped permissive deliberately). | Roster-add guard shape. | Ben |
| **O-08** | **Unmarked client on a past night**: silent (v3), missed (spreadsheets), or flagged. | Not a miss + "nights unrecorded" hygiene advisory to Teachers. | Core ladder walk; false misses destroy trust. | Ben |
| **O-09** | **Module-completion suggestion basis** (D-12 says human marks). | Show the attendance summary only — no auto-threshold shown as a recommendation. | 1.2 completion node. | Ben |
| **O-10** | **Notes visibility**: flat clinical vs scoped. | Flat clinical (treatment-team doctrine, v1 GAPS). | PHI surface; needs practice blessing. | Brittany+ |
| **O-11** | **Notes model**: session-linked only vs both kinds. | Both + derived unwritten-notes queue (REQ-SO-12/13). | 2.3 shape. | Ben |
| **O-12** | **Makeup attendance vs original miss**: clear, annotate, or nothing. | Annotate — the absence happened; the makeup is its own recorded fact. | Ladder arithmetic. | Ben |
| **O-13** | **Zero-attendee night**: did it occur? clock? | Closable; clock follows what Teachers taught (content delivered), independent of attendance. | Clock honesty. | Brittany |
| **O-14** | **Who may cancel a night** (v1 left open). | The class's Teachers + Admin; Owner always. | Write-path guards. | Ben |
| **O-15** | **Individual-therapy miss logging surface** (mandated by D-09). | Provider-facing entry against the client's current series; visible on the client record with source labeled. | New surface + ladder integrity. | Brittany |
| **O-16** | **Multifamily seat unit**: family vs individual against capacity. | Ask the practice; default = one seat per teen (parents ride it). | Capacity math for teen track. | Christy |
| **O-17** | **Capacity**: default 10 (owner) vs 12 (v1 schema); per-class or per-run; keep min-viable floor of 5? | Per-class, default 10, floor surfaced as launch-risk flag only. | Seat math. | Christy |
| **O-18** | **"X of N" display**: within-round vs across-two-rounds; round-3+ display. | Across-two-rounds (X of 6 / X of 8), unclamped; round-3+ renders "9 of 8". | Cosmetic but user-visible daily. | Brittany |
| **O-19** | **Free-pass's remaining meaning**: with billing out (D-05/D-07) and every-absence-counts (D-10), the pass is purely a recorded fact. Confirm the 4th button is still wanted. | Keep it (distinguishes "texted ahead" from "ghosted"; preserves the concept if billing ever returns). | Attendance code set. | Ben |
| **O-20** | **Track crossover** (teen→adult aging out; teen in adult class — v1 U9 never decided). | Track-change event; population match surfaced at placement, never enforced. | Lifecycle vocabulary. | Christy |
| **O-21** | **Planned-absence annotation** for known multi-week absences (hospitalization, vacation). | Add it: visible to staff, reason-blind to the ladder. Directly reduces Owner-override volume for medical leaves. | Ladder UX. | Brittany |
| **O-22** | **Event correction on the spine** (a PLACED recorded wrong / MODULE_COMPLETED twice). | Void/amend event vocabulary — decide now; cheapest moment (fresh start). | Data integrity forever. | Ben |
| **O-23** | **Backdating window** for attendance. | Allowed; both timestamps kept (REQ-SO-04); no cutoff. | Audit clarity. | Ben |
| **O-24** | **Deceased/departed client** terminal vocabulary. | Add a distinct terminal event; excluded from drop-rate reporting; retention unchanged. | Reporting integrity + decency. | Christy |
| **O-25** | **Yellow-signal timing** (fires at module 2-of-3 mid-round for the adult rotation). | Refine trigger to final-quarter-of-personal-coverage rather than second-to-last module. | Advisory UX. | Brittany |
| **O-26** | **Pause semantics** (multi-week class dark). | No pause entity; absence of taught nights + visible planned-vs-taught drift. | Scheduling honesty. | Ben |
| **O-27** | **1-week break: scheduled gap or planning slack?** | Planning slack absorbed into projected dates (simpler; holiday flex folds in). | Calendar projection math. | Ben |
| **O-28** | **Summer/seasonal schedule** practice-wide changes. | Practice-wide holiday calendar (also powers bulk-cancel across all classes). | Bulk operations. | Christy |
| **O-29** | **Notes queue at close: snapshot or derived?** 04 §2.2's close/lock diagram says closing "snapshots the unwritten-notes queue" (node E1); REQ-SO-13 defines the queue as derived at read time (attended + no note by this author). The Scene 2 prototype text says "snapshots" on screen while its README and the Scene 3 build implement derived (prototype review 2026-09-07, Scene 2). | Derived at read time; the close event records the count owed at close as a fact, not a list. | A stored snapshot drifts from reality once notes are written after close; queue arithmetic disagrees with Scene 3. | Ben |
| **O-30** | **"By this author": is the owed queue personal or class-level?** REQ-SO-13 reads "no note by this author" — if Teacher A already wrote tonight's note on a client, does Teacher B still owe one? (prototype review 2026-09-07, Scene 3). | Personal, per-author, matching the REQ text; surface the other author's note inline so B can decline with one click. | Decides whether the queue is a personal to-do list or a class completeness check — different UI and different completion semantics. | Christy |
| **O-31** | **Owner/Admin editing another author's note: is the author notified?** REQ-SO-14 grants Owner/Admin edit rights over any note with soft-delete + append; nothing says whether the original author is told (prototype review 2026-09-07, Scene 3). | Yes — a passive notice in the author's queue; no approval step. | Silent edits to clinical notes erode trust; an approval step would slow corrections needlessly. | Christy |
| **O-32** | **Retroactive ladder tiers via backfill.** REQ-SO-04 allows backfilling past nights; a seven-night backfill can move a client clear→warn→critical→max in one sitting, tiers nobody could act on live (prototype review 2026-09-07, Scenes 1 and 5). | Same weight — the facts are the facts — with flag history showing which tiers were reached retroactively; notify the class's Teachers and the client's Provider once, at the end of the backfill sitting. | Either a max flag with no accountability trail, or notification noise mid-backfill. | Brittany |
| **O-33** | **Where is MODULE_COMPLETED marked?** REQ-CL-09/D-12: human marks, system suggests. The permission matrix (06) grants the act to Teachers on own classes; the suggestion payload is per-client. Neither doc says which screen owns the act (prototype review 2026-09-07, Scenes 6 and 8). | The act lives on the class's run-completion surface (Scene 6 / Thursday review) as a batch with per-client suggestions; the client profile (Scene 8) shows the result and allows a single-client correction. | Duplicate or conflicting completion controls across two screens. | Ben, confirm with Christy |

**Sequence suggestion:** settle O-01 → O-03 first (they gate everything), then the
topology set (O-02, O-04, O-05, O-22, O-29), then practice-facing items in one sitting with
Christy/Brittany (O-06, O-13, O-15–O-21, O-24, O-25, O-28, O-30–O-33).
