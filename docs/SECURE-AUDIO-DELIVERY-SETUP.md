# NFLT RECORDS — mise en service de la livraison audio

## Architecture préparée

- Le checkout PayPal existant est conservé.
- La notification PayPal vérifiée déclenche la livraison uniquement après passage de la commande à `paid`.
- Les WAV sont lus depuis un bucket Supabase Storage privé nommé `nflt-private-audio`; aucun objet n'est public.
- Le lien est signé HMAC, lié à une commande payée et valable 7 jours.
- L'e-mail client est envoyé via Resend avec une clé d'idempotence.
- Le navigateur ne reçoit jamais la clé service-role.

## Configuration serveur requise

Configurer sur le Worker de production `nfltwebsite` :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — clé serveur du projet Supabase utilisé par le site
- `DELIVERY_TOKEN_SECRET` — secret aléatoire indépendant d'au moins 32 caractères
- `RESEND_API_KEY`
- `DELIVERY_FROM_EMAIL` — adresse expéditrice validée chez Resend
- `ADMIN_ORDERS_CODE` — code administrateur indépendant

Ne pas mettre ces secrets dans le code, GitHub, ni dans le navigateur.

## Base et stockage

Appliquer dans l'ordre les migrations de commandes existantes, puis :

- `drizzle/migrations/0003_shop_order_delivery.sql`
- `drizzle/migrations/0004_paypal_ipn_transaction.sql`
- `drizzle/migrations/0005_supabase_private_audio_storage.sql`

La migration 0005 crée le bucket privé et ajoute `storage_object_path` à `shop_release_assets`. Les objets doivent être importés dans ce bucket et leur chemin privé associé à l'UPC exact. Les masters complets uniquement : jamais les MP3 de préécoute.

## Vérifications avant mise en production

- Confirmer que les migrations sont appliquées sur le projet Supabase de production.
- Confirmer que le bucket privé existe et que le Worker peut lire un objet avec la clé serveur.
- Importer les masters complets et vérifier chaque chemin de stockage.
- Vérifier le domaine expéditeur Resend et recevoir un e-mail de test.
- Tester les paiements confirmés, refusés, annulés et les notifications dupliquées.
- Tester les liens expirés, les tokens invalides et les objets absents.

Aucun changement de verrou ou de comportement du checkout PayPal n'est requis par cette migration. Ne pas publier la livraison avant que le stockage, les secrets, l'e-mail et le test complet soient validés.
