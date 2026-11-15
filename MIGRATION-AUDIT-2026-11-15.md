# NFLT RECORDS — audit de préparation Cloudflare

Date : 15 novembre 2026

## Éléments vérifiés dans l'export source

- 18 sorties dans `src/lib/catalogue.ts`.
- 18 fichiers JPG de pochettes dans `public/assets/covers/`.
- Les 18 UPC du catalogue ont chacun un fichier JPG correspondant ; aucun UPC manquant et aucun JPG non référencé.
- Les 18 JPG sont en 1536 × 1536 px ; aucune conversion, compression ou mise à l'échelle n'a été effectuée.
- 37 extraits MP3 dans `public/assets/previews/`.
- 32 routes React (`src/routes/*.tsx`).
- 9 fichiers de tests (`src/test/*.test.*`).
- Le code des pochettes utilise des chemins locaux `/assets/covers/<UPC>.jpg`, et non des URL d'assets Lovable.

## Blocages avant mise en ligne

1. Le build n'est pas validé : `npm install` a dépassé le délai disponible dans l'environnement de préparation, qui ne disposait pas de dépendances installées. Aucun résultat de `npm run build` ne peut donc être revendiqué.
2. Le fichier `.env` contenant les valeurs de configuration n'est pas livré dans l'archive. Les variables Supabase doivent être renseignées comme secrets/variables du Worker avant de tester les formulaires et les fonctions serveur : `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (uniquement si l'administration des messages est activée), `ADMIN_MESSAGES_CODE` (si cette fonction est conservée).
3. Le dépôt utilise Supabase ; aucun D1 n'est actuellement créé dans le compte Cloudflare. Il ne faut pas créer D1 simplement pour cette migration sans modifier d'abord l'architecture applicative.
4. Le bucket R2 n'est pas activé sur le compte ; il n'est pas nécessaire pour servir les ressources publiques déjà placées dans `public/`.
5. Le checkout et les paiements Revolut ne sont pas actifs. Ne pas annoncer de paiement opérationnel.

## Sécurité et DNS

- Aucun secret `.env` n'est inclus dans cette archive.
- Aucun déploiement Worker n'a été effectué dans le cadre de cet audit.
- Le DNS de l'apex `nflt-records.com` pointe encore vers `185.158.133.1` (DNS only) et `www` est un CNAME vers l'apex (DNS only).
- Le MX `nflt-records.com` vers `mail.nflt-records.com` et l'A `mail.nflt-records.com` vers `213.255.195.52` sont présents et doivent être préservés pour l'e-mail LWS.
- Aucun enregistrement DNS n'a été modifié.

## Commandes de validation à exécuter dans un environnement avec accès au registre npm

```bash
npm ci
node scripts/audit-assets.mjs
npm run lint
npm test
npm run build
```

La publication doit attendre la réussite de ces contrôles et un test de prévisualisation sur l'URL `workers.dev`. Le domaine personnalisé ne doit être rattaché qu'après validation complète.
