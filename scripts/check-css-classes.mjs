// Vérifie que chaque classe CSS utilisée dans un composant (styles.maClasse) existe dans le fichier
// .module.css importé. TypeScript ne le vérifie pas : une classe supprimée ou mal écrite ne produit
// aucune erreur, le style disparaît simplement. Lancé par npm run lint.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const files = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : p.endsWith('.tsx') ? [p] : [];
  });

// Retire les commentaires pour ne pas confondre « control.module.css » avec un usage de classe
const stripComments = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const problems = [];
for (const file of files('src')) {
  const code = stripComments(readFileSync(file, 'utf8'));
  for (const [, name, path] of code.matchAll(/import (\w+) from '([^']+\.module\.css)';/g)) {
    const cssFile = normalize(join(dirname(file), path));
    const css = stripComments(readFileSync(cssFile, 'utf8'));
    const classes = new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));
    const body = code.replace(/^import .*$/gm, ''); // les chemins d'import ne sont pas des usages
    const used = [
      // (?!\\.) : « control.module.css » est un nom de fichier, pas une classe
      ...body.matchAll(new RegExp(`\\b${name}\\.(\\w+)(?![\\w.])`, 'g')),
      ...body.matchAll(new RegExp(`\\b${name}\\[['"](\\w+)['"]\\]`, 'g')),
    ];
    for (const m of used) {
      if (!classes.has(m[1])) problems.push(`${file} : « ${name}.${m[1]} » n'existe pas dans ${cssFile}`);
    }
  }
}

if (problems.length) {
  console.error(`Classes CSS introuvables :\n- ${[...new Set(problems)].join('\n- ')}`);
  process.exit(1);
}
console.log('Toutes les classes CSS utilisées existent.');
