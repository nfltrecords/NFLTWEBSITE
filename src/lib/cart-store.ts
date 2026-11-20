import { useSyncExternalStore } from "react";
import { releasePriceCents } from "@/lib/commerce";

export type CartState = Readonly<Record<string, number>>;
const STORAGE_KEY = "nflt-cart-v1";
const EMPTY_CART: CartState = {};
let cart: CartState = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

export function normalizeCart(value: unknown): CartState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY_CART;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([upc, quantity]) =>
          /^\\d{12}$/.test(upc) &&
          releasePriceCents(upc) !== null &&
          Number.isInteger(quantity) &&
          Number(quantity) > 0,
      )
      .map(([upc, quantity]) => [upc, Math.min(Number(quantity), 20)]),
  );
}

function loadCart() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    cart = normalizeCart(parsed);
  } catch {
    cart = EMPTY_CART;
  }
}

function notify() {
  for (const listener of listeners) listener();
}

function save(next: CartState) {
  cart = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // The in-memory cart remains usable when browser storage is unavailable.
  }
  notify();
}

function subscribe(listener: () => void) {
  loadCart();
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    loaded = false;
    loadCart();
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  loadCart();
  return cart;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_CART);
  const count = Object.values(items).reduce((sum, quantity) => sum + quantity, 0);
  const add = (upc: string) => {
    if (releasePriceCents(upc) === null) return;
    save({ ...items, [upc]: Math.min((items[upc] ?? 0) + 1, 20) });
  };
  const change = (upc: string, delta: number) => {
    if (releasePriceCents(upc) === null) return;
    const next = { ...items };
    const quantity = (next[upc] ?? 0) + delta;
    if (quantity <= 0) delete next[upc];
    else next[upc] = Math.min(quantity, 20);
    save(next);
  };
  const clear = () => save({});
  return { items, count, add, change, clear };
}
