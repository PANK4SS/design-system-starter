// Vérifie les règles du design system avant chaque build.
// Lancer avec : npm test   (sort en erreur si une règle est violée)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Paires de couleurs à vérifier dans CHAQUE thème (WCAG AA) :
// 4,5:1 pour du texte, 3:1 pour un élément d'interface (bordure de champ, anneau de focus).
const TEXT = 4.5;
const UI = 3;
const CONTRAST_PAIRS = [
  ['color.text.default', 'color.background.page', TEXT],
  ['color.text.default', 'color.background.surface', TEXT],
  ['color.text.default', 'color.background.raised', TEXT],
  ['color.text.subtle', 'color.background.raised', TEXT],
  ['color.text.subtle', 'color.background.page', TEXT],
  ['color.text.subtle', 'color.background.surface', TEXT],
  ['color.text.on-brand', 'color.action.primary', TEXT],
  ['color.text.on-brand', 'color.action.primary-hover', TEXT],
  ['color.text.on-danger', 'color.action.danger', TEXT],
  ['color.text.on-danger', 'color.action.danger-hover', TEXT],
  ['color.feedback.danger', 'color.background.page', TEXT],
  ['color.feedback.success', 'color.background.page', TEXT],
  ['color.feedback.info', 'color.background.page', TEXT],
  ['color.feedback.warning', 'color.background.page', TEXT],
  ['color.feedback.info', 'color.feedback.info-surface', TEXT],
  ['color.feedback.success', 'color.feedback.success-surface', TEXT],
  ['color.feedback.warning', 'color.feedback.warning-surface', TEXT],
  ['color.feedback.danger', 'color.feedback.danger-surface', TEXT],
  ['color.text.default', 'color.feedback.danger-surface', TEXT],
  ['color.text.inverse', 'color.background.inverse', TEXT],
  ['color.control.on-checked', 'color.control.checked', TEXT],
  ['color.control.checked', 'color.background.page', UI],
  ['color.chart.other', 'color.background.page', UI],
  ['color.border.strong', 'color.background.page', UI],
  ['color.border.focus', 'color.background.page', UI],
  ['color.border.focus', 'color.background.surface', UI],
];
const THEMES = ['light', 'dark'];

// ─── Lecture des fichiers ─────────────────────────────────────────────────────
const jsonFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return jsonFiles(p);
    return p.endsWith('.json') ? [p] : [];
  });

// Fusionne plusieurs fichiers en un seul arbre
const merge = (target, source) => {
  for (const [k, v] of Object.entries(source)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && !('$value' in v)) {
      target[k] = merge(target[k] ?? {}, v);
    } else target[k] = v;
  }
  return target;
};
const load = (files) => files.reduce((tree, f) => merge(tree, JSON.parse(readFileSync(f, 'utf8'))), {});

// { "color.text.default": token, ... }
const flatten = (tree, prefix = '') =>
  Object.entries(tree).flatMap(([k, v]) =>
    '$value' in v ? [[prefix + k, v]] : flatten(v, `${prefix}${k}.`),
  );

// ─── Contraste WCAG ───────────────────────────────────────────────────────────
const luminance = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// ─── Vérifications ────────────────────────────────────────────────────────────
const errors = [];
const primitiveFiles = jsonFiles('tokens/primitive');
const sharedFiles = readdirSync('tokens/semantic')
  .filter((f) => f.endsWith('.json'))
  .map((f) => join('tokens/semantic', f));

const componentFiles = jsonFiles('tokens/component');
const keysByTheme = {};

for (const theme of THEMES) {
  const themeFiles = jsonFiles(`tokens/semantic/${theme}`);
  const all = Object.fromEntries(flatten(load([...primitiveFiles, ...sharedFiles, ...themeFiles, ...componentFiles])));
  keysByTheme[theme] = flatten(load(themeFiles)).map(([k]) => k).sort();

  // Résout un alias "{color.gray.900}" jusqu'à la valeur finale
  const resolve = (value, seen = []) => {
    if (typeof value !== 'string' || !/^\{.+\}$/.test(value)) return value;
    const ref = value.slice(1, -1);
    if (seen.includes(ref)) throw new Error(`référence circulaire : ${[...seen, ref].join(' -> ')}`);
    if (!all[ref]) throw new Error(`alias introuvable : ${value}`);
    return resolve(all[ref].$value, [...seen, ref]);
  };

  // 1. Tous les alias pointent vers un token existant
  for (const [name, token] of Object.entries(all)) {
    const values = typeof token.$value === 'object' && !Array.isArray(token.$value)
      ? Object.values(token.$value) // token composite (typographie)
      : [token.$value];
    for (const v of values) {
      try {
        resolve(v);
      } catch (e) {
        errors.push(`[${theme}] ${name} : ${e.message}`);
      }
    }
  }

  // 2. Contrastes
  for (const [fg, bg, min] of CONTRAST_PAIRS) {
    try {
      const ratio = contrast(resolve(all[fg].$value), resolve(all[bg].$value));
      const ok = ratio >= min;
      console.log(`${ok ? '✅' : '❌'} [${theme}] ${fg} sur ${bg} : ${ratio.toFixed(1)}`);
      if (!ok) errors.push(`[${theme}] contraste ${ratio.toFixed(1)} < ${min} : ${fg} sur ${bg}`);
    } catch (e) {
      errors.push(`[${theme}] paire ${fg} / ${bg} : ${e.message}`);
    }
  }
}

// 3. Les thèmes ont exactement les mêmes clés
const [first, ...others] = THEMES;
for (const theme of others) {
  const missing = keysByTheme[first].filter((k) => !keysByTheme[theme].includes(k));
  const extra = keysByTheme[theme].filter((k) => !keysByTheme[first].includes(k));
  for (const k of missing) errors.push(`[${theme}] token manquant (présent dans ${first}) : ${k}`);
  for (const k of extra) errors.push(`[${theme}] token en trop (absent de ${first}) : ${k}`);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} erreur(s) :\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('\n✅ Tous les tokens respectent les règles.');
