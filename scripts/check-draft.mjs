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
    name: "Street address",
    pattern: /\b\d+\s+[A-Z][a-z]+(?:\s+(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Lane|Ln|Road|Rd|Court|Ct|Way|Place|Pl))\.?\b/g,
    description: (match) => `Street address: "${match}"`,
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
