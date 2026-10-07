# design-system-starter

## 0.3.0

### Minor Changes

- 9ac95db: Couche IA : manifeste généré depuis le code (`design-system-starter/ai/manifest.json` : règles, composants, props, règles d'usage, tokens clair/sombre), skill `design-system` livrée avec le paquet, `AGENTS.md`. Nouveau composant exporté : `VisuallyHidden`.
- Serveur MCP `design-system-mcp` : règles, recherche de composants et de tokens, et `check_code` qui vérifie le code produit par une IA (composants/tokens inventés, valeurs de props inexistantes, props obligatoires absentes, valeurs brutes, éléments natifs, emojis). Config Stylelint partagée : `design-system-starter/stylelint-config`.

## 0.2.0

### Minor Changes

- Design system installable : build de librairie (`design-system-starter` + `styles.css`), 34 composants React
  documentés dans Storybook, tokens étendus (feedback, ombres, couches, typographies), garde-fous automatiques
  (Stylelint « tokens obligatoires », Oxlint, Prettier, audit d'accessibilité axe) et CI GitLab / GitHub.
