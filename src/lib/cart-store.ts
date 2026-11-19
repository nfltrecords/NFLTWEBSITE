import { useSyncExternalStore } from "react";

export type CartState = Readonly<Record<string, number>>;
const STORAGE_KEY = "nflt-cart-v1";
const EMPTY_CART: CartState = {};
let cart: CartState = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

function loadCart() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      cart = Object.fromEntries(
        Object.entries(parsed).filter(
          ([upc, quantity]) => /^\d{12}$/.test(upc) && Number.isInteger(quantity) && Number(quantity) > 0,
        ).map(([upc, quantity]) => [upc, Math.min(Number(quantity), 20)]),
      );
    }
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
  const add = (upc: string) => save({ ...items, [upc]: Math.min((items[upc] ?? 0) + 1, 20) });
  const change = (upc: string, delta: number) => {
    const next = { ...items };
    const quantity = (next[upc] ?? 0) + delta;
    if (quantity <= 0) delete next[upc];
    else next[upc] = Math.min(quantity, 20);
    save(next);
  };
  const clear = () => save({});
  return { items, count, add, change, clear };
}
