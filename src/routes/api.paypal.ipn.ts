import { createFileRoute } from "@tanstack/react-router";
import { getShopOrder, markShopOrderPaid } from "@/lib/shop-db.server";

async function handleIpn(request: Request): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/x-www-form-urlencoded"))
    return new Response("Unsupported media type", { status: 415 });
  const raw = await request.text();
  if (!raw || new TextEncoder().encode(raw).byteLength > 64_000)
    return new Response("Invalid IPN payload", { status: 413 });

  const verification = await fetch("https://ipnpb.paypal.com/cgi-bin/webscr", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "NFLT-RECORDS-IPN/1.0",
    },
    body: `cmd=_notify-validate&${raw}`,
  });
  if (!verification.ok) return new Response("PayPal verification unavailable", { status: 503 });
  if ((await verification.text()).trim() !== "VERIFIED")
    return new Response("Invalid PayPal notification", { status: 400 });

  const data = new URLSearchParams(raw);
  const reference = [data.get("custom"), data.get("invoice"), data.get("memo")]
    .map((value) => (value ?? "").trim().replace(/^NFLT(?: RECORDS)?\s*[:#-]\s*/i, ""))
    .find((value) => /^[0-9a-f-]{36}$/i.test(value));
  const orderId = reference ?? "";
  const transactionId = (data.get("txn_id") ?? "").trim();
  const receiver = (data.get("receiver_email") ?? data.get("business") ?? "").trim().toLowerCase();
  const amount = Number(data.get("mc_gross"));
  if (!orderId || !transactionId || transactionId.length > 128)
    return new Response("Missing order reference or transaction ID", { status: 400 });
  if (
    receiver !== "encoresarbakane@gmail.com" ||
    data.get("payment_status") !== "Completed" ||
    data.get("mc_currency") !== "EUR" ||
    !new Set(["send_money", "web_accept"]).has(data.get("txn_type") ?? "") ||
    !Number.isFinite(amount)
  ) {
    return new Response("Payment does not meet NFLT order requirements", { status: 400 });
  }

  const order = await getShopOrder(orderId);
  if (!order) return new Response("Order not found; PayPal may retry", { status: 503 });
  if (Math.round(amount * 100) !== order.amount_cents || order.currency !== "EUR")
    return new Response("Payment amount mismatch", { status: 400 });
  if (order.status === "paid") {
    if (order.paypal_transaction_id !== transactionId)
      return new Response("Conflicting payment transaction", { status: 409 });
  } else if (order.status === "pending") {
    const changed = await markShopOrderPaid(orderId, transactionId);
    if (!changed) {
      const latest = await getShopOrder(orderId);
      if (!latest || latest.status !== "paid" || latest.paypal_transaction_id !== transactionId)
        return new Response("Order state conflict; retry", { status: 503 });
    }
  } else {
    return new Response("Order is not payable", { status: 409 });
  }
  // The buyer retrieves the WAV on the confirmation page after this verified payment.
  return new Response("OK", { status: 200, headers: { "Cache-Control": "no-store" } });
}

export const Route = createFileRoute("/api/paypal/ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          return await handleIpn(request);
        } catch (error) {
          console.error("PayPal IPN processing failed", error);
          return new Response("IPN processing failed; retry", { status: 503 });
        }
      },
    },
  },
});
