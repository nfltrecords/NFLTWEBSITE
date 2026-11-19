import { formatShopPrice, releasePriceCents } from "@/lib/commerce";

export function ReleasePrice({ upc }: { upc: string }) {
  const cents = releasePriceCents(upc);
  if (cents === null) return null;
  return (
    <span className="mt-3 block font-display text-2xl text-primary" data-release-price={upc}>
      <span className="sr-only">Prix indicatif : </span>{" "}
      <span aria-hidden="true">{formatShopPrice(cents)}</span>
    </span>
  );
}
