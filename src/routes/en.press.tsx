import { createFileRoute } from "@tanstack/react-router";
import { PressPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/press")({
  head: () => pageHead("press", "en"),
  component: Page,
});
function Page() {
  return <PressPage locale="en" />;
}
