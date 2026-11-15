import { createFileRoute } from "@tanstack/react-router";
import { PreviewLibrary } from "@/components/PreviewLibrary";

export const Route = createFileRoute("/previews")({
  component: Page,
});

function Page() {
  return <PreviewLibrary locale="fr" />;
}
