# NFLT RECORDS — réconciliation audio et pochettes
**Vérification : 25 novembre 2026**

## Résultat consolidé

- 18 masters WAV valides dans R2, tous associés dans D1 à un UPC existant.
- 19 fichiers M4A complets retrouvés dans le Library, de 71,332 à 210,233 secondes.
- 37 pistes au total dans les 18 sorties : 15 singles, `0+` (5), `NOUS Y SOMMES` (9), `30.000 GÉNOCIDES` (8).
- 19 pistes ont une source M4A complète mais aucun équivalent WAV trouvé dans R2 ou les archives examinées. Les M4A sont conservés et ne doivent jamais remplacer les masters WAV dans la livraison.
- Aucun changement D1 n'est nécessaire : les 18 lignes correspondent aux 18 objets WAV présents dans R2.

## Répartition par sortie

| UPC | Sortie | Pistes | WAV dans R2 | M4A complet dans le Library |
|---|---|---:|---:|---:|
| 199955740199 | The Luxury - The Highest - Unequivocal | 1 | 1 | 0 |
| 199956554184 | 0+ | 5 | 5 | 0 |
| 199956222809 | NOUS Y SOMMES (TU M'AURAS JAMAIS) | 9 | 3 | 6 |
| 199955715135 | #NEVERFAKELIKETHEM (Chapter One) | 1 | 0 | 1 |
| 199955742094 | 30.000 GÉNOCIDES | 8 | 0 | 8 |
| 199955701558 | Dilemma (Radio Edit) | 1 | 0 | 1 |
| 199955715203 | Hustle & Grind (Radio Edit) | 1 | 0 | 1 |
| 199751511160 | The Dopest Collection (Vol. 1) | 1 | 1 | 0 |
| 199751512501 | In My Party | 1 | 1 | 0 |
| 199751514697 | The Dopest Collection, Vol. 2 | 1 | 1 | 0 |
| 199751613871 | Ma Luxure | 1 | 1 | 0 |
| 199751508283 | Hot | 1 | 0 | 1 |
| 199751168234 | 836.722 (1995) [18] [73] | 1 | 1 | 0 |
| 199751170992 | Transcendence Of Natural Truths | 1 | 1 | 0 |
| 199956557857 | Ma Luxure 2 (MVP) | 1 | 1 | 0 |
| 199954147302 | NFLT Social Community (The Most Advanced Societies) | 1 | 1 | 0 |
| 199951252436 | L'écran vient de chez nous (Radio Edit) | 1 | 1 | 0 |
| 821440674572 | GR 4LIFE | 1 | 0 | 1 |
| **Total** | **18 sorties** | **37** | **18** | **19** |

## Correspondance vérifiée des sources M4A et des titres

Les 19 fichiers M4A du Library sont des sources complètes, pas des extraits. Leur durée a été contrôlée avec ffprobe ; aucune ne dure 30 secondes. Ils sont conservés, ne sont pas importés dans `shop_release_assets` et ne peuvent jamais être livrés comme masters WAV.

### 30.000 GÉNOCIDES — UPC `199955742094`

La tracklist publique Amazon Music comporte 8 titres. Les huit M4A correspondent par nom et durée à la tracklist publiée (les durées mesurées sont cohérentes à la seconde avec les durées de la plateforme) : [Amazon Music — album et tracklist](https://music.amazon.com/albums/B0G1L112J4).

| Fichier M4A | Titre publié |
|---|---|
| `30.000Genocides.m4a` | 30.000 GÉNOCIDES |
| `Laveritetenique.m4a` | La vérité Te Nique |
| `Arreteoutoutpete.m4a` | Arrête Ou Tout Péte |
| `ExtremementGrave.m4a` | Extrêmement Grave |
| `Lesuivi.m4a` | Le Suivi |
| `Yapasdecouilleici.m4a` | Y'a Pas De Couille ici |
| `Tufouslamerdededingue.m4a` | Tu Fous La Merde De Dingue |
| `Sasempirepourtoi.m4a` | Ça S'empire Pour Toi |

### NOUS Y SOMMES (TU M'AURAS JAMAIS) — UPC `199956222809`

La tracklist publique Qobuz comporte 9 titres : [Qobuz — album et tracklist](https://www.qobuz.com/lu-fr/album/nous-y-sommes-tu-mauras-jamais-nflt/jwb3qbbq16uga).

Six titres sont présents en M4A :

| Fichier M4A | Titre publié |
|---|---|
| `Dunckes.m4a` | THE DUNCES |
| `Dunckes2.m4a` | THE DUNCKES |
| `Nousysommes.m4a` | NOUS Y SOMMES |
| `ONTELAFOUTUAUQ.m4a` | ON TE LA FOUTU AU Q |
| `AMORTTESCHIENS.m4a` | À MORT T'ES CHIENS |
| `PERSONNESEMARREICI.m4a` | PERSONNE SE MARRE ICI |

Les trois autres titres sont couverts par les trois WAV déjà associés à cet UPC. Le rapprochement par durée permet de distinguer les fichiers :

| Fichier WAV R2 | Taille R2 | Durée WAV mesurée / déduite du PCM | Titre Qobuz |
|---|---:|---:|---|
| `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO.wav` | 22 931 498 octets | 129,997 s | CA VA COMMENCER (2:09) |
| `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO2.wav` | 27 173 102 octets | environ 154,04 s, déduit de la taille PCM WAV 44,1 kHz / 16-bit / stéréo | TU M'AURAS JAMAIS (2:34) |
| `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3.wav` | 26 437 294 octets | 149,871 s | ÇA TUE PAS DU TOUT (2:29) |

Le fichier `...2.wav` est présent dans R2 et dans D1, mais aucune copie locale n'a été retrouvée pour le sonder directement ; sa durée est donc une déduction à partir de la taille, du format PCM constaté sur les deux autres fichiers et de la durée publiée. Ne pas présenter cette durée comme un résultat ffprobe du fichier `...2.wav`.

### Singles — une source M4A complète chacun

| UPC | Sortie | Fichier M4A |
|---|---|---|
| `199955715135` | #NEVERFAKELIKETHEM (Chapter One) | `NEVERFAKELIKETHEM.m4a` |
| `199955701558` | Dilemma (Radio Edit) | `Dilemma.m4a` |
| `199955715203` | Hustle & Grind (Radio Edit) | `Hustlegrind.m4a` |
| `199751508283` | Hot | `NFLTHOT.m4a` |
| `821440674572` | GR 4LIFE | `GR4LIFE.m4a` |

Les titres des singles concordent avec le catalogue et les noms des sources. Pour Hustle & Grind, la capture DistroKid Vault précédemment vérifiée confirme aussi le titre et l'UPC `199955715203`.

## Fichiers WAV associés

### Singles présents dans R2

- UPC `199955740199` — `NFLTTHELUXURYTHEHIGHESTUNEQUIVOCAL.wav`
- UPC `199751168234` — `MASTERPIECE.wav`
- UPC `199751170992` — `NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav`
- UPC `199751511160` — `NFLTTHEDOPESTCOLLECTIONBEATNFLTRECORDS.wav`
- UPC `199751512501` — `NFLTINMYPARTYBEATNFLTRECORDS.wav`
- UPC `199751514697` — `DCVOL2.wav`
- UPC `199751613871` — `NFLT.wav`
- UPC `199956557857` — `Ridewithme.wav`
- UPC `199954147302` — `NINTENDO.wav`
- UPC `199951252436` — `medley.wav (1)` (nom de téléchargement normalisé par le code en `medley-1.wav`)

### 0+ — UPC 199956554184

Les cinq fichiers WAV associés dans D1 correspondent aux cinq titres montrés par la capture Spotify du 14 novembre à 19:05 :

- `NFLTO.wav` — O+
- `Flatulence.wav` — Flatulence
- `Calamite.wav` — Calamité
- `DebrisFlaqueDechetsCancres.wav` — Débris, Flaques, Déchets, Cancres
- `Laplusgrosseenc.wav` — La Plus Grosse Encule

La capture `Screenshot_20261114-190549_Spotify.jpg` affiche 5 titres et 13 minutes.

### NOUS Y SOMMES — UPC 199956222809

Les trois WAV associés à cet UPC sont :

- `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO.wav`
- `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO2.wav`
- `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3.wav`

Les captures Spotify `Screenshot_20261114-190452_Spotify.jpg` et `Screenshot_20261114-190458_Spotify.jpg` affichent 9 titres et 22 minutes. Les trois fichiers WAV correspondent aux trois titres restants ; leur correspondance précise par durée est documentée dans la section « Correspondance vérifiée des sources M4A et des titres » ci-dessous.

Les six autres titres ont des sources M4A complètes :

- `AMORTTESCHIENS.m4a`
- `Dunckes.m4a`
- `Dunckes2.m4a`
- `Nousysommes.m4a`
- `ONTELAFOUTUAUQ.m4a`
- `PERSONNESEMARREICI.m4a`

### 30.000 GÉNOCIDES — UPC 199955742094

Les huit sources M4A complètes sont :

- `30.000Genocides.m4a`
- `Laveritetenique.m4a`
- `Arreteoutoutpete.m4a`
- `ExtremementGrave.m4a`
- `Lesuivi.m4a`
- `Yapasdecouilleici.m4a`
- `Tufouslamerdededingue.m4a`
- `Sasempirepourtoi.m4a`

Les captures `Screenshot_20261114-141553_Spotify.jpg` et `Screenshot_20261114-190155_Spotify.jpg` confirment 8 titres et 15 minutes.

## Singles ayant uniquement une source M4A complète

- UPC `199955715135` — `NEVERFAKELIKETHEM.m4a`
- UPC `199955701558` — `Dilemma.m4a`
- UPC `199955715203` — `Hustlegrind.m4a`
- UPC `199751508283` — `NFLTHOT.m4a`
- UPC `821440674572` — `GR4LIFE.m4a`

Pour `#NEVERFAKELIKETHEM`, le nom du fichier correspond exactement au single du catalogue et le propriétaire a confirmé la sortie comme single. Aucune capture DistroKid affichant l'UPC pour ce M4A n'a été retrouvée dans les archives inspectées : cette association reste documentée comme confirmation du propriétaire, pas comme preuve indépendante.

Pour Hustle & Grind, la capture DistroKid Vault `Screenshot_20261114-133340_Chrome.jpg` affiche le fichier, le titre, le titre d'album et l'UPC `199955715203`. Le fichier complet dure 181,069 secondes.

## Validation technique

- Les 18 objets WAV de R2 ont une signature valide : `RIFF` ou `RF64`, puis `WAVE`.
- Les 17 copies locales disponibles correspondent aux ETag MD5 des objets R2.
- `...2.wav` est présent et valide dans R2, sans copie locale retrouvée.
- Le doublon local `...3(1).wav` est identique à `...3.wav`.
- Les 19 M4A ont une durée de 71,332 à 210,233 secondes. Aucun n'est un extrait de 30 secondes.
- Le bucket R2 contient 18 WAV, 18 JPG et un objet vide de préfixe. Aucun M4A n'y figure.

## Pochettes

- Les 18 JPG de R2 mesurent réellement 3000 × 3000 pixels.
- Les 18 pochettes publiques dans l'archive corrigée mesurent 1536 × 1536 pixels.
- Les noms des 18 objets R2 sont rapprochés des 18 UPC via le dossier d'artwork : 16 associations sont étayées par captures et 2 par confirmation du propriétaire.
- Les deux originaux confirmés par le propriétaire restent en attente d'intégration binaire exacte. Les images R2 de même nom ne doivent pas être déclarées identiques sans comparaison visuelle et binaire.

## Archives et préécoutes

- Les 18 archives ZIP du Library inspectées ne contiennent aucun fichier audio.
- Trois archives GitHub historiques ont été retrouvées dans sept branches : `NFLT_CLOUDFLARE_UPLOAD_CORRIGE.zip` (22 676 821 octets), `NFLT_PAGES_DEPLOY.zip` (22 679 145 octets) et `NFLT_SITE_CLOUDFLARE_UPLOAD.zip` (22 677 789 octets).
- Chacune contenait 37 fichiers MP3 nommés `*_PREVIEW_30S.mp3`, d'environ 481 KB chacun. Aucun WAV ou M4A n'y figurait ; aucun ZIP imbriqué, `audio-originals/` ou `audio-inventory.csv` n'a été trouvé.
- Les 37 MP3 ont été supprimés de chacune des trois archives dans les sept branches historiques. Les autres entrées ont été préservées. Les nouveaux ZIP mesurent respectivement 5 481 612, 5 482 600 et 5 482 048 octets et contiennent 23, 24 et 24 entrées.
- Les commits de nettoyage sont `ffcc05c`, `a784b8d`, `cb9625e`, `40a0106`, `aa0e009`, `ce08700` et `5d95c8b`.
- Les branches historiques gardent encore des composants et routes de préécoute dans leur code ; ne pas les fusionner dans `main`. Le contrôle `npm run audit:assets` vérifie maintenant aussi les entrées de préécoute dans les archives ZIP.
- L'archive `NFLT-18-covers-and-mapping.zip` contient les pochettes et captures, mais pas le dossier `audio-originals/` ni le fichier `audio-inventory.csv` mentionnés dans son README.

## État de la livraison en production

- Le Worker `nfltwebsite` est sur la version 214 à 100 % du trafic (déploiement `571d8364-75d8-4b45-ab0b-d20f8f1941c3`, build réussi pour le commit `6660b41e`). Son script contient la validation WAV, la normalisation de nom `safeWavDownloadName`, l'upload multiple et le contrôle du statut payé ; il ne contient pas de code de préécoute audio.
- `checkoutActivationApproved` et `checkoutEnabled` restent à `false`. Aucun paiement réel n'a été activé.
- D1 contient 2 commandes en attente, 0 commande payée et 0 enregistrement de livraison e-mail. Aucun téléchargement client réel n'a été déclenché pendant cet audit.
- L'unique namespace KV du compte contient 0 clé. Aucun master ni bloc audio n'a été retrouvé dans KV.
- Le secret de mot de passe SMTP n'est pas lié au Worker ; l'envoi d'e-mails ne peut pas être déclaré opérationnel.

## Règles de livraison

- Livrer uniquement des WAV valides, après paiement effectivement confirmé.
- Ne jamais livrer les M4A comme masters WAV.
- Ne jamais convertir un M4A en WAV et présenter le résultat comme le master WAV original.
- Ne pas supprimer les M4A complets.
- Ne pas activer le checkout réel : il reste désactivé.
