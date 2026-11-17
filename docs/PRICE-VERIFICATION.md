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


## Relevé exhaustif de la preuve disponible — 17 novembre 2026

Le rapport interne de preuves du 14 novembre et le fichier `.lovable/catalogue-readiness-review.json` ont été relus pour les 18 UPC. Ils indiquent explicitement `trackCount: null` et `awaiting-UPC-specific-tracklist-evidence` pour les 18 sorties. Le rapport confirme qu'aucun écran disponible ne montre le nombre total de pistes rattaché sans ambiguïté à chaque UPC.

**Résultat : 0 prix individuels validables sur 18.** Les trois paliers de référence restent conservés, mais aucun UPC ne reçoit arbitrairement un nombre de pistes ou un prix. Les fichiers audio ne sont pas rouverts ni analysés dans le cadre de cette étape, conformément à l'arrêt de ce chantier.

| Contrôle | Résultat |
|---|---:|
| Sorties au catalogue | 18 |
| UPC avec nombre de pistes documenté | 0 |
| UPC avec prix individuel justifié | 0 |
| UPC en attente de preuve par sortie | 18 |

La seule manière de débloquer les 18 lignes est une source écrite indiquant, pour chaque UPC, sa liste complète de pistes ou son total certifié. Les noms de fichiers, les titres, les extraits et les numéros de pistes isolés ne sont pas des preuves suffisantes.
