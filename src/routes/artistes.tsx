import { createFileRoute } from "@tanstack/react-router";
import { RosterPage } from "@/components/LabelPages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/artistes")({
  head: () => pageHead("artists"),
  component: RosterPage,
});
