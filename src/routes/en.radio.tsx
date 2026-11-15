import { createFileRoute } from "@tanstack/react-router";
import { RadioPage } from "@/components/RadioPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/radio")({
  head: () => pageHead("radio", "en"),
  component: EnglishRadio,
});

function EnglishRadio() {
  return <RadioPage locale="en" />;
}
