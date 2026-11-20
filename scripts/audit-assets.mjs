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
      duplicatePreviewFiles,
      previewSizeRangeBytes,
      routeFiles: routeFiles.length,
      testFiles: testFiles.length,
    },
    null,
    2,
  ),
);

if (missing.length || covers.length !== upcs.length) process.exitCode = 1;
