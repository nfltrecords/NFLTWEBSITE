import { createFileRoute } from "@tanstack/react-router";
import { PreviewLibrary } from "@/components/PreviewLibrary";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/previews")({
  head: () => pageHead("previews", "en"),
  component: Page,
});

function Page() {
  return <PreviewLibrary locale="en" />;
}
