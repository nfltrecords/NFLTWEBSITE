import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/services")({
  head: () => pageHead("services"),
  component: ServicesPage,
});
