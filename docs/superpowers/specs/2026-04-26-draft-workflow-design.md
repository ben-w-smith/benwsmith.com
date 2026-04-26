# Draft Workflow Design

A Claude Code skill (`/draft`) for managing blog post drafts with privacy guards, branch isolation, and a repeatable publish process.

## Overview

The blogging workflow has four pieces:

1. **Branch isolation** — each draft gets its own `draft/<slug>` branch, keeping `main` clean
2. **Local preview** — `npm run dev` serves as the staging environment
3. **Privacy guard script** — automated checks for PII, financial figures, and AI-generated patterns
4. **Publishing process** — a structured flow from idea to live post

## `/draft` Skill

A Claude Code skill that launches the draft workflow. It supports two modes:

### Start a New Draft

```
/draft tax-correction
```

1. Checks for existing `draft/*` branches and lists them
2. Creates a new branch `draft/tax-correction` from `main`
3. Asks: "Starting from scratch or importing existing content?"
   - **From scratch:** Creates `src/posts/tax-correction.md` with frontmatter scaffold
   - **Import:** Asks for file path, URL, or pasted content. Imports into the post file
4. Runs `npm run dev` in the background for live preview
5. Enters editing mode — Claude helps refine the draft

### Resume an Existing Draft

```
/draft
```

1. Lists all `draft/*` branches with a summary of each post's state
2. User picks one to resume
3. Checks out the branch, runs `npm run dev`, enters editing mode

### Editing Mode

While in a draft, Claude can:

- Suggest structural edits (outline, sections, flow)
- Run the privacy guard automatically after each substantive edit
- Track the post's readiness status (draft → reviewed → ready to ship)

### Publish

```
/draft publish
```

1. Runs the privacy guard script — **must pass with zero alerts**
2. Asks the user to do a final read-through
3. Commits the final version
4. Merges `draft/<slug>` into `main`
5. Deploys via the existing deploy command
6. Deletes the draft branch
7. Confirms live URL

## Privacy Guard Script

A standalone script (`scripts/check-draft.ts`) that scans Markdown files for safety issues.

### What It Checks

| Category | Pattern | Example |
|----------|---------|---------|
| Financial figures | Dollar amounts with 3+ digits | `$87,500`, `$1,200` |
| Personal identifiers | Email addresses | `user@example.com` |
| Personal identifiers | Phone numbers | `555-123-4567` |
| Personal identifiers | Street addresses | `123 Main St` |
| AI tell patterns | Common AI phrases | "delve into", "it's worth noting", "in conclusion", "in this [essay/post/article]" |
| Personal identifiers | SSN patterns | `XXX-XX-XXXX` |

### Configuration

A `.draft-guard.json` file in the project root allows allowlisting:

```json
{
  "allowedNames": ["Ben Smith", "Ben"],
  "allowedUrls": ["benwsmith.com", "github.com/ben-w-smith"],
  "customPatterns": []
}
```

### Output

```
✅ src/posts/tax-correction.md — no issues found
```

Or:

```
⚠️  src/posts/tax-correction.md
  Line 42: Financial figure: "$87,500"
  Line 78: AI-generated pattern: "it's worth noting that"
  2 issues found. Fix before publishing.
```

Exit code 1 if issues found, 0 if clean.

### Git Hook Enforcement

A git pre-commit hook runs the privacy guard on any staged `.md` files in `src/posts/` — but only when the current branch is `main`. On draft branches, the hook is skipped so you can work freely. This blocks merges to `main` that contain flagged content, even without Claude running.

The hook is installed via a setup script or manually copied to `.git/hooks/pre-commit`.

## Multi-Draft Management

The `/draft` skill tracks all `draft/*` branches. Running `/draft` with no arguments shows:

```
Draft branches:
  draft/tax-correction    — "The Tax Correction Project" (3 edits, last: 2 hours ago)
  draft/gof-optimization  — "Optimizing Game of Life" (1 edit, last: 3 days ago)
```

This lets you context-switch between drafts without losing track of what's in progress.

## Branch Naming Convention

- Format: `draft/<kebab-case-slug>`
- Must match the post filename: `draft/tax-correction` → `src/posts/tax-correction.md`
- Slugs are lowercase, hyphenated, descriptive (2-4 words)

## File Structure

```
scripts/
  check-draft.ts          # Privacy guard script
.claude/
  skills/
    draft.md              # /draft skill definition
.draft-guard.json         # Allowlist configuration
.git/
  hooks/
    pre-commit            # Runs check-draft on staged .md files
```

## Workflow Summary

```
/draft <slug>        →  Create new draft branch + post scaffold
/draft               →  List existing drafts, pick one to resume
(draft editing mode) →  Edit, preview locally, auto-check privacy
/draft publish       →  Final guard check → merge → deploy → cleanup
```

## Implementation Order

1. Privacy guard script (`scripts/check-draft.ts`)
2. `.draft-guard.json` config file
3. Git pre-commit hook
4. `/draft` skill definition
5. Test with the tax correction post
