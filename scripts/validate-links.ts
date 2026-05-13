import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const markdownFiles = [
  "README.md",
  "polling-spec.md",
  "platform-independence.md",
  "references.md",
  "glossary.md",
  "FAQ.md",
];

const errors: string[] = [];
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const absolute = join(root, file);
  if (!existsSync(absolute)) {
    errors.push(`${file} is missing`);
    continue;
  }

  const text = readFileSync(absolute, "utf8");
  let match: RegExpExecArray | null;
  while ((match = markdownLinkPattern.exec(text)) !== null) {
    const rawTarget = match[1].trim();
    if (
      rawTarget.startsWith("http://") ||
      rawTarget.startsWith("https://") ||
      rawTarget.startsWith("mailto:") ||
      rawTarget.startsWith("#")
    ) {
      continue;
    }

    const [pathPart] = rawTarget.split("#");
    if (!pathPart) continue;
    const resolved = normalize(join(dirname(absolute), decodeURIComponent(pathPart)));
    if (!resolved.startsWith(root) || !existsSync(resolved)) {
      errors.push(`${file} links to missing local target: ${rawTarget}`);
      continue;
    }

    if (extname(resolved) === ".md" && !existsSync(resolved)) {
      errors.push(`${file} links to missing Markdown target: ${rawTarget}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Local Markdown links validate.");
