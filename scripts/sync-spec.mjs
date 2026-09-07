#!/usr/bin/env node
/**
 * Syncs the dbtdashboard v4 requirements spec into src/spec/ for the /dbt-spec/ pages.
 *
 * Source of truth: ~/development/dbtdashboardv4-spec (its own git repo).
 * This script copies + transforms: strips the leading H1 (the page renders its own
 * header), injects frontmatter (title/order/description), and rewrites inter-doc
 * links from `NN-name.md` to `/dbt-spec/nn-name/` routes.
 *
 * Run after any spec edit:  npm run sync:spec && npm run build
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SPEC_REPO = fileURLToPath(new URL("../../dbtdashboardv4-spec/", import.meta.url));
const OUT_DIR = fileURLToPath(new URL("../src/spec/", import.meta.url));

const DESCRIPTIONS = {
  "README.md":
    "Decision log D-01…D-15 from the 2026-09-05 interview, glossary, scope, and what v4 inherits from v1/v3.",
  "01-linehan-standard.md":
    "How DBT classes are expected to flow — the canonical Linehan baseline, externally sourced.",
  "02-dbtu-custom-practice.md":
    "How DBT Network of Utah actually runs classes — their custom practice, with the delta table vs Linehan.",
  "03-client-lifecycle.md":
    "Client lifecycle flows: contact→graduation, movement through a module, module→module and round→round.",
  "04-session-operations.md":
    "Session-night operations: attendance, the close/lock ritual, notes, cancellation modes, and the miss ladder.",
  "05-module-management.md":
    "Module lifecycle (create/edit/archive/delete), roster management, ordering/chaining, and the calendar.",
  "06-roles-and-permissions.md":
    "The five-role model (Owner/Admin/Provider/Teacher/Developer) and the permission matrix.",
  "07-open-decisions.md":
    "Open-decision register O-01…O-33, each with a recommendation, impact, and suggested owner.",
  "08-missed-use-cases.md":
    "The missed-use-case catalog — scenarios absent from all three prior repos.",
  "09-references.md":
    "Full citations: repo path:line sources, prior agentic opinions, external Linehan sources.",
  "10-scene-inventory.md":
    "Scene inventory — 13 staff moments with five-line wireframe cards for prototyping in Claude Design; build order, navigation map, review protocol, prompt seed.",
};

const slugFor = (file) => (file === "README.md" ? "00-overview" : file.replace(/\.md$/, ""));

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SPEC_REPO)
  .filter((f) => f.endsWith(".md"))
  .sort();

let count = 0;
for (const file of files) {
  if (!(file in DESCRIPTIONS)) {
    console.warn(`! no description entry for ${file} — using fallback`);
  }
  const raw = readFileSync(join(SPEC_REPO, file), "utf8");

  // Strip the leading H1 — the page template renders its own header.
  const body = raw.replace(/^# .*(?:\n+)?/, "");

  // Rewrite inter-doc links: [text](README.md §1) → [text](/dbt-spec/00-overview/)
  const linked = body.replace(
    /\]\((README\.md|\d{2}-[a-z-]+\.md)([^)]*)\)/g,
    (_m, target) => `](/dbt-spec/${slugFor(target)}/)`
  );

  const order = file === "README.md" ? 0 : Number(file.slice(0, 2));
  const title = raw.match(/^# (.+)$/m)?.[1] ?? file;
  const description =
    DESCRIPTIONS[file] ?? (body.trim().split("\n")[0] ?? "").slice(0, 140);

  const fm = `---\ntitle: ${JSON.stringify(title)}\norder: ${order}\ndescription: ${JSON.stringify(description)}\n---\n\n`;
  writeFileSync(join(OUT_DIR, `${slugFor(file)}.md`), fm + linked);
  count++;
}
console.log(`Synced ${count} spec docs -> src/spec/`);
