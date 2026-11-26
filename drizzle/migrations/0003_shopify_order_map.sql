CREATE TABLE IF NOT EXISTS shopify_order_map (
  shopify_order_id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE
);
