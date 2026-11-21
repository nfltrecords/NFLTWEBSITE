import { createFileRoute } from "@tanstack/react-router";
import { StreamingPage } from "@/components/StreamingPage";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/listen")({
  head: () => pageHead("streaming", "en"),
  component: () => <StreamingPage locale="en" />,
});
