import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const catalogue = readFileSync("src/lib/catalogue.ts", "utf8");
const upcs = [...catalogue.matchAll(/upc: "(\\d+)"/g)].map((match) => match[1]);
const coverDir = "public/assets/covers";
const missingCoverUPCs = upcs.filter((upc) => !existsSync(join(coverDir, `cover-${upc}.jpg`)));
const coverFiles = readdirSync(coverDir).filter(
  (name) => name.startsWith("cover-") && name.endsWith(".jpg"),
);
const forbiddenPreviewPaths = [
  "public/assets/previews",
  "assets/previews",
  "src/lib/previews.ts",
  "src/components/ReleasePreview.tsx",
].filter((path) => existsSync(path));

const sourceFiles = [];
function collectSourceFiles(directory) {
  for (const name of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, name.name);
    if (name.isDirectory()) collectSourceFiles(path);
    else if (/\\.(?:ts|tsx|js|jsx|mjs)$/.test(name.name)) sourceFiles.push(path);
  }
}
collectSourceFiles("src");
const stalePreviewReferences = sourceFiles.filter((path) => {
  const source = readFileSync(path, "utf8");
  return source.includes("/assets/previews/") || source.includes("releasePreviews") || source.includes("ReleasePreview");
});

const result = {
  catalogueReleases: upcs.length,
  coverFiles: coverFiles.length,
  missingCoverUPCs,
  forbiddenPreviewPaths,
  stalePreviewReferences,
};
console.log(JSON.stringify(result, null, 2));

if (
  missingCoverUPCs.length ||
  coverFiles.length !== upcs.length ||
  forbiddenPreviewPaths.length ||
  stalePreviewReferences.length
) {
  process.exitCode = 1;
}
