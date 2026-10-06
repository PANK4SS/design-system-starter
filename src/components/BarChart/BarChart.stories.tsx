import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';

const mois = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

const meta = {
  title: 'Données/BarChart',
  component: BarChart,
  args: {
    title: 'Incidents par mois et par type',
    description: 'Premier semestre 2026, tous sites confondus. Les intrusions culminent en mars.',
    categoryLabel: 'Mois',
    categories: mois.slice(0, 6),
    series: [
      { name: 'Intrusion', values: [14, 18, 26, 19, 15, 12] },
      { name: 'Alarme technique', values: [22, 19, 17, 21, 24, 20] },
      { name: 'Badge refusé', values: [9, 11, 8, 12, 10, 7] },
    ],
    stacked: false,
    hideTitle: false,
    height: 280,
  },
  argTypes: {
    series: { control: 'object' },
    categories: { control: 'object' },
    formatValue: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Compare des **quantités par catégorie** (incidents par mois, alertes par site…), en barres groupées ou empilées.
Dessiné en SVG, il s'adapte à la largeur, se parcourt au clavier (flèches gauche/droite) et propose toujours un tableau « Voir les données ».
Les couleurs suivent un ordre fixe (5 maximum) ; au-delà, les séries suivantes sont regroupées dans « Autre ».

| À faire | À éviter |
|---|---|
| Une seule couleur quand il n'y a qu'une série | Une couleur différente par barre |
| \`stacked\` pour montrer la part de chaque type dans un total | Empiler des séries qui ne s'additionnent pas |
| 5 séries au plus, une légende (automatique dès 2 séries) | Plus de 5 couleurs, ou un deuxième axe Y |
| Une [StatTile](?path=/docs/données-stattile--docs) pour un chiffre unique | Un graphique à une seule barre |
`,
      },
    },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Groupe: Story = { name: 'Groupé' };

export const Empile: Story = {
  name: 'Empilé',
  args: {
    title: 'Alertes traitées par mois',
    description: 'Année 2026, répartition par origine de l’alerte.',
    categories: mois,
    stacked: true,
    series: [
      { name: 'Vidéosurveillance', values: [42, 38, 51, 47, 55, 61, 58, 49, 63, 57, 52, 60] },
      { name: 'Détection intrusion', values: [21, 25, 30, 22, 19, 24, 28, 31, 26, 23, 20, 18] },
      { name: 'Contrôle d’accès', values: [15, 12, 18, 16, 14, 11, 9, 10, 17, 19, 16, 14] },
      { name: 'Appel client', values: [8, 6, 9, 7, 10, 12, 11, 8, 9, 6, 7, 10] },
    ],
  },
};

export const UneSerie: Story = {
  name: 'Une seule série',
  args: {
    title: 'Incidents par site en septembre',
    description: 'Les sites lyonnais concentrent le plus d’incidents.',
    categoryLabel: 'Site',
    categories: ['Lyon', 'Marseille', 'Lille', 'Nantes', 'Bordeaux', 'Toulouse'],
    series: [{ name: 'Incidents', values: [31, 24, 18, 12, 15, 9] }],
  },
};

export const PlusDeCinqSeries: Story = {
  name: 'Plus de 5 séries (regroupées dans « Autre »)',
  args: {
    title: 'Incidents par région',
    description: 'Au-delà de 5 séries, les dernières sont additionnées dans « Autre ».',
    categories: ['T1', 'T2', 'T3'],
    categoryLabel: 'Trimestre',
    stacked: true,
    series: [
      { name: 'Île-de-France', values: [48, 52, 45] },
      { name: 'Auvergne-Rhône-Alpes', values: [33, 30, 36] },
      { name: 'Provence-Alpes-Côte d’Azur', values: [27, 29, 31] },
      { name: 'Hauts-de-France', values: [18, 21, 17] },
      { name: 'Occitanie', values: [12, 14, 11] },
      { name: 'Nouvelle-Aquitaine', values: [9, 8, 12] },
      { name: 'Grand Est', values: [7, 9, 6] },
    ],
  },
};

export const Etroit: Story = {
  name: 'Largeur réduite (mobile)',
  args: {
    title: 'Incidents par mois',
    description: 'Année 2026, tous sites confondus.',
    categories: mois,
    series: [{ name: 'Incidents', values: [45, 48, 51, 52, 49, 39, 41, 37, 44, 50, 46, 43] }],
  },
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <BarChart {...args} />
    </div>
  ),
};

export const TitreMasque: Story = {
  name: 'Titre masqué visuellement',
  args: { hideTitle: true },
};
