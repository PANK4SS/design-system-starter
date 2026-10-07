# Changesets

Chaque modification qui change le design system s'accompagne d'un « changeset » : un petit fichier qui dit
**quel type de version** elle implique (SemVer) et **ce qui a changé**, en une phrase.

```bash
docker compose run --rm node npx changeset          # décrire une modification (patch / minor / major)
docker compose run --rm node npm run version        # appliquer : nouvelle version + CHANGELOG.md
```

- `patch` : correction sans rien casser (un hover de la mauvaise couleur)
- `minor` : nouveauté sans rien casser (un nouveau composant, un nouveau token)
- `major` : changement cassant (renommer une prop, supprimer un token déprécié)
