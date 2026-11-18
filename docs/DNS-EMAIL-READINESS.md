# DNS LWS et messagerie NFLT RECORDS — état et contrôle

## Configuration connue à préserver

Les informations d'audit communiquées pour le domaine `nflt-records.com` indiquent les enregistrements suivants :

| Nom    | Type  | Cible / valeur connue   | Rôle                                             |
| ------ | ----- | ----------------------- | ------------------------------------------------ |
| `@`    | A     | `185.158.133.1`         | Ancienne destination web relevée lors de l'audit |
| `www`  | CNAME | `nflt-records.com`      | Alias web                                        |
| `@`    | MX    | `mail.nflt-records.com` | Réception e-mail                                 |
| `mail` | A     | `213.255.195.52`        | Serveur de messagerie LWS                        |

Ces valeurs sont un relevé antérieur, pas une interrogation DNS en direct à la date de ce document. Les valeurs MX et mail doivent être préservées tant que la messagerie LWS est utilisée.

## Consignes de migration

- Ne pas changer les nameservers du domaine.
- Ne pas modifier/supprimer le MX, l'A de `mail`, SPF, DKIM ou DMARC lors d'une migration du site web.
- La migration du site doit porter uniquement sur les enregistrements web nécessaires, après inventaire complet et validation du propriétaire.
- Ne pas activer de proxy sur les enregistrements de messagerie.
- Avant tout changement web, exporter la zone DNS complète et vérifier les TTL, les éventuels sous-domaines et les enregistrements de vérification.
- Après un changement autorisé, vérifier séparément HTTPS, résolution apex/www, réception et envoi d'e-mails, SPF, DKIM et DMARC.

## Comportement actuel des formulaires du dépôt

- `src/lib/contact.functions.ts` insère les messages de contact dans `contact_messages`. Le succès signifie que l'insertion Supabase a réussi ; aucun envoi d'e-mail n'est effectué par cette fonction.
- `src/lib/commerce.functions.ts` insère les demandes de disponibilité/licence dans `licensing_inquiries` avec `intended_recipient = nfltrecords@nflt-records.com`. Ce champ enregistre un destinataire prévu, mais ne transmet pas le message à cette boîte.
- Le destinataire de licence défini dans le code est `nfltrecords@nflt-records.com`. Aucun test de livraison de cette boîte n'a été réalisé depuis cette session.
- Les variables Supabase et le code d'administration sont configurés par variables serveur ; aucune valeur secrète ne doit être copiée dans le dépôt.

## Contrôles nécessaires dans LWS

1. Vérifier l'état du domaine, la zone DNS complète et le renouvellement.
2. Vérifier que la boîte `nfltrecords@nflt-records.com` existe, est active et dispose d'espace.
3. Vérifier les paramètres de réception et d'envoi SMTP/webmail, sans publier de mot de passe.
4. Relever les valeurs SPF, DKIM et DMARC actuellement publiées et leur état ; ne pas inventer ni remplacer leurs valeurs.
5. Effectuer un test entrant depuis une adresse externe et un test sortant vers une adresse externe.
6. Si des notifications automatiques sont souhaitées, choisir un fournisseur d'envoi, vérifier son identité de domaine et tester la livraison, les rebonds et les réponses avant d'activer quoi que ce soit.

## Blocage

Aucun accès au compte LWS ni à la boîte mail n'est connecté ici. Aucun DNS, nameserver, MX, SPF, DKIM, DMARC ou paramètre de messagerie n'a été modifié. Les formulaires actuels stockent les demandes mais n'envoient pas de notification e-mail.
