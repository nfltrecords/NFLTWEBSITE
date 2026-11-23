# PayPal.Me — livraison WAV automatique

## Parcours prévu

1. La boutique crée une commande privée dans `shop_orders`.
2. Le client règle via le parcours PayPal déjà présent et ajoute la référence de commande demandée.
3. Le serveur vérifie la notification PayPal auprès de PayPal.
4. Le paiement n'est accepté que si le statut, le destinataire, la devise, le montant et la référence correspondent à la commande.
5. Après confirmation, le serveur associe l'UPC au chemin du master dans le bucket Supabase Storage privé `nflt-private-audio`.
6. Le serveur crée un lien HMAC valable 7 jours et envoie le lien par Resend.

**Limite à vérifier :** le flux PayPal.Me/IPN dépend de la présence de la référence saisie par le client dans le champ `memo` de la notification IPN. Ce comportement doit être confirmé par un paiement réel de faible montant avant de considérer la livraison comme validée.

## Migrations

Appliquer dans l'ordre les migrations de commandes, puis :

- `drizzle/migrations/0003_shop_order_delivery.sql`
- `drizzle/migrations/0004_paypal_ipn_transaction.sql`
- `drizzle/migrations/0005_supabase_private_audio_storage.sql`

Ne jamais exposer la clé service-role au navigateur.

## Secrets serveur

Configurer sur le Worker `nfltwebsite` : `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DELIVERY_TOKEN_SECRET`, `RESEND_API_KEY`, `DELIVERY_FROM_EMAIL` et `ADMIN_ORDERS_CODE`.

## Correspondance et transfert des masters

Chaque ligne de `shop_release_assets` doit associer un UPC existant à un `storage_object_path` exact dans le bucket privé. Ne pas utiliser les aperçus MP3 comme masters et ne pas deviner les correspondances manquantes.

## Tests avant activation

Vérifier la notification PayPal, la commande payée, l'e-mail reçu, le téléchargement WAV réel, l'expiration du lien et le refus d'un token invalide. Le checkout PayPal existant n'est pas désactivé ni remplacé par ce changement.
