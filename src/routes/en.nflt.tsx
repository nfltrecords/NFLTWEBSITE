import { createFileRoute } from "@tanstack/react-router";
import { ArtistPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/nflt")({
  head: () => pageHead("artist", "en"),
  component: Page,
});
function Page() {
  return <ArtistPage locale="en" />;
}
