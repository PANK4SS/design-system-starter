# Guide pour les agents IA qui travaillent sur ce dépôt

Starter réutilisable de design system : **tokens** DTCG (générés pour web, Android, iOS) + **composants React** documentés dans **Storybook**. Lire aussi `README.md`.

## Environnement

Tout passe par **Docker** : il n'y a pas de Node sur la machine. Préfixer chaque commande npm par `docker compose run --rm node`.

| Commande | Rôle |
|---|---|
| `npm run check` | Tokens + Oxlint + Stylelint + Prettier + TypeScript (à lancer avant chaque commit) |
| `npm run build` | Tokens + librairie (`dist/lib`) + manifeste IA (`dist/ai`) |
| `docker compose up storybook` | Storybook sur http://localhost:6006 |
| `docker compose run --rm a11y` | Audit axe de toutes les stories, en clair et en sombre |

## Architecture des tokens (`tokens/`)

`primitive/` (valeurs brutes) → `semantic/` (rôles ; `light/` et `dark/` ont **exactement les mêmes clés**) → `component/` (propriétés d'un composant). Chaque niveau pointe **uniquement** vers le niveau du dessous. On **ajoute** des tokens, on ne les remplace pas. Toute nouvelle paire texte/fond va dans `CONTRAST_PAIRS` de `scripts/check-tokens.mjs`.

## Ajouter un composant

1. Dossier `src/components/<Nom>/` : `<Nom>.tsx`, `<Nom>.module.css`, `<Nom>.stories.tsx`, `index.ts`. Imiter `src/components/Button/`.
2. Props typées avec une **JSDoc en français** (elle alimente Storybook et le manifeste IA) ; une JSDoc sur la fonction du composant.
3. CSS : uniquement `var(--…)` (Stylelint le refuse sinon) ; variables privées `--_x` pour les variantes ; `:focus-visible` jamais retiré ; animations coupées sous `prefers-reduced-motion`.
4. Accessibilité selon les patterns WAI-ARIA APG ; texte réservé aux lecteurs d'écran via `VisuallyHidden`.
5. Story : `title: '<Famille>/<Nom>'`, description avec un tableau « À faire | À éviter ». Aucun emoji : icônes via `Icon` + `lucide-react`.
6. Exporter dans `src/index.ts`, ajouter un changeset (`npx changeset`), puis `npm run check` et l'audit `a11y`.

## Conventions

- Commits : Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `style:`).
- Une exception à une règle de lint se justifie sur place : `-- raison` après la directive de désactivation.
- Ne jamais modifier `dist/` (généré).
