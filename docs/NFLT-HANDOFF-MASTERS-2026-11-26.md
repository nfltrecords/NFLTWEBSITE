# NFLT RECORDS — état final des 18 masters WAV

> **AVIS DE MISE À JOUR — 26 novembre 2026 :** ce document est un relevé historique. Pour l'état courant des masters et de la boutique, consulter en priorité [MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md](MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md). Ne pas reprendre les anciennes synthèses globales ni leurs totaux de disponibilité comme état de production actuel. La référence opérationnelle est la lecture directe D1/R2 et le contrôle dynamique `getCompleteWavTracks`.


**Contrôle : 26 novembre 2026**

## Résultat

Les 18 fichiers WAV actuellement présents dans le bucket Cloudflare R2 `nflt-audio-master`, préfixe `18 master/`, possèdent chacun une association dans D1 (`shop_release_assets`). Ils sont vérifiés et conservés comme masters originaux. **Attention au périmètre catalogue :** la réconciliation de 37 pistes sur 18 sorties avait identifié 19 pistes supplémentaires uniquement disponibles en M4A dans la Bibliothèque, sans master WAV original retrouvé. Ces M4A ne sont pas des masters WAV et ne sont pas convertis. Le présent état clôture donc le contrôle et la correction des 18 WAV existants ; il ne certifie pas la disponibilité WAV des 37 pistes.

- 18 objets WAV dans R2 ; 18 associations D1.
- 19 pistes supplémentaires du catalogue 37 pistes restent à fournir/retrouver en WAV original ; les sources M4A sont préservées séparément et exclues de la livraison master.
- Les signatures RIFF/WAVE ou RF64/WAVE et les tailles ont été vérifiées lors de l'audit audio précédent.
- Les fichiers originaux ne sont ni convertis, ni recompressés, ni remplacés.
- Correction effectuée le 26/11 : `18 master/medley.wav (1)` avait le type MIME générique `application/octet-stream`. Sa signature a été vérifiée (`RIFF/WAVE`), puis le même contenu binaire (69 890 138 octets) a été réenregistré avec `Content-Type: audio/wav`. L'ETag est resté identique (`cfa6e5ce2a891f4d09b1c9dcc598eb1f`) et une relecture a confirmé la même taille et la signature WAV.

## Inventaire des 18 masters

| UPC | Fichier | Taille (octets) |
|---|---|---:|
| 199751168234 | MASTERPIECE.wav | 20 094 798 |
| 199751170992 | NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav | 22 249 550 |
| 199751511160 | NFLTTHEDOPIESTCOLLECTIONBEATNFLTRECORDS.wav | 24 539 214 |
| 199751512501 | NFLTINMYPARTYBEATNFLTRECORDS.wav | 21 430 350 |
| 199751514697 | DCVOL2.wav | 56 389 454 |
| 199751613871 | NFLT.wav | 30 023 502 |
| 199951252436 | medley.wav (1) | 69 890 138 |
| 199954147302 | NINTENDO.wav | 27 418 446 |
| 199955740199 | NFLTTHELUXURYTHEHIGHESTUNEQUIVOCAL.wav | 90 938 982 |
| 199956222809 | JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO.wav | 22 931 498 |
| 199956222809 | JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO2.wav | 27 173 102 |
| 199956222809 | JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3.wav | 26 437 294 |
| 199956554184 | Calamite.wav | 40 749 030 |
| 199956554184 | DebrisFlaqueDechetsCancres.wav | 25 476 686 |
| 199956554184 | Flatulence.wav | 20 727 002 |
| 199956554184 | Laplusgrosseenc.wav | 24 816 974 |
| 199956554184 | NFLTO.wav | 28 954 446 |
| 199956557857 | Ridewithme.wav | 38 723 406 |

## État opérationnel boutique

Les 18 masters WAV et leurs 18 associations D1 sont présents en production. Les associations couvrent les UPC listés dans le rapport opérationnel courant ; le nombre de fichiers WAV ne doit pas être confondu avec le nombre de sorties catalogue. La boutique calcule la disponibilité par UPC en vérifiant le nombre de pistes attendu et l'intégrité des objets. Voir `docs/MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md` avant toute modification ou publication.

Le verrou de paiement et la livraison sont décrits dans `docs/PAYPAL-CHECKOUT-READINESS.md`. Le secret SMTP reste absent ; aucun e-mail client n'est déclaré opérationnel.

Aucun master original n'a été converti, recompressé ou remplacé.
