import { createFileRoute } from "@tanstack/react-router";
import { LegalPreparationPage } from "@/components/LegalPreparationPage";
import { legalPageHead } from "@/lib/seo";
export const Route = createFileRoute("/en/privacy-policy")({
  head: () => legalPageHead("privacy", "en"),
  component: Page,
});
function Page() {
  return <LegalPreparationPage page="privacy" locale="en" />;
}
