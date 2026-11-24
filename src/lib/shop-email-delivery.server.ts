import { releases } from "@/lib/catalogue";
import { parsePayPalOrderManifest } from "@/lib/paypal-ipn";
import { getCompleteWavTracks } from "@/lib/delivery.server";
import { getShopOrder, shopEnv } from "@/lib/shop-db.server";
import { isSmtpConfigured, sendTransactionalEmail } from "@/lib/smtp.server";

export type ShopEmailDeliveryStatus = "pending" | "sending" | "sent";

export type ShopEmailDelivery = {
  order_id: string;
  recipient_email: string;
  status: ShopEmailDeliveryStatus;
  attempts: number;
  last_error: string;
  last_attempt_at: string | null;
  sent_at: string | null;
};

export type SendOrderEmailResult = {
  status:
    | "sent"
    | "already_sent"
    | "not_paid"
    | "not_ready"
    | "not_configured"
    | "busy"
    | "retry";
  error?: string;
};

export async function getShopEmailDelivery(orderId: string): Promise<ShopEmailDelivery | null> {
  return (
    (await shopEnv.DB.prepare(
      "SELECT order_id, recipient_email, status, attempts, last_error, last_attempt_at, sent_at FROM shop_email_deliveries WHERE order_id = ?",
    )
      .bind(orderId)
      .first<ShopEmailDelivery>()) ?? null
  );
}

async function ensureShopEmailDelivery(orderId: string, recipientEmail: string): Promise<void> {
  await shopEnv.DB.prepare(
    "INSERT OR IGNORE INTO shop_email_deliveries (order_id, recipient_email, status) VALUES (?, ?, 'pending')",
  )
    .bind(orderId, recipientEmail)
    .run();
}

async function claimShopEmailDelivery(orderId: string): Promise<boolean> {
  const result = await shopEnv.DB.prepare(
    "UPDATE shop_email_deliveries SET status = 'sending', attempts = attempts + 1, last_attempt_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, last_error = '' WHERE order_id = ? AND (status = 'pending' OR (status = 'sending' AND (last_attempt_at IS NULL OR last_attempt_at < datetime('now', '-10 minutes'))))",
  )
    .bind(orderId)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

async function markShopEmailSent(orderId: string): Promise<void> {
  await shopEnv.DB.prepare(
    "UPDATE shop_email_deliveries SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, last_error = '' WHERE order_id = ? AND status = 'sending'",
  )
    .bind(orderId)
    .run();
}

async function markShopEmailPending(orderId: string, error: string): Promise<void> {
  await shopEnv.DB.prepare(
    "UPDATE shop_email_deliveries SET status = 'pending', updated_at = CURRENT_TIMESTAMP, last_error = ? WHERE order_id = ? AND status = 'sending'",
  )
    .bind(error.slice(0, 200), orderId)
    .run();
}

async function prepareOrderEmail(orderId: string) {
  const order = await getShopOrder(orderId);
  if (!order || order.status !== "paid") return null;

  const items = parsePayPalOrderManifest(order.release_upc);
  if (!items.length) return null;

  const trackSets = await Promise.all(items.map((item) => getCompleteWavTracks(item.upc)));
  if (trackSets.some((tracks) => !tracks)) return null;

  return { order, items };
}

export async function sendOrderEmailForOrder(
  orderId: string,
  forceResend = false,
): Promise<SendOrderEmailResult> {
  const prepared = await prepareOrderEmail(orderId);
  if (!prepared) {
    const order = await getShopOrder(orderId);
    return { status: order?.status === "paid" ? "not_ready" : "not_paid" };
  }

  const { order, items } = prepared;
  await ensureShopEmailDelivery(order.id, order.buyer_email);

  if (!isSmtpConfigured()) return { status: "not_configured" };

  if (forceResend) {
    await shopEnv.DB.prepare(
      "UPDATE shop_email_deliveries SET status = 'pending', updated_at = CURRENT_TIMESTAMP, last_error = '' WHERE order_id = ? AND status = 'sent'",
    )
      .bind(order.id)
      .run();
  }

  const claimed = await claimShopEmailDelivery(order.id);
  if (!claimed) {
    const existing = await getShopEmailDelivery(order.id);
    return { status: existing?.status === "sent" ? "already_sent" : "busy" };
  }

  try {
    const itemLines = items.map((item) => {
      const title = releases.find((release) => release.upc === item.upc)?.title ?? item.upc;
      return `- ${title} × ${item.quantity}`;
    });
    const amount = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: order.currency,
    }).format(order.amount_cents / 100);
    const link = `https://nflt-records.com/commande/confirmation?order=${encodeURIComponent(order.id)}`;
    const body = [
      "NFLT RECORDS — Confirmation de commande",
      "",
      "Bonjour,",
      "Votre paiement a été confirmé.",
      `Commande : ${order.id}`,
      `Montant : ${amount}`,
      "Articles :",
      ...itemLines,
      "",
      "Accédez à vos téléchargements sécurisés :",
      link,
      "",
      "Le lien donne accès aux masters WAV complets de votre commande. Les fichiers de préécoute ne sont pas livrés.",
      "Conservez ce message pour retrouver votre commande.",
      "",
      "— NFLT RECORDS",
      "",
      "ENGLISH",
      "Your payment has been confirmed. Use the secure link above to access the complete WAV masters in your order.",
      "",
      "Support : nfltrecords@nflt-records.com",
    ].join("\r\n");

    await sendTransactionalEmail(
      order.buyer_email,
      "Votre commande NFLT RECORDS est confirmée / Order confirmed",
      body,
      `${order.id}@nflt-records.com`,
    );
    await markShopEmailSent(order.id);
    return { status: "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message.replace(/[\r\n]/g, " ") : "SMTP delivery failed";
    await markShopEmailPending(order.id, message);
    return { status: "retry", error: message.slice(0, 200) };
  }
}
