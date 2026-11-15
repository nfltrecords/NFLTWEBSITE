import { createFileRoute } from "@tanstack/react-router";
import { CataloguePage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/catalogue")({
  head: () => pageHead("catalogue", "en"),
  component: Page,
});
function Page() {
  return <CataloguePage locale="en" />;
}
