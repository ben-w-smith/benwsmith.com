---
name: draft
description: Manage blog post drafts — create, resume, edit, and publish posts with privacy guard checks.
---

# Draft Blog Post Workflow

Manage blog post drafts using branch isolation and privacy guard checks.

## Usage

- `/draft` — List existing drafts and resume one
- `/draft <slug>` — Start a new draft (e.g., `/draft tax-correction`)
- `/draft publish` — Publish the current draft
- `/draft check` — Run privacy guard on current draft

## Arguments

The skill receives a single argument string. Parse it as follows:

- Empty or no argument → Resume mode
- `publish` → Publish mode
- `check` → Check mode
- Anything else → New draft with that slug

## Modes

### New Draft (`/draft <slug>`)

1. **Validate the slug** — must be lowercase, hyphenated, 2-4 words (e.g., `tax-correction`, `gof-optimization`). If invalid, suggest a corrected version and ask the user to confirm.
2. **Check for existing draft branches** — run `git branch --list 'draft/*'`. If `draft/<slug>` already exists, tell the user and ask if they want to resume it instead.
3. **Create the branch** — `git checkout -b draft/<slug> main`
4. **Ask about content source:**
   - "Are you starting from scratch or importing existing content?"
   - If importing: ask for a file path, URL, or ask them to paste content
5. **Create the post file** — `src/posts/<slug>.md` with frontmatter scaffold:
   ```markdown
   ---
   title: "TITLE HERE"
   date: YYYY-MM-DD
   category: Technical
   excerpt: "One-sentence summary."
   ---

   ## Section Title

   Content goes here.
   ```
   If importing, populate with the imported content instead of the scaffold.
6. **Start dev server** — run `npm run dev` in the background if not already running.
7. **Tell the user** the post file path and local URL (e.g., `http://localhost:4321/blog/<slug>`).
8. **Offer to help edit** — ask what they'd like to work on first.

### Resume (`/draft`)

1. **List draft branches** — run `git branch --list 'draft/*'`
2. If no drafts exist, say "No drafts in progress. Use `/draft <slug>` to start one." and stop.
3. If on a draft branch already, confirm they want to stay or switch.
4. Show each branch with the post title (extracted from frontmatter) and last modified date.
5. User picks one → `git checkout draft/<slug>`
6. Start dev server if not running.
7. Offer to help edit.

### Check (`/draft check`)

1. Find the post file on the current branch — look for `src/posts/<slug>.md` where `<slug>` matches the branch name after `draft/`.
2. Run `npm run check:draft -- src/posts/<slug>.md`
3. Report results to the user.
4. If issues found, offer to fix them.

### Publish (`/draft publish`)

1. **Verify on a draft branch** — if not on `draft/*`, error out.
2. **Run privacy guard** — `npm run check:draft -- src/posts/<slug>.md`
3. If guard fails, show issues and stop. Do not proceed.
4. **Ask for final read-through** — "Please read through the post one more time. Ready to publish?"
5. **Commit final version** — stage `src/posts/<slug>.md`, commit with message like `feat: add "<post title>" blog post`. **Do NOT add Co-Authored-By trailers to blog post commits.** The author wrote the post; AI assisted with tooling, not authorship.
6. **Merge to main** — `git checkout main && git merge draft/<slug>`
7. **Deploy** — run `npm run build && rsync -avz --delete dist/ root@146.190.61.214:/var/www/html/`
8. **Delete draft branch** — `git branch -d draft/<slug>`
9. **Confirm** — tell the user the post is live at `https://benwsmith.com/blog/<slug>`

## Attribution

Blog posts are the author's work. AI agents assist with tooling (branch setup, formatting, privacy checks) but do not co-author posts. Never add `Co-Authored-By` or similar attribution trailers to blog post commits. Infrastructure and tooling commits may use standard co-authorship.

## Privacy Guard

The guard runs automatically during `/draft check` and `/draft publish`. It checks for:

- Financial figures ($XX,XXX)
- Email addresses, phone numbers, SSN patterns
- AI-generated phrases ("delve into", "it's worth noting", etc.)

Configuration is in `.draft-guard.json` at the project root.

## Branch Convention

- Format: `draft/<kebab-case-slug>`
- Slug matches post filename: `draft/tax-correction` → `src/posts/tax-correction.md`
- One post per branch

## Error Handling

- If `npm run dev` is already running, don't start another instance
- If git working tree is dirty when trying to switch branches, ask the user to commit or stash first
- If deploy fails, do not delete the draft branch
