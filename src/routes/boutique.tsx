import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/CommercePages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/boutique")({
  head: () => pageHead("shop", "fr"),
  component: Page,
});
function Page() {
  return <ShopPage locale="fr" />;
}
