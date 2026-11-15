import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/a-propos")({
  head: () => pageHead("about"),
  component: AboutPage,
});
