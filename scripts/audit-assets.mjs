import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const catalogue = readFileSync("src/lib/catalogue.ts", "utf8");
const upcs = [...catalogue.matchAll(/upc: "([0-9]+)"/g)].map((match) => match[1]);
const coverDir = "public/assets/covers";
const missingCoverUPCs = upcs.filter((upc) => !existsSync(join(coverDir, `cover-${upc}.jpg`)));
const coverFiles = readdirSync(coverDir).filter(
  (name) => name.startsWith("cover-") && name.endsWith(".jpg"),
);
const forbiddenPreviewPaths = [
  "public/assets/previews",
  "assets/previews",
  "NFLT_PREVIEWS_30S.zip",
  "public/NFLT_PREVIEWS_30S.zip",
  "public/assets/NFLT_PREVIEWS_30S.zip",
  "src/components/PreviewLibrary.tsx",
  "src/routes/previews.tsx",
  "src/routes/en.previews.tsx",
  "src/lib/previews.ts",
  "src/components/ReleasePreview.tsx",
].filter((path) => existsSync(path));

const sourceFiles = [];
function collectSourceFiles(directory) {
  for (const name of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, name.name);
    if (name.isDirectory()) collectSourceFiles(path);
    else if (
      [".ts", ".tsx", ".js", ".jsx", ".mjs"].some((extension) => name.name.endsWith(extension))
    ) {
      sourceFiles.push(path);
    }
  }
}
collectSourceFiles("src");
const stalePreviewReferences = sourceFiles.filter((path) => {
  const source = readFileSync(path, "utf8");
  return (
    source.includes("/assets/previews/") ||
    source.includes("releasePreviews") ||
    source.includes("ReleasePreview") ||
    source.includes("PreviewLibrary")
  );
});

const previewAssetFiles = [];
function collectPreviewAssetFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", ".wrangler", ".vercel"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectPreviewAssetFiles(path);
    else if (/_PREVIEW_30S\\.(mp3|m4a|wav|aac)$/i.test(entry.name)) previewAssetFiles.push(path);
  }
}
collectPreviewAssetFiles(".");

const result = {
  catalogueReleases: upcs.length,
  coverFiles: coverFiles.length,
  missingCoverUPCs,
  forbiddenPreviewPaths,
  stalePreviewReferences,
  previewAssetFiles,
};
console.log(JSON.stringify(result, null, 2));

if (
  missingCoverUPCs.length ||
  coverFiles.length !== upcs.length ||
  forbiddenPreviewPaths.length ||
  stalePreviewReferences.length ||
  previewAssetFiles.length
) {
  process.exitCode = 1;
}
