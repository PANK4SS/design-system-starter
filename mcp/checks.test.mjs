// Tests des vérifications du MCP (node --test). Ils utilisent le vrai manifeste : lancer npm run build avant.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkCss, checkTsx } from './checks.mjs';

const manifest = JSON.parse(readFileSync('dist/ai/manifest.json', 'utf8'));
const stylelintConfig = JSON.parse(readFileSync('config/stylelint.json', 'utf8'));
const errors = (issues) => issues.filter((i) => i.severity === 'error');
const has = (issues, text) => issues.some((i) => i.message.includes(text));

test('un code correct ne déclenche aucune alerte', () => {
  const code = `
import { Button, Card, CardBody, CardFooter, CardHeader, Icon, Input, Stack } from 'design-system-starter';
import { Shield } from 'lucide-react';

export function Connexion({ onSubmit }: { onSubmit: () => void }) {
  return (
    <Card variant="elevated">
      <CardHeader title="Connexion" titleAs="h2" />
      <CardBody>
        <Stack gap="4">
          <Input label="Adresse e-mail" type="email" />
          <Input label="Mot de passe" type="password" />
        </Stack>
      </CardBody>
      <CardFooter>
        <Button variant="primary" iconStart={<Icon icon={Shield} size="sm" />} onClick={() => onSubmit()}>
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
}`;
  assert.deepEqual(checkTsx(code, manifest), []);
});

test('détecte un composant inventé', () => {
  const issues = checkTsx(`import { Accordion } from 'design-system-starter';`, manifest);
  assert.ok(has(errors(issues), "« Accordion » n'est pas exporté"));
});

test("accepte l'import d'un type", () => {
  const issues = checkTsx(`import { type ButtonProps } from 'design-system-starter';`, manifest);
  assert.deepEqual(issues, []);
});

test('détecte une valeur de prop inventée', () => {
  const issues = checkTsx(`<Button variant="tertiary">Ok</Button>`, manifest);
  assert.ok(has(errors(issues), 'variant="tertiary" n\'existe pas'));
});

test('détecte une prop obligatoire absente', () => {
  const issues = checkTsx(`<Input type="email" />`, manifest);
  assert.ok(has(errors(issues), '« label » est absente'));
});

test('ne réclame pas une prop obligatoire passée par un spread', () => {
  assert.deepEqual(checkTsx(`<Input {...field} />`, manifest), []);
});

test('détecte couleurs en dur, tailles brutes et emojis', () => {
  const issues = checkTsx(`<div style={{ color: '#ff0000', padding: 13 }}>Alerte 🔥</div>`, manifest);
  assert.ok(has(errors(issues), 'Couleur en dur #ff0000'));
  assert.ok(has(issues, 'padding: 13'));
  assert.ok(has(errors(issues), 'Emoji'));
});

test('signale un élément natif remplacé par un composant', () => {
  const issues = checkTsx(`<button onClick={() => go()}>Envoyer</button>`, manifest);
  assert.ok(has(issues, '<button> natif'));
});

test('signale plusieurs boutons primary', () => {
  const issues = checkTsx(`<><Button>A</Button><Button variant="primary">B</Button></>`, manifest);
  assert.ok(has(issues, '2 boutons primary'));
});

test('tokens : inventé = erreur, primitif = avertissement, privé = accepté', () => {
  const issues = checkTsx(
    `<div style={{ color: 'var(--color-nope)', background: 'var(--color-gray-500)', gap: 'var(--_x)' }} />`,
    manifest,
  );
  assert.ok(has(errors(issues), "--color-nope n'existe pas"));
  assert.ok(has(issues, '--color-gray-500 est un token PRIMITIF'));
  assert.equal(issues.length, 2);
});

test('CSS : applique les règles Stylelint du design system', async () => {
  const issues = await checkCss(
    '.a {\n  color: #fff;\n  padding: 13px;\n}\n',
    manifest,
    stylelintConfig,
    process.cwd(),
  );
  assert.ok(has(issues, 'Couleur en dur'));
  assert.ok(has(issues, 'padding'));
});

test('CSS : une propriété raccourcie ne produit pas de doublon', async () => {
  const issues = await checkCss('.a {\n  background: #fff;\n}\n', manifest, stylelintConfig, process.cwd());
  const messages = issues.map((i) => `${i.line}:${i.message}`);
  assert.equal(new Set(messages).size, messages.length);
});

test('CSS : un code qui utilise les tokens passe', async () => {
  const code = '.a {\n  color: var(--color-text-default);\n  padding: var(--space-4);\n}\n';
  assert.deepEqual(await checkCss(code, manifest, stylelintConfig, process.cwd()), []);
});
