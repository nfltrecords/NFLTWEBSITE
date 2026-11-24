import { env } from "cloudflare:workers";

type ShopBindings = { DB: D1Database; AUDIO_KV: KVNamespace; AUDIO_R2: R2Bucket };
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
  id: number;
  release_upc: string;
  asset_key: string;
  file_name: string;
  file_size: number;
  chunk_count: number;
};

const orderSelect =
  "SELECT id, release_upc, buyer_email, amount_cents, currency, status, paypal_transaction_id, created_at, paid_at FROM shop_orders";

export async function getShopOrder(id: string): Promise<ShopOrder | null> {
  return shopEnv.DB.prepare(`${orderSelect} WHERE id = ? LIMIT 1`).bind(id).first<ShopOrder>();
}

export async function getShopOrderByTransactionId(
  transactionId: string,
): Promise<ShopOrder | null> {
  return shopEnv.DB.prepare(`${orderSelect} WHERE paypal_transaction_id = ? LIMIT 1`)
    .bind(transactionId)
    .first<ShopOrder>();
}

export async function getShopAssets(upc: string): Promise<ShopAsset[]> {
  const result = await shopEnv.DB.prepare(
    "SELECT id, release_upc, asset_key, file_name, file_size, chunk_count FROM shop_release_assets WHERE release_upc = ? ORDER BY id",
  )
    .bind(upc)
    .all<ShopAsset>();
  return result.results ?? [];
}

export async function markShopOrderPaid(id: string, transactionId: string): Promise<boolean> {
  const result = await shopEnv.DB.prepare(
    "UPDATE shop_orders SET status='paid', paypal_transaction_id=?, paid_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='pending'",
  )
    .bind(transactionId, id)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export function downloadUrl(orderId: string): string {
  return `/api/download?order=${encodeURIComponent(orderId)}`;
}
