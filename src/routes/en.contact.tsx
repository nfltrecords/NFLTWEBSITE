import { createFileRoute } from "@tanstack/react-router";
import { EnglishContact } from "@/components/EnglishPages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/contact")({
  head: () => pageHead("contact", "en"),
  component: EnglishContact,
});
