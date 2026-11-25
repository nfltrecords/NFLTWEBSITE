import { readFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
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
const archiveFiles = [];
function collectPreviewAssetFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", ".wrangler", ".vercel"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectPreviewAssetFiles(path);
    else {
      if (/_PREVIEW_30S\.(mp3|m4a|wav|aac)$/i.test(entry.name)) previewAssetFiles.push(path);
      if (/\.zip$/i.test(entry.name)) archiveFiles.push(path);
    }
  }
}
collectPreviewAssetFiles(".");

const previewArchiveEntries = [];
const archiveInspectionErrors = [];
const forbiddenArchiveEntryPatterns = [
  /_PREVIEW_30S\.(mp3|m4a|wav|aac)$/i,
  /(^|\/)(assets|public\/assets)\/previews\//i,
  /(^|\/)NFLT_PREVIEWS_30S\.zip$/i,
];
for (const archivePath of archiveFiles) {
  try {
    const listing = execFileSync("unzip", ["-Z1", archivePath], { encoding: "utf8" });
    for (const entry of listing.split(/\r?\n/).filter(Boolean)) {
      if (forbiddenArchiveEntryPatterns.some((pattern) => pattern.test(entry))) {
        previewArchiveEntries.push(`${archivePath}!${entry}`);
      }
    }
  } catch (error) {
    archiveInspectionErrors.push(`${archivePath}: ${error.message}`);
  }
}

const result = {
  catalogueReleases: upcs.length,
  coverFiles: coverFiles.length,
  missingCoverUPCs,
  forbiddenPreviewPaths,
  stalePreviewReferences,
  previewAssetFiles,
  archiveFiles,
  previewArchiveEntries,
  archiveInspectionErrors,
};
console.log(JSON.stringify(result, null, 2));

if (
  missingCoverUPCs.length ||
  coverFiles.length !== upcs.length ||
  forbiddenPreviewPaths.length ||
  stalePreviewReferences.length ||
  previewAssetFiles.length ||
  previewArchiveEntries.length ||
  archiveInspectionErrors.length
) {
  process.exitCode = 1;
}
