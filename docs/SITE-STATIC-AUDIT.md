# Audit fonctionnel du site — état du dépôt principal

Audit statique du code de la branche `main`, complété par la lecture des journaux de projet versionnés. Cet audit ne constitue pas une exécution locale ni une validation de production.

## Catalogue et boutique

- Le catalogue source contient 18 sorties.
- Le script `scripts/audit-assets.mjs` contrôle les 18 pochettes, les UPC manquants et l'absence des chemins/composants d'extraits audio ; aucun MP3 de préécoute n'est requis par le code actif.
- Le rapport interne propriétaire daté du 14 novembre documente 18 JPG originaux accessibles dans l'archive média, dont 16 associations titre/pochette/UPC vérifiées par captures, et deux associations qui nécessitent encore une preuve complémentaire. Le même rapport indique que les fichiers originaux mesurés dans l'archive font 1536 × 1536 px, malgré certains noms de fichiers contenant « 3000x3000 ».
- La boutique affiche les 18 sorties, leurs pochettes et leurs UPC, et permet de rechercher un titre.
- Chaque sortie propose une demande de disponibilité ; les demandes de licence/disponibilité utilisent un formulaire distinct.
- Le code `src/lib/commerce.ts` contient 18 décomptes vérifiés, dont Hustle & Grind à 1 piste, alignés sur `docs/track-count-evidence-2026-11-24.md`. Les décomptes décrivent les tracklists, pas la disponibilité des masters WAV ; ils ne constituent pas une autorisation de vente. Checkout reste fermé par un verrou serveur à double condition : approbation privée `checkoutEnabled` et variable `PAYPAL_CHECKOUT_ENABLED=true`.
- Les trois prix de référence sont 9,99 € (1 piste), 14,99 € (5 pistes) et 19,99 € (6 pistes ou plus). Les formats 2 à 4 pistes ne sont pas tarifés par le code. Le site ne permet pas actuellement de commander, payer ou télécharger. Les fonctions serveur PayPal refusent également de démarrer ou confirmer un paiement tant que les deux conditions d'activation ne sont pas réunies.

## SEO constaté

- `src/lib/seo.ts` déclare 12 groupes de pages publiques avec versions FR/EN, titres, descriptions, canonical, hreflang, Open Graph et Twitter metadata.
- Les pages de conditions de vente et de confidentialité sont explicitement en préparation et `noindex,nofollow`.
- Les pages catalogue individuelles génèrent une metadata `MusicRelease` structurée avec titre, UPC et pochette lorsqu'elle existe.
- La radio est décrite comme « en préparation », cohérent avec l'absence d'URL de flux dans `src/lib/radio.ts`.

## Administration

- `/messages` est une boîte privée de lecture des messages de contact, protégée par un code transmis à une fonction serveur. Elle ne gère ni clients, ni commandes, ni projets, ni contrats, ni factures.
- Le schéma TypeScript Supabase versionné ne déclare que `contact_messages` et `licensing_inquiries`. `drizzle/schema.ts` est un fichier généré laissé vide. Le répertoire `supabase/` ne contient qu'un `config.toml` dans l'arborescence publique du dépôt.
- Le schéma réel du projet Supabase, ses données et ses politiques RLS ne sont pas vérifiés faute d'accès au compte.

## Dépendances Lovable encore visibles

- `src/routes/__root.tsx` importe `reportLovableError` depuis `src/lib/lovable-error-reporting.ts`. Ce module utilise les hooks globaux optionnels `__lovableEvents` et `__lovableReportRuntimeError`, dont le second est commenté comme présent uniquement dans l'aperçu de l'éditeur.
- `AGENTS.md` contient encore un bloc d'instructions indiquant que le dépôt est connecté à Lovable et que les commits poussés sont synchronisés vers son éditeur.
- Le répertoire `.lovable/` contient des dossiers et documents internes encore référencés par les tests et la documentation (notamment configuration commerce, revues catalogue et documents juridiques). Il ne faut pas le supprimer en bloc sans migrer ses usages et préserver les dossiers privés.
- Les archives ZIP de préparation Cloudflare et médias ont été inventoriées : 15 archives de préparation contenant des MP3 de 30 secondes ont été nettoyées en conservant les autres fichiers ; les trois archives de marque/pochettes sans extraits ont été laissées intactes.

Le runtime ne montre plus de dépendance `reportLovableError` dans la route racine, mais `.lovable/` subsiste et des références Supabase sont encore présentes dans le code et les bindings Worker. L'indépendance complète de l'application vis-à-vis de Lovable et de Supabase n'est donc pas certifiée ; poursuivre l'inventaire des usages réels avant toute suppression.

## Workflows et validation

- `.github/workflows/verify-source.yml` exécute installation npm, tests, lint et build sans déploiement.
- Sur `main`, `.github/workflows/prepare-cloudflare-source.yml` se déclenchait sur les pushes vers `main`, disposait d'un droit d'écriture et extrayait une archive avant de pousser automatiquement. Dans cette branche de travail, il a été durci : déclenchement manuel uniquement, permission lecture seule, vérification de présence de l'archive et aucune extraction/poussée automatique. Ce changement doit être validé par le CI avant fusion.
- Le fichier `MIGRATION-AUDIT-2026-11-15.md` rapporte une installation npm qui a expiré dans son environnement de préparation.
- À l'inverse, le `roadmap.md` et le rapport propriétaire du 14 novembre enregistrent plusieurs validations antérieures de tests, lint et compilation automatique réussis. Ces validations sont des résultats historiques consignés dans le dépôt, pas une nouvelle exécution faite pendant cet audit.
- Le contrôle Cloudflare du 26 novembre confirme Workers Builds connecté à GitHub (`main`), avec `npm run build` et `npx wrangler deploy`. Le build le plus récent `f5c58885-9e41-4a58-a514-92f3fed2aaa1` est réussi et a déployé la version 218. Les commits documentaires sur `main` déclenchent donc aussi un déploiement Worker ; ne pas écrire que les pushes `main` sont sans déploiement. Le CI GitHub Actions et la prévisualisation navigateur des pages doivent être vérifiés séparément.

## Contrôle statique du sitemap

Une comparaison automatisée du sitemap de `main` avec les 12 groupes de pages publiques FR/EN et les 18 fiches UPC a trouvé exactement 60 URL attendues, 60 URL uniques, aucune URL manquante ou inattendue, et 180 liens hreflang. `robots.txt` autorise l'exploration et déclare le sitemap `https://nflt-records.com/sitemap.xml`. Ce contrôle vérifie le contenu versionné, pas l'indexation réelle par Google/Bing ni la réponse HTTP en production.

## Limites et prochaine validation

Cet audit ne certifie pas l'affichage réel actuel sur mobile, les liens externes, les formulaires en production, les données Supabase, ni l'indexation effective. Le Worker et ses domaines personnalisés sont présents, mais les requêtes HTTP sortantes depuis l'environnement d'audit ont été refusées par une restriction réseau ; il faut donc valider les pages dans un navigateur utilisateur. Le build Cloudflare est réussi ; le statut GitHub Actions doit être vérifié séparément. Ne pas toucher au DNS, à la messagerie, au checkout ou à la production sans plan de retour arrière et autorisation.
