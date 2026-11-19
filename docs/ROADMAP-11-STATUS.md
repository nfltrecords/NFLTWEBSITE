# NFLT RECORDS — suivi consolidé des 11 chantiers

État de préparation au 19 novembre 2026 (mise à jour après intégration du panier partagé et Preview Cloudflare). Ce tableau distingue les modifications du dépôt des opérations externes non réalisées. Il ne constitue pas une validation de production.

| N° | Chantier | État | Dépendance / prochaine étape |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | Préparation isolée | Les hooks de télémétrie du composant racine ont été retirés dans la branche. Le dossier de travail historique subsiste. Le build Cloudflare Workers Preview de la branche a réussi avec `npx wrangler preview`. La production reste inchangée. Aucun transfert de compte, migration de production ou déploiement n'a été effectué. |
| 2 | Audio / extraits | En attente | Aucun travail audio ou publication de masters dans cette étape. |
| 3 | Catalogue et pochettes | Partiellement vérifié | 18 sorties sont recensées. Certaines associations UPC/pochette et les preuves de dimensions originales doivent être confirmées avant remplacement définitif. |
| 4 | Prix par sortie | Provisoire | Barème de référence : 9,99 € pour 1 piste, 14,99 € pour 5 pistes, 19,99 € pour 6 pistes ou plus. Les décomptes UPC individuels ne sont pas tous confirmés ; aucun checkout. |
| 5 | Tableau de bord | Conception et sécurité préparées | SQL de fondation non appliqué ; matrice d'accès et plan de tests RLS documentés. Aucun écran connecté ni compte admin n'existe. Accès au projet Supabase et tests sur environnement de développement requis. |
| 6 | DNS | Non traité | Accès registrar absent. Ne pas modifier nameservers, MX, SPF, DKIM ou DMARC. |
| 7 | Messagerie et notifications | Non validé | Les fonctions de formulaire enregistrent des demandes ; aucun envoi d'e-mail n'est garanti. Vérifier les boîtes et tester la livraison avec accès au fournisseur. |
| 8 | Boutique | Panier partagé intégré, paiement non activé | Le panier est partagé entre les pages boutique et fiches catalogue, son compteur est visible dans les navigations desktop et mobile, et le navigateur conserve la sélection. Ajout, quantités, suppression et total indicatif sont disponibles. Le lien PayPal.Me a été retiré et le bouton de paiement est désactivé. Aucun checkout, paiement, stock/CD physique, livraison ou téléchargement sécurisé n'est configuré. Valider vendeur par transaction, frais, taxes, droits, fichiers et conditions avant ouverture. |
| 9 | Licences et royalties | Recherche documentaire | Aucun mandat ni dépôt de masters effectué. Vérifier contrats, droits master/composition, exclusivité, Content ID, territoires et paiements avant toute inscription. |
| 10 | Radio NFLT RECORDS NYC RADIO | Préparation seulement | Aucun flux, serveur AzuraCast ou service cloud n'est validé ici. Aucun serveur ou coût supplémentaire créé. |
| 11 | Structure et gestion des entités | Règles à confirmer par opération | Le propriétaire a précisé que NFLT RECORDS FRANCE concerne les achats de CD physiques en France. Ne pas lui attribuer par défaut les ventes numériques, licences ou autres territoires. Le vendeur et les droits doivent être définis pour chaque opération. |

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
