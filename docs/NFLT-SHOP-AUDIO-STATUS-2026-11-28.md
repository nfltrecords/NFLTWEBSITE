# NFLT RECORDS — état de reprise Shopify et audio
**Contrôle réel : 28 novembre 2026**

Ce rapport complète les rapports historiques sans les supprimer. Il consigne les contrôles effectués pendant la reprise et les modifications réellement appliquées.

## 1. Shopify — état réel après correction

Boutique : `pnqnkt-j9.myshopify.com` / `https://shop.nflt-records.com/`.

- 18 fiches existantes retrouvées ; aucun doublon créé.
- 18 SKU correspondent aux UPC du catalogue et les prix sont présents.
- 2 produits actifs avec un fichier Digital Products WAV attaché :
  - 836.722 (1995) — UPC 199751168234 — MASTERPIECE.wav — 20 094 798 octets — 9,99 €.
  - Transcendence Of Natural Truths — UPC 199751170992 — NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav — 22 249 550 octets — 9,99 €.
- Les 9 autres fiches actives sans fichier attaché ont été passées en brouillon avec succès.
- État après écriture et relecture Shopify : 2 actifs, 16 brouillons.
- Aucun produit n'a été supprimé.

Les produits sans fichier attaché restent en brouillon. Le fait qu'un WAV existe dans R2/D1 ne signifie pas que Digital Products a une pièce jointe Shopify ni que la livraison e-mail du Worker est raccordée.

## 2. M4A — 20 copies retrouvées, 19 fichiers distincts

Les 20 fichiers suivants ont été retrouvés dans la Bibliothèque ChatGPT et matérialisés dans l'espace de travail de la session. Les durées ont été contrôlées par ffprobe. Le décodage intégral FFmpeg a réussi pour chacun.

| Fichier | Durée (s) | Taille (octets) |
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

Caractéristiques audio mesurées : AAC, 44,1 kHz, stéréo, débit moyen environ 245–255 kbit/s. Ces fichiers sont des enregistrements complets, pas des extraits de 30 secondes.

Les fichiers `GR4LIFE.m4a` et `GR4LIFE (1).m4a` sont identiques selon SHA-256 : `7e134d2d60fcef89317ce5b7ed58ef3c302f29a006f753440d79e5b862ff2dd8`. Ils ne comptent que pour une piste.

### Correspondances UPC

- 30.000 GÉNOCIDES — 199955742094 : huit M4A (30.000Genocides, Laveritetenique, Arreteoutoutpete, ExtremementGrave, Lesuivi, Yapasdecouilleici, Tufouslamerdededingue, Sasempirepourtoi).
- NOUS Y SOMMES — 199956222809 : six M4A (Dunckes, Dunckes2, Nousysommes, ONTELAFOUTUAUQ, AMORTTESCHIENS, PERSONNESEMARREICI) plus trois WAV déjà associés dans R2.
- Singles : Dilemma — 199955701558 ; #NEVERFAKELIKETHEM — 199955715135 ; Hustle & Grind — 199955715203 ; Hot — 199751508283 ; GR 4LIFE — 821440674572.

Aucun M4A n'a été converti en WAV. Ces sources doivent être conservées et livrées dans leur format réel si leur association finale au titre est validée.

## 3. Cloudflare — état réel

- Worker `nfltwebsite` présent et déployé à 100 %.
- Bindings D1, R2 et KV attendus présents.
- 18 associations WAV en D1 toujours présentes.
- Variables SMTP `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `SMTP_USER` et secret `SMTP_PASSWORD` présents. Aucun test SMTP reçu n'a encore été prouvé.
- D1 `shop_orders` contient deux commandes historiques en attente.
- D1 `shop_email_deliveries` ne contient aucune livraison enregistrée.
- Table `shopify_order_map` présente.

## 4. Webhook Shopify

- Route GitHub `src/routes/api.shopify-paid-webhook.ts` existante : vérification HMAC, contrôle du topic `orders/paid`, email, statut payé, devise, total, SKU/UPC et quantité, enregistrement idempotent via `shopify_order_map`, puis déclenchement de l'e-mail.
- La route est exposée par le Worker sur le domaine `nflt-records.com`.
- Shopify renvoie actuellement zéro abonnement webhook shop-scoped.
- Une tentative de création de l'abonnement `ORDERS_PAID` via le connecteur Shopify a été bloquée par sa politique de sécurité. Ne pas contourner cette restriction avec une autre écriture API. Utiliser la configuration autorisée de l'application Shopify ou Shopify Admin pour établir l'abonnement.
- Aucun webhook payé réel n'a été reçu ni traité.

## 5. Travaux restants

1. Configurer l'abonnement Shopify `orders/paid` vers `https://nflt-records.com/api/shopify-paid-webhook` par le canal autorisé.
2. Adapter le code de livraison pour servir les formats originaux WAV et M4A, en contrôlant MIME, intégrité, taille, UPC et nombre de pistes.
3. Importer les M4A complets dans R2 sans transcodage et les associer dans D1 après confirmation piste/UPC.
4. Réconcilier les 3 WAV de NOUS Y SOMMES avec les six M4A afin de former un ensemble complet de neuf pistes.
5. Raccorder les fichiers complets aux produits Shopify existants et ne publier que les fiches réellement livrables.
6. Tester l'envoi SMTP et confirmer la réception d'un e-mail.
7. Tester le flux de bout en bout en Sandbox / test sans encaissement réel, puis obtenir l'autorisation explicite avant tout paiement réel.

## 6. Préservation

Ne pas supprimer, renommer, remplacer ou recomprimer les 18 WAV natifs déjà dans R2. Ne pas convertir les M4A en WAV. Ne pas modifier les biographies Spotify, DistroKid ou DNS. Aucun changement de paiement réel n'a été effectué.