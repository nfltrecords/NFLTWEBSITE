# Instructions de contribution — NFLT RECORDS

## Source et sécurité des changements

- Le dépôt Git est la source de référence du code versionné. Ne pas supposer qu'un éditeur externe synchronise les branches ou les commits.
- Ne jamais réécrire l'historique publié : pas de force-push, rebase, amend ou squash de commits déjà poussés.
- Travailler sur une branche dédiée ; ne fusionner dans `main` qu'après revue et validation des tests.
- Ne jamais déployer, modifier le DNS, activer les paiements, changer les services externes ou engager des frais sans autorisation explicite du propriétaire.
- Ne jamais committer de secrets, de clés privées, de mots de passe ou de jetons. Utiliser les variables d'environnement et les secrets du fournisseur d'hébergement.
- Les documents de travail internes sous `.lovable/` contiennent encore des références utilisées par les tests et les contrôles de gouvernance. Ne pas supprimer ou publier ces fichiers en bloc ; préserver les données privées et migrer les références de manière contrôlée si le répertoire est renommé.

## Architecture et contenu

- Garder les métadonnées publiques bilingues et les chemins de langue réciproques dans `src/lib/seo.ts` ; utiliser les métadonnées des routes feuilles pour éviter les canonicals dupliqués.
- Les pages publiques FR/EN partagent des composants éditoriaux sensibles à la langue ; le contact anglais renvoie vers le formulaire français existant afin de garder une seule logique de contact.
- Modéliser le groupe du label comme Organization avec sous-organisations et l'artiste comme Person ; les liens Spotify `sameAs` appartiennent uniquement au schéma de l'artiste.
- Le sitemap public statique `public/sitemap.xml` et les canonicals absolus utilisent `SITE_URL` dans `src/lib/seo.ts`. Régénérer le sitemap à partir de `publicPages` et des sorties quand les routes changent ; ne jamais utiliser des hôtes de prévisualisation ou des dates `lastmod` inventées.
- Stocker les sorties confirmées et les biographies attribuées verbatim dans des modules compatibles navigateur ; les dates fournies ne deviennent jamais `datePublished` Schema.org et les formats, visuels ou liens d'écoute inconnus restent absents.
- Identifier les fiches catalogue par UPC et réutiliser les métadonnées de sortie partagées ; les identifiants stables préservent les titres exacts et les changements de langue bilingues.
- Garder les faits d'application et de villes confirmés par le propriétaire dans un module compatible navigateur ; désactiver le téléchargement dans le composant ApplicationBlock si aucun lien officiel validé n'existe.
- Utiliser le badge Google Play officiel localisé dans le composant ApplicationBlock partagé, avec son URL validée ; ne pas inventer de lien iOS.
- Définir des liens favicon NFLT uniques et versionnés dans l'en-tête racine et les chemins d'icône par défaut ; toute publication d'hébergement nécessite une autorisation.
- Garder la configuration du flux radio dans un module compatible navigateur et le lecteur HTML5 localisé partagé ; une URL absente ou non HTTPS désactive la lecture et ne déclenche aucune requête audio.
- Boutique et licences partagent les pages commerce localisées et un schéma de demande strict navigateur/serveur ; réutiliser les UPC et pochettes du catalogue.
- Résoudre les prix individuels par une seule table UPC/nombre de pistes documentée et le composant partagé `ReleasePrice` ; sans décompte vérifié, aucun prix ne s'affiche.
- Les demandes commerce sont insérées dans une table séparée via une fonction serveur dédiée ; préserver la logique de contact/messages et ne jamais présenter une insertion réussie comme un e-mail envoyé.
- Garder les paramètres vendeur prévus dans `.lovable/commerce-config.json`, importés uniquement par les tests tant que le checkout n'est pas approuvé ; les informations légales incomplètes ne doivent pas entrer dans les pages publiques ou les bundles navigateur.
- Garder les brouillons juridiques non approuvés dans `.lovable/legal/`. Les textes complets sont chargés uniquement en développement via un import dynamique protégé par `DEV`. Les routes de production conservent les avis, `noindex` et l'exclusion du sitemap ; `noindex` n'est pas un contrôle d'accès.
- Versionner les requêtes d'import Markdown privées quand leur contenu change ; vérifier le texte rendu après changement afin d'éviter les caches Vite obsolètes.
- Garder les pointeurs d'illustrations vérifiés par capture distincts des anciens pointeurs conservés et enregistrer dimensions/hash/preuves dans les documents internes ; des captures partielles et noms de fichiers ne prouvent jamais le nombre total de pistes ni une association UPC.
