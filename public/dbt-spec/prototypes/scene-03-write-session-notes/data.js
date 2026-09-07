/* data.js — Scene 3's fixture. Same class, same night, same eight clients as
   Scenes 1 and 2 build B (this is the same Tuesday: 8:10 PM, or the next
   morning at Devon's desk).

   Domain shapes only. NOTHING status-shaped is stored:
     - the unwritten-notes queue is DERIVED in app.js from live attendance
       plus the live note list (attended + no note by this author);
     - "edited" is DERIVED from a note carrying a `voidedBy` predecessor —
       nothing is ever overwritten in place.
*/

const SESSION = {
  className: "Adult PM",
  section: "Tuesday",
  sectionId: "ADU-PM-TUE",
  module: { code: "dt", name: "Distress Tolerance", week: 5, of: 8 },
  round: 2,
  teachers: ["Tessa Brooks", "Devon Marsh"],
  signedInAs: { name: "Devon Marsh", role: "Teacher" },
  date: "Tue 8 Sep 2026",
  tz: "America/Denver"
};

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
/* Tonight's attendance — same roster and same marks as Scene 1/2 build B's
   "closable"/"closed" seed. Late counts as attended (D-10); Free-pass does
   not (REQ-SO-13 reads "attended", not "marked"). */
const MARKS = { c1: "P", c2: "L", c3: "A", c4: "P", c5: "A", c6: "P", c7: "P", c8: "F" };
const ATTENDED = { P: true, L: true, A: false, F: false };

const CATEGORIES = ["General", "Skill practice", "Absence / communication", "Clinical", "Administrative"];

const REQ_TEXT = {
  "REQ-SO-12": "Two note kinds: session notes (per client per night, multiple authors) and standalone client notes (pinnable) — both first-class (O-11 recommendation).",
  "REQ-SO-13": "The unwritten-notes queue is derived (attended + no note by this author), surfaces at night close, and links straight to writing the owed note.",
  "REQ-SO-14": "Editing is author-only plus Owner/Admin; all edits are soft-delete + append with full trail; nothing hard-deletes.",
  "REQ-SO-15": "Notes never detach from their session: sessions with attendance or notes are immutable to any calendar regeneration (v1's SetNull detachment hazard — sc:48-51 — is a never-again rule).",
  "REQ-SO-16": "Visibility default = flat clinical access across Owner/Admin/Provider/Teacher, per the treatment-team doctrine (O-10 confirm with practice)."
};

const OPENS = {
  "O-10": "Notes visibility: flat clinical vs scoped. Recommendation: flat clinical (treatment-team doctrine, v1 GAPS 11-17). Why it matters: PHI surface; needs practice blessing. Owner: Brittany+.",
  "O-11": "Notes model: session-linked only vs both kinds. Recommendation: both, plus the derived unwritten-notes queue (REQ-SO-12/13). Why it matters: shapes 2.3 end to end. Owner: Ben."
};

/* Session notes by client-night. Every note is session + client + author +
   body (REQ-SO-12). Devon (signed in) authored c1, c3, c6, c7's first note;
   the rest demonstrate other authors, multiple authors, and an edit trail. */
const NOTES_BASE = {
  c1: [
    { id: "n1", author: "Devon Marsh", role: "Teacher", mine: true,
      category: "Skill practice",
      body: "Practiced opposite-action worksheet; engaged well.",
      at: "Tue 8 Sep 2026, 8:07 PM" }
  ],
  c6: [
    { id: "n2", author: "Devon Marsh", role: "Teacher", mine: true,
      category: "General",
      body: "Brought a friend's crisis to group; redirected to her own plan gently.",
      at: "Tue 8 Sep 2026, 8:09 PM" }
  ],
  c7: [
    { id: "n3", author: "Devon Marsh", role: "Teacher", mine: true,
      category: "General",
      body: "Quiet tonight, seemed distracted. Didn't volunteer for the round-robin.",
      at: "Tue 8 Sep 2026, 8:06 PM" }
  ],
  c3: [
    { id: "n4", author: "Devon Marsh", role: "Teacher", mine: true,
      category: "Absence / communication",
      body: "Mom called at 5:40 — Priya had a dentist appointment run long. Plans to attend the Thursday section this week to stay with the module.",
      at: "Tue 8 Sep 2026, 6:05 PM" }
  ]
};

/* State-specific overlays layered onto NOTES_BASE by app.js. Kept separate so
   the base fixture stays legible on its own. */
const OVERLAYS = {
  /* "edited" — c1's note is corrected the next morning: soft-delete + append,
     never in place (REQ-SO-14). */
  edited: {
    c1: [
      { id: "n1", author: "Devon Marsh", role: "Teacher", mine: true,
        category: "Skill practice", voided: true,
        body: "Practiced opposite-action worksheet, distracted by phone most of the exercise.",
        at: "Tue 8 Sep 2026, 8:07 PM" },
      { id: "n1b", author: "Devon Marsh", role: "Teacher", mine: true,
        category: "Skill practice", editOf: "n1",
        body: "Practiced opposite-action worksheet; engaged well once phone was put away — confirmed with client after class.",
        reason: "Wanted to soften the phrasing before her provider reads this — the original landed harsher than intended.",
        at: "Wed 9 Sep 2026, 7:52 AM" }
    ]
  },
  /* "notmine" and "multi" — c7 gains a second note from Brynn's own provider,
     read under flat clinical access, not editable by Devon (REQ-SO-16, O-10),
     and demonstrating multiple authors on one client-night (gate Q9). */
  notmine: {
    c7: NOTES_BASE.c7.concat([
      { id: "n5", author: "Nathan Oakes, LMFT", role: "Provider", mine: false,
        category: "Clinical",
        body: "Following up after Monday's individual session — please keep an eye on affect-regulation skill use in group and let me know if the withdrawal continues.",
        at: "Wed 9 Sep 2026, 8:10 AM" }
    ])
  },
  multi: {
    c7: NOTES_BASE.c7.concat([
      { id: "n5", author: "Nathan Oakes, LMFT", role: "Provider", mine: false,
        category: "Clinical",
        body: "Following up after Monday's individual session — please keep an eye on affect-regulation skill use in group and let me know if the withdrawal continues.",
        at: "Wed 9 Sep 2026, 8:10 AM" }
    ])
  }
};

/* Standalone, pinnable client notes — unlinked to any session (REQ-SO-12). */
const STANDALONE = [
  { id: "s1", clientId: "c8", author: "Christy Bellamy", role: "Owner", mine: false,
    category: "Administrative", pinned: true,
    body: "Family reports increased financial strain this month; flagged for scholarship review at Thursday's meeting.",
    at: "Mon 7 Sep 2026, 11:20 AM" }
];
