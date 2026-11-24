import { useEffect, useState } from "react";

type ShopAvailabilityResponse = {
  availableUpcs?: unknown;
};

export function useShopAvailability() {
  const [availableUpcs, setAvailableUpcs] = useState<ReadonlySet<string> | null>(null);

  useEffect(() => {
    let active = true;
    void fetch("/api/shop-availability", { headers: { Accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("Shop availability unavailable");
        const data = (await response.json()) as ShopAvailabilityResponse;
        if (!Array.isArray(data.availableUpcs)) throw new Error("Invalid shop availability");
        const upcs = data.availableUpcs.filter(
          (value): value is string => typeof value === "string" && /^\d{12,14}$/.test(value),
        );
        if (active) setAvailableUpcs(new Set(upcs));
      })
      .catch(() => {
        if (active) setAvailableUpcs(new Set());
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    availableUpcs,
    availabilityLoaded: availableUpcs !== null,
  };
}
