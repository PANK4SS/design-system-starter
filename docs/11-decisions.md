# Décisions d'architecture

Les choix structurants, et pourquoi ils ont été faits. Avant de changer l'un d'eux, relire ses raisons.

| # | Décision | Raisons | Conséquences |
|---|---|---|---|
| 1 | **Tout passe par Docker** | Rien d'installé sur la machine ; même environnement pour tous et en CI | Préfixer les commandes par `docker compose run --rm node` |
| 2 | **Tokens au format DTCG**, en JSON | Standard du W3C, neutre, lisible par tous les outils | Une étape de build est nécessaire |
| 3 | **Trois niveaux de tokens** | Thèmes et marques sans toucher aux composants | Plus de fichiers ; règle « un niveau ne pointe que vers celui du dessous » |
| 4 | **Style Dictionary** pour le build | Standard du domaine, extensible (formats et transforms maison) | Formats mobiles écrits à la main (`build/`) |
| 5 | **Tailles en `px`** dans les tokens | Lisibles par un humain ; conversion explicite par plateforme | Transforms maison (`px → dp/sp`, `CGFloat`) |
| 6 | **Composants React uniquement** | Un composant est du code propre à une plateforme ; une seule équipe | Les apps mobiles n'ont que les tokens |
| 7 | **CSS Modules + variables CSS** | Pas de dépendance d'exécution ; thèmes par cascade CSS ; compatible avec tout framework | `data-theme` doit être posé sur `<html>` |
| 8 | **Thème par `data-theme`** plutôt que `prefers-color-scheme` seul | L'application garde le contrôle (choix utilisateur mémorisé) | L'application lit la préférence système si elle le souhaite |
| 9 | **Icônes Lucide** en peerDependency | Grande bibliothèque libre, SVG, arbre secoué (seules les icônes importées sont livrées) | L'application installe `lucide-react` |
| 10 | **`<dialog>` natif** pour Modal | Piège de focus, Échap et couche supérieure fournis par le navigateur | Comportement du focus propre au navigateur |
| 11 | **Oxlint** plutôt qu'ESLint | TypeScript 7 n'expose pas l'API attendue par `typescript-eslint` ; Oxlint est rapide et couvre React et l'accessibilité JSX | Règles de typage avancé non disponibles |
| 12 | **Stylelint « tokens obligatoires »** | Garantir qu'aucune valeur brute n'entre dans le code | Exceptions justifiées sur place |
| 13 | **Manifeste IA généré** depuis le code | Une documentation écrite à la main finit par mentir | Les JSDoc et les stories doivent être soignées |
| 14 | **Audit axe sur chaque story**, dans les deux thèmes | L'accessibilité se teste, elle ne se promet pas | Chaque nouvelle story est auditée en CI |
| 15 | **Paquet `private`** | Éviter une publication publique accidentelle | Retirer `private` pour publier sur un registre |
