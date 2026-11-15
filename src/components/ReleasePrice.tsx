import { formatShopPrice, releasePriceCents } from "@/lib/commerce";

export function ReleasePrice({ upc }: { upc: string }) {
  const cents = releasePriceCents(upc);
  if (cents === null) return null;
  return (
    <span className="mt-3 block font-display text-2xl text-primary" data-release-price={upc}>
      {formatShopPrice(cents)}
    </span>
  );
}