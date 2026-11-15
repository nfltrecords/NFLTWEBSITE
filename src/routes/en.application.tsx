import { createFileRoute } from "@tanstack/react-router";
import { ApplicationPage } from "@/components/ApplicationPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/application")({
  head: () => pageHead("application", "en"),
  component: Page,
});
function Page() {
  return <ApplicationPage locale="en" />;
}
