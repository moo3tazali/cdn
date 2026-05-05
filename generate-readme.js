const fs = require("fs");
const path = require("path");
const {
  PROJECT_OWNER,
  PROJECT_REPO,
  PROJECT_BRANCH,
  ROOT_DIR,
  README_FILE,
  RAW_GITHACK_BASE,
  IGNORE_FILES,
} = require("./cdn.constants");

function shouldIgnore(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (!normalized || normalized === ".") return true;
  const topLevel = normalized.split("/")[0];
  return IGNORE_FILES.has(normalized) || IGNORE_FILES.has(topLevel);
}

function collectFiles(dir, root, result) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(root, fullPath).replace(/\\/g, "/");

    if (shouldIgnore(relativePath)) continue;

    if (entry.isDirectory()) {
      collectFiles(fullPath, root, result);
      continue;
    }

    result.push(relativePath);
  }
}

function normalizeFileNames(dir, root) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(root, fullPath).replace(/\\/g, "/");

    if (shouldIgnore(relativePath)) continue;

    if (entry.isDirectory()) {
      normalizeFileNames(fullPath, root);
      continue;
    }

    const normalizedName = entry.name.replace(/\s+/g, "-");
    if (normalizedName === entry.name) continue;

    const renamedFullPath = path.join(dir, normalizedName);
    if (fs.existsSync(renamedFullPath)) {
      console.warn(
        `Skip rename for "${relativePath}" because "${path
          .relative(root, renamedFullPath)
          .replace(/\\/g, "/")}" already exists.`
      );
      continue;
    }

    fs.renameSync(fullPath, renamedFullPath);
    console.log(
      `Renamed: ${relativePath} -> ${path
        .relative(root, renamedFullPath)
        .replace(/\\/g, "/")}`
    );
  }
}

function encodePathForUrl(relativePath) {
  return relativePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function buildReadme(files) {
  const sorted = [...files].sort((a, b) => a.localeCompare(b));
  const rows = sorted
    .map((filePath) => {
      const encodedPath = encodePathForUrl(filePath);
      const cdnUrl = `${RAW_GITHACK_BASE}/${encodedPath}`;
      return `| \`${filePath}\` | [Direct Link](${cdnUrl}) |`;
    })
    .join("\n");

  return `# Public CDN Files

This repository is used as a **public CDN project** for hosting static files (images, fonts, and other assets).

## How CDN Links Are Built

Links are generated using:

\`${RAW_GITHACK_BASE}/<path-to-file>\`

Example:

\`https://raw.githack.com/${PROJECT_OWNER}/${PROJECT_REPO}/${PROJECT_BRANCH}/mesco-logo.png\`

## File Index

| File Path | Direct CDN URL |
| --- | --- |
${rows}

## Update This README

Run:

\`\`\`bash
node generate-readme.js
\`\`\`

This script scans project files and rewrites this README with updated direct CDN links.
`;
}

function main() {
  normalizeFileNames(ROOT_DIR, ROOT_DIR);
  const files = [];
  collectFiles(ROOT_DIR, ROOT_DIR, files);
  const readme = buildReadme(files);
  fs.writeFileSync(README_FILE, readme, "utf8");
  console.log(`README generated with ${files.length} CDN entries.`);
}

main();
