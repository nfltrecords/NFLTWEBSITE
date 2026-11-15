import { createFileRoute } from "@tanstack/react-router";
import { ArtistPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/nflt")({
  head: () => pageHead("artist", "fr"),
  component: Page,
});
function Page() {
  return <ArtistPage locale="fr" />;
}
