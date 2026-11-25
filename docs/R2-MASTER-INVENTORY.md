# NFLT RECORDS — inventaire R2 des masters WAV

Vérification directe du bucket Cloudflare R2 `nflt-audio-master` le 25 novembre 2026.

## Résultat du relevé

- Bucket R2 : `nflt-audio-master` (seul bucket R2 visible sur le compte connecté).
- Préfixe audio : `18 master/`.
- Objets WAV recensés : **18**.
- Pochettes JPG recensées dans le même préfixe : **18**.
- Enregistrements correspondants dans D1 `shop_release_assets` : **18**.
- Les 18 lignes D1 pointent vers un objet R2 (`asset_key = r2:<clé>`) et ont `chunk_count = 1`.
- Ce relevé prouve la présence des 18 WAV listés dans R2. Il ne signifie pas que les 37 pistes du catalogue disposent toutes d'un master WAV : 19 pistes supplémentaires ont un fichier M4A complet dans le Library, mais aucun WAV correspondant n'a été trouvé dans R2 ni dans les archives vérifiées. Ces M4A ne sont pas des masters WAV et ne doivent pas être livrés comme tels.

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


## Contrôles complémentaires du 25 novembre 2026

- Les 18 WAV de R2 ont une signature valide : `RIFF` ou `RF64` aux octets 0–3, puis `WAVE` aux octets 8–11.
- Les 17 copies locales retrouvées correspondent aux ETag MD5 des objets R2. Le fichier `JAIPAS...2.wav` est présent et valide dans R2, mais aucune copie locale de ce nom n'a été retrouvée.
- Le Library contient un doublon `JAIPAS...3(1).wav`, identique octet par octet à `JAIPAS...3.wav`. Il n'est pas enregistré comme objet R2 supplémentaire.
- Les 19 M4A retrouvés dans le Library ont une durée comprise entre 71,332 et 210,233 secondes. Ce sont des fichiers audio complets ; aucun n'est un extrait de 30 secondes. Ils ne sont pas présents dans le bucket R2.
- Les 18 JPG de R2 ont été mesurés à 3000 × 3000 pixels. Les 18 pochettes publiques de l'archive corrigée mesurent 1536 × 1536 pixels. Les noms R2 sont rapprochés des 18 UPC par le dossier d'artwork : 16 correspondances étayées par captures et 2 confirmées par le propriétaire. Ne pas remplacer les images publiques sans comparaison visuelle et binaire.
- Le relevé complet du bucket contient 37 objets : 18 WAV, 18 JPG et un objet vide correspondant au préfixe `18 master/`.
- Les 18 associations D1 sont cohérentes avec les objets R2 ; aucune correction D1 n'est justifiée par les preuves disponibles.

## Réconciliation des 37 pistes

Le catalogue documenté totalise 37 pistes : 15 singles (15 pistes), `0+` (5), `NOUS Y SOMMES` (9) et `30.000 GÉNOCIDES` (8).

- 18 pistes ont un master WAV dans R2 : 10 singles, les 5 pistes de `0+` et 3 pistes de `NOUS Y SOMMES`.
- 19 pistes ont une source M4A complète dans le Library mais aucun équivalent WAV retrouvé dans R2 ou les archives inspectées : 5 singles, 6 pistes de `NOUS Y SOMMES` et 8 pistes de `30.000 GÉNOCIDES`.
- Ne jamais convertir un M4A en WAV et présenter le fichier converti comme le master WAV original. Retrouver le WAV source auprès de l'emplacement d'origine avant de l'ajouter à R2.
