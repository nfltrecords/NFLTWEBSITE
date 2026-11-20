# DNS et messagerie NFLT RECORDS — état et contrôle

## Règle de sécurité

Les valeurs DNS historiques, adresses IP, noms de boîtes et paramètres de messagerie ne sont pas reproduits dans ce dépôt public. Le relevé antérieur n'est pas une interrogation DNS en direct et ne doit pas être utilisé comme configuration actuelle.

- Ne pas changer les nameservers.
- Ne pas modifier/supprimer les enregistrements MX, SPF, DKIM ou DMARC lors d'une migration web.
- Avant tout changement web autorisé, exporter la zone DNS complète depuis le registrar et vérifier les TTL, sous-domaines et enregistrements de validation.
- Ne pas activer de proxy sur les enregistrements de messagerie.
- Tester séparément HTTPS, résolution web, réception/envoi et authentification e-mail après tout changement approuvé.

## Comportement actuel des formulaires

- Les fonctions de contact enregistrent les messages dans Supabase ; une insertion réussie ne signifie pas qu'un e-mail a été envoyé.
- Les demandes de disponibilité/licence sont enregistrées dans Supabase ; aucun transfert vers une boîte externe n'est effectué par cette fonction.
- Les paramètres de destinataire et de messagerie doivent rester côté serveur et ne doivent pas être copiés dans le dépôt public.
- Aucune livraison e-mail n'a été testée dans cette session.

## Contrôles requis dans le compte du fournisseur

1. Vérifier le domaine, la zone DNS complète et le renouvellement.
2. Vérifier l'existence et l'état des boîtes nécessaires.
3. Vérifier réception et envoi sans publier de mot de passe.
4. Relever les valeurs SPF, DKIM et DMARC depuis le fournisseur ; ne pas inventer ni remplacer leurs valeurs.
5. Effectuer des tests entrants et sortants.
6. Si des notifications automatiques sont souhaitées, choisir un fournisseur d'envoi et tester la livraison, les rebonds et les réponses avant activation.

## Blocage

Aucun accès au compte registrar ni à la messagerie n'est connecté ici. Aucun DNS, nameserver, MX, SPF, DKIM, DMARC ou paramètre de messagerie n'a été modifié. Les formulaires actuels enregistrent les demandes mais n'envoient pas de notification e-mail.
