# NFLT RECORDS — état PayPal et livraison boutique

**Mise à jour : 26 novembre 2026**

> **AVIS DE MISE À JOUR — 26 novembre 2026 :** ce document est un relevé historique. Pour l'état courant des masters et de la boutique, consulter en priorité [MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md](MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md). Ne pas reprendre les anciennes synthèses globales ni leurs totaux de disponibilité comme état de production actuel. La référence opérationnelle est la lecture directe D1/R2 et le contrôle dynamique `getCompleteWavTracks`.



## Paiement

- Le checkout PayPal Classic/IPN est ouvert dans le code de production à la demande explicite du propriétaire le 26 novembre.
- La commande est créée uniquement après vérification serveur de la disponibilité complète des masters de chaque UPC.
- Le statut `paid` dépend de l'IPN PayPal vérifié ; le retour navigateur ne suffit pas.
- Aucun achat réel de bout en bout n'a encore été constaté dans D1. Ne pas annoncer qu'une transaction client a été testée.

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
