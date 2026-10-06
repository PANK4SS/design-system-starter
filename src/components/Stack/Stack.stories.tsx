import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

// Petite boîte de démonstration : elle rend l'espacement visible sans rien inventer
const boxStyle: CSSProperties = {
  padding: 'var(--space-3) var(--space-4)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-background-surface)',
  font: 'var(--typography-body-sm-font-size) var(--font-family-body)',
};

const Box = ({ children }: { children: string }) => <div style={boxStyle}>{children}</div>;

const meta = {
  title: 'Mise en page/Stack',
  component: Stack,
  args: {
    direction: 'column',
    gap: '4',
    wrap: false,
    children: [
      <Box key="1">Site de Lyon Part-Dieu</Box>,
      <Box key="2">Site de Marseille Euroméditerranée</Box>,
      <Box key="3">Site de Lille Europe</Box>,
    ],
  },
  argTypes: {
    direction: { control: 'inline-radio' },
    gap: { control: 'select' },
    align: { control: 'select' },
    justify: { control: 'select' },
    as: { control: false },
    children: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Primitive de **mise en page** : empile des éléments en ligne ou en colonne, avec un espacement issu des tokens \`space.*\`.

| À faire | À éviter |
|---|---|
| Un \`gap\` des tokens (\`2\`, \`4\`, \`6\`…) | Des marges ajoutées à la main sur chaque enfant |
| \`as="ul"\` quand le contenu est une liste | Une \`div\` pour une vraie liste d'éléments |
| \`wrap\` pour une rangée qui doit passer à la ligne sur mobile | Une rangée fixe qui déborde de l'écran |
| Imbriquer des Stack pour composer une page | Des valeurs en pixels dans le style des enfants |
`,
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colonne: Story = {};

export const Ligne: Story = {
  args: { direction: 'row', gap: '2', align: 'center' },
};

export const Espacements: Story = {
  render: (args) => (
    <Stack gap="6">
      {(['1', '2', '4', '8'] as const).map((gap) => (
        <Stack key={gap} gap="2">
          <span style={{ font: 'var(--typography-caption-font-size) var(--font-family-body)' }}>gap = {gap}</span>
          <Stack {...args} direction="row" gap={gap}>
            <Box>Agent A</Box>
            <Box>Agent B</Box>
            <Box>Agent C</Box>
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const RetourALaLigne: Story = {
  name: 'Retour à la ligne',
  args: {
    direction: 'row',
    gap: '2',
    wrap: true,
    children: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Bordeaux', 'Lille', 'Strasbourg', 'Rennes'].map(
      (ville) => <Box key={ville}>{`Site de ${ville}`}</Box>,
    ),
  },
};

export const EnListe: Story = {
  name: 'En liste (as="ul")',
  args: {
    as: 'ul',
    gap: '2',
    children: ['Ronde de nuit validée', 'Badge désactivé', 'Alarme acquittée'].map((texte) => (
      <li key={texte} style={boxStyle}>
        {texte}
      </li>
    )),
  },
};

export const Repartition: Story = {
  name: 'Répartition (justify="between")',
  args: {
    direction: 'row',
    justify: 'between',
    align: 'center',
    children: [<Box key="t">Alertes du jour</Box>, <Box key="a">12 en attente</Box>],
  },
};
