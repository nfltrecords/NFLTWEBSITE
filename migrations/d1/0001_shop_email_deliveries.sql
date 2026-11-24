CREATE TABLE IF NOT EXISTS shop_email_deliveries (
  order_id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sending', 'sent')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_attempt_at TEXT,
  sent_at TEXT
);

CREATE INDEX IF NOT EXISTS shop_email_deliveries_status_idx
  ON shop_email_deliveries (status, updated_at);
