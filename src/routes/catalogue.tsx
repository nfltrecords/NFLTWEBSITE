import { createFileRoute } from "@tanstack/react-router";
import { CataloguePage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/catalogue")({
  head: () => pageHead("catalogue", "fr"),
  component: Page,
});
function Page() {
  return <CataloguePage locale="fr" />;
}
