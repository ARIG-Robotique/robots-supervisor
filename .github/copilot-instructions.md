# Instructions pour Copilot

## Compilation, lint et tests

- Utilisez Node.js `>=18.14.0 <19.0.0` et installez les dépendances avec `yarn install` (ou `yarn --production=false` pour le développement local).
- `yarn start` lance l'application de développement connectée au backend sur `http://localhost:4200` ; `yarn start:mock` lance la version avec les services simulés.
- `yarn build` génère la version de production dans `dist`.
- `yarn lint` lance Angular ESLint avec `--fix` et formate les fichiers SCSS ; cette commande peut donc modifier des fichiers. Pour vérifier le lint sans appliquer de corrections, utilisez `yarn ng lint` ; pour cibler des fichiers précis, utilisez `yarn eslint <chemin>`.
- Aucun script ni outil de test n'est actuellement configuré, et il n'y a pas de fichiers `*.spec.ts` ; il n'existe donc pas de commande pour lancer un test isolé.

## Architecture

- Il s'agit d'une application Angular unique, initialisée depuis `src/main.ts` dans le `AppModule` racine. L'unique route affiche actuellement `MapComponent`, qui coordonne la carte, la sélection des robots et les panneaux latéraux de contrôle.
- NgRx gère la liste des robots, les robots sélectionnés, le choix du robot principal et leur état de connexion. Les actions, réducteurs, sélecteurs et effets sont regroupés dans `src/app/store` ; les effets vérifient l'état des robots toutes les cinq secondes.
- Les composants d'interface utilisent les services métier de `src/app/services`. Ces services s'appuient sur `HttpClient` et les observables RxJS ; les modèles d'URL backend communs se trouvent dans `constants/httpurl.constants.ts` et `utils/buildUrl.ts`. Les API de mouvement et d'état propres à chaque robot utilisent son `host`.
- La valeur `environment.mock` sélectionne les implémentations simulées dans `AppModule` ; les remplacements de fichiers Angular activent l'environnement simulé pour la configuration `mock`. Lorsqu'un service change, veillez à maintenir les mêmes interfaces entre ses versions réelle et simulée.
- La carte interroge la position des robots toutes les 200 ms et envoie les commandes de mouvement via `MouvementsService` ; tenez compte de ces interrogations et de celles de NgRx lorsque vous modifiez les flux de mise à jour.

## Conventions du dépôt

- L'application utilise Angular avec des NgModules, et non une architecture à composants autonomes. Les composants, leurs templates et leurs styles sont généralement regroupés dans le même répertoire ; les types métier partagés se trouvent dans `src/app/models`.
- Les sélecteurs des composants Angular utilisent le préfixe `arig-` et le format kebab-case ; ceux des directives utilisent `arig` et le format camelCase (conventions vérifiées par ESLint).
- Déclarez les chemins des endpoints backend dans `httpurl.constants.ts` et utilisez `buildUrl` pour construire les URL des services qui passent par le serveur configuré. Conservez des méthodes de service basées sur les observables afin de respecter le mécanisme de substitution réel/simulé.
- Les composants qui s'abonnent à des flux de longue durée étendent généralement `AbstractComponent` et utilisent `ngDestroy$` avec `takeUntil` pour nettoyer les abonnements à leur destruction.
- L'application utilise la locale française (`fr-FR`) et des textes d'interface en français ; conservez cette convention dans les changements visibles par les utilisateurs.
- Prettier utilise une indentation de quatre espaces, des apostrophes simples et une longueur de ligne de 120 caractères ; les templates Angular sont analysés avec le parseur Angular.
