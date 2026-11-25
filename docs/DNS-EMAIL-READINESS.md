# DNS et messagerie NFLT RECORDS — état vérifié

## Règles de sécurité

- Ne pas changer les nameservers.
- Ne pas modifier/supprimer les enregistrements MX, SPF, DKIM ou DMARC lors d'une migration web.
- Ne pas activer le proxy sur les enregistrements de messagerie.
- Ne jamais publier de mot de passe, jeton ou valeur secrète dans GitHub ou dans les journaux.
- Tester séparément HTTPS, réception, envoi et authentification e-mail.

## État DNS contrôlé le 26 novembre 2026

La zone Cloudflare `nflt-records.com` est active. Le contrôle en lecture seule du 26 novembre retrouve le MX, SPF, DKIM, DMARC et les hôtes mail/SMTP. Les enregistrements mail sont toujours DNS-only. Les domaines personnalisés `nflt-records.com` et `www.nflt-records.com` sont activés sur le Worker `nfltwebsite` ; leurs enregistrements AAAA sont gérés par Cloudflare. Aucun enregistrement DNS n'a été modifié pendant cette reprise.

La présence de ces enregistrements ne prouve pas à elle seule que l'envoi SMTP fonctionne ni que la boîte expéditrice est opérationnelle.

## Envoi transactionnel de la boutique

Le dépôt contient désormais :
- un client SMTP sécurisé pour le serveur mail du domaine, port SSL/TLS 465 ;
- une table D1 `shop_email_deliveries` pour suivre les tentatives et éviter les doublons ;
- un envoi déclenché après IPN PayPal vérifié ;
- une page administrateur pour consulter les commandes, tester la messagerie et relancer un envoi ;
- un lien de téléchargement sécurisé vers les masters WAV complets, jamais vers les extraits.

**Dépendance actuelle constatée dans le Worker de production (version 218) :** les paramètres SMTP non secrets sont présents, mais le secret `SMTP_PASSWORD` n'est pas configuré. Le code ne peut donc pas s'authentifier auprès du serveur SMTP et aucun e-mail client n'est actuellement prouvé comme envoyé.

Ne pas inscrire le mot de passe dans le dépôt ni le transmettre dans une conversation. Il doit être ajouté comme secret Worker `SMTP_PASSWORD` depuis le tableau de bord Cloudflare, puis un test réel doit être effectué depuis `/admin/orders` avec le code administrateur. Le résultat doit être vérifié dans la boîte destinataire et dans les indésirables.

## Contrôles requis après configuration

1. Ajouter le secret SMTP dans Cloudflare, sans modifier les DNS existants.
2. Lancer l'e-mail de test depuis l'administration et vérifier sa réception.
3. Effectuer un test d'envoi vers une boîte externe contrôlée.
4. Vérifier le statut `sent`, l'horodatage et l'absence de doublon dans D1.
5. Vérifier qu'une commande payée avec tous ses WAV déclenche l'e-mail et que le lien ouvre bien les masters.
6. Tester une panne SMTP et la relance depuis l'administration.

Aucun paiement réel ne doit être effectué sans autorisation explicite. Le checkout PayPal reste fermé.
