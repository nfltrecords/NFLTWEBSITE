import { createFileRoute } from "@tanstack/react-router";
import { LegalPreparationPage } from "@/components/LegalPreparationPage";
import { legalPageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/terms-of-sale")({
  head: () => legalPageHead("terms", "en"),
  component: Page,
});
function Page() {
  return <LegalPreparationPage page="terms" locale="en" />;
}
