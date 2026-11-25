import { describe, expect, it } from "vitest";
import {
  hasCompleteWavMasterSet,
  hasValidWavHeader,
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

describe("WAV file signature", () => {
  it("accepts RIFF and RF64 WAVE headers", () => {
    const riff = new Uint8Array(12);
    riff.set([82, 73, 70, 70], 0);
    riff.set([87, 65, 86, 69], 8);
    expect(hasValidWavHeader(riff)).toBe(true);
    riff.set([82, 70, 54, 52], 0);
    expect(hasValidWavHeader(riff)).toBe(true);
  });

  it("rejects renamed MP3/M4A files and truncated headers", () => {
    const fake = new Uint8Array(12);
    fake.set([73, 68, 51], 0);
    fake.set([77, 52, 65, 32], 8);
    expect(hasValidWavHeader(fake)).toBe(false);
    expect(hasValidWavHeader(new Uint8Array(11))).toBe(false);
  });
});
