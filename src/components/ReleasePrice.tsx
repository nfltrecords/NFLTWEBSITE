import { formatShopPrice, releasePriceCents } from "@/lib/commerce";

export function ReleasePrice({ upc, locale = "fr" }: { upc: string; locale?: "fr" | "en" }) {
  const cents = releasePriceCents(upc);
  if (cents === null) {
    return (
      <span className="mt-3 block text-sm text-muted-foreground" data-release-price-pending={upc}>
        {locale === "fr" ? "Prix à confirmer" : "Price to be confirmed"}
      </span>
    );
  }
  return (
    <span className="mt-3 block font-display text-2xl text-primary" data-release-price={upc}>
      <span className="sr-only">
        {locale === "fr" ? "Prix indicatif : " : "Indicative price: "}
      </span>{" "}
      <span aria-hidden="true">{formatShopPrice(cents)}</span>
    </span>
  );
}
