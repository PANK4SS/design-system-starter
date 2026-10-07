---
name: design-system
description: Construire des interfaces React avec le design system « design-system-starter » (composants, tokens, règles d'accessibilité). À utiliser dès qu'on crée ou modifie une page, un écran, un formulaire, un tableau de bord ou un élément d'interface dans une application qui dépend de design-system-starter.
---

# Construire une interface avec le design system

Ne jamais deviner l'API d'un composant ni la valeur d'un token : les lire dans les sources ci-dessous.

## Sources de vérité

1. **Serveur MCP `design-system`** (s'il est connecté) : outils `list_components`, `get_component`, `search_tokens`, `get_rules`, `check_code`.
2. Sinon, le **manifeste** du paquet. Il est volumineux : ne pas le lire en entier, extraire ce qu'il faut.

```bash
# Règles globales
node -p "require('design-system-starter/ai/manifest.json').rules.join('\n')"
# Liste des composants par famille
node -p "require('design-system-starter/ai/manifest.json').components.map(c => c.family + ' / ' + c.name).join('\n')"
# Un composant : props, valeurs par défaut, règles d'usage (remplacer Input)
node -p "JSON.stringify(require('design-system-starter/ai/manifest.json').components.find(c => c.name === 'Input'), null, 2)"
# Tokens sémantiques d'une catégorie (ex. color.text, color.feedback, space, typography)
node -p "JSON.stringify(require('design-system-starter/ai/manifest.json').tokens.filter(t => t.category === 'color.text'), null, 2)"
```

## Méthode

1. **Lire les règles globales** (`rules`) avant d'écrire la moindre ligne.
2. **Choisir les composants** par famille : Formulaires, Affichage, Feedback, Superpositions, Navigation, Données, Mise en page. Ne jamais recréer un composant qui existe.
3. **Lire la fiche de chaque composant utilisé** : ses props (types, valeurs par défaut) et ses `guidelines` (tableau « À faire / À éviter »).
4. **Mettre en page** avec `Stack` (prop `gap`) et les tokens `--space-*`. Tout CSS ajouté n'utilise que des `var(--…)` : uniquement des tokens **sémantiques** (`--color-text-*`, `--color-background-*`…), jamais les primitifs de couleur (`--color-gray-500`).
5. **Vérifier** : avec l'outil MCP `check_code` s'il est disponible, sinon avec la liste ci-dessous.

## Exemple

```tsx
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Stack } from 'design-system-starter';

export function ConnexionCard() {
  return (
    <Card variant="elevated">
      <CardHeader title="Connexion" subtitle="Espace agents" titleAs="h2" />
      <CardBody>
        <Stack gap="4">
          <Input label="Adresse e-mail" type="email" autoComplete="email" />
          <Input label="Mot de passe" type="password" autoComplete="current-password" />
        </Stack>
      </CardBody>
      <CardFooter>
        <Button variant="primary" type="submit">Se connecter</Button>
      </CardFooter>
    </Card>
  );
}
```

## Liste de vérification finale

- [ ] Aucune valeur brute : pas de `#hex`, `rgb()`, `13px` ; uniquement `var(--…)` sémantiques.
- [ ] Aucun emoji dans l'interface ; icônes via `Icon` + `lucide-react`.
- [ ] Un seul `Button variant="primary"` par écran ; `danger` seulement pour une action destructrice, confirmée.
- [ ] Chaque champ a un `label` ; chaque `IconButton` a un `label` ; chaque image a un `alt`.
- [ ] Les erreurs passent par la prop `error`, jamais par la couleur seule.
- [ ] L'écran fonctionne en thème clair et sombre (`data-theme="dark"` sur `<html>`) sans code spécifique.
