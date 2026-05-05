const path = require("path");

const PROJECT_OWNER = "moo3tazali";
const PROJECT_REPO = "cdn";
const PROJECT_BRANCH = "main";

const ROOT_DIR = __dirname;
const README_FILE = path.join(ROOT_DIR, "README.md");

const RAW_GITHACK_BASE = `https://raw.githack.com/${PROJECT_OWNER}/${PROJECT_REPO}/${PROJECT_BRANCH}`;

const IGNORE_FILES = new Set([
  ".git",
  "README.md",
  "cdn.constants.js",
  "generate-readme.js",
  "package.json",
  "package-lock.json",
]);

module.exports = {
  PROJECT_OWNER,
  PROJECT_REPO,
  PROJECT_BRANCH,
  ROOT_DIR,
  README_FILE,
  RAW_GITHACK_BASE,
  IGNORE_FILES,
};
