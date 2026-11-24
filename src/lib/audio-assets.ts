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
  return fileNames.filter(isWavMasterFileName).length === expectedTrackCount;
}
