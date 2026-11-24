import { z } from "zod";
import { releases } from "@/lib/catalogue";

export const LICENSING_RECIPIENT = "nfltrecords@nflt-records.com";
export const shopPriceTiers = [
  {
    tracks: 1,
    cents: 999,
    currency: "EUR",
    label: { fr: "Single / 1 piste", en: "Single / 1 track" },
  },
  {
    tracks: 5,
    cents: 1499,
    currency: "EUR",
    label: { fr: "EP / 5 pistes", en: "EP / 5 tracks" },
  },
  {
    tracks: 6,
    cents: 1999,
    currency: "EUR",
    label: { fr: "Album / 6 pistes ou plus", en: "Album / 6 or more tracks" },
  },
] as const;
export const formatShopPrice = (cents: number) => `${(cents / 100).toFixed(2).replace(".", ",")} €`;

export const verifiedReleaseTrackCounts: Readonly<Record<string, number>> = {
  "199955715135": 1,
  "199955742094": 8,
  "199956222809": 9,
  "199956554184": 5,
};

// Track counts and resulting prices below are provisional catalogue pricing.
// Singles are provisionally priced at 9.99 EUR; the two multi-track albums use
// the owner-supplied album tier. Confirm final tracklists and delivered masters
// UPC by UPC before opening checkout.
export const provisionalReleaseTrackCounts: Readonly<Record<string, number>> = {
  "199955740199": 1,
  "199956554184": 1,
  "199956222809": 9,
  "199955715135": 1,
  "199955742094": 8,
  "199955701558": 1,
  "199955715203": 1,
  "199751511160": 1,
  "199751512501": 1,
  "199751514697": 1,
  "199751613871": 1,
  "199751508283": 1,
  "199751168234": 1,
  "199751170992": 1,
  "199956557857": 1,
  "199954147302": 1,
  "199951252436": 1,
  "821440674572": 1,
};
export function priceForTrackCount(count: number | undefined): number | null {
  if (count === undefined || !Number.isSafeInteger(count) || count < 1) return null;
  if (count === 1) return shopPriceTiers[0].cents;
  if (count === 5) return shopPriceTiers[1].cents;
  if (count >= 6) return shopPriceTiers[2].cents;
  return null;
}
export const releasePriceCents = (upc: string) =>
  releases.some((release) => release.upc === upc)
    ? priceForTrackCount(provisionalReleaseTrackCounts[upc])
    : null;
export const inquirySchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    organization: z.string().trim().max(150),
    inquiry_type: z.enum(["availability", "licensing"]),
    release_upc: z.string().refine((value) => !value || releases.some((r) => r.upc === value)),
    usage: z.enum(["audiovisual", "advertising", "film", "creator", "game", "other"]),
    territory: z.string().trim().max(150),
    duration: z.string().trim().max(150),
    message: z.string().trim().min(1).max(3000),
    locale: z.enum(["fr", "en"]),
  })
  .strict();
export type Inquiry = z.infer<typeof inquirySchema>;
export const commerceSearchSchema = z.object({
  release: z
    .string()
    .optional()
    .catch(undefined)
    .transform((value) => (releases.some((r) => r.upc === value) ? value : undefined)),
  intent: z.enum(["availability", "licensing"]).optional().catch(undefined),
});
