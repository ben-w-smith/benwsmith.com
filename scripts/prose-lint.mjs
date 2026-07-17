#!/usr/bin/env node
// prose-lint: deterministic style checks for blog posts in src/posts/.
// Encodes the countable prose rules from the 2026-07 style review so any
// drafting model (Fable, GLM, DeepSeek, ...) gets the same quality floor.
//
// Usage:
//   node scripts/prose-lint.mjs src/posts/foo.md   # gate one post (exit 1 on errors)
//   node scripts/prose-lint.mjs                    # report on the whole corpus
//   node scripts/prose-lint.mjs --self-test        # verify every rule still fires
//
// Tiers: ERROR = must fix. WARN = fix or justify in one line. INFO = context for the reviser.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";

const POSTS_DIR = "src/posts";

// Configurable lists — edit freely.
const CLICHES = [
  "borrowed time",
  "race to the bottom",
  "at the end of the day",
  "game changer",
  "game-changer",
  "gives the game away",
  "gives the whole game away",
  "low-hanging fruit",
  "paradigm shift",
  "double-edged sword",
  "tip of the iceberg",
  "elephant in the room",
  "perfect storm",
  "silver bullet",
  "secret sauce",
];

const STOCK_SETUPS = [
  /\bhere'?s the problem\b/gi,
  /\bhere'?s the thing\b/gi,
  /\blet that sink in\b/gi,
  /\bmoreover\b/gi,
  /\bfurthermore\b/gi,
  /\bin addition,/gi,
  /\bconsequently\b/gi,
];

const ABSOLUTES = [
  /\bnot a single\b/gi,
  /\bevery single\b/gi,
  /\bnobody\b/gi,
  /\bno one\b/gi,
  /\beveryone\b/gi,
  /\beverything\b/gi,
  /\balways\b/gi,
  /\bnever\b/gi,
  /\ball of them\b/gi,
  /\bthe pattern is total\b/gi,
];

// Phrases that are fine once but become a house tic when they recur across posts.
const SIGNATURE_PHRASES = [
  "the thing i keep coming back to",
  "was never the",
  "here's the part",
  "i've been paying for",
  "i've been writing software professionally",
];

const ORDINALS =
  /\b(?:First|Second|Third|Fourth)[,:]|\bThe (?:first|second|third|fourth) (?:is|was|layer|one|kind)\b/g;

// "That's not X. It's Y." and friends, as split sentences.
const NEGATION_PIVOT =
  /\b(?:That|It|This)['’]s not (?:just )?[^.!?\n]{1,90}[.!?]\s+(?:That|It|This)['’]s\b|\bis(?:n['’]t| not) (?:just )?[^.!?\n]{1,90}[.!?]\s+(?:That|It|This)['’]s\b/g;

const SPELLED_BIG_MONEY =
  /\b(?:\w+ hundred(?: and \w+(?:[- ]\w+)?)?|\w+ point \w+|\w+ and \w+) (?:million|billion|trillion)\b/gi;

// ---------- helpers ----------

function parsePost(raw) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = fm ? fm[1] : "";
  const body = fm ? raw.slice(fm[0].length) : raw;
  const excerpt = (frontmatter.match(/excerpt:\s*"([\s\S]*?)"\s*$/m) || [])[1] ?? "";
  const title = (frontmatter.match(/title:\s*"([\s\S]*?)"\s*$/m) || [])[1] ?? "";
  return { frontmatter, body, excerpt, title };
}

function stripNonProse(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // keep link text, drop URLs
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function findAll(text, regex) {
  const out = [];
  const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({ match: m[0], line: lineOf(text, m.index) });
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}

function sentences(prose) {
  return prose
    .replace(/^#{1,6} .*$/gm, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && /[a-zA-Z]/.test(s));
}

function words(s) {
  return s.split(/\s+/).filter(Boolean);
}

function ngrams(tokens, n) {
  const out = [];
  for (let i = 0; i + n <= tokens.length; i++) out.push(tokens.slice(i, i + n).join(" "));
  return out;
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

// ---------- rules ----------

function lintPost(raw, filename) {
  const { body, excerpt, title } = parsePost(raw);
  const prose = stripNonProse(body);
  const proseWithExcerpt = excerpt + "\n" + prose;
  const errors = [];
  const warns = [];
  const infos = [];

  // E1: em/en dashes
  const dashes = findAll(proseWithExcerpt, /[—–]/g);
  if (dashes.length > 0)
    errors.push(`E1 em/en dash x${dashes.length} (lines ${dashes.map((d) => d.line).join(", ")}). Use commas, colons, parens, or a sentence split.`);

  // E2: straight " - " budget (<= 2)
  const straight = findAll(prose, / - /g);
  if (straight.length > 2)
    errors.push(`E2 straight " - " x${straight.length} (budget 2). Lines ${straight.map((d) => d.line).join(", ")}.`);

  // E3: negation pivot budget (<= 1)
  const pivots = findAll(prose, NEGATION_PIVOT);
  if (pivots.length > 1)
    errors.push(`E3 "That's not X. It's Y." pivot x${pivots.length} (budget 1): ${pivots.map((p) => `L${p.line} "${p.match.slice(0, 50)}..."`).join(" | ")}`);
  else if (pivots.length === 1)
    infos.push(`I0 negation pivot budget used (1/1): L${pivots[0].line} "${pivots[0].match.slice(0, 60)}..."`);

  // E4: stock setups and banned transitions
  for (const re of STOCK_SETUPS) {
    const hits = findAll(proseWithExcerpt, re);
    for (const h of hits) errors.push(`E4 stock phrase "${h.match}" (line ${h.line}). Fold it into the sentence it introduces.`);
  }

  // E5: every number in the excerpt must appear in the body
  const excerptNums = excerpt.match(/\$?\d[\d,.]*/g) ?? [];
  for (const n of excerptNums) {
    const core = n.replace(/[$,]/g, "");
    if (!prose.replace(/[$,]/g, "").includes(core))
      errors.push(`E5 excerpt number "${n}" does not appear in the body. Excerpt stats must be body stats.`);
  }

  // W1: semicolons
  const semis = findAll(prose, /;/g);
  if (semis.length > 0)
    warns.push(`W1 semicolon x${semis.length} (lines ${semis.map((d) => d.line).join(", ")}). House style avoids them.`);

  // W2: absolutes
  const absHits = ABSOLUTES.flatMap((re) => findAll(prose, re));
  if (absHits.length > 0)
    warns.push(`W2 absolutes x${absHits.length}: ${absHits.map((h) => `"${h.match}" L${h.line}`).join(", ")}. Verify the enumeration or hedge ("I can't find...").`);

  // W3: ordinal scaffolding density (> 4 markers ~ more than one enumerated structure)
  const ords = findAll(prose, ORDINALS);
  if (ords.length > 4)
    warns.push(`W3 ordinal scaffolding x${ords.length} markers (budget ~4, i.e. one enumerated structure). Lines ${ords.map((d) => d.line).join(", ")}.`);

  // W4: cliches
  for (const c of CLICHES) {
    const hits = findAll(proseWithExcerpt, new RegExp(c.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi"));
    for (const h of hits) warns.push(`W4 cliche "${h.match}" (line ${h.line}).`);
  }

  // W5: closing echo — 4-grams of the final sentence appearing earlier or in the title
  const sents = sentences(prose);
  if (sents.length > 3) {
    const last = normalize(sents[sents.length - 1]);
    const earlier = normalize(title + " " + sents.slice(0, -1).join(" "));
    const echoes = ngrams(words(last), 4).filter((g) => earlier.includes(g));
    if (echoes.length > 0)
      warns.push(`W5 closing echo: final sentence phrase already appears earlier ("${echoes[0]}"). The last line should land once.`);
  }

  // W6: spelled-out large money figures
  const spelled = findAll(prose, SPELLED_BIG_MONEY);
  if (spelled.length > 0)
    warns.push(`W6 spelled-out figure ${spelled.map((h) => `"${h.match}" L${h.line}`).join(", ")}. Use numerals for precise figures ("$559 million").`);

  // I1: sentence stats
  if (sents.length > 0) {
    const lens = sents.map((s) => words(s).length);
    const mean = (lens.reduce((a, b) => a + b, 0) / lens.length).toFixed(1);
    const longest = sents[lens.indexOf(Math.max(...lens))];
    infos.push(`I1 sentences: ${sents.length}, mean ${mean} words (target ~15-20), longest ${Math.max(...lens)}: "${longest.slice(0, 70)}..."`);

    // I2: punch-pair density (adjacent sentences both <= 7 words)
    const pairs = [];
    for (let i = 0; i + 1 < sents.length; i++)
      if (lens[i] <= 7 && lens[i + 1] <= 7) pairs.push(`"${sents[i]} ${sents[i + 1]}"`);
    if (pairs.length > 0)
      infos.push(`I2 punch pairs x${pairs.length} (budget ~4, section closers only): ${pairs.map((p) => p.slice(0, 60)).join(" | ")}`);
  }

  return { filename, errors, warns, infos };
}

function corpusSignatureRepeats(files) {
  const notes = [];
  for (const phrase of SIGNATURE_PHRASES) {
    const inPosts = files.filter((f) => normalize(f.raw).includes(phrase));
    if (inPosts.length > 1)
      notes.push(`I3 signature phrase "${phrase}" appears in ${inPosts.length} posts: ${inPosts.map((f) => basename(f.path)).join(", ")}. Fine once; a tic when repeated.`);
  }
  return notes;
}

// ---------- reporting ----------

function report(results, corpusNotes) {
  let errorCount = 0;
  for (const r of results) {
    const total = r.errors.length + r.warns.length + r.infos.length;
    console.log(`\n${r.filename}`);
    if (total === 0) console.log("  clean");
    for (const e of r.errors) console.log(`  ERROR ${e}`);
    for (const w of r.warns) console.log(`  WARN  ${w}`);
    for (const i of r.infos) console.log(`  INFO  ${i}`);
    errorCount += r.errors.length;
  }
  for (const n of corpusNotes) console.log(`\nCORPUS ${n}`);
  console.log(`\n${errorCount} error(s). ${errorCount ? "Fix errors, then re-run." : "Gate passed."}`);
  return errorCount;
}

// ---------- self-test ----------

function selfTest() {
  const fixture = `---
title: "Test Post"
excerpt: "This costs $42 and grew 7 percent."
---

This has an em dash — right here, and – an en dash. That's not a bug. It's a feature. That's not a phase. That's the structure. Moreover, consider this. Here's the problem. We live on borrowed time in a race to the bottom; obviously. Five hundred and fifty-nine million dollars was spent, and seven point four billion more. Not a single reviewer objected. Everyone agrees. First, one thing. Second, another. Third, more. The first is small. The second is smaller. Short one. Tiny two here. The final phrase lands here now. And so the final phrase lands here now.`;

  const r = lintPost(fixture, "fixture");
  const checks = [
    ["E1 dash", r.errors.some((e) => e.startsWith("E1"))],
    ["E3 pivot", r.errors.some((e) => e.startsWith("E3"))],
    ["E4 stock", r.errors.some((e) => e.startsWith("E4"))],
    ["E5 excerpt", r.errors.some((e) => e.startsWith("E5"))],
    ["W1 semicolon", r.warns.some((w) => w.startsWith("W1"))],
    ["W2 absolutes", r.warns.some((w) => w.startsWith("W2"))],
    ["W3 ordinals", r.warns.some((w) => w.startsWith("W3"))],
    ["W4 cliche", r.warns.some((w) => w.startsWith("W4"))],
    ["W5 closing echo", r.warns.some((w) => w.startsWith("W5"))],
    ["W6 spelled money", r.warns.some((w) => w.startsWith("W6"))],
    ["I1 stats", r.infos.some((i) => i.startsWith("I1"))],
    ["I2 punch pairs", r.infos.some((i) => i.startsWith("I2"))],
  ];
  let failed = 0;
  for (const [name, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
    if (!ok) failed++;
  }
  console.log(failed ? `\n${failed} self-test failure(s)` : "\nAll rules fire.");
  process.exit(failed ? 1 : 0);
}

// ---------- main ----------

const args = process.argv.slice(2);
if (args.includes("--self-test")) selfTest();

const targets = args.filter((a) => !a.startsWith("--"));
const paths =
  targets.length > 0
    ? targets.map((t) => resolve(t))
    : readdirSync(POSTS_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => resolve(join(POSTS_DIR, f)));

const files = paths
  .filter((p) => existsSync(p))
  .map((p) => ({ path: p, raw: readFileSync(p, "utf-8") }));

if (files.length === 0) {
  console.error("No post files found.");
  process.exit(1);
}

const results = files.map((f) => lintPost(f.raw, basename(f.path)));
const corpusNotes = targets.length === 0 ? corpusSignatureRepeats(files) : [];
const errors = report(results, corpusNotes);
process.exit(errors > 0 ? 1 : 0);
