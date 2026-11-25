# NFLT RECORDS — suivi consolidé des 11 chantiers

**Mise à jour : 25 novembre 2026.** Ce document reflète l'état vérifié du dépôt GitHub, de Cloudflare, de D1/R2 et des ressources de travail accessibles.

| N° | Chantier | État actuel | Suite utile |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | **Production active sur Cloudflare Workers.** Le domaine NFLT RECORDS sert le Worker `nfltwebsite`. Le site n'est plus servi par Lovable. | Continuer les améliorations directement sur GitHub `main` et laisser Workers Builds déployer. |
| 2 | Audio / extraits | **Le `main` actif est propre.** Aucun fichier `*_PREVIEW_30S`, `NFLT_PREVIEWS_30S.zip` ou dossier `public/assets/previews` n'existe dans la tête des 10 branches de travail examinées. Sept branches anciennes conservent toutefois des composants ou routes de préécoute (`ReleasePreview`, `PreviewLibrary`, `src/lib/previews.ts`) : ne pas les fusionner. Aucun fichier audio de préécoute n'a été trouvé dans les têtes de branche ou les archives ZIP inspectées. | Ne recréer aucun lecteur, fichier ou dossier de préécoute. |
| 3 | Catalogue et pochettes | **18 sorties et 18 pochettes publiques de 1536 × 1536 px** dans l’archive corrigée. R2 contient 18 JPG mesurés à 3000 × 3000 px. Les 18 noms sont rapprochés des UPC : 16 associations étayées par captures, 2 confirmées par le propriétaire ; l’intégration binaire exacte des deux dernières reste à vérifier. | Ne remplacer aucune pochette sans source HD validée. |
| 4 | Prix par sortie | **Barème de référence en place :** 9,99 € pour 1 piste, 14,99 € pour 5 pistes, 19,99 € pour 6 pistes ou plus. Les nombres de pistes sont maintenant vérifiés pour les 18 UPC, dont Hustle & Grind (1 piste). | Garder le checkout fermé jusqu'à validation du vendeur, des droits, des taxes et de la livraison. |
| 5 | Administration | **Deux pages protégées sont actives :** `/admin/orders` et `/admin/audio`. La page audio affiche l'inventaire des 18 sorties, les pistes attendues, les WAV associés et les manquants ; elle accepte les transferts WAV multiples pour un même UPC. | Utiliser l'inventaire pour compléter les associations UPC → WAV. |
| 6 | DNS | **Zone Cloudflare active.** Les enregistrements MX, SPF, DKIM et DMARC du domaine sont présents ; les hôtes mail/SMTP pointent vers le serveur mail. | Ne pas modifier les enregistrements sans nécessité démontrée. |
| 7 | Messagerie et notifications | Les paramètres SMTP hôte, port, utilisateur et expéditeur sont configurés. **Le secret `SMTP_PASSWORD` manque** ; les envois réels et les notifications ne sont donc pas validés. | Configurer le mot de passe SMTP directement dans les secrets Cloudflare, jamais dans Git ou dans le chat, puis tester un envoi réel. |
| 8 | Boutique et paiements | Panier partagé, vérification de disponibilité des masters et blocage des sorties incomplètes en place. **Le checkout reste désactivé** ; aucun paiement réel ne peut être pris. | Garder fermé jusqu'à validation du vendeur, des paramètres PayPal/IPN, des taxes, des droits et de la livraison. |
| 9 | Licences et royalties | Recherche documentaire uniquement ; aucun mandat ni dépôt de masters effectué. | Vérifier les droits master/composition, territoires, exclusivité, Content ID et contrats avant inscription. |
| 10 | Radio NFLT RECORDS NYC RADIO | Préparation seulement ; aucun flux continu ni serveur AzuraCast n'est déployé. | Reprendre après validation du serveur, du flux et des coûts Oracle/AzuraCast. |
| 11 | Structure et gestion des entités | NFLT RECORDS INC est la maison mère ; NFLT RECORDS FRANCE concerne les ventes de CD physiques en France ; NFLT RECORDS BRUSSELS est la succursale. | Définir le vendeur, les droits et la livraison pour chaque opération avant d'ouvrir les paiements. |

## État des masters WAV et des sources complètes

- D1 contient **18 associations WAV** couvrant **12 UPC** ; les 18 objets WAV correspondants existent dans R2. Aucun objet WAV n'est orphelin et aucune association D1 ne pointe vers un objet absent.
- **11 sorties** ont leur ensemble WAV complet : 10 singles et `0+` (5 pistes).
- **NOUS Y SOMMES** possède 3 WAV sur 9 pistes ; les 6 autres pistes ont des sources M4A complètes.
- **30.000 GÉNOCIDES** possède 8 pistes, actuellement conservées en M4A complet.
- Cinq singles n'ont pas de WAV dans R2 : **#NEVERFAKELIKETHEM**, **Dilemma**, **Hustle & Grind**, **Hot** et **GR 4LIFE**. Chacun a une source M4A complète dans le Library.
- Il y a donc **19 pistes avec source M4A mais sans équivalent WAV trouvé** : 6 pour NOUS Y SOMMES, 8 pour 30.000 GÉNOCIDES et 5 singles. Les M4A sont conservés comme sources et ne remplacent jamais les masters WAV.
- Les 19 M4A ont été mesurés entre **71,332 et 210,233 secondes** ; aucun n'est un extrait de 30 secondes.
- L'inventaire R2 compte **37 objets** : 18 WAV, 18 JPG et un objet vide de préfixe. Aucun M4A ni MP3 de préécoute n'y figure.
- Les 18 WAV ont une signature `RIFF` ou `RF64` suivie de `WAVE`. Les 17 copies locales disponibles correspondent aux ETag MD5 des objets R2 ; le fichier `...2.wav` est présent dans R2 et valide, sans copie locale retrouvée. Le doublon local `...3(1).wav` est identique à `...3.wav`.

## Nettoyage des extraits

- La tête de `main` ne contient ni dossiers d'extraits, ni MP3 `*_PREVIEW_30S`, ni routes ou composants audio de préécoute. `npm run audit:assets` bloque leur réintroduction dans le code actif.
- Les têtes des branches de travail examinées ne contiennent aucun fichier MP3 de 30 secondes ni archive `NFLT_PREVIEWS_30S.zip`.
- Des composants de préécoute subsistent dans des branches historiques non fusionnées : `work/audio-preview-audit`, `work/catalogue-previews-audit`, `work/footer-logo-original`, `work/nflt-kv-audio-delivery-rebased`, `work/operations-readiness`, `work/secure-audio-delivery` et `work/streaming-hub`. Ne pas fusionner ces branches sans nettoyage.
- Les 18 archives ZIP du Library inspectées ne contiennent aucun master WAV, M4A ou MP3 de préécoute. Le README de `NFLT-18-covers-and-mapping.zip` mentionne `audio-originals/` et `audio-inventory.csv`, mais ces éléments sont absents de l'archive réelle.
- Les 19 M4A pleine durée retrouvés dans le Library sont des sources audio complètes, pas des extraits ; ils sont conservés.

## Déploiement et sécurité

- La PR d'administration WAV n°8 est fusionnée.
- Le Worker `nfltwebsite` est actuellement sur la version **212**, déployée à 100 % le 25 novembre 2026 à 15:35:28 UTC. La version 211 précédente date de 15:18:04 UTC.
- Le dernier commit `main` connu, `e7c940ac`, est un commit de documentation créé à 15:34:23 UTC. Le workflow GitHub Actions `45642986197` a réussi pour le commit runtime `c7a8c80` à 15:16 UTC. Cloudflare ne fournit pas de SHA Git dans les annotations de la version 212 : la correspondance exacte entre version 212 et SHA Git n'est donc pas prouvée.
- La page `/admin/audio` utilise le code `ADMIN_ORDERS_CODE`, affiche l'inventaire et transfère les WAV par multipart R2 ; la signature RIFF/RF64 est vérifiée avant association D1.
- La livraison reste conditionnée à une commande réellement payée et à un ensemble WAV complet. Les M4A ne sont jamais servis comme masters.
- Le code garde `checkoutActivationApproved = false` et `checkoutEnabled = false` : les paiements réels restent fermés.
- Les paramètres SMTP hôte, port, utilisateur et expéditeur sont présents ; le secret SMTP de mot de passe n'est pas configuré, donc aucun envoi réel n'est déclaré opérationnel.
