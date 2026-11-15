# NFLT RECORDS — préparation Cloudflare Workers

Cette archive contient le code source exporté de Lovable, les 18 pochettes originales récupérées dans l'archive média antérieure, les 37 extraits MP3 et les premiers changements de portage vers le plugin Vite officiel de Cloudflare.

## Important

- Le domaine `nflt-records.com` et les enregistrements DNS/e-mail ne sont pas modifiés par cette archive.
- Aucun déploiement de production n'a été effectué.
- Le build n'a pas encore été validé dans cet environnement : l'installation npm a expiré avant la fin, faute de dépendances locales disponibles.
- Les routes serveur utilisant Supabase, les formulaires, les éventuels accès administrateur et les fonctions commerce doivent être testés et configurés avec les variables d'environnement Cloudflare avant toute mise en production.
- Le checkout et les paiements Revolut ne sont pas activés ici.
- Le `.env` exporté de Lovable n'est volontairement pas inclus. Utiliser `.env.example` comme liste des variables, puis configurer les valeurs comme secrets/variables dans Cloudflare. Ne jamais publier de clé secrète dans le dépôt.

## Installation et vérification locale

Node.js 22 ou supérieur :

```bash
npm install
npm run build
npm test
npm run preview
```

## Déploiement Worker (après validation seulement)

```bash
npx wrangler login
npm run deploy
```

Le Worker s'appelle `nflt-records`. Le fichier `wrangler.jsonc` ne rattache pas le domaine personnalisé. Tester d'abord l'URL `workers.dev`, puis seulement après validation prévoir le rattachement du domaine sans toucher aux enregistrements mail.

## Ressources

- Pochettes : `public/assets/covers/<UPC>.jpg` (18 fichiers)
- Extraits : `public/assets/previews/` (37 fichiers)
- Logo d'attente : favicon NFLT RECORDS existant. Le binaire original du logo doré n'était pas présent dans l'export source ni dans l'archive média locale.
