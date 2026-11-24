import { describe, expect, it } from "vitest";
import {
  buildEmailMessage,
  encodeBase64Utf8,
  isSafeEmailAddress,
  wrapBase64,
} from "@/lib/email-message";

describe("email message encoding", () => {
  it("builds a UTF-8 MIME message with safe headers and wrapped body", () => {
    const message = buildEmailMessage({
      from: "nflt-records@nflt-records.com",
      to: "buyer@example.com",
      subject: "Votre commande NFLT RECORDS est confirmée",
      body: "Bonjour,\r\nVotre téléchargement est prêt.",
      messageId: "order-123@nflt-records.com",
      date: "Tue, 24 Nov 2026 19:00:00 GMT",
    });

    expect(message).toContain("From: NFLT RECORDS <nflt-records@nflt-records.com>");
    expect(message).toContain("To: <buyer@example.com>");
    expect(message).toContain("Subject: =?UTF-8?B?");
    expect(message).toContain("Content-Transfer-Encoding: base64");
    expect(message).toContain(encodeBase64Utf8("Bonjour,\r\nVotre téléchargement est prêt."));
  });

  it("wraps base64 at the requested line width", () => {
    expect(wrapBase64("abcdefghijklmnopqrstuvwxyz", 10)).toBe("abcdefghij\r\nklmnopqrst\r\nuvwxyz");
  });

  it("rejects unsafe email addresses and header injection", () => {
    expect(isSafeEmailAddress("buyer@example.com")).toBe(true);
    expect(isSafeEmailAddress("buyer@example.com\r\nBcc:attacker@example.com")).toBe(false);
    expect(() =>
      buildEmailMessage({
        from: "nflt-records@nflt-records.com",
        to: "buyer@example.com",
        subject: "OK\r\nBcc:attacker@example.com",
        body: "test",
        messageId: "id@nflt-records.com",
        date: "Tue, 24 Nov 2026 19:00:00 GMT",
      }),
    ).toThrow("Invalid email header");
  });
});
