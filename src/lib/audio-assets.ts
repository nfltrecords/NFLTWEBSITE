export function isWavMasterFileName(fileName: string): boolean {
  return /\.wav(?:\s*\(\d+\))?$/i.test(fileName);
}

export function safeWavDownloadName(fileName: string): string {
  const normalized = fileName.replace(/\.wav\s*\((\d+)\)$/i, "-$1.wav");
  return normalized.replace(/[^A-Za-z0-9._-]+/g, "-");
}

export function hasCompleteWavMasterSet(
  fileNames: readonly string[],
  expectedTrackCount: number,
): boolean {
  if (!Number.isSafeInteger(expectedTrackCount) || expectedTrackCount < 1) return false;
  const wavNames = fileNames
    .filter(isWavMasterFileName)
    .map((fileName) => fileName.trim().toLowerCase());
  return wavNames.length === expectedTrackCount && new Set(wavNames).size === expectedTrackCount;
}
