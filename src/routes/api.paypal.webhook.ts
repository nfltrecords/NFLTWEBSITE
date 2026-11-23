import { createFileRoute } from "@tanstack/react-router";
import { verifyPayPalWebhook } from "@/lib/paypal.server";
import { sendPaidOrderDelivery } from "@/lib/delivery.server";

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    amount?: { value?: string; currency_code?: string };
    supplementary_data?: { related_ids?: { order_id?: string } };
  };
};

function databaseConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Private order storage is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}

async function databaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = databaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Private order storage failed (HTTP ${response.status}).`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function requiredHeader(request: Request, name: string): string {
  const value = request.headers.get(name);
  if (!value || value.length > 4096) throw new Error(`Missing or invalid ${name}.`);
  return value;
}

async function handleWebhook(request: Request): Promise<Response> {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return new Response("Unsupported media type", { status: 415 });
  }

  const rawBody = await request.text();
  if (!rawBody || new TextEncoder().encode(rawBody).byteLength > 1_000_000) {
    return new Response("Invalid payload size", { status: 413 });
  }

  let event: PayPalWebhookEvent;
  try {
    event = JSON.parse(rawBody) as PayPalWebhookEvent;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!event.id || event.id.length > 128 || !event.event_type) {
    return new Response("Invalid webhook event", { status: 400 });
  }

  const certUrl = requiredHeader(request, "paypal-cert-url");
  const cert = new URL(certUrl);
  if (
    cert.protocol !== "https:" ||
    !(cert.hostname === "paypal.com" || cert.hostname.endsWith(".paypal.com"))
  ) {
    return new Response("Invalid PayPal certificate URL", { status: 400 });
  }

  let verified = false;
  try {
    verified = await verifyPayPalWebhook({
      transmissionId: requiredHeader(request, "paypal-transmission-id"),
      transmissionTime: requiredHeader(request, "paypal-transmission-time"),
      transmissionSignature: requiredHeader(request, "paypal-transmission-sig"),
      certUrl,
      authAlgorithm: requiredHeader(request, "paypal-auth-algo"),
      webhookEventRaw: rawBody,
    });
  } catch (error) {
    console.error("PayPal webhook verification error", error);
    return new Response("Webhook verification unavailable", { status: 503 });
  }
  if (!verified) return new Response("Invalid webhook signature", { status: 400 });

  // Insert first with conflict-ignore. A repeated delivery is harmless; an unprocessed
  // event may be retried after a transient database failure.
  const inserted = await databaseRequest<Array<{ event_id: string }>>("paypal_webhook_events", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({
      event_id: event.id,
      event_type: event.event_type,
      payload: event,
    }),
  });

  if (!inserted.length) {
    const existing = await databaseRequest<Array<{ processed_at: string | null }>>(
      `paypal_webhook_events?event_id=eq.${encodeURIComponent(event.id)}&select=processed_at&limit=1`,
    );
    if (existing[0]?.processed_at) return Response.json({ received: true, duplicate: true });
  }

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const capture = event.resource;
    const paypalOrderId = capture?.supplementary_data?.related_ids?.order_id;
    const captureId = capture?.id;
    const amountValue = capture?.amount?.value;
    const amount = typeof amountValue === "string" ? Number(amountValue) : NaN;

    if (
      !paypalOrderId ||
      !captureId ||
      capture?.status !== "COMPLETED" ||
      capture.amount?.currency_code !== "EUR" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return new Response("Invalid completed capture details", { status: 400 });
    }

    const orders = await databaseRequest<
      Array<{
        id: string;
        amount_cents: number;
        status: string;
        paypal_capture_id: string | null;
      }>
    >(
      `shop_orders?paypal_order_id=eq.${encodeURIComponent(paypalOrderId)}&select=id,amount_cents,status,paypal_capture_id&limit=1`,
    );
    const order = orders[0];
    if (!order) {
      // A verified capture can arrive before the order row is visible. Return a retryable
      // server error so PayPal redelivers instead of acknowledging an unprocessed payment.
      return new Response("Order not found yet; retry delivery", { status: 503 });
    }
    if (Math.round(amount * 100) !== order.amount_cents) {
      return new Response("Capture amount mismatch", { status: 400 });
    }

    if (order.status !== "paid") {
      const updated = await databaseRequest<Array<{ id: string }>>(
        `shop_orders?id=eq.${order.id}&status=eq.pending&paypal_order_id=eq.${encodeURIComponent(paypalOrderId)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            status: "paid",
            paypal_capture_id: captureId,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        },
      );
      if (!updated.length) {
        const latest = await databaseRequest<
          Array<{ status: string; paypal_capture_id: string | null }>
        >(`shop_orders?id=eq.${order.id}&select=status,paypal_capture_id&limit=1`);
        if (latest[0]?.status !== "paid" || latest[0]?.paypal_capture_id !== captureId) {
          return new Response("Order state conflict", { status: 409 });
        }
      }
    } else if (order.paypal_capture_id !== captureId) {
      return new Response("Conflicting capture for paid order", { status: 409 });
    }

    // Delivery is idempotent and only starts after the capture is confirmed and persisted.
    await sendPaidOrderDelivery(order.id);
  }

  await databaseRequest<unknown>(
    `paypal_webhook_events?event_id=eq.${encodeURIComponent(event.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ processed_at: new Date().toISOString() }),
    },
  );

  return Response.json({ received: true });
}

export const Route = createFileRoute("/api/paypal/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          return await handleWebhook(request);
        } catch (error) {
          console.error("PayPal webhook processing failed", error);
          return new Response("Webhook processing failed", { status: 503 });
        }
      },
    },
  },
});
