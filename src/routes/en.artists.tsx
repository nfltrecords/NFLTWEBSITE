import { createFileRoute } from "@tanstack/react-router";
import { EnglishArtists } from "@/components/EnglishPages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/artists")({
  head: () => pageHead("artists", "en"),
  component: EnglishArtists,
});
