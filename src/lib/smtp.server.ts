import { connect } from "cloudflare:sockets";
import { env } from "cloudflare:workers";
import { buildEmailMessage, encodeBase64Utf8, isSafeEmailAddress } from "@/lib/email-message";

type SmtpEnvironment = {
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_FROM?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  from: string;
  user: string;
  password: string;
};

function getSmtpConfig(): SmtpConfig | null {
  const settings = env as unknown as SmtpEnvironment;
  const host = (settings.SMTP_HOST ?? "mail.nflt-records.com").trim();
  const port = Number(settings.SMTP_PORT ?? "465");
  const from = (settings.SMTP_FROM ?? "nflt-records@nflt-records.com").trim();
  const user = (settings.SMTP_USER ?? from).trim();
  const password = settings.SMTP_PASSWORD ?? "";

  if (
    !host ||
    port !== 465 ||
    !isSafeEmailAddress(from) ||
    !isSafeEmailAddress(user) ||
    !password ||
    /[\r\n]/.test(password)
  ) {
    return null;
  }

  return { host, port, from, user, password };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

class SmtpSession {
  private readonly reader: ReadableStreamDefaultReader<Uint8Array>;
  private readonly writer: WritableStreamDefaultWriter<Uint8Array>;
  private readonly decoder = new TextDecoder();
  private buffer = "";

  constructor(private readonly socket: ReturnType<typeof connect>) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  private async readLine(): Promise<string> {
    while (true) {
      const end = this.buffer.indexOf("\r\n");
      if (end >= 0) {
        const line = this.buffer.slice(0, end);
        this.buffer = this.buffer.slice(end + 2);
        return line;
      }

      const { value, done } = await this.reader.read();
      if (done || !value) throw new Error("SMTP connection closed");
      this.buffer += this.decoder.decode(value, { stream: true });
      if (this.buffer.length > 65536) throw new Error("SMTP response too large");
    }
  }

  private async readResponse(): Promise<{ code: number; lines: string[] }> {
    const lines: string[] = [];
    let responseCode: number | null = null;

    while (true) {
      const line = await this.readLine();
      const match = /^(\d{3})([ -])/.exec(line);
      if (!match) throw new Error("Invalid SMTP response");
      const code = Number(match[1]);
      if (responseCode === null) responseCode = code;
      if (code !== responseCode) throw new Error("Inconsistent SMTP response");
      lines.push(line);
      if (match[2] === " ") return { code, lines };
    }
  }

  async expect(codes: number[], label: string): Promise<void> {
    const response = await this.readResponse();
    if (!codes.includes(response.code)) {
      throw new Error(`SMTP ${label} failed (${response.code})`);
    }
  }

  async command(command: string, codes: number[], label: string): Promise<void> {
    await this.writer.write(new TextEncoder().encode(command + "\r\n"));
    await this.expect(codes, label);
  }

  async sendData(message: string): Promise<void> {
    const safeMessage = message.replace(/(^|\r\n)\./g, "$1..");
    await this.writer.write(new TextEncoder().encode(safeMessage + "\r\n.\r\n"));
    await this.expect([250], "DATA");
  }

  async close(): Promise<void> {
    try {
      this.reader.releaseLock();
    } catch {
      // The stream may already be closed.
    }
    try {
      this.writer.releaseLock();
    } catch {
      // The stream may already be closed.
    }
    try {
      await this.socket.close();
    } catch {
      // Closing a completed SMTP session is best-effort.
    }
  }
}

export async function sendTransactionalEmail(
  to: string,
  subject: string,
  body: string,
  messageId?: string,
): Promise<void> {
  const config = getSmtpConfig();
  if (!config) throw new Error("SMTP is not configured");
  if (!isSafeEmailAddress(to)) throw new Error("Invalid recipient email");

  const socket = connect(
    { hostname: config.host, port: config.port },
    { secureTransport: "on" as const },
  );
  const session = new SmtpSession(socket);

  try {
    await session.expect([220], "greeting");
    await session.command("EHLO nflt-records.com", [250], "EHLO");
    await session.command("AUTH LOGIN", [334], "AUTH");
    await session.command(encodeBase64Utf8(config.user), [334], "username");
    await session.command(encodeBase64Utf8(config.password), [235], "authentication");
    await session.command(`MAIL FROM:<${config.from}>`, [250], "MAIL FROM");
    await session.command(`RCPT TO:<${to}>`, [250, 251], "RCPT TO");
    await session.command("DATA", [354], "DATA");

    const message = buildEmailMessage({
      from: config.from,
      to,
      subject,
      body,
      messageId: messageId ?? `${crypto.randomUUID()}@nflt-records.com`,
      date: new Date().toUTCString(),
    });
    await session.sendData(message);

    try {
      await session.command("QUIT", [221], "QUIT");
    } catch {
      // The message has already been accepted by the SMTP server.
    }
  } finally {
    await session.close();
  }
}
