# NFLT RECORDS — état PayPal et livraison boutique

**Mise à jour : 26 novembre 2026**

> **AVIS DE MISE À JOUR — 26 novembre 2026 :** ce document est un relevé historique. Pour l'état courant des masters et de la boutique, consulter en priorité [MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md](MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md). Ne pas reprendre les anciennes synthèses globales ni leurs totaux de disponibilité comme état de production actuel. La référence opérationnelle est la lecture directe D1/R2 et le contrôle dynamique `getCompleteWavTracks`.



# NFLT RECORDS — raccordement BigCommerce et sécurité des paiements

**Mise à jour : 26 novembre 2026**

- Le checkout PayPal personnel historique est désactivé dans le code de préparation de la boutique. Ne pas le réactiver.
- Les 18 fiches catalogue sont affichées et les paniers peuvent être préparés sans afficher un faux état « master incomplet » sur les fiches.
- Le bouton de paiement reste désactivé jusqu'au raccordement du vrai compte marchand BigCommerce et aux tests de bout en bout.
- BigCommerce est la plateforme marchande cible ; Cloudflare Worker/R2/D1 reste l'infrastructure du site et des masters WAV.
- Aucun identifiant de boutique BigCommerce, Store Hash, jeton API ou secret BigCommerce n'a été trouvé dans les fichiers GitHub ou les paramètres Worker consultés.
- L'intégration cible doit utiliser les API BigCommerce depuis Cloudflare Worker, avec les secrets uniquement dans les secrets Worker (jamais dans GitHub ou dans le navigateur).
- Les masters WAV originaux restent dans R2 privé. Après paiement BigCommerce confirmé côté serveur, Cloudflare devra autoriser la livraison protégée des fichiers de la commande.
- Aucun master audio n'est déplacé, converti ou remplacé par cette préparation.
- Les paiements restent bloqués jusqu'à connexion du compte marchand, configuration des moyens de paiement BigCommerce et test commande → paiement confirmé → téléchargement sécurisé.
- L'e-mail automatique reste distinct et nécessite la configuration SMTP vérifiée.

## Donnée d'accès nécessaire

L'URL publique de la boutique BigCommerce ou son Store Hash est nécessaire pour identifier le bon magasin et préparer son API account. Ne pas envoyer de mot de passe ou de jeton secret dans GitHub ou dans le chat ; les clés devront être saisies directement dans les secrets Cloudflare après création depuis le panneau BigCommerce.

## Masters et disponibilité

- Production : 18 objets WAV R2 et 18 associations D1, tous inventoriés dans `docs/R2-MASTER-INVENTORY.md`.
- La disponibilité boutique est calculée par `getCompleteWavTracks(upc)`, appelée par `/api/shop-availability` et la création de commande.
- Le contrôle compare le nombre de WAV à `verifiedReleaseTrackCounts`, vérifie la taille et la signature WAV de chaque objet R2, puis refuse toute sortie dont l'ensemble est incomplet.
- Les cartes grisées indiquent que l'API n'a pas validé l'ensemble complet de masters pour cet UPC. Ne pas contourner cette protection en affichant un bouton d'achat actif sans fichiers téléchargeables.

## Livraison

- Après IPN vérifié, la page de confirmation expose les liens de téléchargement protégés par statut de commande.
- Les fichiers livrés sont des WAV originaux depuis R2/KV ; aucun M4A n'est converti ou substitué.
- Le secret Worker `SMTP_PASSWORD` est absent : la livraison par e-mail n'est pas opérationnelle/démontrée. Le téléchargement direct sur la page de confirmation reste le canal prévu.

## Points de validation encore distincts

- Aucun paiement client réel de bout en bout n'a été testé.
- Le vendeur contractuel, les droits/territoires, la TVA, les CGV et les obligations consommateurs doivent être validés séparément.
- Ne jamais confondre activation technique du checkout, paiement réellement confirmé et livraison client testée.


## MISE À JOUR PRIORITAIRE — 26 NOVEMBRE 2026 : ANCIEN FLUX RETIRÉ

Ce rapport décrit l'ancien checkout PayPal du site Cloudflare et le projet BigCommerce ; il ne constitue plus la configuration commerciale actuelle.

- BigCommerce est abandonné et ne doit plus être configuré.
- PayPal relié et approuvé dans Shopify est le moyen de paiement à conserver. Ne pas le désactiver.
- Le verrou du code Cloudflare (`checkoutActivationApproved=false`) ne bloque que l'ancien flux PayPal IPN/API du site principal. Il est volontairement fermé pour éviter une double caisse ; il ne s'applique pas au checkout Shopify.
- La boutique Shopify est la seule caisse : `https://shop.nflt-records.com/`.
- Les paiements Shopify ne doivent pas être globalement désactivés à cause de produits incomplets. Garder simplement les produits sans master WAV complet en brouillon jusqu'à association du fichier dans Digital Products.
- Aucun achat réel de bout en bout n'est encore prouvé. L'approbation PayPal dans Shopify est confirmée selon la capture du propriétaire, mais la transaction et le versement bancaire ne sont pas certifiés.
