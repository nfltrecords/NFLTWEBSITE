import { describe, expect, it } from "vitest";
import {
  hasCompleteWavMasterSet,
  isWavMasterFileName,
  safeWavDownloadName,
} from "@/lib/audio-assets";

describe("WAV master filenames", () => {
  it("accepts standard WAV names and R2 duplicate-suffix names", () => {
    expect(isWavMasterFileName("Calamite.wav")).toBe(true);
    expect(isWavMasterFileName("medley.wav (1)")).toBe(true);
  });

  it("does not accept M4A previews", () => {
    expect(isWavMasterFileName("Dilemma.m4a")).toBe(false);
  });

  it("normalizes the download name to a valid WAV filename", () => {
    expect(safeWavDownloadName("medley.wav (1)")).toBe("medley-1.wav");
  });

  it("requires every expected track to have a WAV master", () => {
    expect(hasCompleteWavMasterSet(["a.wav", "b.wav (1)"], 2)).toBe(true);
    expect(hasCompleteWavMasterSet(["a.wav"], 2)).toBe(false);
    expect(hasCompleteWavMasterSet(["a.wav", "b.m4a"], 2)).toBe(false);
    expect(hasCompleteWavMasterSet(["a.wav"], 0)).toBe(false);
    expect(hasCompleteWavMasterSet(["a.wav", "A.WAV"], 2)).toBe(false);
  });
});
