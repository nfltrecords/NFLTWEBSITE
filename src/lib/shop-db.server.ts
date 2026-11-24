import { env } from "cloudflare:workers";

type ShopBindings = {
  DB: D1Database;
  AUDIO_KV: KVNamespace;
};

export const shopEnv = env as unknown as ShopBindings;

export type ShopOrder = {
  id: string;
  release_upc: string;
  buyer_email: string;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  paypal_transaction_id: string | null;
  created_at: string;
  paid_at: string | null;
};

export type ShopAsset = {
  release_upc: string;
  asset_key: string;
  file_name: string;
  file_size: number;
  chunk_count: number;
};

export async function getShopOrder(id: string): Promise<ShopOrder | null> {
  return shopEnv.DB.prepare(
    "SELECT id, release_upc, buyer_email, amount_cents, currency, status, paypal_transaction_id, created_at, paid_at FROM shop_orders WHERE id = ? LIMIT 1",
  ).bind(id).first<ShopOrder>();
}

export async function getShopAsset(upc: string): Promise<ShopAsset | null> {
  return shopEnv.DB.prepare(
    "SELECT release_upc, asset_key, file_name, file_size, chunk_count FROM shop_release_assets WHERE release_upc = ? LIMIT 1",
  ).bind(upc).first<ShopAsset>();
}

export async function markShopOrderPaid(id: string, transactionId: string): Promise<boolean> {
  const result = await shopEnv.DB.prepare(
    "UPDATE shop_orders SET status = 'paid', paypal_transaction_id = ?, paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'",
  ).bind(transactionId, id).run();
  return (result.meta.changes ?? 0) > 0;
}

export function downloadUrl(orderId: string): string {
  return `https://nflt-records.com/telechargement#order=${encodeURIComponent(orderId)}`;
}
