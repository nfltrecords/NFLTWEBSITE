export type PayPalOrderItem = {
  upc: string;
  quantity: number;
};

function isPayPalOrderItem(value: unknown): value is PayPalOrderItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item["upc"] === "string" &&
    /^\d{12,14}$/.test(item["upc"]) &&
    Number.isSafeInteger(item["quantity"]) &&
    Number(item["quantity"]) >= 1 &&
    Number(item["quantity"]) <= 20
  );
}

export function parsePayPalOrderManifest(value: string): PayPalOrderItem[] {
  const legacyUpc = value.trim();
  if (/^\d{12,14}$/.test(legacyUpc)) return [{ upc: legacyUpc, quantity: 1 }];

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      if (parsed.length === 0 || !parsed.every(isPayPalOrderItem)) return [];
      const upcs = parsed.map((item) => item.upc);
      if (new Set(upcs).size !== upcs.length) return [];
      return parsed;
    }
  } catch {
    // Legacy orders stored a single UPC as plain text, not JSON.
  }
  return /^\d{12,14}$/.test(value) ? [{ upc: value, quantity: 1 }] : [];
}

function indexedValue(data: URLSearchParams, name: string, index: number): string | null {
  return (
    data.get(`${name}${index}`) ??
    data.get(`${name}_${index}`) ??
    (index === 1 ? data.get(name) : null)
  );
}

export function matchesPayPalCart(
  data: URLSearchParams,
  expectedItems: readonly PayPalOrderItem[],
): boolean {
  if (expectedItems.length < 1 || expectedItems.length > 18) return false;

  const cartCount = data.get("num_cart_items");
  if (cartCount !== null) {
    if (!/^\d+$/.test(cartCount)) return false;
    const count = Number(cartCount);
    const quantityCount = expectedItems.reduce((sum, item) => sum + item.quantity, 0);
    if (count !== expectedItems.length && count !== quantityCount) return false;
  }

  const expectedUpcs = new Set<string>();
  for (const [index, expected] of expectedItems.entries()) {
    if (!isPayPalOrderItem(expected) || expectedUpcs.has(expected.upc)) return false;
    expectedUpcs.add(expected.upc);

    const itemNumber = indexedValue(data, "item_number", index + 1);
    const quantity = indexedValue(data, "quantity", index + 1);
    if (itemNumber !== expected.upc || quantity === null) return false;
    if (!/^\d+$/.test(quantity) || Number(quantity) !== expected.quantity) return false;
  }

  const nextIndex = expectedItems.length + 1;
  return (
    indexedValue(data, "item_number", nextIndex) === null &&
    indexedValue(data, "quantity", nextIndex) === null
  );
}
