/* data.js — Scene 2's fixture. Same class, same night, same eight clients as
   Scene 1 build B (this is the same Teacher, seven minutes later).

   Domain shapes only. NOTHING status-shaped is stored:
     - the night's open/closed/reopened/amended status is DERIVED in app.js
       from `closeLog`, an append-only list of recorded acts;
     - "marked", "unmarked" and "notes owed" are DERIVED from the live
       attendance rows and the live notes.
*/

const SESSION = {
  className: "Adult PM",
  section: "Tuesday",
  sectionId: "ADU-PM-TUE",
  siblings: [
    { id: "ADU-PM-TUE", name: "Adult PM — Tuesday", when: "Tue 6:00–7:30 PM", here: true },
    { id: "ADU-PM-THU", name: "Adult PM — Thursday", when: "Thu 6:00–7:30 PM", here: false }
  ],
  module: { code: "dt", name: "Distress Tolerance", week: 5, of: 8 },
  round: 2,
  roundFirstSession: "Tue 10 Mar 2026",
  teachers: ["Tessa Brooks", "Devon Marsh"],   // the class's two STANDING Teachers
  signedInAs: { name: "Devon Marsh", role: "Teacher" },
  date: "Tue 8 Sep 2026",
  clock: "8:02 PM",                            // card line 1: class dismissed
  tz: "America/Denver"
};

/* Staff who can appear in the "who actually ran the night" select.
   The class's two standing Teachers are the default (06 §Notes); anyone else
   is a per-night substitute and is labelled as one. */
const STAFF = [
  { id: "s1", name: "Tessa Brooks",  standing: true,  role: "Teacher" },
  { id: "s2", name: "Devon Marsh",   standing: true,  role: "Teacher" },
  { id: "s3", name: "Jenna Voss",    standing: false, role: "Teacher" },
  { id: "s4", name: "Marcus Reyes",  standing: false, role: "Teacher" },
  { id: "s5", name: "Nathan Oakes",  standing: false, role: "Clinician" },
  { id: "s6", name: "Christy Bellamy", standing: false, role: "Admin" }
];

const CLIENTS = [
  { id: "c1", name: "Maria Delgado",   provider: "Brittany Sorensen, LCSW" },
  { id: "c2", name: "Andre Whitfield", provider: "Brittany Sorensen, LCSW" },
  { id: "c3", name: "Priya Raman",     provider: "Nathan Oakes, LMFT" },
  { id: "c4", name: "Josh Kimball",    provider: "Nathan Oakes, LMFT" },
  { id: "c5", name: "Danae Ostler",    provider: "Brittany Sorensen, LCSW" },
  { id: "c6", name: "Tomás Herrera",   provider: "Brittany Sorensen, LCSW" },
  { id: "c7", name: "Brynn Callister", provider: "Nathan Oakes, LMFT" },
  { id: "c8", name: "Kai Nakamura",    provider: "Brittany Sorensen, LCSW" }
];

const CODE_NAME = { P: "Present", L: "Late", A: "Absent", F: "Free-pass" };
/* Late = present for every derivation (REQ-SO-01 / D-10). The notes queue is
   "attended + no note by this author" (REQ-SO-13), so P and L both attend. */
const ATTENDED = { P: true, L: true, A: false, F: false };

const REQ_TEXT = {
  "REQ-SO-05": "Unmarked clients on a past night are not misses; a “nights unrecorded” hygiene advisory surfaces to the class's Teachers (O-08, recommendation; spreadsheet blank=missed semantics rejected).",
  "REQ-SO-07": "A Teacher of the class (or Admin) can close a night; closing is a recorded act with actor and timestamp.",
  "REQ-SO-08": "Undo is one click and always available (re-opening is itself recorded); closing/undoing never mutates attendance or notes.",
  "REQ-SO-09": "Closing does not gate corrections: soft-delete + append remains available on closed nights forever (legal-record semantics, DOM A-10).",
  "REQ-SO-10": "Unclosed past nights surface in a hygiene list to the class's Teachers (“nights unrecorded” — gate Q11 lineage).",
  "REQ-SO-11": "Zero-attendee night: closable like any other; whether the rotation clock advanced is a property of taught-sessions policy (O-13 — recommendation: the clock follows what the Teachers taught, independent of attendance).",
  "REQ-SO-13": "The unwritten-notes queue is derived (attended + no note by this author), surfaces at night close, and links straight to writing the owed note.",
  "REQ-SO-17": "All three modes exist with one write path each; undo is one click and recorded."
};

const OPENS = {
  "O-08": "Unmarked client on a past night: silent (v3), missed (spreadsheets), or flagged? Recommendation — not a miss, plus a “nights unrecorded” hygiene advisory to Teachers. Why it matters: core ladder walk; false misses destroy trust. Owner: Ben.",
  "O-13": "Zero-attendee night: did it occur? did the clock advance? Recommendation — closable; the clock follows what the Teachers taught (content delivered), independent of attendance. Why it matters: clock honesty. Owner: Brittany."
};

/* What closing does and does not do — the flowchart's two branches, 04 §2.2. */
const LEDGER = {
  will: [
    { t: "Records a ritual act", d: "actor + timestamp, by a Teacher of this class (REQ-SO-07)." },
    { t: "Snapshots the unwritten-notes queue", d: "onto this Teacher's owed list (REQ-SO-13 → Scene 3)." },
    { t: "Refreshes the miss-ladder flags", d: "and surfaces them for human review (→ Scene 5)." },
    { t: "Turns the roster into the reference view", d: "staff read later (→ Scene 4)." }
  ],
  wont: [
    { t: "Does not lock attendance", d: "corrections still append, forever (REQ-SO-09)." },
    { t: "Does not advance module progress", d: "a human marks completion (D-12)." },
    { t: "Does not touch billing", d: "out of scope entirely (D-05 / D-07)." },
    { t: "Does not drop, graduate or flag anyone", d: "every one of those is a human act (D-09)." }
  ]
};

/* Notes already written by the signed-in Teacher tonight, per state seed. */
const SEED_NOTES = {
  closable:  ["c1", "c6", "c7"],
  partial:   ["c1", "c2", "c6"],
  closed:    ["c1", "c6", "c7"],
  reopened:  ["c1", "c6", "c7"],
  amended:   ["c1", "c2", "c3", "c4", "c6", "c7"]
};

/* The half-taught night (08 §2: fire drill / venue loss / zoom outage) — there
   is no "happened, degraded" mode, so the spec's answer is a night note. */
const DEGRADED_NOTE = {
  body: "Building fire alarm at 6:40 PM; room cleared for 25 minutes. Covered the first half of Distress Tolerance week 5 only — pros and cons was not taught. Recommend picking it up Thursday.",
  by: "Devon Marsh",
  at: "Tue 8 Sep 2026, 7:58 PM"
};

/* Edge case: the attendance dispute weeks later (08 §2, REQ-SO-09). The night
   of 25 Aug was closed on the night; the amendment landed on 8 Sep. */
const AMENDMENT = {
  night: "Tue 25 Aug 2026",
  client: "Priya Raman",
  voided: { code: "A", by: "Devon Marsh", at: "Tue 25 Aug 2026, 8:01 PM" },
  live:   { code: "P", by: "Christy Bellamy", at: "Tue 8 Sep 2026, 10:14 AM" },
  reason: "Client and her provider both report she attended; Teacher confirms she arrived after the roster was marked.",
  ladderEffect: "Priya's round-2 ladder recomputes from 3 to 2 — critical drops to warn. Derived, not stored; nobody was dropped either way (D-09)."
};

/* REQ-SO-10's hygiene list, shown as the way back INTO this scene. */
const UNCLOSED_NIGHTS = [
  { date: "Thu 27 Aug 2026", section: "Adult PM — Thursday", marked: 7, roster: 8 },
  { date: "Tue 1 Sep 2026",  section: "Adult PM — Tuesday",  marked: 8, roster: 8 }
];
