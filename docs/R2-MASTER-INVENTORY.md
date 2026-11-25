# NFLT RECORDS — inventaire R2 des masters WAV

Vérification directe du bucket Cloudflare R2 `nflt-audio-master` le 25 novembre 2026.

## Résultat du relevé

- Bucket R2 : `nflt-audio-master` (seul bucket R2 visible sur le compte connecté).
- Préfixe audio : `18 master/`.
- Objets WAV recensés : **18**.
- Pochettes JPG recensées dans le même préfixe : **18**.
- Enregistrements correspondants dans D1 `shop_release_assets` : **18**.
- Les 18 lignes D1 pointent vers un objet R2 (`asset_key = r2:<clé>`) et ont `chunk_count = 1`.
- Ce relevé corrige l'ancienne conclusion erronée « 19 masters manquants » : cette conclusion provenait de la comparaison avec des nombres de pistes attendus dans le code, et non d'une absence constatée des fichiers WAV dans R2.

## WAV présents dans R2 et associations D1

| UPC | Nom du master | Taille (octets) |
|---|---|---:|
| 199751168234 | MASTERPIECE.wav | 20094798 |
| 199751170992 | NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav | 22249550 |
| 199751511160 | NFLTTHEDOPIESTCOLLECTIONBEATNFLTRECORDS.wav | 24539214 |
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

Toutes les clés listées sont sous `18 master/`. Le fichier `medley.wav (1)` est conservé sous son nom R2 d'origine et reste associé à l'UPC `199951252436`, conformément à la confirmation du propriétaire.

## Pochettes

18 objets JPG de pochette sont également présents sous `18 master/`. Leurs noms sont des identifiants techniques générés ; ne pas les renommer ni modifier leur association sans vérification visuelle.

## Règles de conservation

- Ne pas supprimer ni renommer les masters WAV recensés.
- Ne pas traiter les fichiers M4A pleine durée comme des extraits de 30 secondes.
- Ne pas réintroduire d'extraits audio de 30 secondes.
- Ne pas déclarer un master absent à partir du seul nombre attendu dans `verifiedReleaseTrackCounts`.
- Avant toute modification d'association UPC, confronter le nom du fichier et la tracklist fournie par le propriétaire.
- Le présent relevé constate la présence des objets et leurs associations D1 ; il ne prétend pas certifier l'écoute, la durée ni le contenu audio de chaque master.
