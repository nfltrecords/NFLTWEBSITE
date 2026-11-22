import { createFileRoute } from "@tanstack/react-router";
import { LocationsPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/implantations")({
  head: () => pageHead("about", "fr"),
  component: () => <LocationsPage locale="fr" />,
});
