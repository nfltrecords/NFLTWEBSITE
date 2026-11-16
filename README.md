# NFLT RECORDS — site web

Site officiel du label NFLT RECORDS, développé avec React, TypeScript, TanStack Start et Cloudflare Workers.

## Développement local

Prérequis : Node.js (version définie dans la configuration du dépôt) et npm.

```bash
git clone https://github.com/nfltrecords/NFLTWEBSITE.git
cd NFLTWEBSITE
npm ci
npm run dev
```

## Contrôles avant toute publication

Exécuter dans cet ordre :

```bash
node scripts/audit-assets.mjs
npm run lint
npm test
npm run build
```

Ne pas publier si un contrôle échoue. Le workflow GitHub Actions « Verify source » effectue les contrôles de tests, lint et build après installation des dépendances.

## Architecture et services

- Frontend et routes : TanStack Start, React et TypeScript.
- Styles : Tailwind CSS.
- Hébergement cible : Cloudflare Workers via le plugin Vite Cloudflare.
- Données et fonctions serveur : Supabase.
- Ressources publiques : répertoire `public/` (pochettes, extraits et médias).

## Configuration serveur

Les valeurs sont à configurer comme secrets/variables dans l'environnement d'hébergement, jamais dans le dépôt :

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — uniquement pour les opérations serveur privilégiées qui en ont besoin.
- `ADMIN_MESSAGES_CODE` — uniquement si l'accès privé aux messages est conservé.

Ne jamais exposer une clé de service Supabase dans le navigateur ou dans un fichier versionné.

## Publication et migration

La commande `npm run deploy` publie sur Cloudflare. Elle ne doit être lancée qu'après validation locale complète, configuration des secrets et vérification de l'environnement cible. La publication, les DNS et les services externes sont volontairement séparés des changements de code.

Avant de basculer le domaine `nflt-records.com`, préserver les enregistrements de messagerie LWS (MX, SPF, DKIM et DMARC) et valider le site sur une URL de prévisualisation.

## Boutique, licences et radio

La boutique reste non transactionnelle tant que les tarifs par sortie, les fichiers livrés, les conditions de vente, la fiscalité et le parcours de paiement ne sont pas validés. Les demandes de licences passent par le formulaire existant. La radio reste inactive tant qu'une URL de flux HTTPS réelle n'est pas configurée et testée.

## Gouvernance

Les modifications fonctionnelles sont préparées sur une branche dédiée et proposées par pull request. Ne pas fusionner dans `main` ni modifier la production sans validation explicite.
