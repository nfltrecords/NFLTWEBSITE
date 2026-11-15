import { createFileRoute } from "@tanstack/react-router";
import { LicensingPage } from "@/components/CommercePages";
import { commerceSearchSchema } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/licences-musicales")({
  validateSearch: (input) => commerceSearchSchema.parse(input),
  head: () => pageHead("licensing", "fr"),
  component: Page,
});
function Page() {
  const { release, intent } = Route.useSearch();
  return <LicensingPage locale="fr" release={release} intent={intent} />;
}
