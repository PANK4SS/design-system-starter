// Génère dist/ai/manifest.json : la description COMPLÈTE du design system, lisible par une IA.
// Tout est lu depuis le code (composants, props, JSDoc, docs des stories, tokens) : le manifeste ne peut pas
// être en retard sur le code. Lancer avec : npm run build:manifest (après build:tokens).
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { builtinResolvers, parse } from 'react-docgen';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const OUT = 'dist/ai';

// ─── Règles globales, à respecter par toute IA qui produit une interface ─────
const rules = [
  "Construire l'interface UNIQUEMENT avec les composants du design system. Ne jamais recréer un bouton, un champ, une carte… à la main.",
  "Toute couleur, taille, espacement, rayon, ombre, police ou z-index vient d'un token : var(--…). Jamais de valeur brute (#hex, rgb(), 13px).",
  'Les couleurs de thème sont les tokens --color-* : elles changent seules entre clair et sombre (data-theme="dark" sur <html>). Ne jamais écrire de couleur différente par thème.',
  "Espacements : uniquement l'échelle --space-* (multiples de 4px). Dans une mise en page, préférer le composant Stack (prop gap).",
  "Icônes : uniquement le composant Icon avec une icône de lucide-react. Jamais d'emoji dans l'interface.",
  "Un bouton qui ne contient qu'une icône est un IconButton, avec un label obligatoire.",
  'Un seul Button variant="primary" par écran. variant="danger" uniquement pour une action destructrice, avec confirmation (Modal).',
  'Un bouton déclenche une action ; un Link navigue vers une page.',
  'Chaque champ de formulaire a un label visible. Les erreurs passent par la prop error (jamais la couleur seule).',
  'Accessibilité WCAG AA : contrastes respectés par les tokens, focus visible, navigation clavier complète. Ne jamais retirer un outline de focus.',
  "Les composants sont « bêtes » : la logique (appels API, tri, validation) reste dans l'application et passe par les props.",
];

// ─── Composants : liste prise dans src/index.ts ──────────────────────────────
const folders = [...readFileSync('src/index.ts', 'utf8').matchAll(/from '\.\/components\/(\w+)'/g)].map((m) => m[1]);
const resolver = new builtinResolvers.FindExportedDefinitionsResolver();

// Un type absent = une prop héritée d'un élément HTML (type, rows, placeholder…) avec une valeur par défaut
const typeText = (t) => (t ? (t.raw ?? t.name) : 'attribut HTML natif');

function readStories(folder) {
  const file = join('src/components', folder, `${folder}.stories.tsx`);
  let code = '';
  try {
    code = readFileSync(file, 'utf8');
  } catch {
    return { family: null, guidelines: null, stories: [] };
  }
  const title = code.match(/title: '([^']+)'/)?.[1] ?? '';
  // La description markdown de la page Docs (dont le tableau « À faire | À éviter »)
  const guidelines =
    code
      .match(/component:\s*`([\s\S]*?)`,/)?.[1]
      ?.replace(/\\`/g, '`')
      .trim() ?? null;
  const stories = [...code.matchAll(/^export const (\w+): Story/gm)].map((m) => m[1]);
  return { family: title.split('/')[0] || null, guidelines, stories };
}

const components = [];
for (const folder of folders) {
  const dir = join('src/components', folder);
  const exported = new Set(
    [...readFileSync(join(dir, 'index.ts'), 'utf8').matchAll(/export \{([^}]+)\}/g)].flatMap((m) =>
      m[1].split(',').map((s) =>
        s
          .trim()
          .split(/\s+as\s+/)
          .pop(),
      ),
    ),
  );
  const { family, guidelines, stories } = readStories(folder);
  const files = readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'));

  for (const file of files) {
    const code = readFileSync(join(dir, file), 'utf8');
    let docs = [];
    try {
      docs = parse(code, { filename: join(dir, file), resolver });
    } catch {
      continue; // fichier sans composant (hooks, utilitaires)
    }
    for (const doc of docs) {
      if (!doc.displayName || !exported.has(doc.displayName)) continue;
      components.push({
        name: doc.displayName,
        family,
        import: `import { ${doc.displayName} } from '${pkg.name}';`,
        description: doc.description || null,
        props: Object.entries(doc.props ?? {}).map(([name, p]) => ({
          name,
          type: typeText(p.tsType),
          required: Boolean(p.required),
          default: p.defaultValue?.value ?? null,
          description: p.description || null,
        })),
        // Les règles d'usage sont partagées par les composants d'un même dossier (ex. Card et CardHeader)
        guidelines,
        stories,
        storybookPath: family ? `${family}/${folder}` : null,
      });
    }
  }
}

// ─── Tous les noms exportés par le paquet (pour détecter un import inventé) ───
const exportsList = { values: new Set(), types: new Set() };
for (const folder of [...folders, '../hooks']) {
  const indexFile = join('src/components', folder, 'index.ts');
  const code = readFileSync(indexFile, 'utf8');
  for (const m of code.matchAll(/export (type )?\{([^}]+)\}/g)) {
    for (const raw of m[2].split(',')) {
      const name = raw
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (name) (m[1] ? exportsList.types : exportsList.values).add(name);
    }
  }
}

// ─── Tokens : valeurs claire et sombre fusionnées ────────────────────────────
const light = JSON.parse(readFileSync('dist/web/json/light.json', 'utf8'));
const dark = new Map(JSON.parse(readFileSync('dist/web/json/dark.json', 'utf8')).map((t) => [t.name, t]));
const tokens = light
  .filter((t) => !t.path[0].match(/^(button)$/)) // les component tokens sont internes aux composants
  .map((t) => {
    const d = dark.get(t.name)?.value;
    return {
      name: t.name,
      type: t.type,
      category: t.path[0] === 'color' ? `color.${t.path[1]}` : t.path[0],
      light: t.value,
      ...(d !== undefined && JSON.stringify(d) !== JSON.stringify(t.value) ? { dark: d } : {}),
    };
  });

// Pour une IA, les tokens utiles sont les SÉMANTIQUES (rôles) ; les primitifs de couleur sont signalés.
const primitiveColor = /^color\.(yellow|gray|green|red|blue|orange|aqua|violet|magenta|white|black-alpha)$/;
for (const t of tokens) if (primitiveColor.test(t.category)) t.primitive = true;

// ─── Écriture ────────────────────────────────────────────────────────────────
const manifest = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  usage: {
    install: `npm install ${pkg.name} lucide-react react react-dom`,
    styles: `import '${pkg.name}/styles.css'; // une seule fois, à la racine de l'app`,
    theme: 'Thème sombre : <html data-theme="dark">. Thème clair par défaut.',
    icons: 'import { Search } from \'lucide-react\'; <Icon icon={Search} size="md" />',
    fonts: "L'application charge elle-même les polices (voir les tokens --font-family-*).",
  },
  rules,
  exports: { values: [...exportsList.values].sort(), types: [...exportsList.types].sort() },
  components,
  tokens,
};

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
// La skill et le guide pour IA voyagent avec le paquet
cpSync('ai', OUT, { recursive: true });

const semantic = tokens.filter((t) => !t.primitive).length;
console.log(
  `✔︎ ${OUT}/manifest.json : ${components.length} composants, ${tokens.length} tokens (${semantic} hors primitifs de couleur)`,
);
