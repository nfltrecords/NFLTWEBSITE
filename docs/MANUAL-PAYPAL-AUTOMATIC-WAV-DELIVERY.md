# PayPal — livraison WAV via Cloudflare

## Parcours

1. La boutique crée une commande `pending` dans Cloudflare D1.
2. Le client règle via le checkout PayPal standard.
3. Le serveur transmet l’IPN brut à PayPal pour vérification cryptographique.
4. Le serveur contrôle la référence, le destinataire, le statut, la devise et le montant exacts avant de passer la commande à `paid` dans D1.
5. La page de confirmation interroge le statut et propose le WAV dès que le master associé à l’UPC est présent dans KV.
6. Le Worker diffuse le fichier en blocs depuis Cloudflare KV.

## Stockage

- D1 : `shop_orders` et `shop_release_assets`.
- KV : namespace `nflt-audio-chunks`, valeurs binaires de 20 Mio maximum par bloc.
- Le chemin de téléchargement vérifie que la commande est payée avant de lire le premier bloc.
- L’envoi par e-mail n’est pas inclus dans cette version.

## Transfert des masters

La page `/admin/audio` utilise `ADMIN_ORDERS_CODE` et envoie les WAV en blocs. Chaque bloc est contrôlé avant que la ligne d’association UPC soit validée dans D1. Limite d’upload actuelle : 110 Mio par fichier.

## Vérifications avant production

- Tests, lint et build GitHub réussis.
- Tous les masters attendus chargés dans KV et associés au bon UPC.
- Test réel PayPal/IPN avec montant, devise et destinataire exacts.
- Téléchargement complet du WAV depuis la page de confirmation.
- Vérification qu’une commande non payée ne permet aucun téléchargement.

Le flux PayPal Orders API distinct reste désactivé. Le checkout PayPal manuel est conservé.