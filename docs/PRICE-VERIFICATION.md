# Vérification des prix par sortie

## Barème actuellement présent dans le code

Le code définit trois paliers de référence :
- 1 piste : 9,99 € ;
- 5 pistes : 14,99 € ;
- 6 pistes ou plus : 19,99 €.

Le code ne définit pas de prix pour les sorties de 2, 3 ou 4 pistes.

## État constaté

Dans `src/lib/commerce.ts`, `verifiedReleaseTrackCounts` est vide. La fonction `releasePriceCents(upc)` renvoie donc `null` pour les sorties du catalogue. Le composant de prix ne peut pas afficher un prix individualisé tant que le nombre de pistes de chaque UPC n'est pas prouvé.

Le catalogue contient 18 sorties. Aucun nombre de pistes par UPC n'est actuellement validé dans ce fichier de configuration.

## Procédure de validation requise

Pour chaque UPC, obtenir une source fiable (fiche distributeur, livraison originale ou inventaire de masters) et relever :
1. UPC exact ;
2. titre exact ;
3. nombre de pistes incluses dans le produit numérique vendu ;
4. source de vérification et date ;
5. confirmation que les fichiers livrables et les droits de vente correspondent.

Ne pas déduire le nombre de pistes du titre, de la pochette, des extraits disponibles ou d'un nom de dossier.

## Règle de publication

- N'ajouter un UPC à `verifiedReleaseTrackCounts` qu'après vérification documentaire.
- Ne pas attribuer automatiquement 9,99 €, 14,99 € ou 19,99 € sans nombre de pistes confirmé.
- Ne pas activer de checkout ni annoncer une vente finalisée avant validation des prix, fichiers, droits, fiscalité et vendeur contractuel.
- Conserver les demandes de disponibilité/licence comme parcours de contact tant que ces conditions ne sont pas réunies.
