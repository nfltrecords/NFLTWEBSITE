/**
 * CONFIGURATION INTERNE — NON PUBLIQUE.
 * Champs réservés au futur flux de NFLT RECORDS NYC RADIO.
 * Tant qu'une valeur est null, rien n'est affiché ni demandé au réseau.
 * Ne JAMAIS mettre de clé secrète ou de jeton ici : ce fichier part dans le navigateur.
 * Les identifiants du fournisseur (clé API, mot de passe source) iront dans les secrets serveur.
 *
 * HÉBERGEMENT NON CHOISI — NE PAS DÉPLOYER.
 * Aucun serveur payant ne doit être créé ni aucun déploiement radio lancé sans accord
 * explicite du propriétaire. Une solution gratuite de test pour AzuraCast est à l'étude
 * (démo officielle, Docker sur un ordinateur local, ou machine gratuite en cloud).
 * Le flux reste désactivé (streamUrl null) jusqu'à ce qu'un hébergement soit retenu.
 */
export const radioStation = {
  /** Nom exact de la station affiché publiquement. */
  name: "NFLT RECORDS NYC RADIO",
  /** URL HTTPS du flux audio (ex. Icecast/Shoutcast/Radio.co). null = non configuré. */
  streamUrl: null as string | null,
  /** Fournisseur de streaming retenu. null = non choisi. */
  provider: null as string | null,
  /** URL HTTPS publique des métadonnées « maintenant à l'antenne » (titre/artiste). */
  nowPlayingUrl: null as string | null,
  /** Titre et artiste en cours : uniquement remplis par le fournisseur, jamais inventés. */
  nowPlaying: { title: null as string | null, artist: null as string | null },
};

export function configuredRadioStream(value: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
