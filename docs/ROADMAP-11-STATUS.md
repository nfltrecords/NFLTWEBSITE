# NFLT RECORDS — suivi consolidé des 11 chantiers

État de préparation au 19 novembre 2026. Ce tableau distingue les modifications du dépôt des opérations externes non réalisées. Il ne constitue pas une validation de production.

| N° | Chantier | État | Dépendance / prochaine étape |
|---:|---|---|---|
| 1 | Sortie de Lovable / portage du site | Préparation isolée | Les hooks de télémétrie du composant racine ont été retirés dans la branche. Le dossier de travail historique subsiste. Le build Cloudflare de la branche a réussi avec une commande de déploiement neutralisée. Aucun transfert de compte, migration de production ou déploiement n'a été effectué. |
| 2 | Audio / extraits | En attente | Aucun travail audio ou publication de masters dans cette étape. |
| 3 | Catalogue et pochettes | Partiellement vérifié | 18 sorties sont recensées. Certaines associations UPC/pochette et les preuves de dimensions originales doivent être confirmées avant remplacement définitif. |
| 4 | Prix par sortie | Provisoire | Barème de référence : 9,99 € pour 1 piste, 14,99 € pour 5 pistes, 19,99 € pour 6 pistes ou plus. Les décomptes UPC individuels ne sont pas tous confirmés ; aucun checkout. |
| 5 | Tableau de bord | Conception uniquement | Un SQL de fondation est un brouillon non appliqué. Aucun écran d'administration général n'est construit. L'accès Supabase et l'audit des politiques réelles sont requis. |
| 6 | DNS | Non traité | Accès registrar absent. Ne pas modifier nameservers, MX, SPF, DKIM ou DMARC. |
| 7 | Messagerie et notifications | Non validé | Les fonctions de formulaire enregistrent des demandes ; aucun envoi d'e-mail n'est garanti. Vérifier les boîtes et tester la livraison avec accès au fournisseur. |
| 8 | Boutique | Préparée, non activée | Payhip reste une piste de mise en œuvre. Aucun compte connecté ni checkout actif. Vérifier le vendeur par transaction, frais, taxes, droits, prix et conditions avant ouverture. |
| 9 | Licences et royalties | Recherche documentaire | Aucun mandat ni dépôt de masters effectué. Vérifier contrats, droits master/composition, exclusivité, Content ID, territoires et paiements avant toute inscription. |
| 10 | Radio NFLT RECORDS NYC RADIO | Préparation seulement | Aucun flux, serveur AzuraCast ou service cloud n'est validé ici. Aucun serveur ou coût supplémentaire créé. |
| 11 | Structure et gestion des entités | Règles à confirmer par opération | Le propriétaire a précisé que NFLT RECORDS FRANCE concerne les achats de CD physiques en France. Ne pas lui attribuer par défaut les ventes numériques, licences ou autres territoires. Le vendeur et les droits doivent être définis pour chaque opération. |

## Contrôles techniques de la branche

- Le dernier commit de préparation a passé les workflows GitHub Actions NFLT safe verification et Verify source : tests, build sans déploiement et lint ont terminé avec succès.
- Un build Cloudflare de la branche a précédemment réussi ; la commande de déploiement propre à cette branche est neutralisée afin d'éviter une publication accidentelle.
- Ces contrôles valident la compilation et les tests du code de la branche, pas les intégrations externes, le contenu réel de Supabase, le DNS, la messagerie, les paiements, le référencement indexé ou le fonctionnement en production.
- La PR de préparation reste non fusionnée. Aucun déploiement de production n'a été lancé.

## Dépendances externes

Les comptes Supabase, registrar/messagerie, PayPal/Payhip, Oracle Cloud et plateformes de licences ne sont pas vérifiés par le seul contenu du dépôt. Ne pas prétendre avoir inspecté leurs tableaux de bord ou leurs contrats de compte. Aucun secret ne doit être partagé dans Git.
