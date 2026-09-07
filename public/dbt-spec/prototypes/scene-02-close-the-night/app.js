/* app.js — Scene 2, Close the night.
   Vanilla render + delegated events, no build step, no network.

   The three things this file is careful about:
   1. The night's status (open / closed / reopened / cancelled / amended) is
      NEVER stored. `deriveNight()` folds the append-only `closeLog` on every
      render. Nothing writes a status field.
   2. "N marked · N unmarked · N notes owed" is derived the same way, from live
      attendance rows and live notes.
   3. Nothing in here ever sets [disabled]. A control that will refuse is styled
      as refusing and says why out loud when pressed. */
(function () {
  "use strict";

  // ------------------------------------------------------------- states ---

  var STATES = [
    { key: "unmarked", label: "1 · Open — unmarked",
      reqs: ["REQ-SO-05", "REQ-SO-07"], opens: ["O-08"], edges: [],
      blurb: "The night ran; nobody is marked yet. Closing is still offered — D-14 asked for a ritual, not a lock — and the hygiene prompt names all eight as unrecorded, not missed." },

    { key: "partial", label: "2 · Open — partial",
      reqs: ["REQ-SO-05", "REQ-SO-07", "REQ-SO-13"], opens: ["O-08"], edges: [],
      blurb: "Five marked, three not. The hygiene prompt is housekeeping, not accusation: it names the three, says out loud that unmarked is not a miss, and offers the fastest way to fix it." },

    { key: "closable", label: "3 · Closable",
      reqs: ["REQ-SO-07", "REQ-SO-13"], opens: [],
      edges: ["Half-taught night (fire drill) — closable with a degraded-night note"],
      blurb: "Roster complete, two notes owed. The primary act is live; the does / does-not ledger sits above it so nobody closes wondering what it costs." },

    { key: "closed", label: "4 · Closed",
      reqs: ["REQ-SO-07", "REQ-SO-08", "REQ-SO-13"], opens: [],
      edges: ["Substitute Teacher outside the class's standing two"],
      blurb: "Closed by a named actor at a named time. Undo is one click and sits in the same bar. Jenna Voss ran the night as a substitute and is recorded as one." },

    { key: "reopened", label: "5 · Reopened",
      reqs: ["REQ-SO-07", "REQ-SO-08", "REQ-SO-10"], opens: [], edges: [],
      blurb: "The undo is itself a recorded act. Both rows stand in the log; neither is deleted. The night is open again and back on the unclosed-nights hygiene list." },

    { key: "amended", label: "6 · Closed, later correction",
      reqs: ["REQ-SO-09", "REQ-SO-07"], opens: [],
      edges: ["Attendance dispute weeks later — a closed night carrying an amendment"],
      blurb: "A night closed on 25 Aug, amended on 8 Sep. The correction is a soft-delete plus an append with a reason; the night stays closed. Closing never gated it." },

    { key: "zero", label: "7 · Zero-attendee",
      reqs: ["REQ-SO-11", "REQ-SO-07"], opens: ["O-13"], edges: [],
      blurb: "Everyone no-showed. Closable exactly like any other night. Whether the rotation clock advanced is a separate question — this screen makes it visible and refuses to answer it." },

    { key: "cancelled", label: "8 · Cancelled",
      reqs: ["REQ-SO-17", "REQ-SO-07"], opens: [], edges: [],
      blurb: "The night did not happen, so there is nothing to close. The close control stays reachable and refuses out loud, naming the night it will not retarget to." }
  ];

  // -------------------------------------------------------------- state ---

  var S = {
    state: "unmarked",
    dark: false,
    marks: {},          // clientId -> { code, by, at }
    notes: {},          // clientId -> true (a note by the signed-in author)
    closeLog: [],       // APPEND-ONLY list of recorded acts; status derives from it
    leaders: ["s2"],    // who actually ran the night
    nightDate: SESSION.date,
    nowLine: "",
    cancelled: null,
    degraded: null,
    amendment: null,
    open: {},           // collapsible id -> bool
    dialog: null,
    toasts: [],
    pop: null
  };
  var seq = 0;

  function client(id) {
    for (var i = 0; i < CLIENTS.length; i++) if (CLIENTS[i].id === id) return CLIENTS[i];
    return null;
  }
  function staff(id) {
    for (var i = 0; i < STAFF.length; i++) if (STAFF[i].id === id) return STAFF[i];
    return null;
  }
  function mk(code, by, at) { return { code: code, by: by, at: at }; }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }

  // --------------------------------------------------------- derivation ---
  // Everything below is computed on every render. No status is read from a
  // stored field, because no status is ever written to one.

  function deriveNight() {
    if (S.cancelled) {
      return { status: "cancelled", label: "Cancelled", cls: "st-cancelled",
               closed: false, by: null, at: null, reopened: false };
    }
    var closed = false, by = null, at = null, reopened = false;
    for (var i = 0; i < S.closeLog.length; i++) {
      var e = S.closeLog[i];
      if (e.kind === "CLOSE")  { closed = true;  by = e.by; at = e.at; }
      if (e.kind === "REOPEN") { closed = false; by = e.by; at = e.at; reopened = true; }
    }
    if (closed) {
      return { status: "closed", label: "Closed", cls: "st-closed",
               closed: true, by: by, at: at, reopened: false };
    }
    return {
      status: reopened ? "reopened" : "open",
      label: reopened ? "Open — reopened" : "Open",
      cls: reopened ? "st-reopened" : "st-open",
      closed: false, by: by, at: at, reopened: reopened
    };
  }

  function deriveCounts() {
    var marked = [], unmarked = [], attended = [], owed = [];
    for (var i = 0; i < CLIENTS.length; i++) {
      var c = CLIENTS[i], m = S.marks[c.id];
      if (m) {
        marked.push(c);
        if (ATTENDED[m.code]) {
          attended.push(c);
          if (!S.notes[c.id]) owed.push(c);   // REQ-SO-13: attended + no note by this author
        }
      } else {
        unmarked.push(c);
      }
    }
    return { marked: marked, unmarked: unmarked, attended: attended, owed: owed,
             roster: CLIENTS.length };
  }

  // ---------------------------------------------------------- state seed ---

  function seed(key) {
    S.marks = {}; S.notes = {}; S.closeLog = []; S.leaders = ["s2", "s1"];
    S.nightDate = SESSION.date; S.cancelled = null; S.degraded = null;
    S.nowLine = "it is now " + SESSION.clock + ", class dismissed";
    S.amendment = null; S.dialog = null; S.toasts = []; S.pop = null;
    S.open = { unmarked: true, owed: false, log: false, ledger: true };

    var full = { c1: "P", c2: "L", c3: "A", c4: "P", c5: "A", c6: "P", c7: "P", c8: "F" };

    function apply(map, by, at) {
      for (var id in map) if (map.hasOwnProperty(id)) S.marks[id] = mk(map[id], by, at);
    }
    function noted(list) { for (var i = 0; i < list.length; i++) S.notes[list[i]] = true; }

    if (key === "partial") {
      apply({ c1: "P", c2: "L", c3: "A", c4: "P", c6: "P" }, "Devon Marsh", "7:58 PM");
      noted(SEED_NOTES.partial);
    }
    if (key === "closable") {
      apply(full, "Devon Marsh", "7:59 PM");
      noted(SEED_NOTES.closable);
      S.degraded = DEGRADED_NOTE;
    }
    if (key === "closed" || key === "reopened") {
      apply(full, "Devon Marsh", "7:59 PM");
      noted(SEED_NOTES.closed);
      S.leaders = ["s2", "s3"];                       // Devon + Jenna Voss (substitute)
      S.closeLog.push({ kind: "CLOSE", by: "Devon Marsh", role: "Teacher",
                        at: "Tue 8 Sep 2026, 8:04 PM",
                        leaders: ["s2", "s3"] });
      if (key === "reopened") {
        S.closeLog.push({ kind: "REOPEN", by: "Devon Marsh", role: "Teacher",
                          at: "Tue 8 Sep 2026, 8:11 PM",
                          reason: "Kai texted — he was in the waiting room, not absent." });
      }
    }
    if (key === "amended") {
      S.nightDate = AMENDMENT.night;
      S.nowLine = "you are reading this on " + AMENDMENT.live.at;
      apply(full, "Devon Marsh", "8:00 PM");
      S.marks.c3 = mk("P", AMENDMENT.live.by, AMENDMENT.live.at);   // the appended row
      noted(SEED_NOTES.amended);
      S.leaders = ["s2", "s1"];
      S.closeLog.push({ kind: "CLOSE", by: "Devon Marsh", role: "Teacher",
                        at: "Tue 25 Aug 2026, 8:03 PM", leaders: ["s2", "s1"] });
      S.closeLog.push({ kind: "AMEND", by: AMENDMENT.live.by, role: "Admin",
                        at: AMENDMENT.live.at,
                        what: AMENDMENT.client + ": " + CODE_NAME[AMENDMENT.voided.code] +
                              " voided, " + CODE_NAME[AMENDMENT.live.code] + " appended",
                        reason: AMENDMENT.reason });
      S.amendment = AMENDMENT;
    }
    if (key === "zero") {
      apply({ c1: "A", c2: "A", c3: "A", c4: "A", c5: "A", c6: "A", c7: "A", c8: "A" },
            "Devon Marsh", "7:45 PM");
    }
    if (key === "cancelled") {
      S.cancelled = { mode: "Skip", by: "Christy Bellamy", role: "Admin",
                      at: "Tue 8 Sep 2026, 4:12 PM",
                      reason: "Snow closure — building locked at 4 PM." };
    }
    S.state = key;
  }

  // ------------------------------------------------------------- toasts ---

  function toast(kind, title, body, undoAct) {
    var t = { id: ++seq, kind: kind, title: title, body: body, undo: undoAct || null };
    S.toasts.push(t);
    render();
  }
  function dropToast(id) {
    S.toasts = S.toasts.filter(function (t) { return t.id !== id; });
    render();
  }

  // ------------------------------------------------------------- chrome ---

  function stateMeta() {
    for (var i = 0; i < STATES.length; i++) if (STATES[i].key === S.state) return STATES[i];
    return STATES[0];
  }

  function chromeHTML() {
    var m = stateMeta();
    var sw = STATES.map(function (s) {
      return '<button data-act="state" data-key="' + s.key + '" aria-pressed="' +
             (s.key === S.state) + '">' + esc(s.label) + "</button>";
    }).join("");

    var reqs = m.reqs.map(function (r) {
      return '<button class="omark" data-act="req" data-id="' + r + '">' + r + "</button>";
    }).join(" ");
    var opens = m.opens.map(function (o) {
      return '<button class="omark" data-act="open" data-id="' + o + '">' + o + "</button>";
    }).join(" ");

    return '' +
      '<div class="chrome">' +
        '<div class="chrome-row">' +
          '<span class="chrome-title">Scene 2 — Close the night</span>' +
          '<span class="chrome-sub">DBTU staff dashboard v4 · prototype · build B</span>' +
          '<span class="chrome-spacer"></span>' +
          '<span class="chrome-sub">Signed in as ' + esc(SESSION.signedInAs.name) +
            ' · <span class="badge role-teacher">' + esc(SESSION.signedInAs.role) + "</span></span>" +
          '<button class="btn btn-outline btn-sm" data-act="dark">' +
            (S.dark ? "Light" : "Dark") + "</button>" +
        "</div>" +
        '<div class="stateswitch" role="group" aria-label="Scene states">' + sw + "</div>" +
      "</div>" +
      '<div class="reqstrip">' +
        '<span><b>State ' + esc(m.label) + "</b></span>" +
        "<span>Satisfies " + reqs + "</span>" +
        (opens ? "<span>Makes visible " + opens + "</span>" : "") +
        (m.edges.length ? "<span>Edge case: " + esc(m.edges.join(" · ")) + "</span>" : "") +
        '<span style="flex:1 1 320px">' + esc(m.blurb) + "</span>" +
      "</div>";
  }

  // ------------------------------------------------------------- header ---

  function headerHTML(night) {
    var mod = SESSION.module;
    var leaderPills = S.leaders.map(function (id) {
      var p = staff(id);
      if (!p) return "";
      return '<span class="badge role-teacher">' + esc(p.name) +
             (p.standing ? "" : " · substitute") + "</span>";
    }).join(" ");

    var statusLine;
    if (night.status === "closed") {
      statusLine = "Closed by <strong>" + esc(night.by) + "</strong> at " + esc(night.at);
    } else if (night.status === "cancelled") {
      statusLine = "Cancelled by <strong>" + esc(S.cancelled.by) + "</strong> at " + esc(S.cancelled.at);
    } else if (night.reopened) {
      statusLine = "Reopened by <strong>" + esc(night.by) + "</strong> at " + esc(night.at);
    } else {
      statusLine = "Not closed yet";
    }

    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="identity">' +
          '<div class="identity-main">' +
            "<h1>" + esc(SESSION.className) + " — " + esc(SESSION.section) + "</h1>" +
            '<div class="when"><strong>' + esc(S.nightDate) + "</strong> · 6:00–7:30 PM · " +
              esc(S.nowLine) + "</div>" +
            '<div class="rowflex" style="margin-top:10px">' +
              '<span class="badge mod-' + mod.code + '">' + esc(mod.name) +
                " · week " + mod.week + " of " + mod.of + "</span>" +
              '<span class="badge badge-outline">Round ' + SESSION.round + "</span>" +
              '<span class="badge badge-muted">' + esc(SESSION.sectionId) + "</span>" +
            "</div>" +
          "</div>" +
          '<div class="meta-col">' +
            '<div class="nightstatus">' +
              '<span class="badge tall ' + night.cls + '">' + esc(night.label) + "</span>" +
              (S.amendment ? '<span class="badge tall st-amended">Amended</span>' : "") +
            "</div>" +
            '<div class="teachers">' + statusLine + "</div>" +
            '<div class="teachers">Standing Teachers: ' + esc(SESSION.teachers.join(" · ")) + "</div>" +
            '<div class="leaders" style="justify-content:flex-end">' + leaderPills + "</div>" +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  // ------------------------------------- the one sentence of truth (SEE 1) ---

  function truthHTML(night, k) {
    if (night.status === "cancelled") {
      return '' +
        '<section class="card"><div class="card-head">' +
          '<div class="sectionlabel">Where the night stands</div>' +
          '<div class="truth"><span class="seg">The night did not happen.</span></div>' +
          '<div class="truthsub">Nothing was taught, nothing was marked, and there is nothing to close. ' +
            "Cancelling was its own recorded act with its own one-click undo (REQ-SO-17).</div>" +
        "</div></section>";
    }

    var owedWord = k.owed.length === 1 ? "note owed" : "notes owed";
    var seg = function (n, word, zeroOk) {
      return '<span class="seg"><span class="n' + (n === 0 && zeroOk ? " zero" : "") + '">' +
             n + '</span> <span' + (n === 0 && zeroOk ? ' class="zero"' : "") + ">" +
             esc(word) + "</span></span>";
    };

    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Where the night stands</div>' +
        '<div class="truth">' +
          seg(k.marked.length, "marked", false) + '<span class="sep">·</span>' +
          seg(k.unmarked.length, "unmarked", true) + '<span class="sep">·</span>' +
          seg(k.owed.length, owedWord, true) +
        "</div>" +
        '<div class="truthsub">Out of a roster of ' + k.roster + ". " +
          '<button class="laddermath" data-act="pop" data-id="derivation">show how this is derived</button>' +
          (S.pop === "derivation" ? derivationPopHTML(k) : "") +
        "</div>" +
      "</div>" +
      '<div class="card-body">' + hygieneHTML(k) + owedListHTML(k) + "</div>" +
      "</section>";
  }

  function derivationPopHTML(k) {
    var lines = [
      "roster                 = " + k.roster + " clients on tonight's roster",
      "marked                 = clients with a LIVE attendance row = " + k.marked.length,
      "unmarked               = roster − marked = " + k.unmarked.length,
      "attended               = marked where code ∈ {Present, Late} = " + k.attended.length,
      "notes owed             = attended − noted by " + SESSION.signedInAs.name + " = " + k.owed.length,
      "night status           = fold(closeLog) = " + deriveNight().status
    ];
    return '' +
      '<div class="pop" style="position:relative;margin-top:10px;max-width:none">' +
        '<button class="btn btn-ghost btn-xs popclose" data-act="pop" data-id="">close</button>' +
        "<h4>Derived at read time — nothing here is a stored status</h4>" +
        '<pre class="mono" style="margin:0;font-size:11px;line-height:1.7;white-space:pre-wrap">' +
          esc(lines.join("\n")) + "</pre>" +
        '<div class="small muted mt10">Late counts as present for every derivation ' +
          "(D-10). The notes queue is per author: another Teacher's note does not " +
          "discharge this one's (REQ-SO-13).</div>" +
      "</div>";
  }

  // ------------------------- the hygiene prompt: named, and NOT accusatory ---

  function hygieneHTML(k) {
    if (!k.unmarked.length) {
      return '' +
        '<div class="collapsible tone-muted"><button class="ctrigger" data-act="noop">' +
          '<span class="chev">✓</span><span class="ctext">Every client on the roster has a live ' +
          "attendance row. Nothing is unrecorded.</span></button></div>";
    }
    var body = "";
    if (S.open.unmarked) {
      body = '<div class="cbody">' +
        '<ul class="namelist">' + k.unmarked.map(function (c) {
          return "<li><span class=\"who\">" + esc(c.name) + "</span>" +
                 '<span class="badge badge-outline">unrecorded, not missed</span>' +
                 '<span class="small muted">provider ' + esc(c.provider) + "</span></li>";
        }).join("") + "</ul>" +
        '<div class="small mt10">These names carry <strong>no miss</strong>. Nothing on this list ' +
          "reaches the miss ladder, and closing the night will not turn any of it into an absence " +
          "(REQ-SO-05). The old spreadsheet read a blank cell as a missed session; v4 does not." +
        "</div>" +
        '<div class="rowflex mt10">' +
          '<button class="btn btn-outline btn-sm deadend" data-act="scene" data-n="1">' +
            "Mark the stragglers first → Scene 1</button>" +
          '<span class="small muted">Or close now and backfill later — backdating has no cutoff.</span>' +
        "</div>" +
      "</div>";
    }
    return '' +
      '<div class="collapsible tone-info">' +
        '<button class="ctrigger" data-act="toggle" data-id="unmarked" aria-expanded="' +
          (S.open.unmarked ? "true" : "false") + '">' +
          '<span class="chev">' + (S.open.unmarked ? "▾" : "▸") + "</span>" +
          '<span class="ctext"><strong>' + plural(k.unmarked.length, "client is", "clients are") +
            " unrecorded for this night.</strong> Housekeeping, not a finding — unmarked is not a " +
            "miss (REQ-SO-05).</span>" +
          '<span class="badge tall" style="background:var(--info-accent);color:var(--info-accent-fg)">' +
            k.unmarked.length + "</span>" +
        "</button>" + body +
      "</div>";
  }

  function owedListHTML(k) {
    if (!k.marked.length) return "";
    var body = "";
    if (S.open.owed) {
      body = '<div class="cbody">' +
        (k.owed.length
          ? '<ul class="namelist">' + k.owed.map(function (c) {
              return "<li><span class=\"who\">" + esc(c.name) + "</span>" +
                     '<span class="badge badge-muted">' + esc(CODE_NAME[S.marks[c.id].code]) + "</span>" +
                     '<button class="btn btn-ghost btn-xs deadend" data-act="scene" data-n="3">' +
                       "write the note → Scene 3</button></li>";
            }).join("") + "</ul>"
          : '<div class="small muted">Nobody attended, so no session note is owed. Notes on ' +
            "absent clients are still allowed — absence communication is a primary use — they are " +
            "just not owed (REQ-SO-12).</div>") +
        '<div class="small muted mt10">Derived, not assigned: attended tonight and has no note by ' +
          esc(SESSION.signedInAs.name) + " yet. Closing snapshots this list onto the owed queue; " +
          "it does not write, lock, or nag anyone into writing them (REQ-SO-13).</div>" +
      "</div>";
    }
    return '' +
      '<div class="collapsible tone-muted">' +
        '<button class="ctrigger" data-act="toggle" data-id="owed" aria-expanded="' +
          (S.open.owed ? "true" : "false") + '">' +
          '<span class="chev">' + (S.open.owed ? "▾" : "▸") + "</span>" +
          '<span class="ctext">' + plural(k.owed.length, "session note", "session notes") +
            " owed by you for this night" + (k.owed.length ? "" : " — the queue is clear") + ".</span>" +
          '<span class="badge badge-outline">' + k.owed.length + "</span>" +
        "</button>" + body +
      "</div>";
  }

  // ------------------------------- what closing will and will not do (SEE 3) ---

  function ledgerHTML(night) {
    if (night.status === "cancelled") return "";
    var past = night.closed;
    var col = function (kind, title, rows) {
      return '<div class="col ' + kind + '"><h3>' + esc(title) + "</h3><ul>" +
        rows.map(function (r) {
          return '<li><span class="mk">' + (kind === "will" ? "+" : "—") + "</span><span>" +
                 "<strong>" + esc(r.t) + "</strong> — " + esc(r.d) + "</span></li>";
        }).join("") + "</ul></div>";
    };
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">' + (past ? "What closing did" : "What closing will do") + "</div>" +
        '<div class="ledger">' +
          col("will", past ? "It did" : "It will", LEDGER.will) +
          col("wont", past ? "It did not" : "It will not", LEDGER.wont) +
        "</div>" +
      "</div></section>";
  }

  // ----------------------------------------------- state-specific panels ---

  function degradedHTML() {
    if (!S.degraded) return "";
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="notice notice-warn" style="margin-bottom:0">' +
          '<div class="n-body">' +
            "<strong>Night note — the night ran, degraded.</strong><br>" +
            esc(S.degraded.body) +
            '<div class="tt mt10">' + esc(S.degraded.by) + " · " + esc(S.degraded.at) + "</div>" +
            '<div class="small mt10">There is no "happened, degraded" mode and this screen does not ' +
              "invent one: the night is closable exactly like any other, and the note is what carries " +
              "the truth to whoever reads the run later (08 §2).</div>" +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  function zeroHTML(k) {
    if (S.state !== "zero") return "";
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Zero-attendee night</div>' +
        '<div class="subcard">' +
          "<h3>Closable like any other night (REQ-SO-11)</h3>" +
          '<div class="small">All eight are marked Absent. The roster is complete, so the primary ' +
            "act is live and unqualified. Each Absent counts toward its client's ladder exactly as it " +
            "would on any night; the ladder stays advisory and drops nobody (D-09).</div>" +
        "</div>" +
        '<div class="subcard" style="border-color:var(--info-banner-border);background:var(--info-banner);color:var(--info-banner-fg)">' +
          "<h3>Did the rotation clock advance? " +
            '<button class="omark" data-act="open" data-id="O-13">O-13</button></h3>' +
          '<div class="small">Teachers taught week 5 of Distress Tolerance to an empty room. ' +
            "<strong>This screen does not decide whether that counts.</strong> Closing records that the " +
            "night was closed and by whom — it makes no claim about the clock.</div>" +
          '<div class="small mt10"><strong>Recommendation on file:</strong> the clock follows what the ' +
            "Teachers taught (content delivered), independent of attendance. <strong>Owner:</strong> " +
            "Brittany. Unresolved — take it to her with this frame on screen.</div>" +
          '<div class="rowflex mt10">' +
            '<button class="btn btn-outline btn-sm deadend" data-act="scene" data-n="10">' +
              "Where the clock lives → Scene 10, class &amp; run editor</button>" +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  function cancelledHTML() {
    if (!S.cancelled) return "";
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="notice notice-dropped" style="margin-bottom:0">' +
          '<div class="n-body">' +
            "<strong>Cancelled — mode: " + esc(S.cancelled.mode) + ".</strong> " +
            esc(S.cancelled.reason) +
            '<div class="tt mt10">Recorded by ' + esc(S.cancelled.by) + " · " +
              esc(S.cancelled.role) + " · " + esc(S.cancelled.at) + "</div>" +
            '<div class="small mt10">Skip means the week-5 topic is a <strong>permanent gap</strong> ' +
              "in this run's numbering. It is not renumbered to hide it. The rotation clock did not " +
              "advance and no attendance exists for the date (REQ-SO-17, REQ-SO-18).</div>" +
            '<div class="rowflex mt10">' +
              '<button class="btn btn-outline btn-sm deadend" data-act="scene" data-n="11">' +
                "Undo the cancellation → Scene 11</button>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  function amendmentHTML() {
    if (!S.amendment) return "";
    var a = S.amendment;
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Correction landed after the night was closed</div>' +
        '<div class="amend">' +
          '<div class="arow voided"><span class="lab">voided</span>' +
            '<span><strong>' + esc(a.client) + "</strong> — <s>" + esc(CODE_NAME[a.voided.code]) +
            "</s></span><span class=\"small\">" + esc(a.voided.by) + " · " + esc(a.voided.at) + "</span></div>" +
          '<div class="arow live"><span class="lab">live</span>' +
            "<span><strong>" + esc(a.client) + "</strong> — " + esc(CODE_NAME[a.live.code]) +
            "</span><span class=\"small\">" + esc(a.live.by) + " · " + esc(a.live.at) + "</span></div>" +
        "</div>" +
        '<div class="small mt10"><strong>Reason recorded:</strong> ' + esc(a.reason) + "</div>" +
        '<div class="small muted mt10">' + esc(a.ladderEffect) + "</div>" +
        '<div class="notice notice-info mt14" style="margin-bottom:0"><div class="n-body">' +
          "The night <strong>stays closed</strong>. Closing never gated this correction and never " +
          "will — soft-delete plus append stays available on a closed night forever (REQ-SO-09). " +
          "Nothing was overwritten: both rows are above, and the earlier row is struck through, " +
          "not gone." +
        "</div></div>" +
      "</div></section>";
  }

  // ------------------------------------------- the append-only event log ---

  function logHTML(night) {
    if (!S.closeLog.length) {
      return '' +
        '<section class="card"><div class="card-head">' +
          '<div class="sectionlabel">Recorded acts on this night</div>' +
          '<div class="small muted">None yet. Closing, reopening and every correction each append ' +
            "a row here. Rows are never edited or removed.</div>" +
        "</div></section>";
    }
    var rows = S.closeLog.map(function (e) {
      var what = e.kind === "CLOSE" ? "Night closed"
               : e.kind === "REOPEN" ? "Night reopened"
               : "Attendance amended";
      var extra = "";
      if (e.kind === "CLOSE" && e.leaders) {
        extra = '<span class="small muted">ran by ' + e.leaders.map(function (id) {
          var p = staff(id); return p ? esc(p.name) + (p.standing ? "" : " (substitute)") : "";
        }).join(", ") + "</span>";
      }
      if (e.reason) extra += '<span class="small muted">' + esc(e.reason) + "</span>";
      if (e.what) extra = '<span class="small">' + esc(e.what) + "</span>" + extra;
      return "<li>" +
        '<span class="ev-when">' + esc(e.at) + "</span>" +
        '<span class="ev-what">' + what + "</span>" +
        '<span class="ev-who">' + esc(e.by) + " · " + esc(e.role) + "</span>" +
        extra + "</li>";
    }).join("");

    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Recorded acts on this night — append-only</div>' +
        '<ul class="eventlog">' + rows + "</ul>" +
        '<div class="small muted mt10">The badge at the top of this screen is a fold of these rows, ' +
          "computed on every render. There is no <span class=\"mono\">status</span> column anywhere " +
          "to disagree with them." +
        "</div>" +
      "</div></section>";
  }

  // ---------------------------------------------------------- action bar ---

  function actionsHTML(night, k) {
    var selectEl = '' +
      '<div class="field">' +
        "<label for=\"ranby\">Who actually ran the night</label>" +
        '<select class="sel" id="ranby" data-act="ranby" multiple size="3" ' +
          'aria-describedby="ranbyhelp">' +
          STAFF.map(function (p) {
            return '<option value="' + p.id + '"' +
              (S.leaders.indexOf(p.id) >= 0 ? " selected" : "") + ">" +
              esc(p.name) + " · " + esc(p.role) + (p.standing ? " (standing)" : " (substitute)") +
              "</option>";
          }).join("") +
        "</select>" +
        '<span class="small muted" id="ranbyhelp">Defaults to this class\'s two standing Teachers. ' +
          "Anyone else is recorded as a substitute for this night only.</span>" +
      "</div>";

    var primary, hint;
    if (night.status === "cancelled") {
      primary = '<button class="btn btn-lg refusing" data-act="close-refuse">Close the night</button>';
      hint = "This control is not greyed out — press it and it will tell you why it refuses.";
    } else if (night.closed) {
      primary = k.owed.length
        ? '<button class="btn btn-lg btn-secondary" data-act="scene" data-n="3">' +
          "Write the " + plural(k.owed.length, "owed note", "owed notes") + " → Scene 3</button>"
        : '<button class="btn btn-lg btn-secondary" data-act="scene" data-n="4">' +
          "Read the night as staff will → Scene 4</button>";
      hint = "Closed at " + esc(night.at) + " by " + esc(night.by) + ". Undo sits to the right and " +
             "is one click, now or in November.";
    } else {
      primary = '<button class="btn btn-lg btn-default" data-act="close">Close the night</button>';
      hint = k.unmarked.length
        ? plural(k.unmarked.length, "client is", "clients are") + " still unrecorded. Closing anyway " +
          "is allowed and records nothing about them."
        : "Roster complete. Closing is a ritual, not a lock.";
    }

    var undo = "";
    if (night.closed) {
      undo = '<button class="btn btn-outline" data-act="undo">Undo — reopen the night</button>';
    } else if (night.reopened) {
      undo = '<button class="btn btn-ghost btn-sm" data-act="pop" data-id="undone">' +
             "reopened at " + esc(night.at) + "</button>";
    }

    var correct = night.closed || S.amendment
      ? '<button class="btn btn-outline" data-act="correct">Record a correction</button>' : "";

    return '' +
      '<section class="card">' +
        (night.status === "cancelled" ? "" : '<div class="card-head">' + selectEl + "</div>") +
        '<div class="actionbar">' +
          primary +
          (night.status === "cancelled" ? "" :
            '<button class="btn btn-outline deadend" data-act="scene" data-n="1">' +
            "Back to the roster → Scene 1</button>") +
          correct +
          '<span class="spacer"></span>' +
          '<span class="closehint">' + hint + "</span>" +
          undo +
        "</div>" +
      "</section>";
  }

  // ----------------------------------------------------------- handoffs ---

  function handoffsHTML(night, k) {
    var closed = night.closed;
    if (night.status === "cancelled") {
      return '' +
        '<section class="card"><div class="card-head">' +
          '<div class="sectionlabel">Goes next</div>' +
          '<div class="small muted">Nothing. A night that did not happen owes no notes, refreshes ' +
            "no flags, and becomes no reference view. The three handoffs below this line on a normal " +
            "night are all absent here on purpose.</div>" +
          '<hr class="hr">' +
          '<div class="sectionlabel">The way back in — unclosed nights (REQ-SO-10)</div>' +
          '<ul class="namelist">' +
            UNCLOSED_NIGHTS.map(function (u) {
              return "<li><span class=\"who\">" + esc(u.date) + "</span>" +
                '<span class="small muted">' + esc(u.section) + " · " + u.marked + " of " + u.roster +
                " marked</span></li>";
            }).join("") +
          "</ul>" +
          '<div class="small muted mt10">This cancelled night is <strong>not</strong> on that list. ' +
            "A cancelled night is not an unclosed one, and the hygiene list must not nag anyone about " +
            "a night that never ran.</div>" +
        "</div></section>";
    }
    var card = function (n, title, body, live) {
      return '<button class="handoff' + (live ? "" : " is-pending") + '" data-act="scene" data-n="' +
        n + '"><span class="hscene">Scene ' + n + "</span><strong>" + esc(title) + "</strong><br>" +
        esc(body) + "</button>";
    };
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Goes next</div>' +
        '<div class="handoffs">' +
          card(3, "Write session notes",
               closed ? plural(k.owed.length, "note", "notes") + " snapshotted to your owed queue."
                      : "The owed queue snapshots when you close.", closed) +
          card(5, "Miss-ladder escalation",
               closed ? "Flags refreshed and waiting for a human to look at them."
                      : "Flags refresh on close. Nothing escalates by itself.", closed) +
          card(4, "Provider's morning after",
               closed ? "Tonight's roster is now the reference view."
                      : "Becomes the reference view once closed.", closed) +
        "</div>" +
        '<hr class="hr">' +
        '<div class="sectionlabel">The way back in — unclosed nights (REQ-SO-10)</div>' +
        '<ul class="namelist">' +
          UNCLOSED_NIGHTS.map(function (u) {
            return "<li><span class=\"who\">" + esc(u.date) + "</span>" +
              '<span class="small muted">' + esc(u.section) + " · " + u.marked + " of " + u.roster +
              " marked</span>" +
              '<button class="btn btn-ghost btn-xs" data-act="hygiene">open that night here</button></li>';
          }).join("") +
          (night.closed || night.status === "cancelled" ? "" :
            "<li><span class=\"who\">" + esc(S.nightDate) + '</span><span class="badge badge-outline">' +
            "this night, still open</span></li>") +
        "</ul>" +
        '<div class="small muted mt10">A hygiene list, not a dunning notice. It never marks anyone ' +
          "and never closes anything on your behalf.</div>" +
      "</div></section>";
  }

  // ------------------------------------------------------------ dialogs ---

  function dialogHTML(night, k) {
    if (!S.dialog) return "";
    var d = S.dialog, inner;

    if (d.kind === "close") {
      inner = '' +
        "<h2>Close " + esc(SESSION.className) + " — " + esc(S.nightDate) + "?</h2>" +
        "<p>A ritual act, recorded with your name and the time. Undo is one click, always.</p>" +
        (k.unmarked.length
          ? '<div class="notice notice-info"><div class="n-body"><strong>' +
            plural(k.unmarked.length, "client", "clients") + " unrecorded: " +
            esc(k.unmarked.map(function (c) { return c.name; }).join(", ")) +
            ".</strong> Closing records nothing about them. They are not misses now and will not " +
            "become misses later (REQ-SO-05).</div></div>"
          : "") +
        '<div class="dlgsection"><div class="ledger">' +
          '<div class="col will"><h3>It will</h3><ul>' +
            LEDGER.will.map(function (r) {
              return '<li><span class="mk">+</span><span><strong>' + esc(r.t) + "</strong> — " +
                     esc(r.d) + "</span></li>";
            }).join("") + "</ul></div>" +
          '<div class="col wont"><h3>It will not</h3><ul>' +
            LEDGER.wont.map(function (r) {
              return '<li><span class="mk">—</span><span><strong>' + esc(r.t) + "</strong> — " +
                     esc(r.d) + "</span></li>";
            }).join("") + "</ul></div>" +
        "</div></div>" +
        '<div class="dlgsection"><h3>Who ran the night</h3>' +
          '<div class="leaders">' + (S.leaders.length
            ? S.leaders.map(function (id) {
                var p = staff(id);
                return '<span class="badge role-teacher">' + esc(p.name) +
                       (p.standing ? "" : " · substitute") + "</span>";
              }).join("")
            : '<span class="small muted">Nobody selected — the night will be recorded with no leader.</span>') +
          "</div>" +
          '<div class="small muted mt10">Change it in the select behind this dialog. ' +
            "A substitute is recorded per night; it does not change who teaches this class.</div>" +
        "</div>" +
        '<div class="dlgactions">' +
          '<button class="btn btn-ghost" data-act="dlg-cancel">Not yet</button>' +
          '<button class="btn btn-default" data-act="close-confirm">Close the night</button>' +
        "</div>" +
        '<div class="dlg-meta">Will record: ' + esc(SESSION.signedInAs.name) + " · " +
          esc(SESSION.signedInAs.role) + " · " + esc(SESSION.date) + ", " + esc(SESSION.clock) +
          " (America/Denver)</div>";
    }

    if (d.kind === "correct") {
      inner = '' +
        "<h2>Record a correction</h2>" +
        "<p>Corrections are a soft-delete plus an append. The earlier row stays visible, struck " +
          "through. Nothing is overwritten and nothing is deleted (REQ-SO-09).</p>" +
        '<div class="dlgsection"><h3>Reason for the amendment</h3>' +
          '<textarea class="ta" rows="3" placeholder="e.g. Client and provider both report she attended."></textarea>' +
          '<div class="small muted mt10">The reason is part of the legal record, not a comment.</div>' +
        "</div>" +
        '<div class="notice notice-info"><div class="n-body">This night is <strong>' +
          esc(night.label.toLowerCase()) + "</strong>, and that changes nothing about your ability " +
          "to correct it. Closing is a ritual, not a lock.</div></div>" +
        '<div class="dlgactions">' +
          '<button class="btn btn-ghost" data-act="dlg-cancel">Cancel</button>' +
          '<button class="btn btn-outline deadend" data-act="scene" data-n="1">' +
            "Pick the row to correct → Scene 1</button>" +
        "</div>";
    }

    if (d.kind === "req" || d.kind === "open") {
      var txt = d.kind === "req" ? REQ_TEXT[d.id] : OPENS[d.id];
      inner = "<h2>" + esc(d.id) + "</h2><p>" + esc(txt || "(not cited by this scene)") + "</p>" +
        '<div class="dlgactions"><button class="btn btn-outline" data-act="dlg-cancel">Close</button></div>';
    }

    if (d.kind === "scene") {
      inner = '' +
        "<h2>Scene " + esc(d.n) + " — not built here</h2>" +
        "<p>" + esc(SCENE_NAMES[d.n] || "Adjacent scene") + ". This prototype is Scene 2 only; " +
          "this is a labelled dead end, not a broken link.</p>" +
        '<div class="dlgactions"><button class="btn btn-outline" data-act="dlg-cancel">Back to Scene 2</button></div>';
    }

    return '<div class="scrim" data-act="dlg-cancel"></div><div class="dialog wide" role="dialog" ' +
      'aria-modal="true">' + inner + "</div>";
  }

  var SCENE_NAMES = {
    1: "Tonight's roster — where attendance is marked",
    3: "Write session notes — the owed queue",
    4: "Provider's morning after — the reference view",
    5: "Miss-ladder escalation — advisory flags for human review",
    10: "Class & run editor — where the rotation clock lives",
    11: "Cancel a night — skip, shift, makeup"
  };

  // ------------------------------------------------------------- toasts ---

  function toastsHTML() {
    if (!S.toasts.length) return "";
    return '<div class="toasts">' + S.toasts.map(function (t) {
      return '<div class="toast t-' + t.kind + '"><div class="bar"></div><div>' +
        "<strong>" + esc(t.title) + "</strong><br>" + esc(t.body) + "</div>" +
        (t.undo ? '<button class="btn btn-ghost btn-xs undo" data-act="' + t.undo +
                  '" data-toast="' + t.id + '">Undo</button>' : "") +
        '<button class="btn btn-ghost btn-xs" data-act="toast-dismiss" data-toast="' + t.id +
          '">dismiss</button>' +
      "</div>";
    }).join("") + "</div>";
  }

  // ------------------------------------------------------------- render ---

  function render() {
    var night = deriveNight();
    var k = deriveCounts();
    document.documentElement.classList.toggle("dark", S.dark);
    document.body.className = S.dark ? "dark" : "";

    document.getElementById("app").innerHTML =
      chromeHTML() +
      "<main>" +
        headerHTML(night) +
        truthHTML(night, k) +
        cancelledHTML() +
        degradedHTML() +
        amendmentHTML() +
        zeroHTML(k) +
        ledgerHTML(night) +
        actionsHTML(night, k) +
        logHTML(night) +
        handoffsHTML(night, k) +
      "</main>" +
      dialogHTML(night, k) +
      toastsHTML();
  }

  // ------------------------------------------------------------- events ---

  document.addEventListener("change", function (ev) {
    var sel = ev.target.closest ? ev.target.closest('[data-act="ranby"]') : null;
    if (!sel) return;
    S.leaders = Array.prototype.filter.call(sel.options, function (o) { return o.selected; })
                     .map(function (o) { return o.value; });
    var subs = S.leaders.map(staff).filter(function (p) { return p && !p.standing; });
    if (subs.length) {
      toast("warn", "Substitute recorded for this night",
        subs.map(function (p) { return p.name; }).join(", ") +
        " is not one of this class's two standing Teachers. Recorded as a substitute for " +
        S.nightDate + " only — the class assignment is unchanged.");
    } else {
      render();
    }
  });

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]");
    if (!el) return;
    var act = el.getAttribute("data-act");
    var night = deriveNight();
    var k = deriveCounts();

    if (act === "state")    { seed(el.getAttribute("data-key")); location.hash = S.state; render(); return; }
    if (act === "dark")     { S.dark = !S.dark; render(); return; }
    if (act === "toggle")   { var id = el.getAttribute("data-id"); S.open[id] = !S.open[id]; render(); return; }
    if (act === "pop")      { S.pop = el.getAttribute("data-id") || null; render(); return; }
    if (act === "noop")     { return; }
    if (act === "req")      { S.dialog = { kind: "req",  id: el.getAttribute("data-id") }; render(); return; }
    if (act === "open")     { S.dialog = { kind: "open", id: el.getAttribute("data-id") }; render(); return; }
    if (act === "scene")    { S.dialog = { kind: "scene", n: el.getAttribute("data-n") }; render(); return; }
    if (act === "dlg-cancel") { S.dialog = null; render(); return; }
    if (act === "toast-dismiss") { dropToast(+el.getAttribute("data-toast")); return; }

    if (act === "close")    { S.dialog = { kind: "close" }; render(); return; }
    if (act === "correct")  { S.dialog = { kind: "correct" }; render(); return; }

    if (act === "close-refuse") {
      // Refuse explicitly: say why, and name the night it will NOT retarget to.
      toast("error", "Refused — this night was cancelled",
        SESSION.className + " on " + S.nightDate + " was cancelled by " + S.cancelled.by +
        " at " + S.cancelled.at + " (mode: " + S.cancelled.mode + "). A night that did not happen " +
        "cannot be closed. This will not close Thu 10 Sep 2026 instead — undo the cancellation " +
        "first if the night did in fact run.");
      return;
    }

    if (act === "close-confirm") {
      S.closeLog.push({ kind: "CLOSE", by: SESSION.signedInAs.name, role: SESSION.signedInAs.role,
                        at: SESSION.date + ", " + SESSION.clock, leaders: S.leaders.slice() });
      S.dialog = null;
      toast("ok", "Night closed",
        SESSION.className + " · " + S.nightDate + " closed by " + SESSION.signedInAs.name +
        " at " + SESSION.clock + ". " + plural(k.owed.length, "note", "notes") +
        " moved to your owed queue. Attendance is untouched.", "undo");
      return;
    }

    if (act === "undo") {
      S.closeLog.push({ kind: "REOPEN", by: SESSION.signedInAs.name, role: SESSION.signedInAs.role,
                        at: SESSION.date + ", " + SESSION.clock });
      S.dialog = null;
      toast("warn", "Night reopened",
        "Reopening is itself a recorded act — both rows now stand in the log. No attendance row " +
        "and no note changed (REQ-SO-08).");
      return;
    }

    if (act === "hygiene") {
      toast("warn", "Another night's close screen",
        "This is the same Scene 2 screen pointed at a different date. Only tonight is built here.");
      return;
    }
  });

  // Deep links: index.html#closed, index.html#amended.dark
  function fromHash() {
    var h = (location.hash || "").replace("#", "").split(".");
    var key = h[0];
    var ok = STATES.some(function (s) { return s.key === key; });
    S.dark = h.indexOf("dark") >= 0;
    seed(ok ? key : "unmarked");
    render();
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
