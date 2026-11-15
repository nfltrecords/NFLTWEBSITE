import { createFileRoute } from "@tanstack/react-router";
import { EnglishHome } from "@/components/EnglishPages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () => pageHead("home", "en"),
  component: EnglishHome,
});
