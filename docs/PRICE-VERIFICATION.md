# Vérification des prix par sortie

## Barème de référence

- 1 piste : 9,99 € ;
- 5 pistes : 14,99 € ;
- 6 pistes ou plus : 19,99 €.

Le code ne définit pas de prix pour les sorties de 2, 3 ou 4 pistes.

## Décomptes vérifiés

Au 25 novembre 2026, `src/lib/commerce.ts` contient 18 UPC dans `verifiedReleaseTrackCounts`. Les preuves sont consignées dans `docs/track-count-evidence-2026-11-24.md`.

| UPC | Sortie | Pistes | Prix calculé |
|---|---|---:|---:|
| 199751168234 | 836.722 (1995) [18] [73] | 1 | 9,99 € |
| 199751170992 | Transcendence Of Natural Truths | 1 | 9,99 € |
| 199751508283 | Hot | 1 | 9,99 € |
| 199751511160 | The Dopest Collection Vol. 1 | 1 | 9,99 € |
| 199751512501 | In My Party | 1 | 9,99 € |
| 199751514697 | The Dopest Collection Vol. 2 | 1 | 9,99 € |
| 199751613871 | Ma Luxure | 1 | 9,99 € |
| 199951252436 | L'écran vient de chez nous (Radio Edit) | 1 | 9,99 € |
| 199954147302 | NFLT Social Community (The Most Advanced Societies) | 1 | 9,99 € |
| 199955701558 | Dilemma (Radio Edit) | 1 | 9,99 € |\n| 199955715203 | Hustle & Grind (Radio Edit) | 1 | 9,99 € |
| 199955715135 | #NEVERFAKELIKETHEM (Chapter One) | 1 | 9,99 € |
| 199955740199 | The Luxury - The Highest - Unequivocal | 1 | 9,99 € |
| 199955742094 | 30.000 GÉNOCIDES | 8 | 19,99 € |
| 199956222809 | NOUS Y SOMMES (TU M'AURAS JAMAIS) | 9 | 19,99 € |
| 199956554184 | 0+ | 5 | 14,99 € |
| 199956557857 | Ma Luxure 2 (MVP) | 1 | 9,99 € |
| 821440674572 | GR 4LIFE | 1 | 9,99 € |

Les 18 décomptes sont maintenant vérifiés. Hustle & Grind est confirmé à 1 piste par la capture DistroKid Vault et le fichier source complet `Hustlegrind.m4a`.

## État technique et commercial

- 18 sorties au catalogue.
- 18 décomptes vérifiés ; 37 pistes au total sur les 18 sorties.
- Aucun extrait MP3 de 30 secondes ni lecteur de préécoute n’est présent dans le catalogue actif de `main`.
- Le prix calculé ne prouve ni la disponibilité des masters WAV, ni les droits de vente, ni la validation du vendeur légal, des territoires, de la TVA ou des conditions de vente.
- Le checkout PayPal reste désactivé côté code. La correction technique et les tests ne valent pas autorisation d'encaisser des paiements réels.

## Règle de publication

Ne pas ouvrir le checkout pour un UPC tant que son prix, ses masters WAV complets et les conditions commerciales applicables ne sont pas validés. Ne jamais utiliser un M4A ou un MP3 de préécoute comme fichier de livraison.
