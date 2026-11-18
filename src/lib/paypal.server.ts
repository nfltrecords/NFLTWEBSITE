type PayPalEnvironment = "sandbox" | "live";

type PayPalToken = {
  access_token: string;
  expires_in: number;
};

type PayPalApiError = {
  message?: string;
  name?: string;
  details?: Array<{ description?: string; issue?: string }>;
};

export type PayPalOrder = {
  id: string;
  status: string;
  links?: Array<{ href: string; rel: string; method: string }>;
  purchase_units?: Array<{
    custom_id?: string;
    amount?: { currency_code?: string; value?: string };
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount?: { currency_code?: string; value?: string };
      }>;
    };
  }>;
};

function paypalConfig() {
  const clientId = process.env["PAYPAL_CLIENT_ID"];
  const clientSecret = process.env["PAYPAL_CLIENT_SECRET"];
  const mode = process.env["PAYPAL_MODE"] ?? "sandbox";

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal is not configured: PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are required.",
    );
  }
  if (mode !== "sandbox" && mode !== "live") {
    throw new Error("PAYPAL_MODE must be sandbox or live.");
  }

  const environment: PayPalEnvironment = mode;
  return {
    clientId,
    clientSecret,
    baseUrl:
      environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com",
  };
}

async function paypalRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = paypalConfig();
  const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
  const tokenResponse = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!tokenResponse.ok) {
    throw new Error(`PayPal authentication failed (HTTP ${tokenResponse.status}).`);
  }
  const token = (await tokenResponse.json()) as PayPalToken;
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const details = (await response.json().catch(() => ({}))) as PayPalApiError;
    const issue = details.details?.[0]?.issue ?? details.name ?? "API_ERROR";
    throw new Error(`PayPal request failed (${response.status}: ${issue}).`);
  }
  return (await response.json()) as T;
}

/** Create an order only with a total calculated and validated by the server. */
export async function createPayPalOrder(input: {
  amountCents: number;
  currency: "EUR";
  reference: string;
  returnUrl: string;
  cancelUrl: string;
}): Promise<PayPalOrder> {
  if (!Number.isSafeInteger(input.amountCents) || input.amountCents < 1) {
    throw new Error("Invalid server-calculated order amount.");
  }
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(input.reference)) {
    throw new Error("Invalid order reference.");
  }
  for (const candidate of [input.returnUrl, input.cancelUrl]) {
    const url = new URL(candidate);
    if (
      url.protocol !== "https:" ||
      (url.hostname !== "nflt-records.com" && !url.hostname.endsWith(".nflt-records.com"))
    ) {
      throw new Error("Checkout return URLs must use the official NFLT RECORDS HTTPS domain.");
    }
  }

  return paypalRequest<PayPalOrder>("/v2/checkout/orders", {
    method: "POST",
    headers: { "PayPal-Request-Id": input.reference },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: input.reference,
          amount: {
            currency_code: input.currency,
            value: (input.amountCents / 100).toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: input.returnUrl,
            cancel_url: input.cancelUrl,
            user_action: "PAY_NOW",
          },
        },
      },
    }),
  });
}

/** Capture only after the application has loaded and matched its own pending order. */
export async function capturePayPalOrder(paypalOrderId: string): Promise<PayPalOrder> {
  if (!/^[A-Z0-9]{8,40}$/.test(paypalOrderId)) {
    throw new Error("Invalid PayPal order ID.");
  }
  return paypalRequest<PayPalOrder>(`/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: { "PayPal-Request-Id": `capture-${paypalOrderId}` },
    body: "{}",
  });
}

/** Verify a webhook with PayPal before accepting any event as payment evidence. */
export async function verifyPayPalWebhook(input: {
  transmissionId: string;
  transmissionTime: string;
  transmissionSignature: string;
  certUrl: string;
  authAlgorithm: string;
  webhookEventRaw: string;
}): Promise<boolean> {
  const webhookId = process.env["PAYPAL_WEBHOOK_ID"];
  if (!webhookId) throw new Error("PAYPAL_WEBHOOK_ID is required before webhook verification.");
  const result = await paypalRequest<{ verification_status?: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      // Keep the original event JSON bytes intact inside the verification request.
      // Re-stringifying a parsed event can change whitespace/escaping and invalidate verification.
      body: `${JSON.stringify({
        transmission_id: input.transmissionId,
        transmission_time: input.transmissionTime,
        transmission_sig: input.transmissionSignature,
        cert_url: input.certUrl,
        auth_algo: input.authAlgorithm,
        webhook_id: webhookId,
      }).slice(0, -1)},"webhook_event":${input.webhookEventRaw}}`,
    },
  );
  return result.verification_status === "SUCCESS";
}
