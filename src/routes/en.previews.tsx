import { createFileRoute } from "@tanstack/react-router";
import { PreviewLibrary } from "@/components/PreviewLibrary";

export const Route = createFileRoute("/en/previews")({
  component: Page,
});

function Page() {
  return <PreviewLibrary locale="en" />;
}
