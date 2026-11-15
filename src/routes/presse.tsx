import { createFileRoute } from "@tanstack/react-router";
import { PressPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/presse")({
  head: () => pageHead("press", "fr"),
  component: Page,
});
function Page() {
  return <PressPage locale="fr" />;
}
