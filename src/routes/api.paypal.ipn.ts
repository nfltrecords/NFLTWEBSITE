import { createFileRoute } from "@tanstack/react-router";
import {
  getShopOrder,
  getShopOrderByTransactionId,
  markShopOrderPaid,
  markShopOrderRefunded,
  restoreShopOrderPaid,
} from "@/lib/shop-db.server";
import {
  isFullRefundAmount,
  matchesPayPalCart,
  parsePayPalOrderManifest,
} from "@/lib/paypal-ipn";

function acknowledgeIpn(): Response {
  return new Response("OK", { headers: { "Cache-Control": "no-store" } });
}

async function processIpn(request: Request): Promise<Response> {
  const raw = await request.text();
  if (!raw || raw.length > 64000) return acknowledgeIpn();

  const verify = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "cmd=_notify-validate&" + raw,
  });
  if (!verify.ok) return new Response("PayPal unavailable", { status: 503 });
  if ((await verify.text()).trim() !== "VERIFIED") return acknowledgeIpn();

  const data = new URLSearchParams(raw);
  const receiver = (data.get("receiver_email") ?? data.get("business") ?? "").trim().toLowerCase();
  const currency = data.get("mc_currency");
  const paymentStatus = data.get("payment_status");

  if (receiver !== "encoresarbakane@gmail.com" || currency !== "EUR") {
    return acknowledgeIpn();
  }

  const parentTransactionId = (data.get("parent_txn_id") ?? "").trim();
  if (paymentStatus === "Refunded" || paymentStatus === "Reversed") {
    if (!parentTransactionId) return acknowledgeIpn();
    const originalOrder = await getShopOrderByTransactionId(parentTransactionId);
    if (!originalOrder) return acknowledgeIpn();

    if (
      paymentStatus === "Reversed" ||
      isFullRefundAmount(data.get("mc_gross"), originalOrder.amount_cents)
    ) {
      await markShopOrderRefunded(parentTransactionId);
    } else {
      console.warn("Partial PayPal refund requires manual review", parentTransactionId);
    }
    return acknowledgeIpn();
  }

  if (paymentStatus === "Canceled_Reversal") {
    if (!parentTransactionId) return acknowledgeIpn();
    await restoreShopOrderPaid(parentTransactionId);
    return acknowledgeIpn();
  }

  const id =
    [data.get("custom"), data.get("invoice")].find(
      (value) => !!value && /^[0-9a-f-]{36}$/i.test(value),
    ) ?? "";
  const transactionId = (data.get("txn_id") ?? "").trim();
  const amount = Number(data.get("mc_gross"));

  if (
    !id ||
    !transactionId ||
    paymentStatus !== "Completed" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return acknowledgeIpn();
  }

  const order = await getShopOrder(id);
  if (!order) return acknowledgeIpn();

  const expectedItems = parsePayPalOrderManifest(order.release_upc);
  if (!matchesPayPalCart(data, expectedItems)) return acknowledgeIpn();
  if (Math.round(amount * 100) !== order.amount_cents || order.currency !== "EUR") {
    return acknowledgeIpn();
  }

  const transactionOwner = await getShopOrderByTransactionId(transactionId);
  if (transactionOwner && transactionOwner.id !== id) return acknowledgeIpn();

  if (order.status === "paid") {
    return acknowledgeIpn();
  }
  if (order.status !== "pending") return acknowledgeIpn();

  let changed = false;
  try {
    changed = await markShopOrderPaid(id, transactionId);
  } catch (error) {
    const owner = await getShopOrderByTransactionId(transactionId);
    if (owner && owner.id !== id) return acknowledgeIpn();
    throw error;
  }

  if (!changed) {
    const latest = await getShopOrder(id);
    if (latest?.status === "paid" && latest.paypal_transaction_id === transactionId) {
      return acknowledgeIpn();
    }
    const owner = await getShopOrderByTransactionId(transactionId);
    if (owner && owner.id !== id) return acknowledgeIpn();
    return new Response("Retry", { status: 503 });
  }

  return acknowledgeIpn();
}

export const Route = createFileRoute("/api/paypal/ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          return await processIpn(request);
        } catch (error) {
          console.error("IPN failed", error);
          return new Response("Retry", { status: 503 });
        }
      },
    },
  },
});
