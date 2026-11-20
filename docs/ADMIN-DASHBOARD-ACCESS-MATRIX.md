# NFLT RECORDS — matrice d'accès du futur tableau de bord

**Statut : proposition de conception — aucun compte ni rôle n'est provisionné par ce document.**

## Principes non négociables

- Aucun accès anonyme.
- Authentification nominative via Supabase Auth (à confirmer sur le projet réel).
- Refus par défaut dans PostgreSQL ; les contrôles d'interface ne remplacent jamais RLS.
- Les rôles sont attribués et révoqués exclusivement par un processus serveur de confiance avec `service_role`. Aucune fonction client ne doit écrire dans `nflt_user_roles`.
- Les secrets `service_role`, PayPal et autres clés privées ne sont jamais envoyés au navigateur.
- Les trois entités ne sont pas interchangeables. Chaque contrat, commande, licence et dépense doit porter une entité responsable explicitement validée.

## Matrice fonctionnelle proposée

| Module | owner | admin | operations | sales | read_only |
|---|---:|---:|---:|---:|---:|
| Vue d'ensemble agrégée | gérer | gérer | lire | lire | lire |
| Contacts / prospects | gérer | gérer | lire / mettre à jour | gérer | aucun |
| Clients / organisations | gérer | gérer | lire / mettre à jour | gérer | aucun |
| Projets / prestations | gérer | gérer | gérer | lire | aucun |
| Catalogue / métadonnées | gérer | gérer | lire / mettre à jour | lire | lire |
| Masters / fichiers audio | gérer | gérer | selon autorisation | aucun | aucun |
| Droits / contrats / mandats | gérer | gérer | aucun par défaut | aucun | aucun |
| Demandes de licences | gérer | gérer | lire / traiter | gérer | aucun |
| Licences accordées / redevances | gérer | gérer | aucun par défaut | lire | aucun |
| Commandes / remboursements | gérer | gérer | traiter selon délégation | lire | aucun |
| Documents sensibles | gérer | gérer | selon dossier | selon dossier | aucun |
| Utilisateurs / rôles | gérer | gérer | aucun | aucun | aucun |
| Journal d'audit | lire | lire | aucun | aucun | aucun |

**Attention :** cette matrice est un objectif métier, pas le comportement du SQL actuel. Le brouillon SQL autorise uniquement `owner` et `admin` sur les tables de fondation. Les rôles `operations`, `sales` et `read_only` n'ont pas encore de politiques dédiées ; ils ne doivent donc pas être attribués en production.

## Périmètre de la première version sûre

1. Page de connexion Supabase Auth, seulement après validation du projet et du fournisseur d'identité.
2. Vue d'ensemble sans données personnelles : compteurs calculés sur des données réellement disponibles.
3. Lecture des messages et demandes de licences avec contrôles serveur et RLS.
4. Aucune création de commande, paiement, remboursement, contrat ou changement de droits dans cette première étape.
5. Journaliser les consultations sensibles et les modifications ultérieures, sans copier les données personnelles dans les journaux.

## Conditions avant développement connecté

- Identifier le projet Supabase exact et les environnements dev / production.
- Exporter le schéma réel et les politiques RLS existantes.
- Vérifier les méthodes Auth, les comptes autorisés, les redirections et la récupération de compte.
- Définir le propriétaire initial et le processus de récupération d'accès.
- Exécuter les tests RLS avec comptes distincts pour chaque rôle.
- Valider le modèle de données et les durées de conservation avant d'importer des données réelles.

## État réel

- La route `/messages` existante est un lecteur de messages protégé par un code serveur ; ce n'est pas un dashboard et ce code ne doit pas être réutilisé comme authentification.
- Le SQL de fondation reste un brouillon non appliqué.
- Aucun accès Supabase production, compte utilisateur, rôle ou donnée client n'a été créé.
