# Scene 1 — Tonight's roster (clickable prototype)

**Source of truth:** `10-scene-inventory.md` §Scene 1 · REQs from `03`/`04`/`05` · open
decisions from `07` · edge cases from `08` §2/§4. Where this screen and the spec disagree, the
spec wins.

**Open:** `index.html` in any browser (double-click works; no build, no network dependency —
Google Fonts for Geist/Newsreader fall back to system faces offline). Pinned to
**Tue Sep 8 2026, 7:55 PM**, Teacher Dez O., Adult DBT Tue/Thu PM — **Section 2 of 2**.

Everything below the dashed "PROTOTYPE · state switcher" bar is product surface. The bar
itself (and the assumptions footer) is scaffolding.

## Frame → requirement matrix

| Frame (switcher label) | Card line 4 / edge case | Satisfies |
|---|---|---|
| 1 · Unmarked | state 1 | REQ-SO-01, REQ-SO-02, REQ-SO-03 |
| 2 · Partially marked | state 2 | REQ-SO-05, O-08 (unrecorded ≠ missed, beside named clients) |
| 3 · Fully marked | state 3 | REQ-SO-01, REQ-SO-02, REQ-SO-21, REQ-SO-22 (live WARN derivation) |
| 4 · Backfilled | state 4 | REQ-SO-04, O-23 (both timestamps, no cutoff), REQ-SO-05 |
| 5 · Cancelled | state 5 | REQ-SO-17 (no marking controls, banner + one-click recorded undo), REQ-SO-18 (week gap 2, 4, 5) |
| 6 · Guard-blocked | state 6 | REQ-SO-03 (future / off-night / closed membership window — explicit refusals), REQ-SO-06 (sanctioned out-of-roster path) |
| 7 · Free-pass already used | state 7 | REQ-SO-01, O-19 (is the 4th button still wanted?), REQ-SO-21 |
| 8 · Flagged rows | state 8 | REQ-SO-21, REQ-SO-22 (advance warning before the 4th miss), REQ-CL-17 (personal red/yellow), REQ-CL-10 |
| E1 · Wrong identical section | edge 1 (08 §2) | REQ-SO-06 (out-of-roster fact, never a silent refusal) |
| E2 · Concurrent marking | edge 2 (08 §2) | REQ-SO-02 (last-write-wins + "already marked by X", append trail) |
| E3 · Backfill jumps clear → max | edge 3 (08 §2) | REQ-SO-04, REQ-SO-21, REQ-SO-22 (flag history shown, not just end state) |

## Interactions worth trying

- Mark any client in frame 1 — the ladder re-derives live; Jordan P. trips WARN at 2.
- Re-mark a marked client — correction is soft-delete + append; an "append trail" link appears.
- Click any ladder badge — flag-history popover with every miss source-labelled
  (class absence / free-pass / Provider-logged IT miss) and cancelled nights shown skipped.
- Click a planned-absence chip — the O-21 reason-blind rule, posed not answered.
- Frame 6 sub-tabs flip the three guard refusals; Brandy K.'s row refuses per-client while
  every other row stays live, with the out-of-roster alternative.
- Frame 5 undo — one click, itself recorded; returns to the open roster.
- Dead-end links are labelled with their scene number: Scene 2 (close), Scene 3 (notes queue),
  Scene 5 (escalation), Scene 8 (client profile), Scene 11 (cancel), Scene 12 (round-2 talk).

## Assumptions

Also listed inside the prototype footer.

1. **ASSUMPTION** — v1 components re-rendered as static HTML/CSS from v1's exact tokens and
   class geometry (`roster-table.tsx` chips, `attendance-badge.tsx` pill, ui
   `badge/button/card/sheet/popover/dialog`, sonner token mapping); not imported React.
2. **ASSUMPTION** — v1's `--badge-force-drop` re-labelled **max** (v4 spec, 10 §0); values
   unchanged. v1's ✓/1–2–3-dot glyph kept, paired with v4 rung labels + series count.
3. **ASSUMPTION** — v4 cumulative ladder (REQ-CL-10) replaces v1's consecutive-count rule; at
   1 miss the badge is ✓ clear with "1 in series" (no rung below 2).
4. **ASSUMPTION** — MAX rows keep normal row styling (v1's muted/strikethrough treatment is
   reserved for a *decided* force-drop); the alarm rides the badge + advisory, per D-09.
5. **ASSUMPTION** — Sample people/contacts/miss histories are fictional; dates pinned to
   Sep 2026. Light mode only (v1 `defaultTheme="light"`).
6. **ASSUMPTION** — v1 labels "No-show"/"Free no-show" rendered with v4's spoken labels
   Absent / Free-pass (D-10) on the unchanged chip geometry.
