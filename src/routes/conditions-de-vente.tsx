import { createFileRoute } from "@tanstack/react-router";
import { LegalPreparationPage } from "@/components/LegalPreparationPage";
import { legalPageHead } from "@/lib/seo";
export const Route = createFileRoute("/conditions-de-vente")({
  head: () => legalPageHead("terms", "fr"),
  component: Page,
});
function Page() {
  return <LegalPreparationPage page="terms" locale="fr" />;
}
