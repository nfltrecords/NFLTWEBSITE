import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { releases } from "@/lib/catalogue";
import { releasePriceCents } from "@/lib/commerce";
import { shopEnv } from "@/lib/shop-db.server";
import { payPalCheckoutIsEnabled } from "@/lib/paypal-checkout-gate";

const orderInput = z
  .object({
    items: z
      .array(
        z
          .object({
            upc: z.string().regex(/^\d{12,14}$/),
            quantity: z.number().int().min(1).max(20),
          })
          .strict(),
      )
      .min(1)
      .max(18),
    email: z.string().trim().email().max(255),
  })
  .strict();

export const createManualPayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderInput.parse(input))
  .handler(async ({ data }) => {
    if (!payPalCheckoutIsEnabled()) return { ok: false as const };
    const unique = new Map<string, number>();
    for (const item of data.items) {
      unique.set(item.upc, (unique.get(item.upc) ?? 0) + item.quantity);
    }
    if ([...unique.values()].some((quantity) => quantity > 20)) return { ok: false as const };
    const items = [...unique.entries()].map(([upc, quantity]) => {
      const release = releases.find((entry) => entry.upc === upc);
      const cents = releasePriceCents(upc);
      return release && cents !== null ? { upc, quantity, cents, title: release.title } : null;
    });
    if (items.some((item) => item === null)) return { ok: false as const };
    const validItems = items as { upc: string; quantity: number; cents: number; title: string }[];
    const totalCents = validItems.reduce((sum, item) => sum + item.cents * item.quantity, 0);
    if (!Number.isSafeInteger(totalCents) || totalCents <= 0) return { ok: false as const };
    const id = crypto.randomUUID();
    // Keep the existing schema compatible: release_upc stores a JSON item manifest for multi-item orders.
    await shopEnv.DB.prepare(
      "INSERT INTO shop_orders (id, release_upc, buyer_email, amount_cents, currency, status) VALUES (?, ?, ?, ?, 'EUR', 'pending')",
    )
      .bind(
        id,
        JSON.stringify(validItems.map(({ upc, quantity }) => ({ upc, quantity }))),
        data.email,
        totalCents,
      )
      .run();
    const params = new URLSearchParams({
      cmd: "_cart",
      upload: "1",
      business: "Encoresarbakane@gmail.com",
      currency_code: "EUR",
      custom: id,
      invoice: id,
      notify_url: "https://nflt-records.com/api/paypal/ipn",
      return: `https://nflt-records.com/commande/confirmation?order=${id}`,
      cancel_return: `https://nflt-records.com/commande/paiement?order=${id}&cancel=1`,
      no_shipping: "1",
      charset: "utf-8",
    });
    validItems.forEach((item, index) => {
      const n = index + 1;
      params.set(`item_name_${n}`, `NFLT RECORDS — ${item.title}`);
      params.set(`item_number_${n}`, item.upc);
      params.set(`amount_${n}`, (item.cents / 100).toFixed(2));
      params.set(`quantity_${n}`, String(item.quantity));
    });
    return {
      ok: true as const,
      paymentUrl: `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`,
    };
  });
