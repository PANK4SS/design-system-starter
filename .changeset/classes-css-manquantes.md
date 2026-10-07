---
'design-system-starter': patch
---

Correction : le libellé masqué de SearchBar et l'aide clavier de BarChart / LineChart s'affichaient à l'écran (classe CSS supprimée lors de la création de VisuallyHidden). Nouveau garde-fou `scripts/check-css-classes.mjs` (lancé par `npm run lint`) : toute classe CSS utilisée dans un composant doit exister.
