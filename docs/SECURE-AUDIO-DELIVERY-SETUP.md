# NFLT RECORDS — mise en service de la livraison audio

## Architecture actuelle — livraison WAV sans Supabase ni R2

- Le checkout manuel PayPal standard est conservé.
- Les commandes et les associations UPC/audio sont stockées dans Cloudflare D1 (`nflt-records-data`).
- Les masters WAV sont stockés dans Cloudflare KV (`nflt-audio-chunks`) en blocs de 20 Mio, sous la limite de taille par valeur KV.
- L’IPN PayPal est vérifié auprès de PayPal avant que la commande passe à `paid`.
- La page de confirmation interroge D1 et affiche le téléchargement dès que le paiement et le master sont confirmés.
- Le téléchargement est diffusé en flux, bloc par bloc, sans charger tout le WAV en mémoire.
- Aucun e-mail automatique n’est envoyé dans cette version : le client télécharge depuis la page de confirmation. Aucun service e-mail externe n’est requis.
- Le transfert administrateur est disponible sur `/admin/audio`; l’endpoint est protégé par `ADMIN_ORDERS_CODE`.

## Ressources Cloudflare

- D1 : `nflt-records-data`, binding `DB`
- KV : `nflt-audio-chunks`, binding `AUDIO_KV`
- Worker : `nfltwebsite`

Les tables `shop_orders` et `shop_release_assets` sont créées dans D1. Les WAV ne sont pas encore chargés dans KV tant que le transfert n’a pas été exécuté.

## Import des masters

1. Ouvrir `/admin/audio` sur la version déployée.
2. Fournir le code administrateur déjà configuré dans `ADMIN_ORDERS_CODE`.
3. Sélectionner l’UPC exact dans le catalogue et le master WAV correspondant.
4. L’interface transfère les blocs de 20 Mio, contrôle chaque taille, puis vérifie la présence de tous les blocs avant d’enregistrer la ligne D1.
5. Recommencer pour les masters disponibles.

Le plafond actuel de l’interface est 110 Mio par fichier. Les masters WAV complets uniquement doivent être utilisés, jamais les MP3 de préécoute.

## Contrôles obligatoires avant d’annoncer la mise en service

- Les workflows GitHub doivent terminer avec succès.
- La compilation de production doit réussir.
- Transférer les masters et vérifier leur présence dans KV.
- Vérifier que la page de confirmation détecte une commande payée et un master existant.
- Effectuer un achat PayPal de test réel, vérifier l’IPN et télécharger le WAV reçu.
- Vérifier les paiements refusés, les commandes non payées, les références invalides et les fichiers manquants.

Ne pas publier la fonctionnalité de paiement/téléchargement en production avant ces vérifications. Ne pas activer le flux PayPal Orders API désactivé séparément.