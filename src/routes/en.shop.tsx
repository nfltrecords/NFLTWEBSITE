import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/CommercePages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/shop")({
  head: () => pageHead("shop", "en"),
  component: Page,
});
function Page() {
  return <ShopPage locale="en" />;
}
