export const mobileApplication = {
  name: "NFLT RECORDS",
  developer: "Apps wiz",
  packageId: "com.appswiz.nfltrecordshfegh",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.appswiz.nfltrecordshfegh",
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
    role: { fr: "Maison mère", en: "Parent company" },
  },
  {
    name: "NFLT RECORDS FRANCE",
    city: { fr: "Paris", en: "Paris" },
    role: { fr: "Filiale française", en: "French subsidiary" },
  },
  {
    name: "NFLT RECORDS BRUSSELS",
    city: { fr: "Bruxelles", en: "Brussels" },
    role: { fr: "Branche de Bruxelles", en: "Brussels branch" },
  },
] as const;
