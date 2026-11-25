# NFLT RECORDS — DOSSIER DE TRANSFERT COMPLET POUR LE PROCHAIN CHAT

**État arrêté au 26 novembre 2026 — document de continuité opérationnelle**  
**But :** permettre à un autre assistant de reprendre le travail sans recommencer les audits, sans redemander les informations déjà connues et sans casser les éléments fonctionnels.

> **Instruction prioritaire au prochain assistant :** lire ce document, puis consulter les fichiers du dépôt GitHub et les rapports référencés avant toute action. Travailler sur l'existant. Ne pas poser à nouveau les questions auxquelles ce document répond. Ne jamais annoncer une tâche terminée sans vérification réelle. Ne pas confondre sauvegarde d'un rapport, publication GitHub, déploiement Worker et mise en ligne du site.

---

## 1. Identité, structure et objectifs de NFLT RECORDS

- **Marque :** NFLT RECORDS.
- **Société mère :** NFLT RECORDS INC. L'utilisateur a demandé que la présentation principale du site fasse apparaître « New-York » à la place de « INC » dans l'intitulé public demandé ; ne pas modifier les dénominations légales sans validation.
- **Filiale française :** NFLT RECORDS FRANCE, structure SASU évoquée. L'utilisateur a précisé que la France concerne notamment la vente de CD physiques.
- **Implantation belge :** NFLT RECORDS BRUSSELS, succursale/branche bruxelloise.
- Ne pas attribuer automatiquement les ventes, droits, obligations TVA ou contrats à une entité sans validation juridique par territoire et type de produit.
- Site public : https://nflt-records.com/
- Dépôt source : https://github.com/nfltrecords/NFLTWEBSITE — branche `main`.
- Projet Lovable historique : « Nflt Records », https://lovable.dev/projects/cdbee42f-7bac-4642-b354-caed9c4dd9b1. Objectif de l'utilisateur : sortir de Lovable en préservant le site existant, pas le reconstruire à zéro.

## 2. Contraintes non négociables à respecter

1. **Pas de WordPress, pas de PrestaShop, pas de Stripe.**
2. Ne pas convertir les M4A en WAV pour les faire passer pour des masters originaux. Ne pas remplacer, recomprimer, tronquer ou renommer les masters sans nécessité et validation.
3. **Aucun extrait audio de 30 secondes** sur le site, dans la boutique ou dans une archive de déploiement. Les lecteurs et références de previews ont été retirés du code actif et des archives de préparation nettoyées. Ne pas les réintroduire.
4. Ne pas toucher aux biographies/profils Spotify ni aux comptes DistroKid. Ne pas faire de changement DNS à l'aveugle.
5. Ne pas activer le checkout réel tant que les prérequis juridiques, e-mail, tests PayPal et autorisation explicite du propriétaire ne sont pas réunis.
6. Les téléchargements complets doivent être accessibles uniquement après paiement confirmé et vérifié côté serveur.
7. Préserver le site, les pochettes, les données, les masters et les fonctions existantes qui marchent. Faire des sauvegardes et prévoir un retour arrière avant tout changement de production.
8. L'utilisateur a déjà confirmé le destinataire PayPal : **ne pas lui redemander cette confirmation**. Le mot de passe SMTP n'a pas été fourni et ne doit jamais être demandé dans le chat ni écrit dans GitHub.
9. L'utilisateur souhaite une exécution directe, concise, sans répétitions et sans demandes de re-téléversement de fichiers déjà présents dans GitHub, Cloudflare ou la Bibliothèque.

## 3. Environnements et identifiants techniques connus

### GitHub
- Repository : `nfltrecords/NFLTWEBSITE`
- Branche principale : `main`
- Le commit de tête vu lors de l'audit de l'arborescence est `7d412632b75085145f02ba68a91f9a7b491cdee3`.
- Le document de transfert masters déjà commité existe sous `docs/NFLT-HANDOFF-MASTERS-2026-11-26.md` (mais son contenu est ancien/incohérent : voir section 8 et le corriger).

### Cloudflare
- Account ID : `dc85caec065ff9d86b601859aa0f00f3`
- Worker principal du site : `nfltwebsite`
- Bucket R2 : `nflt-audio-master`
- Préfixe des masters : `18 master/`
- Base D1 : `e64a7e2a-ac50-4b69-9b28-c0ce9ea5c9fe`
- Worker `nfltwebsite` est présent, a des modules et des assets, date de compatibilité `2026-11-15`, et une route observée : `nflt-records.com/api/paypal/ipn`. Les logs/observabilité sont activés.
- D'autres Workers existent dans le compte : `cold-fog-44b8`, `round-base-eb68`, `young-grass-5845`. Ne pas les supprimer ni supposer qu'ils servent le site.
- Un Worker nommé `nfltwebsite` existe ne signifie pas à lui seul que toutes les routes du site ou le domaine racine sont correctement servis par lui. Contrôler les routes et le déploiement réel avant de conclure.

### Stockage de travail ChatGPT / Bibliothèque
- Rapport local de cette session : `/mnt/data/NFLT-TRANSFERT-COMPLET-CHAT-2026-11-26.md`.
- Le runtime de travail peut contenir les pièces jointes de la conversation et les rapports générés. Ce chemin local est un espace de travail de session, pas un stockage durable garanti après fermeture du chat.
- Une copie persistante doit être placée dans la Bibliothèque ChatGPT et dans GitHub/R2. La mémoire ChatGPT se construit de façon asynchrone ; l'assistant ne peut pas forcer l'écriture directe dans le résumé Memory depuis le chat. Ce document doit donc être utilisé comme référence durable.

## 4. Arborescence réelle du dépôt GitHub — branche main

L'arborescence a été relue via l'API GitHub. Principaux dossiers et fichiers (liste fonctionnelle, pas chaque composant UI générique) :

```text
NFLTWEBSITE/
├── .cloudflare-extraction-trigger
├── .env.example
├── .env.production
├── .github/
│   └── workflows/
│       ├── nflt-safe-verification.yml
│       ├── prepare-cloudflare-source.yml
│       └── verify-source.yml
├── .lovable/
│   ├── catalogue-readiness-review.json
│   ├── commerce-config.json
│   ├── legal/
│   │   ├── conditions-de-vente.fr.md
│   │   ├── confidentialite.fr.md
│   │   ├── privacy-policy.en.md
│   │   ├── review.md
│   │   └── terms-of-sale.en.md
│   ├── north-star/north-star.md
│   ├── owner-evidence-report-2026-11-14.md
│   └── project.json
├── docs/
│   ├── ADMIN-DASHBOARD-ACCESS-MATRIX.md
│   ├── ADMIN-DASHBOARD-PLAN.md
│   ├── AUDIO-RECONCILIATION-2026-11-25.md
│   ├── DNS-EMAIL-READINESS.md
│   ├── ENTITY-GOVERNANCE.md
│   ├── LICENSING-PLATFORM-REVIEW.md
│   ├── NFLT-HANDOFF-MASTERS-2026-11-26.md
│   ├── PAYHIP-READINESS.md
│   ├── PAYPAL-CHECKOUT-READINESS.md
│   ├── PRICE-VERIFICATION.md
│   ├── R2-MASTER-INVENTORY.md
│   ├── RADIO-READINESS.md
│   ├── ROADMAP-11-STATUS.md
│   ├── SITE-STATIC-AUDIT.md
│   ├── track-count-evidence-2026-11-24.md
│   └── sql/
│       ├── admin-dashboard-foundation.draft.sql
│       └── admin-dashboard-rls-test-plan.sql
├── drizzle/
│   ├── migrations/
│   │   ├── 0000_create_contact_messages.sql
│   │   ├── 0001_create_licensing_inquiries.sql
│   │   └── 0002_create_private_shop_orders.sql
│   └── schema.ts
├── migrations/d1/
│   ├── 0001_shop_email_deliveries.sql
│   └── 0002_shop_release_asset_unique_names.sql
├── public/
│   ├── assets/covers/       (18 pochettes JPG, noms basés sur UPC)
│   ├── _headers
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon* et apple-touch-icons
├── scripts/audit-assets.mjs
├── src/
│   ├── assets/covers/       (18 fichiers de métadonnées de pochettes + verified/)
│   ├── assets/store/        (visuels Google Play FR/EN)
│   ├── components/          (ApplicationPage, CommercePages, EnglishPages,
│   │                         LabelPages, RadioPage, ReleasePrice, SiteLayout,
│   │                         StreamingPage, UI components)
│   ├── hooks/use-mobile.tsx
│   ├── integrations/supabase/ (auth, middleware, clients, types)
│   ├── lib/                 (catalogue, covers, audio-assets, commerce,
│   │                         PayPal/IPN, panier, livraison, SMTP/e-mail,
│   │                         SEO, radio, administration)
│   ├── routes/              (pages FR/EN, catalogue, boutique, admin,
│   │                         commandes, API PayPal, téléchargement, contact)
│   ├── test/                (tests Vitest et mocks Cloudflare)
│   ├── router.tsx, routeTree.gen.ts, server.ts, start.ts, styles.css
├── package.json
├── package-lock.json
├── wrangler.jsonc
├── drizzle.config.ts
├── README.md
├── README-CLOUDFLARE-FR.md
├── MIGRATION-AUDIT-2026-11-15.md
├── NFLT-18-covers-and-mapping.zip
└── nflt-records.zip
```

### Routes principales présentes dans `src/routes/`
- FR : `/`, `/a-propos`, `/artistes`, `/boutique`, `/catalogue`, `/catalogue/$upc`, `/commande/confirmation`, `/commande/paiement`, `/conditions-de-vente`, `/confidentialite`, `/contact`, `/ecouter`, `/implantations`, `/licences-musicales`, `/messages`, `/nflt`, `/presse`, `/radio`, `/services`, `/application`.
- EN : `/en`, `/en/about`, `/en/artists`, `/en/shop`, `/en/catalogue`, `/en/catalogue/$upc`, `/en/contact`, `/en/listen`, `/en/music-licensing`, `/en/nflt`, `/en/press`, `/en/radio`, `/en/services`, `/en/application`, `/en/privacy-policy`, `/en/terms-of-sale`.
- Administration/API : `/admin`, `/admin/audio`, `/admin/orders`, `/api/admin/audio`, `/api/admin/orders`, `/api/download`, `/api/order-status`, `/api/paypal/ipn`, `/api/paypal/webhook`, `/api/shop-availability`.

### Fonctions techniques du code
- Site React/TypeScript avec Vite/TanStack Router (voir `package.json`, `src/router.tsx`, `src/routes`).
- Cloudflare Worker via `wrangler.jsonc` ; D1 et R2 utilisés pour les actifs boutique.
- PayPal IPN côté serveur ; téléchargement contrôlé par commande payée ; SMTP via Worker pour livraison e-mail.
- Les intégrations Supabase restent visibles dans `src/integrations/supabase/` et certaines références Lovable subsistent. Ne pas déclarer la sortie de Lovable terminée tant que ces dépendances n'ont pas été examinées et éliminées ou justifiées.

## 5. Workflows GitHub Actions et publication

- `.github/workflows/verify-source.yml` : vérification de source (installation des dépendances, tests, audit assets, génération types Cloudflare, build/typecheck/lint selon le fichier). C'est un workflow de vérification, pas un déploiement.
- `.github/workflows/prepare-cloudflare-source.yml` : workflow manuel de préparation de source. Le fichier versionné indique que l'extraction automatique/push a été volontairement désactivée. Ne pas supposer qu'un push `main` déploie le site.
- `.github/workflows/nflt-safe-verification.yml` : workflow de vérification additionnel ; lire le fichier avant de l'utiliser.
- **État important :** le dépôt ne montre pas de workflow de déploiement production automatique confirmé. La publication d'un document dans GitHub ne publie pas le site Cloudflare.
- Un audit précédent a rapporté des erreurs npm réseau (`EAI_AGAIN registry.npmjs.org`) dans un environnement de préparation. Le dépôt possède désormais un `package-lock.json` (429 901 octets dans l'arborescence consultée), contrairement à l'état plus ancien sans lockfile. Refaire une vraie exécution du CI avant d'affirmer que build/tests sont verts.
- Un audit statique a également noté que des résultats de tests/build antérieurs étaient historiques et ne valaient pas une nouvelle exécution de la branche actuelle.

## 6. Cloudflare — données, Worker, R2, D1

### Worker
- Le Worker `nfltwebsite` existe et a été modifié le 25 novembre 2026 à 23:22 UTC environ lors de la dernière inspection.
- Il utilise modules et assets, compatibilité `2026-11-15`, et la route `nflt-records.com/api/paypal/ipn` est associée à ce Worker.
- L'API de liste Worker a aussi retourné trois autres scripts sans association démontrée à NFLT. Ne pas les supprimer.
- Aucun déploiement de site n'a été fait simplement par l'ajout du rapport GitHub/R2.

### R2
- Bucket : `nflt-audio-master`.
- Préfixe des 18 fichiers WAV : `18 master/`.
- Les masters originaux ont été vérifiés dans le contrôle antérieur : signatures RIFF/WAVE ou RF64/WAVE et tailles vérifiées ; aucun fichier converti ou recompressé.
- Le bucket a été décrit dans l'audit précédent comme contenant aussi 19 visuels (37 objets au total après nettoyage), mais le point à retenir pour les masters est 18 WAV associés. Le listing complet actuel doit être refait avant d'affirmer le nombre d'objets global.
- Le rapport de masters a été copié dans `reports/NFLT-HANDOFF-MASTERS-2026-11-26.md`, mais **la copie R2 actuellement lue est une ancienne version** (taille 2797 octets, ETag `27873a3b5a011fb4e6824983265d7b1c`) et contient la phrase erronée disant qu'aucun autre fichier audio n'est requis. Il faut la remplacer par le présent état corrigé.

### D1
- Database ID : `e64a7e2a-ac50-4b69-9b28-c0ce9ea5c9fe`.
- Tables présentes au contrôle du 26 novembre : `_cf_KV`, `contact_messages`, `licensing_inquiries`, `shop_email_deliveries`, `shop_orders`, `shop_release_assets`, `sqlite_sequence`.
- Les 18 masters présents dans R2 ont chacun une association dans `shop_release_assets`.
- L'état précédemment contrôlé : 18 lignes `shop_release_assets`, toutes pour WAV, pas de M4A dans ces associations.
- État commandes précédemment observé : 2 commandes `pending`, 0 `paid`; e-mails de livraison 0. Refaire la requête avant de présenter ces chiffres comme état actuel.

## 7. Audio — catalogue, masters, preuves et limites exactes

### Inventaire des 18 WAV présents dans R2 (`18 master/`)
| UPC | Fichier | Taille octets |
|---|---|---:|
| 199751168234 | `MASTERPIECE.wav` | 20 094 798 |
| 199751170992 | `NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS.wav` | 22 249 550 |
| 199751511160 | `NFLTTHEDOPIESTCOLLECTIONBEATNFLRECORDS.wav` | 24 539 214 |
| 199751512501 | `NFLTINMYPARTYBEATNFLTRECORDS.wav` | 21 430 350 |
| 199751514697 | `DCVOL2.wav` | 56 389 454 |
| 199751613871 | `NFLT.wav` | 30 023 502 |
| 199951252436 | `medley.wav (1)` | 69 890 138 |
| 199954147302 | `NINTENDO.wav` | 27 418 446 |
| 199955740199 | `NFLTTHELUXURYTHEHIGHESTUNEQUIVOCAL.wav` | 90 938 982 |
| 199956222809 | `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO.wav` | 22 931 498 |
| 199956222809 | `JAIPASBONQUELESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO2.wav` | 27 173 102 |
| 199956222809 | `JAIPASBONQUELESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3.wav` | 26 437 294 |
| 199956554184 | `Calamite.wav` | 40 749 030 |
| 199956554184 | `DebrisFlaqueDechetsCancres.wav` | 25 476 686 |
| 199956554184 | `Flatulence.wav` | 20 727 002 |
| 199956554184 | `Laplusgrosseenc.wav` | 24 816 974 |
| 199956554184 | `NFLTO.wav` | 28 954 446 |
| 199956557857 | `Ridewithme.wav` | 38 723 406 |

### Correction réellement effectuée le 26 novembre
- `18 master/medley.wav (1)` avait un MIME générique `application/octet-stream` malgré une signature RIFF/WAVE valide.
- Le même contenu binaire a été réenregistré avec `Content-Type: audio/wav`.
- Taille identique : 69 890 138 octets ; ETag identique : `cfa6e5ce2a891f4d09b1c9dcc598eb1f` ; relecture confirmée.
- Aucun transcodage, aucune compression, aucun changement de contenu audio.

### Catalogue total : 37 pistes sur 18 sorties
Le fichier `docs/track-count-evidence-2026-11-24.md` donne les preuves de comptage. La réconciliation du 25 novembre conclut à 18 WAV en R2 et 19 pistes supplémentaires dont les sources disponibles dans la Bibliothèque sont uniquement des M4A. Les M4A ne doivent pas être traités comme masters WAV originaux.

| UPC | Sortie | Pistes | WAV associés connus | État selon audit |
|---|---|---:|---:|---|
| 199751168234 | 836.722 (1995) [18] [73] | 1 | 1 | complet |
| 199751170992 | Transcendence Of Natural Truths | 1 | 1 | complet |
| 199751508283 | Hot | 1 | 0 | WAV manquant |
| 199751511160 | The Dopest Collection Vol. 1 | 1 | 1 | complet |
| 199751512501 | In My Party | 1 | 1 | complet |
| 199751514697 | The Dopest Collection Vol. 2 | 1 | 1 | complet |
| 199751613871 | Ma Luxure | 1 | 1 | complet |
| 199951252436 | L'écran vient de chez nous (Radio Edit) | 1 | 1 | complet |
| 199954147302 | NFLT Social Community (The Most Advanced Societies) | 1 | 1 | complet |
| 199955701558 | Dilemma (Radio Edit) | 1 | 0 | WAV manquant |
| 199955715135 | #NEVERFAKELIKETHEM (Chapter One) | 1 | 0 | WAV manquant |
| 199955715203 | Hustle & Grind (Radio Edit) | à confirmer | 0 | comptage et master à confirmer |
| 199955740199 | The Luxury - The Highest - Unequivocal | 1 | 1 | complet |
| 199955742094 | 30.000 GÉNOCIDES | 8 | 0 | 8 WAV manquants |
| 199956222809 | NOUS Y SOMMES (TU M'AURAS JAMAIS) | 9 | 3 | 6 WAV manquants |
| 199956554184 | 0+ | 5 | 5 | complet |
| 199956557857 | Ma Luxure 2 (MVP) | 1 | 1 | complet |
| 821440674572 | GR 4LIFE | 1 | 0 | WAV manquant |

**Bilan précis de l'audit du 25 novembre :** 18 WAV associés en D1 couvrent 12 UPC. 11 sorties vérifiées ont tous leurs masters, NOUS Y SOMMES n'a que 3 WAV sur 9, cinq sorties vérifiées n'ont aucun WAV (Hot, Dilemma, #NEVERFAKELIKETHEM, 30.000 GÉNOCIDES, GR 4LIFE). Cela fait 18 masters WAV manquants sur les tracklists vérifiées. Hustle & Grind n'a pas de WAV associé et son nombre exact de pistes reste non confirmé. Les 19 fichiers M4A listés ci-dessous sont les sources de certaines de ces pistes, pas des WAV originaux.

### M4A présents en source dans la Bibliothèque (ne pas convertir)
- `NOUS Y SOMMES` UPC `199956222809` : `Dunckes.m4a`, `Dunckes2.m4a`, `Nousysommes.m4a`, `ONTELAFOUTUAUQ.m4a`, `AMORTTESCHIENS.m4a`, `PERSONNESEMARREICI.m4a` (6 pistes M4A ; les 3 autres pistes de la sortie ont déjà un WAV).
- `30.000 GÉNOCIDES` UPC `199955742094` : `30.000Genocides.m4a`, `Laveritetenique.m4a`, `Arreteoutoutpete.m4a`, `ExtremementGrave.m4a`, `Lesuivi.m4a`, `Yapasdecouilleici.m4a`, `Tufouslamerdededingue.m4a`, `Sasempirepourtoi.m4a` (8 pistes M4A).
- Singles : `NEVERFAKELIKETHEM.m4a` UPC `199955715135`, `Dilemma.m4a` UPC `199955701558`, `Hustlegrind.m4a` UPC `199955715203`, `NFLTHOT.m4a` UPC `199751508283`, `GR4LIFE.m4a` UPC `821440674572`.
- Le rapport détaillé est `docs/AUDIO-RECONCILIATION-2026-11-25.md`.
- Le ZIP `NFLT-18-covers-and-mapping.zip` a été inspecté antérieurement : il contient des pochettes/captures/mapping, pas les WAV manquants. Les archives ZIP du site examinées ne contenaient pas les masters WAV manquants.

### Règle de livraison audio
- Le mécanisme de boutique doit vérifier le nombre de pistes confirmé, le nombre de masters WAV présents et les objets associés avant de permettre une commande.
- Pas de livraison d'une sortie incomplète. Le panier et l'API de disponibilité doivent refuser les références dont les masters complets ne sont pas tous présents.
- La livraison doit servir les WAV uniquement, après commande payée vérifiée.

## 8. Incohérence à corriger dans les rapports précédents

Le fichier actuellement commité dans GitHub `docs/NFLT-HANDOFF-MASTERS-2026-11-26.md` (blob SHA `98ccdc4dbf997558cfcdac5a12d1c544397b9e45`) et la copie R2 `reports/NFLT-HANDOFF-MASTERS-2026-11-26.md` sont **obsolètes**. Ils contiennent une affirmation erronée selon laquelle aucun autre audio n'est requis et que les 18 masters couvrent tout le périmètre.

La version correcte est : **18 WAV originaux actuellement présents et associés dans R2/D1 ; la réconciliation catalogue 37 pistes/18 sorties montre 19 pistes supplémentaires disponibles en M4A seulement et non converties ; le dossier de 18 WAV est contrôlé, mais la disponibilité des 37 WAV originaux n'est pas certifiée.**

Le prochain assistant doit mettre à jour les deux copies obsolètes avec cette vérité, sans supprimer l'historique ni modifier les masters.

## 9. Boutique, PayPal, commandes et e-mails

### État du code et des protections
- Le code prévoit PayPal Classic/IPN, une vérification de notification côté serveur, et un téléchargement protégé.
- L'IPN doit vérifier auprès de PayPal la notification, le destinataire, le statut `Completed`, la devise EUR, le montant, les UPC/quantités du panier et l'unicité de la transaction.
- Remboursement complet ou inversion : révoquer l'accès ; annulation d'inversion : restaurer l'accès ; remboursement partiel : revue manuelle.
- Les notifications invalides ne doivent jamais marquer une commande comme payée.
- Les liens de téléchargement ne sont affichés que lorsque tous les masters de la commande sont présents.
- Les routes `/admin/orders` et `/admin/audio` sont prévues. L'accès admin utilise un code/secret `ADMIN_ORDERS_CODE` ; ne pas le mettre dans GitHub ni l'afficher au public.
- `/admin/orders` sert à consulter/administrer les commandes et tester/renvoyer l'e-mail selon les fonctions réelles. `/admin/audio` sert à vérifier l'inventaire et transférer des masters WAV manquants pour un UPC.
- L'upload audio utilise multipart R2, session/ETags temporaires KV, vérification de taille, association D1 avec asset key `r2:` ; doublons de noms rejetés et finalisation idempotente selon le dossier de readiness.

### Verrou de checkout
- `checkoutActivationApproved` reste à `false` dans l'état documenté.
- `PAYPAL_CHECKOUT_ENABLED` doit également être activé côté environnement pour démarrer le checkout ; les deux conditions sont requises.
- Aucun paiement réel n'a été confirmé dans les vérifications documentées. État commande vu antérieurement : 2 pending, 0 paid.
- Ne pas activer le checkout réel avant validation juridique, email et tests Sandbox/flux PayPal, puis autorisation explicite du propriétaire.

### SMTP / livraison e-mail
- SMTP existant via LWS, TLS, hôte `mail.nflt-records.com`, port `465`.
- Variables présentes côté Worker selon l'audit : `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `SMTP_USER`.
- **Secret manquant : `SMTP_PASSWORD`**, mot de passe de la boîte `nflt-records@nflt-records.com`. Ne jamais le demander dans le chat, l'inscrire dans GitHub ou le rapport, ni l'exposer dans un log.
- Table D1 `shop_email_deliveries` créée ; file d'envoi idempotente après IPN vérifié ; tentatives/reprises ; possibilité de test depuis `/admin/orders`.
- Aucune livraison client n'a été prouvée. Ajouter le secret uniquement dans Cloudflare Workers & Pages → `nfltwebsite` → Settings → Variables and Secrets → Add secret, puis effectuer un test d'e-mail contrôlé et vérifier la réception réelle.
- Les DNS de messagerie ont été documentés avec MX, SPF, DKIM, DMARC, serveur mail DNS-only. Ne pas les modifier sans snapshot et plan de retour arrière.

### PayPal
- Le propriétaire a confirmé le destinataire PayPal. Ne pas redemander cette information.
- Les paiements doivent être testés en environnement contrôlé/Sandbox avant toute ouverture réelle.
- Le lien PayPal.Me personnel avait été envisagé comme solution provisoire, mais ne pas le confondre avec un IPN marchand automatisé validé. Le flux réel d'une transaction et la livraison automatique ne sont pas certifiés.
- Le checkout a été demandé désactivé pendant les essais simulés. Respecter ce verrou.

## 10. Tarifs, catalogue, pochettes et expérience boutique

- Catalogue de référence : 18 sorties / 37 pistes selon preuves, mais les masters WAV complets ne sont pas tous présents.
- Pochettes : 18 JPG sous `public/assets/covers/`, noms `cover-<UPC>.jpg`; métadonnées complémentaires dans `src/assets/covers/` et `verified/`.
- Les fichiers originaux des pochettes ont été documentés comme 1536 × 1536 px dans un audit antérieur ; certains noms d'archives indiquaient 3000x3000 mais la mesure réelle mentionnée était 1536.
- L'utilisateur souhaite des pochettes HD/professionnelles, une présentation claire, et les prix affichés à côté de chaque projet plutôt que cachés dans un menu déroulant en haut (« menu McDonald »).
- Prix de référence connus : 9,99 € pour 1 titre ; 14,99 € pour 5 titres ; 19,99 € pour 6 titres ou plus. Le code ne tarifait pas les formats 2 à 4 titres dans l'audit statique ; ne pas inventer leur prix.
- Le site ne doit pas réintroduire de préécoutes de 30 secondes. Le téléchargement intégral reste post-paiement validé.
- Vérifier les 18 fiches : titre, UPC, pochette, nombre de pistes, description, tarif, disponibilité WAV et liens. Certaines associations pochette/UPC ont nécessité des preuves supplémentaires dans l'audit initial ; consulter les fichiers de preuve avant de corriger.

## 11. Administration / dashboard

- L'administration du site n'est pas considérée comme terminée.
- Documentation disponible : `docs/ADMIN-DASHBOARD-PLAN.md` et `docs/ADMIN-DASHBOARD-ACCESS-MATRIX.md`.
- Les anciennes fonctions `/messages` couvrent surtout la lecture privée des messages de contact ; elles ne constituent pas un back-office complet de clients, commandes, projets, prix, contrats et facturation.
- Vérifier les rôles et les permissions, la séparation public/privé, les secrets, l'accès aux commandes, l'inventaire audio, les demandes de licences et les messages.
- Deux fichiers SQL de fondation et de plan de tests RLS sont dans `docs/sql/` ; ils sont des documents de préparation/draft, pas la preuve qu'ils ont été appliqués en production. Ne pas exécuter aveuglément.
- Les schémas Drizzle contiennent les migrations contact/licensing/shop_orders ; les migrations D1 ajoutent les tables d'e-mails et les noms uniques des assets. `drizzle/schema.ts` était signalé comme généré/vide dans l'audit statique : à examiner.

## 12. Domaine, DNS, messagerie et HTTPS

- Domaine public : `nflt-records.com`.
- LWS a été mentionné comme registrar / gestion DNS / messagerie dans les échanges. Le domaine et les DNS ont connu plusieurs changements historiques ; ne pas supposer la configuration actuelle sans lecture.
- Objectifs : HTTPS valide, site accessible, DNS correctement routés vers la cible Cloudflare, messagerie qui envoie ET reçoit.
- Avant chaque changement DNS : exporter/copier les enregistrements existants (A, AAAA, CNAME, MX, TXT, SPF, DKIM, DMARC), TTL et état de proxy, puis préparer un rollback.
- Ne pas toucher aux MX/SPF/DKIM/DMARC en même temps qu'une migration site sans plan coordonné.
- Rapport technique : `docs/DNS-EMAIL-READINESS.md`.

## 13. Migration Lovable → Cloudflare et état de publication du site

- L'utilisateur veut quitter Lovable rapidement, sans perdre le site, les pages, les images, les contenus et les fonctions.
- Le dépôt contient encore `.lovable/`, instructions Lovable dans `AGENTS.md`, le module `src/lib/lovable-error-reporting.ts` référencé par `src/routes/__root.tsx`, ainsi que des intégrations Supabase. Une migration indépendante n'est donc pas certifiée.
- L'audit statique signale aussi que la prévisualisation Worker d'une PR documentaire précédente a échoué sur un commit antérieur et qu'aucun déploiement production n'a été déclenché par ce changement.
- Le code est préparé pour Cloudflare Worker/D1/R2, mais il faut vérifier les bindings `wrangler.jsonc`, les variables, secrets, migrations et routes en production.
- Le push/commit du rapport sur GitHub et l'upload du rapport dans R2 ne sont **pas** un déploiement du site. Le site public n'a pas été redéployé lors de la dernière opération documentaire.
- Ne pas supprimer le projet Lovable avant que la compilation, le déploiement de préproduction, les tests fonctionnels et le rollback soient validés.

## 14. SEO et pages publiques

- `src/lib/seo.ts` documente des groupes de pages FR/EN avec title, description, canonical, hreflang, Open Graph et Twitter metadata.
- `public/sitemap.xml` et `public/robots.txt` existent. Un contrôle statique antérieur avait relevé 60 URL attendues/uniques et 180 liens hreflang. Cela ne prouve pas l'indexation effective par Google/Bing ni le statut HTTP actuel.
- Les pages de conditions de vente et confidentialité sont indiquées comme brouillons/en préparation et `noindex,nofollow` dans l'audit statique.
- Les fiches catalogue utilisent des métadonnées structurées MusicRelease lorsque UPC/pochette existent.
- Radio décrite comme « en préparation » ; aucune URL de flux active n'était renseignée dans `src/lib/radio.ts`.
- L'utilisateur veut améliorer le référencement et la visibilité Internet des musiques NFLT, mais sans altérer Spotify/DistroKid.

## 15. Radio, application et diffusion

- Projet souhaité : **NFLT RECORDS NYC RADIO**, diffusion continue.
- L'utilisateur a évoqué AzuraCast et un abonnement Oracle comme pistes techniques.
- Une application GoodBarber avait été commencée ; l'utilisateur a indiqué une application Google Play publiée et s'est inquiété de la société GoodBarber. Le nom AppsWiz apparaissait côté développeur Google Play, et l'utilisateur a demandé de supprimer toute mention d'AppsWiz du site.
- Ne pas déclarer la radio opérationnelle : `docs/RADIO-READINESS.md` et le code radio doivent être consultés ; l'audit statique indique pas de flux URL prêt.
- La page Application existe dans le dépôt avec visuels Google Play FR/EN. Vérifier les liens de store réels et les métadonnées avant publication.

## 16. Paiements, canaux de vente et gestion commerciale

- Solutions évoquées : Payhip, TrackSynk, SoundHex, Ecwid, WooCommerce (pas WordPress), PayPal, Revolut Business. L'utilisateur préfère Revolut pour les versements ; Stripe est exclu.
- Payhip avait été retenu comme piste de boutique numérique, mais ses frais, moyens de paiement et conditions doivent être revérifiés avant activation. Documents : `docs/PAYHIP-READINESS.md`, `docs/LICENSING-PLATFORM-REVIEW.md`.
- TrackSynk et SoundHex ont été envisagés pour licences/opportunités professionnelles ; vérifier commissions, droits, territoires, exclusivité et conditions contractuelles avant d'envoyer le catalogue.
- La vente de CD physiques est liée à NFLT RECORDS FRANCE selon l'utilisateur ; traiter séparément logistique, TVA, retours, livraison et obligations consommateurs.
- Les tarifs donnés précédemment : 9,99 €, 14,99 €, 19,99 € selon le nombre de pistes décrit plus haut. Ne pas inventer les prix non définis.

## 17. Structure d'entreprise et éléments administratifs connus

- L'utilisateur a indiqué disposer d'un Kbis et des statuts/articles constitutifs pour l'entité française.
- NFLT RECORDS FRANCE est mentionnée comme SASU. NFLT RECORDS INC est la société mère ; NFLT RECORDS BRUSSELS est la succursale/implantation de Bruxelles.
- Des comptes Revolut Business ont été évoqués pour NFLT RECORDS INC et la France ; Revolut est le moyen de versement préféré. PayPal existe également.
- Les responsabilités juridiques, vendeur contractuel, fiscalité, TVA, licences musicales, droits et territoires doivent être validés avant vente. Les textes juridiques du dossier `.lovable/legal/` sont des drafts non approuvés et ne doivent pas être publiés comme définitifs.

## 18. Travail déjà accompli — résumé vérifiable

1. Dépôt GitHub existant `nfltrecords/NFLTWEBSITE` inspecté, branche `main` et arborescence principale inventoriées.
2. Documentation de migration, roadmap, readiness, audit statique, plan admin, preuves de catalogue et rapports audio présents dans `docs/`.
3. Inventaire des 18 WAV R2 et 18 associations D1 confirmé dans l'audit antérieur.
4. Signatures WAV et tailles vérifiées antérieurement ; aucun M4A converti.
5. Correction du MIME de `medley.wav (1)` effectuée, avec même taille et ETag.
6. Réconciliation 37 pistes / 18 sorties faite : 18 WAV dans R2, 19 pistes supplémentaires M4A-only, non converties.
7. Préécoutes de 30 secondes retirées du code actif et des archives de préparation selon les rapports.
8. Table D1 `shop_email_deliveries` présente ; code SMTP et file d'e-mails intégrés, mais secret SMTP manquant.
9. Worker `nfltwebsite`, bucket R2 et D1 vérifiés comme existants.
10. Rapport masters commité dans GitHub et copié dans R2, mais les copies actuellement lues sont obsolètes et doivent être corrigées.
11. Aucun changement DNS, Spotify ou DistroKid pendant les dernières opérations.
12. Aucun paiement réel, e-mail client ni déploiement de site ne doit être déclaré accompli sur la base de ces opérations.

## 19. Liste de tâches restantes — ordre recommandé

### P0 — sécuriser les rapports et l'état de vérité
- [ ] Corriger `docs/NFLT-HANDOFF-MASTERS-2026-11-26.md` sur GitHub : supprimer l'affirmation erronée « aucun autre fichier audio requis » et décrire précisément les 19 pistes M4A-only.
- [ ] Remplacer le rapport R2 `reports/NFLT-HANDOFF-MASTERS-2026-11-26.md` par la version corrigée.
- [ ] Sauvegarder ce dossier de transfert complet dans la Bibliothèque ChatGPT et le dépôt GitHub ; copier aussi dans R2 si souhaité.
- [ ] Refaire un listing des 18 WAV et les associations D1 ; vérifier les chiffres commandes/e-mails au moment de la reprise.

### P1 — finaliser les masters catalogue
- [ ] Retrouver les WAV originaux des cinq sorties sans WAV : Hot, Dilemma, #NEVERFAKELIKETHEM, 30.000 GÉNOCIDES (8 titres), GR 4LIFE.
- [ ] Retrouver les six WAV manquants de NOUS Y SOMMES.
- [ ] Confirmer le nombre de pistes et retrouver le master WAV de Hustle & Grind.
- [ ] Importer les masters originaux manquants via `/admin/audio` ou procédure multipart documentée, vérifier taille/signature, puis association D1.
- [ ] Ne jamais utiliser les 19 M4A comme substituts ni les convertir en WAV.
- [ ] Vérifier que chaque sortie proposée à l'achat a tous ses WAV et que les sorties incomplètes restent indisponibles.

### P2 — administration et sécurité
- [ ] Lire intégralement `docs/ADMIN-DASHBOARD-PLAN.md` et `docs/ADMIN-DASHBOARD-ACCESS-MATRIX.md`.
- [ ] Vérifier routes `/admin`, `/admin/audio`, `/admin/orders`, `/messages`, rôles et protections ; ne pas exposer les données privées.
- [ ] Vérifier `ADMIN_ORDERS_CODE` comme secret côté Cloudflare, jamais en clair dans le dépôt.
- [ ] Vérifier D1, migrations, schémas et tests RLS sans appliquer les drafts SQL à l'aveugle.

### P3 — e-mail
- [ ] Faire ajouter le secret `SMTP_PASSWORD` dans les secrets Cloudflare par le propriétaire ou via le canal sécurisé approprié ; ne pas le demander en clair dans le chat.
- [ ] Tester SMTP depuis `/admin/orders`.
- [ ] Vérifier réception externe, délivrabilité, SPF/DKIM/DMARC et renvoi idempotent.
- [ ] Confirmer que la livraison d'un WAV après paiement fonctionne en environnement de test.

### P4 — PayPal et commerce
- [ ] Exécuter tests PayPal Sandbox/IPN : commande simple, panier multi-UPC, montant/devise/destinataire incorrects, doublons, refus, remboursement, inversion, annulation d'inversion.
- [ ] Vérifier la correspondance entre commande, nombre de titres, fichiers R2 et accès téléchargements.
- [ ] Confirmer les frais/conditions PayPal/Payhip et le flux de versement Revolut.
- [ ] Garder `checkoutActivationApproved=false` et `PAYPAL_CHECKOUT_ENABLED` inactif jusqu'à la validation et l'accord explicite du propriétaire.

### P5 — juridique et commercial
- [ ] Valider l'entité vendeuse selon le territoire et le type de produit (digital / CD physique).
- [ ] Valider droits d'auteur, droits voisins, masters, licences, territoires, durée, commissions, TVA, facturation, rétractation, remboursements, CGV et confidentialité.
- [ ] Faire relire les drafts `.lovable/legal/` avant publication ; ne pas enlever `noindex` avant validation.
- [ ] Clarifier les conditions de vente de CD en France et les flux de versement.

### P6 — indépendance Lovable et déploiement Cloudflare
- [ ] Lire `AGENTS.md`, `README-CLOUDFLARE-FR.md`, `MIGRATION-AUDIT-2026-11-15.md`, `wrangler.jsonc`, les workflows et les intégrations Supabase.
- [ ] Identifier les dernières dépendances Lovable (`.lovable/`, error reporting, instructions de synchronisation) et Supabase ; migrer seulement après remplacement et tests.
- [ ] Exécuter CI complet sur `main`, corriger npm/build/typecheck/tests/lint.
- [ ] Vérifier bindings D1/R2/KV, secrets, routes Worker, assets statiques, compatibilité runtime et migrations.
- [ ] Créer une préproduction `workers.dev`/preview, tester pages FR/EN, catalogue, admin, API, mobile, SEO, HTTPS et e-mail.
- [ ] Préparer rollback, snapshot DNS et plan de bascule avant toute modification de production.
- [ ] Déployer seulement avec autorisation et preuve de bon fonctionnement ; un commit GitHub ne vaut pas déploiement.
- [ ] Ne supprimer Lovable qu'après migration autonome et validation complète.

### P7 — contenu, SEO, radio et application
- [ ] Vérifier les 18 pochettes et leurs associations UPC, prix visibles et fiches catalogue.
- [ ] Contrôler sitemap, canonical, hreflang, metadata et indexation réelle.
- [ ] Maintenir la page radio en préparation tant que le flux continu AzuraCast/Oracle n'est pas réellement disponible et testé.
- [ ] Vérifier l'application et les liens App Store/Google Play ; retirer toute mention publique d'AppsWiz comme demandé.
- [ ] Ne pas toucher aux biographies Spotify ni aux pages DistroKid.

## 20. Fichiers de référence à ouvrir en priorité dans GitHub

- `docs/ROADMAP-11-STATUS.md` — statut des 11 chantiers.
- `docs/AUDIO-RECONCILIATION-2026-11-25.md` — réconciliation audio détaillée.
- `docs/track-count-evidence-2026-11-24.md` — preuves du nombre de pistes par UPC.
- `docs/R2-MASTER-INVENTORY.md` — inventaire R2.
- `docs/NFLT-HANDOFF-MASTERS-2026-11-26.md` — rapport existant, à corriger car version obsolète.
- `docs/SITE-STATIC-AUDIT.md` — audit statique du site et limites.
- `docs/ADMIN-DASHBOARD-PLAN.md` et `docs/ADMIN-DASHBOARD-ACCESS-MATRIX.md` — administration.
- `docs/DNS-EMAIL-READINESS.md` — DNS et SMTP.
- `docs/PAYPAL-CHECKOUT-READINESS.md` et `docs/PAYHIP-READINESS.md` — commerce et paiements.
- `docs/ENTITY-GOVERNANCE.md` — séparation des entités.
- `docs/LICENSING-PLATFORM-REVIEW.md` — licences.
- `docs/RADIO-READINESS.md` — radio.
- `README-CLOUDFLARE-FR.md`, `MIGRATION-AUDIT-2026-11-15.md`, `AGENTS.md`, `wrangler.jsonc`, `package.json`, workflows GitHub Actions.

Liens directs :
- Dépôt : https://github.com/nfltrecords/NFLTWEBSITE
- Dossier docs : https://github.com/nfltrecords/NFLTWEBSITE/tree/main/docs
- Rapport audio : https://github.com/nfltrecords/NFLTWEBSITE/blob/main/docs/AUDIO-RECONCILIATION-2026-11-25.md
- Roadmap : https://github.com/nfltrecords/NFLTWEBSITE/blob/main/docs/ROADMAP-11-STATUS.md
- Audit site : https://github.com/nfltrecords/NFLTWEBSITE/blob/main/docs/SITE-STATIC-AUDIT.md
- Rapport masters (à corriger) : https://github.com/nfltrecords/NFLTWEBSITE/blob/main/docs/NFLT-HANDOFF-MASTERS-2026-11-26.md

---

## 21. Message de démarrage à copier dans le prochain chat

Tu reprends le dossier NFLT RECORDS à partir du rapport de transfert complet. Commence par lire ce rapport et les documents GitHub indiqués. Ne me redemande pas les informations déjà présentes. Ne recommence pas les audits déjà faits. Travaille directement sur le dépôt `nfltrecords/NFLTWEBSITE` branche `main`, le Worker Cloudflare `nfltwebsite`, le bucket R2 `nflt-audio-master` et la base D1 indiquée. Préserve les originaux. Les 18 WAV de `18 master/` sont vérifiés et associés ; 19 pistes supplémentaires du catalogue de 37 titres ne sont disponibles qu'en M4A dans les sources et ne doivent jamais être converties en faux masters WAV. Corrige d'abord les rapports masters obsolètes dans GitHub et R2. Le checkout doit rester fermé ; SMTP_PASSWORD manque ; ne touche ni DNS, ni Spotify, ni DistroKid sans demande explicite. Fais les tâches restantes dans l'ordre de priorité du rapport et vérifie chaque résultat avant de dire que c'est terminé.