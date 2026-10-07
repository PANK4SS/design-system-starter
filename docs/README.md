# Documentation

Documentation technique de **design-system-starter**. Chaque guide se lit seul ; pour une découverte complète, suivre l'ordre ci-dessous.

| # | Guide | Pour qui | Contenu |
|---|---|---|---|
| 1 | [Démarrage](01-demarrage.md) | Tout le monde | Prérequis, commandes, structure du dépôt |
| 2 | [Architecture](02-architecture.md) | Tout le monde | Vue d'ensemble : du JSON des tokens jusqu'aux applications |
| 3 | [Tokens](03-tokens.md) | Design, développement | Les trois niveaux, les règles, ajouter ou retirer un token |
| 4 | [Thèmes clair et sombre](04-themes.md) | Développement | Le mécanisme exact, sur le web, dans Storybook et sur mobile |
| 5 | [Build multiplateforme](05-build-multiplateforme.md) | Développement | Style Dictionary, sorties web / Android / iOS, ajouter une plateforme |
| 6 | [Composants](06-composants.md) | Développement | Conventions, accessibilité, ajouter un composant |
| 7 | [Qualité](07-qualite.md) | Développement | Garde-fous automatiques et intégration continue |
| 8 | [IA et MCP](08-ia-et-mcp.md) | Développement | Manifeste, skill et serveur MCP pour les agents IA |
| 9 | [Versions et publication](09-versions-et-publication.md) | Mainteneurs | Changesets, paquet, installation dans une application |
| 10 | [Adapter le starter](10-adapter-le-starter.md) | Nouveau projet | Cloner et personnaliser pour une nouvelle marque |
| 11 | [Décisions d'architecture](11-decisions.md) | Mainteneurs | Les choix structurants et leurs raisons |

## Conventions de cette documentation

- Les commandes sont données telles qu'on les tape : tout passe par Docker (`docker compose run --rm node …`).
- Les diagrammes sont écrits en [Mermaid](https://mermaid.js.org) : GitHub, GitLab et la plupart des éditeurs les affichent directement.
- La documentation **des composants** (props, exemples, règles « À faire / À éviter ») vit dans **Storybook**, générée depuis le code. Ces guides expliquent le système, pas chaque composant.
