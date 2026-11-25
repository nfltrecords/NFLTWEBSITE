# NFLT RECORDS — état de préparation PayPal Classic/IPN

**Dernière vérification : 24 novembre 2026 — 17 nombres de pistes vérifiés**

## Statut général

Le checkout reste **désactivé**. L'intégration en place est PayPal Classic avec panier `_cart` et notification IPN. Aucune migration vers PayPal REST/Webhooks n'est demandée ni activée.

Le verrou `checkoutActivationApproved` reste à `false`. La réparation technique du site ne vaut pas autorisation d'encaisser des paiements réels.

## Éléments vérifiés en production

- Le Worker `nfltwebsite`, la base D1 `nflt-records-data`, le bucket R2 `nflt-audio-master` et le namespace KV `nflt-audio-chunks` existent.
- Les tables D1 `shop_orders` et `shop_release_assets` existent déjà en production. Les deux commandes de test historiques restent en attente ; aucune commande payée n'a été constatée.
- `shop_release_assets` contient 18 associations de fichiers WAV couvrant 12 UPC. Les 18 objets R2 existent et leurs tailles correspondent aux valeurs D1. Une référence de fichier erronée pour The Dopest Collection Vol. 1 a été corrigée.
- Le nom historique `medley.wav (1)` est reconnu comme WAV et normalisé en nom de téléchargement valide.
- Les extraits audio de 30 secondes ne font plus partie du code actif : aucun lecteur ni chemin de préécoute n'est référencé dans le catalogue ou la boutique.
- Les 15 archives de préparation de la bibliothèque contenant le dossier `previews` ont été nettoyées ; les fichiers MP3 de préécoute et les dossiers `assets/previews` / `public/assets/previews` ont été retirés. Les trois archives de marque et de pochettes qui ne contenaient aucun extrait ont été conservées sans modification.
- Les fichiers M4A conservés dans la bibliothèque ont été contrôlés : les 17 fichiers mesurés durent de 71 à 210 secondes ; ce ne sont pas des extraits de 30 secondes. Ils restent conservés comme sources et ne remplacent jamais les masters WAV.

## État des masters et des nombres de pistes

17 nombres de pistes sont vérifiés à partir des preuves fournies par le propriétaire et des pages publiques Amazon Music / Apple Music. Les références sont consignées dans `docs/track-count-evidence-2026-11-24.md`.

| UPC | Sortie | Pistes confirmées | WAV associés | État |
|---|---|---:|---:|---|
| 199751168234 | 836.722 (1995) [18] [73] | 1 | 1 | Complet |
| 199751170992 | Transcendence Of Natural Truths | 1 | 1 | Complet |
| 199751508283 | Hot | 1 | 0 | Master manquant |
| 199751511160 | The Dopest Collection Vol. 1 | 1 | 1 | Complet |
| 199751512501 | In My Party | 1 | 1 | Complet |
| 199751514697 | The Dopest Collection Vol. 2 | 1 | 1 | Complet |
| 199751613871 | Ma Luxure | 1 | 1 | Complet |
| 199951252436 | L'écran vient de chez nous (Radio Edit) | 1 | 1 | Complet |
| 199954147302 | NFLT Social Community (The Most Advanced Societies) | 1 | 1 | Complet |
| 199955701558 | Dilemma (Radio Edit) | 1 | 0 | Master manquant |
| 199955715135 | #NEVERFAKELIKETHEM (Chapter One) | 1 | 0 | Master manquant |
| 199955740199 | The Luxury - The Highest - Unequivocal | 1 | 1 | Complet |
| 199955742094 | 30.000 GÉNOCIDES | 8 | 0 | 8 masters manquants |
| 199956222809 | NOUS Y SOMMES (TU M'AURAS JAMAIS) | 9 | 3 | Incomplet : 6 masters manquants |
| 199956554184 | 0+ | 5 | 5 | Complet |
| 199956557857 | Ma Luxure 2 (MVP) | 1 | 1 | Complet |
| 821440674572 | GR 4LIFE | 1 | 0 | Master manquant |
| 199955715203 | Hustle & Grind (Radio Edit) | À confirmer | 0 | Nombre de pistes et master à confirmer |

**Bilan : 11 sorties disposent de leur ensemble complet de masters WAV ; cinq sorties vérifiées n'ont aucun WAV associé ; NOUS Y SOMMES est incomplet ; Hustle & Grind reste non vérifié.** Les 18 associations D1 ne représentent donc pas 18 UPC : elles couvrent 12 UPC.

Les M4A ne remplacent jamais les WAV. Les nombres de pistes sont vérifiés indépendamment de la présence des masters.

## Protections ajoutées au code

Deux outils administrateur protégés par le code `ADMIN_ORDERS_CODE` sont disponibles : `/admin/orders` pour consulter les commandes et `/admin/audio` pour transférer les masters WAV. La page de commandes est en lecture seule ; seul l'IPN PayPal vérifié peut faire passer une commande à `paid`.

La vérification continue inclut les tests Vitest, un contrôle TypeScript strict (`tsc --noEmit`), ESLint/Prettier et le build Vite.

- La création d'une commande est refusée si le nombre de pistes n'est pas vérifié, si le nombre de masters WAV ne correspond pas au nombre vérifié ou si un objet R2 / un morceau KV manque.
- La notification IPN vérifie la notification auprès de PayPal, le destinataire, le statut `Completed`, la devise EUR, le montant, les UPC et quantités du panier et l'unicité de l'identifiant de transaction. Les remboursements complets et inversions révoquent l'accès ; une annulation d'inversion restaure l'accès ; les remboursements partiels sont signalés pour revue manuelle.
- Les notifications invalides ou non pertinentes sont acquittées sans marquer la commande payée ; les erreurs temporaires de vérification ou de base de données provoquent une réponse réessayable.
- La page de confirmation ne présente des liens que si tous les articles de la commande disposent de leur ensemble complet de masters.
- Le téléchargement exige une commande payée et ne sert que des WAV. Les objets R2 sont contrôlés par taille ; les fichiers KV sont contrôlés par présence et longueur totale.

Ces protections sont des contrôles de code et de données. Elles ne constituent pas une preuve de paiement PayPal ou de livraison client réelle.

## Inventaire audio et boutique — vérification de production du 24 novembre 2026

L'état de production a été actualisé après le nettoyage des extraits :

- D1 contient maintenant 18 lignes dans `shop_release_assets`, toutes associées à des fichiers WAV existants dans R2. Aucune ligne D1 ne pointe vers un M4A.
- Après le nettoyage, le bucket R2 contient 37 objets : 18 WAV et 19 visuels. Aucun fichier MP3 ou M4A de préécoute n'y reste.
- Les 18 WAV associés couvrent 12 UPC : 11 sorties ont leur ensemble complet ; `NOUS Y SOMMES` n'a que 3 masters sur 9.
- Les 5 UPC vérifiés sans master WAV sont `Dilemma` (1 piste), `#NEVERFAKELIKETHEM` (1), `30.000 GÉNOCIDES` (8), `Hot` (1) et `GR 4LIFE` (1). Il manque également 6 WAV pour `NOUS Y SOMMES`.
- Cela représente 18 masters WAV manquants pour les tracklists vérifiées. `Hustle & Grind` n'a pas de WAV associé et son nombre exact de pistes reste non confirmé.
- Les M4A sources conservés dans la bibliothèque ne sont pas des extraits de 30 secondes et ne sont jamais utilisés comme masters de livraison.

Les lecteurs de préécoute et leurs références ont été retirés des fiches catalogue et de la boutique. Le contrôle `npm run audit:assets`, ajouté à GitHub Actions, vérifie les 18 pochettes et interdit le retour des chemins et composants de préécoute. Le point `/api/shop-availability` vérifie toujours les masters complets dans D1/R2 ; les ajouts au panier restent désactivés pour les sorties incomplètes, et le panier bloque aussi les sélections anciennes devenues indisponibles.

Les masters WAV manquants n'ont été trouvés ni ailleurs dans le bucket R2, ni dans les archives ZIP examinées de GitHub et de la bibliothèque de fichiers. Ne pas convertir les M4A pour combler ces manques. Le transfert des nouveaux masters se fait via `/admin/audio` : l'outil utilise désormais le multipart R2, conserve uniquement la session et les ETags temporaires dans KV, vérifie la taille de l'objet, puis crée l'association D1 avec un asset key `r2:`. Les noms de fichiers déjà associés sont rejetés et la finalisation est idempotente.

Le verrou `checkoutActivationApproved` reste à `false`. Aucune commande n'est payée et aucun paiement réel n'a été effectué.

## Email automatique — code prêt, identifiant SMTP manquant

Le mécanisme d'email est maintenant intégré au checkout existant :

- La table D1 `shop_email_deliveries` a été créée en production ; le script correspondant est conservé dans `migrations/d1/0001_shop_email_deliveries.sql`.
- L'envoi utilise la boîte LWS existante via SMTP TLS sur `mail.nflt-records.com:465`. Le DNS contient déjà MX, SPF, DKIM et DMARC ; le serveur mail est DNS-only.
- Le Worker dispose des variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` et `SMTP_USER`. Aucun abonnement Workers payant n'est nécessaire pour cette voie SMTP.
- Le seul élément manquant est le secret Cloudflare `SMTP_PASSWORD`, c'est-à-dire le mot de passe de la boîte `nflt-records@nflt-records.com`. Il ne doit pas être placé dans GitHub ni transmis dans le chat.
- Après IPN vérifié, l'email est ajouté à une file D1 idempotente. L'IPN et la page de confirmation peuvent relancer l'envoi ; la page `/admin/orders` permet le renvoi manuel et le test SMTP.
- L'identifiant Message-ID est stable par commande ; les tentatives sont comptées et un envoi resté bloqué plus de dix minutes peut être repris.

Pour activer l'envoi, ajouter `SMTP_PASSWORD` comme secret dans Cloudflare : **Workers & Pages → nfltwebsite → Settings → Variables and Secrets → Add secret**. Ensuite, utiliser le bouton **Tester l'email** dans `/admin/orders` et vérifier la réception dans la boîte NFLT RECORDS.

Aucun email client n'a encore été envoyé ni reçu ; le test réel attend l'ajout du secret.

## Points non validés — aucune déclaration de réussite

- Les gestionnaires de remboursement, inversion et annulation d'inversion sont codés, mais aucun test IPN réel ni campagne PayPal Sandbox complète n'a été effectué.
- Aucun paiement réel n'a été réalisé.
- Aucun email client de commande ou de téléchargement n'a encore été envoyé ou reçu ; le code est prêt, mais le secret SMTP manque.
- Le DNS du domaine comporte des enregistrements de messagerie (MX, SPF et DKIM vers `mail.nflt-records.com`), mais aucun identifiant SMTP ou service d'envoi n'est configuré dans le Worker.
- Le vendeur légal par produit et territoire, les droits de chaque sortie, la TVA, les informations consommateurs, les remboursements et les documents juridiques restent à valider.
- Le statut payé n'a pas été testé de bout en bout avec une transaction PayPal confirmée.

## Ordre de finalisation

1. Récupérer les WAV manquants des cinq sorties vérifiées, les six WAV manquants de NOUS Y SOMMES et le master de Hustle & Grind une fois son nombre de pistes confirmé.
2. Compléter et vérifier les associations UPC → WAV ; ne jamais convertir un M4A en faux master WAV.
3. Ajouter le secret SMTP_PASSWORD dans Cloudflare, envoyer le test email depuis /admin/orders, puis vérifier la réception réelle et la reprise idempotente.
4. Tester PayPal Classic/IPN en environnement contrôlé : panier multi-articles, doublons, refus, remboursement et inversion.
5. Valider vendeur légal, territoires, droits, TVA et obligations consommateurs.
6. Obtenir l'autorisation explicite du propriétaire avant d'ouvrir le checkout en production.

**Ne pas activer le checkout tant que ces étapes ne sont pas validées.**
