import { createFileRoute } from "@tanstack/react-router";
import { PreviewLibrary } from "@/components/PreviewLibrary";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/previews")({
  head: () => pageHead("previews", "fr"),
  component: Page,
});

function Page() {
  return <PreviewLibrary locale="fr" />;
}
