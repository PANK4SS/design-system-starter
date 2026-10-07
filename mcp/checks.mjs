// Vérifications du code produit par une IA (ou un humain) qui utilise le design system.
// Fonctions pures : elles reçoivent le code et le manifeste, et renvoient une liste de problèmes.
import stylelint from 'stylelint';

/** @typedef {{ severity: 'error' | 'warning', line: number, message: string }} Issue */

// Éléments HTML natifs qu'un composant du design system remplace
const NATIVE_REPLACEMENTS = {
  button: 'Button (ou IconButton pour une icône seule)',
  input: 'Input, Checkbox, Radio, Switch ou SearchBar',
  select: 'Select',
  textarea: 'Textarea',
  table: 'Table',
  dialog: 'Modal',
  progress: 'ProgressBar',
  hr: 'Divider',
};

const lineOf = (code, index) => code.slice(0, index).split('\n').length;

/** Les valeurs autorisées d'une prop dont le type est une union de chaînes : 'primary' | 'secondary' */
function literalValues(type) {
  const parts = type.split('|').map((p) => p.trim());
  return parts.every((p) => /^'[^']*'$/.test(p)) ? parts.map((p) => p.slice(1, -1)) : null;
}

// ─── Tokens : var(--…) inventé, primitif ou interne ──────────────────────────
function checkTokens(code, manifest, issues) {
  const known = new Map(manifest.tokens.map((t) => [t.name, t]));
  for (const m of code.matchAll(/var\(\s*(--[\w-]+)/g)) {
    const name = m[1];
    if (name.startsWith('--_')) continue; // variable privée locale
    const token = known.get(name);
    const line = lineOf(code, m.index);
    if (!token) {
      issues.push({ severity: 'error', line, message: `Le token ${name} n'existe pas dans le design system.` });
    } else if (token.primitive) {
      issues.push({
        severity: 'warning',
        line,
        message: `${name} est un token PRIMITIF : utiliser un token sémantique (--color-text-*, --color-background-*…) qui suit le thème.`,
      });
    }
  }
}

// ─── Code React (TSX / JSX) ──────────────────────────────────────────────────
export function checkTsx(code, manifest) {
  /** @type {Issue[]} */
  const issues = [];
  const components = new Map(manifest.components.map((c) => [c.name, c]));
  const exported = new Set([...manifest.exports.values, ...manifest.exports.types]);
  const pkg = manifest.name; // le nom du paquet vient du manifeste (donc de package.json)

  // 1. Imports inventés
  for (const m of code.matchAll(new RegExp(`import\\s+(type\\s+)?\\{([^}]+)\\}\\s+from\\s+['"]${pkg}['"]`, 'g'))) {
    for (const raw of m[2].split(',')) {
      const name = raw
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0];
      if (name && !exported.has(name)) {
        issues.push({
          severity: 'error',
          line: lineOf(code, m.index),
          message: `« ${name} » n'est pas exporté par ${pkg}. Composants disponibles : list_components.`,
        });
      }
    }
  }

  // 2. Emojis dans l'interface
  for (const m of code.matchAll(/\p{Extended_Pictographic}/gu)) {
    issues.push({
      severity: 'error',
      line: lineOf(code, m.index),
      message: `Emoji « ${m[0]} » : utiliser le composant Icon avec une icône lucide-react.`,
    });
  }

  // 3. Couleurs écrites en dur
  for (const m of code.matchAll(/['"`]\s*(#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla)\([^)]*\))\s*['"`]/g)) {
    issues.push({
      severity: 'error',
      line: lineOf(code, m.index),
      message: `Couleur en dur ${m[1]} : utiliser un token sémantique var(--color-…).`,
    });
  }

  // 4. Tailles brutes dans les styles en ligne
  for (const block of code.matchAll(/style=\{\{([\s\S]*?)\}\}/g)) {
    for (const m of block[1].matchAll(/(\w+)\s*:\s*(['"]?\d+(?:\.\d+)?(px|rem|em)?['"]?)/g)) {
      if (/^(flex|flexGrow|flexShrink|opacity|zIndex|order|lineHeight)$/.test(m[1]) || /^['"]?0['"]?$/.test(m[2]))
        continue;
      issues.push({
        severity: 'warning',
        line: lineOf(code, block.index),
        message: `Valeur brute « ${m[1]}: ${m[2]} » : utiliser un token (var(--space-*)…) ou le composant Stack (prop gap).`,
      });
    }
  }

  // Les flèches « => » contiennent un « > » qui couperait les balises : on les neutralise pour l'analyse.
  const jsx = code.replace(/=>/g, '=¬');

  // 5. Éléments natifs à la place des composants
  for (const m of jsx.matchAll(/<(button|input|select|textarea|table|dialog|progress|hr)\b/g)) {
    issues.push({
      severity: 'warning',
      line: lineOf(code, m.index),
      message: `<${m[1]}> natif : utiliser le composant ${NATIVE_REPLACEMENTS[m[1]]} du design system.`,
    });
  }
  for (const m of jsx.matchAll(/<img\b([^<>]*)>/g)) {
    if (!/\balt=/.test(m[1])) {
      issues.push({ severity: 'error', line: lineOf(code, m.index), message: '<img> sans attribut alt.' });
    }
  }

  // 6. Props des composants du design system : valeurs inventées, props obligatoires oubliées
  let primaryButtons = 0;
  for (const m of jsx.matchAll(/<([A-Z]\w*)\b([^<>]*?)\/?>/g)) {
    const component = components.get(m[1]);
    if (!component) continue;
    const attrs = m[2];
    const line = lineOf(code, m.index);
    const given = new Map(
      [...attrs.matchAll(/(\w[\w-]*)=(?:"([^"]*)"|'([^']*)'|\{)/g)].map((a) => [a[1], a[2] ?? a[3]]),
    );
    const hasSpread = /\{\s*\.\.\./.test(attrs);

    for (const prop of component.props) {
      const value = given.get(prop.name);
      const allowed = literalValues(prop.type);
      if (value !== undefined && allowed && !allowed.includes(value)) {
        issues.push({
          severity: 'error',
          line,
          message: `${m[1]} : ${prop.name}="${value}" n'existe pas. Valeurs possibles : ${allowed.join(', ')}.`,
        });
      }
      if (prop.required && !given.has(prop.name) && !hasSpread && prop.name !== 'children') {
        issues.push({
          severity: 'error',
          line,
          message: `${m[1]} : la prop obligatoire « ${prop.name} » est absente.`,
        });
      }
    }
    if (m[1] === 'Button' && (given.get('variant') ?? 'primary') === 'primary') primaryButtons += 1;
  }
  if (primaryButtons > 1) {
    issues.push({
      severity: 'warning',
      line: 1,
      message: `${primaryButtons} boutons primary : un seul par écran (les autres en secondary ou ghost).`,
    });
  }

  checkTokens(code, manifest, issues);
  return issues.sort((a, b) => a.line - b.line);
}

// ─── CSS : les règles Stylelint du design system + les tokens ────────────────
export async function checkCss(code, manifest, stylelintConfig, configBasedir) {
  /** @type {Issue[]} */
  const issues = [];
  const { results } = await stylelint.lint({
    code,
    codeFilename: 'code.module.css',
    config: stylelintConfig,
    configBasedir,
  });
  // Une propriété raccourcie (background, margin…) est décomposée par Stylelint : on dédoublonne les messages.
  const seen = new Set();
  for (const w of results[0]?.warnings ?? []) {
    const key = `${w.line}:${w.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    issues.push({ severity: w.severity, line: w.line, message: w.text });
  }
  checkTokens(code, manifest, issues);
  return issues.sort((a, b) => a.line - b.line);
}

/** Résumé lisible d'une liste de problèmes */
export function formatIssues(issues) {
  if (!issues.length) return 'Aucun problème : le code respecte le design system.';
  const errors = issues.filter((i) => i.severity === 'error').length;
  const lines = issues.map(
    (i) => `- [${i.severity === 'error' ? 'ERREUR' : 'attention'}] ligne ${i.line} : ${i.message}`,
  );
  return `${errors} erreur(s), ${issues.length - errors} avertissement(s) :\n${lines.join('\n')}`;
}
