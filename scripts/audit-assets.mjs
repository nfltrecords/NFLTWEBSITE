import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const catalogue = readFileSync("src/lib/catalogue.ts", "utf8");
const upcs = [...catalogue.matchAll(/upc: "(\d+)"/g)].map((m) => m[1]);
const coverDir = "public/assets/covers";
const previewDir = "public/assets/previews";
const missing = upcs.filter((upc) => !existsSync(join(coverDir, `cover-${upc}.jpg`)));
const covers = readdirSync(coverDir).filter(
  (name) => name.startsWith("cover-") && name.endsWith(".jpg"),
);
const previews = readdirSync(previewDir).filter((name) => name.toLowerCase().endsWith(".mp3"));
const previewMapSource = readFileSync("src/lib/previews.ts", "utf8");
const mappedPreviewPaths = [
  ...previewMapSource.matchAll(/"(\/assets\/previews\/[^"]+\.mp3)"/g),
].map((match) => match[1]);
const mappedPreviewUPCs = [
  ...previewMapSource.matchAll(/^\s*"([0-9]{12,14})":\s*\[/gm),
].map((match) => match[1]);
const mappedPreviewNames = new Set(mappedPreviewPaths.map((src) => src.split("/").at(-1)));
const unmappedPreviewFiles = previews.filter((name) => !mappedPreviewNames.has(name));
const duplicateMappedPreviewPaths = mappedPreviewPaths.filter(
  (src, index) => mappedPreviewPaths.indexOf(src) !== index,
);
const missingMappedPreviewFiles = mappedPreviewPaths.filter(
  (src) => !existsSync(join("public", src.slice(1))),
);

const previewHashes = new Map();
for (const name of previews) {
  const digest = createHash("sha256")
    .update(readFileSync(join(previewDir, name)))
    .digest("hex");
  const names = previewHashes.get(digest) ?? [];
  names.push(name);
  previewHashes.set(digest, names);
}
const duplicatePreviewFiles = [...previewHashes.values()].filter((names) => names.length > 1);
const previewSizes = previews.map((name) => readFileSync(join(previewDir, name)).byteLength);
const previewSizeRangeBytes = previewSizes.length
  ? { min: Math.min(...previewSizes), max: Math.max(...previewSizes) }
  : { min: 0, max: 0 };

const routeFiles = readdirSync("src/routes").filter((name) => name.endsWith(".tsx"));
const testFiles = readdirSync("src/test").filter((name) => name.includes(".test."));

console.log(
  JSON.stringify(
    {
      catalogueReleases: upcs.length,
      coverFiles: covers.length,
      missingCoverUPCs: missing,
      previewMP3Files: previews.length,
      mappedPreviewUPCs: mappedPreviewUPCs.length,
      mappedPreviewFiles: mappedPreviewPaths.length,
      missingMappedPreviewFiles,
      unmappedPreviewFiles,
      duplicateMappedPreviewPaths,
      duplicatePreviewFiles,
      previewSizeRangeBytes,
      routeFiles: routeFiles.length,
      testFiles: testFiles.length,
    },
    null,
    2,
  ),
);

if (
  missing.length ||
  covers.length !== upcs.length ||
  mappedPreviewUPCs.length !== upcs.length ||
  mappedPreviewPaths.length !== previews.length ||
  missingMappedPreviewFiles.length ||
  unmappedPreviewFiles.length ||
  duplicateMappedPreviewPaths.length
) {
  process.exitCode = 1;
}
