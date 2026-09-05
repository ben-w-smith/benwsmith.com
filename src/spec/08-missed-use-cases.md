---
title: "08 — Missed-Use-Case Catalog"
order: 8
description: "The missed-use-case catalog — scenarios absent from all three prior repos."
---

Scenarios **absent from all three prior repos** (verified by grep/analysis), raised by the
wave-2 deep-dive agents as things Ben may not have thought of. Grouped by the decision each
forces; each carries a one-line why-it-matters. Items already absorbed into decisions or
REQs are marked.

## 1. Status & absence

- **True hold / pause for medical leave** — v1 explicitly rejected a "frozen" state ("just use
  DROPPED and make restore easy"), but a 3-week hospitalization now burns 3 ladder misses and
  forces a drop+re-entry+seniority-reset cycle. → the planned-absence annotation (REQ-SO-25,
  O-21) removes most of this volume without a new state.
- **Pregnancy/parental leave/sabbatical with a knowable return boundary** — same shape, plus
  the intended return date is recordable ("return at next DT boundary").
- **Seasonal effects on the multifamily class** (school calendar, vacation clustering) — no
  seasonal cadence is modeled anywhere.
- **Missed individual-therapy appointment against a *past* series** — D-09's source says
  "current or past"; logging into closed windows is the only backward-reaching write in the
  system. Recommend: current series only. (O-15.)

## 2. Attendance & session night

- **Zero-attendee night** — everyone no-shows: did the night occur, does the clock advance, do
  Teachers get hours? (O-13.)
- **Half-taught night** (fire drill, venue loss, zoom outage mid-night) — attendance is clear,
  curriculum coverage isn't binary; no "happened, degraded" mode exists. → allow a night note.
- **Client attends the wrong identical Tue/Thu section** — refused by every generation's
  guards, yet routine in practice. → out-of-roster attendance fact (REQ-SO-06).
- **Attendance dispute weeks later** ("I was there") — a legal-record amendment flow with
  adjudication and retroactive flag consequences. → corrections already append-only; add an
  amendment reason field.
- **Proctor forgets to mark until next week** — backfills seven nights at once; a late backfill
  can jump a client from no-flag to max-flag without the owner ever seeing intermediates. →
  show flag *history*, not just current state.
- **Guest observer in class** (trainee, shadow, family member) — present on a disclosure
  surface, no PHI linkage. Decide: unrecorded, or recorded as a non-client attendance fact.
- **Session recording** for supervision/training — media PHI, consent, retention; cheap to
  defer now, expensive to retrofit. Recommend: explicitly out of scope, written down.
- **Two staff marking concurrently** — last-write-wins + "already marked by X" surfacing.

## 3. Family & multifamily (teen track)

- **Custody change mid-program** — attending parent changes; a second household demands
  duplicate communications. Parent participation is a data field, not an event; no history.
- **Parent stops attending while teen continues** (or vice versa) — still enrolled? Seat-unit
  question (O-16).
- **Minor turns 18 mid-program** — consent and records authority flip from parent to client
  overnight; parent may still be payer/participant. Who is contact of record?
- **Parent-teen conflict in class** — participation terms change (separate rooms/nights); seat
  bookkeeping follows.

## 4. Calendar, staffing & operations

- **Practice-wide dark weeks** (December, summer) — five classes cancelled one night at a time
  today; a practice-level holiday calendar powers bulk-cancel (O-28).
- **Emergency same-day closure** (weather, illness) — who cancels all classes at 4pm, and does
  every Teacher have permission? (O-14.)
- **Two classes in the same zoom room** — the two identical Adult PM sections are one
  copy-paste error from a PHI disclosure incident. → resource collision check, even a dumb one.
- **Substitute Teacher for one night** — not in the class's 2-Teacher assignment; per-night
  leader record at close covers it (06 §3).
- **Teacher leave longer than pause tolerance** — substitute-for-3-weeks vs pause are different
  decisions; neither is modeled.
- **A module taught by a guest expert** — outside the 2-Teacher assignment; per-night record
  again.
- **Class rename mid-year** — ids keep references; printed rosters, zoom labels, and staff
  memory don't. "#1/#2" sections make this concrete.
- **Module content updated mid-year** (new manual edition) — runs should keep pointing at what
  was actually taught; no content versioning needed at this scale, write that down.

## 5. Data, identity & legal

- **Duplicate client records** — no merge affordance anywhere; v1's unique constraints made
  two-clients-one-class crash the transition (pipe R44). → merge tool or void+recreate (O-22
  adjacent).
- **Client requests data deletion** — attendance/notes are the legal record with retention
  duties (minors into adulthood); the request will come; the answer should be written.
- **Records transfer to another practice** — what does the system produce? An export/PDF
  surface was never specified.
- **Court/probation/DCFS-mandated participation** — third parties want attendance-verification
  letters; a mandate-expiry date competes with curriculum-based exit.
- **Subpoena / insurance audit of attendance history** — append-only trails already satisfy
  this if exportability is confirmed as a requirement.
- **Event recorded in error, no undo on the spine** — lifecycle events never got correction
  semantics (attendance did). Decide void/amend now (O-22).
- **DST / timezone flip mid-class** — 6pm MT classes straddle the UTC day change twice a year;
  "tonight" must be defined once, centrally (REQ-MM-19).
- **First-mark mistake fabricates membership** — "began attending" derives from the first
  attendance row; a wrong mark creates a false anchor until corrected.

## 6. Lifecycle oddities

- **Graduate re-enrolls and every module is "already completed"** — kb:39's wait-for-uncompleted
  rule has no referent for full-round graduates; round 2 repeats from any boundary by design.
  Write the rule for both cases.
- **Client continues round 2 in a different class** — exit + place pair (REQ-CL-18).
- **Class dissolves mid-round** (both Teachers leave) — N clients redistribute to classes at
  different rotation positions; no bulk story exists. → Owner-driven redistribution tooling.
- **Early mutually-agreed completion** — goals met mid-round; neither graduation (coverage
  incomplete) nor drop (failure framing) fits. → add a completion reason.
- **Capacity collision at a boundary** — round-2 stayers + internal priority + FIFO exceed
  seats at once; show the collision, don't just rank (REQ-MM-13).
- **Whole track pauses** (program-level decision) — bulk lifecycle event; nothing models it.

---

**Pattern worth noticing:** the highest-value additions are all *annotations and facts*
(out-of-roster attendance, planned absences, per-night leaders, amendments) rather than new
*states* — consistent with the inherited record-never-enforce / append-only stance. The
system gets safer and more honest by recording more and deciding less.
