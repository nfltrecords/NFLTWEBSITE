# NFLT RECORDS — préparation du tableau de bord

État établi à partir du schéma Supabase et du code versionnés dans le dépôt (16 novembre 2026).

## Ce qui existe réellement

Le schéma TypeScript Supabase actuellement versionné ne déclare que deux tables applicatives :

- `contact_messages` : nom, e-mail, message, date de réception.
- `licensing_inquiries` : coordonnées, organisation, type de demande, sortie UPC éventuelle, usage, territoire, durée, message, langue et date.

La route privée `/messages` ne fait que consulter les messages du formulaire après saisie d'un code serveur. Elle n'est pas un tableau de bord général. Aucun modèle de commandes, clients, projets, contrats, factures, licences accordées ou catalogue de masters n'est actuellement défini dans ce schéma.

## Périmètre cible

Le futur espace d'administration doit séparer les modules suivants :

1. **Vue d'ensemble** : indicateurs calculés à partir des données réellement enregistrées, alertes et tâches en attente.
2. **Contacts et prospects** : coordonnées, origine, entité concernée, statut, historique et consentement lorsque requis.
3. **Clients** : fiche organisation/personne, contacts associés et historique des relations.
4. **Projets et prestations** : type de prestation, brief, échéances, responsable, devis et état d'avancement.
5. **Catalogue et droits** : UPC, pistes vérifiées, fichiers maîtres, ayants droit, territoires, périodes et restrictions par sortie.
6. **Licences** : demandes entrantes, négociation, autorisations signées, usages, territoires, durée, redevances et renouvellements.
7. **Ventes et commandes** : vendeur légal, canal, produit, prix, TVA, paiement, livraison et remboursement.
8. **Documents** : devis, contrats, factures et justificatifs avec accès contrôlé.
9. **Administration** : utilisateurs, rôles, journal d'audit et paramètres.

## Modèle d'entités à concevoir avant toute migration

- `organizations` et `people` : distinguer personnes physiques et organisations.
- `leads` et `clients` : cycle de relation et historique.
- `projects` et `services` : prestations et livrables.
- `releases`, `tracks`, `masters`, `rights_holders`, `rights_grants` : catalogue et preuve des droits.
- `licensing_requests`, `license_agreements`, `license_uses` : demandes et licences effectivement accordées.
- `quotes`, `orders`, `order_items`, `payments`, `refunds`, `invoices` : commerce.
- `documents`, `audit_events`, `user_roles` : documents, traçabilité et accès.

Ce sont des propositions de conception, pas des tables existantes. Un premier SQL de fondation est maintenant préparé dans `docs/sql/admin-dashboard-foundation.draft.sql` : organisations, personnes, relations prospects/clients, projets, prestations, rôles et journal d'audit. Il inclut une politique RLS fermée par défaut et une vérification de rôle basée sur `auth.users.app_metadata.nflt_role`. **C'est un brouillon non appliqué**, pas une migration active.

## Règles de sécurité et de gouvernance

- Authentification nominative et rôles explicites ; le code partagé actuel de `/messages` ne doit pas devenir le mécanisme d'authentification du dashboard.
- Politiques RLS Supabase pour chaque table et chaque rôle ; refus par défaut.
- Les clés privilégiées restent exclusivement côté serveur.
- Journaliser les changements sensibles : droits, vendeur, prix, contrats, paiements et accès.
- Séparer les trois entités déclarées dans les données : NFLT RECORDS INC., NFLT RECORDS FRANCE et NFLT RECORDS BRUSSELS.
- Ne jamais déduire qu'une entité détient tous les droits ou est vendeur pour toutes les opérations. La société, le territoire et le mandat doivent être renseignés au niveau de chaque opération.
- Ne pas stocker de données de carte bancaire ; conserver seulement les identifiants et statuts fournis par le prestataire de paiement.

## Ordre de réalisation recommandé

1. Inventorier les tables réellement présentes dans le projet Supabase et leurs politiques RLS (accès au compte Supabase nécessaire).
2. Définir les rôles et la matrice d'accès.
3. Valider le modèle métier et les relations avec les documents existants.
4. Créer les migrations SQL et tests RLS sur un environnement de développement.
5. Construire les écrans de lecture, puis les formulaires de création/modification.
6. Tester les permissions avec plusieurs rôles avant toute mise en production.

## Avancement du point 5 — 17 novembre 2026

- Le modèle de départ et le SQL RLS sont rédigés dans le dépôt.
- Les entités de projet sont obligatoires et peuvent rester `to_be_confirmed` : aucun vendeur ou titulaire de droits n'est attribué automatiquement.
- Aucun écran d'administration n'est connecté à ces tables, aucune donnée client n'a été créée et aucune migration n'a été appliquée.
- La prochaine étape technique est de vérifier le vrai projet Supabase, de confirmer Auth et les politiques existantes, puis de tester le SQL sur un projet de développement. Après validation, construire les écrans de lecture et d'édition avec rôles.

## Dépendances non accessibles depuis le dépôt

L'accès au projet Supabase, aux utilisateurs, aux politiques RLS et aux données de production n'est pas établi dans cette session. Il est donc impossible de certifier le schéma réel en production ou de créer un dashboard sûr en se basant uniquement sur le dépôt. Aucun changement de base de données ni accès utilisateur n'a été effectué.
