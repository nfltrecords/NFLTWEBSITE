import { createFileRoute } from "@tanstack/react-router";
import { LicensingPage } from "@/components/CommercePages";
import { commerceSearchSchema } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/music-licensing")({
  validateSearch: (input) => commerceSearchSchema.parse(input),
  head: () => pageHead("licensing", "en"),
  component: Page,
});
function Page() {
  const { release, intent } = Route.useSearch();
  return <LicensingPage locale="en" release={release} intent={intent} />;
}
