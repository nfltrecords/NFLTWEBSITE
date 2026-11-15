import { describe, expect, it } from "vitest";
import { configuredRadioStream, radioStation } from "@/lib/radio";

describe("Radio stream configuration", () => {
  it("leaves the station stream unconfigured", () => {
    expect(radioStation.streamUrl).toBeNull();
    expect(configuredRadioStream(radioStation.streamUrl)).toBeUndefined();
  });
  it("disables playback without a valid secure stream URL", () => {
    for (const value of [
      null,
      "",
      " ",
      "not-a-url",
      "http://example.com/stream",
      "javascript:alert(1)",
    ]) {
      expect(configuredRadioStream(value)).toBeUndefined();
    }
    expect(configuredRadioStream("https://example.com/stream")).toBe("https://example.com/stream");
  });
});

describe("Reserved internal radio fields", () => {
  it("keeps provider and now-playing metadata empty", () => {
    expect(radioStation.provider).toBeNull();
    expect(radioStation.nowPlayingUrl).toBeNull();
    expect(radioStation.nowPlaying).toEqual({ title: null, artist: null });
  });
});
