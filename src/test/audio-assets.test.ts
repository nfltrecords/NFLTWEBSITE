import { describe, expect, it } from "vitest";
import { isWavMasterFileName, safeWavDownloadName } from "@/lib/audio-assets";

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
});
