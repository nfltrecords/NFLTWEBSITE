# NFLT RECORDS — état de préparation PayPal Classic/IPN

**Dernière vérification : 24 novembre 2026**

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

Les nombres de pistes confirmés par les éléments catalogue archivés sont :

| UPC | Sortie | Pistes confirmées | WAV associés |
|---|---|---:|---:|
| 199955715135 | #NEVERFAKELIKETHEM | 1 | 0 |
| 199955742094 | 30.000 GÉNOCIDES | 8 | 0 |
| 199956222809 | NOUS Y SOMMES | 9 | 3 |
| 199956554184 | 0+ | 5 | 5 |

Seule la sortie **0+** dispose actuellement de ses cinq masters WAV associés. NOUS Y SOMMES est incomplet (3/9) ; 30.000 GÉNOCIDES et #NEVERFAKELIKETHEM n'ont pas encore leurs masters WAV associés.

Les nombres de pistes des 14 autres sorties ne sont pas confirmés. Le fait qu'une sortie ait un MP3 de préécoute ou un WAV associé ne prouve pas à lui seul son nombre total de pistes. Aucun prix ni parcours d'achat ne doit être considéré comme définitivement validé sur cette seule base.

Six UPC n'ont actuellement aucune association WAV : 199955701558, 199955715135, 199955715203, 199955742094, 199751508283 et 821440674572. Les fichiers M4A présents ne peuvent pas remplacer ces masters.

## Protections ajoutées au code

- La création d'une commande est refusée si le nombre de pistes n'est pas confirmé, si le nombre de masters WAV ne correspond pas au nombre confirmé ou si un objet R2 / un morceau KV manque.
- La notification IPN vérifie la notification auprès de PayPal, le destinataire, le statut `Completed`, la devise EUR, le montant, les UPC et quantités du panier et l'unicité de l'identifiant de transaction.
- Les notifications invalides ou non pertinentes sont acquittées sans marquer la commande payée ; les erreurs temporaires de vérification ou de base de données provoquent une réponse réessayable.
- La page de confirmation ne présente des liens que si tous les articles de la commande disposent de leur ensemble complet de masters.
- Le téléchargement exige une commande payée et ne sert que des WAV. Les objets R2 sont contrôlés par taille ; les fichiers KV sont contrôlés par présence et longueur totale.

Ces protections sont des contrôles de code et de données. Elles ne constituent pas une preuve de paiement PayPal ou de livraison client réelle.

## Points non validés — aucune déclaration de réussite

- Aucun test IPN réel ni campagne PayPal Sandbox complète n'a été effectué.
- Aucun paiement réel n'a été réalisé.
- Aucun email automatique de commande ou de téléchargement n'a été envoyé ou reçu.
- Le DNS du domaine comporte des enregistrements de messagerie (MX, SPF et DKIM vers `mail.nflt-records.com`), mais aucun identifiant SMTP ou service d'envoi n'est configuré dans le Worker.
- Le vendeur légal par produit et territoire, les droits de chaque sortie, la TVA, les informations consommateurs, les remboursements et les documents juridiques restent à valider.
- Le statut payé n'a pas été testé de bout en bout avec une transaction PayPal confirmée.

## Ordre de finalisation

1. Retrouver les masters WAV manquants ; ne jamais convertir un M4A en faux master WAV.
2. Confirmer les nombres de pistes des 14 UPC restants à partir de preuves catalogue fiables.
3. Compléter les associations UPC → WAV et vérifier les objets R2.
4. Configurer un expéditeur email existant et effectuer un vrai test de réception, avec reprise idempotente.
5. Tester PayPal Classic/IPN en environnement contrôlé : panier multi-articles, doublons, refus, remboursement et inversion.
6. Valider vendeur légal, territoires, droits, TVA et obligations consommateurs.
7. Obtenir l'autorisation explicite du propriétaire avant d'ouvrir le checkout en production.

**Ne pas activer le checkout tant que ces étapes ne sont pas validées.**
