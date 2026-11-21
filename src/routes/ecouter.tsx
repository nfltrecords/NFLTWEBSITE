import { createFileRoute } from "@tanstack/react-router";
import { StreamingPage } from "@/components/StreamingPage";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/ecouter")({
  head: () => pageHead("streaming", "fr"),
  component: () => <StreamingPage locale="fr" />,
});
