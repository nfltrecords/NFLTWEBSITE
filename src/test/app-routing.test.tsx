import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { releases } from "@/lib/catalogue";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each(releases)("matches both individual release pages for UPC $upc", (release) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    for (const prefix of ["/catalogue", "/en/catalogue"]) {
      const path = `${prefix}/${release.upc}`;
      const match = router.matchRoutes(path).at(-1);
      expect(match?.routeId).not.toBe(rootRouteId);
      expect(match?.pathname).toBe(path);
      expect(match?.params).toHaveProperty("upc", release.upc);
    }
  });

  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each([
    "/",
    "/services",
    "/artistes",
    "/a-propos",
    "/contact",
    "/messages",
    "/en",
    "/en/services",
    "/en/artists",
    "/en/about",
    "/en/contact",
    "/catalogue",
    "/nflt",
    "/presse",
    "/en/catalogue",
    "/en/nflt",
    "/en/press",
    "/application",
    "/en/application",
    "/radio",
    "/en/radio",
    "/boutique",
    "/en/shop",
    "/licences-musicales",
    "/en/music-licensing",
    "/catalogue/821440674572",
    "/en/catalogue/821440674572",
  ])("preserves a matching page at %s", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const match = router.matchRoutes(path).at(-1);
    expect(match?.routeId).not.toBe(rootRouteId);
    expect(match?.pathname.replace(/\/$/, "") || "/").toBe(path);
  });
});
