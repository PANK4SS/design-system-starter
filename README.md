# design-system-starter

Un **starter réutilisable** de design system : on le clone, on l'adapte, et on a une base solide pour n'importe quel projet. Les **design tokens** (couleurs, espacements, typographie, icônes, animations…) sont écrits une seule fois en JSON, vérifiés automatiquement, puis générés pour le **web**, **Android** et **iOS** avec [Style Dictionary](https://styledictionary.com).

## Adapter le starter à un projet

1. Renommer : `name` et `description` dans `package.json`, puis les constantes `PREFIX` et `ANDROID_PACKAGE` en haut de `build-tokens.mjs`.
2. Remplacer la **palette d'exemple** (jaune de marque, polices Orbitron et Inter) dans `tokens/primitive/`.
3. Mettre à jour les sémantiques dans `tokens/semantic/light` et `dark`, puis lancer `npm test` pour revérifier les contrastes.

## Prérequis

Uniquement **Docker**. Node.js et npm tournent dans un conteneur (voir `docker-compose.yml`), rien n'est installé sur la machine.

```bash
docker compose run --rm node npm install          # installer les dépendances
docker compose run --rm node npm test             # vérifier les règles des tokens
docker compose run --rm node npm run build:tokens # vérifier PUIS générer dist/
docker compose run --rm node npm run typecheck    # vérifier les types TypeScript
docker compose run --rm node npm run build        # tokens + librairie installable (dist/lib)
docker compose up storybook                       # Storybook sur http://localhost:6006
```

## Structure

```
tokens/
├── primitive/            # la palette brute, commune à tous les thèmes
│   ├── color.json        #   couleurs (marque, gris, statuts, graphiques)
│   ├── spacing.json      #   échelle de 4px
│   ├── font.json         #   familles, tailles, graisses, interlignes
│   ├── radius.json       #   arrondis
│   ├── icon.json         #   tailles et épaisseurs de trait des icônes
│   └── motion.json       #   durées et courbes d'animation (easing)
├── semantic/             # les rôles
│   ├── typography.json   #   styles de texte composites, communs à tous les thèmes
│   ├── light/color.json  #   couleurs du thème clair
│   └── dark/color.json   #   mêmes clés que light, valeurs différentes
└── component/            # component tokens, un fichier par composant (web uniquement)
src/
├── components/<Nom>/     # un dossier par composant React
│   ├── <Nom>.tsx         #   le composant et ses props (son API)
│   ├── <Nom>.module.css  #   ses styles : uniquement des var(--token)
│   ├── <Nom>.stories.tsx #   sa documentation vivante dans Storybook
│   └── index.ts          #   ce qu'il exporte
└── index.ts              # point d'entrée : tout ce qu'une app peut importer
.storybook/               # configuration de Storybook (thème clair/sombre, polices)
build-tokens.mjs          # configuration du build (plateformes, fichiers)
build/                    # formats maison : kotlin.mjs (Compose), swift.mjs (SwiftUI)
scripts/check-tokens.mjs  # les tests (npm test)
dist/                     # GÉNÉRÉ, ne jamais modifier à la main
```

## Règles (vérifiées par `npm test`)

| Règle | Pourquoi |
|---|---|
| Chaque alias `{…}` pointe vers un token qui existe | Un alias cassé produirait une valeur vide |
| `semantic/light` et `semantic/dark` ont **exactement les mêmes clés** | Sinon un composant casse dans l'un des deux thèmes |
| Chaque paire texte/fond déclarée atteint **4,5:1** (WCAG AA) | Lisibilité et accessibilité. Les paires sont listées en haut de `scripts/check-tokens.mjs` |

`npm run build:tokens` lance les tests d'abord : **on ne peut pas générer des tokens invalides**.

Règles non automatisées :
- On **ajoute** des tokens, on ne les remplace pas. Un token à retirer est d'abord déprécié.
- Graphiques : les couleurs `chart.categorical.1` à `5` s'utilisent **dans l'ordre** (ordre validé pour les daltoniens), et toujours avec une légende ou des libellés.

## Ce que génère le build

| Plateforme | Fichiers | Contenu |
|---|---|---|
| 🌐 Web, CSS | `web/css/light.css`, `dark.css` | Toutes les variables. `dark.css` ne redéfinit que les couleurs de thème, sous `[data-theme="dark"]` |
| 🌐 Web, JS | `web/js/light.js`, `dark.js` | Constantes, un fichier complet par thème |
| 🤖 Android Compose | `android/compose/*.kt` | `DSTokens` (commun), `DSColors` (interface), `DSColorsLight` / `DSColorsDark` |
| 🤖 Android XML | `android/xml/values/`, `values-night/` | `colors.xml`, `dimens.xml`. Android choisit `values-night` tout seul en mode sombre |
| 🍎 iOS SwiftUI | `ios/*.swift` | `DSTokens` (commun), `DSColors` (protocole), `DSColorsLight` / `DSColorsDark`, `DSSupport` |

Tous les types sont couverts sur toutes les plateformes : couleurs, dimensions, polices, graisses, nombres, durées, courbes d'animation et typographies composites.

### Utilisation

**Web**
```html
<link rel="stylesheet" href="dist/web/css/light.css" />
<link rel="stylesheet" href="dist/web/css/dark.css" />
<html data-theme="dark"> <!-- active le thème sombre -->
```
```css
.button {
  background: var(--color-action-primary);
  font-family: var(--typography-label-md-font-family);
  font-size: var(--typography-label-md-font-size);
  transition: background var(--duration-fast) var(--easing-standard);
}
```

**Android Compose**
```kotlin
val colors: DSColors = if (isSystemInDarkTheme()) DSColorsDark else DSColorsLight
Text(
    "Bonjour",
    color = colors.colorTextDefault,
    style = DSTokens.typographyHeadingLg.copy(fontFamily = orbitron), // la police vient des ressources de l'app
)
```

**iOS SwiftUI**
```swift
@Environment(\.colorScheme) var scheme
var colors: any DSColors { scheme == .dark ? DSColorsDark() : DSColorsLight() }

Text("Bonjour")
    .font(DSTokens.typographyHeadingLg.font)
    .lineSpacing(DSTokens.typographyHeadingLg.lineSpacing)
    .foregroundStyle(colors.colorTextDefault)
```

### Limites connues

- **Polices sur mobile** : seul le premier nom de la liste est utilisé (`"Orbitron"`), le mobile n'a pas de police de secours. Les fichiers de police doivent être ajoutés à l'app. En Compose, la `FontFamily` dépend des ressources de l'app : les `TextStyle` sont générés sans police, à compléter avec `.copy(fontFamily = …)`.
- **Code natif non compilé ici** : le Kotlin et le Swift générés ne sont pas compilés dans ce dépôt (il faudrait Android Studio / Xcode). C'est le CI de chaque app qui le compile en important `dist/`.
- **Typographie en CSS** : chaque style est éclaté en 5 variables (`-font-family`, `-font-size`, `-font-weight`, `-line-height`, `-letter-spacing`), car la propriété raccourcie `font` ne sait pas porter le `letter-spacing`.
- Le warning `filtered out token references` sur `dark.css` est **attendu** : les couleurs dark pointent vers des primitifs définis dans `light.css`, qui doit donc toujours être chargé.

## Utiliser le design system dans un projet

Le paquet se construit avec `npm run build` (tokens + librairie dans `dist/`). Pour l'installer dans une app :

```bash
docker compose run --rm node npm pack          # produit design-system-starter-0.1.0.tgz
# dans l'app :
npm install ../chemin/vers/design-system-starter-0.1.0.tgz lucide-react
```

(ou le publier sur un registre npm privé, GitHub Packages / GitLab Package Registry.)

```tsx
// Une seule fois, à la racine de l'app : tokens + styles des composants + styles de base
import 'design-system-starter/styles.css';

import { Button, Input, ToastProvider, useToast } from 'design-system-starter';
import { Search } from 'lucide-react';
```

- **Thème sombre** : poser `data-theme="dark"` sur `<html>`.
- **Polices** : l'app charge elle-même Inter et Orbitron (ex. Google Fonts), le design system ne fournit que leurs noms.
- **Dépendances** : `react`, `react-dom` (19+) et `lucide-react` sont des *peerDependencies* : c'est l'app qui les installe, pour qu'il n'y ait qu'un seul React.
- Les fichiers de tokens restent accessibles : `design-system-starter/tokens/css/light.css`, `…/tokens/js/light.js`.

## Composants (React)

Les composants sont en **React + TypeScript**, documentés dans **Storybook**. Les tokens sont multiplateformes, les composants non : un composant mobile natif devrait être réécrit en Compose ou en SwiftUI.

Règles d'un composant :
- Ses styles n'utilisent **que** des tokens (`var(--…)`), jamais de valeur brute.
- Il est « bête » : il affiche ce qu'on lui donne, sans logique métier ni appel API.
- Accessibilité : focus visible au clavier, contrastes vérifiés, onglet **Accessibility** de Storybook sans erreur.
- Le thème se change via `data-theme` posé sur `<html>` (les component tokens sont déclarés sur `:root`).

Il est aussi « bête » côté données : un `Table` trie quand on lui dit de trier (`sort` / `onSortChange`), il ne trie pas lui-même.

| Famille | Composants |
|---|---|
| Fondations | `Icon` (icônes SVG [Lucide](https://lucide.dev/icons)), `Stack` |
| Actions | `Button`, `IconButton` |
| Formulaires | `Field` (base commune), `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` / `Radio`, `Switch`, `SearchBar` |
| Affichage | `Card` (+ `CardHeader`, `CardBody`, `CardFooter`, `CardMedia`, `CardLink`), `Badge`, `Avatar`, `Divider` |
| Feedback | `Alert`, `Toast` (`ToastProvider` + `useToast`), `Spinner`, `Skeleton`, `ProgressBar` |
| Superpositions | `Modal`, `Tooltip`, `DropdownMenu` |
| Navigation | `Link`, `Tabs`, `Breadcrumb`, `Pagination` |
| Données | `Table`, `StatTile`, `BarChart`, `LineChart` |
| Hooks | `useControllableState`, `useClickOutside` |

```tsx
import { Button, Input, useToast } from 'design-system-starter';
import { Search } from 'lucide-react';
```

### Limites connues des composants

- **Tooltip et DropdownMenu** sont positionnés dans leur conteneur, sans « portail » ni détection de collision : un parent en `overflow: hidden` peut les couper.
- **Modal** utilise le piège de focus natif de `<dialog>` : après le dernier élément, le focus passe brièvement par la barre du navigateur avant de revenir dans la modale (il n'atteint jamais la page derrière).
- **Graphiques** : valeurs positives uniquement, pas de barres horizontales.
- **Composants mobiles** : aucun. Les tokens sont générés pour iOS et Android, mais les composants sont en React (web).

## Ajouter une autre plateforme

Chaque plateforme est un bloc dans `platforms` de `build-tokens.mjs`. Pour une plateforme standard, on copie un bloc et on change trois choses : `transformGroup` (ou `transforms`), `format` et `buildPath`.

| Cible | `transformGroup` | `format` |
|---|---|---|
| SCSS | `scss` | `scss/variables` |
| Less | `less` | `less/variables` |
| TypeScript (types) | `js` | `typescript/es6-declarations` |
| JSON | `js` | `json/nested` |
| Flutter (Dart) | `flutter` | `flutter/class.dart` |
| React Native | `react-native` | `javascript/es6` |

⚠️ Les groupes mobiles fournis (`flutter`, `compose`, `ios-swift`…) convertissent les tailles comme des `rem` (×16). Nos tokens sont en `px` : pour une nouvelle plateforme mobile, s'inspirer des formats maison de `build/` plutôt que des groupes fournis.

**Pour un format sur mesure** (comme `build/kotlin.mjs`) : une fonction reçoit la liste des tokens et renvoie le texte du fichier. On l'enregistre avec `StyleDictionary.registerFormat()`.

**Documentation de référence :**
- Formats disponibles : https://styledictionary.com/reference/hooks/formats/predefined/
- Groupes de transformations : https://styledictionary.com/reference/hooks/transform-groups/predefined/
- Transformations unitaires : https://styledictionary.com/reference/hooks/transforms/predefined/
- Créer ses propres formats : https://styledictionary.com/reference/hooks/formats/
