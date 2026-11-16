# NFLT RECORDS — suivi consolidé des 11 chantiers

État de travail au 16 novembre 2026. Ce tableau sépare les éléments vérifiés dans le dépôt, les informations déclarées par le propriétaire et les opérations qui exigent un accès ou une autorisation. Il ne vaut pas validation de production.

| N° | Chantier | État | Reste à faire / dépendance |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | En cours sur branche privée | Hooks de télémétrie Lovable retirés du composant racine et module supprimé sur `work/operations-readiness`; consignes de contribution neutralisées. Le dossier historique `.lovable/` est conservé car il contient des références de tests et des documents internes. Attendre tests/build, puis migrer ces références avant tout nettoyage final. |
| 2 | Audio / extraits | Suspendu à la demande du propriétaire | Aucun nouveau travail audio dans cette branche. |
| 3 | Catalogue et petits problèmes du site | Audit statique effectué | 18 sorties, 18 clés de pochettes et 18 fichiers de couverture recensés ; deux associations d'illustration restent à confirmer selon le rapport de preuves. Contrôler le rendu en prévisualisation après rétablissement du build. |
| 4 | Prix par sortie | Non finalisable à ce stade | Barème : 1 piste 9,99 €, 5 pistes 14,99 €, 6+ pistes 19,99 € ; 2–4 pistes non tarifées. Les nombres de pistes par UPC ne sont pas validés ; aucun prix individuel ni checkout. |
| 5 | Tableau de bord d'administration | Conception documentée, bloquée | Le schéma versionné ne déclare que `contact_messages` et `licensing_inquiries`. Il faut accès au projet Supabase, à ses tables réelles, utilisateurs et politiques RLS avant de créer migrations et dashboard sécurisé. |
| 6 | DNS LWS | Bloqué par l'accès au compte | Préserver les enregistrements mail connus ; aucun nameserver/MX/SPF/DKIM/DMARC modifié. Accès LWS et export complet de zone nécessaires. |
| 7 | Messagerie et notifications | Partiellement documenté, bloqué | Les fonctions actuelles stockent les demandes dans Supabase ; elles n'envoient pas de notification. Vérifier la boîte LWS et effectuer des tests entrants/sortants ; choisir/configurer un fournisseur d'envoi si nécessaire. |
| 8 | Boutique Payhip | Préparée, non activée | Payhip reste une option sans checkout connecté. Vérifier frais/conditions au compte, vendeur par transaction, droits, formats, prix, TVA, CGV et remboursements avant ouverture. PayPal préféré mais non connecté. |
| 9 | Licences et royalties | Comparatif documentaire effectué | Tracksynk, SoundHex, Soundscape et SoundExchange comparés dans `LICENSING-PLATFORM-REVIEW.md`. Obtenir les contrats complets et vérifier droits master/composition, exclusivité, Content ID, paiements et éligibilité avant dépôt. |
| 10 | Radio NFLT RECORDS NYC RADIO | Préparation seulement | Le propriétaire indique posséder une tenancy Oracle Cloud en région Paris ; aucun accès n'est connecté et aucune VM/AzuraCast/flux n'est vérifié. Contrôler ressources/coûts existants et obtenir accord explicite avant toute création. |
| 11 | Structure et gestion des entités | Règles documentées | INC / FRANCE / BRUSSELS séparées ; vendeur, droits, territoire et mandat doivent être définis par opération. L'autorisation INC → FRANCE ne vaut pas cession globale des droits. |

## Validation technique en cours

- Le contrôle statique du sitemap de `main` a trouvé 60 URL uniques correspondant exactement aux 12 groupes de pages FR/EN et aux 18 fiches UPC, avec 180 liens hreflang ; `robots.txt` déclare le sitemap.
- Le workflow GitHub `Verify source` associé à la dernière version de cette branche a démarré, mais l'étape d'installation des dépendances était encore en cours lors de la dernière consultation. Aucun résultat de tests/lint/build n'est disponible pour cette révision.
- Le commentaire Cloudflare de prévisualisation sur la PR documentaire précédente signalait un build échoué. Aucun déploiement de production n'a été lancé.
- La PR n°2 est une proposition de changement non fusionnée. Ne pas la fusionner avant réussite des contrôles requis et revue des changements de code.

## Accès requis pour terminer les opérations externes

Les comptes Supabase, LWS, Oracle Cloud, Payhip/PayPal et plateformes de licences ne sont pas connectés à cette session. Ne pas prétendre avoir vérifié leurs tableaux de bord ou leurs conditions de compte. Aucun mot de passe ou clé secrète ne doit être partagé dans le dépôt ou dans un message.
