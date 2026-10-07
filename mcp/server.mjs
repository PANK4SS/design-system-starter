#!/usr/bin/env node
// Serveur MCP du design system : donne à un agent IA les composants, les tokens, les règles,
// et un outil pour VÉRIFIER le code qu'il produit. Il lit dist/ai/manifest.json (npm run build).
//
// Dans ce dépôt :  docker compose run --rm -T node node mcp/server.mjs
// Dans une app :   npx design-system-mcp
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { checkCss, checkTsx, formatIssues } from './checks.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));

let manifest;
try {
  manifest = readJson('dist/ai/manifest.json');
} catch {
  console.error('dist/ai/manifest.json introuvable : lancer « npm run build » dans le design system.');
  process.exit(1);
}
const stylelintConfig = readJson('config/stylelint.json');

const text = (value) => ({
  content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }],
});
const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const server = new McpServer({ name: 'design-system', version: manifest.version });

// ─── Lecture ─────────────────────────────────────────────────────────────────
server.registerTool(
  'get_rules',
  {
    title: 'Règles du design system',
    description:
      "Les règles à respecter pour construire une interface avec le design system, et comment l'installer. À lire en premier.",
  },
  async () => text({ rules: manifest.rules, usage: manifest.usage }),
);

server.registerTool(
  'list_components',
  {
    title: 'Lister les composants',
    description: 'Liste les composants (nom, famille, description). Filtrable par famille.',
    inputSchema: {
      family: z
        .string()
        .optional()
        .describe(
          'Famille : Fondations, Mise en page, Actions, Formulaires, Affichage, Feedback, Superpositions, Navigation, Données',
        ),
    },
  },
  async ({ family }) =>
    text(
      manifest.components
        .filter((c) => !family || normalize(c.family ?? '') === normalize(family))
        .map(({ name, family: f, description }) => ({ name, family: f, description })),
    ),
);

server.registerTool(
  'get_component',
  {
    title: "Fiche d'un composant",
    description:
      "Tout sur un composant : import, props (types, obligatoires, valeurs par défaut), règles d'usage « À faire / À éviter ». À lire avant d'utiliser un composant.",
    inputSchema: { name: z.string().describe('Nom exact, ex. Button, Input, CardHeader') },
  },
  async ({ name }) => {
    const component = manifest.components.find((c) => normalize(c.name) === normalize(name));
    if (component) return text(component);
    const close = manifest.components.filter((c) => normalize(c.name).includes(normalize(name))).map((c) => c.name);
    return text(
      `Composant « ${name} » introuvable.${close.length ? ` Vouliez-vous dire : ${close.join(', ')} ?` : ''}`,
    );
  },
);

server.registerTool(
  'search_components',
  {
    title: 'Chercher un composant',
    description:
      'Trouve les composants adaptés à un besoin décrit en français (ex. « formulaire de connexion », « afficher une erreur », « choisir une option »).',
    inputSchema: { query: z.string() },
  },
  async ({ query }) => {
    const words = normalize(query)
      .split(/\W+/)
      .filter((w) => w.length > 2);
    const scored = manifest.components
      .map((c) => {
        const name = normalize(c.name);
        const body = normalize(`${c.family} ${c.description ?? ''} ${c.guidelines ?? ''}`);
        const score = words.reduce((s, w) => s + (name.includes(w) ? 5 : 0) + (body.includes(w) ? 1 : 0), 0);
        return { name: c.name, family: c.family, description: c.description, score };
      })
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return text(scored.length ? scored : 'Aucun composant trouvé : essayer list_components.');
  },
);

server.registerTool(
  'search_tokens',
  {
    title: 'Chercher des tokens',
    description:
      "Liste les tokens (variables CSS) avec leurs valeurs en thème clair et sombre. Par défaut, uniquement les tokens sémantiques, ceux qu'il faut utiliser.",
    inputSchema: {
      query: z.string().optional().describe('Texte cherché dans le nom, ex. « text », « space », « danger »'),
      category: z.string().optional().describe('Ex. color.text, color.background, color.feedback, space, typography'),
      includePrimitives: z
        .boolean()
        .optional()
        .describe('Inclure les primitifs de couleur (déconseillés dans une app)'),
    },
  },
  async ({ query, category, includePrimitives }) =>
    text(
      manifest.tokens.filter(
        (t) =>
          (includePrimitives || !t.primitive) &&
          (!category || t.category === category) &&
          (!query || t.name.includes(query.toLowerCase())),
      ),
    ),
);

// ─── Vérification ────────────────────────────────────────────────────────────
server.registerTool(
  'check_code',
  {
    title: 'Vérifier du code',
    description:
      "Vérifie du code React (tsx/jsx) ou CSS contre le design system : composants ou tokens inventés, valeurs de props inexistantes, props obligatoires absentes, valeurs brutes, éléments HTML natifs à la place des composants, emojis. À lancer sur CHAQUE fichier produit, puis corriger jusqu'à « Aucun problème ».",
    inputSchema: {
      code: z.string(),
      language: z.enum(['tsx', 'jsx', 'css']).describe('Langage du code'),
    },
  },
  async ({ code, language }) => {
    const issues =
      language === 'css' ? await checkCss(code, manifest, stylelintConfig, ROOT) : checkTsx(code, manifest);
    return text(formatIssues(issues));
  },
);

// Le manifeste complet, pour les clients qui préfèrent les ressources
server.registerResource(
  'manifest',
  'design-system://manifest',
  { title: 'Manifeste du design system', mimeType: 'application/json' },
  async (uri) => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify(manifest) }] }),
);

await server.connect(new StdioServerTransport());
