# NFLT RECORDS — suivi consolidé des 11 chantiers

**Mise à jour : 26 novembre 2026 — état rapproché des API GitHub et Cloudflare.** Ce document reflète l'état vérifié du dépôt GitHub, de Cloudflare, de D1/R2 et des ressources de travail accessibles.

| N° | Chantier | État actuel | Suite utile |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | **Worker de production actif et domaines personnalisés activés** (`nflt-records.com` et `www`). Workers Builds est connecté à `nfltrecords/NFLTWEBSITE`, branche `main`, avec build automatique et déploiement Wrangler. La version 219 est active à 100 %. L'indépendance vis-à-vis de Lovable/Supabase et le rendu réel des pages restent à certifier. | Garder les changements sur une branche/PR, valider la prévisualisation et le CI avant fusion ; ne pas supprimer `.lovable/` ni les intégrations Supabase sans migration testée. |
| 2 | Audio / extraits | **Le `main` actif est propre.** L'audit des 10 branches de travail a retrouvé trois archives de déploiement historiques (environ 22,7 MB chacune) dans sept branches ; chaque archive contenait 37 MP3 nommés `*_PREVIEW_30S.mp3`. Les 37 entrées ont été retirées de chacune des trois archives et les ZIP nettoyés ont été repoussés dans les sept branches, en préservant tous les autres fichiers. Les branches historiques conservent des composants/routes de préécoute : ne pas les fusionner. L'audit `npm run audit:assets` inspecte désormais aussi le contenu des ZIP. | Ne recréer aucun lecteur, fichier ou dossier de préécoute. |
| 3 | Catalogue et pochettes | **18 sorties et 18 pochettes publiques de 1536 × 1536 px** dans l’archive corrigée. R2 contient 18 JPG mesurés à 3000 × 3000 px. Les 18 noms sont rapprochés des UPC : 16 associations étayées par captures, 2 confirmées par le propriétaire ; l’intégration binaire exacte des deux dernières reste à vérifier. | Ne remplacer aucune pochette sans source HD validée. |
| 4 | Prix par sortie | **Barème de référence en place :** 9,99 € pour 1 piste, 14,99 € pour 5 pistes, 19,99 € pour 6 pistes ou plus. Les 18 décomptes de pistes sont confirmés dans `docs/track-count-evidence-2026-11-24.md`, dont Hustle & Grind (1 piste). | Garder le checkout fermé jusqu'à validation du vendeur, des droits, des taxes et de la livraison. |
| 5 | Administration | **Les routes `/admin/orders` et `/admin/audio` existent dans le code déployé et sont protégées par `ADMIN_ORDERS_CODE`.** L'inventaire D1/R2 confirme 18 associations WAV. Le rendu et l'authentification des pages n'ont pas pu être testés depuis le navigateur de l'environnement d'audit. Le CRM complet n'existe pas encore. | Valider les deux pages dans un navigateur autorisé, puis concevoir le CRM sur un environnement de développement. |
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

## Vérification Cloudflare complémentaire — 26 novembre 2026

- Les domaines personnalisés `nflt-records.com` et `www.nflt-records.com` sont activés sur le Worker `nfltwebsite`. La route explicite `/api/paypal/ipn` est également associée au Worker.
- Le dernier déploiement est la version 219 à 100 %. Le dernier build Workers a réussi et son déclencheur est un push GitHub sur `main`.
- Le contrôle HTTP externe depuis l'environnement d'audit a été refusé par une restriction de sortie réseau (403 « requests ... are not allowed »). La présence des domaines et le build réussi ne remplacent donc pas un test réel des pages dans un navigateur utilisateur.
- Les bindings D1/R2/KV et les paramètres SMTP non secrets sont présents. `SMTP_PASSWORD` est absent. Les secrets `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` existent encore ; le webhook PayPal REST du dépôt dépend aussi de `SUPABASE_SERVICE_ROLE_KEY`, qui n'est pas présent dans les bindings observés.

## Nettoyage des extraits

- La tête de `main` ne contient ni dossiers d'extraits, ni MP3 `*_PREVIEW_30S`, ni routes ou composants audio de préécoute.
- Trois archives historiques ont été retrouvées dans sept branches : `NFLT_CLOUDFLARE_UPLOAD_CORRIGE.zip`, `NFLT_PAGES_DEPLOY.zip` et `NFLT_SITE_CLOUDFLARE_UPLOAD.zip`. Chacune contenait 37 MP3 `*_PREVIEW_30S.mp3` (aucun WAV/M4A ni archive imbriquée).
- Les 37 MP3 ont été retirés de chacune des trois archives dans les sept branches : `work/audio-preview-audit`, `work/catalogue-previews-audit`, `work/footer-logo-original`, `work/nflt-kv-audio-delivery-rebased`, `work/operations-readiness`, `work/secure-audio-delivery` et `work/streaming-hub`. Les autres entrées ont été conservées ; les ZIP nettoyés contiennent 23 ou 24 entrées.
- Les 18 archives ZIP du Library inspectées ne contiennent aucun fichier audio. Le README de `NFLT-18-covers-and-mapping.zip` mentionne `audio-originals/` et `audio-inventory.csv`, mais ces éléments sont absents de l'archive réelle.
- Les 19 M4A pleine durée retrouvés dans le Library sont des sources audio complètes, pas des extraits ; ils sont conservés.
- Les branches historiques gardent encore du code de lecteur/route de préécoute ; ne pas les fusionner. Le contrôle `npm run audit:assets` bloque désormais aussi les entrées de préécoute à l'intérieur des ZIP.

## Déploiement et sécurité

- La PR d'administration WAV n°8 est fusionnée.
- Le Worker `nfltwebsite` est sur la version **219**, déployée à 100 % le 25 novembre 2026 à 23:35:21 UTC (deployment `b3c3819a-e367-459c-9268-d46562dc014e`, version `a49b5d6b-cb7e-429f-8b37-f6d9c95299db`). Workers Builds est relié au dépôt GitHub `nfltrecords/NFLTWEBSITE`, branche `main`, `auto_build_enabled=true`, commande `npm run build`, déploiement `npx wrangler deploy`. Le build le plus récent `f5c58885-9e41-4a58-a514-92f3fed2aaa1` a terminé avec `build_outcome=success` pour le commit `5ba11a50460023c708aad7a4ea346b2e88b2bdd2`.
- Le dernier commit documentaire sur `main` est `5ba11a50460023c708aad7a4ea346b2e88b2bdd2`. Les commits documentaires récents ont déclenché automatiquement Workers Builds et donc de nouveaux déploiements Worker, même sans modification du code applicatif. Le dernier build Cloudflare est réussi. Le statut courant des workflows GitHub Actions n'a pas été établi par le contrôle présent.
- La page `/admin/audio` utilise le code `ADMIN_ORDERS_CODE`, affiche l'inventaire et transfère les WAV par multipart R2 ; la signature RIFF/RF64 est vérifiée avant association D1.
- La livraison reste conditionnée à une commande réellement payée et à un ensemble WAV complet. Les M4A ne sont jamais servis comme masters.
- Le code garde `checkoutActivationApproved = false` et `checkoutEnabled = false` : les paiements réels restent fermés.
- Les paramètres SMTP hôte, port, utilisateur et expéditeur sont présents ; le secret SMTP de mot de passe n'est pas configuré, donc aucun envoi réel n'est déclaré opérationnel.
