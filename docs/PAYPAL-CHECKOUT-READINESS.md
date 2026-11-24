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
- Les 37 MP3 de préécoute sont présents dans GitHub ; les 37 chemins référencés dans `src/lib/previews.ts` existent.
- Les 19 objets M4A de R2 ne sont jamais utilisés comme masters de livraison.

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

La vérification continue inclut les tests Vitest, un contrôle TypeScript strict (`tsc --noEmit`), ESLint/Prettier et le build Vite.

- La création d'une commande est refusée si le nombre de pistes n'est pas vérifié, si le nombre de masters WAV ne correspond pas au nombre vérifié ou si un objet R2 / un morceau KV manque.
- La notification IPN vérifie la notification auprès de PayPal, le destinataire, le statut `Completed`, la devise EUR, le montant, les UPC et quantités du panier et l'unicité de l'identifiant de transaction. Les remboursements complets et inversions révoquent l'accès ; une annulation d'inversion restaure l'accès ; les remboursements partiels sont signalés pour revue manuelle.
- Les notifications invalides ou non pertinentes sont acquittées sans marquer la commande payée ; les erreurs temporaires de vérification ou de base de données provoquent une réponse réessayable.
- La page de confirmation ne présente des liens que si tous les articles de la commande disposent de leur ensemble complet de masters.
- Le téléchargement exige une commande payée et ne sert que des WAV. Les objets R2 sont contrôlés par taille ; les fichiers KV sont contrôlés par présence et longueur totale.

Ces protections sont des contrôles de code et de données. Elles ne constituent pas une preuve de paiement PayPal ou de livraison client réelle.

## Points non validés — aucune déclaration de réussite

- Les gestionnaires de remboursement, inversion et annulation d'inversion sont codés, mais aucun test IPN réel ni campagne PayPal Sandbox complète n'a été effectué.
- Aucun paiement réel n'a été réalisé.
- Aucun email automatique de commande ou de téléchargement n'a été envoyé ou reçu.
- Le DNS du domaine comporte des enregistrements de messagerie (MX, SPF et DKIM vers `mail.nflt-records.com`), mais aucun identifiant SMTP ou service d'envoi n'est configuré dans le Worker.
- Le vendeur légal par produit et territoire, les droits de chaque sortie, la TVA, les informations consommateurs, les remboursements et les documents juridiques restent à valider.
- Le statut payé n'a pas été testé de bout en bout avec une transaction PayPal confirmée.

## Ordre de finalisation

1. Récupérer les WAV manquants des cinq sorties vérifiées, les six WAV manquants de NOUS Y SOMMES et le master de Hustle & Grind une fois son nombre de pistes confirmé.
2. Compléter et vérifier les associations UPC → WAV ; ne jamais convertir un M4A en faux master WAV.
3. Configurer un expéditeur email existant et effectuer un vrai test de réception, avec reprise idempotente.
4. Tester PayPal Classic/IPN en environnement contrôlé : panier multi-articles, doublons, refus, remboursement et inversion.
5. Valider vendeur légal, territoires, droits, TVA et obligations consommateurs.
6. Obtenir l'autorisation explicite du propriétaire avant d'ouvrir le checkout en production.

**Ne pas activer le checkout tant que ces étapes ne sont pas validées.**
