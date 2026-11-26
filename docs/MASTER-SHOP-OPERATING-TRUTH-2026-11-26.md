# NFLT RECORDS — référence opérationnelle masters et boutique
**État vérifié : 26 novembre 2026, après lecture directe de Cloudflare D1 et R2 et du code GitHub main.**

> Ce document remplace les anciens résumés globaux contradictoires. Les rapports datés restent des pièces d'historique et ne doivent plus servir seuls à décider de la disponibilité en boutique.

## État réel des masters en production

- Bucket : Cloudflare R2 `nflt-audio-master`, préfixe `18 master/`.
- Objets WAV : **18**.
- Associations dans D1 `shop_release_assets` : **18**.
- Chaque ligne D1 relue pointe vers un objet R2 existant, avec la même taille déclarée.
- Tous les objets WAV listés portent `Content-Type: audio/wav`.
- Les originaux sont conservés : aucun M4A n'est converti ni substitué à un WAV.
- Les 18 fichiers sont détaillés dans `docs/R2-MASTER-INVENTORY.md`.

## Ce que signifie « 18 masters »

Le nombre 18 désigne les **fichiers WAV**, pas 18 UPC distincts. Les associations actuelles se regroupent par UPC comme suit :

| UPC | Fichiers WAV associés |
|---|---:|
| 199751168234 | 1 |
| 199751170992 | 1 |
| 199751511160 | 1 |
| 199751512501 | 1 |
| 199751514697 | 1 |
| 199751613871 | 1 |
| 199951252436 | 1 |
| 199954147302 | 1 |
| 199955740199 | 1 |
| 199956222809 | 3 |
| 199956554184 | 5 |
| 199956557857 | 1 |

Cette ventilation provient de la requête D1 effectuée le 26 novembre 2026. Elle ne doit pas être remplacée par un ancien tableau de réconciliation sans nouvelle lecture de production.

## Pourquoi certaines cartes de la boutique sont grisées

Le code de `/api/shop-availability` appelle `getCompleteWavTracks(upc)`. Cette fonction compare le nombre de fichiers WAV associés à l'UPC avec le nombre de pistes vérifié dans `verifiedReleaseTrackCounts`, puis contrôle l'existence, la taille et l'en-tête WAV des objets R2 (ou des blocs KV). Si l'ensemble attendu n'est pas complet, l'UPC n'est pas renvoyé dans `availableUpcs`; la carte affiche alors « Master WAV en préparation » et désactive l'ajout au panier.

C'est une règle de protection réelle, pas un simple état visuel. Le fait que 18 associations existent ne prouve pas à lui seul que chaque UPC du catalogue a son ensemble de pistes complet. Ne pas contourner ce contrôle en activant visuellement les boutons : cela pourrait accepter un paiement sans livrer tous les fichiers promis.

## Règle de gestion de la boutique

- Les fiches, pochettes et prix du catalogue restent affichés pour les 18 sorties.
- Une sortie ne peut être achetée que si tous les masters WAV attendus pour son UPC sont présents et validés.
- Le panier et la création de commande serveur doivent appliquer la même règle.
- La livraison ne se déclenche qu'après confirmation PayPal vérifiée et ne sert que les WAV associés à la commande.
- Une carte grisée doit présenter un état clair de disponibilité ou un lien de demande, pas simuler une disponibilité.
- Ne jamais remplacer les WAV par des M4A, même si une source M4A complète est conservée dans la Bibliothèque.

## Historique des anciens audits

Les rapports du 24 et 25 novembre décrivent une réconciliation de 37 pistes, les objets découverts à cette date et les sources M4A alors présentes. Ils sont historiques. Ils ne doivent pas être repris comme inventaire actuel sans comparaison avec les 18 associations D1 et les 18 objets R2 relus le 26 novembre.

Les anciens totaux synthétiques de sorties complètes/incomplètes sont retirés de la synthèse opérationnelle. Pour toute décision, utiliser la ventilation UPC ci-dessus et le résultat dynamique de `getCompleteWavTracks`.

## État du paiement et de la livraison

- Le verrou de checkout PayPal a été ouvert dans le code à la demande du propriétaire le 26 novembre.
- Le code utilise PayPal Classic/IPN et ne considère une commande payée qu'après validation serveur de la notification.
- Aucun achat client réel n'a été confirmé dans D1 au moment de la présente lecture.
- Le secret `SMTP_PASSWORD` est absent : la livraison par e-mail n'est pas démontrée. Les liens de téléchargement sur la page de confirmation restent le canal prévu après paiement confirmé.
- Le vendeur contractuel, les CGV, la TVA et les droits/territoires doivent être finalisés séparément ; ne pas déclarer la conformité juridique acquise.

## Vérifications de production effectuées

Lecture Cloudflare du 26 novembre 2026 :
- `shop_release_assets` : 18 lignes.
- `R2` sous `18 master/` : 18 objets WAV, 18 JPG et un objet vide de préfixe.
- Pour chacune des 18 lignes D1, `asset_key` correspond à `r2:18 master/<file_name>`; les tailles D1 correspondent aux objets WAV inventoriés.
- La route de disponibilité est déterminée par le code décrit ci-dessus.

**Instruction de continuité :** ne pas recommencer les contrôles de signature et de correspondance des 18 objets déjà effectués. Si une nouvelle publication ou une nouvelle liaison est revendiquée, vérifier uniquement le delta entre cette référence et la production D1/R2.

## Mise à jour boutique — 26 novembre 2026

- BigCommerce est désormais la cible du raccordement marchand.
- Le checkout PayPal personnel est désactivé en préparation ; ne pas réactiver le paiement tant que BigCommerce n'est pas relié et vérifié.
- Les 18 fiches de catalogue sont affichées sans badge « master en préparation » fondé sur le contrôle de paiement ; les boutons d'ajout au panier servent à préparer le panier uniquement.
- Le paiement reste volontairement fermé jusqu'à la validation du compte marchand BigCommerce et du flux complet de commande/livraison.
- Le Store Hash/URL de boutique et les identifiants API BigCommerce ne sont pas présents dans les ressources du projet actuellement consultées.
