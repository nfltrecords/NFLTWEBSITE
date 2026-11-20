# NFLT RECORDS NYC RADIO — préparation sans déploiement

## État du dépôt

`src/lib/radio.ts` définit le nom de la station, mais le fournisseur, l'URL HTTPS du flux et l'URL des métadonnées sont tous à `null`. La radio est donc volontairement non configurée. Aucun flux ne doit être présenté comme opérationnel.

## Hébergement

Le propriétaire indique disposer déjà d'un compte Oracle Cloud. Cela ne prouve ni l'accès effectif à la tenancy, ni la disponibilité d'une VM, ni l'existence d'une instance radio. Aucun nouvel hébergement payant ne doit être créé.

## Séquence technique à valider avant lancement

1. Confirmer l'accès au compte Oracle Cloud existant et vérifier les ressources déjà provisionnées.
2. Vérifier les coûts, quotas, limites réseau et conditions de l'offre existante avant toute création ou modification de ressource.
3. Choisir le serveur de diffusion et le fournisseur uniquement après comparaison des coûts et contraintes.
4. Préparer l'installation sur une machine de test locale si possible ; ne pas lancer de déploiement cloud sans accord.
5. Configurer les secrets côté serveur uniquement ; aucun mot de passe ou jeton dans le code client.
6. Obtenir un flux HTTPS stable et une URL publique de métadonnées.
7. Tester lecture, disponibilité, reprise après interruption, affichage du titre/artiste et compatibilité mobile.
8. N'activer l'interface publique qu'après validation du flux et des droits de diffusion.

## Blocages

Aucun accès Oracle Cloud n'est connecté ici. Aucun fournisseur radio n'est retenu et aucune URL de flux n'a été fournie. Aucun serveur, service payant ou déploiement n'a été créé.
