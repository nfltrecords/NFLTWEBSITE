import { describe, expect, it } from "vitest";
import { normalizeCart } from "@/lib/cart-store";

describe("cart eligibility", () => {
  it("drops legacy cart entries whose release price is not confirmed", () => {
    expect(
      normalizeCart({
        "199955715135": 2,
        "199955742094": 1,
        "199951252436": 4,
        "199956222809": 3,
      }),
    ).toEqual({
      "199955715135": 2,
      "199955742094": 1,
    });
  });

  it("rejects malformed, non-positive and non-integer quantities", () => {
    expect(
      normalizeCart({
        "199955715135": 0,
        "199955742094": -1,
        "199955701558": 1.5,
        "not-a-upc": 2,
      }),
    ).toEqual({});
  });

  it("caps a stored quantity at twenty", () => {
    expect(normalizeCart({ "199955715135": 99 })).toEqual({ "199955715135": 20 });
  });
});
