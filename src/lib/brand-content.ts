export const mobileApplication = {
  name: "NFLT RECORDS",
  googlePlayUrl: null,
};

export function validatedGooglePlayUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "play.google.com" &&
      url.pathname === "/store/apps/details" &&
      Boolean(url.searchParams.get("id"))
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export const implantations = [
  {
    name: "NFLT RECORDS INC.",
    city: { fr: "New York", en: "New York" },
    address: {
      fr: "One World Trade Center, Fulton St, Étage 1, New York, NY 10006, États-Unis",
      en: "One World Trade Center, Fulton St, 1st Floor, New York, NY 10006, USA",
    },
    role: { fr: "Maison mère", en: "Parent company" },
  },
  {
    name: "NFLT RECORDS FRANCE",
    city: { fr: "Paris", en: "Paris" },
    address: {
      fr: "10 Avenue Kléber, 75116 Paris, France",
      en: "10 Avenue Kléber, 75116 Paris, France",
    },
    role: { fr: "Filiale française", en: "French subsidiary" },
  },
  {
    name: "NFLT RECORDS BRUSSELS",
    city: { fr: "Bruxelles", en: "Brussels" },
    address: {
      fr: "Levels 5 & 6, EU Quarter, Rdpt Robert Schuman 2/4, 1040 Etterbeek, Belgique",
      en: "Levels 5 & 6, EU Quarter, Rdpt Robert Schuman 2/4, 1040 Etterbeek, Belgium",
    },
    role: { fr: "Succursale de Bruxelles", en: "Brussels branch" },
  },
] as const;
