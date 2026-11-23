import { createFileRoute } from "@tanstack/react-router";
import { servePaidOrderDownload } from "@/lib/delivery.server";
export const Route = createFileRoute("/api/download")({
  server: { handlers: { GET: async ({ request }) => {
    try { return await servePaidOrderDownload(request); }
    catch (error) {
      console.error("Paid download failed", error);
      return new Response("Téléchargement temporairement indisponible.", { status: 503, headers: { "Cache-Control": "no-store" } });
    }
  } } },
});
