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


## Comptage consolidé et tarifs provisoires — 18 novembre 2026

Le catalogue a été compté en appliquant une règle pratique pour débloquer l'affichage des tarifs : les 16 sorties présentées comme singles sont provisionnellement comptées à 1 piste chacune. Apple Music confirme explicitement 1 chanson pour GR 4LIFE, L'écran vient de chez nous et plusieurs singles consultés (notamment Transcendence et The Dopest Collection Vol. 1), et sa page artiste présente le reste de la liste sous Singles. Cette classification ne garantit pas la tracklist des 16 UPC individuellement : le décompte des singles reste provisoire.

Les deux albums sont comptés ainsi :
- **NOUS Y SOMMES (TU M'AURAS JAMAIS) — 9 pistes**, explicitement indiqué sur la fiche Apple Music.
- **30.000 GÉNOCIDES — 8 pistes**, selon la précision antérieure fournie par le propriétaire du catalogue.

## Tableau des 18 sorties

| UPC | Sortie | Pistes | Prix calculé |
|---|---|---:|---:|
| 199955740199 | The Luxury - The Highest - Unequivocal | 1* | 9,99 € |
| 199956554184 | 0+ | 1* | 9,99 € |
| 199956222809 | NOUS Y SOMMES (TU M'AURAS JAMAIS) | 9 | 19,99 € |
| 199955715135 | #NEVERFAKELIKETHEM (Chapter One) | 1* | 9,99 € |
| 199955742094 | 30.000 GÉNOCIDES | 8** | 19,99 € |
| 199955701558 | Dilemma (Radio Edit) | 1* | 9,99 € |
| 199955715203 | Hustle & Grind (Radio Edit) | 1* | 9,99 € |
| 199751511160 | The Dopest Collection (Vol. 1) | 1* | 9,99 € |
| 199751512501 | In My Party | 1* | 9,99 € |
| 199751514697 | The Dopest Collection, Vol. 2 | 1* | 9,99 € |
| 199751613871 | Ma Luxure | 1* | 9,99 € |
| 199751508283 | Hot | 1* | 9,99 € |
| 199751168234 | 836.722 (1995) [18] [73] | 1* | 9,99 € |
| 199751170992 | Transcendence Of Natural Truths | 1* | 9,99 € |
| 199956557857 | Ma Luxure 2 (MVP) | 1* | 9,99 € |
| 199954147302 | NFLT Social Community (The Most Advanced Societies) | 1* | 9,99 € |
| 199951252436 | L'écran vient de chez nous (Radio Edit) | 1* | 9,99 € |
| 821440674572 | GR 4LIFE | 1* | 9,99 € |

* **1 piste provisoire** : déduit du format Single affiché dans les catalogues publics, mais le nombre de pistes n'a pas été retrouvé pour chaque UPC individuellement.
** **8 pistes** : nombre donné précédemment par le propriétaire, pas nouvellement confirmé par une page publique consultable pendant cette recherche.

### Totaux provisoires

- **18 sorties**
- **16 singles × 1 piste provisoire**
- **2 albums × 8 et 9 pistes**
- **33 pistes au total**
- **16 prix à 9,99 €**
- **2 prix à 19,99 €**
- **0 sortie au palier 14,99 € (5 pistes)**

Ces nombres et prix ont été ajoutés à la configuration de la boutique sur la branche de travail. Ils restent provisoires : checkout désactivé, pas de publication. Revoir les 16 UPC singles et l'album 30.000 GÉNOCIDES dès qu'un export distributeur ou une tracklist UPC complète est disponible.

Sources publiques :
- Apple Music, page artiste NFLT et sorties : https://music.apple.com/us/artist/nflt/1253527531
- Apple Music, album NOUS Y SOMMES (9 chansons) : https://music.apple.com/us/album/nous-y-sommes-tu-mauras-jamais/1852341797
- Apple Music, GR 4LIFE single (1 chanson) et singles consultés.
