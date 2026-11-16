# Audit fonctionnel du site — état du dépôt principal

Audit statique du code de la branche `main`, complété par la lecture des journaux de projet versionnés. Cet audit ne constitue pas une exécution locale ni une validation de production.

## Catalogue et boutique

- Le catalogue source contient 18 sorties.
- Le script `scripts/audit-assets.mjs` contrôle le nombre de pochettes, les UPC manquants et les MP3 ; le rapport de migration daté du 15 novembre indique 18 pochettes appariées aux 18 UPC.
- Le rapport interne propriétaire daté du 14 novembre documente 18 JPG originaux accessibles dans l'archive média, dont 16 associations titre/pochette/UPC vérifiées par captures, et deux associations qui nécessitent encore une preuve complémentaire. Le même rapport indique que les fichiers originaux mesurés dans l'archive font 1536 × 1536 px, malgré certains noms de fichiers contenant « 3000x3000 ».
- La boutique affiche les 18 sorties, leurs pochettes et leurs UPC, et permet de rechercher un titre.
- Chaque sortie propose une demande de disponibilité ; les demandes de licence/disponibilité utilisent un formulaire distinct.
- Le composant `ReleasePrice` n'affiche rien si aucun prix n'est vérifié. Comme `verifiedReleaseTrackCounts` est vide, aucun prix individualisé ne peut actuellement être confirmé par le code.
- Les trois prix de référence sont 9,99 € (1 piste), 14,99 € (5 pistes) et 19,99 € (6 pistes ou plus). Les formats 2 à 4 pistes ne sont pas tarifés par le code. Le site ne permet pas actuellement de commander, payer ou télécharger.

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
- Le dépôt contient également des archives ZIP de préparation Cloudflare et médias ; elles ne sont pas à supprimer sans vérifier leur rôle et les fichiers source qu'elles contiennent.

Ces éléments signifient que l'indépendance technique vis-à-vis de Lovable n'est pas encore certifiée. Leur retrait doit être réalisé par étapes, avec remplacement des dépendances, tests et préservation des documents privés.

## Workflows et validation

- `.github/workflows/verify-source.yml` exécute installation npm, tests, lint et build sans déploiement.
- `.github/workflows/prepare-cloudflare-source.yml` se déclenche sur les pushes vers `main` et dispose d'un droit d'écriture du contenu du dépôt ; il cherche une archive nommée `NFLT_RECORDS_POCHETTES_CORRIGEES_2.zip`, l'extrait et pousse les changements. Cette archive n'apparaît pas dans la liste racine consultée ; le workflow devrait donc sortir sans extraction dans l'état observé. Ce workflow mérite une revue avant de nouveaux changements sur `main`.
- Le fichier `MIGRATION-AUDIT-2026-11-15.md` rapporte une installation npm qui a expiré dans son environnement de préparation.
- À l'inverse, le `roadmap.md` et le rapport propriétaire du 14 novembre enregistrent plusieurs validations antérieures de tests, lint et compilation automatique réussis. Ces validations sont des résultats historiques consignés dans le dépôt, pas une nouvelle exécution faite pendant cet audit.
- Pour la PR documentaire n°2, le commentaire automatique Cloudflare indique que la prévisualisation Worker a échoué sur le commit `4a3f7d1`. Aucun URL de prévisualisation n'a été fourni. Le run GitHub Actions associé au dernier commit de cette PR était encore « in progress » lors de la dernière consultation. Aucun déploiement de production n'a été déclenché.

## Limites et prochaine validation

Cet audit ne certifie pas l'affichage réel actuel sur mobile, les liens externes, les formulaires en production, les données Supabase, les DNS, le référencement effectivement indexé ni le résultat du dernier run CI. La validation technique finale doit reposer sur un run complet réussi et une prévisualisation accessible, sans toucher au DNS, à la messagerie, au checkout ou à la production.
