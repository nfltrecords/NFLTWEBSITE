import { describe, expect, it } from "vitest";
import { adminMessagesAreEnabled, matchesAdminMessagesCode } from "@/lib/admin-messages-gate";

describe("private message access gate", () => {
  it("is closed by default", () => {
    expect(adminMessagesAreEnabled(undefined, undefined)).toBe(false);
  });
  it("requires an exact explicit server enablement flag", () => {
    expect(adminMessagesAreEnabled("TRUE", "a".repeat(32))).toBe(false);
    expect(adminMessagesAreEnabled("false", "a".repeat(32))).toBe(false);
  });
  it("requires a long server-side access code", () => {
    expect(adminMessagesAreEnabled("true", undefined)).toBe(false);
    expect(adminMessagesAreEnabled("true", "short")).toBe(false);
    expect(adminMessagesAreEnabled("true", "a".repeat(23))).toBe(false);
  });
  it("opens only when explicitly enabled with a code of at least 24 characters", () => {
    expect(adminMessagesAreEnabled("true", "a".repeat(24))).toBe(true);
  });
});

describe("private message access code comparison", () => {
  it("accepts the exact submitted code", async () => {
    expect(await matchesAdminMessagesCode("CaseSensitive-Secret-123", "CaseSensitive-Secret-123")).toBe(true);
  });
  it("rejects a different code including a case-only difference", async () => {
    expect(await matchesAdminMessagesCode("CaseSensitive-Secret-123", "casesensitive-secret-123")).toBe(false);
  });
});
