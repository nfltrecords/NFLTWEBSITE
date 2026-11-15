import { createFileRoute } from "@tanstack/react-router";
import { EnglishAbout } from "@/components/EnglishPages";
import { pageHead, groupOrganization } from "@/lib/seo";

export const Route = createFileRoute("/en/about")({
  head: () => ({
    ...pageHead("about", "en"),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(groupOrganization) }],
  }),
  component: EnglishAbout,
});
