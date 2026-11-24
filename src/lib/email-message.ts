export type EmailMessageInput = {
  from: string;
  to: string;
  subject: string;
  body: string;
  messageId: string;
  date: string;
};

export function isSafeEmailAddress(value: string): boolean {
  return value.length <= 254 && !/[\r\n<>\s]/.test(value) && /^[^@]+@[^@]+\.[^@]+$/.test(value);
}

export function encodeBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

export function wrapBase64(value: string, width = 76): string {
  return value.match(new RegExp(`.{1,${width}}`, "g"))?.join("\r\n") ?? "";
}

export function buildEmailMessage(input: EmailMessageInput): string {
  if (!isSafeEmailAddress(input.from) || !isSafeEmailAddress(input.to)) {
    throw new Error("Invalid email address");
  }
  if (
    !input.subject ||
    input.subject.length > 200 ||
    /[\r\n]/.test(input.subject) ||
    /[\r\n]/.test(input.messageId)
  ) {
    throw new Error("Invalid email header");
  }

  const encodedSubject = `=?UTF-8?B?${encodeBase64Utf8(input.subject)}?=`;
  const encodedBody = wrapBase64(encodeBase64Utf8(input.body));
  return [
    `From: NFLT RECORDS <${input.from}>`,
    `To: <${input.to}>`,
    `Subject: ${encodedSubject}`,
    `Date: ${input.date}`,
    `Message-ID: <${input.messageId}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    encodedBody,
  ].join("\r\n");
}
