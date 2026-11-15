import ReactMarkdown from "react-markdown";
import termsFr from "../../.lovable/legal/conditions-de-vente.fr.md?revision=20261114-1412&raw";
import termsEn from "../../.lovable/legal/terms-of-sale.en.md?revision=20261114-1412&raw";
import privacyFr from "../../.lovable/legal/confidentialite.fr.md?revision=20261114-1412&raw";
import privacyEn from "../../.lovable/legal/privacy-policy.en.md?revision=20261114-1412&raw";
import type { LegalPage, Locale } from "@/lib/seo";

const documents = {
  terms: { fr: termsFr, en: termsEn },
  privacy: { fr: privacyFr, en: privacyEn },
};

export default function LegalDraftPreview({ page, locale }: { page: LegalPage; locale: Locale }) {
  // The route owns the single H1; private source comments are never rendered.
  const document = documents[page][locale].replace(/^# .*\n/, "").replace(/<!--[\s\S]*?-->/g, "");
  return (
    <article className="legal-reading-copy">
      <ReactMarkdown>{document}</ReactMarkdown>
    </article>
  );
}
