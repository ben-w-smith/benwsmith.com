/* app.js — Scene 1, Tonight's roster.
   Vanilla render + delegated events. Every status on screen is DERIVED here at
   render time; nothing status-shaped is stored on a client record. */
(function () {
  "use strict";

  var CODES = [
    { code: "P", label: "P",    spoken: "Present",   on: "on-present" },
    { code: "L", label: "L",    spoken: "Late",      on: "on-late" },
    { code: "A", label: "A",    spoken: "Absent",    on: "on-absent" },
    { code: "F", label: "FREE", spoken: "Free-pass", on: "on-free" }
  ];
  var CODE_NAME = { P: "Present", L: "Late", A: "Absent", F: "Free-pass" };

  var STATES = [
    { key: "unmarked", label: "1 · Unmarked",
      reqs: ["REQ-SO-01", "REQ-SO-02"], opens: ["O-19", "O-21"], edges: [],
      blurb: "Nothing recorded yet. Four codes live on every row; the ladder badge and the end-of-round signal already ride the row before anyone is marked." },
    { key: "partial", label: "2 · Partially marked",
      reqs: ["REQ-SO-02", "REQ-SO-05", "REQ-SO-06"], opens: ["O-08", "O-21"],
      edges: ["Two staff marking concurrently", "Attended the wrong identical section"],
      blurb: "Four of eight marked, one of them by the other Teacher. Unmarked is not a miss — the hygiene advisory says so beside the real names." },
    { key: "full", label: "3 · Fully marked",
      reqs: ["REQ-SO-02", "REQ-SO-22", "REQ-SO-23"], opens: [], edges: [],
      blurb: "Every row carries a live mark. Close the night is the terminal act; a ladder trip that landed tonight is advisory and links out, it does not drop anyone." },
    { key: "backfilled", label: "4 · Backfilled",
      reqs: ["REQ-SO-04", "REQ-SO-05"], opens: ["O-23", "O-08"],
      edges: ["Seven-night backfill: clear → max, with flag history"],
      blurb: "A past night being recorded now. Every row shows both timestamps — effective date and recorded-at — and there is no cutoff." },
    { key: "cancelled", label: "5 · Cancelled",
      reqs: ["REQ-SO-17", "REQ-SO-03"], opens: [], edges: [],
      blurb: "The night did not happen. No marking controls exist. The banner names the mode, the author and the time, and undo is one click." },
    { key: "guard", label: "6 · Guard-blocked",
      reqs: ["REQ-SO-03", "REQ-SO-06"], opens: [],
      edges: ["Closed membership window → out-of-roster path, not a silent refusal"],
      blurb: "Three refusals, each stating why and each naming the date it will NOT retarget to. Controls stay reachable and refuse out loud rather than going quietly grey." },
    { key: "freepass", label: "7 · Free-pass already used",
      reqs: ["REQ-SO-01"], opens: ["O-19"], edges: [],
      blurb: "Two clients have already spent this series' free-pass. The fourth button stays live: the pass is a recorded fact, not a permission." },
    { key: "flagged", label: "8 · Flagged row",
      reqs: ["REQ-SO-21", "REQ-SO-22", "REQ-SO-23", "REQ-CL-10", "REQ-CL-17"],
      opens: ["O-21"], edges: [],
      blurb: "All four ladder tiers riding rows at once, with the max flag visible BEFORE the fourth miss lands. No flag touches a control." }
  ];

  var REQ_TEXT = {
    "REQ-SO-01": "Attendance codes: Present · Late · Absent · Free-pass (D-10). Late = present for all derivations; every Absent and Free-pass counts toward the miss ladder; one free-pass per series, anchored at the round's first session.",
    "REQ-SO-02": "At most one live attendance row per client per session (soft-delete + append for corrections — inherited gate A4).",
    "REQ-SO-03": "Guards: no marking on cancelled nights, future dates, off-nights, or clients outside an open membership window; failures are explicit.",
    "REQ-SO-04": "Backfilling past nights is allowed; every row carries both effective date (the session) and recorded-at (the write) — the audit trail distinguishes them.",
    "REQ-SO-05": "Unmarked clients on a past night are not misses; a “nights unrecorded” hygiene advisory surfaces to the class's Teachers (O-08, recommendation; spreadsheet blank=missed semantics rejected).",
    "REQ-SO-06": "A client who attended but is outside the guard (wrong section of an identical Tue/Thu pair, dropped-but-showed-up) gets a sanctioned “attended out-of-roster” fact or an annotation path, not a silent refusal.",
    "REQ-SO-17": "All three modes exist with one write path each; undo is one click and recorded.",
    "REQ-SO-21": "Ladder inputs: every ABSENT and FREE-PASS in the current round, plus Provider-logged missed individual-therapy appointments; LATE/PRESENT never count; cancelled nights are skipped entirely.",
    "REQ-SO-22": "Escalation warn@2 / critical@3 / max@4, all advisory; the max flag must be visible before the miss that would make 4 lands (advance warning, DOM B-6).",
    "REQ-SO-23": "No automatic drop, ever; every override or accommodation rides a decision record.",
    "REQ-SO-25": "A planned-absence annotation (vacation, hospitalization, school) may be recorded on future nights: visible to staff, reason-blind to the ladder (misses still count; humans see why).",
    "REQ-CL-10": "Miss ladder derivation: cumulative ABSENT + FREE-PASS within the current series (≡ round); LATE and PRESENT never count; cancelled nights are skipped; the ladder resets at each round's first session (free-pass window likewise).",
    "REQ-CL-17": "Mid-rotation joiners: personal coverage tracked per client; the end-of-round red/yellow signal and graduation eligibility evaluate each client's own coverage, not the class calendar."
  };

  // ---------------------------------------------------------------- state ---

  var S = {
    state: "unmarked",
    dark: false,
    marks: {},          // clientId -> { code, by, at, effective, history: [] }
    rows: [],           // clientIds in render order (may include off-roster)
    session: null,
    pop: null,          // popover id
    sheet: null,        // { kind, clientId }
    dialog: null,       // { kind, ... }
    toasts: [],
    cancelUndone: false,
    baseAdjust: {},     // nights this frame is writing that the base tally must not also count
    refusals: []        // the explicit-refusal log in the guard state
  };
  var toastSeq = 0;

  function byId(id) {
    var all = CLIENTS.concat([OFF_ROSTER.renee, OFF_ROSTER.gregor]);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function baseSession() {
    return {
      date: SESSION.date, clock: SESSION.clock,
      effective: SESSION.date, recordedAt: SESSION.date + ", " + SESSION.clock,
      backfill: false, cancelled: null, guard: null
    };
  }

  function seed(key) {
    S.marks = {}; S.rows = CLIENTS.map(function (c) { return c.id; });
    S.session = baseSession(); S.cancelUndone = false; S.refusals = []; S.pop = null;
    S.baseAdjust = {};
    S.sheet = null; S.dialog = null; S.toasts = [];
    OFF_ROSTER.gregor.outOfRoster = false;

    if (key === "partial") {
      S.marks.c1 = mk("P", "Devon Marsh", "7:56 PM");
      S.marks.c2 = mk("L", "Tessa Brooks", "7:52 PM");
      S.marks.c7 = mk("P", "Devon Marsh", "7:56 PM");
      S.rows.push(OFF_ROSTER.renee.id);
      S.marks.x1 = mk("P", "Devon Marsh", "7:57 PM");
      S.marks.x1.outOfRoster = true;
    }
    if (key === "full") {
      S.marks.c1 = mk("P", "Devon Marsh", "7:56 PM");
      S.marks.c2 = mk("L", "Tessa Brooks", "7:52 PM");
      S.marks.c3 = mk("A", "Devon Marsh", "7:58 PM");
      S.marks.c4 = mk("P", "Devon Marsh", "7:58 PM");
      S.marks.c5 = mk("A", "Devon Marsh", "7:58 PM");
      S.marks.c6 = mk("P", "Devon Marsh", "7:59 PM");
      S.marks.c7 = mk("P", "Devon Marsh", "7:56 PM");
      S.marks.c8 = mk("F", "Devon Marsh", "7:59 PM");
    }
    if (key === "backfilled") {
      S.session.date = "Tue 25 Aug 2026";
      S.session.effective = "Tue 25 Aug 2026";
      S.session.recordedAt = BACKFILL_RUN.recordedAt;
      S.session.backfill = { run: BACKFILL_RUN, index: 7, of: 7 };
      S.baseAdjust = { c4: { absences: -1 } };
      S.marks.c1 = mk("P", "Devon Marsh", BACKFILL_RUN.recordedAt);
      S.marks.c4 = mk("A", "Devon Marsh", BACKFILL_RUN.recordedAt);
      S.marks.c7 = mk("P", "Devon Marsh", BACKFILL_RUN.recordedAt);
      for (var k in S.marks) S.marks[k].effective = "Tue 25 Aug 2026";
    }
    if (key === "cancelled") {
      S.session.cancelled = {
        mode: "Skip — permanent gap",
        reason: "Snow emergency — building closed by the landlord",
        by: "Tessa Brooks", at: "Tue 8 Sep 2026, 3:12 PM"
      };
    }
    if (key === "guard") {
      S.session.date = "Fri 11 Sep 2026";
      S.session.guard = {
        kind: "future",
        headline: "Fri 11 Sep 2026 has not happened yet.",
        detail: "Marking is refused for a future date. This screen will not retarget your marks to the most recent past night (Tue 8 Sep 2026); if that is the night you meant, navigate to it."
      };
      S.refusals = [
        { when: "7:54 PM", target: "Wed 9 Sep 2026",
          why: "Wed 9 Sep 2026 is not a scheduled night for Adult PM — Tuesday.",
          notRetargeted: "Not retargeted to Tue 8 Sep 2026." },
        { when: "7:54 PM", target: "Tue 1 Sep 2026 · Adult PM — Thursday",
          why: "That date belongs to a different section's calendar.",
          notRetargeted: "Not retargeted to this section's Tue 1 Sep 2026." }
      ];
      S.rows.push(OFF_ROSTER.gregor.id);
    }
    if (key === "freepass") {
      S.marks.c1 = mk("P", "Devon Marsh", "7:56 PM");
    }
    if (key === "flagged") {
      S.marks.c1 = mk("P", "Devon Marsh", "7:56 PM");
      S.marks.c2 = mk("L", "Tessa Brooks", "7:52 PM");
    }
  }

  function mk(code, by, at) {
    return { code: code, by: by, at: at, effective: S.session ? S.session.effective : SESSION.date, history: [], outOfRoster: false };
  }

  // -------------------------------------------------------------- derived ---

  /* Ladder is computed on every render from the base round tally plus whatever
     live mark exists for this session. Nothing is read from a stored field. */
  function ladder(c) {
    var m = S.marks[c.id];
    var adj = S.baseAdjust[c.id] || {};
    var abs = c.absences + (adj.absences || 0), free = c.freePasses + (adj.freePasses || 0);
    if (m && !S.session.cancelled) {
      if (m.code === "A") abs += 1;
      if (m.code === "F") free += 1;
    }
    var total = abs + free + c.itMisses;
    var tier = total >= 4 ? "max" : total >= 3 ? "critical" : total >= 2 ? "warning" : "clear";
    return { absences: abs, freePasses: free, it: c.itMisses, total: total, tier: tier };
  }

  /* Ladder tally EXCLUDING tonight — used for the advance warning so the max
     flag can be shown before the miss that would make 4 lands (REQ-SO-22). */
  function ladderBefore(c) {
    return c.absences + c.freePasses + c.itMisses;
  }

  function eorSignal(c) {
    if (c.coverage.position === "final") return { cls: "eor-red", text: "Final module of round" };
    if (c.coverage.position === "penultimate") return { cls: "eor-yellow", text: "Second-to-last module" };
    return null;
  }

  var TIER_LABEL = { clear: "Clear", warning: "Warn", critical: "Critical", max: "Max" };

  // --------------------------------------------------------------- render ---

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function omark(id) {
    return '<span class="omark" data-act="pop" data-pop="open:' + id + '" title="Open decision — click">' + id + "</span>";
  }

  function cur() {
    for (var i = 0; i < STATES.length; i++) if (STATES[i].key === S.state) return STATES[i];
    return STATES[0];
  }

  function renderChrome() {
    var st = cur();
    var chips = STATES.map(function (s) {
      return '<button data-act="state" data-key="' + s.key + '" aria-pressed="' + (s.key === S.state) + '">' + esc(s.label) + "</button>";
    }).join("");

    var reqs = st.reqs.map(function (r) {
      return '<span class="omark" style="border-style:solid" data-act="pop" data-pop="req:' + r + '">' + r + "</span>";
    }).join(" ");
    var opens = st.opens.length ? st.opens.map(omark).join(" ") : '<span style="opacity:.6">none</span>';
    var edges = st.edges.length ? esc(st.edges.join(" · ")) : '<span style="opacity:.6">none</span>';

    return '' +
      '<div class="chrome">' +
        '<div class="chrome-row">' +
          '<span class="chrome-title">Scene 1 — Tonight\'s roster</span>' +
          '<span class="chrome-sub">DBT Network of Utah · staff dashboard v4 · prototype</span>' +
          '<span class="chrome-spacer"></span>' +
          '<span class="chrome-sub">Signed in: ' + esc(SESSION.signedInAs.name) + '</span>' +
          '<span class="badge role-teacher">' + esc(SESSION.signedInAs.role) + "</span>" +
          '<button class="btn btn-outline btn-sm" data-act="dark">' + (S.dark ? "Light" : "Dark") + "</button>" +
        "</div>" +
        '<div class="stateswitch" role="group" aria-label="State switcher">' + chips + "</div>" +
        '<div class="reqstrip">' +
          "<span><b>State:</b> " + esc(st.label) + "</span>" +
          '<span class="satisfies"><b>Satisfies:</b> ' + reqs + "</span>" +
          "<span><b>Opens made visible:</b> " + opens + "</span>" +
          "<span><b>Edge cases:</b> " + edges + "</span>" +
        "</div>" +
      "</div>";
  }

  function renderIdentity() {
    var s = S.session;
    var sibs = SESSION.siblings.map(function (x) {
      return '<div class="sibling' + (x.here ? " is-here" : "") + '">' +
        '<span class="sib-name">' + esc(x.name) + "</span>" +
        '<span class="mono" style="font-size:11px">' + esc(x.id) + "</span> · " + esc(x.when) +
        (x.here ? "" : ' · <span data-act="deadend" data-scene="1" data-name="the other section\'s roster" class="deadend">open</span>') +
        "</div>";
    }).join("");

    var dateLine = s.backfill
      ? "<strong>" + esc(s.effective) + "</strong> · backfilled"
      : s.guard
        ? "<strong>" + esc(s.date) + "</strong> · not yet taught"
        : "<strong>" + esc(s.date) + "</strong> · " + esc(SESSION.clock) + " " + esc(SESSION.tz);

    return '' +
      '<div class="card"><div class="card-head"><div class="identity">' +
        '<div class="identity-main">' +
          "<h1>" + esc(SESSION.className) + " — " + esc(SESSION.section) + " section</h1>" +
          '<div class="when">' + dateLine + " · Round " + SESSION.round +
            " · <span class=\"badge mod-" + SESSION.module.code + '">' + esc(SESSION.module.name) +
            "</span> week " + SESSION.module.week + " of " + SESSION.module.of + "</div>" +
          '<div class="siblings">' + sibs + "</div>" +
        "</div>" +
        '<div class="meta-col">' +
          '<div class="teachers"><b>Teachers</b><br>' + SESSION.teachers.map(esc).join("<br>") + "</div>" +
          '<div class="teachers">Ladder + free-pass window since<br><span class="mono">' + esc(SESSION.roundFirstSession) + "</span></div>" +
        "</div>" +
      "</div></div></div>";
  }

  function renderBanners() {
    var s = S.session, out = "";

    if (s.cancelled && !S.cancelUndone) {
      out += '<div class="notice notice-crit"><div class="n-body">' +
        "<strong>This night is cancelled — " + esc(s.cancelled.mode) + ".</strong><br>" +
        esc(s.cancelled.reason) + '<br><span class="tt">Cancelled by ' + esc(s.cancelled.by) + " · " + esc(s.cancelled.at) + "</span><br>" +
        "Marking controls are not rendered. This night is skipped entirely by the miss ladder. " +
        '<span class="mono" style="font-size:11px">REQ-SO-03 · REQ-SO-21</span>' +
        "</div>" +
        '<button class="btn btn-outline btn-sm" data-act="undo-cancel">Undo cancellation</button></div>';
    }
    if (s.cancelled && S.cancelUndone) {
      out += '<div class="notice notice-info"><div class="n-body">' +
        "<strong>Cancellation undone.</strong> The re-opening is itself recorded — " +
        '<span class="tt">re-opened by ' + esc(SESSION.signedInAs.name) + " · Tue 8 Sep 2026, 7:55 PM</span>. " +
        'Marking is live again. <span class="mono" style="font-size:11px">REQ-SO-17</span></div>' +
        '<button class="btn btn-outline btn-sm" data-act="redo-cancel">Re-cancel</button></div>';
    }

    if (s.backfill) {
      out += '<div class="notice notice-info"><div class="n-body">' +
        "<strong>Backfilling a past night — night " + s.backfill.index + " of " + s.backfill.of + " in this catch-up run.</strong><br>" +
        '<span class="mono">Effective date</span> ' + esc(s.effective) +
        ' &nbsp;·&nbsp; <span class="mono">Recorded at</span> ' + esc(s.recordedAt) + " by " + esc(BACKFILL_RUN.recordedBy) + "<br>" +
        "Both timestamps ride every row written here. There is no backdating cutoff. " +
        omark("O-23") + ' <span class="mono" style="font-size:11px">REQ-SO-04</span>' +
        "</div></div>";
    }

    if (s.guard) {
      out += '<div class="notice notice-crit"><div class="n-body">' +
        "<strong>Refused — " + esc(s.guard.headline) + "</strong><br>" + esc(s.guard.detail) +
        ' <span class="mono" style="font-size:11px">REQ-SO-03</span></div></div>';
      if (S.refusals.length) {
        out += '<div class="notice notice-muted"><div class="n-body"><strong>Earlier refusals this evening</strong><br>' +
          S.refusals.map(function (r) {
            return '<span class="mono" style="font-size:11px">' + esc(r.when) + "</span> — attempted <b>" + esc(r.target) +
              "</b>. " + esc(r.why) + " <em>" + esc(r.notRetargeted) + "</em>";
          }).join("<br>") + "</div></div>";
      }
    }

    // Hygiene advisory: unmarked ≠ missed (O-08). Advisory, never a block.
    var unmarked = S.rows.filter(function (id) { return !S.marks[id]; });
    var live = !s.cancelled || S.cancelUndone;
    if (live && unmarked.length && (S.state === "partial" || S.state === "backfilled")) {
      out += '<div class="notice notice-warn"><div class="n-body">' +
        "<strong>" + unmarked.length + " of " + S.rows.length + " clients unmarked on this night — unmarked is not a miss.</strong><br>" +
        "These rows stay blank in the record and contribute nothing to any ladder. They will appear in the " +
        '<span class="deadend" data-act="deadend" data-scene="2" data-name="the nights-unrecorded hygiene list">nights-unrecorded hygiene list</span> for this class\'s Teachers. ' +
        omark("O-08") + ' <span class="mono" style="font-size:11px">REQ-SO-05</span>' +
        "</div></div>";
    }

    if (S.state === "freepass") {
      out += '<div class="notice notice-info"><div class="n-body">' +
        "<strong>Free-pass is a recorded fact, not a permission.</strong> Two clients on this roster have already spent " +
        "this series' pass (anchored at " + esc(SESSION.roundFirstSession) + "). The fourth button stays live on their rows: " +
        "a second free-pass can still be recorded, it simply counts as a miss like every other absence. " +
        omark("O-19") + ' <span class="mono" style="font-size:11px">REQ-SO-01</span></div></div>';
    }

    return out;
  }

  function renderRow(id) {
    var c = byId(id);
    var s = S.session;
    var m = S.marks[id];
    var lad = ladder(c);
    var before = ladderBefore(c);
    var eor = eorSignal(c);
    var live = (!s.cancelled || S.cancelUndone);
    var blocked = !!s.guard || !!c.windowClosedOn;

    // -- name cell -----------------------------------------------------------
    var chips = "";
    if (eor) chips += '<span class="badge ' + eor.cls + '" title="' + esc(eor.text) + '">' + esc(eor.text) + "</span>";
    if (c.plannedAbsence) {
      chips += '<span class="badge badge-outline" data-act="pop" data-pop="planned:' + id +
        '" style="cursor:pointer">Planned absence</span>' + omark("O-21");
    }
    if (c.outOfRoster) chips += '<span class="badge status-active">Attended out-of-roster</span>';
    if (c.windowClosedOn) chips += '<span class="badge status-dropped">Membership window closed</span>';
    if (c.note) chips += '<span class="badge badge-muted">' + esc(c.note) + "</span>";

    var sub = c.payer === "contract"
      ? "Contract therapist — no SimplePractice record"
      : "Insurance";
    var nameCell =
      '<td class="popanchor"><div class="namecell"><div class="nameline">' +
        '<span class="clientlink" data-act="deadend" data-scene="8" data-name="' + esc(c.name) + '’s client profile">' + esc(c.name) + "</span>" +
        chips +
      "</div>" +
      '<div class="subline">' + esc(sub) +
        ' · <span class="deadend" data-act="pop" data-pop="contact:' + id + '">contact</span>' +
        ' · coverage <span class="mono">' + c.coverage.done + " of " + c.coverage.of + "</span>" +
        (c.joinedAtBoundary ? " · joined at boundary <span class=\"mono\">" + esc(c.joinedAtBoundary) + "</span>" : "") +
        (c.outOfRoster ? ' · home section <b>' + esc(c.homeSection) + "</b>" : "") +
      "</div>" +
      (S.pop === "contact:" + id ? pop_contact(c) : "") +
      (S.pop === "planned:" + id ? pop_planned(c) : "") +
      "</div></td>";

    // -- ladder cell ---------------------------------------------------------
    var ladCell =
      '<td class="popanchor"><div class="laddercell">' +
        '<span class="badge lad-' + lad.tier + '">' + TIER_LABEL[lad.tier] + " · " + lad.total + " of 4</span>" +
        '<button class="laddermath" data-act="pop" data-pop="ladder:' + id + '">show the arithmetic</button>' +
        (S.state === "backfilled" && id === "c4"
          ? '<button class="laddermath" data-act="pop" data-pop="history:' + id + '">flag history (7 nights)</button>' : "") +
      "</div>" +
      (S.pop === "ladder:" + id ? pop_ladder(c, lad) : "") +
      (S.pop === "history:" + id ? pop_history(c) : "") +
      "</td>";

    // -- attendance cell -----------------------------------------------------
    var attCell = "<td>";
    if (!live) {
      // The banner says why once; repeating it on every row is noise, not clarity.
      attCell += '<span class="rowadvisory mut" aria-label="No marking controls on a cancelled night">—</span>';
    } else {
      var advanceWarning = (before === 3);
      var btns = CODES.map(function (cd) {
        var isOn = m && m.code === cd.code;
        var advisory = advanceWarning && (cd.code === "A" || cd.code === "F");
        var cls = "codebtn" + (isOn ? " " + cd.on : "") + (advisory ? " advisory" : "");
        return '<button class="' + cls + '" aria-pressed="' + !!isOn + '"' +
          ' aria-label="' + esc(c.name) + ": " + cd.spoken + '"' +
          ' data-act="mark" data-c="' + id + '" data-code="' + cd.code + '">' + cd.label + "</button>";
      }).join("");
      attCell += '<div class="codegroup' + (blocked ? " refusing" : "") + '" role="group" aria-label="Attendance for ' + esc(c.name) + '">' + btns + "</div>";

      if (c.windowClosedOn) {
        attCell += '<div class="rowadvisory crit">Writes on this row are refused — membership window closed ' +
          esc(c.windowClosedOn) + ". The buttons stay reachable and say so when pressed. " +
          '<button class="btn btn-outline btn-xs" data-act="sheet" data-kind="outofroster" data-c="' + id + '">Record out-of-roster attendance instead</button>' +
          ' <span class="mono" style="font-size:11px">REQ-SO-03 · REQ-SO-06</span></div>';
      }

      // The ladder prose shows in the frames about the ladder, and always on a
      // row whose ladder moved because of a mark made in this sitting.
      var ladderFrame = (S.state === "flagged" || S.state === "full" ||
        (m && (m.code === "A" || m.code === "F") && lad.tier !== "clear"));
      if (advanceWarning && ladderFrame) {
        attCell += '<div class="rowadvisory warn"><b>Advance warning:</b> at ' + before +
          " misses, the next Absent or Free-pass reaches <b>max (4)</b>. Nothing here is blocked. " +
          '<span class="mono" style="font-size:11px">REQ-SO-22</span></div>';
      }
      if (lad.tier === "max" && ladderFrame) {
        attCell += '<div class="rowadvisory crit"><b>Max (4 misses).</b> Advisory only — nothing drops automatically; ' +
          'a drop is a human act with a decision record. <span class="deadend" data-act="deadend" data-scene="5" data-name="Miss-ladder escalation">Open Scene 5</span> ' +
          '<span class="mono" style="font-size:11px">REQ-SO-23</span></div>';
      }
      if (c.freePassUsedOn && S.state === "freepass") {
        attCell += '<div class="rowadvisory mut">Free-pass already used <b>' + esc(c.freePassUsedOn) +
          "</b> this series. Recording a second is permitted and counts as a miss. " + omark("O-19") +
          ' <span class="mono" style="font-size:11px">REQ-SO-01</span></div>';
      }
      if (c.joinedAtBoundary && S.state === "flagged") {
        attCell += '<div class="rowadvisory mut">Joined mid-rotation. No end-of-round signal: the signal reads ' + c.coverage.done +
          ' of ' + c.coverage.of + ' <b>personal coverage</b>, not the class calendar — which is on its final module for others in this room. ' +
          '<span class="mono" style="font-size:11px">REQ-CL-17</span></div>';
      }
      if (c.plannedAbsence) {
        attCell += '<div class="rowadvisory mut">Planned absence through <b>' + esc(c.plannedAbsence.through) +
          "</b>. Staff see the reason; the ladder does not — a miss still counts. " +
          '<span class="mono" style="font-size:11px">REQ-SO-25</span></div>';
      }
      if (m) {
        attCell += '<div class="rowadvisory mut"><span class="mono">' + CODE_NAME[m.code] +
          " · eff " + esc(m.effective) + " · rec " + esc(m.at) + " · " + esc(m.by) + "</span>" +
          (m.history.length
            ? ' <button class="btn btn-ghost btn-xs" data-act="pop" data-pop="audit:' + id + '">corrected ×' + m.history.length + "</button>"
            : "") +
          (m.outOfRoster ? " <b>out-of-roster fact</b>" : "") +
          ' <span class="mono" style="font-size:11px">REQ-SO-04</span></div>';
      }
      if (m && m.by !== SESSION.signedInAs.name) {
        attCell += '<div class="rowadvisory warn">Already marked by <b>' + esc(m.by) + "</b> at " + esc(m.at) +
          ". Marking again is recorded as a correction, not an overwrite.</div>";
      }
    }
    attCell += (S.pop === "audit:" + id ? pop_audit(c, m) : "");
    attCell = attCell.replace("<td>", '<td class="popanchor">');

    // -- note cell -----------------------------------------------------------
    var note = m && m.note;
    var noteCell = "<td>" +
      '<button class="notebtn' + (note ? " has-note" : "") + '" data-act="sheet" data-kind="note" data-c="' + id + '">' +
        (note ? "Edit session note" : "+ Session note") + "</button>" +
      (note ? '<div class="rowadvisory mut" style="max-width:200px">' + esc(note) + "</div>" : "") +
      "</td>";

    var rowCls = lad.tier === "max" ? " class=\"row-max\"" : (c.outOfRoster || c.windowClosedOn ? ' class="row-outside"' : "");
    return "<tr" + rowCls + ">" + nameCell + ladCell + attCell + noteCell + "</tr>";
  }

  function renderRoster() {
    var s = S.session;
    var live = (!s.cancelled || S.cancelUndone);
    var marked = S.rows.filter(function (id) { return !!S.marks[id]; }).length;

    var legend = '<div class="legendrow">' +
      "<span><b>" + marked + " of " + S.rows.length + "</b> marked" +
      (live ? "" : " · night cancelled") + "</span>" +
      '<div class="legend">' + CODES.map(function (c) {
        return "<span><b>" + c.label + "</b> " + c.spoken + "</span>";
      }).join("") + "</div></div>";

    var head = "<thead><tr>" +
      "<th>Client</th><th>Miss ladder<br><span style=\"font-weight:400\">derived at read time</span></th>" +
      "<th>Attendance " + (S.state === "unmarked" || S.state === "freepass" ? omark("O-19") : "") + "</th>" +
      "<th>Session note</th></tr></thead>";

    var body = "<tbody>" + S.rows.map(renderRow).join("") + "</tbody>";

    var actions = '<div class="actionbar">' +
      (live
        ? '<button class="btn btn-default btn-lg" data-act="deadend" data-scene="2" data-name="Close the night">Close the night</button>'
        : '<button class="btn btn-outline btn-lg" data-act="undo-cancel">Undo cancellation</button>') +
      '<button class="btn btn-outline" data-act="sheet" data-kind="outofroster" data-c="">Record out-of-roster attendance</button>' +
      '<button class="btn btn-ghost" data-act="deadend" data-scene="11" data-name="Cancel a night">This night is not happening</button>' +
      '<span class="spacer"></span>' +
      (live && marked < S.rows.length
        ? '<span class="closehint">Closing with ' + (S.rows.length - marked) +
          " unmarked is allowed — unmarked is not a miss (REQ-SO-05). The advisory does not gate the button.</span>"
        : "") +
      "</div>";

    return '<div class="card"><div class="card-body" style="padding-top:16px">' +
      legend + '<div style="overflow-x:auto"><table class="roster">' + head + body + "</table></div>" +
      "</div>" + actions + "</div>";
  }

  // ------------------------------------------------------------- popovers ---

  function popShell(inner) {
    return '<div class="pop" style="top:100%;left:0;margin-top:6px">' +
      '<button class="btn btn-ghost btn-xs popclose" data-act="pop" data-pop="">×</button>' + inner + "</div>";
  }

  function pop_contact(c) {
    return popShell("<h4>" + esc(c.name) + "</h4><dl>" +
      "<dt>Phone</dt><dd class=\"mono\">" + esc(c.phone) + "</dd>" +
      "<dt>Email</dt><dd class=\"mono\">" + esc(c.email) + "</dd>" +
      "<dt>Provider</dt><dd>" + esc(c.provider) + "</dd>" +
      "<dt>Payer</dt><dd>" + (c.payer === "contract" ? "Contract therapist — contact details live here, not in SimplePractice" : "Insurance") + "</dd>" +
      "</dl>");
  }

  function pop_planned(c) {
    var p = c.plannedAbsence;
    return popShell("<h4>Planned absence " + omark("O-21") + "</h4>" +
      "<dl><dt>Reason</dt><dd>" + esc(p.reason) + "</dd>" +
      "<dt>From</dt><dd>" + esc(p.from) + "</dd>" +
      "<dt>Through</dt><dd>" + esc(p.through) + "</dd>" +
      "<dt>Recorded</dt><dd>" + esc(p.recordedBy) + " · " + esc(p.recordedOn) + "</dd></dl>" +
      '<hr class="hr"><p style="margin:0;font-size:12px">Visible to staff, reason-blind to the ladder: an absence tonight still counts. ' +
      '<span class="mono" style="font-size:11px">REQ-SO-25</span></p>');
  }

  function pop_ladder(c, lad) {
    var m = S.marks[c.id];
    var rows = "<dt>Absences this round</dt><dd class=\"mono\">" + lad.absences + "</dd>" +
      "<dt>Free-passes this round</dt><dd class=\"mono\">" + lad.freePasses + "</dd>" +
      "<dt>Missed individual therapy</dt><dd class=\"mono\">" + lad.it +
        (c.itMissDetail ? ' <span style="font-size:11px">(' + esc(c.itMissDetail.on) + ", logged by " + esc(c.itMissDetail.by) + ")</span>" : "") + "</dd>" +
      "<dt>Late / Present</dt><dd class=\"mono\">never counted</dd>" +
      "<dt>Cancelled nights</dt><dd class=\"mono\">skipped entirely</dd>" +
      "<dt><b>Total</b></dt><dd class=\"mono\"><b>" + lad.total + " → " + TIER_LABEL[lad.tier] + "</b></dd>";
    return popShell("<h4>How this badge was derived</h4>" +
      '<p style="margin:0 0 8px;font-size:12px">Counted from ' + esc(SESSION.roundFirstSession) +
      " (round " + SESSION.round + "'s first session), recomputed on every read — never stored.</p>" +
      "<dl>" + rows + "</dl>" +
      (m && (m.code === "A" || m.code === "F") ? '<hr class="hr"><p style="margin:0;font-size:12px">Includes tonight’s ' + CODE_NAME[m.code] + ".</p>" : "") +
      '<hr class="hr"><p style="margin:0;font-size:11px" class="mono">REQ-SO-21 · REQ-CL-10 · warn@2 critical@3 max@4</p>');
  }

  function pop_history(c) {
    var rows = BACKFILL_RUN.joshHistory.map(function (h) {
      return "<dt class=\"mono\">" + esc(h.effective) + "</dt><dd>" + esc(h.mark) +
        ' → <span class="badge lad-' + h.tier + '">' + TIER_LABEL[h.tier] + " · " + h.running + " of 4</span></dd>";
    }).join("");
    return popShell("<h4>Flag history across the backfill</h4>" +
      '<p style="margin:0 0 8px;font-size:12px">Seven nights entered in one sitting on ' + esc(BACKFILL_RUN.recordedAt) +
      ". " + esc(c.name) + " moved from clear to max inside that run — the flags did not exist in real time, and the history says so.</p>" +
      "<dl>" + rows + "</dl>" +
      '<hr class="hr"><p style="margin:0;font-size:11px" class="mono">REQ-SO-04 · REQ-SO-22 · O-23</p>');
  }

  function pop_audit(c, m) {
    if (!m) return "";
    var rows = m.history.map(function (h, i) {
      return "<dt class=\"mono\">#" + (i + 1) + " soft-deleted</dt><dd>" + CODE_NAME[h.code] +
        ' <span class="mono" style="font-size:11px">rec ' + esc(h.at) + " · " + esc(h.by) + "</span></dd>";
    }).join("");
    return popShell("<h4>Attendance row history</h4>" +
      "<dl>" + rows +
      "<dt class=\"mono\">live</dt><dd>" + CODE_NAME[m.code] +
      ' <span class="mono" style="font-size:11px">eff ' + esc(m.effective) + " · rec " + esc(m.at) + " · " + esc(m.by) + "</span></dd></dl>" +
      '<hr class="hr"><p style="margin:0;font-size:12px">Corrections are soft-delete + append. No row was edited in place and nothing was hard-deleted. ' +
      '<span class="mono" style="font-size:11px">REQ-SO-02</span></p>');
  }

  function pop_floating() {
    if (!S.pop) return "";
    if (S.pop.indexOf("open:") === 0) {
      var id = S.pop.slice(5);
      return '<div class="scrim" data-act="pop" data-pop=""></div>' +
        '<div class="dialog"><h2>' + id + " — open decision</h2><p>" + esc(OPENS[id]) + "</p>" +
        '<p style="font-size:13px">This screen makes the question visible. It does not answer it — the answer belongs in ' +
        "<span class=\"mono\">07-open-decisions.md</span>.</p>" +
        '<div class="dlgactions"><button class="btn btn-outline" data-act="pop" data-pop="">Close</button></div></div>';
    }
    if (S.pop.indexOf("req:") === 0) {
      var r = S.pop.slice(4);
      return '<div class="scrim" data-act="pop" data-pop=""></div>' +
        '<div class="dialog"><h2>' + r + "</h2><p>" + esc(REQ_TEXT[r] || "") + "</p>" +
        '<div class="dlgactions"><button class="btn btn-outline" data-act="pop" data-pop="">Close</button></div></div>';
    }
    return "";
  }

  // --------------------------------------------------- sheets and dialogs ---

  function renderSheet() {
    if (!S.sheet) return "";
    var k = S.sheet.kind;
    if (k === "note") {
      var c = byId(S.sheet.clientId);
      var m = S.marks[S.sheet.clientId];
      var existing = (m && m.note) || "";
      return '<div class="scrim" data-act="closesheet"></div><div class="sheet">' +
        "<header><h2>Session note</h2>" +
        '<div class="subline">' + esc(c.name) + " · " + esc(S.session.effective) + " · " + esc(SESSION.module.name) + "</div></header>" +
        '<div class="sheetbody">' +
          '<p style="font-size:13px;color:var(--muted-foreground);margin-top:0">One note per client per night, per author. Editing appends a new version; the previous one is soft-deleted, never overwritten.</p>' +
          '<textarea class="ta" rows="9" id="noteta" placeholder="What happened for ' + esc(c.name) + ' tonight…">' + esc(existing) + "</textarea>" +
          '<p class="tt" style="margin-top:10px">Author ' + esc(SESSION.signedInAs.name) + " · effective " + esc(S.session.effective) +
          " · recorded " + esc(S.session.recordedAt) + "</p>" +
          '<hr class="hr"><p style="font-size:12px;color:var(--muted-foreground)">Writing the note here does not mark attendance, and marking attendance does not write a note. ' +
          'The unwritten-notes queue lives in <span class="deadend" data-act="deadend" data-scene="3" data-name="Write session notes">Scene 3</span>.</p>' +
        "</div>" +
        '<footer><button class="btn btn-default" data-act="savenote">Save note</button>' +
        '<button class="btn btn-ghost" data-act="closesheet">Cancel</button></footer></div>';
    }
    if (k === "outofroster") {
      var pre = S.sheet.clientId ? byId(S.sheet.clientId) : null;
      return '<div class="scrim" data-act="closesheet"></div><div class="sheet">' +
        "<header><h2>Attended out-of-roster</h2>" +
        '<div class="subline">' + esc(S.session.effective) + " · " + esc(SESSION.className) + " — " + esc(SESSION.section) + "</div></header>" +
        '<div class="sheetbody">' +
          '<div class="notice notice-info"><div class="n-body">Someone in the room who is not on tonight’s roster is a routine event, not an error. ' +
          "It is recorded as a sanctioned fact against this night rather than refused. " +
          '<span class="mono" style="font-size:11px">REQ-SO-06</span></div></div>' +
          '<div class="stack">' +
            "<label style=\"font-size:13px\">Who attended</label>" +
            '<select id="oorwho" class="ta" style="height:38px">' +
              (pre ? '<option value="' + pre.id + '">' + esc(pre.name) + "</option>" : "") +
              '<option value="x1">Renee Ashby — Adult PM Thursday section</option>' +
              '<option value="x2">Gregor Pyle — membership window closed 22 Aug 2026</option>' +
            "</select>" +
            "<label style=\"font-size:13px\">Why they are outside the guard</label>" +
            '<select id="oorwhy" class="ta" style="height:38px">' +
              "<option>Attended the other identical section (Tue/Thu pair)</option>" +
              "<option>Membership window closed but the client showed up</option>" +
              "<option>Other — annotate below</option>" +
            "</select>" +
            "<label style=\"font-size:13px\">Attendance code for the fact</label>" +
            '<select id="oorcode" class="ta" style="height:38px"><option value="P">Present</option><option value="L">Late</option></select>' +
            '<textarea class="ta" rows="3" id="oornote" placeholder="Annotation (optional)"></textarea>' +
          "</div>" +
          '<p class="tt" style="margin-top:12px">The fact lands on this night with both timestamps. It does not move the client onto this roster and it does not retarget their home section.</p>' +
        "</div>" +
        '<footer><button class="btn btn-default" data-act="saveoor">Record the fact</button>' +
        '<button class="btn btn-ghost" data-act="closesheet">Cancel</button></footer></div>';
    }
    return "";
  }

  function renderDialog() {
    if (!S.dialog) return "";
    var d = S.dialog;
    if (d.kind === "correct") {
      var c = byId(d.clientId), m = S.marks[d.clientId];
      return '<div class="scrim" data-act="closedialog"></div><div class="dialog">' +
        "<h2>Correct " + esc(c.name) + "’s mark?</h2>" +
        "<p><b>" + CODE_NAME[m.code] + "</b> → <b>" + CODE_NAME[d.code] + "</b>" +
        (m.by !== SESSION.signedInAs.name ? " &nbsp;·&nbsp; the live row was written by " + esc(m.by) + " at " + esc(m.at) : "") + "</p>" +
        '<p>The existing row is <b>soft-deleted</b> and a new row is <b>appended</b>. Nothing is edited in place and nothing is hard-deleted; both rows stay on the record with their own timestamps. ' +
        '<span class="mono" style="font-size:11px">REQ-SO-02</span></p>' +
        '<div class="dlgactions"><button class="btn btn-ghost" data-act="closedialog">Cancel</button>' +
        '<button class="btn btn-default" data-act="confirmcorrect">Soft-delete and append</button></div></div>';
    }
    if (d.kind === "deadend") {
      return '<div class="scrim" data-act="closedialog"></div><div class="dialog">' +
        "<h2>Scene " + esc(d.scene) + "</h2>" +
        "<p>" + esc(d.name) + " lives in another scene. This prototype builds Scene 1 only, so this is a labelled dead end.</p>" +
        '<div class="dlgactions"><button class="btn btn-default" data-act="closedialog">Back to the roster</button></div></div>';
    }
    return "";
  }

  function renderToasts() {
    if (!S.toasts.length) return "";
    return '<div class="toasts">' + S.toasts.map(function (t) {
      return '<div class="toast t-' + t.kind + '"><div class="bar"></div><div>' + t.html + "</div>" +
        (t.undo ? '<button class="btn btn-outline btn-xs undo" data-act="undotoast" data-id="' + t.id + '">Undo</button>' : "") +
        "</div>";
    }).join("") + "</div>";
  }

  function render() {
    document.documentElement.className = S.dark ? "dark" : "";
    var html = renderChrome() +
      "<main>" + renderIdentity() + renderBanners() + renderRoster() +
      '<p class="tt" style="margin-top:18px">Dead ends from this scene: ' +
        '<span class="deadend" data-act="deadend" data-scene="2" data-name="Close the night">Scene 2 — Close the night</span> · ' +
        '<span class="deadend" data-act="deadend" data-scene="3" data-name="Write session notes">Scene 3 — Write session notes</span> · ' +
        '<span class="deadend" data-act="deadend" data-scene="5" data-name="Miss-ladder escalation">Scene 5 — Miss-ladder escalation</span> · ' +
        '<span class="deadend" data-act="deadend" data-scene="8" data-name="Client profile">Scene 8 — Client profile</span> · ' +
        '<span class="deadend" data-act="deadend" data-scene="11" data-name="Cancel a night">Scene 11 — Cancel a night</span></p>' +
      "</main>" +
      pop_floating() + renderSheet() + renderDialog() + renderToasts();
    document.getElementById("app").innerHTML = html;
  }

  // --------------------------------------------------------------- events ---

  function toast(kind, html, undo) {
    var t = { id: ++toastSeq, kind: kind, html: html, undo: !!undo };
    S.toasts.push(t);
    if (S.toasts.length > 3) S.toasts.shift();
    setTimeout(function () {
      S.toasts = S.toasts.filter(function (x) { return x.id !== t.id; });
      render();
    }, 9000);
    render();   // a refusal that never repaints is a silent refusal (REQ-SO-03)
    return t;
  }

  function nowStamp() {
    return S.session.backfill ? BACKFILL_RUN.recordedAt : "Tue 8 Sep 2026, 8:0" + (toastSeq % 10) + " PM";
  }

  function doMark(id, code) {
    var c = byId(id), s = S.session;

    if (s.cancelled && !S.cancelUndone) {
      toast("error", "<b>Refused.</b> " + esc(s.date) + " is cancelled (" + esc(s.cancelled.mode) +
        "). Attendance cannot be recorded against a night that did not happen, and this will not be retargeted to another date. <span class=\"mono\">REQ-SO-03</span>");
      return;
    }
    if (s.guard) {
      toast("error", "<b>Refused.</b> " + esc(s.guard.headline) +
        " No attendance was written and nothing was retargeted to Tue 8 Sep 2026. <span class=\"mono\">REQ-SO-03</span>");
      return;
    }
    if (c.windowClosedOn) {
      toast("error", "<b>Refused.</b> " + esc(c.name) + "’s membership window closed " + esc(c.windowClosedOn) +
        ". They are outside the roster guard for this night. Use <b>Record out-of-roster attendance</b> to keep the fact. <span class=\"mono\">REQ-SO-03 · REQ-SO-06</span>");
      return;
    }

    var m = S.marks[id];
    if (m && m.code === code) {
      toast("warn", esc(c.name) + " is already recorded as <b>" + CODE_NAME[code] +
        "</b>. No change written — re-marking the same code is not an edit.");
      return;
    }
    if (m) { S.dialog = { kind: "correct", clientId: id, code: code }; render(); return; }

    var beforeTier = ladder(c).tier;
    S.marks[id] = mk(code, SESSION.signedInAs.name, nowStamp());
    var after = ladder(c);

    var msg = "<b>" + esc(c.name) + " · " + CODE_NAME[code] + "</b> recorded.<br>" +
      '<span class="mono" style="font-size:11px">effective ' + esc(S.session.effective) +
      " · recorded " + esc(S.marks[id].at) + "</span>";
    if (after.tier !== beforeTier && (code === "A" || code === "F")) {
      msg += "<br>Ladder moved <b>" + TIER_LABEL[beforeTier] + " → " + TIER_LABEL[after.tier] +
        "</b> (" + after.total + " of 4). Advisory only — no automatic drop.";
    }
    if (c.plannedAbsence && (code === "A" || code === "F")) {
      msg += "<br>A planned absence is recorded for tonight. The reason is visible to staff; the miss still counts.";
    }
    toast("ok", msg);
    render();
  }

  function onClick(e) {
    var el = e.target.closest("[data-act]");
    if (!el) { if (S.pop) { S.pop = null; render(); } return; }
    var act = el.getAttribute("data-act");

    if (act === "state") {
      S.state = el.getAttribute("data-key"); seed(S.state);
      if (typeof location !== "undefined") try { location.hash = S.state; } catch (_) {}
      render(); return;
    }
    if (act === "dark") { S.dark = !S.dark; render(); return; }
    if (act === "pop") { var p = el.getAttribute("data-pop"); S.pop = p || null; render(); return; }
    if (act === "mark") { S.pop = null; doMark(el.getAttribute("data-c"), el.getAttribute("data-code")); return; }

    if (act === "sheet") {
      S.sheet = { kind: el.getAttribute("data-kind"), clientId: el.getAttribute("data-c") || null };
      S.pop = null; render(); return;
    }
    if (act === "closesheet") { S.sheet = null; render(); return; }
    if (act === "savenote") {
      var ta = document.getElementById("noteta");
      var id = S.sheet.clientId;
      if (!S.marks[id]) S.marks[id] = mk("P", SESSION.signedInAs.name, nowStamp());
      var had = !!S.marks[id].note;
      S.marks[id].note = ta.value.trim();
      S.sheet = null;
      toast("ok", (had ? "Session note appended as a new version — the previous one is soft-deleted."
                       : "Session note saved.") +
        ' The unwritten-notes queue is <span class="deadend" data-act="deadend" data-scene="3" data-name="Write session notes">Scene 3</span>.');
      render(); return;
    }
    if (act === "saveoor") {
      var who = document.getElementById("oorwho").value;
      var code = document.getElementById("oorcode").value;
      var c = byId(who);
      if (S.rows.indexOf(who) === -1) S.rows.push(who);
      c.outOfRoster = true;
      S.marks[who] = mk(code, SESSION.signedInAs.name, nowStamp());
      S.marks[who].outOfRoster = true;
      S.sheet = null;
      toast("ok", "<b>" + esc(c.name) + "</b> recorded as <b>attended out-of-roster</b> on " + esc(S.session.effective) +
        ". They were not added to this roster and their home section was not changed. <span class=\"mono\">REQ-SO-06</span>");
      render(); return;
    }

    if (act === "confirmcorrect") {
      var d = S.dialog, m = S.marks[d.clientId], c2 = byId(d.clientId);
      m.history.push({ code: m.code, by: m.by, at: m.at });
      var old = m.code;
      m.code = d.code; m.by = SESSION.signedInAs.name; m.at = nowStamp();
      S.dialog = null;
      toast("ok", "<b>" + esc(c2.name) + "</b>: " + CODE_NAME[old] + " soft-deleted, " + CODE_NAME[d.code] +
        " appended. Both rows remain on the record. <span class=\"mono\">REQ-SO-02</span>");
      render(); return;
    }
    if (act === "closedialog") { S.dialog = null; render(); return; }
    if (act === "deadend") {
      S.dialog = { kind: "deadend", scene: el.getAttribute("data-scene"), name: el.getAttribute("data-name") };
      S.pop = null; S.sheet = null; render(); return;
    }

    if (act === "undo-cancel") {
      S.cancelUndone = true;
      toast("ok", "Cancellation undone in one click. The re-opening is itself a recorded act. <span class=\"mono\">REQ-SO-17</span>");
      render(); return;
    }
    if (act === "redo-cancel") { S.cancelUndone = false; render(); return; }
    if (act === "undotoast") {
      S.toasts = S.toasts.filter(function (t) { return String(t.id) !== el.getAttribute("data-id"); });
      render(); return;
    }
  }

  // Deep-linkable states so a reviewer can send someone a single frame.
  if (typeof location !== "undefined" && location.hash) {
    var want = location.hash.replace("#", "");
    if (want.indexOf(".dark") > -1) { S.dark = true; want = want.replace(".dark", ""); }
    for (var q = 0; q < STATES.length; q++) if (STATES[q].key === want) S.state = want;
  }

  document.addEventListener("click", onClick);
  seed(S.state);
  render();
})();
