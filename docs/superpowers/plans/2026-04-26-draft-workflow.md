# Draft Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/draft` Claude Code skill with a privacy guard script and git pre-commit hook for managing blog post drafts.

**Architecture:** A standalone Node CLI script (`scripts/check-draft.mjs`) scans Markdown files for PII, financial figures, and AI-generated patterns. A `.draft-guard.json` config file provides allowlists. A git pre-commit hook runs the guard on `main` branch only. A Claude Code skill definition orchestrates the full draft branch lifecycle.

**Tech Stack:** Node 24 (native ESM), TypeScript/JavaScript, git hooks, Claude Code skills

---

## File Structure

| File | Purpose |
|------|---------|
| `scripts/check-draft.mjs` | Privacy guard CLI — scans `.md` files, exits 1 on issues |
| `.draft-guard.json` | Allowlist config for names, URLs, custom patterns |
| `.git/hooks/pre-commit` | Runs guard on staged `.md` files when on `main` |
| `.claude/skills/draft.md` | `/draft` Claude Code skill definition |
| `package.json` | Add `check:draft` script |

### Task 1: Create the privacy guard script

**Files:**
- Create: `scripts/check-draft.mjs`

- [ ] **Step 1: Create the guard script**

```javascript
#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const GUARD_CONFIG_PATH = resolve(".draft-guard.json");

function loadConfig() {
  if (!existsSync(GUARD_CONFIG_PATH)) {
    return { allowedNames: [], allowedUrls: [], customPatterns: [] };
  }
  const raw = readFileSync(GUARD_CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}

const config = loadConfig();

const CHECKS = [
  {
    name: "Financial figure",
    pattern: /\$[\d,]{3,}/g,
    description: (match) => `Financial figure: "${match}"`,
  },
  {
    name: "Email address",
    pattern: /\b[\w.-]+@[\w.-]+\.\w{2,}\b/g,
    description: (match) => `Email address: "${match}"`,
  },
  {
    name: "Phone number",
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    description: (match) => `Phone number: "${match}"`,
  },
  {
    name: "SSN pattern",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    description: (match) => `SSN pattern: "${match}"`,
  },
  {
    name: "AI-generated pattern",
    pattern:
      /\b(delve(?:d|s)? into|it'?s worth noting|in conclusion|in this (?:essay|post|article)|let'?s dive in|it'?s important to note|in today'?s (?:world|landscape|digital))\b/gi,
    description: (match) => `AI-generated pattern: "${match}"`,
  },
];

function isAllowed(text) {
  for (const name of config.allowedNames ?? []) {
    if (text.includes(name)) return true;
  }
  for (const url of config.allowedUrls ?? []) {
    if (text.includes(url)) return true;
  }
  return false;
}

function scanFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const check of CHECKS) {
      const matches = line.matchAll(check.pattern);
      for (const match of matches) {
        if (isAllowed(match[0])) continue;
        issues.push({
          line: i + 1,
          message: check.description(match[0]),
        });
      }
    }
  }

  // Custom patterns from config
  for (const pattern of config.customPatterns ?? []) {
    const re = new RegExp(pattern, "g");
    for (let i = 0; i < lines.length; i++) {
      const matches = lines[i].matchAll(re);
      for (const match of matches) {
        issues.push({
          line: i + 1,
          message: `Custom pattern: "${match[0]}"`,
        });
      }
    }
  }

  return issues;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/check-draft.mjs <file1.md> [file2.md ...]");
  process.exit(2);
}

let totalIssues = 0;

for (const file of files) {
  const resolved = resolve(file);
  if (!existsSync(resolved)) {
    console.error(`File not found: ${file}`);
    process.exit(2);
  }

  const issues = scanFile(resolved);

  if (issues.length === 0) {
    console.log(`✅ ${file} — no issues found`);
  } else {
    console.log(`⚠️  ${file}`);
    for (const issue of issues) {
      console.log(`  Line ${issue.line}: ${issue.message}`);
    }
    console.log(`  ${issues.length} issue${issues.length === 1 ? "" : "s"} found. Fix before publishing.`);
    totalIssues += issues.length;
  }
}

process.exit(totalIssues > 0 ? 1 : 0);
```

- [ ] **Step 2: Make it executable and test it**

Run: `chmod +x scripts/check-draft.mjs`

Test with an existing post: `node scripts/check-draft.mjs src/posts/hello-world.md`

Expected: `✅ src/posts/hello-world.md — no issues found`

- [ ] **Step 3: Test it catches issues**

Create a temp file with known issues:
```bash
echo 'My salary is $125,000 and my SSN is 123-45-6789. It is worth noting that delve into the data shows email@test.com.' > /tmp/test-draft.md
node scripts/check-draft.mjs /tmp/test-draft.md
```

Expected: Exit code 1, multiple issues listed (financial figure, SSN, AI pattern, email).

Clean up: `rm /tmp/test-draft.md`

- [ ] **Step 4: Commit**

```bash
git add scripts/check-draft.mjs
git commit -m "feat: add privacy guard script for draft posts"
```

---

### Task 2: Create the guard config file

**Files:**
- Create: `.draft-guard.json`

- [ ] **Step 1: Create the config**

```json
{
  "allowedNames": ["Ben Smith", "Ben"],
  "allowedUrls": ["benwsmith.com", "github.com/ben-w-smith"],
  "customPatterns": []
}
```

- [ ] **Step 2: Verify the config is loaded**

Run: `node scripts/check-draft.mjs src/posts/hello-world.md`

Expected: Still `✅` — no regressions. The config doesn't change behavior for clean files.

- [ ] **Step 3: Commit**

```bash
git add .draft-guard.json
git commit -m "feat: add draft guard allowlist config"
```

---

### Task 3: Add `check:draft` npm script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the script**

Add to `package.json` scripts section:

```json
"check:draft": "node scripts/check-draft.mjs"
```

The full scripts section becomes:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check:draft": "node scripts/check-draft.mjs",
  "astro": "astro"
}
```

- [ ] **Step 2: Verify**

Run: `npm run check:draft -- src/posts/hello-world.md`

Expected: `✅ src/posts/hello-world.md — no issues found`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add check:draft npm script"
```

---

### Task 4: Create the git pre-commit hook

**Files:**
- Create: `.git/hooks/pre-commit`

- [ ] **Step 1: Write the hook**

```bash
#!/bin/sh

# Only run on main branch
branch=$(git symbolic-ref --short HEAD 2>/dev/null)
if [ "$branch" != "main" ]; then
  exit 0
fi

# Get staged .md files in src/posts/
staged=$(git diff --cached --name-only --diff-filter=ACM -- 'src/posts/*.md')

if [ -z "$staged" ]; then
  exit 0
fi

# Run the guard
node scripts/check-draft.mjs $staged
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo ""
  echo "❌ Draft guard found issues. Fix them before committing to main."
  echo "   Run: npm run check:draft -- <file>"
  exit 1
fi

exit 0
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x .git/hooks/pre-commit`

- [ ] **Step 3: Test the hook skips on non-main branches**

On current branch (`main`), verify the hook fires correctly by running it manually:

```bash
git add src/posts/hello-world.md
.git/hooks/pre-commit
```

Expected: `✅ src/posts/hello-world.md — no issues found` (exit 0)

Then unstage: `git reset HEAD src/posts/hello-world.md`

- [ ] **Step 4: Commit the hook source as a tracked file**

Since `.git/hooks/` is not tracked by git, save a copy that can be version-controlled:

Create `scripts/install-hooks.sh`:

```bash
#!/bin/sh
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "✅ Pre-commit hook installed."
```

Create `scripts/pre-commit` (the hook source, tracked in repo):

```bash
#!/bin/sh

# Only run on main branch
branch=$(git symbolic-ref --short HEAD 2>/dev/null)
if [ "$branch" != "main" ]; then
  exit 0
fi

# Get staged .md files in src/posts/
staged=$(git diff --cached --name-only --diff-filter=ACM -- 'src/posts/*.md')

if [ -z "$staged" ]; then
  exit 0
fi

# Run the guard
node scripts/check-draft.mjs $staged
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo ""
  echo "❌ Draft guard found issues. Fix them before committing to main."
  echo "   Run: npm run check:draft -- <file>"
  exit 1
fi

exit 0
```

Run: `chmod +x scripts/pre-commit scripts/install-hooks.sh`

Install the hook: `./scripts/install-hooks.sh`

Expected: `✅ Pre-commit hook installed.`

- [ ] **Step 5: Commit**

```bash
git add scripts/pre-commit scripts/install-hooks.sh
git commit -m "feat: add pre-commit hook and install script for draft guard"
```

---

### Task 5: Create the `/draft` Claude Code skill

**Files:**
- Create: `.claude/skills/draft.md`

- [ ] **Step 1: Create the skill definition**

```markdown
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
```

- [ ] **Step 2: Verify the skill is discoverable**

Run: `ls -la .claude/skills/draft.md`

Expected: File exists.

Claude Code will auto-discover skills in `.claude/skills/`. No additional registration needed.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/draft.md
git commit -m "feat: add /draft skill for blog post draft workflow"
```

---

### Task 6: Test the full workflow with the tax correction post

**Files:**
- Create: `src/posts/tax-correction.md` (on a draft branch)

This task tests the complete workflow end-to-end by creating a draft for the tax correction post.

- [ ] **Step 1: Create the draft branch**

```bash
git checkout -b draft/tax-correction main
```

- [ ] **Step 2: Create the post scaffold**

Create `src/posts/tax-correction.md` with the frontmatter:

```markdown
---
title: "The Tax Correction Project"
date: 2026-04-26
category: Essay
excerpt: ""
---
```

The excerpt and content will be filled in from the user's existing draft material.

- [ ] **Step 3: Import content**

Ask the user to provide the tax correction content — paste it, share a file path, or share a URL. Then populate the post file.

- [ ] **Step 4: Run the privacy guard**

```bash
npm run check:draft -- src/posts/tax-correction.md
```

Review any issues. Fix PII (replace real income numbers with ranges or remove, fix AI patterns, etc.).

- [ ] **Step 5: Preview locally**

```bash
npm run dev
```

Open `http://localhost:4321/blog/tax-correction` in the browser. Verify the post renders correctly.

- [ ] **Step 6: User reads and approves**

Ask the user to read through the post and request any edits.

- [ ] **Step 7: Commit the draft**

```bash
git add src/posts/tax-correction.md
git commit -m "draft: add tax correction post"
```

**No `Co-Authored-By` trailer.** Blog posts are the author's work.

Note: The pre-commit hook won't fire here since we're on `draft/tax-correction`, not `main`.

- [ ] **Step 8: Test publish flow (dry run)**

Run the publish steps manually without deploying to verify they work:

```bash
npm run check:draft -- src/posts/tax-correction.md
```

Expected: `✅ src/posts/tax-correction.md — no issues found`

Then merge to main:

```bash
git checkout main
git merge draft/tax-correction
```

The pre-commit hook should NOT block this merge (merges don't trigger pre-commit hooks, only commits do). Verify the post is on main.

- [ ] **Step 9: Decide on publishing**

Ask the user: "Ready to deploy to production, or keep it on main for now?"

If deploying:
```bash
npm run build && rsync -avz --delete dist/ root@146.190.61.214:/var/www/html/
git branch -d draft/tax-correction
```

- [ ] **Step 10: Commit any final changes**

If edits were made during the test, commit them:
```bash
git add -A
git commit -m "feat: add tax correction blog post"
```

**No `Co-Authored-By` trailer on blog post commits.**
