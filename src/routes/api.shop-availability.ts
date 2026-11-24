import { createFileRoute } from "@tanstack/react-router";
import { releases } from "@/lib/catalogue";
import { getCompleteWavTracks } from "@/lib/delivery.server";

export const Route = createFileRoute("/api/shop-availability")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const availability = await Promise.all(
            releases.map(async (release) => ({
              upc: release.upc,
              available: Boolean(await getCompleteWavTracks(release.upc)),
            })),
          );
          return Response.json(
            {
              availableUpcs: availability
                .filter((item) => item.available)
                .map((item) => item.upc),
            },
            { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } },
          );
        } catch (error) {
          console.error("Shop availability check failed", error);
          return Response.json({ error: "Availability check unavailable" }, { status: 503 });
        }
      },
    },
  },
});
