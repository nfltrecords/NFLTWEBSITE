# NFLT RECORDS — suivi consolidé des 11 chantiers

État de préparation au 19 novembre 2026 (mise à jour après intégration du panier partagé et Preview Cloudflare). Ce tableau distingue les modifications du dépôt des opérations externes non réalisées. Il ne constitue pas une validation de production.

| N° | Chantier | État | Dépendance / prochaine étape |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | Préparation isolée | Les hooks de télémétrie du composant racine ont été retirés dans la branche. Le dossier de travail historique subsiste. Le build Cloudflare Workers Preview de la branche a réussi avec `npx wrangler preview`. La production reste inchangée. Aucun transfert de compte, migration de production ou déploiement n'a été effectué. |
| 2 | Audio / extraits | Audit technique ajouté | 37 fichiers MP3 de préécoute sont présents. L'inventaire du dépôt confirme un doublon binaire exact et six associations UPC explicites ; 31 fichiers restent sans association validée. Les chemins publics et la lecture réelle sur le site restent à tester. |
| 3 | Catalogue et pochettes | Partiellement vérifié | 18 sorties sont recensées. Certaines associations UPC/pochette et les preuves de dimensions originales doivent être confirmées avant remplacement définitif. |
| 4 | Prix par sortie | Provisoire | Barème de référence : 9,99 € pour 1 piste, 14,99 € pour 5 pistes, 19,99 € pour 6 pistes ou plus. Les décomptes UPC individuels ne sont pas tous confirmés ; aucun checkout. |
| 5 | Tableau de bord | Conception et sécurité préparées | SQL de fondation non appliqué ; matrice d'accès et plan de tests RLS documentés. Aucun écran connecté ni compte admin n'existe. Accès au projet Supabase et tests sur environnement de développement requis. |
| 6 | DNS | Non traité | Accès registrar absent. Ne pas modifier nameservers, MX, SPF, DKIM ou DMARC. |
| 7 | Messagerie et notifications | Non validé | Les fonctions de formulaire enregistrent des demandes ; aucun envoi d'e-mail n'est garanti. Vérifier les boîtes et tester la livraison avec accès au fournisseur. |
| 8 | Boutique | Panier partagé intégré, paiement non activé | Le panier est partagé entre les pages boutique et fiches catalogue, son compteur est visible dans les navigations desktop et mobile, et le navigateur conserve la sélection. Ajout, quantités, suppression et total indicatif sont disponibles. Le lien PayPal.Me a été retiré et le bouton de paiement est désactivé. Aucun checkout, paiement, stock/CD physique, livraison ou téléchargement sécurisé n'est configuré. Valider vendeur par transaction, frais, taxes, droits, fichiers et conditions avant ouverture. |
| 9 | Licences et royalties | Recherche documentaire | Aucun mandat ni dépôt de masters effectué. Vérifier contrats, droits master/composition, exclusivité, Content ID, territoires et paiements avant toute inscription. |
| 10 | Radio NFLT RECORDS NYC RADIO | Préparation seulement | Aucun flux, serveur AzuraCast ou service cloud n'est validé ici. Aucun serveur ou coût supplémentaire créé. |
| 11 | Structure et gestion des entités | Règles à confirmer par opération | Le propriétaire a précisé que NFLT RECORDS FRANCE concerne les achats de CD physiques en France. Ne pas lui attribuer par défaut les ventes numériques, licences ou autres territoires. Le vendeur et les droits doivent être définis pour chaque opération. |

## Audio — contrôle des préécoutes du 20 novembre 2026

- Le dépôt contient 37 fichiers MP3 dans `public/assets/previews` et 18 pochettes JPG correspondant aux 18 UPC du catalogue.
- Le script `scripts/audit-assets.mjs` vérifie désormais les doublons binaires exacts des MP3 (SHA-256) et la plage de tailles des fichiers, en plus du contrôle de présence des pochettes.
- Inventaire des 37 fichiers : 18 font 481 114 octets et 19 font 481 348 octets.
- Un doublon binaire exact est confirmé par identité du blob Git : `CA_TUE_PAS_DU_TOUT_PREVIEW_30S.mp3` et `JAIPASBONQUELESGENSDUPAYSOULESGENSDUCOINSORGANISENTENTREEUXJEDETESTECAJAIHO3_PREVIEW_30S.mp3`. Ne pas supprimer automatiquement l'un des deux : confirmer d'abord le contenu attendu et l'usage éditorial.
- `src/lib/previews.ts` ne référence que six fichiers avec association UPC explicitement confirmée. Les 31 autres fichiers restent volontairement non associés ; l'interface affiche un message de vérification pour ces sorties.
- Les six chemins associés existent bien dans `public/assets/previews`. La vérification HTTP des fichiers sur le domaine public n'a pas pu être menée à terme depuis cette session ; la lecture réelle sur mobile et ordinateur n'est donc pas certifiée.
- Les tailles et empreintes de dépôt ne prouvent ni la durée exacte, ni le contenu audio, ni la qualité sonore, ni l'association titre/fichier. Aucune association automatique, suppression de doublon ou publication de master n'est faite.

## Boutique — évolution du 20 novembre 2026

- Dans la liste complète du catalogue, chaque sortie affiche désormais une action « Ajouter au panier » indépendante du lien vers sa fiche. Le compteur de quantité se met à jour et le bouton est désactivé au plafond de 20 articles ou lorsqu'aucun prix indicatif n'est disponible.
- La mise en page de cette action a été adaptée au mobile.

## Boutique — évolution du 19 novembre 2026

- Le panier est partagé côté navigateur entre la boutique et les fiches individuelles du catalogue ; le compteur est affiché dans les menus desktop et mobile.
- Les fiches catalogue et les cartes boutique permettent d’ajouter une sortie. La page panier permet d’augmenter/réduire les quantités, de vider le panier et de consulter le total indicatif. La sélection est conservée dans le stockage local du navigateur.
- Le lien PayPal.Me a été retiré du parcours panier ; le bouton de paiement est désactivé. Le site n'accepte aucune commande ni aucun paiement à ce stade.
- Les prix et le nombre de pistes restent indicatifs tant que les tracklists UPC et les éléments commerciaux ne sont pas confirmés.
- Payhip avec PayPal reste une piste pour les ventes numériques, sans compte connecté ni activation. Les CD physiques doivent avoir un parcours vendeur/livraison distinct.

## Contrôles techniques de la branche

- Le commit `a9784a8` a passé les workflows GitHub Actions NFLT safe verification et Verify source : tests, build sans déploiement et lint ont terminé avec succès. Le commit `3701ac8` intégrant le panier partagé a ensuite passé le build Cloudflare Workers Preview (`npm run build` puis `npx wrangler preview`), `build_outcome: success` le 19 novembre 2026.
- La Preview Cloudflare utilise `npm run build` puis `npx wrangler preview`. La production est préservée ; aucun déploiement dans `main` n'a été effectué.
- Ces contrôles valident la compilation et les tests du code de la branche, pas les intégrations externes, le contenu réel de Supabase, le DNS, la messagerie, les paiements, le référencement indexé ou le fonctionnement en production.
- La PR de préparation reste non fusionnée. Aucun déploiement de production n'a été lancé.

## Tableau de bord — évolution du 20 novembre 2026

- Matrice d'accès proposée : `docs/ADMIN-DASHBOARD-ACCESS-MATRIX.md`.
- Plan de tests RLS manuel réservé à un projet Supabase de développement : `docs/sql/admin-dashboard-rls-test-plan.sql`.
- Le SQL actuel ne donne des droits qu'aux rôles `owner` et `admin`. Les rôles `operations`, `sales` et `read_only` sont déclarés mais sans politiques spécifiques ; ils ne doivent pas être attribués tant que les politiques et tests correspondants ne sont pas implémentés.
- Aucun compte, aucune donnée, aucun rôle et aucune migration Supabase n'ont été créés. Pas de dashboard connecté ou de fausse connexion simulée.

## Dépendances externes

Les comptes Supabase, registrar/messagerie, PayPal/Payhip, Oracle Cloud et plateformes de licences ne sont pas vérifiés par le seul contenu du dépôt. Ne pas prétendre avoir inspecté leurs tableaux de bord ou leurs contrats de compte. Aucun secret ne doit être partagé dans Git.

## Rapprochement préliminaire MP3 ↔ 18 UPC — 20 novembre 2026

### Associations déjà intégrées et explicitement confirmées

| UPC | Sortie du catalogue | Fichier MP3 |
|---|---|---|
| 199751168234 | 836.722 (1995) [18] [73] | MASTERPIECE_PREVIEW_30S.mp3 |
| 199955701558 | Dilemma (Radio Edit) | Dilemma_PREVIEW_30S.mp3 |
| 821440674572 | GR 4LIFE | GR4LIFE_PREVIEW_30S.mp3 |
| 199751508283 | Hot | NFLTHOT_PREVIEW_30S.mp3 |
| 199955715203 | Hustle & Grind (Radio Edit) | Hustlegrind_PREVIEW_30S.mp3 |
| 199751512501 | In My Party | NFLTINMYPARTYBEATNFLTRECORDS_PREVIEW_30S.mp3 |

### Candidats repérés par ressemblance de nom uniquement — ne pas intégrer sans preuve DistroKid/Spotify ou confirmation du propriétaire

| UPC candidat | Sortie | Fichier candidat | Statut |
|---|---|---|---|
| 199955742094 | 30.000 GÉNOCIDES | 30.000Genocides_PREVIEW_30S.mp3 | Nom très proche, association non confirmée |
| 199955715135 | #NEVERFAKELIKETHEM (Chapter One) | NEVERFAKELIKETHEM_PREVIEW_30S.mp3 | Nom très proche, association non confirmée |
| 199956222809 | NOUS Y SOMMES (TU M'AURAS JAMAIS) | Nousysommes_PREVIEW_30S.mp3 | Nom très proche, association non confirmée |
| 199751511160 | The Dopest Collection (Vol. 1) | NFLTTHEDOPIESTCOLLECTIONBEATNFLTRECORDS_PREVIEW_30S.mp3 | Nom proche, association non confirmée |
| 199751514697 | The Dopest Collection, Vol. 2 | DCVOL2_PREVIEW_30S.mp3 | Nom proche, association non confirmée |
| 199955740199 | The Luxury - The Highest - Unequivocal | NFLTTHELUXURYTHEHIGHESTUNEQUIVOCAL_PREVIEW_30S.mp3 | Nom proche, association non confirmée |
| 199751170992 | Transcendence Of Natural Truths | NFLTTRANSCENDANCEOFNATURALTRUTHSBEATNFLTRECORDS_PREVIEW_30S.mp3 | Nom proche, association non confirmée |

Ces sept rapprochements sont des pistes de travail issues des noms de fichiers et des titres du catalogue, pas des validations. Ils ne sont pas ajoutés à `src/lib/previews.ts`. Les 24 autres fichiers (37 au total moins 6 associations confirmées et 7 candidats) restent sans attribution fiable à ce stade. Les 18 UPC restent la liste canonique du catalogue ; aucun UPC supplémentaire n'est créé.
