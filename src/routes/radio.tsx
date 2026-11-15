import { createFileRoute } from "@tanstack/react-router";
import { RadioPage } from "@/components/RadioPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/radio")({
  head: () => pageHead("radio", "fr"),
  component: FrenchRadio,
});

function FrenchRadio() {
  return <RadioPage locale="fr" />;
}
