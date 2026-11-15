import { createFileRoute } from "@tanstack/react-router";
import { ApplicationPage } from "@/components/ApplicationPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/application")({
  head: () => pageHead("application", "fr"),
  component: Page,
});
function Page() {
  return <ApplicationPage locale="fr" />;
}
