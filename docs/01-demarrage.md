# Démarrage

## Prérequis

**Docker** uniquement. Node.js, npm et tous les outils tournent dans des conteneurs définis par `docker-compose.yml` : rien n'est installé sur la machine.

| Service Docker | Image | Rôle |
|---|---|---|
| `node` | `node:22` | Toutes les commandes npm |
| `storybook` | hérite de `node` | Serveur Storybook, port 6006 |
| `a11y` | `mcr.microsoft.com/playwright` | Audit d'accessibilité dans un vrai navigateur |

## Premiers pas

```bash
docker compose run --rm node npm install   # dépendances (dans node_modules/, local au dossier)
docker compose run --rm node npm run build # tokens + librairie + manifeste IA, dans dist/
docker compose up storybook                # documentation vivante : http://localhost:6006
```

Pour arrêter Storybook : `Ctrl + C`, ou `docker compose down` s'il tourne en arrière-plan.

> Après une modification des **tokens**, redémarrer Storybook (`docker compose restart storybook`) : le serveur déjà lancé ne recharge pas le CSS des tokens régénéré.

## Commandes

| Commande (`docker compose run --rm node npm run …`) | Effet |
|---|---|
| `build:tokens` | Vérifie les tokens, puis les génère pour toutes les plateformes (`dist/web`, `dist/android`, `dist/ios`) |
| `build:lib` | Construit la librairie React installable (`dist/lib`) |
| `build:manifest` | Génère le manifeste pour les IA (`dist/ai`) |
| `build` | Les trois, dans l'ordre |
| `check` | Toutes les vérifications : tokens, lint, formatage, types |
| `test:mcp` | Tests du serveur MCP (après `build`) |
| `build:storybook` | Version statique de Storybook (`storybook-static/`) |

Audit d'accessibilité de toutes les stories : `docker compose run --rm a11y`.

## Structure du dépôt

```text
tokens/                  Source de vérité des décisions de design (JSON, format DTCG)
├── primitive/             valeurs brutes : couleurs, espacements, typographie, rayons, ombres…
├── semantic/              rôles : typography.json (commun), light/ et dark/ (couleurs par thème)
└── component/             propriétés propres à un composant (web uniquement)
src/                     Composants React
├── components/<Nom>/      un dossier par composant : .tsx, .module.css, .stories.tsx, index.ts
├── hooks/                 hooks utilitaires exportés
├── utils/                 utilitaires internes (cx, classe visuallyHidden)
├── index.ts               API publique du paquet
└── lib.ts, styles.css     entrée du build de librairie (code + CSS)
build-tokens.mjs         Configuration de Style Dictionary (plateformes, fichiers)
build/                   Formats et utilitaires maison du build (Kotlin, Swift, JSON)
scripts/                 Vérification des tokens, manifeste IA, audit d'accessibilité
mcp/                     Serveur MCP et ses vérifications de code
ai/                      Skill et guide livrés aux IA avec le paquet
config/stylelint.json    Règles CSS partagées (dépôt et applications)
.storybook/              Configuration de Storybook (thèmes, polices, documentation)
docs/                    Cette documentation
dist/                    GÉNÉRÉ : ne jamais modifier à la main (ignoré par Git)
```
