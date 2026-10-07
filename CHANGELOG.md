# design-system-starter

## 0.4.0

### Minor Changes

- 7bd8a88: Nouveau primitif `blue.300` (#5D9DEA). En thème sombre, `color.feedback.info` l'utilise : le bleu des messages d'information passe de 5,5:1 à 7,2:1 sur le fond de page.
- 0cbd767: Button et IconButton : nouvelle prop `shape` (`rounded` par défaut, `pill` pour des bords entièrement ronds ; un IconButton `pill` est rond), via le component token `button.radius-pill`.
- 60c6d8d: SearchBar : nouvelle prop `shape` (`rounded` par défaut, `pill` pour des bords entièrement ronds). La forme pilule est disponible dans le style de champ partagé (`Field/control.module.css`).

### Patch Changes

- d65e377: Correction : le libellé masqué de SearchBar et l'aide clavier de BarChart / LineChart s'affichaient à l'écran (classe CSS supprimée lors de la création de VisuallyHidden). Nouveau garde-fou `scripts/check-css-classes.mjs` (lancé par `npm run lint`) : toute classe CSS utilisée dans un composant doit exister.

## 0.3.0

### Minor Changes

- 9ac95db: Couche IA : manifeste généré depuis le code (`design-system-starter/ai/manifest.json` : règles, composants, props, règles d'usage, tokens clair/sombre), skill `design-system` livrée avec le paquet, `AGENTS.md`. Nouveau composant exporté : `VisuallyHidden`.
- Serveur MCP `design-system-mcp` : règles, recherche de composants et de tokens, et `check_code` qui vérifie le code produit par une IA (composants/tokens inventés, valeurs de props inexistantes, props obligatoires absentes, valeurs brutes, éléments natifs, emojis). Config Stylelint partagée : `design-system-starter/stylelint-config`.

## 0.2.0

### Minor Changes

- Design system installable : build de librairie (`design-system-starter` + `styles.css`), 34 composants React
  documentés dans Storybook, tokens étendus (feedback, ombres, couches, typographies), garde-fous automatiques
  (Stylelint « tokens obligatoires », Oxlint, Prettier, audit d'accessibilité axe) et CI GitLab / GitHub.
