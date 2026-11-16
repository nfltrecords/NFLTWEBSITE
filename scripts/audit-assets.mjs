import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const catalogue = readFileSync('src/lib/catalogue.ts', 'utf8');
const upcs = [...catalogue.matchAll(/upc: "(\\d+)"/g)].map((m) => m[1]);
const coverDir = 'public/assets/covers';
const previewDir = 'public/assets/previews';
const missing = upcs.filter((upc) => !existsSync(join(coverDir, `cover-${upc}.jpg`)));
const covers = readdirSync(coverDir).filter((name) => name.startsWith('cover-') && name.endsWith('.jpg'));
const previews = readdirSync(previewDir).filter((name) => name.toLowerCase().endsWith('.mp3'));
const previewComponent = readFileSync('src/components/PreviewLibrary.tsx', 'utf8');
const listedPreviews = [...previewComponent.matchAll(/"\\/assets\\/previews\\/([^"]+\\.mp3)"/g)].map((m) => m[1]);
const missingPreviews = listedPreviews.filter((name) => !existsSync(join(previewDir, name)));
const unlistedPreviews = previews.filter((name) => !listedPreviews.includes(name));
const routeFiles = readdirSync('src/routes').filter((name) => name.endsWith('.tsx'));
const testFiles = readdirSync('src/test').filter((name) => name.includes('.test.'));

console.log(JSON.stringify({
  catalogueReleases: upcs.length,
  coverFiles: covers.length,
  missingCoverUPCs: missing,
  previewMP3Files: previews.length,
  listedPreviewMP3Files: listedPreviews.length,
  missingPreviews,
  unlistedPreviews,
  routeFiles: routeFiles.length,
  testFiles: testFiles.length,
}, null, 2));

if (missing.length || covers.length !== upcs.length || missingPreviews.length || unlistedPreviews.length || listedPreviews.length !== previews.length) process.exitCode = 1;
