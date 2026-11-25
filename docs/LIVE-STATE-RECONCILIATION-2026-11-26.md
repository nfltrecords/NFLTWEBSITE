# NFLT RECORDS — rapprochement de l'état réel
**Contrôle en direct : 26 novembre 2026**  
**Sources :** dépôt GitHub `nfltrecords/NFLTWEBSITE` branche `main`, API Cloudflare, D1, R2 et Bibliothèque ChatGPT.  
**Règle :** les rapports antérieurs sont des pièces d'historique ; les valeurs ci-dessous proviennent des contrôles du 26 novembre.

## 1. Site, Worker et déploiement

- Worker : `nfltwebsite`.
- Version active : **218**, à **100 %**.
- Déploiement actif : `46889f7a-746c-4e03-a2dd-8ac1577843a1`.
- Version ID : `116dfe27-6421-43d7-a966-8160ab700a2f`.
- Les domaines personnalisés `nflt-records.com` et `www.nflt-records.com` sont activés sur ce Worker.
- La route explicite `nflt-records.com/api/paypal/ipn` est associée au Worker.
- Workers Builds est connecté au dépôt GitHub `nfltrecords/NFLTWEBSITE`, branche `main`, avec `auto_build_enabled=true`, `npm run build` et `npx wrangler deploy`.
- Le dernier build observé `f5c58885-9e41-4a58-a514-92f3fed2aaa1` a terminé avec `build_outcome=success` pour le commit `5ba11a50460023c708aad7a4ea346b2e88b2bdd2`.
- Les commits documentaires poussés sur `main` déclenchent eux aussi un build et un déploiement Worker. Un précédent addendum disant « aucun déploiement Worker » est donc corrigé : le dernier déploiement automatique a bien créé la version 218. Ces commits n'ont pas modifié le code applicatif.
- La vérification HTTP des pages publiques n'a pas pu être terminée depuis l'environnement d'audit : les requêtes sortantes vers le domaine sont bloquées par la politique réseau (403). Les domaines liés et le build réussi ne prouvent pas l'affichage réel de chaque page dans un navigateur.

## 2. Stockage et commandes

### R2 — bucket `nflt-audio-master`, préfixe `18 master/`

- 18 objets WAV, tous avec `Content-Type: audio/wav`.
- 18 objets JPG.
- 1 objet vide de préfixe `18 master/` (0 octet).
- Total : 37 objets.
- `medley.wav (1)` : 69 890 138 octets, ETag `cfa6e5ce2a891f4d09b1c9dcc598eb1f`, MIME `audio/wav`.

### D1 — base `nflt-records-data`

- `shop_release_assets` : 18 associations WAV couvrant 12 UPC.
- Chaque association correspond à un fichier WAV dans R2.
- `shop_orders` : 2 commandes `pending`, 0 `paid`.
- `shop_email_deliveries` : aucune ligne.
- Les requêtes ont été exécutées en lecture seule ; aucune donnée métier n'a été modifiée.

## 3. Catalogue et masters

- Le catalogue comporte 18 sorties et 37 pistes.
- Les 18 décomptes de pistes sont vérifiés dans `docs/track-count-evidence-2026-11-24.md`. Hustle & Grind (UPC `199955715203`) est confirmé à une piste par la capture DistroKid Vault et le M4A source complet de 181,069 secondes.
- 18 pistes disposent d'un master WAV associé dans R2/D1.
- 19 pistes disposent d'un fichier source M4A complet dans la Bibliothèque, mais aucun master WAV original correspondant n'a été retrouvé.
- Répartition des 19 WAV manquants : 5 singles (Hot, Dilemma, #NEVERFAKELIKETHEM, Hustle & Grind, GR 4LIFE), 6 titres de NOUS Y SOMMES et 8 titres de 30.000 GÉNOCIDES.
- Ne jamais convertir les M4A en WAV pour les faire passer pour les masters originaux.
- Les 18 WAV présents et leurs associations D1 ne nécessitent aucune correction au contrôle courant.

## 4. E-mail et secrets

- Le Worker possède `SMTP_HOST`, `SMTP_PORT=465`, `SMTP_USER` et `SMTP_FROM`.
- Le secret `SMTP_PASSWORD` est absent des secrets de la version active.
- Aucune livraison n'est enregistrée dans D1 ; aucun envoi client n'est déclaré réussi.
- Ne pas demander ni placer le mot de passe SMTP dans GitHub ou dans le chat. L'ajout sécurisé dans Cloudflare reste requis, puis un test d'envoi et de réception doit être effectué.

## 5. PayPal et checkout

- Le checkout demeure fermé dans la configuration métier (`checkoutEnabled=false`, approbation explicite non accordée).
- Aucun paiement réel n'est constaté : 0 commande payée.
- Le Worker a une route IPN Classic associée ; le code vérifie la notification auprès de PayPal, le destinataire, le statut, le montant, la devise, le panier et l'unicité de transaction.
- Aucun test Sandbox complet de bout en bout n'est documenté comme réussi.
- Le code PayPal REST/webhook utilise `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID` et, dans le webhook versionné, `SUPABASE_SERVICE_ROLE_KEY`. Ces noms ne figurent pas dans les bindings secrets observés du Worker ; ce chemin REST/webhook n'est donc pas certifié configuré.
- Le checkout doit rester fermé jusqu'aux tests Sandbox/IPN, à la livraison e-mail, à la validation vendeur/droits/TVA et à l'autorisation explicite.

## 6. Lovable, Supabase et administration

- `src/routes/__root.tsx` ne contient plus l'import `reportLovableError` ; le fichier `src/lib/lovable-error-reporting.ts` n'est plus présent sur `main`.
- `AGENTS.md` n'indique plus de synchronisation automatique Lovable.
- Le dossier privé `.lovable/` subsiste, notamment `project.json`, `commerce-config.json` et les brouillons juridiques. Ne pas le supprimer en bloc.
- Des références Supabase restent présentes dans le Worker et dans le code du webhook REST. La sortie complète de Supabase n'est donc pas certifiée.
- Les routes d'administration `/admin/orders` et `/admin/audio` existent dans le code ; le Worker porte le secret `ADMIN_ORDERS_CODE`. Le CRM nominatif complet, les rôles et RLS restent un chantier distinct ; les SQL de fondation sont des brouillons non appliqués.

## 7. Feuille de route — prochaines opérations

1. **WAV originaux :** retrouver les 19 masters source manquants dans les sources d'origine ; importer uniquement les WAV authentiques via l'administration, puis vérifier signature, taille, R2 et association D1.
2. **E-mail :** ajouter `SMTP_PASSWORD` dans Cloudflare via l'interface sécurisée, tester l'envoi et vérifier la réception ainsi que l'état D1.
3. **Préproduction :** ouvrir la PR documentaire/corrective, laisser CI et Workers Preview s'exécuter, tester les routes FR/EN, catalogue, boutique, administration, formulaires et SEO dans un navigateur.
4. **Indépendance :** inventorier les derniers usages Supabase et `.lovable/`, migrer uniquement après remplacement et tests.
5. **PayPal :** tests Sandbox/IPN, cas d'erreur, doublons, remboursements, panier et livraison ; ne pas activer le paiement réel.
6. **Administration métier :** concevoir CRM et rôles sur environnement de développement, jamais en appliquant les SQL drafts directement en production.
7. **Contenu :** vérifier les associations pochettes/UPC et les liens d'application ; radio reste en préparation tant qu'aucun flux n'est configuré.
8. **Production :** toute fusion sur `main` déclenche un déploiement Worker automatique ; tester d'abord sur branche/PR et preview, préparer rollback et demander une autorisation explicite avant la bascule de production.

## 8. Actions non réalisées pendant ce contrôle

Aucun DNS modifié, aucun master remplacé, aucun M4A converti, aucune donnée D1 modifiée, aucun paiement réel, aucun changement Spotify/DistroKid et aucune suppression Lovable. Les rapports ont été corrigés sur une branche dédiée pour revue avant fusion.
