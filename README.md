# NFLT RECORDS — site web

Dépôt source du site NFLT RECORDS. Le code est versionné sur GitHub et préparé pour un hébergement Cloudflare Workers.

## Stack

- TanStack Start
- React + TypeScript
- Tailwind CSS
- Vite
- Cloudflare Workers / Wrangler
- Supabase pour les fonctions et données qui sont explicitement configurées

## Développement local

Prérequis : Node.js compatible avec les versions définies par Vite et Wrangler, et npm.

```sh
git clone https://github.com/nfltrecords/NFLTWEBSITE.git
cd NFLTWEBSITE
npm ci
npm run dev
```

Vérifications avant proposition de fusion :

```sh
npm test
npm run lint
npm run build
```

## Prévisualisation Cloudflare

La branche de préparation `work/operations-readiness` utilise Workers Previews. La configuration Wrangler contient le bloc `previews` nécessaire et la commande de prévisualisation est :

```sh
npx wrangler preview
```

La prévisualisation est isolée de la production. Ne pas remplacer cette commande par `wrangler deploy` dans une configuration de Preview.

## Production

Aucun déploiement de production ne doit être lancé depuis une branche de préparation. Avant toute publication :

1. vérifier les résultats CI, les variables d'environnement et les bindings ;
2. confirmer le nom réel du Worker et les routes associées ;
3. vérifier les formulaires, l'authentification, la base de données et les politiques RLS ;
4. valider séparément les paiements, les livraisons, les obligations commerciales et les textes juridiques ;
5. sauvegarder la configuration DNS et préserver les enregistrements de messagerie ;
6. obtenir l'approbation explicite du propriétaire pour le déploiement.

## Intégrations et secrets

Ne jamais versionner les clés API, jetons, mots de passe, identifiants de paiement ou secrets Supabase. Configurer les secrets dans les environnements des fournisseurs concernés.

Le répertoire historique `.lovable/` contient encore des documents internes et des fichiers de configuration utilisés par des tests. Sa migration ou suppression doit être faite fichier par fichier après remplacement de chaque référence ; ne pas le supprimer en bloc.

## État commercial

Le panier est un outil de préparation uniquement. Le paiement en ligne est désactivé jusqu'à validation du vendeur, des droits, des prix par UPC, des commandes, des remboursements et des modalités de livraison. La radio reste inactive tant qu'un flux HTTPS vérifié n'est pas configuré.
