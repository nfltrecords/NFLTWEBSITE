import { createFileRoute } from "@tanstack/react-router";
import { EnglishServices } from "@/components/EnglishPages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/services")({
  head: () => pageHead("services", "en"),
  component: EnglishServices,
});
