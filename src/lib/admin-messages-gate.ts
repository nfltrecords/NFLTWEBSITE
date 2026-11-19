/** Keep private message retrieval disabled unless explicitly enabled on the server. */
export function adminMessagesAreEnabled(
  enabled = process.env["ADMIN_MESSAGES_ENABLED"],
  code = process.env["ADMIN_MESSAGES_CODE"],
): boolean {
  return enabled === "true" && typeof code === "string" && code.trim().length >= 24;
}
