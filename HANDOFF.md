# Handoff: "The Wall and the Building" draft

**Working notes for the next agent. Delete this file before merging to main.**

Last updated: 2026-07-17, after the merge draft was written and pushed.

## State of play

- The merged essay is `src/posts/the-wall-and-the-building.md` on branch `draft/inference-wall`.
- It **supersedes** `src/posts/inference-wall-v2.md` (same branch): the April plateau thesis was falsified by Opus 4.7 (87.6% SWE-bench Verified, Apr 16), GPT-5.5 (88.7%, Apr 23), and Fable 5 (95.0%, Jun 9). The new essay opens by owning that miss.
- It **absorbs** `origin/draft/the-cost-of-admission`: the economics half is compressed into the "The Building" and "Admission" sections.
- `draft/bright-enough` is a separate live draft owned by another agent (Jevons paradox, price of intelligence). Do not edit it from this branch. Note the deliberate agreement: "efficiency is capability with a lag" (this essay) is the Jevons point from Bright Enough. Keep the two consistent if both ship.
- The main checkout had an uncommitted `package-lock.json` change belonging to the bright-enough agent. Leave it alone.

## Open decisions for Ben

1. Title: "The Wall and the Building" (alternatives floated: "The Price of Routing", "Admission").
2. Delete `src/posts/inference-wall-v2.md` once Ben confirms the supersede.
3. Retire the `draft/the-cost-of-admission` branch after that confirmation.
4. The essay has no figure. v2 used `public/images/swe-bench-verified-trend.svg`, which now shows the falsified plateau. Either cut it, or regenerate showing the break (87.6 / 88.7 / 95.0).
5. Frontmatter date is 2026-07-17. Bump it if publishing later.

## Fact base (verified vs caveated; don't re-research unless rechecking)

Verified with primary sources:
- Anthropic post-mortem (Apr 23, 2026): reasoning-effort downgrade, caching bug, 25-word inter-tool cap, ~3% drop on ONE coding eval. anthropic.com/engineering/april-23-postmortem
- LangChain harness experiment: 52.8% to 66.5% on Terminal Bench 2.0, model pinned (gpt-5.2-codex). langchain.com/blog
- Vercel: 18 tools to 2, 80% to 100% success, but a FIVE-query eval. vercel.com/blog
- CPU-orchestration latency: 50 to 90% of e2e latency; 88% is the Toolformer upper bound, not typical. arXiv:2511.00739
- SWE-bench Verified trajectory: plateau Nov 2025 to Mar 2026 (~80%, top six within 1.3 pts, partly a cheap-scaffold artifact), broken Apr 16/23. Fable 95.0% vendor-reported + one independent reproduction (vals.ai).
- Fable 5: ~2x Opus size (Latent Space, per Mythos announcement), $10/$50 per Mtok, suspended Jun 12 to Jul 1 by Commerce export-control directive, then restored (CIO).
- GPT-5.6 Sol/Terra/Luna: $5/$30, $2.50/$15, $1/$6. Ultra mode = 4 communicating subagents as a model setting (OpenAI launch post). Coding Agent Index 80 achieved with max reasoning inside Codex. No SWE-bench Verified published.
- Kimi K3: 2.8T total, 16-of-896 experts, Kimi Delta Attention, QAT MXFP4 (4-bit IS the reference precision), $3/$15 API, $0.30 cache reads, AA index 57 vs Sol 59 vs Fable 60. Moonshot blog, Jul 16.
- RunPod on-demand (Jul 17): H200 $4.39, B200 $5.89, B300 $7.39 per GPU/hr. Instant Clusters 2 to 8 nodes.

Caveated in the text (keep the hedges):
- K3 ~50B active params: third-party estimate only (Moonshot disclosed only 16/896).
- Fable SWE-Bench Pro 80.3%: vendor-reported, contested, absent from Scale's independent board.
- Stripe 50M-line Ruby anecdote: Anthropic marketing material, cited as such.
- K3 Swarm Max "hundreds of subagents": AlphaSignal secondary (~300), official demos show 20+ concurrent.
- Self-host numbers ($59/8xB300, $70/16xH200, $211+/BF16, 25 to 50 tok/s per stream, ~1,100 tok/s break-even vs K3 API): K2-calibrated projections, not measurements.

Dropped from v2 (do not reintroduce):
- The "65% of enterprise AI failures trace to harness defects" stat: traces to one unattributed TechTimes sentence. Fabrication risk.
- "Nate B Jones 42% to 78%": misattributed. Real figure is CORE-Bench (scientific reproducibility, not coding), from Sayash Kapoor/Anthropic; Jones publicized it.
- "more than any model upgrade": embellishment; not in Vercel's post.

## Pending / next steps

- **Jul 27**: K3 weights + tech report drop. Recheck active-param count and on-disk sizes, and rerun the Price Ladder self-host math with real numbers. vLLM day-0 KDA support is untested; early August is the honest recheck window.
- Dev preview: this worktree has no `node_modules`. Run `npm install` in it, then `npm run dev`.
- Prose gate: `node scripts/prose-lint.mjs src/posts/the-wall-and-the-building.md` currently passes with 0 errors (budgets: 1 negation pivot, 4 punch pairs, no em/en dashes, no semicolons, excerpt numbers must appear in the body). NOTE: this branch predates the prose-lint tooling; the script lives on `main`. Run it from a main checkout against this file, or merge `main` into this branch first.
- Draft guard: `node scripts/check-draft.mjs <file>` flags financial figures for manual review (the essay intentionally uses numeral money figures per house style; eyeball, don't "fix").
- Deploy only from `main`, and only when Ben says: see CLAUDE.md (`npm run build && rsync ...`).

## Fresh-machine setup

```
git fetch origin
git worktree add .worktrees/inference-wall draft/inference-wall
cd .worktrees/inference-wall && npm install
```
