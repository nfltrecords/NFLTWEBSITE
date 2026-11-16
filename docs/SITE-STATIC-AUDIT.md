# Audit fonctionnel du site — état du dépôt principal

Audit statique du code de la branche `main`, sans exécution du site ni test de production.

## Catalogue et boutique

- Le catalogue source contient 18 sorties.
- Le script `scripts/audit-assets.mjs` contrôle le nombre de pochettes, les UPC manquants et les MP3 ; le rapport de migration daté du 15 novembre indique 18 pochettes appariées aux 18 UPC.
- La boutique affiche les 18 sorties, leurs pochettes et leurs UPC, et permet de rechercher un titre.
- Chaque sortie propose une demande de disponibilité ; les demandes de licence/disponibilité utilisent un formulaire distinct.
- Le composant `ReleasePrice` n'affiche rien si aucun prix n'est vérifié. Comme `verifiedReleaseTrackCounts` est vide, aucun prix individualisé ne peut actuellement être confirmé par le code.
- Les trois prix affichés sont des tarifs de référence, pas des prix de vente activés. Le site indique explicitement qu'il n'y a ni commande, ni paiement, ni téléchargement sur le site.

## SEO constaté

- `src/lib/seo.ts` déclare 12 groupes de pages publiques avec versions FR/EN, titres, descriptions, canonical, hreflang, Open Graph et Twitter metadata.
- Les pages de conditions de vente et de confidentialité sont explicitement en préparation et `noindex,nofollow`.
- Les pages catalogue individuelles génèrent une metadata `MusicRelease` structurée avec titre, UPC et pochette lorsqu'elle existe.
- La radio est décrite comme « en préparation », cohérent avec l'absence d'URL de flux dans `src/lib/radio.ts`.

## Administration

- `/messages` est une boîte privée de lecture des messages de contact, protégée par un code transmis à une fonction serveur. Elle ne gère ni clients, ni commandes, ni projets, ni contrats, ni factures.
- Le schéma TypeScript Supabase versionné ne déclare que `contact_messages` et `licensing_inquiries`. Le schéma réel du projet Supabase et les politiques RLS ne sont pas vérifiés faute d'accès au compte.

## Dépendance Lovable encore visible

Le composant racine `src/routes/__root.tsx` importe `reportLovableError` depuis `src/lib/lovable-error-reporting.ts`. Ce module utilise des hooks globaux optionnels nommés `__lovableEvents` et `__lovableReportRuntimeError`. Le second est commenté comme présent uniquement dans l'aperçu de l'éditeur. Ce reliquat doit être examiné avant de déclarer la sortie Lovable totalement achevée.

Ne pas supprimer ce code sans tests de non-régression et sans confirmer le mécanisme de journalisation d'erreurs souhaité.

## Limites de cet audit

Cet audit est une lecture statique du dépôt. Il ne certifie pas l'affichage réel sur mobile, les liens externes, les formulaires en production, les données Supabase, les DNS, le référencement effectivement indexé ni le build. La validation complète reste bloquée par l'installation des dépendances et l'absence d'accès aux services externes.
