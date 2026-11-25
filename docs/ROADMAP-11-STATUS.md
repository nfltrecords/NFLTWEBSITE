# NFLT RECORDS — suivi consolidé des 11 chantiers

**Mise à jour : 25 novembre 2026.** Ce document reflète l'état vérifié du dépôt GitHub, de Cloudflare, de D1/R2 et des ressources de travail accessibles.

| N° | Chantier | État actuel | Suite utile |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | **Production active sur Cloudflare Workers.** Le domaine NFLT RECORDS sert le Worker `nfltwebsite`. Le site n'est plus servi par Lovable. | Continuer les améliorations directement sur GitHub `main` et laisser Workers Builds déployer. |
| 2 | Audio / extraits | **Extraits de 30 secondes supprimés.** Le dossier `public/assets/previews`, les MP3 `*_PREVIEW_30S` et l'archive `NFLT_PREVIEWS_30S.zip` ont été retirés de toutes les branches GitHub. Les 15 archives de préparation de la bibliothèque qui contenaient les extraits ont été nettoyées. | Ne recréer aucun lecteur, fichier ou dossier de préécoute. |
| 3 | Catalogue et pochettes | **18 sorties et 18 pochettes HD de 1536 × 1536 px confirmées** dans l’archive corrigée ; le bucket R2 conserve 19 visuels. | Ne remplacer aucune pochette sans source HD validée. |
| 4 | Prix par sortie | **Barème indicatif en place :** 9,99 € pour 1 piste, 14,99 € pour 5 pistes, 19,99 € pour 6 pistes ou plus. Les nombres de pistes sont confirmés pour 17 UPC ; Hustle & Grind reste à confirmer. | Garder les prix indicatifs tant que le nombre de pistes de Hustle & Grind n'est pas confirmé. |
| 5 | Administration | **Deux pages protégées sont actives :** `/admin/orders` et `/admin/audio`. La page audio affiche l'inventaire des 18 sorties, les pistes attendues, les WAV associés et les manquants ; elle accepte les transferts WAV multiples pour un même UPC. | Utiliser l'inventaire pour compléter les associations UPC → WAV. |
| 6 | DNS | **Zone Cloudflare active.** Les enregistrements MX, SPF, DKIM et DMARC du domaine sont présents ; les hôtes mail/SMTP pointent vers le serveur mail. | Ne pas modifier les enregistrements sans nécessité démontrée. |
| 7 | Messagerie et notifications | Les paramètres SMTP hôte, port, utilisateur et expéditeur sont configurés. **Le secret `SMTP_PASSWORD` manque** ; les envois réels et les notifications ne sont donc pas validés. | Configurer le mot de passe SMTP directement dans les secrets Cloudflare, jamais dans Git ou dans le chat, puis tester un envoi réel. |
| 8 | Boutique et paiements | Panier partagé, vérification de disponibilité des masters et blocage des sorties incomplètes en place. **Le checkout reste désactivé** ; aucun paiement réel ne peut être pris. | Garder fermé jusqu'à validation du vendeur, des paramètres PayPal/IPN, des taxes, des droits et de la livraison. |
| 9 | Licences et royalties | Recherche documentaire uniquement ; aucun mandat ni dépôt de masters effectué. | Vérifier les droits master/composition, territoires, exclusivité, Content ID et contrats avant inscription. |
| 10 | Radio NFLT RECORDS NYC RADIO | Préparation seulement ; aucun flux continu ni serveur AzuraCast n'est déployé. | Reprendre après validation du serveur, du flux et des coûts Oracle/AzuraCast. |
| 11 | Structure et gestion des entités | NFLT RECORDS INC est la maison mère ; NFLT RECORDS FRANCE concerne les ventes de CD physiques en France ; NFLT RECORDS BRUSSELS est la succursale. | Définir le vendeur, les droits et la livraison pour chaque opération avant d'ouvrir les paiements. |

## État des masters WAV

- D1 contient **18 associations WAV** couvrant **12 UPC** ; les 18 objets WAV correspondants existent dans R2, sans objet WAV orphelin ni association manquante.
- **11 sorties** ont leur ensemble complet de masters.
- **NOUS Y SOMMES** possède 3 masters sur 9 : 6 manquants.
- Cinq sorties vérifiées n'ont aucun master associé : **Hot** (1), **Dilemma** (1), **#NEVERFAKELIKETHEM** (1), **30.000 GÉNOCIDES** (8) et **GR 4LIFE** (1).
- Cela représente **18 WAV manquants** pour les tracklists vérifiées. **Hustle & Grind** n'a pas de WAV associé et son nombre de pistes reste à confirmer.
- Les 19 fichiers M4A encore présents dans la bibliothèque de travail ont été mesurés entre 71 et 210 secondes : ce sont des fichiers audio complets, pas des extraits de 30 secondes. Ils restent conservés comme sources et ne remplacent jamais les masters WAV.
- Après le nettoyage, R2 contient 37 objets : 18 WAV et 19 visuels. Aucun MP3 de préécoute ni fichier M4A de préécoute n'y reste.

## Nettoyage des extraits

- Les dossiers `assets/previews` et `public/assets/previews`, les 37 noms de MP3 `*_PREVIEW_30S` et `NFLT_PREVIEWS_30S.zip` ont été retirés de toutes les branches GitHub.
- Les 15 archives de préparation de la bibliothèque qui contenaient ces fichiers ont été réécrites sans les extraits ; les archives de marque et de pochettes qui n'en contenaient pas ont été conservées.
- Le contrôle `npm run audit:assets` interdit le retour des dossiers, des routes et composants de préécoute, ainsi que de l'archive d'extraits.
- Les lecteurs de préécoute ne sont plus présents dans le catalogue ni dans la boutique en production.

## Déploiement et sécurité

- La PR d'administration WAV n°8 est fusionnée.
- Le commit runtime `6e3c836f59b2433f205424b12daf07cf54e57949` a passé tests, build, TypeScript et lint, puis a été déployé sur Cloudflare Workers le 25 novembre 2026 à 10:34:57 UTC.
- La page `/admin/audio` utilise le code `ADMIN_ORDERS_CODE`, affiche l'inventaire et transfère les WAV par multipart R2 ; la signature RIFF/RF64 est vérifiée avant association D1.
- La livraison reste conditionnée à une commande réellement payée et à un ensemble WAV complet. Les M4A ne sont jamais servis comme masters.
- Le code garde `checkoutActivationApproved = false` : les paiements réels restent fermés.
- Les mises à jour de documentation et de l'audit anti-préécoute sont en cours de vérification séparée ; elles ne modifient pas le parcours de paiement.
