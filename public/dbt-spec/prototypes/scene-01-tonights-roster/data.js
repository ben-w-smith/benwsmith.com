/* data.js — the scene's fixture. Domain shapes only; no derived status is stored.
   Ladder tier and the end-of-round signal are computed at read time in app.js. */

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
  teachers: ["Tessa Brooks", "Devon Marsh"],
  signedInAs: { name: "Devon Marsh", role: "Teacher" },
  date: "Tue 8 Sep 2026",
  clock: "7:55 PM",
  tz: "America/Denver"
};

/* personalCoverage.position drives the end-of-round signal PER CLIENT
   (REQ-CL-17) — never the class calendar. 'final' = red, 'penultimate' =
   yellow, anything else = no signal. */
const CLIENTS = [
  {
    id: "c1", name: "Maria Delgado", payer: "contract",
    phone: "(801) 555-0142", email: "m.delgado@example.com",
    provider: "Brittany Sorensen, LCSW",
    coverage: { done: 4, of: 6, position: "mid" },
    absences: 0, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false
  },
  {
    id: "c2", name: "Andre Whitfield", payer: "insurance",
    phone: "(801) 555-0188", email: "awhitfield@example.com",
    provider: "Brittany Sorensen, LCSW",
    coverage: { done: 5, of: 6, position: "penultimate" },
    absences: 2, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false
  },
  {
    id: "c3", name: "Priya Raman", payer: "contract",
    phone: "(385) 555-0107", email: "p.raman@example.com",
    provider: "Nathan Oakes, LMFT",
    coverage: { done: 6, of: 6, position: "final" },
    absences: 2, freePasses: 0, itMisses: 1, freePassUsedOn: null,
    itMissDetail: { on: "Wed 19 Aug 2026", by: "Nathan Oakes, LMFT" },
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false
  },
  {
    id: "c4", name: "Josh Kimball", payer: "contract",
    phone: "(801) 555-0166", email: "jkimball@example.com",
    provider: "Nathan Oakes, LMFT",
    coverage: { done: 3, of: 6, position: "mid" },
    absences: 3, freePasses: 1, itMisses: 0, freePassUsedOn: "Tue 21 Jul 2026",
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false
  },
  {
    id: "c5", name: "Danae Ostler", payer: "insurance",
    phone: "(435) 555-0119", email: "danae.o@example.com",
    provider: "Brittany Sorensen, LCSW",
    coverage: { done: 4, of: 6, position: "mid" },
    absences: 1, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: {
      reason: "Scheduled surgery — recovery",
      from: "Tue 8 Sep 2026", through: "Tue 22 Sep 2026",
      recordedBy: "Tessa Brooks", recordedOn: "Thu 27 Aug 2026"
    },
    windowClosedOn: null, outOfRoster: false
  },
  {
    id: "c6", name: "Tomás Herrera", payer: "insurance",
    phone: "(801) 555-0173", email: "therrera@example.com",
    provider: "Brittany Sorensen, LCSW",
    coverage: { done: 4, of: 6, position: "mid" },
    absences: 1, freePasses: 1, itMisses: 0, freePassUsedOn: "Tue 12 May 2026",
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false
  },
  {
    id: "c7", name: "Brynn Callister", payer: "contract",
    phone: "(801) 555-0134", email: "bcallister@example.com",
    provider: "Nathan Oakes, LMFT",
    coverage: { done: 6, of: 6, position: "final" },
    absences: 0, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false,
    note: "Round 3"
  },
  {
    id: "c8", name: "Kai Nakamura", payer: "insurance",
    phone: "(385) 555-0151", email: "k.nakamura@example.com",
    provider: "Brittany Sorensen, LCSW",
    coverage: { done: 2, of: 6, position: "mid" },
    absences: 1, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: null, windowClosedOn: null, outOfRoster: false,
    joinedAtBoundary: "Tue 16 Jun 2026"
  }
];

/* Rows that are NOT on tonight's roster but appear in specific states. */
const OFF_ROSTER = {
  renee: {
    id: "x1", name: "Renee Ashby", payer: "contract",
    phone: "(801) 555-0190", email: "rashby@example.com",
    provider: "Nathan Oakes, LMFT",
    coverage: { done: 3, of: 6, position: "mid" },
    absences: 1, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: null, windowClosedOn: null, outOfRoster: true,
    homeSection: "Adult PM — Thursday"
  },
  gregor: {
    id: "x2", name: "Gregor Pyle", payer: "contract",
    phone: "(801) 555-0128", email: "gpyle@example.com",
    provider: "Nathan Oakes, LMFT",
    coverage: { done: 2, of: 6, position: "mid" },
    absences: 2, freePasses: 0, itMisses: 0, freePassUsedOn: null,
    plannedAbsence: null, windowClosedOn: "Sat 22 Aug 2026", outOfRoster: false
  }
};

/* Josh's flag history across the seven-night backfill (edge case 3). Each entry
   keeps BOTH timestamps (REQ-SO-04 / O-23). */
const BACKFILL_RUN = {
  nights: ["Tue 14 Jul 2026","Tue 21 Jul 2026","Tue 28 Jul 2026","Tue 4 Aug 2026",
           "Tue 11 Aug 2026","Tue 18 Aug 2026","Tue 25 Aug 2026"],
  recordedAt: "Tue 8 Sep 2026, 7:58 PM",
  recordedBy: "Devon Marsh",
  joshHistory: [
    { effective: "Tue 14 Jul 2026", mark: "Present",   tier: "clear",    running: 0 },
    { effective: "Tue 21 Jul 2026", mark: "Free-pass", tier: "clear",    running: 1 },
    { effective: "Tue 28 Jul 2026", mark: "Absent",    tier: "warning",  running: 2 },
    { effective: "Tue 4 Aug 2026",  mark: "Late",      tier: "warning",  running: 2 },
    { effective: "Tue 11 Aug 2026", mark: "Absent",    tier: "critical", running: 3 },
    { effective: "Tue 18 Aug 2026", mark: "Present",   tier: "critical", running: 3 },
    { effective: "Tue 25 Aug 2026", mark: "Absent",    tier: "max",      running: 4 }
  ]
};

const OPENS = {
  "O-08": "Unmarked client on a past night: silent, missed, or flagged? Recommendation — not a miss, plus a “nights unrecorded” hygiene advisory to Teachers. Owner: Ben.",
  "O-19": "Free-pass’s remaining meaning: with billing out (D-05/D-07) and every-absence-counts (D-10), the pass is purely a recorded fact. Confirm the 4th button is still wanted. Recommendation — keep it. Owner: Ben.",
  "O-21": "Planned-absence annotation for known multi-week absences. Recommendation — add it: visible to staff, reason-blind to the ladder. Owner: Brittany.",
  "O-23": "Backdating window for attendance. Recommendation — allowed; both timestamps kept (REQ-SO-04); no cutoff. Owner: Ben."
};
