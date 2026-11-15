import { createFileRoute } from "@tanstack/react-router";
import { LegalPreparationPage } from "@/components/LegalPreparationPage";
import { legalPageHead } from "@/lib/seo";
export const Route = createFileRoute("/confidentialite")({
  head: () => legalPageHead("privacy", "fr"),
  component: Page,
});
function Page() {
  return <LegalPreparationPage page="privacy" locale="fr" />;
}
