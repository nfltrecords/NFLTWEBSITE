# NFLT RECORDS — état final des 18 masters WAV

> **AVIS DE MISE À JOUR — 28 novembre 2026 :** ce document est un relevé historique des 18 WAV et un état audio complémentaire. Pour l'état courant de la boutique, consulter également [MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md](MASTER-SHOP-OPERATING-TRUTH-2026-11-26.md). Les données ci-dessous distinguent les masters WAV natifs des sources originales M4A complètes. Aucun M4A n'a été converti en WAV.

## Mise à jour vérifiée — 28 novembre 2026

### Sources M4A originales retrouvées dans la Bibliothèque ChatGPT

Les 20 fichiers M4A ci-dessous ont été retrouvés dans la Bibliothèque, matérialisés dans l'espace de travail et contrôlés. Ils sont des fichiers audio complets, pas des extraits de préécoute de 30 secondes.

| Fichier original | Durée (s) | Taille (octets) |
|---|---:|---:|
| 30.000Genocides.m4a | 117,45 | 3 716 837 |
| AMORTTESCHIENS.m4a | 125,25 | 3 917 806 |
| Arreteoutoutpete.m4a | 168,14 | 5 280 491 |
| Dilemma.m4a | 110,97 | 3 478 505 |
| Dunckes.m4a | 175,64 | 5 503 996 |
| Dunckes2.m4a | 176,52 | 5 542 399 |
| ExtremementGrave.m4a | 97,90 | 3 050 367 |
| GR4LIFE.m4a | 186,97 | 5 833 909 |
| GR4LIFE (1).m4a | 186,97 | 5 833 909 |
| Hustlegrind.m4a | 181,07 | 5 702 611 |
| Laveritetenique.m4a | 127,92 | 4 005 536 |
| Lesuivi.m4a | 105,40 | 3 313 403 |
| NEVERFAKELIKETHEM.m4a | 197,14 | 6 234 333 |
| NFLTHOT.m4a | 130,22 | 4 114 882 |
| Nousysommes.m4a | 139,25 | 4 373 120 |
| ONTELAFOUTUAUQ.m4a | 210,23 | 6 642 765 |
| PERSONNESEMARREICI.m4a | 115,96 | 3 612 424 |
| Sasempirepourtoi.m4a | 71,33 | 2 192 796 |
| Tufouslamerdededingue.m4a | 122,83 | 3 912 270 |
| Yapasdecouilleici.m4a | 125,64 | 3 998 279 |

Contrôles techniques effectués sur les 20 copies :
- codec AAC, fréquence 44,1 kHz, stéréo, débit approximatif de 245 à 255 kbit/s ;
- décodage intégral réussi avec FFmpeg, sans erreur ;
- les deux fichiers GR4LIFE ont la même taille, durée et empreinte SHA-256 : `7e134d2d60fcef89317ce5b7ed58ef3c302f29a006f753440d79e5b862ff2dd8`. Ils sont deux copies binaires du même fichier et ne représentent qu'une piste ;
- total : 20 fichiers matériels, 19 fichiers audio distincts après déduplication.

Correspondances de catalogue :
- UPC `199955742094`, 30.000 GÉNOCIDES : huit M4A retrouvés, y compris `Yapasdecouilleici.m4a` et `Tufouslamerdededingue.m4a`.
- UPC `199956222809`, NOUS Y SOMMES : six M4A retrouvés ; trois WAV restent les autres pistes déjà associées en R2.
- Singles : Dilemma (`199955701558`), #NEVERFAKELIKETHEM (`199955715135`), Hustle & Grind (`199955715203`), Hot (`199751508283`) et GR 4LIFE (`821440674572`).

Ces M4A sont des sources audio originales complètes à exploiter après validation de leur association titre/piste. Ils doivent conserver leur extension et leur contenu d'origine. Ne jamais les présenter comme des masters WAV.

### État Shopify et livraison lu en direct le 28 novembre

- Les 18 fiches Shopify existantes sont conservées, sans création de doublon.
- Après vérification de l'application Digital Products, seuls les produits `836.722 (1995)` et `Transcendence Of Natural Truths` ont un fichier WAV attaché.
- Les 16 autres fiches ont été maintenues en brouillon afin d'éviter la vente d'un téléchargement sans fichier attaché. Deux produits sont actifs ; 16 sont en brouillon.
- Les 18 associations WAV de `shop_release_assets` sont toujours présentes dans D1.
- Le Worker `nfltwebsite` possède les bindings D1/R2/KV attendus. Les variables SMTP sont présentes et le secret `SMTP_PASSWORD` existe, mais aucun e-mail de test reçu n'est encore prouvé.
- Shopify ne retourne actuellement aucun abonnement webhook. La route `/api/shopify-paid-webhook` existe dans le dépôt et vérifie HMAC, mais son raccordement à Shopify n'est pas encore établi.
- Aucune commande Shopify payée, réception e-mail ou livraison client complète n'est certifiée par ce contrôle.

## Contrôle historique — 26 novembre 2026

Les 18 fichiers WAV actuellement présents dans le bucket Cloudflare R2 `nflt-audio-master`, préfixe `18 master/`, possèdent chacun une association dans D1 (`shop_release_assets`). Ils sont vérifiés et conservés comme masters originaux. **Attention au périmètre catalogue :** la réconciliation de 37 pistes sur 18 sorties avait identifié 19 pistes supplémentaires uniquement disponibles en M4A dans la Bibliothèque, sans master WAV original retrouvé. Ces M4A ne sont pas des masters WAV et ne sont pas convertis. Le présent état clôture donc le contrôle et la correction des 18 WAV existants ; il ne certifie pas la disponibilité WAV des 37 pistes.

- 18 objets WAV dans R2 ; 18 associations D1.
- Les 19 pistes supplémentaires du catalogue sont désormais identifiées dans les sources M4A ci-dessus ; elles ne sont pas des masters WAV.
- Les signatures RIFF/WAVE ou RF64/WAVE et les tailles ont été vérifiées lors de l'audit audio précédent.
- Les fichiers originaux ne sont ni convertis, ni recompressés, ni remplacés.
- Correction effectuée le 26/11 : `18 master/medley.wav (1)` avait le type MIME générique `application/octet-stream`. Sa signature a été vérifiée (`RIFF/WAVE`), puis le même contenu binaire (69 890 138 octets) a été réenregistré avec `Content-Type: audio/wav`. L'ETag est resté identique (`cfa6e5ce2a891f4d09b1c9dcc598eb1f`) et une relecture a confirmé la même taille et la signature WAV.

## Inventaire des 18 masters WAV

| UPC | Fichier | Taille (octets) |
|---|---|---:|
| 199751168234 | MASTERPIECE.wav | 20 094 798 |
| 199751170992 | NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav | 22 249 550 |
| 199751511160 | NFLTTHEDOPIESTCOLLECTIONBEATNFLRECORDS.wav | 24 539 214 |
| 199751512501 | NFLTINMYPARTYBEATNFLRECORDS.wav | 21 430 350 |
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

## Règles de conservation et d'exploitation

- Conserver les 18 masters WAV dans R2, sans suppression, remplacement, renommage ou recompression.
- Conserver les M4A dans leur format original. Ne pas les convertir en WAV et ne pas les qualifier de masters WAV.
- Associer chaque fichier au bon UPC et à la bonne piste avant toute mise en vente.
- Ne pas publier une sortie incomplète ou dont l'association audio n'est pas établie.
- Aucun paiement réel ni aucune livraison client ne doit être déclaré opérationnel sans test complet vérifié.
