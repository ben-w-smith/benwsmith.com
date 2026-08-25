# Pre-draft notes: "Workslop — The Unitemized Invoice" (ZCode agent)

**Provenance note:** produced by the ZCode agent in parallel with another drafting agent. This
file is suffixed `-zcode` to avoid collisions. It does NOT modify the shared outline
(`workslop-unitemized-invoice-outline.md`) or the dossier (`judgment-pass-dossier.md`). It
contains: (1) fact-verification results for Section 5's historical claims, with corrections, and
(2) drafting notes / raw material. The draft itself is left to whichever agent owns `src/posts/`.

---

## 1. Fact-check results for Section 5 (the cheap-send lineage)

All claims verified via web search, 2026-08-24. Two corrections flagged.

### CORRECTION 1 — the PowerPoint general (important, fix before drafting)

The outline (via the earlier transcript) attributes a joke about "understanding the slide would
win the war" to a generic general. The actual history, from the primary source (Elisabeth
Bumiller, "We Have Met the Enemy and He Is PowerPoint," NYT, April 27, 2010):

- **Gen. Stanley McChrystal**, shown the "spaghetti slide" of US strategy in Afghanistan in
  summer 2009 in Kabul, quipped: **"When we understand that slide, we'll have won the war."**
- **Gen. H.R. McMaster** is the other general in the same article: he called PowerPoint
  "dangerous because it can create the illusion of understanding and the illusion of control,"
  and **he banned PowerPoint outright when leading the counterinsurgency effort in Tal Afar,
  Iraq, in 2005**.

The McMaster detail actually *strengthens* the failure-case argument: a two-star general banned
the format inside his own command and it still produced no institution-wide norm — fifteen years
later the Pentagon was still drowning in slides. Local enforcement by the suffering beneficiary
didn't spread; Amazon's CEO-level ban (with concentrated authority) did. Use McChrystal for the
joke, McMaster for the ban-that-didn't-spread.

Primary source: https://www.nytimes.com/2010/04/27/world/27powerpoint.html

### VERIFIED — Amazon's six-page memo

- Bezos banned PowerPoint from executive meetings in **2004**; replaced with six-page narrative
  memos, read silently together ("study hall") at the start of the meeting.
- Load-bearing quote for the density argument: smart people can't fake it in a full narrative the
  way they can with slides; a great memo might take a week to write.
- Sources: [CNBC 2018](https://www.cnbc.com/2018/04/23/what-jeff-bezos-learned-from-requiring-6-page-memos-at-amazon.html),
  [Inc./Carmine Gallo](https://www.inc.com/carmine-gallo/jeff-bezos-bans-powerpoint-in-meetings-his-replacement-is-brilliant.html)

### VERIFIED — "Sent from my iPhone"

- Default signature on every iPhone since the original **2007** launch.
- Functions as a disclaimer (excusing brevity/typos/formatting from a small touchscreen keyboard)
  *and* as calibration for the reader: short, quick, low-polish reply — don't expect attachments
  or careful formatting. In the early years it doubled as a status symbol.
- The "parser-setting" framing in the outline holds. Common user extension "please excuse any
  typos" is a user addition, not Apple's text — worth noting if quoted.
- Sources: [gobraithwaite.com analysis](https://gobraithwaite.com/thinking/the-marketing-genius-behind-apples-sent-from-my-iphone/),
  [newoldstamp history](https://newoldstamp.com/blog/sent-from-my-iphone-email-signature/)

### VERIFIED — TL;DR (with a bonus finding worth a sentence in Section 6)

- Emerged in early-2000s web forums (documented ~2002; first Urban Dictionary entry Jan 15, 2003).
- **Originally a reader-side dismissal** — replying "TL;DR" to mock a wall of text.
- **The flip is the gold**: over the late 2000s (Reddit era) it migrated from reader retort to
  *sender-side* convention — authors adding their own "TL;DR:" summary line to long posts. This
  is a documented instance of a norm being adopted by senders, voluntarily, because it made their
  long posts readable rather than mocked — direct support for the closing thesis that
  sender-competence-signaling norms are the ones that win. Consider using this flip as the
  capstone example in Section 6.
- Sources: [Know Your Meme](https://knowyourmeme.com/memes/tldr-tldr), [Wikipedia](https://en.wikipedia.org/wiki/TL;DR)

### Lightly verified (safe at pattern level, no single source needed)

- Voicemail → text rerouting; "this should be a doc, not a meeting": common-knowledge norm shifts,
  no primary study exists. Outline already treats these at pattern level — keep it that way.
- Usenet netiquette ("lurk before you post," "read the FAQ first") and Stack Overflow's
  "what have you tried?" / duplicate closure: well-established, safe to cite generically.

## 2. Drafting notes / raw material (not yet prose)

### Cold open variant (for the drafting agent to consider)

The invoice metaphor has a natural first move: everyone talks about the workslop tax like they've
seen the bill. Ask a room of engineers what it costs and you'll get vibes, not numbers — everyone
means something slightly different. This post itemizes one engineer's version of the bill.

### Section 3 — extra connective tissue

- The five line items share a mechanism worth one linking sentence: the first two are *reading*
  costs (before you work), the last three are *repair* costs (after the work exists). The hop
  question ("at which hop does a wrong guess stop being cheap to retract?") lives at the boundary
  between them.
- The QA/PM nuance can be stated as: the org bought verification for honest fuzz; the new inputs
  fail with confident precision in the seams. QA verifies the feature against the ticket; nobody
  was ever assigned to verify the ticket against reality. That's the unstaffed line item.

### Section 5 — taxonomy table (if the post wants one)

| Category | Function | Historical case | AI counterpart |
|---|---|---|---|
| Compression | Sender pays to condense | TL;DR; Amazon six-pager | Summarize-before-forward |
| Medium-restitution | Reroute to cheapest medium for the reader | Voicemail → text | Three sentences in-channel, transcript behind a link |
| Provenance | Mark production so the reader can calibrate | "Sent from my iPhone" | Verified-vs-assumed marking |
| Sender-verifies-first | Do the reading before you produce | Usenet FAQ/lurk; SO "what have you tried?" | Confirm premises before the ticket ships |

### Section 6 — closing beats (from the approved outline)

1. The winning norm will be sender-competence-signaling — and that will feel frustrating to ICs
   already paying the tax. Say it plainly, from lived experience.
2. Personal belief, framed as belief: execute well on sender-side competence and it will be
   rewarded in this era of AI development.
3. Optional capstone: the TL;DR flip (reader dismissal → sender convention) as the precedent that
   makes beat 2 credible.

## 3. Outstanding verification items (hard gate, pre-publish)

- [ ] NYT Bumiller article: confirm quotes verbatim against the article before quoting directly
      (search results paraphrase; paywall may require archive access).
- [ ] Any industry stats pulled into the final draft (CircleCI, Faros, GitClear, Danish registry,
      METR) must be re-verified at their primary sources per the dossier's citation gate — none
      are currently load-bearing in this outline, and the post is stronger if it stays that way.
