/** Keep private message retrieval disabled unless explicitly enabled on the server. */
export function adminMessagesAreEnabled(
  enabled = process.env["ADMIN_MESSAGES_ENABLED"],
  code = process.env["ADMIN_MESSAGES_CODE"],
): boolean {
  return enabled === "true" && typeof code === "string" && code.trim().length >= 24;
}

/** Compare the submitted access code without leaking its first differing byte. */
export async function matchesAdminMessagesCode(
  submitted: string,
  expected: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(submitted)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}
