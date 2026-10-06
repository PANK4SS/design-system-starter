import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../Stack';
import { StatTile } from './StatTile';

const meta = {
  title: 'Données/StatTile',
  component: StatTile,
  args: {
    label: 'Incidents ouverts',
    value: '37',
    delta: { value: '+12 %', direction: 'up', tone: 'negative', period: 'vs septembre' },
    helperText: 'Tous sites confondus, mis à jour à 08:00',
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    helperText: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: `
Met en avant **un indicateur clé** (KPI) : un libellé, une grande valeur et, en option, son évolution sur une période nommée.
L'évolution est toujours dite par une icône et un texte (« En hausse »), jamais par la couleur seule.

| À faire | À éviter |
|---|---|
| Un libellé court en casse de phrase : « Incidents ouverts » | « INCIDENTS : » en majuscules avec deux-points |
| Nommer la période : « vs septembre » | Un « +12 % » sans point de comparaison |
| \`tone="negative"\` quand la hausse est une mauvaise nouvelle | Supposer que « hausse » = vert |
| Une rangée de 3 à 5 tuiles | Un graphique à une seule barre pour un seul chiffre |
`,
      },
    },
  },
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParDefaut: Story = { name: 'Par défaut' };

export const EvolutionPositive: Story = {
  name: 'Évolution positive',
  args: {
    label: 'Rondes effectuées',
    value: '1 284',
    delta: { value: '+8 %', direction: 'up', tone: 'positive', period: 'vs septembre' },
    helperText: undefined,
  },
};

export const Stable: Story = {
  args: {
    label: 'Temps moyen d’intervention',
    value: '6 min',
    delta: { value: '0 min', direction: 'flat', period: 'vs semaine dernière' },
    helperText: undefined,
  },
};

export const SansEvolution: Story = {
  name: 'Sans évolution',
  args: { label: 'Sites sous surveillance', value: '48', delta: undefined, helperText: 'Contrats actifs au 6 octobre' },
};

export const RangeeDeKPI: Story = {
  name: 'Rangée de KPI',
  parameters: { layout: 'padded' },
  render: () => (
    <Stack direction="row" gap="4" wrap>
      <StatTile
        style={{ flex: '1 1 14rem' }}
        label="Incidents ouverts"
        value="37"
        delta={{ value: '+12 %', direction: 'up', tone: 'negative', period: 'vs septembre' }}
      />
      <StatTile
        style={{ flex: '1 1 14rem' }}
        label="Alertes traitées"
        value="412"
        delta={{ value: '−4 %', direction: 'down', tone: 'neutral', period: 'vs septembre' }}
      />
      <StatTile
        style={{ flex: '1 1 14rem' }}
        label="Agents en service"
        value="126"
        delta={{ value: '+3', direction: 'up', tone: 'positive', period: 'vs hier' }}
      />
      <StatTile
        style={{ flex: '1 1 14rem' }}
        label="Taux de levée de doute"
        value="98,6 %"
        delta={{ value: '−0,4 pt', direction: 'down', tone: 'negative', period: 'vs septembre' }}
      />
    </Stack>
  ),
};
