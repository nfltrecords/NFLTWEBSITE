# Intégration PayPal — état de préparation

Statut : une intégration serveur préparatoire existe dans la branche ; le checkout reste désactivé et aucun paiement ne peut être considéré comme opérationnel.

## Conditions préalables à toute activation

1. Définir le vendeur légal pour chaque produit et transaction, ainsi que les droits et territoires autorisés.
2. Vérifier les correspondances UPC, nombres de pistes et prix sur preuves catalogue primaires.
3. Confirmer la disponibilité des masters livrables et les conditions de téléchargement.
4. Finaliser le stockage des commandes, les contrôles de prix côté serveur et l'idempotence des opérations.
5. Vérifier les signatures des notifications du prestataire et ne livrer qu'après confirmation fiable d'un paiement capturé.
6. Tester en environnement sandbox les commandes, approbations, captures, doublons, refus, remboursements, inversions et échecs.
7. Faire auditer les migrations et politiques d'accès de la base de données sur un environnement de développement avant toute migration réelle.
8. Vérifier les obligations consommateurs, TVA, facturation, remboursements et protection des données.
9. Obtenir une autorisation explicite avant d'enregistrer un webhook, d'activer le checkout ou de passer en production.

## Configuration

Les identifiants PayPal et clés de service doivent être configurés exclusivement dans les secrets du fournisseur d'hébergement. Ne jamais les placer dans le code navigateur, Git, un document public ou une conversation.

## État de l'implémentation

Des fonctions serveur et un endpoint de notification ont été préparés dans le dépôt. Ils n'ont pas été validés par une campagne complète de tests PayPal Sandbox. Le registre de commandes et la logique d'idempotence dépendent d'une migration SQL qui n'a pas été appliquée à la base de données réelle.

Le verrou de paiement reste fermé. Aucun bouton d'achat fonctionnel, commande, capture, livraison numérique ou remboursement n'est disponible. Ne pas considérer le code préparatoire comme une solution de paiement prête à vendre.

## Décision

Aucun secret n'a été copié dans le dépôt. Aucun webhook n'a été enregistré auprès de PayPal. Aucun checkout ou paiement n'a été activé.
