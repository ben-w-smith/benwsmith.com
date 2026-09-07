/* app.js — Scene 3, Write session notes.
   Vanilla render + delegated events, no build step, no network.

   The three things this file is careful about:
   1. The unwritten-notes queue is NEVER stored. `deriveQueue()` recomputes
      "attended tonight, no live note by this author" on every render from
      live attendance marks and the live note list.
   2. Editing never mutates a note in place. `save-note` on an edit either
      voids the original row (`voided: true`) and appends a new one, or
      appends a brand-new row. Nothing is ever spliced out.
   3. A note's session binding is a fixed field, never a control — there is
      no affordance anywhere that detaches one, matching REQ-SO-15. */
(function () {
  "use strict";

  // ------------------------------------------------------------- states ---

  var STATES = [
    { key: "empty", label: "1 · Queue empty",
      reqs: ["REQ-SO-13"], opens: [], edges: [],
      blurb: "Devon has written a note for everyone who attended tonight. Closing the queue owes nobody a callback — empty is a real and good state (REQ-SO-13)." },

    { key: "populated", label: "2 · Populated",
      reqs: ["REQ-SO-13", "REQ-SO-12"], opens: ["O-11"],
      edges: ["A note written on an absent client — the primary absence-communication path (04 §2.3)"],
      blurb: "Two clients attended with no note yet from Devon — named, not just counted. Priya's absence note is already on the board below: notes on someone who wasn't in the room are a primary use, not an edge case (04 §2.3)." },

    { key: "draft", label: "3 · Composer draft",
      reqs: ["REQ-SO-12", "REQ-SO-13"], opens: [], edges: [],
      blurb: "Andre Whitfield's owed note, mid-sentence. The composer pre-binds client, session and date, and shows this client-night's existing notes above the draft — there are none yet for Andre." },

    { key: "saved", label: "4 · Saved",
      reqs: ["REQ-SO-13", "REQ-SO-12"], opens: [], edges: [],
      blurb: "Andre's note just saved; the queue drops from two names to one. Saving never rewrites anything else on the client-night — Priya's and Tomás's notes are untouched." },

    { key: "edited", label: "5 · Edited",
      reqs: ["REQ-SO-14"], opens: [],
      edges: ["An edited note showing the append trail, not replaced text (DOM A-10, REQ-SO-14)"],
      blurb: "Maria's Tuesday-night note read harsher than Devon intended. The next morning he corrects it: both rows stand, the original struck through, the correction appended with a reason on record." },

    { key: "notmine", label: "6 · Not mine",
      reqs: ["REQ-SO-16"], opens: ["O-10"], edges: [],
      blurb: "Brynn's provider, Nathan Oakes, wrote a note the next morning. Devon can read it under flat clinical access, but has no edit control on it — author-only, plus Owner/Admin (REQ-SO-16, O-10)." },

    { key: "multi", label: "7 · Multiple notes, one client-night",
      reqs: ["REQ-SO-12"], opens: [], edges: [],
      blurb: "Two authors, one client-night: Devon's class note and Nathan's clinical follow-up sit side by side on Brynn. Nothing here caps how many notes a client-night carries (gate Q9)." },

    { key: "orphan", label: "8 · Orphan-attempt",
      reqs: ["REQ-SO-15"], opens: [],
      edges: ["A note surviving a schedule edit untouched — v1's detachment hazard (REQ-SO-15, sc 48-51)"],
      blurb: "The Owner is reordering next week's rotation in the class editor (Scene 10, not built here). Tuesday's session carries attendance and four notes, so it is immutable to that regeneration — try it and the refusal names exactly what will not move." }
  ];

  // -------------------------------------------------------------- state ---

  var S = {
    state: "empty",
    dark: false,
    tab: "owed",
    notes: {},
    standalone: [],
    when: "",
    composer: null,
    dialog: null,
    toasts: []
  };
  var seq = 100;

  function client(id) {
    for (var i = 0; i < CLIENTS.length; i++) if (CLIENTS[i].id === id) return CLIENTS[i];
    return null;
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function clone(n) { var o = {}; for (var k in n) if (n.hasOwnProperty(k)) o[k] = n[k]; return o; }

  function cloneNotes(base) {
    var out = {};
    for (var cid in base) if (base.hasOwnProperty(cid)) out[cid] = base[cid].map(clone);
    return out;
  }
  function addNote(map, cid, n) {
    if (!map[cid]) map[cid] = [];
    map[cid].push(n);
  }
  function note(author, role, mine, category, body, at) {
    return { id: "n" + (++seq), author: author, role: role, mine: mine, category: category, body: body, at: at };
  }
  function findNote(cid, nid) {
    var list = S.notes[cid] || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === nid) return list[i];
    return null;
  }
  function roleClass(role) {
    if (role === "Provider") return "role-provider";
    if (role === "Owner") return "role-owner";
    if (role === "Admin") return "role-admin";
    return "role-teacher";
  }

  // --------------------------------------------------------- derivation ---
  // Recomputed on every render. Nothing here is a stored status field.

  function deriveQueue() {
    var attended = [], owed = [];
    CLIENTS.forEach(function (c) {
      if (!ATTENDED[MARKS[c.id]]) return;
      attended.push(c);
      var list = S.notes[c.id] || [];
      var hasMineLive = list.some(function (n) { return n.mine && !n.voided; });
      if (!hasMineLive) owed.push(c);
    });
    return { attended: attended, owed: owed };
  }

  function totalNoteCount() {
    var n = 0;
    for (var cid in S.notes) if (S.notes.hasOwnProperty(cid)) n += S.notes[cid].length;
    return n;
  }

  // ---------------------------------------------------------- state seed ---

  function seed(key) {
    S.tab = "owed";
    S.composer = null;
    S.dialog = null;
    S.toasts = [];
    S.notes = cloneNotes(NOTES_BASE);
    S.standalone = STANDALONE.map(clone);
    S.when = "8:10 PM, still in the room — class just dismissed";

    if (key === "empty") {
      addNote(S.notes, "c2", note("Devon Marsh", "Teacher", true, "General",
        "Present the whole class, tracked well with the diary-card discussion.", "Tue 8 Sep 2026, 8:08 PM"));
      addNote(S.notes, "c4", note("Devon Marsh", "Teacher", true, "General",
        "Asked a clarifying question about the TIP skill; good engagement.", "Tue 8 Sep 2026, 8:10 PM"));
    }
    if (key === "draft") {
      S.composer = { clientId: "c2", standalone: false, editingId: null,
        draft: "Present the whole class, engaged with the ", category: "General", pin: false };
    }
    if (key === "saved") {
      addNote(S.notes, "c2", note("Devon Marsh", "Teacher", true, "General",
        "Present the whole class, engaged with the diary-card review.", "Tue 8 Sep 2026, 8:12 PM"));
      S.toasts.push(mkToast("ok", "Note saved",
        "Andre Whitfield's session note is saved and the queue item cleared. One note still owed: Josh Kimball."));
    }
    if (key === "edited") {
      S.when = "Wed 9 Sep 2026, 7:52 AM — the next morning";
      S.notes.c1 = OVERLAYS.edited.c1.map(clone);
      S.composer = { clientId: "c1", standalone: false, editingId: null, draft: "", category: "Skill practice", pin: false };
    }
    if (key === "notmine") {
      S.when = "Wed 9 Sep 2026, 8:12 AM — the next morning";
      S.notes.c7 = OVERLAYS.notmine.c7.map(clone);
      S.composer = { clientId: "c7", standalone: false, editingId: null, draft: "", category: "General", pin: false };
    }
    if (key === "multi") {
      S.when = "Wed 9 Sep 2026, 8:12 AM — the next morning";
      S.notes.c7 = OVERLAYS.multi.c7.map(clone);
      S.tab = "all";
    }
    if (key === "orphan") {
      S.when = "Wed 9 Sep 2026, 9:00 AM — the Owner is reordering next week's rotation";
    }
    S.state = key;
  }

  // ------------------------------------------------------------- toasts ---

  function mkToast(kind, title, body, undoAct) {
    return { id: ++seq, kind: kind, title: title, body: body, undo: undoAct || null };
  }
  function toast(kind, title, body, undoAct) {
    S.toasts.push(mkToast(kind, title, body, undoAct));
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
          '<span class="chrome-title">Scene 3 — Write session notes</span>' +
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

  function headerHTML() {
    var mod = SESSION.module;
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="identity">' +
          '<div class="identity-main">' +
            "<h1>" + esc(SESSION.className) + " — " + esc(SESSION.section) + "</h1>" +
            '<div class="when"><strong>' + esc(SESSION.date) + "</strong> · " + esc(S.when) + "</div>" +
            '<div class="rowflex" style="margin-top:10px">' +
              '<span class="badge mod-' + mod.code + '">' + esc(mod.name) +
                " · week " + mod.week + " of " + mod.of + "</span>" +
              '<span class="badge badge-outline">Round ' + SESSION.round + "</span>" +
              '<span class="badge badge-muted">' + esc(SESSION.sectionId) + "</span>" +
            "</div>" +
          "</div>" +
          '<div class="meta-col">' +
            '<div class="teachers">Standing Teachers: ' + esc(SESSION.teachers.join(" · ")) + "</div>" +
            '<div class="teachers">Notes are almost a first-class thing for providers — np 5-7</div>' +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  // ------------------------------------------------------------- thread ---

  function chains(list) {
    var map = {}, order = [];
    (list || []).forEach(function (n) {
      var key = n.editOf || n.id;
      if (!map[key]) { map[key] = []; order.push(key); }
      map[key].push(n);
    });
    return order.map(function (k) { return map[k]; });
  }

  function amendHTML(chain) {
    var rows = chain.map(function (n, i) {
      var last = i === chain.length - 1;
      return '<div class="arow ' + (last ? "live" : "voided") + '">' +
        '<span class="lab">' + (last ? "live" : "voided") + "</span>" +
        "<span>" + (last ? esc(n.body) : "<s>" + esc(n.body) + "</s>") + "</span>" +
        '<span class="small muted">' + esc(n.author) + " · " + esc(n.at) + "</span>" +
      "</div>";
    }).join("");
    var last = chain[chain.length - 1];
    return '<div class="amend">' + rows + "</div>" +
      (last.reason ? '<div class="small muted mt10"><strong>Reason recorded:</strong> ' + esc(last.reason) + "</div>" : "") +
      '<div class="small muted mt10">Edited note: soft-delete + append, never in place. Both rows stand ' +
        "here; nothing is overwritten (REQ-SO-14).</div>";
  }

  function noteItemHTML(cid, n) {
    var badgeRole = '<span class="badge ' + roleClass(n.role) + '">' + esc(n.role) + "</span>";
    var badgeCat = '<span class="badge badge-outline">' + esc(n.category) + "</span>";
    var editCtl = n.mine
      ? '<button class="btn btn-ghost btn-xs" data-act="edit-note" data-cid="' + cid + '" data-nid="' + n.id + '">edit</button>'
      : '<button class="btn btn-ghost btn-xs refusing" data-act="edit-refuse" data-author="' + esc(n.author) +
        '">edit — not yours</button>';
    return '' +
      '<div class="noteitem ' + (n.mine ? "mine" : "notmine") + '">' +
        '<div class="nhead">' +
          '<span class="nauthor">' + esc(n.author) + "</span>" + badgeRole + badgeCat +
          '<span class="nwhen">' + esc(n.at) + "</span>" +
        "</div>" +
        '<div class="nbody">' + esc(n.body) + "</div>" +
        '<div class="nfoot">' + editCtl +
          (n.mine ? "" : '<span class="small muted">Read under flat clinical access — not editable here ' +
            "(author-only, plus Owner/Admin — REQ-SO-16, O-10).</span>") +
        "</div>" +
      "</div>";
  }

  function threadHTML(cid) {
    return chains(S.notes[cid]).map(function (chain) {
      return chain.length > 1 ? amendHTML(chain) : noteItemHTML(cid, chain[0]);
    }).join("");
  }

  // --------------------------------------------------------------- tabs ---

  function tabsHTML(q) {
    var pinnedCount = S.standalone.length;
    function tab(id, label, count) {
      return '<button data-act="tab" data-id="' + id + '" aria-selected="' + (S.tab === id) + '">' +
        esc(label) + (count != null ? ' <span class="tcount">' + count + "</span>" : "") + "</button>";
    }
    return '<div class="tabbar" role="tablist">' +
      tab("owed", "Owed", q.owed.length) +
      tab("all", "All", totalNoteCount()) +
      tab("pinned", "Pinned", pinnedCount) +
    "</div>";
  }

  // -------------------------------------------------------- owed tab ---

  function secondaryActionsHTML() {
    return '' +
      '<div class="rowflex mt14">' +
        '<button class="btn btn-outline btn-sm" data-act="absent-open">+ Note on an absent client</button>' +
        '<button class="btn btn-outline btn-sm" data-act="standalone-open">+ Standalone client note</button>' +
      "</div>" +
      '<div class="small muted mt10">Editing an existing note lives on the All tab, next to the note itself ' +
        "— author-only, plus Owner/Admin (REQ-SO-14).</div>";
  }

  function owedTabHTML(q) {
    if (!q.owed.length) {
      return '' +
        '<div class="collapsible tone-muted"><button class="ctrigger" data-act="noop">' +
          '<span class="chev">✓</span><span class="ctext">Every client who attended tonight has a note ' +
          "from " + esc(SESSION.signedInAs.name) + ". Nothing is owed.</span></button></div>" +
        secondaryActionsHTML();
    }
    var rows = q.owed.map(function (c) {
      return '' +
        '<div class="queuerow">' +
          '<div class="who"><span class="name">' + esc(c.name) + "</span> " +
            '<span class="small muted">' + esc(c.provider) + "</span></div>" +
          '<span class="badge badge-muted">' + esc(CODE_NAME[MARKS[c.id]]) + "</span>" +
          '<button class="btn btn-secondary btn-sm" data-act="queue-open" data-id="' + c.id + '">' +
            "Write the owed note</button>" +
        "</div>";
    }).join("");
    return '' +
      '<div class="small muted">' + plural(q.owed.length, "client attended", "clients attended") +
        " tonight with no note yet from " + esc(SESSION.signedInAs.name) +
        " — named, not just counted (REQ-SO-13).</div>" +
      '<div class="stack mt10">' + rows + "</div>" +
      secondaryActionsHTML();
  }

  // ---------------------------------------------------------- all tab ---

  function allTabHTML() {
    return CLIENTS.map(function (c) {
      var list = S.notes[c.id] || [];
      var code = MARKS[c.id];
      var absentNote = code === "A" && list.length;
      return '' +
        '<div class="subcard">' +
          '<div class="rowflex" style="justify-content:space-between">' +
            '<div class="nameline"><strong>' + esc(c.name) + "</strong>" +
              '<span class="badge badge-muted">' + esc(CODE_NAME[code]) + "</span>" +
              (absentNote ? '<span class="badge" style="background:var(--info-banner);color:var(--info-banner-fg)">' +
                "note on an absent client</span>" : "") +
            "</div>" +
            '<button class="notebtn' + (list.length ? " has-note" : "") + '" data-act="queue-open" data-id="' +
              c.id + '">' + (list.length ? "+ add another note" : "+ write a note") + "</button>" +
          "</div>" +
          (list.length
            ? '<div class="thread mt10">' + threadHTML(c.id) + "</div>"
            : '<div class="small muted mt10">No notes yet tonight.</div>') +
        "</div>";
    }).join("");
  }

  // ------------------------------------------------------- pinned tab ---

  function pinnedTabHTML() {
    if (!S.standalone.length) {
      return '<div class="small muted">No standalone notes yet. A standalone client note is not tied to ' +
        "any session — a running record, pinnable (REQ-SO-12).</div>";
    }
    return S.standalone.map(function (n) {
      var c = client(n.clientId);
      return '' +
        '<div class="pincard">' +
          '<div class="rowflex" style="justify-content:space-between">' +
            '<div class="nameline"><strong>' + esc(c ? c.name : n.clientId) + "</strong>" +
              '<span class="badge ' + roleClass(n.role) + '">' + esc(n.author) + " · " + esc(n.role) + "</span>" +
              '<span class="badge badge-outline">' + esc(n.category) + "</span>" +
              (n.pinned ? '<span class="badge" style="background:var(--info-accent);color:var(--info-accent-fg)">pinned</span>' : "") +
            "</div>" +
            '<span class="small muted">' + esc(n.at) + "</span>" +
          "</div>" +
          '<div class="nbody mt10">' + esc(n.body) + "</div>" +
          '<div class="small muted mt10">Standalone client note — unlinked to any session (REQ-SO-12, O-11).</div>' +
        "</div>";
    }).join("");
  }

  // -------------------------------------------------------- composer ---

  function composerHTML() {
    if (!S.composer) return "";
    var cm = S.composer;
    var c = client(cm.clientId);
    var editing = cm.editingId ? findNote(cm.clientId, cm.editingId) : null;

    var lockLine = cm.standalone
      ? '<div class="small muted">Not tied to any session — a running record on the client (REQ-SO-12).</div>'
      : '<div class="small muted">Locked to <strong>' + esc(SESSION.className) + " — " + esc(SESSION.section) +
        ", " + esc(SESSION.date) + "</strong>. Notes never detach from their session (REQ-SO-15).</div>";

    var clientPicker = cm.standalone
      ? '<div class="field"><label>Client</label><select class="sel" data-act="standalone-client">' +
          CLIENTS.map(function (x) {
            return '<option value="' + x.id + '"' + (x.id === cm.clientId ? " selected" : "") + ">" +
              esc(x.name) + "</option>";
          }).join("") +
        "</select></div>"
      : "";

    var thread = (!cm.standalone && !editing)
      ? '<div class="sectionlabel mt14">Existing notes on this client-night — all authors (REQ-SO-12, O-10)</div>' +
        ((S.notes[cm.clientId] || []).length ? '<div class="thread">' + threadHTML(cm.clientId) + "</div>"
          : '<div class="small muted">None yet.</div>')
      : "";

    var reasonField = editing
      ? '<div class="field mt10"><label>Reason for the amendment</label>' +
        '<textarea class="ta" rows="2" data-field="reason" placeholder="Why this correction?"></textarea></div>'
      : "";

    var pinField = cm.standalone
      ? '<div class="switchrow mt10"><button class="swtch" role="switch" aria-checked="' + cm.pin +
        '" data-act="pin-toggle"></button><span>Pin to the client record</span></div>'
      : "";

    return '' +
      '<div class="scrim" data-act="composer-close"></div>' +
      '<div class="sheet" role="dialog" aria-modal="true">' +
        "<header><h2>" + (editing ? "Correct " : cm.standalone ? "Standalone note — " : "Note — ") +
          esc(c ? c.name : "") + "</h2>" + lockLine + "</header>" +
        '<div class="sheetbody">' +
          clientPicker + thread +
          '<div class="sectionlabel mt14">' + (editing ? "Corrected text" : "New note") + "</div>" +
          '<div class="field"><label>Category</label><select class="sel" data-act="category">' +
            CATEGORIES.map(function (cat) {
              return "<option" + (cat === cm.category ? " selected" : "") + ">" + cat + "</option>";
            }).join("") +
          "</select></div>" +
          '<div class="field mt10"><label>Note</label><textarea class="ta" rows="5" data-field="draft" ' +
            'placeholder="What happened, what to tell the provider...">' + esc(cm.draft) + "</textarea></div>" +
          reasonField + pinField +
          (editing ? '<div class="small muted mt10">Saving appends a new row; the row above stays, struck ' +
            "through. Nothing is overwritten (REQ-SO-14).</div>" : "") +
        "</div>" +
        "<footer>" +
          '<button class="btn btn-ghost" data-act="composer-close">Cancel</button>' +
          '<button class="btn btn-default" data-act="save-note">' + (editing ? "Save correction" : "Save note") +
            "</button>" +
        "</footer>" +
      "</div>";
  }

  // ---------------------------------------------------------- handoffs ---

  function handoffsHTML() {
    var card = function (n, title, body) {
      return '<button class="handoff" data-act="scene" data-n="' + n + '"><span class="hscene">Scene ' +
        n + "</span><strong>" + esc(title) + "</strong><br>" + esc(body) + "</button>";
    };
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Goes next</div>' +
        '<div class="handoffs">' +
          card(2, "Close the night", "This queue is snapshotted from Scene 2's close — the way back in.") +
          card(4, "Provider's morning after", "These notes are what a Provider reads about their own caseload next.") +
          card(8, "Client profile", "Every note here also renders on the person's record.") +
        "</div>" +
      "</div></section>";
  }

  // ------------------------------------------------------------ dialogs ---

  var SCENE_NAMES = {
    1: "Tonight's roster — where attendance is marked",
    2: "Close the night — the ritual this queue is snapshotted from",
    4: "Provider's morning after — where these notes surface next",
    8: "Client profile — every note also renders here",
    10: "Class & run editor — where the rotation clock and calendar regeneration live"
  };

  function dialogHTML() {
    if (!S.dialog) return "";
    var d = S.dialog, inner;

    if (d.kind === "absent") {
      var absentees = CLIENTS.filter(function (c) { return MARKS[c.id] === "A"; });
      inner = '' +
        "<h2>Write a note on an absent client</h2>" +
        "<p>Absence communication is a primary use of session notes, not a special case (04 §2.3).</p>" +
        '<div class="stack">' + absentees.map(function (c) {
          return '<button class="handoff" data-act="queue-open" data-id="' + c.id + '">' +
            "<strong>" + esc(c.name) + "</strong><br><span class=\"small muted\">" + esc(c.provider) +
            " · Absent tonight</span></button>";
        }).join("") + "</div>" +
        '<div class="dlgactions"><button class="btn btn-ghost" data-act="dlg-cancel">Cancel</button></div>';
    }

    if (d.kind === "req" || d.kind === "open") {
      var txt = d.kind === "req" ? REQ_TEXT[d.id] : OPENS[d.id];
      inner = "<h2>" + esc(d.id) + "</h2><p>" + esc(txt || "(not cited by this scene)") + "</p>" +
        '<div class="dlgactions"><button class="btn btn-outline" data-act="dlg-cancel">Close</button></div>';
    }

    if (d.kind === "scene") {
      inner = '' +
        "<h2>Scene " + esc(d.n) + " — not built here</h2>" +
        "<p>" + esc(SCENE_NAMES[d.n] || "Adjacent scene") + ". This prototype is Scene 3 only; " +
          "this is a labelled dead end, not a broken link.</p>" +
        '<div class="dlgactions"><button class="btn btn-outline" data-act="dlg-cancel">Back to Scene 3</button></div>';
    }

    return '<div class="scrim" data-act="dlg-cancel"></div><div class="dialog" role="dialog" ' +
      'aria-modal="true">' + inner + "</div>";
  }

  // ------------------------------------------------------------- toasts ---

  function toastsHTML() {
    if (!S.toasts.length) return "";
    return '<div class="toasts">' + S.toasts.map(function (t) {
      return '<div class="toast t-' + t.kind + '"><div class="bar"></div><div>' +
        "<strong>" + esc(t.title) + "</strong><br>" + esc(t.body) + "</div>" +
        '<button class="btn btn-ghost btn-xs" data-act="toast-dismiss" data-toast="' + t.id + '">dismiss</button>' +
      "</div>";
    }).join("") + "</div>";
  }

  // -------------------------------------------------------- orphan card ---

  function orphanHTML() {
    if (S.state !== "orphan") return "";
    return '' +
      '<section class="card"><div class="card-head">' +
        '<div class="sectionlabel">Attempted: reorder next week\'s rotation (Scene 10, not built here)</div>' +
        '<div class="refusecard">' +
          "<h3>Tue 8 Sep 2026 will not move or detach</h3>" +
          "<div class=\"small\">This session carries attendance for all eight clients and " +
            totalNoteCount() + " notes. Sessions like this are immutable to any calendar regeneration " +
            "(v1's SetNull detachment hazard, sc:48-51, is a never-again rule). The rotation reorder in " +
            "Scene 10 will re-project future sessions only; nothing about this one changes.</div>" +
          '<div class="rowflex mt10">' +
            '<button class="btn btn-outline btn-sm refusing" data-act="try-orphan">Try it anyway</button>' +
            '<button class="btn btn-outline btn-sm deadend" data-act="scene" data-n="10">' +
              "Where the reorder happens → Scene 10</button>" +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  // ------------------------------------------------------------- render ---

  function render() {
    var q = deriveQueue();
    document.documentElement.classList.toggle("dark", S.dark);
    document.body.className = S.dark ? "dark" : "";

    var tabBody = S.tab === "owed" ? owedTabHTML(q)
                : S.tab === "all"  ? allTabHTML()
                : pinnedTabHTML();

    document.getElementById("app").innerHTML =
      chromeHTML() +
      "<main>" +
        headerHTML() +
        '<section class="card"><div class="card-head">' +
          '<div class="sectionlabel">The unwritten-notes queue — see first, above the fold</div>' +
          tabsHTML(q) +
          tabBody +
        "</div></section>" +
        orphanHTML() +
        handoffsHTML() +
      "</main>" +
      composerHTML() +
      dialogHTML() +
      toastsHTML();
  }

  // ------------------------------------------------------------- events ---

  document.addEventListener("change", function (ev) {
    var sel = ev.target.closest ? ev.target.closest('[data-act="standalone-client"]') : null;
    if (sel && S.composer) { S.composer.clientId = sel.value; render(); return; }
  });

  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("[data-act]");
    if (!el) return;
    var act = el.getAttribute("data-act");

    if (act === "state")   { seed(el.getAttribute("data-key")); location.hash = S.state; render(); return; }
    if (act === "dark")    { S.dark = !S.dark; render(); return; }
    if (act === "tab")     { S.tab = el.getAttribute("data-id"); render(); return; }
    if (act === "noop")    { return; }
    if (act === "req")     { S.dialog = { kind: "req",  id: el.getAttribute("data-id") }; render(); return; }
    if (act === "open")    { S.dialog = { kind: "open", id: el.getAttribute("data-id") }; render(); return; }
    if (act === "scene")   { S.dialog = { kind: "scene", n: el.getAttribute("data-n") }; render(); return; }
    if (act === "absent-open") { S.dialog = { kind: "absent" }; render(); return; }
    if (act === "dlg-cancel")  { S.dialog = null; render(); return; }
    if (act === "toast-dismiss") { dropToast(+el.getAttribute("data-toast")); return; }

    if (act === "queue-open") {
      S.dialog = null;
      S.composer = { clientId: el.getAttribute("data-id"), standalone: false, editingId: null,
        draft: "", category: "General", pin: false };
      render(); return;
    }
    if (act === "standalone-open") {
      S.composer = { clientId: CLIENTS[0].id, standalone: true, editingId: null,
        draft: "", category: "Administrative", pin: true };
      render(); return;
    }
    if (act === "edit-note") {
      var n = findNote(el.getAttribute("data-cid"), el.getAttribute("data-nid"));
      S.composer = { clientId: el.getAttribute("data-cid"), standalone: false,
        editingId: el.getAttribute("data-nid"), draft: n ? n.body : "", category: n ? n.category : "General",
        pin: false };
      render(); return;
    }
    if (act === "edit-refuse") {
      toast("error", "Refused — not your note",
        "Only " + el.getAttribute("data-author") + " (the note's author) or an Owner/Admin can edit this " +
        "note. Nothing here reassigns authorship or edits it on your behalf (REQ-SO-14, REQ-SO-16).");
      return;
    }
    if (act === "composer-close") { S.composer = null; render(); return; }
    if (act === "pin-toggle") { if (S.composer) S.composer.pin = !S.composer.pin; render(); return; }

    if (act === "save-note") {
      var cm = S.composer;
      if (!cm) return;
      var ta = document.querySelector('[data-field="draft"]');
      var body = ta ? ta.value.trim() : "";
      if (!body) {
        toast("error", "Nothing to save", "Write something first — an empty note has nothing to communicate.");
        return;
      }
      var categorySel = document.querySelector('[data-act="category"]');
      var category = categorySel ? categorySel.value : "General";
      var now = SESSION.date + " (just now)";
      var c = client(cm.clientId);

      if (cm.editingId) {
        var reasonTa = document.querySelector('[data-field="reason"]');
        var reason = reasonTa && reasonTa.value.trim() ? reasonTa.value.trim() : "(no reason given)";
        var orig = findNote(cm.clientId, cm.editingId);
        if (orig) orig.voided = true;
        S.notes[cm.clientId].push({ id: "n" + (++seq), author: SESSION.signedInAs.name,
          role: SESSION.signedInAs.role, mine: true, category: category, editOf: cm.editingId,
          body: body, reason: reason, at: now });
        toast("warn", "Correction recorded",
          "The earlier row stays, struck through. This is a soft-delete plus an append, never an in-place " +
          "edit (REQ-SO-14).");
      } else if (cm.standalone) {
        S.standalone.push({ id: "s" + (++seq), clientId: cm.clientId, author: SESSION.signedInAs.name,
          role: SESSION.signedInAs.role, mine: true, category: category, pinned: cm.pin, body: body, at: now });
        toast("ok", "Standalone note saved",
          (cm.pin ? "Pinned to " : "Saved to ") + (c ? c.name : "the client") +
          "'s record. Not tied to tonight's session (REQ-SO-12).");
      } else {
        S.notes[cm.clientId] = S.notes[cm.clientId] || [];
        S.notes[cm.clientId].push({ id: "n" + (++seq), author: SESSION.signedInAs.name,
          role: SESSION.signedInAs.role, mine: true, category: category, body: body, at: now });
        var wasOwed = ATTENDED[MARKS[cm.clientId]];
        toast("ok", "Note saved", (c ? c.name : "The client") +
          (wasOwed ? "'s session note is saved and the queue item cleared."
                   : "'s note is saved. Absence communication, not owed, but always welcome (04 §2.3)."));
      }
      S.composer = null;
      render();
      return;
    }

    if (act === "try-orphan") {
      toast("error", "Refused — session immutable",
        "Tue 8 Sep 2026 (Adult PM — Tuesday) carries attendance and " + totalNoteCount() + " notes. " +
        "Reordering next week's rotation in Scene 10 will re-project future sessions only — this session " +
        "will not move, and its notes will not detach or reattach elsewhere (REQ-SO-15).");
      return;
    }
  });

  // Deep links: index.html#populated, index.html#edited.dark
  function fromHash() {
    var h = (location.hash || "").replace("#", "").split(".");
    var key = h[0];
    var ok = STATES.some(function (s) { return s.key === key; });
    S.dark = h.indexOf("dark") >= 0;
    seed(ok ? key : "empty");
    render();
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
