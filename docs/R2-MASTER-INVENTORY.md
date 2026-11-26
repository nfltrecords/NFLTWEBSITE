# NFLT RECORDS — inventaire de production R2 et associations D1

**Contrôle direct : 26 novembre 2026**

> **AVIS DE MISE À JOUR — 26 novembre 2026 :** ce document est un relevé historique. Pour l'état courant des masters et de la boutique, consulter en priorité [MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md](MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md). Ne pas reprendre les anciennes synthèses globales ni leurs totaux de disponibilité comme état de production actuel. La référence opérationnelle est la lecture directe D1/R2 et le contrôle dynamique `getCompleteWavTracks`.



- Bucket : `nflt-audio-master`; préfixe : `18 master/`.
- 18 objets WAV en `audio/wav` ; 18 associations dans `shop_release_assets`.
- 18 JPG et un objet vide de préfixe ; aucun M4A utilisé comme master.
- Chaque ligne D1 relue pointe vers un objet R2 existant et sa taille concorde.
- Le nombre 18 est le nombre de fichiers WAV, pas le nombre de UPC distincts.

| UPC | Fichier | Taille (octets) |
|---|---|---:|
| 199751168234 | MASTERPIECE.wav | 20094798 |
| 199751170992 | NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav | 22249550 |
| 199751511160 | NFLTTHEDOPESTCOLLECTIONBEATNFLRECORDS.wav | 24539214 |
| 199751512501 | NFLTINMYPARTYBEATNFLTRECORDS.wav | 21430350 |
| 199751514697 | DCVOL2.wav | 56389454 |
| 199751613871 | NFLT.wav | 30023502 |
| 199951252436 | medley.wav (1) | 69890138 |
| 199954147302 | NINTENDO.wav | 27418446 |
| 199955740199 | NFLTTHELUXURYTHEHIGHESTUNEQUIVOCAL.wav | 90938982 |
| 199956222809 | JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO.wav | 22931498 |
| 199956222809 | JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO2.wav | 27173102 |
| 199956222809 | JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3.wav | 26437294 |
| 199956554184 | Calamite.wav | 40749030 |
| 199956554184 | DebrisFlaqueDechetsCancres.wav | 25476686 |
| 199956554184 | Flatulence.wav | 20727002 |
| 199956554184 | Laplusgrosseenc.wav | 24816974 |
| 199956554184 | NFLTO.wav | 28954446 |
| 199956557857 | Ridewithme.wav | 38723406 |

## Règles de conservation et de vente

- Les originaux WAV ne sont ni convertis, ni recompressés, ni remplacés.
- Les M4A de la Bibliothèque ne remplacent jamais un master WAV.
- La boutique n'autorise un achat que si l'ensemble WAV attendu pour l'UPC est complet et si les objets passent les contrôles R2/KV.
- Ne pas forcer l'état visuel des boutons ni désactiver `getCompleteWavTracks` : le contrôle protège la livraison après paiement.
- Pour l'état par sortie et le fonctionnement des cartes, consulter le document opérationnel ci-dessus.
