# NFLT RECORDS — mise en service de la livraison audio

## Ce qui est préparé dans cette branche

- capture PayPal contrôlée côté serveur, puis livraison déclenchée uniquement après statut `paid`;
- liens de téléchargement signés HMAC, liés à une commande payée et expirant après 7 jours;
- endpoint privé qui lit le master depuis le bucket R2, sans rendre le bucket public;
- e-mail client via Resend avec clé d'idempotence, si les identifiants d'envoi sont configurés;
- page de retour PayPal avec bouton de téléchargement;
- migration additive pour les dates de paiement/livraison et la correspondance UPC → objet R2.

## Bloqueurs avant test réel

1. Activer R2 dans le tableau de bord Cloudflare. L'API du compte répond actuellement que R2 doit d'abord être activé dans le tableau de bord.
2. Créer ensuite un seul bucket privé nommé `nflt-audio-master` et conserver le binding `NFLT_AUDIO` de `wrangler.jsonc`.
3. Appliquer `drizzle/migrations/0003_shop_order_delivery.sql` au projet Supabase utilisé par le site. La migration précédente `0002` doit déjà être appliquée.
4. Ajouter dans les secrets du Worker : `SUPABASE_SERVICE_ROLE_KEY`, `DELIVERY_TOKEN_SECRET` (au moins 32 caractères aléatoires), `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `RESEND_API_KEY`, `DELIVERY_FROM_EMAIL`. Garder `PAYPAL_MODE=sandbox` pendant les essais.
5. Vérifier le domaine expéditeur chez le fournisseur d'e-mail et faire un test de réception.
6. Importer les masters complets dans le bucket, puis remplir `shop_release_assets` avec les UPC et clés R2 exactes. Les extraits de préécoute 30 secondes ne sont pas des masters de livraison.
7. Tester paiement accepté, refus, annulation, webhook dupliqué, commande déjà payée, e-mail, téléchargement expiré et fichier absent.

## Activation

Le verrou de paiement dans `src/lib/paypal-checkout-gate.ts` reste volontairement fermé. Ne pas le modifier avant que les masters, le stockage, la base, l'e-mail, les webhooks et les tests sandbox soient validés. Aucun déploiement de production n'est inclus dans cette branche.
