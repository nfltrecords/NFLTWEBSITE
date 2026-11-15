import { createFileRoute, notFound } from "@tanstack/react-router";
import { ReleasePage } from "@/components/LabelPages";
import { releases } from "@/lib/catalogue";
import { releaseHead } from "@/lib/seo";
export const Route = createFileRoute("/catalogue_/$upc")({
  loader: ({ params }) => {
    const release = releases.find((r) => r.upc === params.upc);
    if (!release) throw notFound();
    return release;
  },
  head: ({ loaderData }) =>
    loaderData
      ? releaseHead(loaderData, "fr")
      : { meta: [{ title: "Unavailable — NFLT RECORDS" }, { name: "robots", content: "noindex" }] },
  component: Page,
});
function Page() {
  return <ReleasePage release={Route.useLoaderData()} locale="fr" />;
}
