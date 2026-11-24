import { describe, expect, it } from "vitest";
import { matchesPayPalCart, parsePayPalOrderManifest } from "@/lib/paypal-ipn";

const firstUpc = "199955740199";
const secondUpc = "199956554184";

describe("PayPal Classic cart verification", () => {
  it("parses a multi-item order manifest and legacy single-item orders", () => {
    expect(
      parsePayPalOrderManifest(
        JSON.stringify([
          { upc: firstUpc, quantity: 2 },
          { upc: secondUpc, quantity: 1 },
        ]),
      ),
    ).toEqual([
      { upc: firstUpc, quantity: 2 },
      { upc: secondUpc, quantity: 1 },
    ]);
    expect(parsePayPalOrderManifest(firstUpc)).toEqual([{ upc: firstUpc, quantity: 1 }]);
    expect(parsePayPalOrderManifest("invalid")).toEqual([]);
  });

  it("matches the exact UPCs and quantities returned by PayPal", () => {
    const data = new URLSearchParams({
      num_cart_items: "2",
      item_number1: firstUpc,
      quantity1: "2",
      item_number2: secondUpc,
      quantity2: "1",
    });
    expect(
      matchesPayPalCart(data, [
        { upc: firstUpc, quantity: 2 },
        { upc: secondUpc, quantity: 1 },
      ]),
    ).toBe(true);
  });

  it("accepts PayPal cart counts that include individual quantities", () => {
    const data = new URLSearchParams({
      num_cart_items: "4",
      item_number1: firstUpc,
      quantity1: "3",
      item_number2: secondUpc,
      quantity2: "1",
    });
    expect(
      matchesPayPalCart(data, [
        { upc: firstUpc, quantity: 3 },
        { upc: secondUpc, quantity: 1 },
      ]),
    ).toBe(true);
  });

  it("rejects a cart count that matches neither line count nor total quantity", () => {
    const data = new URLSearchParams({
      num_cart_items: "5",
      item_number1: firstUpc,
      quantity1: "3",
      item_number2: secondUpc,
      quantity2: "1",
    });
    expect(
      matchesPayPalCart(data, [
        { upc: firstUpc, quantity: 3 },
        { upc: secondUpc, quantity: 1 },
      ]),
    ).toBe(false);
  });

  it("supports underscore item fields from the outgoing Classic cart form", () => {
    const data = new URLSearchParams({
      num_cart_items: "1",
      item_number_1: firstUpc,
      quantity_1: "1",
    });
    expect(matchesPayPalCart(data, [{ upc: firstUpc, quantity: 1 }])).toBe(true);
  });

  it("rejects changed UPCs, quantities, missing lines, and extra cart lines", () => {
    const expected = [
      { upc: firstUpc, quantity: 1 },
      { upc: secondUpc, quantity: 1 },
    ];
    expect(
      matchesPayPalCart(
        new URLSearchParams(
          `num_cart_items=2&item_number1=${firstUpc}&quantity1=1&item_number2=000000000000&quantity2=1`,
        ),
        expected,
      ),
    ).toBe(false);
    expect(
      matchesPayPalCart(
        new URLSearchParams(
          `num_cart_items=2&item_number1=${firstUpc}&quantity1=2&item_number2=${secondUpc}&quantity2=1`,
        ),
        expected,
      ),
    ).toBe(false);
    expect(
      matchesPayPalCart(
        new URLSearchParams(
          `num_cart_items=2&item_number1=${firstUpc}&quantity1=1&item_number2=${secondUpc}`,
        ),
        expected,
      ),
    ).toBe(false);
    expect(
      matchesPayPalCart(
        new URLSearchParams(
          `num_cart_items=3&item_number1=${firstUpc}&quantity1=1&item_number2=${secondUpc}&quantity2=1&item_number3=199955715135&quantity3=1`,
        ),
        expected,
      ),
    ).toBe(false);
  });
});
